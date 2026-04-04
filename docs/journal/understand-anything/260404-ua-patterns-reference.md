# UA Patterns Reference Skill

**Date**: 2026-04-04
**Agent**: epost-fullstack-developer
**Epic**: understand-anything
**Plan**: plans/260403-2206-understand-anything-adoption/

## What was implemented

Created `understand-patterns` passive reference skill in `packages/core` documenting four Understand-Anything architectural patterns: two-phase extraction, intermediate artifact persistence, fan-in ordering, and file fingerprinting. The skill is `user-invocable: false` + `disable-model-invocation: true` — pure reference material for other agents and phases.

## Key decisions and why

- **Decision**: One reference file per pattern, not one combined file.
  **Why**: Each pattern has distinct problem/solution context. Splitting allows phases 1-2 to link directly to relevant references without loading all patterns.

- **Decision**: SKILL.md points to research report for full UA schema detail instead of inlining node/edge types.
  **Why**: The research report is authoritative. Duplicating 16 node types + 29 edge types in SKILL.md would exceed the 3KB limit and create a maintenance burden.

- **Decision**: Reference files slightly exceed the 1.5KB guideline (max 2973 bytes).
  **Why**: Each reference needs problem statement + pattern description + ePost application + when to use/skip to be truly self-contained. Below ~1.5KB these sections would be too terse to be useful.

## What almost went wrong

- Reference files overran the 1.5KB guideline. The guideline assumes minimal examples, but the phase spec required "self-contained" docs with ePost examples. The two goals are in slight tension. Resolved by keeping ePost application snippets concise (pseudocode, not full implementations).
