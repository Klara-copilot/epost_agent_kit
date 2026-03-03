# Report: iOS a11y Cleanup + Findings Persistence Workflow

**Agent**: epost-architect
**Date**: 2026-03-03
**Plan**: `/Users/than/Projects/epost_agent_kit/plans/260303-1123-ios-a11y-cleanup-findings-workflow/`

## Summary

Two-phase plan to (1) prune unnecessary iOS a11y reference files and (2) add findings persistence to audit/fix/review commands.

## Phases

| # | Name | Effort | Files Modified |
|---|------|--------|----------------|
| 1 | Prune iOS a11y references | 45min | Delete 4, create 3, modify 5 |
| 2 | Add findings persistence | 1h15min | Modify 4 (3 skills + schema) |

## Key Findings

- `a11y-images.md` (299 lines) — 80% duplicated in buttons ref + guidance mode. Unique content: complex images (~40 lines), merge to core
- 3 mode references (`a11y-mode-audit/fix/guidance`) are iOS-specific but live in ios-a11y instead of the cross-platform command skills that use them
- **Critical gap**: audit and review output JSON but never persist findings to `known-findings.json` — entire fix pipeline depends on manual finding entry
- **Critical gap**: fix-a11y doesn't update finding status after successful fix

## Effort: 2h total

## Dependencies
- Must edit in `packages/a11y/` (source of truth), then run `epost-kit init`
- Schema version bump (1.2 -> 1.3) needed for new optional fields

## Risks
- Low: all changes are to skill documentation, not runtime code
- Image knowledge loss mitigated by merging unique content to core ref

## Unresolved Questions
1. Should mode references be platform-namespaced (e.g., `ios-audit-mode.md`, `android-audit-mode.md`) or merged into a single cross-platform mode ref per command skill?
2. Should `known-findings.json` be committed to git or stay in `.gitignore` per data-store convention? Currently the convention says gitignored, but sharing findings across team members has value.
