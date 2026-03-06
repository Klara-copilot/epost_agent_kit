---
phase: 2
title: "Three new hooks"
effort: 1.5h
depends: [1]
---

# Phase 2: Port Hook Scripts

Port 3 hooks from claudekit to `packages/core/hooks/`. All follow epost conventions: `require('./lib/epost-config-utils.cjs')`, EPOST_ env vars, fail-open crash wrapper.

## Task 2.1: task-completed-handler.cjs

**File**: `packages/core/hooks/task-completed-handler.cjs`
**Action**: Create
**Source**: `/Users/than/Projects/claudekit/.claude/hooks/task-completed-handler.cjs`

Changes from source:
- `require('./lib/ck-config-utils.cjs')` → `require('./lib/epost-config-utils.cjs')`
- `CK_REPORTS_PATH` → `EPOST_REPORTS_PATH`
- `CK_DEBUG` → `EPOST_DEBUG`
- Hook name: `'task-completed-handler'`
- TASKS_DIR remains `~/.claude/tasks/` (Claude Code convention, not CK-specific)

Behavior: On TaskCompleted event, logs completion to `{EPOST_REPORTS_PATH}/team-{team_name}-completions.md`, counts task progress, outputs additionalContext with progress summary.

## Task 2.2: teammate-idle-handler.cjs

**File**: `packages/core/hooks/teammate-idle-handler.cjs`
**Action**: Create
**Source**: `/Users/than/Projects/claudekit/.claude/hooks/teammate-idle-handler.cjs`

Changes from source:
- `require('./lib/ck-config-utils.cjs')` → `require('./lib/epost-config-utils.cjs')`
- `CK_DEBUG` → `EPOST_DEBUG`
- Hook name: `'teammate-idle-handler'`
- TASKS_DIR remains `~/.claude/tasks/`

Behavior: On TeammateIdle event, reads task dir to find unblocked+unassigned tasks, outputs additionalContext suggesting what to assign the idle teammate.

## Task 2.3: team-context-inject.cjs

**File**: `packages/core/hooks/team-context-inject.cjs`
**Action**: Create
**Source**: `/Users/than/Projects/claudekit/.claude/hooks/team-context-inject.cjs`

Changes from source:
- `require('./lib/ck-config-utils.cjs')` → `require('./lib/epost-config-utils.cjs')`
- `CK_REPORTS_PATH` → `EPOST_REPORTS_PATH` (and all other CK_ → EPOST_)
- `CK_DEBUG` → `EPOST_DEBUG`
- Hook name: `'team-context-inject'`
- `buildCkContext()` → `buildEpostContext()`, section header "CK Context" → "epost Context"
- TEAMS_DIR and TASKS_DIR remain `~/.claude/teams/` and `~/.claude/tasks/`

Behavior: On SubagentStart, detects `name@team-name` pattern in agent_id. If matched, injects peer list + task summary + epost env context. Non-team agents pass through (exit 0 silently).

## Validation

For each hook:
```bash
echo '{}' | node packages/core/hooks/{hook}.cjs
# Should exit 0
```

## Test Considerations

- Unit tests should follow pattern in `packages/core/hooks/__tests__/`
- Test: hook exits 0 when disabled via config
- Test: hook exits 0 when stdin is empty/invalid
- Test: team-context-inject exits 0 when agent_id has no @ (non-team agent)
- Test: task-completed-handler logs to correct path
