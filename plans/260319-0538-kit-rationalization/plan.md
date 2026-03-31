---
title: "Kit Rationalization — Lean Into Domain Value, Shed Process Scaffolding"
description: "Consolidate kit from 15/66/14 to 10/~50/8-9 while preserving workflows, folder structure, and domain knowledge. Incorporate native agent delegation patterns."
status: archived
priority: P1
effort: 14h
tags: [kit, rationalization, consolidation, agents, skills, hooks, native-delegation]
created: 2026-03-19
updated: 2026-03-19
phases: 5
platforms: [all]
breaking: false
---

# Kit Rationalization

## Summary

Three research reports confirm kit's value proposition:
- **260318-1940** (over-engineering audit): 40% over-engineered; domain agents irreplaceable, process agents redundant
- **260318-1951** (Cursor/Copilot validation): native tools complementary, not competitive
- **260319-1225** (native agent primitives): custom agents should be WRAPPERS around native primitives + domain knowledge

This plan preserves ALL workflows, folder structure, and routing while (a) removing what native tools handle better, and (b) wiring remaining agents to use native primitives (Explore, Plan) for heavy lifting.

**Constraint**: Keep `packages/` as source of truth. Keep `.claude/` generated. Keep skill-index.json, plans/, reports/ structure. Keep orchestration.md routing. No breaking changes to existing `/plan`, `/cook`, `/review`, `/audit` workflows.

## Key Dependencies

- packages/ is canonical (never edit .claude/ directly)
- epost-kit CLI regenerates .claude/ from packages/
- Active plans (34) must not break
- Skill-index.json must stay in sync

## Execution Strategy

Sequential: Phase 1 (safe deletes) -> Phase 2 (agent consolidation) -> Phase 3 (skill pruning) -> Phase 4 (hook cleanup). Each phase independently testable via `epost-kit init`.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Delete Redundant Agents | 2h | pending | [phase-1](./phase-1-delete-redundant-agents.md) |
| 2 | Consolidate Agent Responsibilities | 4h | pending | [phase-2](./phase-2-consolidate-agents.md) |
| 3 | Prune Analysis/Reasoning Skills | 4h | pending | [phase-3](./phase-3-prune-skills.md) |
| 4 | Hook Cleanup | 2h | pending | [phase-4](./phase-4-hook-cleanup.md) |
| 5 | Native Delegation Wiring | 2h | pending | [phase-5](./phase-5-native-delegation-wiring.md) |

## Critical Constraints

- NEVER delete domain skills (a11y, design-system, platform-*, domain-*)
- NEVER change folder structure (packages/, .claude/, plans/, reports/)
- NEVER break existing workflows (/plan, /cook, /review, /audit, /fix)
- ALL edits in packages/, run init to regenerate .claude/
- Keep routing table in CLAUDE.md functional (update references only)

## Success Criteria

- [ ] `epost-kit init` regenerates .claude/ cleanly
- [ ] All 7 core workflows still functional (plan, cook, review, audit, fix, debug, test)
- [ ] Agent count: 15 -> 10
- [ ] Skill count: 66 -> ~50
- [ ] Hook count: 14 -> 8-9
- [ ] No domain knowledge lost (a11y, design-system, platform skills untouched)
- [ ] Existing 34 active plans still reference valid agents
- [ ] Agents that do heavy file exploration use `subagent_type: Explore` pattern

## Resolved Questions

| # | Question | Answer | Source |
|---|----------|--------|--------|
| 1 | epost-project-manager: delete or slim? | **Delete** — routing already in CLAUDE.md intent map + main orchestrator. Orchestration role impossible (subagents can't spawn subagents). Progress tracking handled by plan files + plans/index.json. All responsibilities move to main orchestrator + CLAUDE.md rules + plan files. | Revised 260319 |
| 2 | web-prototype and web-rag: keep? | **Keep** — actively used platform skills with real domain knowledge. Already planned for consolidation into web-frontend/references/ in Phase 3. | User context |
| 3 | PLAN-0041 skill-consolidation overlap? | **No overlap** — PLAN-0041 targets folder structure (99->50 dirs); this plan targets content rationalization (remove redundant, wire native). Different scope, complementary. | Plan comparison |
