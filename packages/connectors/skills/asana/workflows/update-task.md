# Workflow: Update Task

## Step 1 — Find task

If task name/GID provided in argument → use directly.

Otherwise search:
```
mcp__asana__search_tasks:
  workspace_id: "$ASANA_WORKSPACE_GID"
  assignee: "me"
  completed: false
  opt_fields: "name,due_on,memberships.section.name,memberships.project.name"
```

Present results via AskUserQuestion, user picks one.

## Step 2 — Show current state

Display:
```
Task: [name]
Due: [due_on]
Project: [project] | Section: [section]
```

## Step 3 — Select update

AskUserQuestion — what to update:
- Move to section
- Update due date
- Mark complete
- Update notes
- Multiple (select all that apply)

## Step 4 — Gather new values

For "Move to section":
```
mcp__asana__get_project: { project_id: "[project_gid]" }
```
Fetch sections dynamically, present list, user picks target.

For "Update due date": ask for new date (same format as create).

For "Mark complete": confirm once — "Mark [task name] as complete? Yes / Cancel".

## Step 5 — Execute

```
mcp__asana__update_tasks:
  task_id: [gid]
  [updated fields]
  memberships: [{ project: "[gid]", section: "[section_gid]" }]  # if moving
```

## Step 6 — Confirm

```
Updated: [task name]
[field]: [old] → [new]
```
