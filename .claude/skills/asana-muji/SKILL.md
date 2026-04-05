---
name: asana-muji
description: "Use when: 'create task', 'update status', 'move task', 'asana', 'muji task', 'board update', 'my tasks'. MUJI-specific Asana workflow across iOS Libraries, MUJI Tasks, and MUJI Plan boards."
argument-hint: "create|status|my-tasks"
allowed-tools:
  - mcp__claude_ai_Asana__create_task_preview
  - mcp__claude_ai_Asana__create_task_confirm
  - mcp__claude_ai_Asana__update_tasks
  - mcp__claude_ai_Asana__get_task
  - mcp__claude_ai_Asana__search_tasks_preview
  - mcp__claude_ai_Asana__get_me
metadata:
  version: "2.0.0"
  keywords: [asana, task-management, muji, workflow]
---

# Asana MUJI — Task Workflow

Manage tasks across 3 linked MUJI Asana projects. All project/section GIDs supplied via env vars.

## Env Vars

See `references/env-vars.md` for the full list and how to find each GID.

| Var | Purpose |
|-----|---------|
| `ASANA_USER_GID` | Your Asana user GID (required) |
| `ASANA_IOS_LIBRARIES_GID` | iOS Libraries project |
| `ASANA_MUJI_TASKS_GID` | MUJI Tasks kanban |
| `ASANA_MUJI_PLAN_GID` | MUJI Plan project |
| `ASANA_SECTION_TODO_GID` | MUJI Tasks → TO DO |
| `ASANA_SECTION_INPROGRESS_GID` | MUJI Tasks → IN PROGRESS |
| `ASANA_SECTION_DONE_GID` | MUJI Tasks → DONE |
| `ASANA_SECTION_NEW_REQUESTS_GID` | MUJI Plan → New Requests |
| `ASANA_SECTION_IN_PROGRESS_GID` | MUJI Plan → In progress |
| `ASANA_SECTION_INTEGRATION_GID` | MUJI Plan → Integration |
| `ASANA_SECTION_TEST_GID` | MUJI Plan → Test |
| `ASANA_SECTION_PLAN_DONE_GID` | MUJI Plan → Done |
| `ASANA_SECTION_IOS_THEME_SHOWCASE_GID` | iOS Libraries → ios_theme_showcase |
| `ASANA_SECTION_IOS_THEME_UI_GID` | iOS Libraries → ios_theme_ui |
| `ASANA_SECTION_EPOST_BOTTOM_MENU_GID` | iOS Libraries → ePost Bottom Menu Bar |

## Safety

- NEVER delete any task
- NEVER mutate tasks not assigned to `$ASANA_USER_GID`
- Always verify `assignee.gid == $ASANA_USER_GID` before any mutation
- Load Asana MCP tools via ToolSearch before calling them

## Arguments

| Arg | Action | Workflow |
|-----|--------|---------|
| `create` | Create task across all 3 projects | `workflows/create-task.md` |
| `status` | Update task status with cross-project sync | `workflows/update-status.md` |
| `my-tasks` | List my incomplete tasks | `workflows/my-tasks.md` |
| (none) | AskUserQuestion: Create Task / Update Status / My Tasks | — |

## Pre-Flight

1. Load Asana MCP tools via ToolSearch: `"+asana get_me"`
2. Verify env vars are set (see `references/env-vars.md`)
3. If `ASANA_USER_GID` missing → call `get_me`, use returned GID
