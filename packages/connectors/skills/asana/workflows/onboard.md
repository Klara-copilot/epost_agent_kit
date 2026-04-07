# Workflow: Onboard

First-time guided setup. Fetches user profile via MCP, asks for workspace, team, and projects, then writes a cached profile (v2) to `.claude/skills/asana/asana-profile.json`.

## Pre-check — Existing profile

Check for cached profile (first match wins):
- `{project_root}/.claude/skills/asana/asana-profile.json`
- `~/.claude/skills/asana/asana-profile.json`

If found → prompt via AskUserQuestion:
```
Header: "Existing Profile Found"
Question: "An Asana profile already exists. Overwrite it?"
Options: ["Yes, re-run onboard", "Cancel"]
```
If "Cancel" → stop.

## Pre-check — Verify MCP tools are available

```
ToolSearch: "select:mcp__asana__get_me"
```

If tools are unavailable → show setup link and stop:

```
Asana MCP is not connected. Configure it first:
→ https://developers.asana.com/docs/connecting-mcp-clients-to-asanas-v2-server#claude-code
```

## Step 1 — Fetch user profile

```
mcp__asana__get_me: {}
```

On auth failure → show link and stop:

```
Auth failed. Check your ASANA_ACCESS_TOKEN, then re-run --onboard.
→ https://developers.asana.com/docs/connecting-mcp-clients-to-asanas-v2-server#claude-code
```

On success: capture `gid`, `name`, `email`, `workspaces[]`.

## Step 2 — Resolve workspace

Resolve display names first:

For each workspace where `name` is empty or null, call:
```
mcp__asana__get_teams: { organization_id: workspace.gid }
```
Use the `organization.name` from the teams response as the workspace display name.
If still unavailable, label as `"Workspace (GID: {gid})"`.

Present via AskUserQuestion:
```
Header: "Workspace"
Options: ["{name} (GID: {gid})" for each workspace, using resolved name]
```

**Never show GID-only options** — always include a human-readable name.

Capture selected `workspace_gid` (parse gid from the selected option).

## Step 3 — Resolve team

```
mcp__asana__get_teams: { organization_id: workspace_gid }
```

Present via AskUserQuestion:

```
Header: "Your Team"
Options: [team.name for each team] + "Skip (no team)"
```

If "Skip" → `team_gid = null`, `team_name = null`.
Otherwise → capture selected `team_gid`, `team_name`.

## Step 4 — Resolve projects

```
mcp__asana__get_projects: { workspace_id: workspace_gid }
```

Filter client-side: if `team_gid` is set, prefer projects where `team.gid == team_gid` (show team projects first, then remaining).

Present via AskUserQuestion (multi-select):

```
Header: "Projects You Work On"
Options: [project.name for each project]
multiSelect: true
```

Capture selected as `projects: [{ gid, name }]`.

If no projects selected → `projects = []`.

## Step 5 — Resolve default project

Skip if `projects` is empty → `default_project_gid = null`.

Otherwise present via AskUserQuestion:

```
Header: "Default Project"
Options: [project.name for each selected project] + "None"
```

Capture selected `default_project_gid` (must be one of `projects[].gid`, or null if "None").

## Step 6 — Persist profile

Determine write path:
1. If running inside a git repo → `{project_root}/.claude/skills/asana/asana-profile.json`
2. Otherwise → `~/.claude/skills/asana/asana-profile.json`

Create parent directory if it doesn't exist.

Write JSON:

```json
{
  "version": 2,
  "gid": "<user_gid>",
  "name": "<user_name>",
  "email": "<user_email>",
  "workspace_gid": "<workspace_gid>",
  "team_gid": "<team_gid_or_null>",
  "team_name": "<team_name_or_null>",
  "projects": [
    { "gid": "<project_gid>", "name": "<project_name>" }
  ],
  "default_project_gid": "<project_gid_or_null>"
}
```

**Invariant:** `default_project_gid` MUST be one of `projects[].gid`, or null.

## Step 7 — Confirm

```
Onboard complete!
Profile saved to: .claude/skills/asana/asana-profile.json

  Name:      [name]
  Email:     [email]
  Workspace: [workspace_name] ([workspace_gid])
  Team:      [team_name or "none"]
  Projects:  [project names joined by ", " or "none"]
  Default:   [default project name or "none"]

Run /asana to start managing tasks.
```
