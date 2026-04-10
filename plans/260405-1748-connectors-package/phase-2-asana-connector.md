---
phase: 2
title: "Asana connector"
effort: 2h
depends: [1]
---

# Phase 2 — Asana Connector

## Context

- Plan: [plan.md](./plan.md)
- Existing iOS skill: `packages/platform-ios/skills/asana-muji/SKILL.md`
- Existing Android skill: `packages/platform-android/skills/asana-muji/SKILL.md`
- **V2 endpoint**: `https://mcp.asana.com/v2/mcp` (HTTP transport, OAuth 2.0)
- **V1 deprecated**: May 11, 2026 — build against V2 only
- **MCP tool prefix**: V1 was `mcp__claude_ai_Asana__*` — V2 prefix must be verified with ToolSearch after registration
- **OAuth identity**: `assignee: "me"` resolves to authenticated user — no user GID needed

## Overview

Create the generic, config-driven Asana skill. Extracts reusable patterns from existing `asana-muji` skills, replaces hardcoded GIDs with env vars.

## Files to Create

| File | Purpose |
|------|---------|
| `packages/connectors/skills/asana/SKILL.md` | Main skill — flags, env vars, tool declarations |
| `packages/connectors/skills/asana/references/setup.md` | MCP server install, env vars required |
| `packages/connectors/skills/asana/references/operations.md` | Full Asana MCP tool reference |
| `packages/connectors/skills/asana/workflows/create-task.md` | Generic create task workflow |
| `packages/connectors/skills/asana/workflows/update-task.md` | Generic update task workflow |
| `packages/connectors/skills/asana/workflows/search-tasks.md` | Search tasks workflow |
| `packages/connectors/skills/asana/workflows/my-tasks.md` | List my tasks workflow |
| `packages/connectors/skills/asana/evals/eval-set.json` | Eval set for trigger testing |

## Tasks

- [ ] Write `SKILL.md`:
  - Frontmatter: name `asana`, description (trigger-only CSO), argument-hint, allowed-tools list
  - Flags: `--create`, `--update`, `--search`, `--my-tasks`
  - Config source: reads `.epost-kit.json` connectors.asana block
  - Safety rules (reference `connector-base.md`)
  - Workflow dispatch table (flag → workflow file)
  - No hardcoded GIDs anywhere
- [ ] Write `references/setup.md`:
  - V2 MCP registration: `claude mcp add --transport http --client-id ... --client-secret ... --callback-port 8080 asana https://mcp.asana.com/v2/mcp`
  - OAuth flow: browser opens, user signs in, token stored in `~/.mcp-auth/`
  - Security: unique credentials per developer, never commit client secret
  - Verification steps: call get_me to confirm auth
  - .epost-kit.json schema with examples
- [ ] Write `references/operations.md`:
  - **First**: verify V2 tool prefix via ToolSearch after registering V2 server
  - Document all available V2 tools with parameters
  - Group by: read, write, search operations
- [ ] Write `workflows/create-task.md`:
  - Read `.epost-kit.json` → `create_task.target` and `create_task.link_to`
  - Read `templates` from config → ask "which template?"
  - Template drives: name prefix, which fields to collect
  - Fetch sections for target project live via MCP (not from config)
  - `assignee: "me"` (OAuth, no GID needed)
  - Multi-home to `link_to` projects, set initial sections (fetched live)
- [ ] Write `workflows/update-task.md`:
  - Fetch sections dynamically from project via MCP
  - Present live section list to user
  - No section GIDs in config
- [ ] Write `workflows/search-tasks.md`:
  - Search by name/project/status, tabular output
- [ ] Write `workflows/my-tasks.md`:
  - `assignee: "me"` — no GID needed
  - Filter by configured projects, sortable table
- [ ] Write `evals/eval-set.json`:
  - 5+ trigger evals: "create asana task", "search asana", "my asana tasks", "update task status", "asana board"
  - 2+ negative evals: "create jira ticket", "send slack message"

## Acceptance Criteria

- Zero hardcoded GIDs in any file
- All workflows reference `connector-base.md` for shared patterns
- Eval set has >= 5 positive + 2 negative triggers
- SKILL.md < 80 lines
