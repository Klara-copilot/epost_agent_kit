---
name: asana
description: "Use when: user says 'asana', 'create task', 'update task status', 'search asana', 'my asana tasks', 'move task', 'asana board', 'onboard asana'. Manages Asana tasks generically via MCP."
argument-hint: "create|update|search|list|my-tasks|--onboard"
allowed-tools:
  - mcp__asana__create_tasks
  - mcp__asana__update_tasks
  - mcp__asana__get_task
  - mcp__asana__get_tasks
  - mcp__asana__get_my_tasks
  - mcp__asana__search_tasks
  - mcp__asana__get_me
  - mcp__asana__get_projects
  - mcp__asana__get_project
  - mcp__asana__get_teams
  - mcp__asana__search_objects
metadata:
  version: "2.0.0"
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
| `--onboard` | First-time guided setup | `workflows/onboard.md` |
| `--create` | Create a new task | `workflows/create-task.md` |
| `--update` | Update an existing task | `workflows/update-task.md` |
| `--search` | Search tasks | `workflows/search-tasks.md` |
| `--list` | List tasks in a project | `workflows/search-tasks.md` |
| `--my-tasks` | List my incomplete tasks | `workflows/my-tasks.md` |
| (none) | Ask via AskUserQuestion | — |

No flag → present options: Create Task / Update Task / Search / My Tasks / Onboard.

## Pre-Flight

1. If `--onboard` flag → skip pre-flight, go directly to `workflows/onboard.md`
2. Check for cached profile (first match wins):
   - `{project_root}/.claude/skills/asana/asana-profile.json`
   - `~/.claude/skills/asana/asana-profile.json`
3. Load Asana MCP tools via ToolSearch: `"+asana get_me"`
4. Verify auth: call `mcp__asana__get_me`
5. If auth fails OR profile missing → offer onboard:
   ```
   Asana profile not found. Run /asana --onboard to configure your account.
   Or visit: https://developers.asana.com/docs/connecting-mcp-clients-to-asanas-v2-server#claude-code
   ```
6. If profile exists, use cached `gid`, `workspace_gid`, `default_project_gid`, `projects[]` — skip API lookups for those values

## Safety

- See `references/connector-base.md` for shared safety rules
- Never mutate tasks not assigned to authenticated user
- Never delete tasks (Asana connector is read/create/update only)

## Error Handling

See `references/connector-base.md` error format.
- MCP unavailable → report, link to https://developers.asana.com/docs/connecting-mcp-clients-to-asanas-v2-server#claude-code
- Missing project GID → prompt user or use `get_projects` to list options
- Profile missing → offer `--onboard` prompt before failing
