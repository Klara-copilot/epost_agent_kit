---
name: asana-muji
description: "Asana workflow for MUJI Android projects. Create tasks across Android Libraries + MUJI Tasks + MUJI Plan, update task status with auto-sync across boards. Use when user says 'create task', 'new task', 'update status', 'move task', 'asana', 'muji task', 'board update', 'my tasks', or wants to manage Asana tasks for MUJI Android work. Triggers on any Asana task management request in this project."
argument-hint: "create|status|my-tasks"
metadata:
  author: tan-le
  version: "1.0.0"
---

# Asana MUJI — Android Task Workflow

Manage tasks across 3 linked Asana projects for MUJI Android development.

## Scope & Safety

This skill operates on these 3 projects ONLY:

- **Android Libraries** (main) — `1210248345341985`
- **MUJI Tasks** — `1176686389740521`
- **MUJI Plan** — `1184227957274218`

**MANDATORY SAFETY RULES:**

- NEVER delete any task
- NEVER update/edit tasks NOT assigned to me (Tan Le Ngoc Minh, GID: `1210221850073452`)
- Always verify `assignee.gid == 1210221850073452` before any mutation
- Load Asana MCP tools via `ToolSearch` before calling them

## Project Sections

### Android Libraries (module-based, no status flow)

| Section | GID |
|---------|-----|
| theme-ui | `1210434600893748` |
| theme-ui-showcase | `1210434600893751` |
| theme-ui >< ePost | `1210644791543113` |
| MUJI >< ePost | `1211310907614996` |
| theme-ui >< ePost Mock app | `1213548208880455` |

### MUJI Tasks (3-step kanban)

| Section | GID |
|---------|-----|
| TO DO | `1176686389740524` |
| IN PROGRESS | `1176695177250162` |
| DONE | `1177202920874126` |

### MUJI Plan (5-step workflow)

| Section | GID |
|---------|-----|
| New Requests | `1184227957274234` |
| In progress | `1199525853631481` |
| Integration | `1199525853631509` |
| Test | `1199525853631505` |
| Done | `1199525853631508` |

## Arguments

| Arg | Action | Workflow File |
|-----|--------|---------------|
| `create` | Create new task across all 3 projects | `workflows/create-task.md` |
| `status` | Update task status with cross-project sync | `workflows/update-status.md` |
| `my-tasks` | List my incomplete tasks | `workflows/my-tasks.md` |
| (none) | Present options via `AskUserQuestion` | — |

No arguments → ask via `AskUserQuestion` with header "Asana MUJI", options: Create Task / Update Status / My Tasks.

## MCP Tools Required

Before any Asana operation, load tools:

```
ToolSearch: "select:mcp__asana__create_tasks,mcp__asana__update_tasks,mcp__asana__search_tasks,mcp__asana__get_task"
```

## Workflow Dispatch

Load the corresponding workflow file based on argument, then follow its steps.

## Error Handling

- Task not assigned to me → abort with warning, do not proceed
- MCP tool unavailable → report error, suggest manual Asana update
- Section move fails → report error, do not retry blindly
- Unknown section → list valid sections, ask user to pick
