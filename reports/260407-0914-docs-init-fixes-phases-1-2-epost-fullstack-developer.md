---
plan: plans/260407-0857-docs-init-fixes
phases: [1, 2]
agent: epost-fullstack-developer
date: 2026-04-07
status: completed
---

## Phase Implementation Report

- Phase: 1 + 2 (sequential, same file) | Plan: plans/260407-0857-docs-init-fixes | Status: completed

### Files Modified

- `packages/core/skills/docs/references/init.md` — all changes
- `.claude/skills/docs/references/init.md` — direct copy (synced)

### Tasks Completed

**Phase 1 — Strengthen Pre-Write Validation**
- Smart Init §5.5: replaced 3-row soft-check table with 8-row blocking checklist + STOP preamble
- Generation Mode §5.5: same replacement
- Migration Mode §5.5: collapsed to single-line reference to Generation Mode §5.5 (DRY)
- All rows use blocking language ("MUST", "STOP") — no "verify" / "should"

**Phase 2 — ID Format + Path Field Guidance**
- Added §4.9 "Entry Schema & ID Format" inside Generation Mode (before §5)
- §4.9 includes derivation rule, Correct examples, Incorrect anti-pattern table (including `"auth-token-refresh"`)
- Added "missing path" anti-pattern table
- Annotated `id` and `path` in §5 template with REQUIRED comments + §4.9 cross-reference
- Both §5.5 validation tables reference §4.9 for `.entries[].id` and `.entries[].path` rows

**Sync**
- Copied packages/ → .claude/ directly (epost-kit init requires interactive prompt)
- `diff` confirms files identical

### Tests Status

No automated tests (prompt-engineering only change). Acceptance criteria checked manually:

- [x] `init.md` Pre-Write Validation gate explicitly lists `path`, `id-format`, `business.domain`, `dependencies.internal.libraries`, `dependencies.internal.apiServices`, `dependencies.external` as blocking checks
- [x] `init.md` includes "Entry Schema & ID Format" (§4.9) with anti-pattern table showing `"auth-token-refresh"` as wrong
- [x] `.claude/skills/docs/references/init.md` matches `packages/` source (diff = empty)
- [ ] Test run on real repo — requires Phase 3

### Net Line Change

Original: 494 lines → Final: 522 lines → +28 lines (within <+40 constraint)

### Issues Encountered

- `epost-kit init` requires interactive input — used direct file copy instead; functionally equivalent for single-file sync

### Next Steps

Phase 3: run `/docs --init` on a test repo (luz_payment or luzcomp_scripts) and verify all 7 jq checks pass.

## Completion Evidence

- Tests: no test suite (prompt engineering only) — manual checklist above
- Build: N/A — markdown file, no build step
- Acceptance criteria: 4/5 checked (1 requires Phase 3 test run)
- Files changed: `packages/core/skills/docs/references/init.md`, `.claude/skills/docs/references/init.md`
