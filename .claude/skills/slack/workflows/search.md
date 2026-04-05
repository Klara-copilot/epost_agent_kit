# Workflow: Search

## Step 1 — Gather search query

If query in argument → use directly.

Otherwise AskUserQuestion:
- Q1 "Search type": Messages / Channels / Users
- Q2 "Query": free text

## Step 2 — Execute search

**Messages (public)**:
```
mcp__claude_ai_Slack__slack_search_public:
  query: [query]
```

**Messages (public + private)**:
```
mcp__claude_ai_Slack__slack_search_public_and_private:
  query: [query]
```

**Channels**:
```
mcp__claude_ai_Slack__slack_search_channels:
  query: [query]
```

**Users**:
```
mcp__claude_ai_Slack__slack_search_users:
  query: [query]
```

## Step 3 — Display results

For messages:
```
| # | Channel | User | Message preview | Time |
|---|---------|------|----------------|------|
```

For channels:
```
| # | Name | Members | Topic |
|---|------|---------|-------|
```

If no results → "No results for '[query]'. Try different terms."

## Step 4 — Follow-up (optional)

AskUserQuestion:
- Read a channel from results → dispatch `read-channel.md`
- Reply to a message → dispatch `send-message.md` in thread mode
- Done
