# Slack MCP — Setup

## Claude Desktop MCP Config

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "claude_ai_Slack": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    }
  }
}
```

## Env Vars

| Var | Description | How to find |
|-----|-------------|------------|
| `SLACK_BOT_TOKEN` | Bot OAuth token (MCP server) | Slack App settings → OAuth & Permissions |
| `SLACK_TEAM_ID` | Workspace/team ID | Slack URL: `app.slack.com/client/{team_id}/...` |
| `SLACK_DEFAULT_CHANNEL` | Default channel for messages | Channel name (e.g. `general`) or ID (`C0XXXXXXXXX`) |
| `SLACK_WORKSPACE` | Workspace identifier | Team ID or workspace name |

## Verification

After setup, confirm auth by reading a public channel:

```
ToolSearch: "select:mcp__claude_ai_Slack__slack_read_channel"
→ call slack_read_channel with channel: "general" (or any public channel)
→ expect: list of recent messages
```

If you see an error, check:
1. `SLACK_BOT_TOKEN` starts with `xoxb-`
2. Bot has been added to the channel (`/invite @bot-name`)
3. Bot has required OAuth scopes: `channels:read`, `channels:history`, `chat:write`
