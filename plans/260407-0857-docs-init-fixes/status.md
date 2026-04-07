---
updated: 2026-04-07
---

# Plan Status: docs-init-fixes

## Progress

| Phase | Title | Status |
|-------|-------|--------|
| 1 | Strengthen Pre-Write Validation gate | Done |
| 2 | Fix ID format + path field instructions | Done |
| 3 | Verify on test repo + sync to .claude/ | Pending |

## Key Decisions

| Date | Decision | Why |
|------|----------|-----|
| 2026-04-07 | Collapsed Migration Mode §5.5 to reference instead of duplicate table | DRY — one table to maintain |
| 2026-04-07 | Placed §4.9 inside Generation Mode (before §5) | Smart Init references Generation Mode step 5 already, so §4.9 is discovered by all modes |
| 2026-04-07 | Direct copy packages→.claude instead of epost-kit init | init requires interactive prompt; direct copy is safe for single-file sync |

## Architecture Reference

File changed: `packages/core/skills/docs/references/init.md` (and .claude/ mirror)

- Added §4.9 "Entry Schema & ID Format" with correct/incorrect tables
- Rewrote all three §5.5 Pre-Write Validation sections (Smart Init, Generation Mode, Migration Mode)
- Migration Mode §5.5 now references Generation Mode §5.5 (single source of truth)
- Annotated `id` and `path` in the §5 template with REQUIRED comments

## Known Bugs

None.

## Not Yet Started

- Phase 3: Test repo verification
