# Workflow: My Tasks

## Step 1 — Resolve user GID

Use `$ASANA_USER_GID` if set. Otherwise:
```
mcp__claude_ai_Asana__get_me: {}
```
Capture `gid` from response.

## Step 2 — Fetch incomplete tasks

```
mcp__claude_ai_Asana__get_my_tasks:
  workspace_id: "$ASANA_WORKSPACE_GID"
  completed: false
  opt_fields: "name,due_on,memberships.section.name,memberships.project.name"
```

If `ASANA_DEFAULT_PROJECT_GID` set → also filter by project:
```
mcp__claude_ai_Asana__search_tasks_preview:
  projects_any: "$ASANA_DEFAULT_PROJECT_GID"
  assignee: "$ASANA_USER_GID"
  completed: false
  opt_fields: "name,due_on,memberships.section.name,memberships.project.name"
  sort_by: "due_date"
  sort_ascending: true
```

## Step 3 — Display as table

```
| # | Task | Project | Section | Due |
|---|------|---------|---------|-----|
| 1 | ... | ... | ... | ... |
```

Highlight overdue tasks (due_on < today) with `[OVERDUE]` prefix.

Show count: "X tasks (Y overdue)"

## Step 4 — Follow-up (optional)

AskUserQuestion: "Update a task?"
- Yes → dispatch `workflows/update-task.md`
- No — done
