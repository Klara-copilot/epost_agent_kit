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
- MCP tools: `mcp__claude_ai_Asana__*` prefix (verified)

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
  - Flags: `--create`, `--update`, `--search`, `--list`, `--my-tasks`
  - Env var table: `ASANA_USER_GID`, `ASANA_WORKSPACE_GID`, `ASANA_DEFAULT_PROJECT_GID` (all optional, with fallback to `get_me`)
  - Safety rules (reference `connector-base.md`)
  - Workflow dispatch table (flag → workflow file)
  - No hardcoded GIDs anywhere
- [ ] Write `references/setup.md`:
  - Claude Desktop MCP server config for Asana
  - Required env vars with descriptions
  - Verification steps (call `get_me` to confirm auth)
- [ ] Write `references/operations.md`:
  - All `mcp__claude_ai_Asana__*` tools with parameter docs
  - Group by: read operations, write operations, search operations
  - Note which require auth, which are read-only
- [ ] Write `workflows/create-task.md`:
  - Generic version of iOS `create-task.md`
  - Uses env vars for project/assignee
  - Interactive gathering via AskUserQuestion
  - Multi-home support (optional, user-configured)
- [ ] Write `workflows/update-task.md`:
  - Generic version of iOS `update-status.md`
  - Section transitions driven by project config, not hardcoded
  - Fetch sections dynamically from project
- [ ] Write `workflows/search-tasks.md`:
  - Search by name, assignee, project, completion status
  - Tabular output
- [ ] Write `workflows/my-tasks.md`:
  - Generic version — uses env var or `get_me` for user GID
  - Sortable output table
- [ ] Write `evals/eval-set.json`:
  - 5+ trigger evals: "create asana task", "search asana", "my asana tasks", "update task status", "asana board"
  - 2+ negative evals: "create jira ticket", "send slack message"

## Acceptance Criteria

- Zero hardcoded GIDs in any file
- All workflows reference `connector-base.md` for shared patterns
- Eval set has >= 5 positive + 2 negative triggers
- SKILL.md < 80 lines
