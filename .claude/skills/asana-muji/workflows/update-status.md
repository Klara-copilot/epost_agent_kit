# Workflow: Update Status (MUJI)

## Step 1 — Fetch my tasks in iOS Libraries

```
mcp__claude_ai_Asana__search_tasks_preview:
  workspace_id: (from get_me if ASANA_WORKSPACE_GID not set)
  projects_any: "$ASANA_IOS_LIBRARIES_GID"
  assignee: "$ASANA_USER_GID"
  completed: false
  opt_fields: "name,due_on,memberships.section.name,memberships.section.gid,memberships.project.gid"
  sort_by: "due_date"
  sort_ascending: true
```

## Step 2 — Select task

Present task list via `AskUserQuestion`. User picks one.

## Step 3 — Select transition

Determine current MUJI Tasks section. Show valid transitions:

| Current State | Available Action | MUJI Tasks | MUJI Plan |
|--------------|-----------------|-----------|-----------|
| TO DO | **Start Work** | → IN PROGRESS (`$ASANA_SECTION_INPROGRESS_GID`) | → In progress (`$ASANA_SECTION_IN_PROGRESS_GID`) |
| IN PROGRESS | **Complete** | → DONE (`$ASANA_SECTION_DONE_GID`) | → Done (`$ASANA_SECTION_PLAN_DONE_GID`) |
| DONE | **Mark Completed** | (mark checkbox) | (mark checkbox) |

## Step 4 — Execute

Move task to target sections in both MUJI Tasks and MUJI Plan:

```
mcp__claude_ai_Asana__update_tasks:
  task_id: [gid]
  memberships: [
    { project: "$ASANA_MUJI_TASKS_GID", section: "[target section gid]" },
    { project: "$ASANA_MUJI_PLAN_GID", section: "[target section gid]" }
  ]
```

For "Mark Completed":
```
mcp__claude_ai_Asana__update_tasks:
  task_id: [gid]
  completed: true
```

## Step 5 — Confirm

```
Updated: [task name]
MUJI Tasks: [old section] → [new section]
MUJI Plan: [old section] → [new section]
```
