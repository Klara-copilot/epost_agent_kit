# Workflow: Create Task

## Step 1 — Resolve project

If profile `projects[]` is non-empty → present as shortlist via AskUserQuestion:
```
Header: "Project"
Options: [project.name for each profile.projects] + "Other (browse all)"
```
If user picks "Other (browse all)" or profile has no projects:
```
mcp__asana__get_projects: { workspace_id: "$ASANA_WORKSPACE_GID" }
```
Present full project list via AskUserQuestion.

Capture resolved `project_gid` and `project_name`.

## Step 2 — Fetch sections

```
mcp__asana__get_project: { project_id: "[project_gid]" }
```

Extract sections list from response. Build section options for Round 1.

## Step 3 — Gather task info

Use `AskUserQuestion` (2 rounds):

**Round 1**:
- Q1 header "Task Name": free text (Other)
- Q2 header "Section": options from project sections + "No section"

**Round 2**:
- Q3 header "Due Date": `+3 days`, `+7 days`, `+14 days`, Other
  - Calculate: today + N days → `YYYY-MM-DD`
- Q4 header "Link / Notes": free text or "Skip"

## Step 4 — Preview

Show task preview:
```
Task: [name]
Project: [project name]
Section: [section name or none]
Due: [YYYY-MM-DD]
Link: [URL or none]
```

Confirm via AskUserQuestion: "Create this task?" → Yes / Cancel.

## Step 5 — Create

```
mcp__asana__create_tasks:
  name: [task name]
  projects: ["[project_gid]"]
  assignee: "$ASANA_USER_GID"
  due_on: [calculated YYYY-MM-DD]
  start_on: [today YYYY-MM-DD]
  notes: [link/notes or ""]
```

Capture returned task `gid`.

## Step 6 — Move to section (if selected)

Skip if user chose "No section".

```
mcp__asana__update_tasks:
  task_id: [gid]
  memberships: [{ project: "[project_gid]", section: "[section_gid]" }]
```

## Step 7 — Multi-home to MUJI Tasks + MUJI Plan

```
mcp__asana__update_tasks:
  task_id: [gid]
  addProjects: ["1176686389740521", "1184227957274218"]
```

Move to initial sections:
- MUJI Tasks (`1176686389740521`) → find section named `"TO DO"`
- MUJI Plan (`1184227957274218`) → find section named `"New Requests"`

```
mcp__asana__update_tasks:
  task_id: [gid]
  memberships: [
    { project: "1176686389740521", section: "[TO DO section gid]" },
    { project: "1184227957274218", section: "[New Requests section gid]" }
  ]
```

Execute silently. If section not found, skip placement (task is already in the project).

## Step 8 — Confirm

```
Created: [name]
Project: [project name]
Section: [section name or none]
Due: [date]
Start: [today]
Link: [URL or none]
Asana: https://app.asana.com/0/[project_gid]/[task_gid]
MUJI Tasks: TO DO
MUJI Plan: New Requests
```
