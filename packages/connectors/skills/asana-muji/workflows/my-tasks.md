# Workflow: My Tasks (MUJI)

## Step 1 — Fetch incomplete tasks

```
mcp__claude_ai_Asana__search_tasks_preview:
  projects_any: "$ASANA_IOS_LIBRARIES_GID"
  assignee: "$ASANA_USER_GID"
  completed: false
  opt_fields: "name,due_on,memberships.section.name,memberships.project.gid"
  sort_by: "due_date"
  sort_ascending: true
```

## Step 2 — Display as table

Columns: #, Task, Due, Module (iOS Libraries section), Status (MUJI Tasks section).

Highlight overdue tasks (due_on < today) with `[OVERDUE]` prefix.

```
| # | Task | Due | Module | Status |
|---|------|-----|--------|--------|
| 1 | [name] | [date] | ios_theme_ui | IN PROGRESS |
```

Show summary: "X tasks total (Y overdue)"

## Step 3 — Follow-up (optional)

AskUserQuestion:
- Update a task status → dispatch `workflows/update-status.md`
- Done
