# /i18n --pull

Fetch translations from the Google Sheet's Result tab and write locale JSON files.

Read-only operation — `GOOGLE_SERVICE_ACCOUNT_KEY` not required for public sheets.

## Steps

### 1. Load config

Run the env-config script to read configuration:

```javascript
const { loadConfig } = require('./scripts/env-config.cjs');
const config = loadConfig();
// Note: GOOGLE_SERVICE_ACCOUNT_KEY not required for --pull on public sheets.
// Use validateConfig(config) only if targeting a private sheet.
```

Config fields used:
- `config.googleSheetId` — Google Sheet ID
- `config.serviceAccountKeyPath` — path to service account JSON (private sheets only)
- `config.resultSheetTab` — tab name with completed translations (default: "Result")
- `config.localeMap` — map of sheet column header → JSON filename (e.g., `{ en: 'en', de: 'de' }`)
- `config.keySeparator` — key separator (default: `::`)
- `config.messagesDir` — output directory for locale JSON files

### 2. Authenticate (private sheets only)

For **public sheets**, skip authentication entirely — use `fetchPublicTab` directly:

```javascript
const { fetchPublicTab } = require('./scripts/sheets-client.cjs');
const rows = await fetchPublicTab(config.googleSheetId, config.resultSheetTab);
```

For **private sheets**, use the authenticated path instead:

```javascript
const { authenticate, readSheet } = require('./scripts/sheets-client.cjs');
const auth = authenticate(config.serviceAccountKeyPath);
const rows = await readSheet(auth, config.googleSheetId, `${config.resultSheetTab}!A1:ZZ`);
```

### 3. Read Result tab

`fetchPublicTab` returns rows as parsed CSV arrays.

- Row 0 = headers (see Step 4 for column format)
- Row 1+ = data rows

### 4. Parse headers

**Result tab column headers are file names, not locale codes:**

```
Result tab header row: KEY | en.json | de.json | fr.json | it.json
                                ↑ file names, NOT locale codes
```

Use `I18N_LOCALE_MAP` (e.g., `en:en,de_CH:de,...`) to map column header → JSON filename:

```javascript
const headers = rows[0]; // ['KEY', 'en.json', 'de.json', 'fr.json', ...]
const keyColIdx = headers.findIndex(h => h.toLowerCase() === 'key');
// Map each locale column header → { colIdx, filename }
const localeColumns = Object.entries(config.localeMap).map(([colHeader, filename]) => ({
  colHeader,
  filename,
  colIdx: headers.indexOf(colHeader),
})).filter(col => col.colIdx !== -1);
```

### 5. Build locale maps

For each data row (rows[1..]), extract key and locale values:

```javascript
const localeMaps = {}; // { filename: { flatKey: value } }
for (const row of rows.slice(1)) {
  const key = row[keyColIdx];
  if (!key || key.trim() === '') continue;
  for (const { colIdx, filename } of localeColumns) {
    if (!localeMaps[filename]) localeMaps[filename] = {};
    localeMaps[filename][key] = row[colIdx] || '';
  }
}
```

### 6. Unflatten and write

For each locale:

```javascript
const { unflatten } = require('./scripts/key-converter.cjs');
const fs = require('fs');
const path = require('path');

for (const [filename, flatMap] of Object.entries(localeMaps)) {
  const nested = unflatten(flatMap, config.keySeparator);
  // Sort top-level keys alphabetically
  const sorted = Object.fromEntries(Object.entries(nested).sort(([a], [b]) => a.localeCompare(b)));
  const outputPath = path.join(config.messagesDir, `${filename}.json`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
}
```

### 7. Report

Print summary:
- Files written: list each `{filename}.json`
- Total keys per locale
- Any locales skipped (column not found in sheet)

Example output:
```
Pulled translations from Sheet: "Result"

  en.json  — 142 keys
  de.json  — 142 keys
  fr.json  — 142 keys
  it.json  — 142 keys

Messages dir: messages/
```
