# Clean Code Skill — Community Adaptation

**Date**: 2026-03-27
**Agent**: epost-fullstack-developer
**Epic**: core-skills
**Plan**: none (direct implementation task)

## What was implemented

Created `packages/core/skills/clean-code/` — a 4-file skill adapting Robert C. Martin's Clean Code
principles to the TypeScript/Java stack. Covers naming, functions, comments, formatting,
objects/data structures, error handling, and classes. Registered in skill-index.json as tier:core,
category:analysis-reasoning, with `enhances: [code-review]`.

## Key decisions and why

- **Decision**: Dropped Section 7 (Unit Tests) entirely, cross-ref to `tdd` skill.
  **Why**: Avoids duplication; tdd skill is authoritative for test practices.

- **Decision**: Trimmed Section 9 (Smells and Heuristics) to checklist items only in SKILL.md, pointing to `code-review` for formal rule IDs.
  **Why**: code-review skill already has numbered rule IDs (SEC-001, PERF-001, etc.) — duplicating smell definitions would create maintenance drift.

- **Decision**: `tier: core` rather than `discoverable`.
  **Why**: Clean Code principles apply to all code writing, not just specific platform contexts. Both developer and reviewer agents should have it passively available.

- **Decision**: TypeScript + Java examples in reference files; SKILL.md itself uses tables + TypeScript only.
  **Why**: SKILL.md is the quick-reference layer (tables, checklist); reference files are the deep-dive layer where both stack languages are relevant.

## What almost went wrong

- The skill-index.json was partially auto-updated (count bumped to 47, development-tools to 12) by an automated process before I could edit it — those values were already correct for a different skill addition. Had to verify the `analysis-reasoning` category count and `connectedSkills` separately.
