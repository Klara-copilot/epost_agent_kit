# i18n Google Sheet Sync Commands

**Date**: 2026-03-31
**Agent**: epost-fullstack-developer
**Epic**: web-i18n
**Plan**: plans/260328-1345-i18n-commands/

## What was implemented

Four Claude Code slash commands for syncing translations between Google Sheets and locale JSON files:
- `/i18n` — status view (health check on messages dir, setup hint if unconfigured)
- `/i18n --pull` — fetch Result tab → write `messages/*.json` files
- `/i18n --push` — scan code for new keys, AI-translate, append to Sheet
- `/i18n --validate` — three-category report (missing/orphaned/untranslated), exit 1 on missing keys

Four supporting CommonJS utility scripts in `packages/platform-web/skills/web-i18n/scripts/`:
- `sheets-client.cjs` — googleapis wrapper (authenticate, readSheet, appendRows, getSheetTabs)
- `key-converter.cjs` — flatten/unflatten nested objects with configurable separator
- `env-config.cjs` — parse `.env.local`, validate required I18N_* vars, return typed config
- `tab-resolver.cjs` — map key namespace → sheet tab name (tabs mode)

## Key decisions and why

- **Command files are Markdown, not scripts**: Claude Code slash commands are instruction documents Claude reads and follows step-by-step. The `.cjs` scripts hold the reusable logic; commands orchestrate them. This keeps commands human-readable and editable without touching Node.js code.
- **Zero hardcoded values**: Every project-specific value (sheet ID, locale list, messages dir) comes from env vars. The skill is truly generic.
- **googleapis auto-install**: Rather than failing hard if the package is missing, `sheets-client.cjs` runs `npm install googleapis --no-save` automatically. Consistent with CLI tool UX.
- **`--validate` exits 1 on missing keys**: Orphaned and untranslated are warnings; missing keys block production. This makes `--validate` a valid CI gate without noise.
- **Tabs vs single mode**: Sheet layout varies per project. Both modes supported via `I18N_SHEET_MODE` env var.

## What almost went wrong

- Commands directory (`packages/platform-web/skills/web-i18n/commands/`) didn't exist yet — had to create it alongside scripts. The plan spec listed both paths but the directory was new.
- The `.claude/commands/` directory also didn't exist — created alongside the mirror. If epost-kit init doesn't handle this automatically, the mirror step will need to be part of the install flow.
- [web-i18n skill] did not cover the Google Sheets sync workflow at all — the existing SKILL.md only covers next-intl usage patterns. These commands are an additive layer that required new scripts infrastructure.
