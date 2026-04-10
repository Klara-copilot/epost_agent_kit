# /i18n --validate

Validate translation completeness: detect missing keys (code → Sheet), orphaned keys (Sheet → code), and untranslated cells.

Exits with code 1 if any **missing** keys found (CI gate). Read-only operation — no service account required for public sheets.

## Configuration

Config is loaded automatically from `.epost-kit.json` via `--cwd`. No `.env.local` needed — validate is read-only and uses public CSV fetch (no service account required).

## Steps

### 1. Load config

```javascript
const { loadConfig } = require('./scripts/env-config.cjs');
const config = loadConfig(projectRoot); // reads i18n.* from .epost-kit.json
// Validate read-only required fields:
if (!config.googleSheetId) throw new Error('i18n.googleSheetId required in .epost-kit.json');
if (!config.messagesDir) throw new Error('i18n.messagesDir required in .epost-kit.json');
if (!config.locales?.length) throw new Error('i18n.locales required in .epost-kit.json');
// NOTE: serviceAccountKeyPath not needed for --validate (public CSV fetch)
```

### 2. Extract keys from codebase

Scan `.ts`, `.tsx`, `.js`, `.jsx` files (exclude `node_modules`, `.next`, `dist`).

**Step 2a: Strip comments first** — prevents false positives from commented-out code

```javascript
function stripComments(content) {
  // Remove // line comments
  let result = content.replace(/\/\/.*$/gm, '');
  // Remove /* */ block comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  return result;
}

const stripped = stripComments(fileContent);
```

**Step 2b: Track ALL translation variable names** (not just `t`)

```javascript
// Pattern matches: const {anyVar} = useTranslations('NS') or getTranslations('NS')
const assignRe = /const\s+(\w+)\s*=\s*(?:useTranslations|getTranslations)\s*\(\s*(?:['"]([^'"]*)['"])?\s*\)/g;
const varMap = new Map(); // varName → namespace string

let match;
while ((match = assignRe.exec(stripped)) !== null) {
  const varName = match[1];
  const namespace = match[2] || ''; // namespace may be empty
  varMap.set(varName, namespace);
}
// e.g. const btn = useTranslations('Button') → varMap.set('btn', 'Button')
// e.g. const t = useTranslations('Monitoring.Filter') → varMap.set('t', 'Monitoring.Filter')
```

**Step 2c: Find all call sites for each tracked variable**

For each variable in `varMap`, search for `varName('key')` patterns and extract the key:

```javascript
const codeKeys = new Map(); // key → { file, line }

for (const [varName, namespace] of varMap) {
  // Match varName('key') or varName("key") call sites
  const callRe = new RegExp(`${varName}\\s*\\(\\s*['"](.*?)['"]\\s*\\)`, 'g');
  let match;
  while ((match = callRe.exec(stripped)) !== null) {
    const key = match[1];
    // Combine namespace + key and normalize
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const normalized = normalizeKey(fullKey, config.keySeparator);

    // Store with file + line info
    if (!codeKeys.has(normalized)) {
      const lineNum = fileContent.substring(0, match.index).split('\n').length;
      codeKeys.set(normalized, { file: filePath, line: lineNum });
    }
  }
}
```

**Step 2d: Handle immediately-invoked patterns**

```javascript
// Match useTranslations('NS')('key') or getTranslations('NS')('key')
const immediateRe = /(?:useTranslations|getTranslations)\s*\(\s*['"]([^'"]*)['"]?\s*\)\s*\(\s*['"]([^'"]*)['"]?\s*\)/g;
let match;
while ((match = immediateRe.exec(stripped)) !== null) {
  const namespace = match[1] || '';
  const key = match[2] || '';
  const fullKey = namespace ? `${namespace}.${key}` : key;
  const normalized = normalizeKey(fullKey, config.keySeparator);
  if (!codeKeys.has(normalized)) {
    const lineNum = fileContent.substring(0, match.index).split('\n').length;
    codeKeys.set(normalized, { file: filePath, line: lineNum });
  }
}
```

**Step 2e: Normalize keys — replace all dots with separator**

```javascript
function normalizeKey(fullKey, separator = '::') {
  // Replace ALL dots with separator
  return fullKey.split('.').join(separator);
}
// e.g. 'Monitoring.Filter.State.title' → 'Monitoring::Filter::State::title'
// e.g. 'Button.cancel' → 'Button::cancel'
```

**Step 2f: Filter malformed keys**

Skip keys that:
- End with the separator (e.g., `Button::` from `t('Button.')`)
- Are empty or only whitespace
- Come from template literals that couldn't be parsed

```javascript
const codeKeysCleaned = new Map();
for (const [key, loc] of codeKeys) {
  if (!key.endsWith(config.keySeparator) && key.trim().length > 0) {
    codeKeysCleaned.set(key, loc);
  }
}
```

**Final result**: `codeKeys: Map<string, { file, line }>`

### 3. Read keys from Sheet (public fetch, no auth)

```javascript
const { fetchPublicTab, getSheetTabs } = require('./scripts/sheets-client.cjs');
const sep = config.keySeparator || '::';
```

**Step 3a: Derive tabs to fetch from code keys**

```javascript
function deriveTabsFromCode(codeKeys, separator) {
  const tabs = new Set();
  for (const key of codeKeys.keys()) {
    const firstSegment = key.split(separator)[0];
    if (firstSegment) tabs.add(firstSegment);
  }
  return tabs;
}
const neededTabs = deriveTabsFromCode(codeKeys, sep);
```

**Step 3b: Get available sheet tabs**

```javascript
const availableTabs = await getSheetTabs(config.googleSheetId);
// Returns tab names as strings (public endpoint, no auth)
```

**Step 3c: Read each needed tab via public CSV fetch**

```javascript
const sheetKeys = new Set();

for (const tab of neededTabs) {
  if (!availableTabs.includes(tab)) {
    console.warn(`Tab "${tab}" not found in sheet`);
    continue;
  }

  const rows = await fetchPublicTab(config.googleSheetId, tab); // CSV export, no auth
  if (!rows || rows.length === 0) continue;

  // Row 0 = headers, find KEY column
  const headers = rows[0];
  const keyColIdx = headers.findIndex(h => h.toLowerCase() === 'key');
  if (keyColIdx === -1) continue;

  // Process data rows (row 1+)
  for (const row of rows.slice(1)) {
    const key = row[keyColIdx];
    if (!key || key.trim() === '') continue;

    // CRITICAL: key format differs by tab type
    const isFallback = (tab === config.fallbackSheetTab);

    // Feature tab (Monitoring, Smartsend, etc.):
    //   KEY column contains sub-key only (e.g., 'Table::sentDate')
    //   Full key = '{tab}::{key}' ← PREPEND tab name
    const fullKey = isFallback ? key : `${tab}${sep}${key}`;

    // Fallback tab (Common / config.fallbackSheetTab):
    //   KEY column contains fully-qualified key (e.g., 'Button::cancel')
    //   Full key = '{key}' as-is ← DON'T prepend tab name

    sheetKeys.add(fullKey);
  }
}
```

### 4. Read Result tab for translation status

```javascript
const resultTab = config.resultSheetTab || 'Result';
const resultRows = await fetchPublicTab(config.googleSheetId, resultTab);

if (!resultRows || resultRows.length === 0) {
  console.warn(`Result tab "${resultTab}" not found or empty`);
} else {
  const headers = resultRows[0];
  const keyColIdx = headers.findIndex(h => h.toLowerCase() === 'key');

  // Column headers are file names ('en.json', 'de.json'), not locale codes
  // Example: ['KEY', 'en.json', 'de.json', 'fr.json', 'it.json', 'TRANS_OK', 'Notes']

  // Build map of column header → column index for each locale
  const localeColIndices = Object.keys(config.localeMap).map(colHeader => ({
    colHeader,
    colIdx: headers.indexOf(colHeader),
  })).filter(col => col.colIdx !== -1);

  const untranslatedKeys = [];

  for (const row of resultRows.slice(1)) {
    const key = row[keyColIdx];
    if (!key || key.trim() === '') continue;

    // Check if any non-EN locale is empty
    const missingLocales = localeColIndices
      .filter(col => col.colHeader !== 'en.json') // Skip EN (source language)
      .filter(col => !row[col.colIdx] || row[col.colIdx].trim() === '')
      .map(col => col.colHeader);

    if (missingLocales.length > 0) {
      untranslatedKeys.push({ key, missingLocales });
    }
  }
}
```

### 5. Compute diff

```javascript
const sep = config.keySeparator || '::';

// Missing: in code but not in Sheet
const missingKeys = [...codeKeys.entries()]
  .filter(([key]) => !sheetKeys.has(key))
  .map(([key, loc]) => ({ key, file: loc.file, line: loc.line }));

// Orphaned: in Sheet but not in code
const orphanedKeys = [...sheetKeys].filter(k => !codeKeys.has(k));
```

### 6. Print report

```javascript
console.log('Validation results:\n');
console.log(`  Missing (in code, not in sheet): ${missingKeys.length} keys`);
if (missingKeys.length > 0) {
  missingKeys.forEach(({ key, file, line }) => {
    console.log(`    • ${key} (${file}:${line})`);
  });
}

console.log(`\n  Orphaned (in sheet, not in code): ${orphanedKeys.length} keys`);
if (orphanedKeys.length > 0 && orphanedKeys.length <= 20) {
  orphanedKeys.forEach(key => console.log(`    • ${key}`));
}

console.log(`\n  Untranslated (empty locale columns): ${untranslatedKeys.length} keys`);
if (untranslatedKeys.length > 0 && untranslatedKeys.length <= 20) {
  untranslatedKeys.forEach(({ key, missingLocales }) => {
    console.log(`    • ${key}: missing ${missingLocales.join(', ')}`);
  });
}
```

### 7. Exit code

```javascript
if (missingKeys.length > 0) {
  process.exit(1); // CI gate — missing keys block production
}
// Orphaned and untranslated are warnings only
process.exit(0);
```

## Notes

- **Missing keys exit 1** — CI gate. Production build blocks until resolved.
- **Orphaned keys are warnings** — common with dynamic keys from template literals.
- **Untranslated keys are warnings** — translators have time to complete.
- **No auth needed** — uses public CSV export, safe for CI environments.
