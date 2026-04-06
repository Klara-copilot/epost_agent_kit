# Workflow: Create Task (MUJI)

Creates a task in iOS Libraries and multi-homes it to MUJI Tasks + MUJI Plan.

## Step 1 — Gather info

Use `AskUserQuestion` (2 rounds):

**Round 1**:
- Q1 header "Task Name": free text (e.g. "[Vien-Comp] Component Name", "[ThemeUI] Feature Name")
- Q2 header "Module": `ios_theme_ui (Recommended)`, `ios_theme_showcase`, `ePost <> Bottom Menu Bar`

**Round 2**:
- Q3 header "Due Date": `+3 days`, `+7 days`, `+14 days`, Other (user types number)
  - Calculate: today + N days → `YYYY-MM-DD`
- Q4 header "Figma": `No Figma link`, Other (user pastes URL)

## Step 2 — Create in iOS Libraries

```
mcp__claude_ai_Asana__create_task_confirm:
  name: [task name]
  projects: ["$ASANA_IOS_LIBRARIES_GID"]
  assignee: "$ASANA_USER_GID"
  due_on: [calculated YYYY-MM-DD]
  notes: [Figma URL or ""]
```

Capture returned task `gid`.

## Step 3 — Move to module section in iOS Libraries

Move task to chosen section:
- `ios_theme_ui` → `$ASANA_SECTION_IOS_THEME_UI_GID`
- `ios_theme_showcase` → `$ASANA_SECTION_IOS_THEME_SHOWCASE_GID`
- `ePost <> Bottom Menu Bar` → `$ASANA_SECTION_EPOST_BOTTOM_MENU_GID`

```
mcp__claude_ai_Asana__update_tasks:
  task_id: [gid]
  memberships: [{ project: "$ASANA_IOS_LIBRARIES_GID", section: "[chosen section gid]" }]
```

## Step 4 — Multi-home to MUJI Tasks + MUJI Plan

```
mcp__claude_ai_Asana__update_tasks:
  task_id: [gid]
  addProjects: ["$ASANA_MUJI_TASKS_GID", "$ASANA_MUJI_PLAN_GID"]
```

Move to initial sections:
- MUJI Tasks → TO DO (`$ASANA_SECTION_TODO_GID`)
- MUJI Plan → New Requests (`$ASANA_SECTION_NEW_REQUESTS_GID`)

## Step 5 — Confirm

```
Task created: [name]
Due: [date]
iOS Libraries: [section name]
MUJI Tasks: TO DO
MUJI Plan: New Requests
Figma: [URL or none]
```
