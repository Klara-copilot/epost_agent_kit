# Workflow: My Tasks

## Step 1 — Fetch incomplete tasks

```
mcp__asana__search_tasks:
  projects_any: "1210248345341985"
  assignee_any: "1210221850073452"
  completed: false
  opt_fields: "name,due_on,memberships.section.name"
  sort_by: "due_date"
  sort_ascending: true
```

## Step 2 — Display as table

Columns: #, Task, Due, Module (Android Libraries section), Status (MUJI Tasks section).

Highlight overdue tasks (due_on < today).
