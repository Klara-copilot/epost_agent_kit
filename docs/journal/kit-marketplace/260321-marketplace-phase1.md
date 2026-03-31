# Kit Marketplace Phase 1: Registry + Bundle Manifest

**Date**: 2026-03-21
**Agent**: epost-fullstack-developer
**Epic**: kit-marketplace
**Plan**: plans/260320-1213-kit-marketplace/

## What was implemented

- `bundles.yaml` at kit repo root: 8 role bundles (web-frontend, web-backend, web-fullstack, designer, ios-developer, android-developer, a11y-specialist, kit-author) with skills, agents, extends/suggested fields
- `src/domains/config/epost-config.ts` (CLI): read/write module for `.epost.json` project state file using Zod validation from pre-existing `src/types/epost-config.ts`
- `src/domains/resolver/resolver.ts`: BFS + topological sort dependency resolver (extends, requires, conflicts, max 3 hops)
- `src/domains/resolver/profile-aliases.ts`: legacy `--profile` → role bundle name mapping with deprecation support
- `size` field added to `generate-skill-index.cjs` — computes bytes from SKILL.md + references/ subdir

## Key decisions and why

- **Decision**: Moved `visited.set()` after `indexMap.get()` in resolver BFS
  **Why**: Original order added unknown skills to visited before checking the index, causing them to appear in output despite emitting a warning. Discovered during test run.

- **Decision**: Topological sort uses Kahn's algorithm (in-degree) rather than DFS
  **Why**: Simpler to reason about, handles cycles gracefully (remaining nodes appended at end), alphabetical tie-breaking gives stable output

- **Decision**: `size` = bytes of SKILL.md + all files in references/ (not recursive)
  **Why**: References are the main token cost alongside SKILL.md. Nested subdirs are rare and unnecessary complexity.

## What almost went wrong

- `src/types/epost-config.ts` existed from a prior session — no conflict, but worth checking before assuming files need creation
- `npm run build` is blocked by the scout-block hook; used `npx tsc --noEmit` instead for type verification
