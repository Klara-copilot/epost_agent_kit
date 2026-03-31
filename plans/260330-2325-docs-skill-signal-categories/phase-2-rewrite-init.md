---
phase: 2
title: "Rewrite init.md with category selection + dynamic generation"
effort: 1h
depends: [1]
---

# Phase 2: Rewrite init.md with Category Selection + Dynamic Generation

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/docs/references/init.md` — file to modify
- `packages/core/skills/docs/references/kb-categories.json` — registry from Phase 1

## Overview
- Priority: P1
- Status: Pending
- Effort: 1h
- Description: Add category selection step, make directory creation dynamic, replace 7 hardcoded generation blocks with unified table

## Requirements

### Functional
- New "Select Categories" step inserted before directory creation in Generation Mode
- Same selection step added to Smart Init Mode (before Step 2)
- Directory creation only for selected categories (not all 7/10)
- Seven hardcoded generation sections (ADRs, ARCH, CONVs, FEATs, PATTERNs, FINDINGs, GUIDEs) replaced with unified generation table covering all 10 categories
- Category selection logged: which selected, which skipped + why

### Non-Functional
- File stays under 400 lines (currently 352)
- Existing prefixes remain valid — no renaming
- FINDING category still gets `.gitkeep` only (no auto-generation)

## Files to Modify
- `packages/core/skills/docs/references/init.md` — major rewrite of sections 2-3 in Generation Mode, plus additions to Smart Init Mode

## Implementation Steps

1. **Generation Mode — Insert Step 2: Select Categories** (before current Step 2 "Create KB Directory Structure")
   - Read `docs/references/kb-categories.json`
   - Always include `core: true` categories (ADR, ARCH, CONV)
   - For each `core: false` category, scan for its signals — include if any signal found
   - Log selected vs skipped categories with signal evidence
   - Renumber subsequent steps (current Step 2 → Step 3, etc.)

2. **Generation Mode — Replace Step 2 "Create KB Directory Structure"**
   - Remove the hardcoded 8-directory tree
   - Replace with: "Create `docs/` and `docs/index.json`. Then create subdirectory for each **selected category** only. Do not create directories for skipped categories."

3. **Generation Mode — Replace Step 3 "Auto-Generate Documents"**
   - Remove the 7 individual category sections (ADRs, ARCH, CONVs, FEATs, PATTERNs, FINDINGs, GUIDEs)
   - Replace with a unified generation table:

   | Prefix | Selection | What to Generate |
   |--------|-----------|-----------------|
   | ADR | always | For each major framework dep, `ADR-NNNN-{dep}.md` |
   | ARCH | always | `ARCH-0001-overview.md` + subsystem docs |
   | CONV | always | From eslint/prettier/tsconfig/checkstyle configs |
   | FEAT | if signals | From route groups, feature directories, module directories |
   | PATTERN | if signals | Recurring code patterns (>= 3 occurrences) |
   | FINDING | if signals | `.gitkeep` only — populated during debugging |
   | GUIDE | if signals | From Dockerfile, CI, Makefile, .env.example, README setup |
   | API | if signals | REST/GraphQL endpoint docs from route files, @Path annotations, OpenAPI specs |
   | INFRA | if signals | Dockerfile/CI pipeline/Terraform/K8s documentation |
   | INTEG | if signals | External service integration docs (Keycloak, S3, SMTP, third-party SDKs) |

   - Keep the deduplication rule and evidence-based rule from current text

4. **Smart Init Mode — Insert Category Selection**
   - After Step 1 "Read All Existing Flat Docs", insert Step 1.5: "Select Categories"
   - Same logic as Generation Mode: read registry, include core, scan signals for optional
   - Step 4 "Scan Codebase for Gaps" should reference selected categories only (not just the original 5 types)

## Todo List
- [ ] Insert category selection step in Generation Mode
- [ ] Replace hardcoded directory tree with dynamic creation
- [ ] Replace 7 generation sections with unified table (10 categories)
- [ ] Add category selection to Smart Init Mode
- [ ] Update Smart Init gap-fill to reference all 10 categories
- [ ] Verify step numbering is consistent after insertions

## Success Criteria
- No hardcoded directory list in init.md
- Category selection step exists in both Generation Mode and Smart Init Mode
- All 10 categories appear in the generation table
- FINDING still creates `.gitkeep` only

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agents miss the category selection step | Med | Make it a numbered step with clear heading, not buried in prose |
| Existing repos break on re-init | Low | Additive only — existing dirs/prefixes remain valid |

## Security Considerations
- None identified

## Next Steps
- Phase 3 updates index.json template and report tables to match
