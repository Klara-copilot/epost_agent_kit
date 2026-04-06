# Slack MCP Operations Reference

All tools use the `mcp__claude_ai_Slack__` prefix. Load via ToolSearch before calling.

## Read Operations

| Tool | Key Parameters | Notes |
|------|---------------|-------|
| `slack_read_channel` | `channel_id`, `limit` | Read recent messages from channel |
| `slack_read_thread` | `channel_id`, `thread_ts` | Read a thread by timestamp |
| `slack_read_user_profile` | `user_id` | Get user display name, status, etc. |
| `slack_read_canvas` | `channel_id` | Read channel canvas |

## Write Operations

| Tool | Key Parameters | Notes |
|------|---------------|-------|
| `slack_send_message_draft` | `channel_id`, `text` | Preview — shows message without sending |
| `slack_send_message` | `channel_id`, `text`, `thread_ts` | Actually sends; `thread_ts` = reply to thread |
| `slack_schedule_message` | `channel_id`, `text`, `post_at` | Schedule for later (`post_at` = unix timestamp) |
| `slack_create_canvas` | `channel_id`, `content` | Create channel canvas |
| `slack_update_canvas` | `channel_id`, `canvas_id`, `content` | Update canvas |

## Search Operations

| Tool | Key Parameters | Notes |
|------|---------------|-------|
| `slack_search_public` | `query` | Search public channels only |
| `slack_search_public_and_private` | `query` | Search all accessible channels |
| `slack_search_channels` | `query` | Find channels by name |
| `slack_search_users` | `query` | Find users by name or email |

## Send Flow (Always Use Draft First)

```
1. slack_send_message_draft  →  show preview to user
2. User confirms            →  proceed
3. slack_send_message       →  actually send
```

Never call `slack_send_message` without a preceding draft confirmation.

## Channel ID vs Name

- Prefer channel IDs (`C0XXXXXXXXX`) for reliability
- Use `slack_search_channels` to resolve a name to an ID
- `SLACK_DEFAULT_CHANNEL` env var can store either format
