---
title: "Docs Skill: Signal-Based KB Category Selection"
status: active
created: 2026-03-30
updated: 2026-03-30
effort: 2h
phases: 3
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

# Docs Skill: Signal-Based KB Category Selection

## Summary

Replace the hardcoded 7-category KB structure in `docs/references/init.md` with a signal-based category registry. Core categories (ADR, ARCH, CONV) always apply; optional categories (FEAT, PATTERN, FINDING, GUIDE, API, INFRA, INTEG) only activate when codebase signals are detected. Eliminates empty `.gitkeep` dirs in small repos and adds 3 missing categories.

## Key Dependencies

- `packages/core/skills/docs/references/init.md` — sole file being edited
- `packages/core/skills/docs/references/` — location for new registry file

## Execution Strategy

Sequential — Phase 1 creates the registry, Phase 2 rewrites init.md to consume it, Phase 3 updates report/index templates. Each phase builds on the previous.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Create kb-categories.json registry | 15m | pending | [phase-1](./phase-1-category-registry.md) |
| 2 | Rewrite init.md with category selection + dynamic generation | 1h | pending | [phase-2](./phase-2-rewrite-init.md) |
| 3 | Update index.json template + report tables | 30m | pending | [phase-3](./phase-3-templates.md) |

## Critical Constraints

- Additive only: existing 7 prefixes (ADR, ARCH, CONV, FEAT, PATTERN, FINDING, GUIDE) remain valid forever
- No changes to any other skill files
- Smart Init Mode must also gain the category selection step
- `kb-categories.json` co-located at `packages/core/skills/docs/references/`

## Success Criteria

- [ ] `kb-categories.json` exists with all 10 categories, each having prefix, directory, core flag, and signals
- [ ] init.md Generation Mode has a "Select Categories" step before directory creation
- [ ] init.md Smart Init Mode also uses category selection
- [ ] Directories are only created for selected categories (no unconditional creation)
- [ ] Generation sections use a unified table referencing the registry instead of 7 hardcoded blocks
- [ ] index.json template only includes selected categories
- [ ] Report tables show selected vs skipped categories
