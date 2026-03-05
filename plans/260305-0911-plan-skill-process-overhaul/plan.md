---
title: Overhaul plan skill to be a followable end-to-end planning process
status: active
created: 2026-03-05
updated: 2026-03-05
effort: 4h
phases: 2
platforms: [all]
breaking: false
---

# Plan Skill Process Overhaul

## Problem

The plan skill (SKILL.md + references/) has comprehensive content, but it reads as a feature specification rather than a followable process. Agents creating or editing plans need:
1. A clear step-by-step checklist they can execute without interpretation
2. Explicit gates between steps (what must be true before proceeding)
3. Consistent output contracts (exact file structures, naming, frontmatter)
4. Error recovery paths at each step (not just at the end)

Currently, the planning "process" is scattered across SKILL.md (high-level framework), 4 variant references (detailed steps), and the architect agent (rules/constraints). An agent following `/plan` must mentally merge 3 sources.

## Design

Restructure so SKILL.md is the single process entry point. Each step in SKILL.md has:
- **Gate**: precondition check
- **Action**: what to do
- **Output**: what must exist after
- **Fail**: what to do if it goes wrong

Variant references (fast/deep/parallel) become modifiers that add/skip steps, not independent processes.

## Key Dependencies

- `packages/core/skills/plan/SKILL.md` -- main skill
- `packages/core/skills/plan/references/fast-mode.md` -- fast variant
- `packages/core/skills/plan/references/deep-mode.md` -- deep variant
- `packages/core/skills/plan/references/parallel-mode.md` -- parallel variant
- `packages/core/skills/plan/references/validate-mode.md` -- validate variant
- `packages/core/agents/epost-architect.md` -- primary consumer

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Restructure SKILL.md as process checklist | 2h | pending | [phase-01](./phase-01-restructure-skill-md.md) |
| 2 | Refactor variant references as step modifiers | 2h | pending | [phase-02](./phase-02-refactor-variant-references.md) |

## Success Criteria

- [ ] Agent following SKILL.md alone can produce a valid plan without reading variant refs for fast mode
- [ ] Each step has Gate/Action/Output/Fail
- [ ] Variant refs only add/modify steps, not redefine the full process
- [ ] Plan output contract (frontmatter schema, directory layout) defined once in SKILL.md
- [ ] No duplication between SKILL.md and variant references (DRY)
- [ ] Existing plan format stays compatible (no breaking change to plan.md schema)
