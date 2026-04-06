#!/usr/bin/env node
/**
 * push.cjs — Detect new keys in code not in Sheet → append rows with EN pre-filled
 *
 * Requires GOOGLE_SERVICE_ACCOUNT_KEY for write access.
 *
 * Usage: node push.cjs [--cwd /path/to/project] [--tab <TabName>] [--dry-run]
 *
 * --tab <TabName>   Scope push to a single namespace (e.g. --tab Monitoring)
 * --dry-run         Print what would be pushed, don't write to sheet
 *
 * Exit codes:
 *   0 — success (including dry-run)
 *   1 — nothing to push
 *   2 — config/auth error
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Parse argv
const cwdIdx = process.argv.indexOf('--cwd');
const projectRoot = cwdIdx !== -1 ? path.resolve(process.argv[cwdIdx + 1]) : process.cwd();

const tabIdx = process.argv.indexOf('--tab');
const tabFilter = tabIdx !== -1 ? process.argv[tabIdx + 1] : null;

const dryRun = process.argv.includes('--dry-run');

const SCRIPTS_DIR = __dirname;
const { loadConfig } = require(path.join(SCRIPTS_DIR, 'env-config.cjs'));
const { fetchPublicTab, authenticate, appendRows, getSheetTabs } = require(path.join(SCRIPTS_DIR, 'sheets-client.cjs'));
const { flatten } = require(path.join(SCRIPTS_DIR, 'key-converter.cjs'));
const { resolveTab, extractNamespace } = require(path.join(SCRIPTS_DIR, 'tab-resolver.cjs'));

// ─── 1. Load config ──────────────────────────────────────────────────────────

let config;
let messagesAbsDir; // resolved absolute path to messages dir

try {
  const raw = loadConfig(projectRoot);
  const missing = [];
  if (!raw.googleSheetId) missing.push('i18n.googleSheetId');
  if (!raw.messagesDir) missing.push('i18n.messagesDir');
  if (!raw.locales.length) missing.push('i18n.locales');
  if (!dryRun && !raw.serviceAccountKeyPath) missing.push('GOOGLE_SERVICE_ACCOUNT_KEY (in .env.local)');
  if (missing.length) {
    throw new Error(
      `Missing required i18n config:\n${missing.map((v) => `  - ${v}`).join('\n')}\n\nSet i18n.* fields in .epost-kit.json. Set GOOGLE_SERVICE_ACCOUNT_KEY in .env.local.`
    );
  }
  config = raw;

  // Resolve messagesDir — may be relative to monorepo root, not projectRoot
  const direct = path.resolve(projectRoot, raw.messagesDir);
  if (fs.existsSync(direct)) {
    messagesAbsDir = direct;
  } else {
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
    if (!found) messagesAbsDir = direct;
  }
} catch (err) {
  console.error(`\nConfig error: ${err.message}\n`);
  process.exit(2);
}

// ─── 2. Extract code keys (copied from validate.cjs) ─────────────────────────

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

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeKey(raw, separator) {
  return raw.split('.').join(separator);
}

function stripComments(src) {
  let out = src.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  out = out.replace(/\/\/[^\n]*/g, m => ' '.repeat(m.length));
  return out;
}

function extractKeysFromFile(filePath, separator) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const content = stripComments(raw);
  const keys = new Map();
  const relFile = path.relative(projectRoot, filePath);

  const assignRe = /const\s+(\w+)\s*=\s*(?:useTranslations|getTranslations)\s*\(\s*(?:['"]([^'"]*)['"])?\s*\)/g;
  const varMap = new Map();
  let m;
  while ((m = assignRe.exec(content)) !== null) {
    varMap.set(m[1], m[2] ?? '');
  }

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
  const sep = config.keySeparator;
  for (const root of scanRoots) {
    for (const file of walkDir(root)) {
      for (const [key, loc] of extractKeysFromFile(file, sep)) {
        if (tabFilter && !key.startsWith(`${tabFilter}${sep}`)) continue;
        if (!codeKeys.has(key)) codeKeys.set(key, loc);
      }
    }
  }
  return codeKeys;
}

// ─── 3. Read sheet keys (same as validate.cjs) ───────────────────────────────

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
  const sheetKeys = new Set();

  if (config.sheetMode === 'tabs') {
    let tabs = tabFilter
      ? [tabFilter]
      : deriveTabsFromCode(codeKeys);

    if (config.fallbackSheetTab && !tabs.includes(config.fallbackSheetTab)) {
      tabs.push(config.fallbackSheetTab);
    }

    for (const tab of tabs) {
      const isFallback = tab === config.fallbackSheetTab;
      let rows;
      try {
        rows = await fetchPublicTab(config.googleSheetId, tab);
      } catch {
        continue;
      }
      if (!rows.length) continue;

      const headers = rows[0].map((h) => String(h || '').trim());
      const { keyIdx } = parseHeaders(headers);

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        const key = String(row[keyIdx] || '').trim();
        if (!key) continue;
        const fullKey = isFallback ? key : `${tab}${config.keySeparator}${key}`;
        sheetKeys.add(fullKey);
      }
    }
  } else {
    const rows = await fetchPublicTab(config.googleSheetId, config.sheetTab);
    if (!rows.length) return sheetKeys;

    const headers = rows[0].map((h) => String(h || '').trim());
    const { keyIdx } = parseHeaders(headers);
    const projColIdx = config.projectColumn ? headers.indexOf(config.projectColumn) : -1;

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (projColIdx >= 0 && String(row[projColIdx] || '') !== config.projectValue) continue;
      const key = String(row[keyIdx] || '').trim();
      if (!key) continue;
      sheetKeys.add(key);
    }
  }

  return sheetKeys;
}

// ─── 4. Read EN values from messages/en.json ─────────────────────────────────

function readEnValues() {
  const enLocale = config.locales[0] || 'en';
  const enPath = path.join(messagesAbsDir, `${enLocale}.json`);
  if (!fs.existsSync(enPath)) {
    console.warn(`  Warning: ${enLocale}.json not found at ${enPath} — EN values will be empty`);
    return {};
  }
  try {
    const nested = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    return flatten(nested, config.keySeparator);
  } catch (err) {
    console.warn(`  Warning: could not parse ${enPath}: ${err.message}`);
    return {};
  }
}

// ─── 5. Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('\ni18n Push');
  console.log('=========');
  if (dryRun) console.log('DRY RUN — no changes will be written to the sheet');
  if (tabFilter) console.log(`Tab filter: ${tabFilter}`);
  console.log();

  // Extract code keys
  process.stdout.write('Scanning codebase for translation keys... ');
  const codeKeys = extractCodeKeys();
  console.log(`found ${codeKeys.size} keys`);

  // Read sheet keys
  process.stdout.write('Reading keys from Google Sheet... ');
  let sheetKeys;
  try {
    sheetKeys = await readSheetKeys(codeKeys);
  } catch (err) {
    console.error(`\nFailed to read Google Sheet: ${err.message}`);
    process.exit(2);
  }
  console.log(`found ${sheetKeys.size} keys`);

  // Diff
  const sep = config.keySeparator;
  const newKeys = [...codeKeys.keys()]
    .filter((key) => !sheetKeys.has(key))
    .filter((key) => !key.endsWith(sep) && key.trim().length > 0);

  if (!newKeys.length) {
    console.log('\nNothing to push — all code keys are in the sheet.');
    process.exit(1);
  }

  console.log(`\nNew keys to push: ${newKeys.length}`);
  for (const key of newKeys) {
    console.log(`  + ${key}`);
  }
  console.log();

  // Read EN values
  const enValues = readEnValues();

  // Group new keys by tab
  // For tabs mode: namespace = tab name; key written to sheet = key without namespace prefix
  // For single mode: write full key, use the configured sheetTab
  const byTab = {}; // tab name → [{ key, enValue }]

  if (config.sheetMode === 'tabs') {
    for (const key of newKeys) {
      const namespace = extractNamespace(key, sep);
      const tab = namespace;
      const shortKey = key.slice(namespace.length + sep.length); // strip "Monitoring::" prefix
      if (!byTab[tab]) byTab[tab] = [];
      byTab[tab].push({ fullKey: key, shortKey, enValue: enValues[key] || '' });
    }
  } else {
    const tab = config.sheetTab;
    byTab[tab] = newKeys.map((key) => ({ fullKey: key, shortKey: key, enValue: enValues[key] || '' }));
  }

  if (dryRun) {
    console.log('Dry run — would push the following rows:');
    for (const [tab, entries] of Object.entries(byTab)) {
      console.log(`\n  Tab: ${tab} (${entries.length} rows)`);
      for (const { shortKey, enValue } of entries) {
        console.log(`    KEY="${shortKey}"  EN="${enValue || '(empty)'}"`);
      }
    }
    console.log();
    process.exit(0);
  }

  // Authenticate and push
  let auth;
  try {
    auth = authenticate(config.serviceAccountKeyPath);
  } catch (err) {
    console.error(`\nAuth error: ${err.message}`);
    process.exit(2);
  }

  // Get available tabs to pass to resolveTab for fallback handling
  let availableTabs = [];
  try {
    availableTabs = await getSheetTabs(auth, config.googleSheetId);
  } catch (err) {
    console.warn(`  Warning: could not list sheet tabs: ${err.message}`);
  }

  let totalPushed = 0;
  const tabsPushed = [];

  for (const [tab, entries] of Object.entries(byTab)) {
    // Build rows: [KEY, EN_VALUE, '', '', ...] matching locale columns
    const rows = entries.map(({ shortKey, enValue }) => {
      // First column: KEY
      // Second column: EN value (if EN is the first locale in localeMap)
      // Remaining columns: empty (translators fill these in)
      const row = [shortKey];

      // Append values for each locale column in order (EN first, rest empty)
      for (const colHeader of Object.keys(config.localeMap)) {
        const locale = config.localeMap[colHeader];
        const isEn = locale === 'en' || locale === config.locales[0];
        row.push(isEn ? enValue : '');
      }

      return row;
    });

    // Resolve actual tab (falls back to fallbackSheetTab if tab doesn't exist)
    const targetTab = availableTabs.length > 0
      ? resolveTab(entries[0].fullKey, sep, availableTabs, config.fallbackSheetTab)
      : tab;

    try {
      await appendRows(auth, config.googleSheetId, targetTab, rows);
      totalPushed += entries.length;
      tabsPushed.push(`${targetTab} (${entries.length})`);
      console.log(`  Pushed ${entries.length} rows to tab "${targetTab}"`);
    } catch (err) {
      console.error(`  Failed to push to tab "${targetTab}": ${err.message}`);
    }
  }

  console.log(`\nPushed ${totalPushed} keys to ${tabsPushed.length} tab(s): ${tabsPushed.join(', ')}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(`\nUnexpected error: ${err.message}`);
  process.exit(2);
});
