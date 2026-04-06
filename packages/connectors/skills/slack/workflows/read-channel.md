# Workflow: Read Channel

## Step 1 — Resolve channel

Use `$SLACK_DEFAULT_CHANNEL` if set.
Otherwise AskUserQuestion: "Which channel?" (free text).

Use `slack_search_channels` to resolve name → ID if needed.

## Step 2 — Fetch messages

```
mcp__claude_ai_Slack__slack_read_channel:
  channel_id: [channel_id]
  limit: 20
```

## Step 3 — Display messages

Format each message:
```
[time] @[username]: [text]
  └─ [N replies]  # if thread
```

Resolve display names with `slack_read_user_profile` for user IDs.

## Step 4 — Thread expansion (optional)

AskUserQuestion: "Expand a thread?" → pick message # or "No".

If yes:
```
mcp__claude_ai_Slack__slack_read_thread:
  channel_id: [channel_id]
  thread_ts: [message ts]
```

Display thread replies in nested format.

## Step 5 — Follow-up (optional)

AskUserQuestion:
- Reply to a message → dispatch `send-message.md` in thread mode
- Done
