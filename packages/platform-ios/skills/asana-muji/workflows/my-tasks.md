# Workflow: My Tasks

## Step 1 — Fetch incomplete tasks

```
mcp__asana__search_tasks:
  projects_any: "1207773169815446"
  assignee_any: "me"
  completed: false
  opt_fields: "name,due_on,memberships.section.name"
  sort_by: "due_date"
  sort_ascending: true
```

## Step 2 — Display as table

Columns: #, Task, Due, Module (iOS Libraries section), Status (MUJI Tasks section).

Highlight overdue tasks (due_on < today).
