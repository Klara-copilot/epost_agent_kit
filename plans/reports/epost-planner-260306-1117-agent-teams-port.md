# epost-planner: Port Agent Teams from claudekit

**Date**: 2026-03-06 11:17
**Agent**: epost-planner
**Plan**: `plans/260306-1117-agent-teams-port/plan.md`
**Status**: COMPLETE

---

## Executive Summary

Port claudekit's Agent Teams system (TeamCreate/TaskCreate/SendMessage orchestration) into epost_agent_kit. 3 new hooks, 1 new skill, 1 new rules doc, 5 agent updates. All changes in `packages/core/` (source of truth).

---

## Plan Details

- **Directory**: `plans/260306-1117-agent-teams-port/`
- **Phases**: 4 phases
- **Effort**: 4h
- **Platforms**: kit

## Sources Analyzed

- `packages/core/hooks/lib/epost-config-utils.cjs` — DEFAULT_CONFIG hook toggle pattern, env var helpers
- `packages/core/settings.json` — hook event registration structure
- `packages/core/hooks/session-init.cjs` — EPOST_ env var mapping (already complete)
- `packages/core/hooks/subagent-init.cjs` — SubagentStart additionalContext pattern
- `packages/core/agents/epost-researcher.md` — agent frontmatter + structure template
- `/Users/than/Projects/claudekit/.claude/hooks/task-completed-handler.cjs` — source hook
- `/Users/than/Projects/claudekit/.claude/hooks/teammate-idle-handler.cjs` — source hook
- `/Users/than/Projects/claudekit/.claude/hooks/team-context-inject.cjs` — source hook
- `/Users/than/Projects/claudekit/.claude/skills/team/SKILL.md` — source skill
- `/Users/than/Projects/claudekit/.claude/rules/team-coordination-rules.md` — source rules

## Files to Touch

| File | Action | Phase |
|------|--------|-------|
| `packages/core/hooks/lib/epost-config-utils.cjs` | Modify (3 hook toggles) | 1 |
| `packages/core/settings.json` | Modify (2 events + 1 SubagentStart entry) | 1 |
| `packages/core/hooks/task-completed-handler.cjs` | Create | 2 |
| `packages/core/hooks/teammate-idle-handler.cjs` | Create | 2 |
| `packages/core/hooks/team-context-inject.cjs` | Create | 2 |
| `packages/core/skills/team/SKILL.md` | Create | 3 |
| `packages/core/skills/core/references/team-coordination-rules.md` | Create | 3 |
| `packages/core/skills/skill-index.json` | Modify (add team entry) | 3 |
| `packages/core/agents/epost-researcher.md` | Modify (append section) | 4 |
| `packages/core/agents/epost-fullstack-developer.md` | Modify (append section) | 4 |
| `packages/core/agents/epost-debugger.md` | Modify (append section) | 4 |
| `packages/core/agents/epost-code-reviewer.md` | Modify (append section) | 4 |
| `packages/core/agents/epost-tester.md` | Modify (append section) | 4 |

## Key Dependencies

- Claude Code Agent Teams feature (experimental flag or GA in 2.1.33+)
- `~/.claude/teams/` and `~/.claude/tasks/` directories (managed by Claude Code)
- EPOST_ env vars already set by session-init.cjs (confirmed present)

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent Teams still experimental in CC | Med | Skill includes pre-flight check; aborts if TeamCreate unavailable |
| SubagentStart hook ordering | Low | team-context-inject runs after subagent-init; both output additionalContext (CC merges) |
| skill-index.json count drift | Low | Verify count after adding entry |

---

## Verdict

**READY** — All source files read, env var mapping confirmed, no blockers.

---

*Unresolved questions:*
- None. Research was pre-completed and all source material verified.
