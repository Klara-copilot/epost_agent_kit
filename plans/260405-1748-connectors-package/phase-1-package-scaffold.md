---
phase: 1
title: "Package scaffold"
effort: 0.5h
depends: []
---

# Phase 1 — Package Scaffold

## Context

- Plan: [plan.md](./plan.md)
- Reference: `packages/core/package.yaml` for structure

## Overview

Create the `packages/connectors/` package with `package.yaml`, directory tree, and shared `connector-base.md` reference.

## Files to Create

| File | Purpose |
|------|---------|
| `packages/connectors/package.yaml` | Package manifest — declares asana + slack skills |
| `packages/connectors/CLAUDE.snippet.md` | Snippet for CLAUDE.md generation |
| `packages/connectors/skills/asana/references/connector-base.md` | Shared patterns: ToolSearch loading, auth check, error format, env var contract |

## Tasks

- [ ] Create `packages/connectors/package.yaml`:
  - name: `connectors`
  - version: `1.0.0`
  - description: "Config-driven external service connectors (Asana, Slack)"
  - layer: 1
  - platforms: [all]
  - dependencies: [core]
  - provides.skills: [asana, slack]
  - files: `skills/: skills/`
  - settings_strategy: merge
  - claude_snippet: CLAUDE.snippet.md
- [ ] Create `packages/connectors/CLAUDE.snippet.md` with connector skills table
- [ ] Create directory structure (empty dirs for phases 2-3):
  - `packages/connectors/skills/asana/references/`
  - `packages/connectors/skills/asana/workflows/`
  - `packages/connectors/skills/asana/evals/`
  - `packages/connectors/skills/slack/references/`
  - `packages/connectors/skills/slack/workflows/`
  - `packages/connectors/skills/slack/evals/`
- [ ] Write `connector-base.md` with:
  - ToolSearch loading pattern (generic — service name as parameter)
  - Auth check pattern (verify `get_me` / auth before mutations)
  - Error format (consistent across all connectors)
  - Env var contract (naming convention: `{SERVICE}_{KEY}`)
  - Safety rules (never delete without explicit confirmation, verify ownership before mutations)

## Acceptance Criteria

- `package.yaml` valid YAML, parseable
- Directory tree matches target structure from plan
- `connector-base.md` < 60 lines, covers all 5 shared patterns
