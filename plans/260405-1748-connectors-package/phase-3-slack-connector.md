---
phase: 3
title: "Slack connector"
effort: 1.5h
depends: [1]
---

# Phase 3 — Slack Connector

## Context

- Plan: [plan.md](./plan.md)
- MCP tools: `mcp__claude_ai_Slack__*` prefix (verified)
- Parallel-safe with Phase 2 (no file overlap)

## Overview

Create the generic Slack connector skill. Config-driven, env-var based.

## Files to Create

| File | Purpose |
|------|---------|
| `packages/connectors/skills/slack/SKILL.md` | Main skill — flags, env vars, tool declarations |
| `packages/connectors/skills/slack/references/setup.md` | MCP server install, env vars |
| `packages/connectors/skills/slack/references/operations.md` | Full Slack MCP tool reference |
| `packages/connectors/skills/slack/workflows/send-message.md` | Send message to channel/user |
| `packages/connectors/skills/slack/workflows/read-channel.md` | Read recent channel messages |
| `packages/connectors/skills/slack/workflows/search.md` | Search messages across workspace |
| `packages/connectors/skills/slack/evals/eval-set.json` | Eval set for trigger testing |

## Tasks

- [ ] Write `SKILL.md`:
  - Frontmatter: name `slack`, description (trigger-only CSO), argument-hint, allowed-tools list
  - Flags: `--send`, `--read`, `--search`, `--thread`
  - Env var table: `SLACK_DEFAULT_CHANNEL`, `SLACK_WORKSPACE` (optional)
  - Safety rules (reference `connector-base.md`): never send without confirmation, preview before send
  - Workflow dispatch table
- [ ] Write `references/setup.md`:
  - Claude Desktop MCP server config for Slack
  - Required env vars
  - Verification: read a channel to confirm auth
- [ ] Write `references/operations.md`:
  - All `mcp__claude_ai_Slack__*` tools with parameter docs
  - Group by: read, write, search, canvas
  - Note: `slack_send_message_draft` for safe preview
- [ ] Write `workflows/send-message.md`:
  - Channel selection (env var default or ask)
  - Message composition
  - Preview via `slack_send_message_draft` before actual send
  - Thread reply support
- [ ] Write `workflows/read-channel.md`:
  - Read recent messages from channel
  - Thread expansion
  - User profile lookup for display names
- [ ] Write `workflows/search.md`:
  - Public search, public+private search
  - Channel search, user search
  - Result formatting
- [ ] Write `evals/eval-set.json`:
  - 5+ positive triggers: "send slack message", "read slack channel", "search slack", "post to #general", "slack thread reply"
  - 2+ negative triggers: "create asana task", "send email"

## Acceptance Criteria

- All workflows use env vars, no hardcoded channel IDs
- Send workflows include preview/confirmation step
- Eval set >= 5 positive + 2 negative
- SKILL.md < 80 lines
