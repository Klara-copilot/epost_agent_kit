# Workflow: Create Task

## Step 1 — Gather info

Use `AskUserQuestion` (2 rounds):

**Round 1** (2 questions):
- Q1 header "Task Name": free text (user types via Other)
  - Options: placeholder only, e.g. "[Vien-Comp] Component Name", "[ThemeUI] Feature Name"
- Q2 header "Module": `theme-ui (Recommended)`, `theme-ui-showcase`, `theme-ui >< ePost`, `MUJI >< ePost`, `theme-ui >< ePost Mock app`

**Round 2** (2 questions):
- Q3 header "Due Date": `+3 days`, `+7 days`, `+14 days`, Other (user types number)
  - Calculate: today + N days → `YYYY-MM-DD`
- Q4 header "Figma": `No Figma link`, Other (user pastes URL)

## Step 2 — Create in Android Libraries

```
mcp__asana__create_tasks:
  name: [task name]
  projects: ["1210248345341985"]
  assignee: "1210221850073452"
  due_on: [calculated YYYY-MM-DD]
  notes: [Figma URL or empty]
```

Capture returned task `gid`.

## Step 3 — Move to module section in Android Libraries

Move task to chosen section (theme-ui default: `1210434600893748`).

## Step 4 — Multi-home to MUJI Tasks + MUJI Plan

```
mcp__asana__update_tasks:
  task_id: [gid]
  addProjects: ["1176686389740521", "1184227957274218"]
```

Then move to initial sections:
- MUJI Tasks → TO DO (`1176686389740524`)
- MUJI Plan → New Requests (`1184227957274234`)

## Step 5 — Confirm

```
Task created: [name]
Due: [date]
Android Libraries: [section]
MUJI Tasks: TO DO
MUJI Plan: New Requests
Figma: [URL or none]
```
