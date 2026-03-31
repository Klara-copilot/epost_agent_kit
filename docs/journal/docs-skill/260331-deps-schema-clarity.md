# Fix deps schema confusion in docs init.md

**Date**: 2026-03-31
**Agent**: epost-fullstack-developer
**Epic**: docs-skill
**Plan**: plans/260331-0803-docs-deps-schema-clarity/

## What was implemented

Rewrote section 4.5 of `init.md` (both `packages/core` and `.claude` mirrors) to eliminate ambiguity between `internal` and `external` dependency buckets. Root cause: 83% of repos were placing npm/maven packages into `internal` because the section didn't explicitly scope `internal` to `luz_*` repos only.

Changes:
- `internal` heading now reads "— other `luz_*` repositories ONLY" with `.repo` constraint note
- `external` heading now reads "— npm/maven packages + third-party services" with explicit `npm-package`/`maven-artifact` types
- Added Correct vs Incorrect table for at-a-glance disambiguation
- Added validation rule block as final guardrail

## Key decisions and why

- **Decision**: Added both a table and a blockquote validation rule rather than just one.
  **Why**: The table handles recognition (is this right?); the blockquote handles the moment of mistake (you're mid-write and realize you're wrong).

## What almost went wrong

Nothing significant. Both files were already identical before the edit, confirmed by diff.
