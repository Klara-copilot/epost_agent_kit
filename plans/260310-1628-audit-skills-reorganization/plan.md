---
title: "Audit Skills References Reorganization"
status: completed
created: 2026-03-10
updated: 2026-03-10
effort: 1h
phases: 2
platforms: [all]
breaking: false
---

# Audit Skills References Reorganization

## Summary

Rename files in `packages/core/skills/audit/references/` to be self-documenting using `{domain}-{function}` prefix convention. No subdirectories — all files stay flat. Skills system does not support subdirectory grouping.

## Constraint

**No subdirectories.** Files must remain flat in `references/`. Grouping is achieved by naming prefix only.

## Rename Map

All files stay in `packages/core/skills/audit/references/`. Subdirs rejected.

| Old name | New name | Domain |
|----------|----------|--------|
| `ui.md` | `ui-workflow.md` | ui |
| `checklist-web.md` | `ui-checklist-web-atoms.md` | ui |
| `checklist-web-organism.md` | `ui-checklist-web-organisms.md` | ui |
| `ui-known-findings-schema.md` | `ui-findings-schema.md` | ui |
| `close-ui.md` | `ui-close.md` | ui |
| `a11y.md` | `a11y-workflow.md` | a11y |
| `ios-audit-mode.md` | `a11y-checklist-ios.md` | a11y |
| `android-audit-mode.md` | `a11y-checklist-android.md` | a11y |
| `close-a11y.md` | `a11y-close.md` | a11y |
| `audit-report-schema.md` | `finding-schema.md` | shared |

**Unchanged** (names already clear): `output-contract.md`, `delegation-templates.md`, `report-template.md`, `session-json-schema.md`

## Files with Cross-References to Update

After renaming, grep and fix all references to old paths in:

| File | Old refs it contains |
|------|---------------------|
| `audit/SKILL.md` | `references/ui.md`, `references/a11y.md`, `references/close-a11y.md`, `references/close-ui.md` |
| `audit/references/ui-workflow.md` (new) | `references/checklist-web.md`, `references/checklist-web-organism.md`, `references/ui-known-findings-schema.md`, `audit-report-schema.md` |
| `audit/references/a11y-workflow.md` (new) | `references/ios-audit-mode.md`, `references/android-audit-mode.md` |
| `audit/references/delegation-templates.md` | `references/ui.md`, `references/a11y.md`, `audit/references/report-template.md` |
| `audit/references/output-contract.md` | `audit-report-schema.md` or `ui-known-findings-schema.md` |
| `design-system/skills/ui-lib-dev/references/audit-standards.md` | `audit/references/ui.md` |
| `design-system/skills/ui-lib-dev/references/audit-ui.md` | `audit/references/ui.md`, `audit/references/checklist-web.md` |
| Any file referencing `close-a11y.md` / `close-ui.md` | Path updates needed |

## Phases

| # | Phase | Effort | Status |
|---|-------|--------|--------|
| 1 | Rename 10 files (git mv) + update all cross-references | 40m | completed |
| 2 | Run `epost-kit init --source . --yes` + grep verify zero old paths | 10m | completed |

## Success Criteria

- 10 files renamed, 4 unchanged
- Zero matches for old filenames in `grep -r "references/ui.md\|checklist-web\|ios-audit-mode\|android-audit-mode\|close-a11y\|close-ui\|audit-report-schema\|ui-known-findings-schema\|a11y\.md" packages/`
- `epost-kit init` succeeds
- `.claude/` reflects new file names
