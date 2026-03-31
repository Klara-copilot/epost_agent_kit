---
title: "i18n Commands — Google Sheet Translation Sync"
description: "Generic Claude Code skill for syncing translations between Google Sheets and project JSON files with AI auto-translation"
status: completed
created: 2026-03-28
updated: 2026-03-31
effort: 8h
phases: 4
platforms: [web]
breaking: false
---

# i18n Commands — Google Sheet Translation Sync

## Summary

Build a `/i18n` Claude Code command with subcommands for syncing translations between a Google Sheet (source of truth) and project locale JSON files. All project config comes from env vars — zero hardcoded values.

## Command

`/i18n <subcommand>`

| Usage | What it does |
|-------|-------------|
| `/i18n --pull` | Fetch translated JSON from Sheet's Result tab → write to `messages/*.json` |
| `/i18n --push` | Detect new keys in code not in Sheet → add rows + AI auto-translate |
| `/i18n --validate` | Report missing, orphaned, and untranslated keys |
| `/i18n` (no args) | Status: last sync, untranslated count, key drift |

## Design Principles

1. **Generic** — no project logic in commands; all config via env
2. **One direction** — pull reads Sheet; push only ADDS new keys (never overwrites)
3. **Two sheet modes** — `tabs` (one tab per feature) or `single` (filter by column)
4. **AI translation** — push translates EN → other locales via Claude, marks `TRANS_OK: AI`

## Env Vars

```bash
# Required
I18N_GOOGLE_SHEET_ID=<sheet-id>
I18N_MESSAGES_DIR=<relative-path-to-messages-dir>
I18N_LOCALES=en,de,fr,it
GOOGLE_SERVICE_ACCOUNT_KEY=<path-to-service-account-json>

# Sheet structure
I18N_RESULT_SHEET_TAB=Result
I18N_KEY_SEPARATOR=::
I18N_LOCALE_MAP=en:en,de:de,fr:fr,it:it   # Sheet column header → JSON filename

# Sheet mode (choose one)
I18N_SHEET_MODE=tabs                        # "tabs" or "single"
I18N_FALLBACK_SHEET_TAB=Common             # tabs mode: fallback tab
# I18N_SHEET_TAB=Sheet1                    # single mode: tab name
# I18N_PROJECT_COLUMN=PROJECT              # single mode: filter column
# I18N_PROJECT_VALUE=my_project            # single mode: filter value
```

## Phases

| # | Phase | Effort | Status |
|---|-------|--------|--------|
| 1 | Core utilities — Sheets client, key flatten/unflatten, env reader | 2h | done |
| 2 | `--pull` command | 1.5h | done |
| 3 | `--push` command + AI translation | 3h | done |
| 4 | `--validate` command | 1.5h | done |

## Phase 1: Core Utilities

Location: `.claude/skills/web-i18n/scripts/`

- **sheets-client.cjs** — Google Sheets API auth (service account), read/write ranges
- **key-converter.cjs** — `Namespace::Key::sub` ↔ `{ Namespace: { Key: { sub: "value" } } }`
- **env-config.cjs** — Read + validate `I18N_*` env vars from `.env.local`
- **tab-resolver.cjs** (tabs mode) — Key namespace → sheet tab name

Dependencies: `googleapis` npm package

## Phase 2: `--pull`

1. Read `I18N_RESULT_SHEET_TAB` from Sheet
2. Parse each locale column
3. Unflatten keys → write `{I18N_MESSAGES_DIR}/{locale}.json`
4. Report: files updated, key count

## Phase 3: `--push` + AI Translation

1. Scan codebase for `t('key')` / `useTranslations('namespace')` → extract all keys
2. Read Sheet → existing keys
3. Diff → new keys (in code, not in Sheet)
4. For each new key:
   - Resolve tab (tabs mode: from key namespace; single mode: configured tab)
   - Claude translates EN → other locales
   - Append row: KEY | en | locale... | TRANS_OK=AI
5. Report: keys added, tabs affected

## Phase 4: `--validate`

1. Extract all keys from code
2. Read all keys from Sheet
3. Report three categories:
   - **Missing** — in code, not in Sheet (blocks production)
   - **Orphaned** — in Sheet, not in code (cleanup candidates)
   - **Untranslated** — TRANS_OK=NO or any locale column empty
4. Exit 1 if missing keys found (CI-compatible)

## Output Location

Commands: `.claude/commands/i18n.md`
Scripts: `.claude/skills/web-i18n/scripts/`

## Success Criteria

- [ ] `--pull` produces correct locale JSON files
- [ ] `--push` auto-detects tabs from key namespace (tabs mode)
- [ ] `--push` AI translations are coherent
- [ ] `--validate` zero false positives on missing keys
- [ ] Works with both `tabs` and `single` sheet modes
- [ ] Zero hardcoded project values
