# Connector Base — Shared Patterns

Shared reference for all connector skills. Load before executing any connector workflow.

## ToolSearch Loading Pattern

Load MCP tools via ToolSearch before any operation. Use `select:` for known tools:

```
ToolSearch: "select:mcp__asana__get_me"                        # Asana auth check
ToolSearch: "select:mcp__claude_ai_Slack__slack_read_channel"  # Slack auth check
ToolSearch: "+asana create"                                     # Discovery pattern
```

## Auth Check Pattern

Always verify auth before mutations:

```
1. Call auth tool (get_me / slack_read_channel with a known channel)
2. If error → report: "Auth failed. Check MCP server config. See references/setup.md"
3. Confirm identity before proceeding
```

## Env Var Contract

Naming convention: `{SERVICE}_{KEY}` (uppercase, underscore-separated).

- Read env vars at runtime — never hardcode values
- If required var missing → report which var, link to setup.md, stop
- Optional vars → fall back to interactive prompt or API-discovered value

## Error Format

```
Error: [what failed]
Cause: [MCP error message or "env var missing"]
Fix: [specific action user should take]
```

## Safety Rules

- NEVER delete resources without explicit user confirmation ("yes, delete [name]")
- NEVER mutate resources not owned by the authenticated user
- Always verify ownership before write operations
- Preview destructive actions, wait for confirmation
- On ambiguous target → list options, ask user to pick
