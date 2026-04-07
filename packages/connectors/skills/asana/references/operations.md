# Asana MCP Operations Reference

All tools use the `mcp__asana__` prefix. Load via ToolSearch before calling.

## Read Operations

| Tool | Key Parameters | Notes |
|------|---------------|-------|
| `get_me` | — | Returns authenticated user info (gid, name, email, workspaces) |
| `get_task` | `task_id` | Single task details |
| `get_tasks` | `project_id`, `completed`, `opt_fields` | Tasks in a project |
| `get_my_tasks` | `workspace_id`, `completed`, `opt_fields` | Authenticated user's tasks |
| `get_project` | `project_id` | Project details + sections |
| `get_projects` | `workspace_id` | All projects in workspace |
| `get_teams` | `organization_id` | All teams in workspace |

## Write Operations

| Tool | Key Parameters | Notes |
|------|---------------|-------|
| `create_tasks` | `name`, `projects`, `assignee`, `due_on`, `notes` | Creates the task |
| `update_tasks` | `task_id`, `name`, `due_on`, `completed`, `memberships` | Update task fields, move to section |
| `add_comment` | `task_id`, `text` | Add comment to task |

## Search Operations

| Tool | Key Parameters | Notes |
|------|---------------|-------|
| `search_tasks` | `workspace_id`, `text`, `assignee`, `projects_any`, `completed` | Search with filters |
| `search_objects` | `workspace_id`, `query`, `resource_type` | Generic search |

## Sections & Membership

To move a task to a section, use `update_tasks` with `memberships`:
```json
{
  "task_id": "...",
  "memberships": [{ "project": "$PROJECT_GID", "section": "$SECTION_GID" }]
}
```

## opt_fields Common Values

```
name, due_on, completed, assignee.name, assignee.gid,
memberships.section.name, memberships.section.gid,
memberships.project.name, notes
```
