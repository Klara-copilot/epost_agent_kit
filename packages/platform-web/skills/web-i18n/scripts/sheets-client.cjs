/**
 * sheets-client.cjs — Google Sheets API wrapper
 *
 * Read-only (validate, pull): uses public CSV export — no auth required if sheet is public.
 * Write (push): requires service account JSON key via authenticate().
 */

'use strict';

const https = require('https');

// ─── Public read (no auth) ───────────────────────────────────────────────────

/**
 * Fetch a tab from a public Google Sheet as CSV rows.
 * Uses the gviz/tq endpoint — works for any "anyone with link can view" sheet.
 *
 * @param {string} sheetId - Google Sheet ID
 * @param {string} tabName - Tab (sheet) name
 * @returns {Promise<string[][]>} 2D array of cell values
 */
function fetchPublicTab(sheetId, tabName) {
  return new Promise((resolve, reject) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect (rare but possible)
        https.get(res.headers.location, handleResponse);
        return;
      }
      handleResponse(res);

      function handleResponse(res) {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} fetching tab "${tabName}"`));
          return;
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(parseCsv(data)));
        res.on('error', reject);
      }
    }).on('error', reject);
  });
}

/**
 * Fetch all tab names from a public Google Sheet.
 * Uses the gviz/tq JSON endpoint.
 *
 * @param {string} sheetId - Google Sheet ID
 * @returns {Promise<string[]>} Array of tab names
 */
function fetchPublicTabs(sheetId) {
  return new Promise((resolve, reject) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        // Response is wrapped: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
        const match = data.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\)/);
        if (!match) {
          reject(new Error('Could not parse sheet metadata response'));
          return;
        }
        try {
          const json = JSON.parse(match[1]);
          // Sheet names aren't in this response — fall back to reading sheet metadata via sheets API
          // For public sheets without auth, we can't easily list tabs. Return empty to signal fallback.
          resolve([]);
        } catch (e) {
          reject(e);
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Parse CSV string into 2D array, handling quoted fields with commas/newlines.
 * @param {string} csv
 * @returns {string[][]}
 */
function parseCsv(csv) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    const next = csv[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field);
        field = '';
      } else if (ch === '\r' && next === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        i++;
      } else if (ch === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else {
        field += ch;
      }
    }
  }

  if (field || row.length) {
    row.push(field);
    if (row.some((f) => f !== '')) rows.push(row);
  }

  return rows;
}

// ─── Authenticated write (service account) ───────────────────────────────────

function ensureGoogleapis() {
  try {
    require.resolve('googleapis');
  } catch {
    const { execSync } = require('child_process');
    console.log('[sheets-client] Installing googleapis...');
    execSync('npm install googleapis --no-save', { stdio: 'inherit' });
  }
}

/**
 * Authenticate with Google Sheets using a service account key file.
 * Only needed for write operations (--push).
 *
 * @param {string} keyPath - Path to service account JSON file
 * @returns {object} Authenticated auth client
 */
function authenticate(keyPath) {
  ensureGoogleapis();
  const { google } = require('googleapis');
  const key = require(require('path').resolve(keyPath));
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth;
}

/**
 * Read rows from a sheet range (authenticated).
 * @param {object} auth - Authenticated auth client
 * @param {string} sheetId
 * @param {string} range - A1 notation (e.g., "Result!A1:Z")
 * @returns {Promise<string[][]>}
 */
async function readSheet(auth, sheetId, range) {
  ensureGoogleapis();
  const { google } = require('googleapis');
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range });
  return res.data.values || [];
}

/**
 * Append rows to a tab (authenticated, write).
 * @param {object} auth
 * @param {string} sheetId
 * @param {string} tab
 * @param {string[][]} rows
 */
async function appendRows(auth, sheetId, tab, rows) {
  ensureGoogleapis();
  const { google } = require('googleapis');
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tab}!A1`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: rows },
  });
  return res.data;
}

/**
 * List all tab names (authenticated).
 * @param {object} auth
 * @param {string} sheetId
 * @returns {Promise<string[]>}
 */
async function getSheetTabs(auth, sheetId) {
  ensureGoogleapis();
  const { google } = require('googleapis');
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.get({ spreadsheetId: sheetId, fields: 'sheets.properties.title' });
  return (res.data.sheets || []).map((s) => s.properties.title);
}

module.exports = {
  // Public read (no auth needed)
  fetchPublicTab,
  fetchPublicTabs,
  // Authenticated (service account — write ops)
  authenticate,
  readSheet,
  appendRows,
  getSheetTabs,
};
