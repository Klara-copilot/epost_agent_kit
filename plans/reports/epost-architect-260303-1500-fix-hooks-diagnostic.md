# Plan Report: Fix Hooks Diagnostic Issues

**Date**: 2026-03-03
**Agent**: epost-architect
**Mode**: fast (4 isolated fixes, no research needed)

## Plan Location

`plans/260303-1500-fix-hooks-diagnostic/`

## Phases

| # | Name | Effort | Files Modified |
|---|------|--------|----------------|
| 01 | Fix settings.json hooks | 10m | `packages/core/settings.json` |
| 02 | Fix hook scripts | 20m | `packages/core/hooks/session-init.cjs`, `packages/core/hooks/privacy-block.cjs` |

**Total effort**: ~30m

## Fixes Mapped to Report

| Report ID | Severity | Phase | Action |
|-----------|----------|-------|--------|
| P1 | CRITICAL | 01 | Remove PostToolUse lint/build hooks |
| P2 | CRITICAL | 01 | Remove statusLine config |
| P3 | MODERATE | 02 | Add `os` import to session-init.cjs |
| P4 | MODERATE | 02 | Sync stdin in privacy-block.cjs |

## Key Dependencies

- Run `epost-kit init` after all fixes to regenerate `.claude/`

## Risks

- Low. All changes are config removal or minimal script edits. No feature logic affected.

## Unresolved Questions

- Should `npm run lint`/`npm run build` permission entries also be removed from `permissions.allow`? Plan suggests yes (they're stale). User may want to keep them for future use.
