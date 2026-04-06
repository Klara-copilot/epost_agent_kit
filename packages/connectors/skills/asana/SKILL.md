---
name: asana
description: "Use when: user says 'asana', 'create task', 'update task status', 'search asana', 'my asana tasks', 'move task', 'asana board'. Manages Asana tasks generically via MCP."
argument-hint: "create|update|search|list|my-tasks"
allowed-tools:
  - mcp__claude_ai_Asana__create_task_preview
  - mcp__claude_ai_Asana__create_task_confirm
  - mcp__claude_ai_Asana__update_tasks
  - mcp__claude_ai_Asana__get_task
  - mcp__claude_ai_Asana__get_tasks
  - mcp__claude_ai_Asana__get_my_tasks
  - mcp__claude_ai_Asana__search_tasks_preview
  - mcp__claude_ai_Asana__get_me
  - mcp__claude_ai_Asana__get_projects
  - mcp__claude_ai_Asana__get_project
  - mcp__claude_ai_Asana__search_objects
metadata:
  version: "1.0.0"
  keywords: [asana, task-management, project-management]
---

# Asana Connector

Generic Asana task management via MCP. Works with any project/workspace via env vars.

## Env Vars

| Var | Required | Purpose | Fallback |
|-----|----------|---------|---------|
| `ASANA_USER_GID` | Optional | Your user GID | `get_me` API call |
| `ASANA_WORKSPACE_GID` | Optional | Default workspace | First workspace from API |
| `ASANA_DEFAULT_PROJECT_GID` | Optional | Default project for task creation | Prompt user |

## Flags

| Flag | Action | Workflow |
|------|--------|---------|
| `--create` | Create a new task | `workflows/create-task.md` |
| `--update` | Update an existing task | `workflows/update-task.md` |
| `--search` | Search tasks | `workflows/search-tasks.md` |
| `--list` | List tasks in a project | `workflows/search-tasks.md` |
| `--my-tasks` | List my incomplete tasks | `workflows/my-tasks.md` |
| (none) | Ask via AskUserQuestion | — |

No flag → present options: Create Task / Update Task / Search / My Tasks.

## Pre-Flight

1. Load Asana MCP tools via ToolSearch: `"+asana get_me"`
2. Verify auth: call `mcp__claude_ai_Asana__get_me`
3. If auth fails → report error, link to `references/setup.md`

## Safety

- See `references/connector-base.md` for shared safety rules
- Never mutate tasks not assigned to authenticated user
- Never delete tasks (Asana connector is read/create/update only)

## Error Handling

See `references/connector-base.md` error format.
- MCP unavailable → report, suggest checking setup
- Missing project GID → prompt user or use `get_projects` to list options
