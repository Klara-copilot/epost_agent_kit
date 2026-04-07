# Asana Skill

Generic Asana task management for Claude Code via MCP. Create, update, search, and list tasks in any Asana workspace.

---

## Onboard

Run once to set up your workspace profile:

```
/asana --onboard
```

The wizard will:
1. Check for an existing profile (offers to overwrite if found)
2. Verify MCP connection
3. Fetch your Asana profile via `get_me`
4. Ask you to pick a workspace
5. Ask you to pick a team (or skip)
6. Ask you to pick the projects you work on (multi-select)
7. Ask you to set a default project
8. Write the profile to `.claude/skills/asana/asana-profile.json`

---

## Usage

```
/asana --onboard
```
Re-run first-time onboard

```
/asana --create
```
Create a new task

```
/asana --update
```
Update an existing task

```
/asana --search
```
Search tasks by keyword

```
/asana --my-tasks
```
Show my incomplete tasks

---

## Profile Cache

The `--onboard` wizard writes a profile file so subsequent commands skip redundant API calls:

- **Project-level:** `{project_root}/.claude/skills/asana/asana-profile.json`
- **User-level (global fallback):** `~/.claude/skills/asana/asana-profile.json`

The profile is automatically gitignored. See `references/asana-profile.example.json` for the expected schema.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Asana MCP is not connected" | Check MCP config, restart Claude |
| "Auth failed" | Regenerate PAT, update MCP config |
| "Profile not found" | Run `/asana --onboard` |
| Wrong workspace/project | Re-run `/asana --onboard` to reset profile |
