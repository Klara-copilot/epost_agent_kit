---
title: "Add epost-brainstormer Agent"
status: completed
created: 2026-03-30
updated: 2026-03-30
effort: 2h
phases: 2
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

# Add epost-brainstormer Agent

## Summary

Recreate the `epost-brainstormer` agent — a CTO-level ideation advisor that explores options, challenges assumptions, and hands off to epost-planner when consensus is reached. Adapts CK brainstormer to epost conventions (frontmatter, navigation headers, report naming, skill references, no Team Mode).

## Key Dependencies

- `packages/core/skills/thinking/` — must exist (confirmed)
- `packages/core/skills/knowledge/` — must exist (confirmed)
- `packages/core/skills/core/references/workflow-architecture-review.md` — already references brainstormer
- `packages/core/skills/core/references/orchestration.md` — already references brainstormer

## Execution Strategy

Sequential: Phase 1 creates the agent, Phase 2 wires routing. No parallel needed.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Create agent file | 1.5h | done | [phase-1](./phase-1-create-agent.md) |
| 2 | Wire routing in CLAUDE.md and snippet | 0.5h | done | [phase-2](./phase-2-wire-routing.md) |

## Critical Constraints

- Agent file goes in `packages/core/agents/` (source of truth), NOT `.claude/agents/`
- Must NOT implement code — brainstormer is advisory only
- `permissionMode: default` (needs Write for reports)
- Model: `opus` (deliberative reasoning)
- No `disallowedTools` — needs Write for report creation

## Success Criteria

- [ ] `packages/core/agents/epost-brainstormer.md` exists with correct frontmatter
- [ ] Agent has AGENT NAVIGATION header with intention routing + handoff targets
- [ ] Behavioral checklist (6 items) present in agent body
- [ ] 7-phase process adapted from CK (no CK-specific references)
- [ ] Report output uses epost naming convention
- [ ] Handoff to epost-planner (not /ck:plan)
- [ ] Both CLAUDE.md files updated with Ideate/Brainstorm intent row
- [ ] Fuzzy matching updated with ideation verbs
- [ ] `packages/core/CLAUDE.snippet.md` updated (source of truth for routing)
