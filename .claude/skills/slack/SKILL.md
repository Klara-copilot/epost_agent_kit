---
name: slack
description: "Use when: user says 'slack', 'send message', 'post to channel', 'read slack', 'search slack', 'slack thread', 'DM someone on slack'. Manages Slack messaging via MCP."
argument-hint: "send|read|search|thread"
allowed-tools:
  - mcp__claude_ai_Slack__slack_send_message
  - mcp__claude_ai_Slack__slack_send_message_draft
  - mcp__claude_ai_Slack__slack_read_channel
  - mcp__claude_ai_Slack__slack_read_thread
  - mcp__claude_ai_Slack__slack_search_public
  - mcp__claude_ai_Slack__slack_search_public_and_private
  - mcp__claude_ai_Slack__slack_search_channels
  - mcp__claude_ai_Slack__slack_search_users
  - mcp__claude_ai_Slack__slack_read_user_profile
  - mcp__claude_ai_Slack__slack_schedule_message
metadata:
  version: "1.0.0"
  keywords: [slack, messaging, channels, collaboration]
---

# Slack Connector

Generic Slack messaging and search via MCP. Works with any workspace via env vars.

## Env Vars

| Var | Required | Purpose | Fallback |
|-----|----------|---------|---------|
| `SLACK_DEFAULT_CHANNEL` | Optional | Default channel for messages | Prompt user |
| `SLACK_WORKSPACE` | Optional | Workspace identifier | Auto-detected |

## Flags

| Flag | Action | Workflow |
|------|--------|---------|
| `--send` | Send a message | `workflows/send-message.md` |
| `--read` | Read channel messages | `workflows/read-channel.md` |
| `--search` | Search messages | `workflows/search.md` |
| `--thread` | Reply to a thread | `workflows/send-message.md` (thread mode) |
| (none) | Ask via AskUserQuestion | — |

No flag → present options: Send Message / Read Channel / Search / Thread Reply.

## Pre-Flight

1. Load Slack MCP tools via ToolSearch: `"+slack read_channel"`
2. Verify auth: call `mcp__claude_ai_Slack__slack_read_channel` on default or known channel
3. If auth fails → report error, link to `references/setup.md`

## Safety

- See `references/connector-base.md` for shared safety rules
- ALWAYS preview messages via `slack_send_message_draft` before sending
- Never send without explicit user confirmation
- Never delete messages

## Error Handling

See `references/connector-base.md` error format.
- Auth failure → report, link to setup.md
- Channel not found → use `slack_search_channels` to find correct channel
