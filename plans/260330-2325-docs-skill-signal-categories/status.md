---
plan: docs-skill-signal-categories
updated: 2026-03-31
---

# Status: Docs Skill Signal-Based Categories

## Progress

| Phase | Title | Status | Notes |
|-------|-------|--------|-------|
| 1 | Create kb-categories.json registry | Done | |
| 2 | Rewrite init.md with category selection | Done | |
| 3 | Update index.json template + report tables | Done | |

## Key Decisions
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-31 | Cross-reference step numbers updated in Smart Init to match new Generation Mode numbering | 3.5→4.5 for Dependencies, step 4→5 for index.json |
| 2026-03-31 | index.json example shows all 10 categories as reference; instruction says "omit skipped" | Easier for agents to understand the full schema before pruning |

## Architecture Reference
- `kb-categories.json` — registry at `packages/core/skills/docs/references/`
- Generation Mode: steps 1(scan) → 2(select) → 3(dirs) → 4(generate) → 4.5(deps) → 5(index) → 6(report)
- Smart Init Mode: steps 1(read) → 2(migrate) → 3(coverage) → 3.5(select) → 4(gaps) → 5(deps) → 6(index) → 7(cleanup) → 8(report)

## Known Bugs
None currently tracked.
