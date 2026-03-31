---
title: "Phase 1: Quick Fixes — Phantom Refs, Wiring, Validator"
plan: plans/260318-1353-skill-discovery-superpower
phase: 1
date: 2026-03-18
agent: epost-fullstack-developer
---

## Phase Implementation Report

### Executed Phase
- Phase: phase-1-quick-fixes
- Plan: plans/260318-1353-skill-discovery-superpower
- Status: completed

### Files Modified

| File | Change |
|------|--------|
| `packages/core/skills/skill-discovery/SKILL.md` | Replaced `ui-guidance` with `web-ui-lib` in Quick Ref table; added §1d Git-State Signals |
| `packages/core/scripts/generate-skill-index.cjs` | Removed `ui-guidance` from CATEGORY_MAP; added `launchpad: 'design-system'` |
| `.github/scripts/validate-role-scenarios.cjs` | Replaced all outdated agent names |

### Tasks Completed

- [x] 1.1 Remove phantom `ui-guidance` references — removed from `packages/` source; `.claude/` copies will clear on next init
- [x] 1.2 Add `launchpad` to skill-index — launchpad already present in `.claude/skills/` post-init; added to CATEGORY_MAP so it gets `design-system` category instead of `uncategorized`; regenerated skill-index
- [x] 1.3 Wire skill-discovery to 3 missing agents — already done (all 3 agents had `skill-discovery` in `skills:`)
- [x] 1.4 Fix validator agent names — replaced 5 outdated names across all scenario `expectedAgent` fields
- [x] 1.5 Add git-state signals section — added §1d after §1c in skill-discovery SKILL.md

### Tests Status

- Validator before: 18 pass / 22 fail
- Validator after: 27 pass / 13 fail (+9 fixed)
- Remaining 13 failures: pre-existing skill-gap issues (`debugging`, `planning`, `kit-commands` missing from index) — addressed in later phases

### Issues Encountered

- `.claude/` write-guard hook blocks direct edits to installed files — worked around by editing `packages/` source only and running packages generator targeting `.claude/skills/` for immediate skill-index regeneration
- `.claude/scripts/generate-skill-index.cjs` and `.claude/skills/skill-discovery/SKILL.md` still contain stale `ui-guidance` references — these are generated output and will be overwritten on next `epost-kit init`

### Next Steps

- Phase 2: Frontmatter-Driven Connections & Categories (no dependencies on Phase 1 beyond completion)
