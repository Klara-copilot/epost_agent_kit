/**
 * sheets-client.cjs — Google Sheets API wrapper
 * Uses googleapis package. Installs it automatically if not available.
 */

'use strict';

function ensureGoogleapis() {
  try {
    require.resolve('googleapis');
  } catch {
    const { execSync } = require('child_process');
    console.log('[sheets-client] Installing googleapis...');
    execSync('npm install googleapis --no-save', { stdio: 'inherit' });
  }
}

ensureGoogleapis();

const { google } = require('googleapis');

/**
 * Authenticate with Google Sheets using a service account key file.
 * @param {string} keyPath - Path to service account JSON file
 * @returns {object} Authenticated auth client
 */
function authenticate(keyPath) {
  const key = require(require('path').resolve(keyPath));
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth;
}

/**
 * Read rows from a sheet range.
 * @param {object} auth - Authenticated auth client
 * @param {string} sheetId - Google Sheet ID
 * @param {string} range - A1 notation range (e.g., "Result!A1:Z")
 * @returns {Promise<string[][]>} 2D array of cell values
 */
async function readSheet(auth, sheetId, range) {
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });
  return res.data.values || [];
}

/**
 * Append rows to a specific tab in the sheet.
 * @param {object} auth - Authenticated auth client
 * @param {string} sheetId - Google Sheet ID
 * @param {string} tab - Tab name to append to
 * @param {string[][]} rows - Rows to append
 * @returns {Promise<object>} API response
 */
async function appendRows(auth, sheetId, tab, rows) {
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
 * List all tab names in the spreadsheet.
 * @param {object} auth - Authenticated auth client
 * @param {string} sheetId - Google Sheet ID
 * @returns {Promise<string[]>} Array of tab names
 */
async function getSheetTabs(auth, sheetId) {
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: 'sheets.properties.title',
  });
  return (res.data.sheets || []).map((s) => s.properties.title);
}

module.exports = { authenticate, readSheet, appendRows, getSheetTabs };
