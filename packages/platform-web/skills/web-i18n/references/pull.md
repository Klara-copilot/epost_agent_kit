# /i18n --pull

Fetch translations from the Google Sheet's Result tab and write locale JSON files.

## Steps

### 1. Load config

Run the env-config script to read configuration:

```javascript
const { loadConfig, validateConfig } = require('./scripts/env-config.cjs');
const config = loadConfig();
validateConfig(config);
```

Config fields used:
- `config.serviceAccountKeyPath` — path to service account JSON
- `config.googleSheetId` — Google Sheet ID
- `config.resultSheetTab` — tab name with completed translations (default: "Result")
- `config.localeMap` — map of sheet column header → JSON filename (e.g., `{ en: 'en', de: 'de' }`)
- `config.keySeparator` — key separator (default: `::`)
- `config.messagesDir` — output directory for locale JSON files

### 2. Authenticate

```javascript
const { authenticate, readSheet } = require('./scripts/sheets-client.cjs');
const auth = authenticate(config.serviceAccountKeyPath);
```

### 3. Read Result tab

```javascript
const rows = await readSheet(auth, config.googleSheetId, `${config.resultSheetTab}!A1:ZZ`);
```

- Row 0 = headers: first column is `key`, remaining columns are locale headers (e.g., `en`, `de`, `fr`, `it`)
- Row 1+ = data rows

### 4. Parse headers

```javascript
const headers = rows[0]; // ['key', 'en', 'de', 'fr', 'it', ...]
const keyColIdx = headers.indexOf('key');
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
