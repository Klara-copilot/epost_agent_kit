# Semantic Annotation Protocol (Phase 1b)

## Purpose

Semantic phase — uses structural scan output to produce human-readable annotations. The LLM acts as annotator, not file reader. Never re-reads raw source files.

## Input

The JSON-like summary produced by `structural-scan-protocol.md` (Phase 1a):
- `framework`, `language`, `entryPoints`
- `topFiles` with `path`, `lines`, `inboundCount`
- `importMap`, `dependencies`

## What to Annotate

### Entry Points

For each entry point file:
- **What it does**: 1–2 sentences describing purpose
- **Why it matters**: why a new contributor should read it first
- **Complexity**: `simple` / `moderate` / `complex`

### Top Modules (by inboundCount)

For each file in `topFiles`:
- **Role**: what responsibility this module owns
- **Complexity**: `simple` / `moderate` / `complex`
- **Key exports**: what the rest of the codebase depends on

### Dependency Relationships

For the 3–5 highest fan-in files:
- Why does the rest of the codebase depend on this?
- What would break if it were changed?

### Gateway Files

Identify 3–5 files a new developer must understand first:
- Selection criteria: high inboundCount + entry point proximity
- Explain why each is a "must read" before exploring features

## Output Format

```markdown
## Entry Points
- `src/app/layout.tsx` — Root layout wrapper. Bootstraps providers (Redux, Auth, i18n). 
  Complexity: moderate. Read this first to understand global state setup.

## Core Modules (most imported)
1. `src/lib/utils.ts` (18 inbound) — Shared formatting and validation helpers.
   Role: utility. Complexity: simple. Exports: `cn()`, `formatDate()`, `validateEmail()`.
2. `src/store/index.ts` (12 inbound) — Redux store configuration.
   Role: state. Complexity: moderate. Exports: `store`, `AppState` type, `dispatch`.

## Gateway Files (read in this order)
1. `src/app/layout.tsx` — Understand app bootstrap before anything else
2. `src/store/index.ts` — State shape governs all component behavior
3. `src/lib/utils.ts` — Used everywhere; read once, recognized everywhere
```

## Rules

- NEVER re-read raw source files — all facts come from Phase 1a output
- If a fact is ambiguous from structure alone, use "likely" or "inferred from imports"
- Rate complexity on: lines of code, inboundCount, number of dependencies
  - `simple`: <100 lines, <3 inbound, <5 deps
  - `complex`: >250 lines OR >10 inbound OR >10 deps
  - `moderate`: everything else
- Gateway files must be a subset of entry points + top 5 by inboundCount
- Keep annotations concise — this feeds the fan-in tour, not a design doc

## Cross-Reference

See `understand-patterns/references/two-phase-extraction.md` — key constraint: Phase 2 reads Phase 1 output, never raw files.
