# /i18n --validate

Validate translation completeness: detect missing keys (code → Sheet), orphaned keys (Sheet → code), and untranslated cells.

Exits with code 1 if any **missing** keys found (CI gate).

Read-only operation — no service account required for public sheets.

## Steps

### 1. Load config

```javascript
const { loadConfig } = require('./scripts/env-config.cjs');
const config = loadConfig();
// Only validate read-only vars manually (validateConfig() enforces service account — not needed here):
if (!config.googleSheetId) throw new Error('I18N_GOOGLE_SHEET_ID required');
if (!config.messagesDir) throw new Error('I18N_MESSAGES_DIR required');
if (!config.locales || config.locales.length === 0) throw new Error('I18N_LOCALES required');
// NOTE: GOOGLE_SERVICE_ACCOUNT_KEY not needed for --validate (read-only, public sheets)
```

### 2. Extract keys from codebase

Scan `.ts`, `.tsx`, `.js`, `.jsx` files (exclude `node_modules`, `.next`, `dist`).

```javascript
// 1. Strip comments first (avoid false positives from commented-out code)
const content = stripComments(raw); // removes // line comments and /* */ block comments

// 2. Track ALL translation variable names (not just 't')
const assignRe = /const\s+(\w+)\s*=\s*(?:useTranslations|getTranslations)\s*\(\s*(?:['"]([^'"]*)['"])?\s*\)/g;
const varMap = new Map(); // varName → namespace string
// e.g. const btn = useTranslations('Button') → varMap.set('btn', 'Button')

// 3. For each tracked var, find calls: btn('key') → 'Button::key'
// 4. Handle immediately-invoked: useTranslations('NS')('key') → 'NS::key'

// 5. Normalize: combine ns + key, replace ALL dots with :: separator
function normalizeKey(ns, key, sep) {
  const combined = ns ? `${ns}.${key}` : key;
  return combined.split('.').join(sep);
}
// e.g. ns='Monitoring.Filter', key='State.title' → 'Monitoring::Filter::State::title'

// 6. Filter malformed: skip keys ending with separator or that are empty
// (caused by template literals or empty t('') calls)
```

Collect unique keys into `codeKeys: Map<string, { file: string, line: number }>`.

Track source location (file path + line number) for each key to include in the missing-keys report.

### 3. Read keys from Sheet (public fetch, no auth)

```javascript
const { fetchPublicTab, getSheetTabs } = require('./scripts/sheets-client.cjs');
const sep = config.keySeparator || '::';

// Derive which tabs to fetch from the code keys (first segment of each key)
function deriveTabsFromCode(codeKeys, sep) {
  const tabs = new Set();
  for (const key of codeKeys.keys()) {
    const first = key.split(sep)[0];
    if (first) tabs.add(first);
  }
  return tabs;
}

// Get available sheet tabs (public)
const availableTabs = await getSheetTabs(config.googleSheetId);
const neededTabs = deriveTabsFromCode(codeKeys, sep);

// For each needed tab that exists in sheet:
const rows = await fetchPublicTab(config.googleSheetId, tab); // CSV export, no auth
```

**CRITICAL: key format differs by tab type**

```javascript
const isFallback = (tab === config.fallbackSheetTab);

// Feature tab (Monitoring, Smartsend, etc.):
//   KEY column = sub-key only (e.g. 'Table::sentDate')
//   Full key = '{tab}::{key}'  ← PREPEND tab name
const fullKey = isFallback ? key : `${tab}${sep}${key}`;

// Fallback tab (Common / config.fallbackSheetTab):
//   KEY column = fully-qualified key including namespace (e.g. 'Button::cancel')
//   Full key = '{key}' as-is  ← DON'T prepend tab name
```

Build `sheetKeys: Set<string>` of all full keys read from the sheet.

### 4. Read Result tab for translation status

Read `config.resultSheetTab` (default: "Result") via `fetchPublicTab`.

**Column headers are file names, not locale codes:**

```
Result tab header row: KEY | en.json | de.json | fr.json | it.json
                                ↑ file names, NOT locale codes
```

`I18N_LOCALE_MAP=en:en,de_CH:de,...` maps column header → JSON filename.
Use `localeMap` keys to find column indices for the untranslated check.

```javascript
// Map localeMap keys (column headers) to their column indices
const localeColIndices = Object.keys(config.localeMap).map(colHeader => ({
  colHeader,
  colIdx: headers.indexOf(colHeader),
})).filter(col => col.colIdx !== -1);

// A key is untranslated if any non-EN locale column is empty
```

Build `untranslatedKeys: Array<{ key, missingLocales: string[] }>`.

### 5. Compute diff

```javascript
const sep = config.keySeparator || '::';

// Missing: in code but not in Sheet
const missingKeys = [...codeKeys.entries()]
  .filter(([key]) => !sheetKeys.has(key))
  .filter(([key]) => !key.endsWith(sep) && key.trim().length > 0) // filter malformed
  .map(([key, loc]) => ({ key, file: loc.file, line: loc.line }));

// Orphaned: in Sheet but not in code
const orphanedKeys = [...sheetKeys].filter(k => !codeKeys.has(k));
```

### 6. Print report

```
Validation results:
  Missing (in code, not in sheet): N keys
  Orphaned (in sheet, not in code): N keys
  Untranslated (empty locale columns): N keys
```

Detailed output per category with file + line for missing keys.

### 7. Exit code

```javascript
if (missingKeys.length > 0) {
  process.exit(1); // CI gate — missing keys block production
}
// Orphaned and untranslated are warnings only
process.exit(0);
```
