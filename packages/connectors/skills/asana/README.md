# Asana Skill

Generic Asana task management for Claude Code via MCP. Create, update, search, and list tasks in any Asana workspace.

---

## Prerequisites

- Claude Code CLI installed
- An Asana account
- Node.js (for running the MCP server via `npx`)

---

## Setup

### Option A — `--onboard` Wizard (Recommended)

Run the guided onboard after completing the MCP config below:

```
/asana --onboard
```

The wizard will:
1. Verify your MCP connection
2. Fetch your Asana profile via `get_me`
3. Ask you to pick a workspace, team, and projects
4. Write a cached profile to `.claude/skills/asana/asana-profile.json`

### Option B — Manual Setup

#### 1. Create a Personal Access Token (PAT)

1. Log in to Asana → click your profile photo → **My Settings**
2. Go to **Apps** → **Personal Access Tokens**
3. Click **+ New access token**, give it a name, copy the token

#### 2. Configure the MCP Server

Add to your `claude_desktop_config.json` (or Claude Code MCP settings):

```json
{
  "mcpServers": {
    "asana": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-asana"],
      "env": {
        "ASANA_ACCESS_TOKEN": "your_personal_access_token"
      }
    }
  }
}
```

Restart Claude Desktop / Claude Code after saving.

#### 3. Set Environment Variables (Optional)

These vars skip API lookups and speed up every command:

| Var | Required | How to find |
|-----|----------|-------------|
| `ASANA_ACCESS_TOKEN` | Yes (MCP) | Asana → My Settings → Apps → Personal Access Tokens |
| `ASANA_USER_GID` | No | Call `get_me`, use the `gid` field |
| `ASANA_WORKSPACE_GID` | No | `get_me` → `workspaces[0].gid` |
| `ASANA_DEFAULT_PROJECT_GID` | No | Asana project URL: `asana.com/0/{project_gid}/...` |

Add to your shell profile (`.zshrc`, `.bashrc`, etc.) or to your project's `.env` file.

#### 4. Verify Connection

```
/asana --my-tasks
```

If you see your tasks, you're connected. If auth fails, check:
- `ASANA_ACCESS_TOKEN` is set in MCP config
- MCP server is running (restart Claude Desktop)
- Token has not expired

---

## Usage

```
/asana --create      # Create a new task
/asana --update      # Update an existing task
/asana --search      # Search tasks by keyword
/asana --list        # List tasks in a project
/asana --my-tasks    # Show my incomplete tasks
/asana --onboard     # Re-run first-time onboard
/asana               # Interactive menu
```

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
| "Asana MCP is not connected" | Add MCP config, restart Claude |
| "Auth failed" | Regenerate PAT, update MCP config |
| "Profile not found" | Run `/asana --onboard` |
| Wrong workspace/project | Re-run `/asana --onboard` to reset profile |

Full MCP setup guide: https://developers.asana.com/docs/connecting-mcp-clients-to-asanas-v2-server#claude-code
