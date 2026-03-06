---
phase: 4
title: "Agent teammate protocol blocks"
effort: 1h
depends: []
---

# Phase 4: Agent Teammate Protocol

Add `## Teammate Protocol` section to 5 agent files. This section is only active when the agent runs as a teammate within an Agent Team.

## Shared Block

Append this section to the END of each agent file (before the footer line if present):

```markdown
## Teammate Protocol

When operating as a teammate within an Agent Team (detected by `name@team-name` agent_id pattern):

- **Claim tasks**: Check `TaskList`, claim lowest-ID unblocked task, set to `in_progress`
- **File ownership**: Only edit files in your assigned ownership glob. Escalate conflicts to lead.
- **Communication**: Use `SendMessage(type: "message")` for peer DMs. Broadcast only for blockers.
- **Completion**: `TaskUpdate` status to `completed` BEFORE messaging lead with results.
- **Shutdown**: Approve shutdown requests unless mid-operation. Mark tasks done first.
- **Idle is normal**: Going idle after sending a message is expected, not an error.
- **Refer to teammates by NAME**, not agent ID.

See `.claude/skills/core/references/team-coordination-rules.md` for full rules.
```

## Files to Modify

| # | File | Agent |
|---|------|-------|
| 1 | `packages/core/agents/epost-researcher.md` | epost-researcher |
| 2 | `packages/core/agents/epost-fullstack-developer.md` | epost-fullstack-developer |
| 3 | `packages/core/agents/epost-debugger.md` | epost-debugger |
| 4 | `packages/core/agents/epost-code-reviewer.md` | epost-code-reviewer |
| 5 | `packages/core/agents/epost-tester.md` | epost-tester |

## Agent-Specific Notes

- **epost-fullstack-developer**: Already has `memory: project` — good for team memory
- **epost-code-reviewer**: Has `permissionMode: plan` + `disallowedTools: Write, Edit` — as reviewer teammate, it reads and reports only (correct behavior)
- **epost-researcher**: Same read-only constraints — correct for research teammates
- **epost-debugger**: Has `memory: project` — useful for cross-session debugging patterns
- **epost-tester**: `model: haiku` — used as haiku teammate in cook template

## Validation

- Each of the 5 files contains `## Teammate Protocol`
- No existing content overwritten (append only)
- `grep -c "Teammate Protocol" packages/core/agents/epost-{researcher,fullstack-developer,debugger,code-reviewer,tester}.md` returns 1 for each
