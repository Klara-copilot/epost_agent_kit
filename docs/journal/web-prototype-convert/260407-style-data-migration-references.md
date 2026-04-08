# Style and Data Migration Reference Files

**Date**: 2026-04-07
**Agent**: epost-fullstack-developer
**Epic**: web-prototype-convert
**Plan**: plans/260407-1240-web-prototype-convert-redesign/

## What was implemented

Created two reference files for the web-prototype-convert skill:
- `style-migration.md` (151 lines) — luz_next module file structure, klara prop translation, CVA/CSS-modules/inline-style migration, framework restructuring (Vite, Pages Router, plain HTML)
- `data-migration.md` (184 lines) — 5-layer data flow, FetchBuilder pattern, hook/action patterns, Zustand→RTK dual-store, local→API migration table, missing API stub pattern, TypeScript contract rule, auth

## Key decisions and why

- **Missing API stub pattern included**: generates a typed `TODO_ENDPOINT` service skeleton rather than blocking — unblocks UI work while backend is pending. Surfaces as 🟡 in spec output.
- **Zustand→RTK framed as domain analysis, not 1:1 mapping**: phase file explicitly called this out — agent analyzes store structure and recommends slice boundaries by domain. Prevents over-fragmented slices.
- **AI integrations (Gemini) → server action**: API key never reaches client. Covered in both the action pattern section and the local→API migration table row.
- **`_services/` not `_callers/`**: luz_next directory convention explicit in the file structure diagram.

## What almost went wrong

- Phase file had detailed section-by-section requirements — skimming would have missed the "stub pattern surfaces as 🟡" requirement and the Zustand analysis guidance. Full read of phase file was essential before writing.
