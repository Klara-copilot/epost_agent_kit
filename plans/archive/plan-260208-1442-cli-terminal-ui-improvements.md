# PLAN-0016: CLI Terminal UI Improvements

**Status**: completed
**Created**: 2026-02-08
**Authors**: epost-architect
**Tags**: cli, ui, ux, onboarding, branding

## Summary

Improve the `epost-kit` CLI terminal experience with branded welcome screens, step progress indicators, rich package tables, styled summaries, and post-install guidance. All using lightweight primitives built on existing dependencies plus cli-table3.

## Approach

Created a central **UI utility module** (`ui.ts`) exporting display primitives (boxes, tables, trees, badges, progress steps). Updated each command to use these primitives. Added `cli-table3` (15KB, zero-dep) for table rendering. All functions are NO_COLOR and CI-compatible.

## Changes

### New Files (3)
1. `src/core/ui.ts` — Central UI utility module (~390 lines, 17+ exports)
2. `src/core/branding.ts` — ASCII "e" logo, version, tagline
3. `tests/unit/core/ui.test.ts` — 34 unit tests for all UI pure functions

### Modified Files (7)
4. `package.json` — Added cli-table3 dependency
5. `src/core/logger.ts` — Added step(), heading(), box() convenience methods
6. `src/commands/onboard.ts` — Branded banner, step progress, package table, nextSteps box
7. `src/commands/init.ts` — 7-step progress, package tables, dry-run box, per-package details, success summary
8. `src/commands/doctor.ts` — Styled [PASS]/[WARN]/[FAIL] health checks, summary box
9. `src/commands/profile.ts` — Table output for profile list, keyValue for profile show
10. `src/commands/package.ts` — Layer-grouped listing with layerDiagram

## Verification

- TypeScript: `npx tsc --noEmit` — 0 errors
- Tests: 34 new UI tests pass, 95/99 total tests pass (4 pre-existing failures)
- Build: `npm run build` succeeds
