# Frontend API Dependency Discovery — Schema + Algorithm

**Date**: 2026-04-04
**Agent**: epost-fullstack-developer
**Epic**: knowledge-base
**Plan**: plans/260403-1430-frontend-api-discovery/ (epost_knowledge_base)

## What was implemented

Extended the KB schema and `/docs --init` algorithm to discover frontend API dependencies.

Phase 1: `knowledge-base.md` — restructured `dependencies.internal[]` into `internal.libraries[]` + `internal.apiServices[]`. Added `confidence`, `discoveryMethod`, `via` fields. Backward compat note for flat array format. Frontend (Next.js) example added.

Phase 2: `init.md` Step 4.5 — added platform detection gate. For web repos, delegates to new `frontend-discovery.md`. Updated Step 5 template to match new schema. Created `frontend-discovery.md` with full 2-pass algorithm: Pass 1 (4 declared signals: package.json scoped packages, env vars, API constants, proxy rewrites), Pass 2 (2 inferred signals, conditional), service name mapping heuristic, deduplication rules.

## Key decisions and why

- **Decision**: Extract web algorithm to `frontend-discovery.md` rather than inline in `init.md`
  **Why**: `init.md` would exceed 500-line budget (estimated 517 lines). Per Phase 2 spec, extract when over 500.

- **Decision**: Keep Java discovery section in `init.md`, only web discovery extracted
  **Why**: Java discovery is 4 lines; only the web algorithm is long enough to warrant extraction. Keeps Java context co-located with platform detection gate.

- **Decision**: Update the Step 5 template `dependencies` block in `init.md`
  **Why**: The template is the primary "output contract" agents follow when writing index.json. Leaving it in the old flat-array format would cause agents to produce invalid schema even after reading the updated Step 4.5.

## What almost went wrong

`init.md` line count was estimated at ~520 lines with the full algorithm inline. The phase-2 spec had a fallback rule for this exact case — extracting to a separate file. Followed the fallback without needing to improvise.
