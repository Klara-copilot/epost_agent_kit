# /i18n --validate

Validate translation completeness: detect missing keys (code → Sheet), orphaned keys (Sheet → code), and untranslated cells.

Exits with code 1 if any **missing** keys found (CI gate).

## Steps

### 1. Load config

```javascript
const { loadConfig, validateConfig } = require('./scripts/env-config.cjs');
const config = loadConfig();
validateConfig(config);
```

### 2. Extract keys from codebase

Same logic as `--push` step 2:
- Scan `.ts`, `.tsx`, `.js`, `.jsx` files (exclude `node_modules`, `.next`, `dist`)
- Match `useTranslations('Namespace')` + `t('key')` → `Namespace::key`
- Match `getTranslations('Namespace')` the same way
- Collect unique keys into `codeKeys: Map<string, { file: string, line: number }>`

Track source location (file path + line number) for each key to include in the missing-keys report.

### 3. Read keys from Sheet

**Tabs mode** (`config.sheetMode === 'tabs'`):
- Get all tabs via `getSheetTabs`
- For each non-system tab (skip tabs starting with `_`), read all rows
- Row structure: `[key, en, de, fr, it, ..., TRANS_OK, Notes]` (first row = headers)
- Build: `sheetKeys: Map<string, { tab: string, row: number, transOk: string, localeCells: Record<string, string> }>`

**Single mode** (`config.sheetMode === 'single'`):
- Read `config.sheetTab`
- If `config.projectColumn` is set, filter rows where `projectColumn` matches `config.projectValue`
- Same output structure

### 4. Read Result tab for translation status

Read `config.resultSheetTab` tab (e.g., "Result").
For each row: check if any locale column is empty or `TRANS_OK` column is `NO`.

Build: `untranslatedKeys: Array<{ key, tab, missingLocales: string[] }>`

### 5. Compute diff

```javascript
// Missing: in code but not in Sheet
const missingKeys = [...codeKeys.entries()]
  .filter(([key]) => !sheetKeys.has(key))
  .map(([key, loc]) => ({ key, file: loc.file, line: loc.line }));

// Orphaned: in Sheet but not in code
const orphanedKeys = [...sheetKeys.entries()]
  .filter(([key]) => !codeKeys.has(key))
  .map(([key, info]) => ({ key, tab: info.tab, row: info.row }));
```

### 6. Print report

```
i18n Validation Report
======================

Missing keys (in code, not in Sheet): 3
  - Inbox::Messages::empty     src/features/inbox/Messages.tsx:42
  - Common::Button::cancel     src/components/Button.tsx:18
  - Dashboard::title           src/pages/Dashboard.tsx:7

Orphaned keys (in Sheet, not in code): 5
  - OldFeature::header         Tab: Legacy, Row: 23
  - OldFeature::body           Tab: Legacy, Row: 24
  [... truncated after 20, total: 5]

Untranslated cells: 2
  - Inbox::Messages::loading   missing: de, fr
  - Common::errors::network    TRANS_OK=NO

Summary:
  Missing:       3  ← BLOCKS PRODUCTION
  Orphaned:      5  (cleanup candidates)
  Untranslated:  2
  Total keys:   147 (code), 149 (sheet)
```

If no issues: print "All keys valid. No missing, orphaned, or untranslated entries."

### 7. Exit code

```javascript
if (missingKeys.length > 0) {
  process.exit(1); // CI gate — missing keys block production
}
// Orphaned and untranslated are warnings only
process.exit(0);
```
