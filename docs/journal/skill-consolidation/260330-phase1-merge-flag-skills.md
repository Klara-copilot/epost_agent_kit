# Phase 1: Merge Flag-Based Skills Into Parents

**Date**: 2026-03-30
**Agent**: epost-fullstack-developer
**Epic**: skill-consolidation
**Plan**: plans/260330-1614-skill-consolidation/

## What was implemented

Merged 5 standalone skills into parent skills as `--flag` references:
- `security-scan` → `security --scan` (references/scan.md)
- `predict` → `plan --predict` (references/predict-mode.md)
- `scenario` → `test --scenario` (references/scenario-mode.md)
- `retro` → `git --retro` (references/retro.md)
- `llms` → `docs --llms` (references/llms.md)

Deleted all 5 standalone directories. Skill count: 31 → 26 (25 target after phases 2 and 3).

## Key decisions and why

- **Decision**: Different integration pattern per parent (`--scan` in flag table vs `--retro`/`--llms` in Step 0 `if` chain)
  **Why**: Each parent had its own existing convention. security has a Flags table. git and docs use `if $ARGUMENTS contains/starts with` chains. plan has a Mode Reference table. Matched existing patterns rather than forcing uniformity.

- **Decision**: Content moved verbatim to reference files, no rewriting
  **Why**: Content was already well-structured. Rewriting risks introducing errors. Phase 3 registry update will handle description updates.

## What almost went wrong

- `git/SKILL.md` needed two changes: both Step 0 `if` chain AND Aspect Files table. Easy to miss the second location if only scanning for the flag table. [core skill] does not cover "parent skills may need updates in multiple sections" — needed manual inspection of each parent's structure.
