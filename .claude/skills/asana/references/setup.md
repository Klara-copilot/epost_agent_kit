# Asana MCP — Setup

## Claude Desktop MCP Config

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "claude_ai_Asana": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-asana"],
      "env": {
        "ASANA_ACCESS_TOKEN": "your_personal_access_token"
      }
    }
  }
}
```

## Env Vars

| Var | Description | How to find |
|-----|-------------|------------|
| `ASANA_ACCESS_TOKEN` | Personal access token (MCP server) | Asana → My Profile Settings → Apps → Personal Access Tokens |
| `ASANA_USER_GID` | Your user GID | Call `get_me`, use the `gid` field |
| `ASANA_WORKSPACE_GID` | Default workspace GID | `get_me` → `workspaces[0].gid` |
| `ASANA_DEFAULT_PROJECT_GID` | Default project GID | Asana project URL: `asana.com/0/{project_gid}/...` |

## Verification

After setup, confirm auth:

```
ToolSearch: "select:mcp__claude_ai_Asana__get_me"
→ call get_me
→ expect: { gid: "...", name: "Your Name", email: "..." }
```

If you see an error, check:
1. `ASANA_ACCESS_TOKEN` is set correctly in MCP config
2. MCP server is running (restart Claude Desktop)
3. Token has not expired (generate a new one)
