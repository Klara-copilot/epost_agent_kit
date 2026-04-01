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

**Important**: Key extraction logic is identical to `validate.cjs` — see `validate.md` for full implementation details. This section summarizes the approach:

1. **Strip comments first** — remove `//` line comments and `/* */` block comments before scanning to avoid false positives from commented-out keys.

2. **Track ALL translation variable names** (not just `t`):
   - Match `const {anyVar} = useTranslations('NS')` or `getTranslations('NS')`
   - Example: `const btn = useTranslations('Button')` → track that `btn` refers to `Button` namespace
   - Example: `const t = useTranslations('Monitoring.Filter')` → track that `t` refers to `Monitoring.Filter` namespace

3. **Find all call sites for each tracked variable**: `btn('key')` patterns

4. **Handle immediately-invoked patterns**: `useTranslations('NS')('key')` and `getTranslations('NS')('key')`

5. **Normalize keys** — replace ALL dots with separator:
   ```javascript
   function normalizeKey(fullKey, separator = '::') {
     return fullKey.split('.').join(separator);
   }
   // e.g. 'Monitoring.Filter.State.title' → 'Monitoring::Filter::State::title'
   // e.g. 'Button.cancel' → 'Button::cancel'
   ```

6. **Filter malformed keys**: skip keys ending with separator or that are empty

Collect all unique keys into a `Set<string>`. For the complete implementation with line numbers and file tracking, see Step 2 in `validate.md`.

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
