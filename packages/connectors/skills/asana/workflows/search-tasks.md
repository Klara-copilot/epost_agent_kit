# Workflow: Search Tasks

## Step 1 — Gather search criteria

If argument provides search term → use directly.

Otherwise AskUserQuestion:
- Q1 "Search by": Name / Assignee / Project / All incomplete / Custom

For "Name": ask for keyword.
For "Assignee": ask for GID or "me".
For "Project": use `get_projects` to list, user picks.

## Step 2 — Search

```
mcp__claude_ai_Asana__search_tasks_preview:
  workspace_id: "$ASANA_WORKSPACE_GID"
  text: [keyword]              # if searching by name
  assignee: [gid or "me"]     # if filtering by assignee
  projects_any: [project_gid] # if filtering by project
  completed: false             # default: incomplete only
  opt_fields: "name,due_on,completed,assignee.name,memberships.section.name,memberships.project.name"
  sort_by: "due_date"
  sort_ascending: true
```

## Step 3 — Display results

Output as table:
```
| # | Task | Project | Section | Due | Assignee |
|---|------|---------|---------|-----|---------|
| 1 | ... | ... | ... | ... | ... |
```

Highlight overdue tasks (due_on < today).

If no results → "No tasks found matching [criteria]. Try broader search terms."

## Step 4 — Follow-up (optional)

AskUserQuestion: "Do anything with these results?"
- Update a task → dispatch `workflows/update-task.md`
- Nothing — done
