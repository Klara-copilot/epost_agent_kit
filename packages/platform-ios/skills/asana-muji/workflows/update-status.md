# Workflow: Update Status

## Step 1 — Fetch my tasks

```
mcp__asana__search_tasks:
  projects_any: "1207773169815446"
  assignee_any: "me"
  completed: false
  opt_fields: "name,due_on,memberships.section.name"
  sort_by: "due_date"
  sort_ascending: true
```

## Step 2 — Select task

Present task list via `AskUserQuestion`. User picks one.

## Step 3 — Select transition

Simple 3-step model. Show only valid transitions based on current MUJI Tasks section:

| Current State | Available Action | MUJI Tasks | MUJI Plan |
|--------------|-----------------|-----------|-----------|
| TO DO | **Start Work** | → IN PROGRESS (`1176695177250162`) | → In progress (`1199525853631481`) |
| IN PROGRESS | **Complete** | → DONE (`1177202920874126`) | → Done (`1199525853631508`) |
| DONE | **Mark Completed** | (mark checkbox) | (mark checkbox) |

## Step 4 — Execute

Move task to target sections in both MUJI Tasks and MUJI Plan.
For "Mark Completed": `mcp__asana__update_tasks` with `completed: true`.

## Step 5 — Confirm

```
Updated: [task name]
MUJI Tasks: [old] → [new]
MUJI Plan: [old] → [new]
```
