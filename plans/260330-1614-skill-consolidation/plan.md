---
completed: 2026-03-30
title: "Core Skills Consolidation: 31 to 25"
status: completed
created: 2026-03-30
updated: 2026-03-30
effort: 3.5h
phases: 3
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

# Core Skills Consolidation: 31 to 25

Merge 7 standalone skills into parent skills as flags/references. Create 1 new combined skill. `clean-code` stays separate (different trigger: writing vs reviewing).

Net result: -7 removed, +1 added = 25 skills.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Merge flag-based skills (security-scan, predict, scenario, retro, llms) | 1.5h | pending | [phase-1](./phase-1-merge-flag-skills.md) |
| 2 | Create unified knowledge skill | 1h | pending | [phase-3-unify-knowledge.md](./phase-3-unify-knowledge.md) |
| 3 | Update registries and regenerate indexes | 1h | pending | [phase-4-update-registries.md](./phase-4-update-registries.md) |

## Success Criteria

- `packages/core/skills/` contains exactly 25 skill directories
- `packages/core/package.yaml` lists 25 skills
- `generate-skill-index.cjs` CATEGORY_MAP + CONNECTION_MAP have no stale refs
- `skill-index.json` regenerated with correct count
- All parent SKILL.md files have flag tables for absorbed capabilities
- No references to deleted skill names in agent files or other skills

## Risk Notes

- Phase 1 is 5 independent merges — can be done in any order within the phase
- Phase 2 has clean-code references/ (3 files) that need relocation
- Phase 3 creates a net-new skill — knowledge-retrieval refs (3 files) carry over
- Phase 4 is the only phase that touches shared config files — run last
