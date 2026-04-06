# Workflow: Create Task

## Step 1 — Resolve project

Use `$ASANA_DEFAULT_PROJECT_GID` if set. Otherwise:
```
mcp__claude_ai_Asana__get_projects: { workspace_id: "$ASANA_WORKSPACE_GID" }
```
Present project list via AskUserQuestion, user picks one.

## Step 2 — Gather task info

Use `AskUserQuestion` (2 rounds):

**Round 1**:
- Q1 header "Task Name": free text (Other)
- Q2 header "Due Date": `+3 days`, `+7 days`, `+14 days`, Other
  - Calculate: today + N days → `YYYY-MM-DD`

**Round 2** (optional):
- Q3 header "Notes / Link": free text or "Skip"
- Q4 header "Assignee": "Me ($ASANA_USER_GID)", Other (enter GID)

## Step 3 — Preview

Show task preview:
```
Task: [name]
Project: [project name]
Due: [YYYY-MM-DD]
Assignee: [name]
Notes: [text or none]
```

Confirm via AskUserQuestion: "Create this task?" → Yes / Cancel.

## Step 4 — Create

```
mcp__claude_ai_Asana__create_task_confirm:
  name: [task name]
  projects: ["$ASANA_DEFAULT_PROJECT_GID"]
  assignee: "$ASANA_USER_GID"
  due_on: [calculated YYYY-MM-DD]
  notes: [notes or ""]
```

Capture returned task `gid`.

## Step 5 — Confirm

```
Created: [name] (gid: [gid])
Due: [date]
Project: [project name]
Link: https://app.asana.com/0/{project_gid}/{task_gid}
```
