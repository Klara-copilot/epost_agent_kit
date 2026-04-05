# Workflow: Send Message

## Step 1 — Resolve channel

Use `$SLACK_DEFAULT_CHANNEL` if set and no channel specified.

Otherwise (or if `--thread` flag):
- Ask: "Which channel?" (free text or pick from recent)
- Or: "Thread TS?" (for thread replies)

Use `slack_search_channels` if channel name needs to be resolved to ID.

## Step 2 — Compose message

If message content not in argument → AskUserQuestion:
- Q1 "Message": free text (Other)

## Step 3 — Preview (MANDATORY)

```
mcp__claude_ai_Slack__slack_send_message_draft:
  channel_id: [channel_id]
  text: [message]
  thread_ts: [ts]  # only for thread replies
```

Show preview to user:
```
Preview — sending to #[channel]:
[message text]
```

AskUserQuestion: "Send this message?" → Send / Edit / Cancel.

If "Edit" → return to Step 2.
If "Cancel" → abort.

## Step 4 — Send

```
mcp__claude_ai_Slack__slack_send_message:
  channel_id: [channel_id]
  text: [message]
  thread_ts: [ts]  # only for thread replies
```

## Step 5 — Confirm

```
Sent to #[channel]
[message preview — first 80 chars]
```
