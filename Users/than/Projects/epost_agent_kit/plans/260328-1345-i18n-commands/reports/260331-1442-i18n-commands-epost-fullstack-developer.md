## Phase Implementation Report

- Phase: all-phases | Plan: plans/260328-1345-i18n-commands/plan.md | Status: completed

### Files Modified

**Created (packages — source of truth):**
- `packages/platform-web/skills/web-i18n/scripts/sheets-client.cjs`
- `packages/platform-web/skills/web-i18n/scripts/key-converter.cjs`
- `packages/platform-web/skills/web-i18n/scripts/env-config.cjs`
- `packages/platform-web/skills/web-i18n/scripts/tab-resolver.cjs`
- `packages/platform-web/skills/web-i18n/commands/i18n.md`
- `packages/platform-web/skills/web-i18n/commands/i18n-pull.md`
- `packages/platform-web/skills/web-i18n/commands/i18n-push.md`
- `packages/platform-web/skills/web-i18n/commands/i18n-validate.md`

**Created (mirrored to .claude/):**
- `.claude/skills/web-i18n/scripts/sheets-client.cjs`
- `.claude/skills/web-i18n/scripts/key-converter.cjs`
- `.claude/skills/web-i18n/scripts/env-config.cjs`
- `.claude/skills/web-i18n/scripts/tab-resolver.cjs`
- `.claude/commands/i18n.md`
- `.claude/commands/i18n-pull.md`
- `.claude/commands/i18n-push.md`
- `.claude/commands/i18n-validate.md`

**Updated:**
- `plans/260328-1345-i18n-commands/plan.md` — status: completed, phases: done

### Tasks Completed

- Phase 1: `sheets-client.cjs` (auth, readSheet, appendRows, getSheetTabs), `key-converter.cjs` (flatten/unflatten), `env-config.cjs` (loadConfig/validateConfig), `tab-resolver.cjs` (resolveTab/extractNamespace)
- Phase 2: `i18n-pull.md` — reads Result tab, groups by localeMap, unflattens, writes sorted JSON files
- Phase 3: `i18n-push.md` — scans code for t()/useTranslations() patterns, diffs against Sheet, AI-translates batches, appends rows respecting tab headers
- Phase 4: `i18n-validate.md` — three-category report (missing/orphaned/untranslated), exit 1 on missing keys for CI gate
- Main: `i18n.md` — router with status view (no args shows locale file health, setup hint if unconfigured)

### Tests Status

No automated tests written — command files are Claude instructions (Markdown), scripts are utility modules. Manual test required against real Sheet.

### Issues Encountered

None. All scripts are CommonJS, zero hardcoded values, googleapis auto-installed if missing.

### Next Steps

- Test `--pull` against a real Google Sheet with Result tab
- Verify key extraction regex coverage for edge cases (template literals, dynamic keys)
- Consider adding `--dry-run` flag to `--push` for preview without appending
