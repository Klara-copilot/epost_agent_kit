---
title: "web-i18n Skill — Validate Docs Update (Real-World Findings)"
description: "Update references and SKILL.md with correct implementation details discovered while building /i18n --validate on luz-epost"
status: completed
created: 2026-03-31
updated: 2026-03-31
effort: 80m
phases: 4
platforms: [web]
breaking: false
---

# web-i18n Skill — Validate Docs Update

## Summary

The `/i18n --validate` command was fully implemented and tested against the real luz-epost Google Sheet. Several incorrect assumptions in the reference docs were discovered. Scripts are already correct and in sync — this plan covers documentation updates only.

## What Was Discovered

### Sheet structure (not in docs)
1. **Feature tab keys**: KEY column = sub-key only (e.g. `Table::sentDate`). Full key = `{TabName}::{key}`.
2. **Fallback tab (Common) keys**: KEY column = fully-qualified key including namespace (e.g. `Button::cancel`). Tab name is NOT prepended.
3. **Dot normalization**: Code uses `.` for nesting (`Monitoring.Filter`), sheet uses `::`. Must normalize: `'Monitoring.Filter'` + `'State.title'` → `Monitoring::Filter::State::title`.
4. **Result tab column headers**: File names (`en.json`, `de.json`), not locale codes.

### Key extraction patterns (not in docs)
1. **All variable names tracked**: `const btn = useTranslations('Button')` → track `btn`, not just `t`.
2. **Comment stripping**: Must strip `//` and `/* */` before scanning to avoid false positives.
3. **Skip unreliable fallback**: When `t` is a prop (not from `useTranslations`), position-based namespace guessing is wrong — omit.
4. **Empty key filter**: Filter keys ending with `::` (malformed, from template literals or empty `t('')` calls).

### Auth requirement (wrong in docs)
- `GOOGLE_SERVICE_ACCOUNT_KEY` is NOT required for `--validate` or `--pull`.
- Public sheets use `fetchPublicTab()` (CSV export endpoint) — no auth needed.
- Only `--push` (write) needs service account.

## Phases

| # | Phase | Files | Effort | Status |
|---|-------|-------|--------|--------|
| 1 | Rewrite `references/validate.md` | validate.md | 45m | done |
| 2 | Update `references/pull.md` | pull.md | 15m | done |
| 3 | Update `SKILL.md` | SKILL.md | 10m | done |
| 4 | Update `references/push.md` | push.md | 10m | done |

**Total**: ~80 min

---

## Phase 1: Rewrite `references/validate.md`

**File**: `packages/platform-web/skills/web-i18n/references/validate.md`

### Step 1 (Config) — update required vars
- Remove `GOOGLE_SERVICE_ACCOUNT_KEY` from required vars. Only needed: `I18N_GOOGLE_SHEET_ID`, `I18N_MESSAGES_DIR`, `I18N_LOCALES`.
- Use partial validation: `loadConfig()` then check only the three required read-only vars manually (not `validateConfig()` which enforces service account).

### Step 2 (Extract keys from codebase) — rewrite
Replace current approach (only tracks `t`, no normalization) with:

```javascript
// 1. Strip comments first
const content = stripComments(raw); // removes // and /* */ comments

// 2. Track ALL translation variable names
// Pattern: const {anyVar} = useTranslations('NS') or useTranslations() or useTranslations('')
const assignRe = /const\s+(\w+)\s*=\s*(?:useTranslations|getTranslations)\s*\(\s*(?:['"]([^'"]*)['"])?\s*\)/g;
const varMap = new Map(); // varName → namespace string

// 3. For each tracked var, find calls: btn('key') → 'Button::key'
// 4. Handle immediately-invoked: useTranslations('NS')('key')
// 5. Normalize: combine ns + key, replace ALL dots with :: separator
function normalizeKey(raw, sep) { return raw.split('.').join(sep); }
const fullKey = normalizeKey(`${ns}.${key}`, '::');

// 6. Filter malformed: skip keys ending with separator or empty
```

### Step 3 (Read Sheet keys) — rewrite
Replace authenticated approach with public CSV fetch:

```javascript
// Use fetchPublicTab (no auth) from sheets-client.cjs
const rows = await fetchPublicTab(config.googleSheetId, tab);

// Derive tabs from code: extract first segment of each extracted code key
// e.g. 'Monitoring::Filter::last7Days' → tab 'Monitoring'
function deriveTabsFromCode(codeKeys) { ... }

// CRITICAL: feature tab vs fallback tab key format
// Feature tab (Monitoring, Smartsend, etc.):
//   KEY = sub-key only → full key = `{tab}::{key}` (PREPEND tab name)
// Fallback tab (Common, config.fallbackSheetTab):
//   KEY = fully-qualified (includes namespace) → full key = `{key}` (DON'T prepend)
const isFallback = (tab === config.fallbackSheetTab);
const fullKey = isFallback ? key : `${tab}${sep}${key}`;
```

### Step 4 (Result tab) — update column headers note
```
Result tab header row: KEY | en.json | de.json | fr.json | it.ch
                                                            ↑ file names, not locale codes
config.localeMap (I18N_LOCALE_MAP=en:en,de_CH:de,...) maps column header → JSON filename
Use localeMap keys to find column indices for untranslated check.
```

### Step 5 (Diff) — add malformed filter
```javascript
const missingKeys = [...codeKeys.entries()]
  .filter(([key]) => !sheetKeys.has(key))
  .filter(([key]) => !key.endsWith(sep) && key.trim().length > 0)  // ← ADD THIS
  .map(([key, loc]) => ({ key, file: loc.file, line: loc.line }));
```

---

## Phase 2: Update `references/pull.md`

**File**: `packages/platform-web/skills/web-i18n/references/pull.md`

### Changes:
1. **Remove mandatory auth step** — replace `authenticate()` + `readSheet()` with `fetchPublicTab()` for public sheets. Add note: "For private sheets, use `authenticate()` + `readSheet()` instead."
2. **Result tab column headers** — same as validate.md: headers are file names (`en.json`), not locale codes. `localeMap` maps them.
3. **Mark service account optional** — add note to config section: "`GOOGLE_SERVICE_ACCOUNT_KEY` not required for `--pull` on public sheets."

---

## Phase 3: Update `SKILL.md`

**File**: `packages/platform-web/skills/web-i18n/SKILL.md`

### Changes:
1. **Scripts table** — add `validate.cjs` row:

```markdown
| `validate.cjs` | Detect missing, orphaned, and untranslated keys (read-only, no auth needed) |
```

2. **Env vars section** — update `GOOGLE_SERVICE_ACCOUNT_KEY` comment:
```bash
# Write ops only (--push)
GOOGLE_SERVICE_ACCOUNT_KEY=<path-to-service-account-json>
```
Move it out of the `# Required` block into a new `# Write ops only` block.

---

## Phase 4: Update `references/push.md`

**File**: `packages/platform-web/skills/web-i18n/references/push.md`

### Changes:
1. **Step 2 (Extract keys)** — update to match the corrected extraction approach from Phase 1:
   - Track all variable names (not just `t`)
   - Strip comments first
   - Normalize dots to `::` separator
   - Filter malformed keys
   - Note: `validate.cjs` already implements this — can reference it directly

---

## Success Criteria

- [ ] `validate.md` reflects actual working implementation
- [ ] `pull.md` notes public fetch option and correct column headers
- [ ] `SKILL.md` lists `validate.cjs` in scripts table; service account marked as write-only
- [ ] `push.md` key extraction section matches actual implementation
- [ ] No hardcoded project values in any reference doc
