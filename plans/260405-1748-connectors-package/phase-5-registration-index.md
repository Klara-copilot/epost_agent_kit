---
phase: 5
title: "Registration + index"
effort: 1h
depends: [1, 2, 3, 4]
---

# Phase 5 — Registration + Index

## Context

- Plan: [plan.md](./plan.md)
- All connector skills created (phases 1-3)
- Migration complete (phase 4)

## Overview

Register the connectors package, update CLAUDE.md snippet, regenerate skill index, verify everything.

## Files to Modify

| File | Action |
|------|--------|
| `packages/connectors/CLAUDE.snippet.md` | Finalize content |
| `packages/connectors/package.yaml` | Verify provides.skills list |

## Tasks

- [ ] Verify `package.yaml` lists both skills: `[asana, slack]`
- [ ] Finalize `CLAUDE.snippet.md`:
  - Connectors section with skill table
  - .epost-kit.json setup instructions (where to place file, minimal schema)
  - Link to `references/setup.md` for OAuth registration steps
- [ ] Run `epost-kit init` (or manual install) to generate `.claude/skills/` from packages
- [ ] Run `node .claude/scripts/generate-skill-index.cjs` to regenerate skill index
- [ ] Verify `skill-index.json`:
  - Contains `asana` and `slack` entries
  - Count field is correct
  - No duplicate entries
- [ ] Verify `.claude/skills/asana/` and `.claude/skills/slack/` generated correctly
- [ ] Smoke test: confirm ToolSearch finds Asana and Slack MCP tools
- [ ] Update `packages/platform-ios/package.yaml` — add `connectors` to dependencies if needed
- [ ] Update `packages/platform-android/package.yaml` — add `connectors` to dependencies if needed

## Acceptance Criteria

- [ ] `skill-index.json` count matches actual skill count
- [ ] No stale/orphaned skill entries
- [ ] Both platform packages declare connectors dependency
- [ ] CLAUDE.md regenerated with connectors section
- [ ] All files committed from `packages/` only
