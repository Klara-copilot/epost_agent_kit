#!/usr/bin/env node
/**
 * pull.cjs — Fetch translations from Sheet source tabs → write messages/*.json
 *
 * Read-only — uses public CSV fetch. No auth required.
 *
 * Reads from the same source tabs as validate.cjs (Monitoring, Common, etc.),
 * which contain KEY + per-locale columns (en, de_CH, fr_CH, it_CH).
 *
 * Usage: node pull.cjs [--cwd /path/to/project] [--tab <TabName>]
 *
 * --tab <TabName>  Pull only the specified namespace/tab (e.g. --tab Monitoring).
 *                  Merges into existing messages/*.json — does NOT overwrite the whole file.
 *
 * Exit codes:
 *   0 — success
 *   2 — config error
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Parse argv
const cwdIdx = process.argv.indexOf('--cwd');
const projectRoot = cwdIdx !== -1 ? path.resolve(process.argv[cwdIdx + 1]) : process.cwd();

const tabIdx = process.argv.indexOf('--tab');
const tabFilter = tabIdx !== -1 ? process.argv[tabIdx + 1] : null;

const SCRIPTS_DIR = __dirname;
const { loadConfig } = require(path.join(SCRIPTS_DIR, 'env-config.cjs'));
const { fetchPublicTab } = require(path.join(SCRIPTS_DIR, 'sheets-client.cjs'));
const { unflatten } = require(path.join(SCRIPTS_DIR, 'key-converter.cjs'));

// ─── 1. Load config ──────────────────────────────────────────────────────────

let config;
let messagesAbsDir; // resolved absolute path to messages dir

try {
  const raw = loadConfig(path.join(projectRoot, '.env.local'));
  const missing = [];
  if (!raw.googleSheetId) missing.push('I18N_GOOGLE_SHEET_ID');
  if (!raw.messagesDir) missing.push('I18N_MESSAGES_DIR');
  if (!raw.locales.length) missing.push('I18N_LOCALES');
  if (missing.length) {
    throw new Error(
      `Missing required i18n config vars:\n${missing.map((v) => `  - ${v}`).join('\n')}\n\nSet these in .env.local or as environment variables.`
    );
  }
  config = raw;

  // messagesDir may be relative to monorepo root, not projectRoot.
  // Try: projectRoot/messagesDir first, then walk up until we find it.
  const direct = path.resolve(projectRoot, raw.messagesDir);
  if (fs.existsSync(direct)) {
    messagesAbsDir = direct;
  } else {
    // Walk up from projectRoot to find the base that makes messagesDir resolve
    let base = projectRoot;
    let found = false;
    for (let i = 0; i < 5; i++) {
      base = path.dirname(base);
      const candidate = path.resolve(base, raw.messagesDir);
      if (fs.existsSync(candidate)) {
        messagesAbsDir = candidate;
        found = true;
        break;
      }
    }
    if (!found) {
      // Directory doesn't exist yet — create it relative to projectRoot
      messagesAbsDir = direct;
    }
  }
} catch (err) {
  console.error(`\nConfig error: ${err.message}\n`);
  process.exit(2);
}

// ─── 2. Parse header row ─────────────────────────────────────────────────────

/**
 * Parse header row: find KEY column index and locale column indices.
 * Returns { keyIdx, localeColIndices: { 'en': 1, 'de_CH': 2, ... } }
 * Uses config.localeMap keys (column header names) to find column indices.
 */
function parseHeaders(headers) {
  const keyIdx = headers.findIndex((h) => h === 'KEY') !== -1
    ? headers.findIndex((h) => h === 'KEY')
    : 0;

  const localeColIndices = {};
  for (const colHeader of Object.keys(config.localeMap)) {
    const idx = headers.indexOf(colHeader);
    if (idx >= 0) localeColIndices[colHeader] = idx;
  }

  return { keyIdx, localeColIndices };
}

// ─── 3. Deep merge ───────────────────────────────────────────────────────────

function deepMerge(base, patch) {
  const result = Object.assign({}, base);
  for (const [k, v] of Object.entries(patch)) {
    if (
      v !== null &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      typeof result[k] === 'object' &&
      result[k] !== null &&
      !Array.isArray(result[k])
    ) {
      result[k] = deepMerge(result[k], v);
    } else {
      result[k] = v;
    }
  }
  return result;
}

// ─── 4. Fetch translations from source tabs ──────────────────────────────────

/**
 * Fetch all translations from the sheet source tabs.
 * In tabs mode: each tab is a namespace. Keys are stored as short keys (no namespace prefix)
 * in the sheet, and we reconstruct the full flat key as `{tab}{sep}{shortKey}`.
 * In single mode: read the configured tab, filter by project column.
 *
 * Returns: { en: { 'Monitoring::title': 'Monitoring', ... }, de: { ... }, ... }
 */
async function fetchTranslations() {
  // byLocale: locale code → flat key map { fullKey: value }
  const byLocale = {};
  const sep = config.keySeparator;

  if (config.sheetMode === 'tabs') {
    // Determine which tabs to fetch
    let tabs;
    if (tabFilter) {
      tabs = [tabFilter];
    } else {
      // Fetch all known namespace tabs. We can't list tabs without auth, so
      // we derive them from existing messages/en.json top-level keys + Common fallback.
      tabs = deriveTabsFromMessages();
      if (config.fallbackSheetTab && !tabs.includes(config.fallbackSheetTab)) {
        tabs.push(config.fallbackSheetTab);
      }
    }

    // Always include Common fallback if not explicitly filtering to another tab
    if (!tabFilter && config.fallbackSheetTab && !tabs.includes(config.fallbackSheetTab)) {
      tabs.push(config.fallbackSheetTab);
    }

    for (const tab of tabs) {
      const isFallback = tab === config.fallbackSheetTab;
      let rows;
      try {
        rows = await fetchPublicTab(config.googleSheetId, tab);
      } catch {
        continue; // tab not found — silently skip
      }
      if (!rows.length) continue;
      if (rows.length > 1) {
        process.stdout.write(`  Tab "${tab}": ${rows.length - 1} rows\n`);
      }

      const headers = rows[0].map((h) => String(h || '').trim());
      const { keyIdx, localeColIndices } = parseHeaders(headers);

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        const shortKey = String(row[keyIdx] || '').trim();
        if (!shortKey) continue;

        // Full key: fallback tab keys already include namespace; feature tab keys need prefix
        const fullKey = isFallback ? shortKey : `${tab}${sep}${shortKey}`;

        for (const [colHeader, colIdx] of Object.entries(localeColIndices)) {
          const locale = config.localeMap[colHeader];
          if (!locale) continue;
          const value = String(row[colIdx] || '').trim();
          if (!byLocale[locale]) byLocale[locale] = {};
          byLocale[locale][fullKey] = value;
        }
      }
    }
  } else {
    // Single mode
    const rows = await fetchPublicTab(config.googleSheetId, config.sheetTab);
    if (!rows.length) return byLocale;

    const headers = rows[0].map((h) => String(h || '').trim());
    const { keyIdx, localeColIndices } = parseHeaders(headers);
    const projColIdx = config.projectColumn ? headers.indexOf(config.projectColumn) : -1;

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (projColIdx >= 0 && String(row[projColIdx] || '') !== config.projectValue) continue;
      const key = String(row[keyIdx] || '').trim();
      if (!key) continue;

      for (const [colHeader, colIdx] of Object.entries(localeColIndices)) {
        const locale = config.localeMap[colHeader];
        if (!locale) continue;
        const value = String(row[colIdx] || '').trim();
        if (!byLocale[locale]) byLocale[locale] = {};
        byLocale[locale][key] = value;
      }
    }
  }

  return byLocale;
}

/**
 * Derive namespace tabs from existing messages/en.json top-level keys.
 * Falls back to empty array if file doesn't exist.
 */
function deriveTabsFromMessages() {
  const enLocale = config.locales[0] || 'en';
  const enPath = path.join(messagesAbsDir, `${enLocale}.json`);
  if (!fs.existsSync(enPath)) return [];
  try {
    const nested = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    return Object.keys(nested);
  } catch {
    return [];
  }
}

// ─── 5. Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('\ni18n Pull');
  console.log('=========');
  if (tabFilter) console.log(`Tab filter: ${tabFilter}\n`);
  else console.log();

  console.log('Fetching translations from sheet...');
  let byLocale;
  try {
    byLocale = await fetchTranslations();
  } catch (err) {
    console.error(`\nFailed to fetch translations: ${err.message}`);
    process.exit(2);
  }

  const totalKeys = Object.values(byLocale)[0]
    ? Object.keys(Object.values(byLocale)[0]).length
    : 0;

  if (!totalKeys) {
    const msg = tabFilter
      ? `No keys found for tab "${tabFilter}"`
      : 'No translation rows found in sheet';
    console.log(`\n${msg}`);
    process.exit(0);
  }

  // Ensure messages directory exists
  if (!fs.existsSync(messagesAbsDir)) {
    fs.mkdirSync(messagesAbsDir, { recursive: true });
  }

  const sep = config.keySeparator;
  const writtenFiles = [];

  for (const locale of config.locales) {
    const flatTranslations = byLocale[locale] || {};
    const nestedPatch = unflatten(flatTranslations, sep);

    const outPath = path.join(messagesAbsDir, `${locale}.json`);

    let finalJson;
    if (tabFilter) {
      // Partial update: read existing file, replace only the tab's namespace subtree
      let existing = {};
      if (fs.existsSync(outPath)) {
        try {
          existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
        } catch (err) {
          console.warn(`  Warning: could not parse ${outPath}: ${err.message} — will overwrite namespace`);
        }
      }
      finalJson = deepMerge(existing, nestedPatch);
    } else {
      // Full pull: write the complete JSON
      finalJson = nestedPatch;
    }

    fs.writeFileSync(outPath, JSON.stringify(finalJson, null, 2) + '\n', 'utf8');
    writtenFiles.push(outPath);
  }

  console.log(`\nWritten ${totalKeys} keys for ${config.locales.length} locales:`);
  for (const f of writtenFiles) {
    console.log(`  ${path.relative(projectRoot, f)}`);
  }
  console.log();

  process.exit(0);
}

main().catch((err) => {
  console.error(`\nUnexpected error: ${err.message}`);
  process.exit(2);
});
