---
title: "Port Agent Teams from claudekit to epost_agent_kit"
status: archived
created: 2026-03-06
updated: 2026-03-06
effort: 4h
phases: 4
platforms: [kit]
breaking: false
---

# Port Agent Teams System

Port claudekit's Agent Teams orchestration (TeamCreate/TaskCreate/SendMessage pattern) into epost_agent_kit's `packages/core/` source-of-truth structure.

## Phases

| # | Phase | Effort | Depends | Status | File |
|---|-------|--------|---------|--------|------|
| 1 | Hook config toggles + settings.json events | 30m | — | pending | [phase-1](./phase-1-config-and-settings.md) |
| 2 | Three new hooks | 1.5h | 1 | pending | [phase-2](./phase-2-hooks.md) |
| 3 | Team skill + coordination rules | 1h | — | pending | [phase-3](./phase-3-skill-and-rules.md) |
| 4 | Agent teammate protocol blocks | 1h | — | pending | [phase-4](./phase-4-agent-updates.md) |

**Parallel execution**: Phases 1+3+4 are independent. Phase 2 depends on Phase 1 (needs config toggles).

## Success Criteria

- All 3 hooks load without error (`node .claude/hooks/{hook}.cjs` exits 0)
- `isHookEnabled('task-completed-handler')` resolves from DEFAULT_CONFIG
- settings.json has TaskCompleted + TeammateIdle event entries
- team SKILL.md references EPOST_ env vars and epost agent names
- 5 agents have ## Teammate Protocol section
- `epost-kit init` regenerates .claude/ correctly with new files

## Key Decisions

- team-context-inject merges into existing SubagentStart hook list (additive, not replacing subagent-init.cjs)
- CK_ env vars become EPOST_ (already set by session-init.cjs)
- CK stack context block renamed to "epost Context"
- Team config/task dirs remain at `~/.claude/teams/` and `~/.claude/tasks/` (Claude Code convention)
- EPOST_DEBUG replaces CK_DEBUG
