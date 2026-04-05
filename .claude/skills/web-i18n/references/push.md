# --push

Detect translation keys in code that are missing from the Google Sheet, confirm with user, then append new rows with EN value only (other locales left empty for human translators).

## Orchestration Flow

`--push` is a two-step flow. Never run `push.cjs` without the dry-run step first.

### Step 1: Detect missing keys (dry-run)

```
node push.cjs --cwd <app-dir> --dry-run [--tab X]
```

The script:
1. Extracts all translation keys used in code (`.ts`, `.tsx`, `.js`, `.jsx`)
2. Reads existing keys from the Google Sheet
3. Diffs — finds keys in code not in sheet
4. Prints what would be pushed per tab

**Exit codes:**
- `0` — missing keys found, dry-run output shows the list
- `1` — nothing to push (all code keys already in sheet)
- `2` — config or auth error

### Step 2: Present and confirm

**If exit 1 (nothing to push):**
```
Sheet is up to date — no new keys to push.
Add translation keys in your code first, then run /i18n --push again.
```

**If exit 0 (keys found):**
Show the dry-run output to the user. Example:
```
New keys to push: <N>

  Tab: <TabName> (<n> rows)
    KEY="<Namespace::Key>"  EN="<value or (empty)>"
    ...

  Tab: <TabName> (<n> rows)
    KEY="<Namespace::Key>"  EN="<value or (empty)>"
    ...

Push these <N> keys to the sheet?
```

Ask user to confirm before proceeding.

### Step 3: Execute (only if user confirms)

```
node push.cjs --cwd <app-dir> [--tab X]
```

Appends rows to the sheet. EN values pre-filled from local `messages/en.json`. All other locale columns left empty — marked `TRANS_OK=NO` for human translators.

## Key Extraction (how code keys are found)

Same logic as `validate.cjs`. See `validate.md` Step 2 for full implementation details.

Summary:
1. Strip comments before scanning (avoid false positives)
2. Track all translation variable names: `const t = useTranslations('NS')` → `t` maps to `NS`
3. Find all call sites: `t('key')` → `NS::key`
4. Handle immediately-invoked: `useTranslations('NS')('key')`
5. Normalize keys: replace `.` with separator (`::`)
6. Filter malformed keys (empty, ends with separator)

## Sheet Write (step 3 only)

Rows appended to the correct tab per key namespace:

```javascript
function buildRow(headers, shortKey, enVal) {
  return headers.map(col => {
    if (col === 'key') return shortKey;
    if (col === 'en') return enVal;
    if (col === 'TRANS_OK') return 'NO';
    return ''; // all other locale columns — empty for translators
  });
}
```

- **Tabs mode**: namespace prefix stripped from key before writing (tab = namespace)
- **Single mode**: full key written to configured sheet tab

## Report (after successful push)

```
Pushed <N> keys to <n> tab(s)

  Tab "<TabName>":  <n> keys
  ...

Locales pending translation: <locale1>, <locale2>, ... (marked TRANS_OK=NO)
```
