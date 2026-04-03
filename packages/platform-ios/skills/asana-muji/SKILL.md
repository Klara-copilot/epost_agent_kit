---
name: asana-muji
description: "Asana workflow for MUJI iOS projects. Create tasks across iOS Libraries + MUJI Tasks + MUJI Plan, update task status with auto-sync across boards. Use when user says 'create task', 'new task', 'update status', 'move task', 'asana', 'muji task', 'board update', 'my tasks', or wants to manage Asana tasks for MUJI iOS work. Triggers on any Asana task management request in this project."
argument-hint: "create|status|my-tasks"
metadata:
  author: phuong-doan
  version: "1.0.0"
  keywords:
    - asana
    - task-management
    - muji
    - workflow
    - ios-project
  triggers:
    - /asana
    - create asana task
    - update asana status
    - move task on board
---

# Asana MUJI — iOS Task Workflow

Manage tasks across 3 linked Asana projects for MUJI iOS development.

## Scope & Safety

This skill operates on these 3 projects ONLY:
- **iOS Libraries** (main) — `1207773169815446`
- **MUJI Tasks** — `1176686389740521`
- **MUJI Plan** — `1184227957274218`

**MANDATORY SAFETY RULES:**
- NEVER delete any task
- NEVER update/edit tasks NOT assigned to me (PhuongDoan, GID: `1207699335267611`)
- Always verify `assignee.gid == 1207699335267611` before any mutation
- Load Asana MCP tools via `ToolSearch` before calling them

## Project Sections

### iOS Libraries (module-based, no status flow)
| Section | GID |
|---------|-----|
| ios_theme_showcase | `1207773169815450` |
| ios_theme_ui | `1207773169815451` |
| ePost <> Bottom Menu Bar | `1209604293257010` |

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
