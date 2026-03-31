#!/usr/bin/env node
/**
 * validate.cjs — i18n validation: missing, orphaned, untranslated keys
 *
 * Read-only — uses public CSV fetch. No service account needed.
 *
 * Usage: node validate.cjs [--cwd /path/to/project]
 *
 * Exit codes:
 *   0 — all valid (or only orphaned/untranslated warnings)
 *   1 — missing keys found (CI gate)
 *   2 — config error
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Allow --cwd override
const cwdIdx = process.argv.indexOf('--cwd');
const projectRoot = cwdIdx !== -1 ? path.resolve(process.argv[cwdIdx + 1]) : process.cwd();

const SCRIPTS_DIR = __dirname;
const { loadConfig } = require(path.join(SCRIPTS_DIR, 'env-config.cjs'));
const { fetchPublicTab } = require(path.join(SCRIPTS_DIR, 'sheets-client.cjs'));

// ─── 1. Load config (GOOGLE_SERVICE_ACCOUNT_KEY not required for validate) ──

let config;
try {
  const raw = loadConfig(path.join(projectRoot, '.env.local'));
  // Validate only the fields needed for read-only validation
  const missing = [];
  if (!raw.googleSheetId) missing.push('I18N_GOOGLE_SHEET_ID');
  if (!raw.messagesDir) missing.push('I18N_MESSAGES_DIR');
  if (!raw.locales.length) missing.push('I18N_LOCALES');
  if (missing.length) {
    throw new Error(`Missing required i18n config vars:\n${missing.map((v) => `  - ${v}`).join('\n')}\n\nSet these in .env.local or as environment variables.`);
  }
  config = raw;
} catch (err) {
  console.error(`\nConfig error: ${err.message}\n`);
  process.exit(2);
}

// ─── 2. Extract keys from codebase ──────────────────────────────────────────

const SKIP_DIRS = ['node_modules', '.next', 'dist', 'build', '.turbo', 'coverage'];
const SOURCE_EXTS = ['.ts', '.tsx', '.js', '.jsx'];

function* walkDir(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    if (SKIP_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkDir(fullPath);
    else if (SOURCE_EXTS.includes(path.extname(entry.name))) yield fullPath;
  }
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalize a raw key: replace dots with the configured separator (::).
 * Both namespace dots and sub-key dots mean nesting in next-intl.
 * e.g. 'Monitoring.Filter.State.title' → 'Monitoring::Filter::State::title'
 */
function normalizeKey(raw, separator) {
  return raw.split('.').join(separator);
}

/**
 * Strip single-line (//) and multi-line (/* ... *\/) comments from source.
 * Preserves line count so line numbers in errors remain accurate.
 */
function stripComments(src) {
  // Replace block comments with whitespace (preserve newlines for line count)
  let out = src.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  // Replace line comments
  out = out.replace(/\/\/[^\n]*/g, m => ' '.repeat(m.length));
  return out;
}

function extractKeysFromFile(filePath, separator) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const content = stripComments(raw);
  const keys = new Map();
  const relFile = path.relative(projectRoot, filePath);

  // ── Step 1: Track ALL const {varName} = useTranslations/getTranslations('NS') ──
  // Handles: useTranslations('NS'), useTranslations("NS"), useTranslations(), useTranslations('')
  const assignRe = /const\s+(\w+)\s*=\s*(?:useTranslations|getTranslations)\s*\(\s*(?:['"]([^'"]*)['"])?\s*\)/g;
  const varMap = new Map(); // varName → namespace string ('' if no-arg)
  let m;
  while ((m = assignRe.exec(content)) !== null) {
    varMap.set(m[1], m[2] ?? '');
  }

  // ── Step 2: For each known translation var, find all its call sites ──
  for (const [varName, ns] of varMap) {
    const callRe = new RegExp(`\\b${escapeRegex(varName)}\\s*\\(\\s*['"]([^'"]+)['"]`, 'g');
    while ((m = callRe.exec(content)) !== null) {
      const key = m[1];
      const combined = ns ? `${ns}.${key}` : key;
      const normalized = normalizeKey(combined, separator);
      const line = content.slice(0, m.index).split('\n').length;
      if (!keys.has(normalized)) keys.set(normalized, { file: relFile, line });
    }
  }

  // ── Step 3: Immediately invoked — useTranslations('NS')('key') ──
  const immediateRe = /(?:useTranslations|getTranslations)\s*\(\s*(?:['"]([^'"]*)['"])?\s*\)\s*\(\s*['"]([^'"]+)['"]/g;
  while ((m = immediateRe.exec(content)) !== null) {
    const ns = m[1] ?? '';
    const key = m[2];
    const combined = ns ? `${ns}.${key}` : key;
    const normalized = normalizeKey(combined, separator);
    const line = content.slice(0, m.index).split('\n').length;
    if (!keys.has(normalized)) keys.set(normalized, { file: relFile, line });
  }

  return keys;
}

function extractCodeKeys() {
  const scanRoots = ['apps', 'libs', 'src', 'app', 'pages', 'components']
    .map((d) => path.join(projectRoot, d))
    .filter(fs.existsSync);

  const codeKeys = new Map();
  for (const root of scanRoots) {
    for (const file of walkDir(root)) {
      for (const [key, loc] of extractKeysFromFile(file, config.keySeparator)) {
        if (!codeKeys.has(key)) codeKeys.set(key, loc);
      }
    }
  }
  return codeKeys;
}

// ─── 3. Read keys from Sheet (public CSV) ───────────────────────────────────

/**
 * Parse header row: find KEY column index and locale column indices.
 */
function parseHeaders(headers) {
  const keyIdx = headers.findIndex((h) => h === 'KEY') !== -1
    ? headers.findIndex((h) => h === 'KEY')
    : 0;
  const transOkIdx = headers.findIndex((h) => ['TRANS_OK', 'TransOK', 'Status'].includes(h));

  // Map locale column headers → their indices
  const localeColIndices = {};
  for (const colHeader of Object.keys(config.localeMap)) {
    const idx = headers.indexOf(colHeader);
    if (idx >= 0) localeColIndices[colHeader] = idx;
  }

  return { keyIdx, transOkIdx, localeColIndices };
}

/**
 * Derive tabs to scan from code key namespaces + existing messages JSON top-level keys.
 * In tabs mode, each namespace = a sheet tab.
 */
function deriveTabsFromCode(codeKeys) {
  const namespaces = new Set();
  for (const key of codeKeys.keys()) {
    const sep = config.keySeparator;
    const idx = key.indexOf(sep);
    if (idx > 0) namespaces.add(key.slice(0, idx));
  }
  return [...namespaces];
}

async function readSheetKeys(codeKeys) {
  const sheetKeys = new Map(); // key → { tab, rowNum, transOk }

  if (config.sheetMode === 'tabs') {
    // Derive tabs from code namespaces — no auth needed to list tabs
    const tabs = deriveTabsFromCode(codeKeys);
    if (config.fallbackSheetTab && !tabs.includes(config.fallbackSheetTab)) {
      tabs.push(config.fallbackSheetTab);
    }

    // Always include the fallback tab — its keys are fully-qualified (no tab prefix needed)
    if (config.fallbackSheetTab && !tabs.includes(config.fallbackSheetTab)) {
      tabs.push(config.fallbackSheetTab);
    }

    for (const tab of tabs) {
      const isFallback = tab === config.fallbackSheetTab;

      let rows;
      try {
        rows = await fetchPublicTab(config.googleSheetId, tab);
      } catch {
        // Tab may not exist yet — skip silently
        continue;
      }
      if (!rows.length) continue;

      const headers = rows[0].map((h) => String(h || '').trim());
      const { keyIdx, transOkIdx } = parseHeaders(headers);

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        const key = String(row[keyIdx] || '').trim();
        if (!key) continue;
        const transOk = transOkIdx >= 0 ? String(row[transOkIdx] || '').trim() : '';
        // Feature tabs: full key = tab::key (tab name is the namespace)
        // Fallback tab (Common): key already includes namespace — use as-is
        const fullKey = isFallback ? key : `${tab}${config.keySeparator}${key}`;
        sheetKeys.set(fullKey, { tab, rowNum: r + 1, transOk });
      }
    }
  } else {
    // Single mode: read the configured tab, filter by project column
    const rows = await fetchPublicTab(config.googleSheetId, config.sheetTab);
    if (!rows.length) return sheetKeys;

    const headers = rows[0].map((h) => String(h || '').trim());
    const { keyIdx, transOkIdx } = parseHeaders(headers);
    const projColIdx = config.projectColumn ? headers.indexOf(config.projectColumn) : -1;

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (projColIdx >= 0 && String(row[projColIdx] || '') !== config.projectValue) continue;
      const key = String(row[keyIdx] || '').trim();
      if (!key) continue;
      const transOk = transOkIdx >= 0 ? String(row[transOkIdx] || '').trim() : '';
      sheetKeys.set(key, { tab: config.sheetTab, rowNum: r + 1, transOk });
    }
  }

  return sheetKeys;
}

// ─── 4. Read Result tab for untranslated status ──────────────────────────────

async function readUntranslated() {
  const rows = await fetchPublicTab(config.googleSheetId, config.resultSheetTab);
  if (!rows.length) return [];

  const headers = rows[0].map((h) => String(h || '').trim());
  const { keyIdx, transOkIdx, localeColIndices } = parseHeaders(headers);
  const untranslated = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const key = String(row[keyIdx] || '').trim();
    if (!key) continue;

    const transOk = transOkIdx >= 0 ? String(row[transOkIdx] || '').trim() : '';
    const missingLocales = Object.entries(localeColIndices)
      .filter(([, idx]) => !String(row[idx] || '').trim())
      .map(([col]) => col);

    if (transOk === 'NO' || missingLocales.length > 0) {
      untranslated.push({ key, transOk, missingLocales });
    }
  }

  return untranslated;
}

// ─── 5. Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('\ni18n Validation Report');
  console.log('======================\n');

  process.stdout.write('Scanning codebase for translation keys... ');
  const codeKeys = extractCodeKeys();
  console.log(`found ${codeKeys.size} keys`);

  process.stdout.write('Reading keys from Google Sheet... ');
  let sheetKeys;
  try {
    sheetKeys = await readSheetKeys(codeKeys);
  } catch (err) {
    console.error(`\nFailed to read Google Sheet: ${err.message}`);
    process.exit(2);
  }
  console.log(`found ${sheetKeys.size} keys`);

  process.stdout.write('Checking Result tab for untranslated cells... ');
  let untranslated = [];
  try {
    untranslated = await readUntranslated();
  } catch (err) {
    console.warn(`warning: ${err.message}`);
  }
  console.log(`found ${untranslated.length} issues\n`);

  // Diffs — exclude malformed keys: empty suffix (ends with separator), or no content
  const sep = config.keySeparator;
  const missingKeys = [...codeKeys.entries()]
    .filter(([key]) => !sheetKeys.has(key))
    .filter(([key]) => !key.endsWith(sep) && key.trim().length > 0)
    .map(([key, loc]) => ({ key, file: loc.file, line: loc.line }));

  const orphanedKeys = [...sheetKeys.entries()]
    .filter(([key]) => !codeKeys.has(key))
    .map(([key, info]) => ({ key, tab: info.tab, rowNum: info.rowNum }));

  // Report
  if (missingKeys.length > 0) {
    console.log(`Missing keys (in code, not in Sheet): ${missingKeys.length}`);
    for (const { key, file, line } of missingKeys) {
      console.log(`  - ${key.padEnd(50)} ${file}:${line}`);
    }
    console.log();
  }

  if (orphanedKeys.length > 0) {
    const preview = orphanedKeys.slice(0, 20);
    console.log(`Orphaned keys (in Sheet, not in code): ${orphanedKeys.length}`);
    for (const { key, tab, rowNum } of preview) {
      console.log(`  - ${key.padEnd(50)} Tab: ${tab}, Row: ${rowNum}`);
    }
    if (orphanedKeys.length > 20) console.log(`  ... and ${orphanedKeys.length - 20} more`);
    console.log();
  }

  if (untranslated.length > 0) {
    console.log(`Untranslated cells: ${untranslated.length}`);
    for (const { key, transOk, missingLocales } of untranslated.slice(0, 20)) {
      const detail = transOk === 'NO' ? 'TRANS_OK=NO' : `missing: ${missingLocales.join(', ')}`;
      console.log(`  - ${key.padEnd(50)} ${detail}`);
    }
    if (untranslated.length > 20) console.log(`  ... and ${untranslated.length - 20} more`);
    console.log();
  }

  console.log('Summary:');
  console.log(`  Missing:      ${String(missingKeys.length).padStart(4)}${missingKeys.length > 0 ? '  ← BLOCKS PRODUCTION' : ''}`);
  console.log(`  Orphaned:     ${String(orphanedKeys.length).padStart(4)}  (cleanup candidates)`);
  console.log(`  Untranslated: ${String(untranslated.length).padStart(4)}`);
  console.log(`  Total keys:   ${String(codeKeys.size).padStart(4)} (code), ${sheetKeys.size} (sheet)`);

  if (!missingKeys.length && !orphanedKeys.length && !untranslated.length) {
    console.log('\nAll keys valid. No missing, orphaned, or untranslated entries.');
  }

  process.exit(missingKeys.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(`\nUnexpected error: ${err.message}`);
  process.exit(2);
});
