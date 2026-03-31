# --push

Detect translation keys used in code but missing from the Google Sheet, and append new rows with EN value only (other locales left empty for human translators).

## Steps

### 1. Load config

```javascript
const { loadConfig, validateConfig } = require('./scripts/env-config.cjs');
const config = loadConfig();
validateConfig(config);
```

### 2. Extract keys from codebase

Scan all `.ts`, `.tsx`, `.js`, `.jsx` files (excluding `node_modules`, `.next`, `dist`).

> **Note**: Key extraction logic mirrors `validate.cjs` — reference that implementation as the source of truth.

For each file:

1. **Strip comments first** — remove `//` line comments and `/* */` block comments before scanning to avoid false positives from commented-out keys.

2. **Track ALL translation variable names** (not just `t`):
   - Match `const {anyVar} = useTranslations('NS')` or `getTranslations('NS')`
   - Build `varMap: Map<varName, namespace>`
   - e.g. `const btn = useTranslations('Button')` → `varMap.set('btn', 'Button')`

3. **Find calls for each tracked var**: `btn('key')` → namespace `Button`, key `key`

4. **Handle immediately-invoked**: `useTranslations('NS')('key')` → `NS::key`

5. **Normalize dots to `::` separator**: combine namespace + key then replace ALL `.` with `::`:
   ```javascript
   function normalizeKey(ns, key, sep) {
     const combined = ns ? `${ns}.${key}` : key;
     return combined.split('.').join(sep);
   }
   // e.g. ns='Monitoring.Filter', key='State.title' → 'Monitoring::Filter::State::title'
   ```

6. **Filter malformed keys**: skip keys ending with `::` or that are empty (from template literals or `t('')` calls).

Collect all unique keys into a `Set<string>`.

### 3. Authenticate + read existing keys

```javascript
const { authenticate, readSheet, getSheetTabs } = require('./scripts/sheets-client.cjs');
const auth = authenticate(config.serviceAccountKeyPath);
```

**Tabs mode** (`config.sheetMode === 'tabs'`):
- Get all tabs: `getSheetTabs(auth, config.googleSheetId)`
- For each tab, read column A (keys)

**Single mode** (`config.sheetMode === 'single'`):
- Read `config.sheetTab`, filter by `config.projectColumn` if set
- Collect column A (keys)

Build a `Set<string>` of existing sheet keys.

### 4. Diff — find new keys

```javascript
const newKeys = [...codeKeys].filter(k => !sheetKeys.has(k));
```

If `newKeys.length === 0`: print "No new keys found. Sheet is up to date." and exit.

### 5. Load EN values from local messages

```javascript
const { flatten } = require('./scripts/key-converter.cjs');
const enPath = path.join(config.messagesDir, 'en.json');
let enFlat = {};
if (fs.existsSync(enPath)) {
  enFlat = flatten(JSON.parse(fs.readFileSync(enPath, 'utf8')), config.keySeparator);
}
```

For each new key: `enValue = enFlat[key] || ''` (empty if not in local messages).

### 6. Resolve target tab per key

```javascript
const { resolveTab } = require('./scripts/tab-resolver.cjs');
const availableTabs = await getSheetTabs(auth, config.googleSheetId);
```

- **Tabs mode**: `tab = resolveTab(key, config.keySeparator, availableTabs, config.fallbackSheetTab)`
- **Single mode**: `tab = config.sheetTab`

Group keys by target tab.

### 7. Read headers from target tabs

```javascript
const headerRow = (await readSheet(auth, config.googleSheetId, `${tab}!1:1`))[0] || [];
// e.g. ['key', 'en', 'de', 'fr', 'it', 'TRANS_OK', 'Notes']
```

### 8. Append rows

Build each row aligned to tab header columns — locale columns left empty:

```javascript
const { appendRows } = require('./scripts/sheets-client.cjs');

function buildRow(headers, key, enVal) {
  return headers.map(col => {
    if (col === 'key') return key;
    if (col === 'en') return enVal;
    if (col === 'TRANS_OK') return 'NO';
    if (col === 'Notes') return '';
    return ''; // other locale columns — left for human translators
  });
}

await appendRows(auth, config.googleSheetId, tab, rows);
```

### 9. Report

```
Pushed 12 new keys to Sheet

  Tab "Inbox":    8 keys
  Tab "Common":   4 keys

Locales to translate: de, fr, it (marked TRANS_OK=NO)
```
