---
phase: 4
title: "Remove asana-muji duplicates — replace with config"
effort: 0.5h
depends: [2]
---

# Phase 4 — Remove asana-muji Duplicates

## Context

- Plan: [plan.md](./plan.md)
- Generic asana: `packages/connectors/skills/asana/` (from Phase 2)
- iOS current: `packages/platform-ios/skills/asana-muji/` (6 files, hardcoded GIDs)
- Android current: `packages/platform-android/skills/asana-muji/` (6 files, hardcoded GIDs, near-identical)

## Overview

The generic `asana` skill (Phase 2) is fully config-driven — reads projects, templates, and workflow config from `.epost-kit.json`. `asana-muji` is therefore just MUJI's config, not a skill. No `asana-muji` skill needed.

**New model**: delete both platform skills → teams use `asana` + their `.epost-kit.json`.

## MUJI's .epost-kit.json config

```json
{
  "connectors": {
    "asana": {
      "workspace_gid": "...",
      "projects": {
        "iOS Libraries": "1207773169815446",
        "MUJI Tasks":    "1176686389740521",
        "MUJI Plan":     "1184227957274218"
      },
      "create_task": {
        "target":  "iOS Libraries",
        "link_to": ["MUJI Tasks", "MUJI Plan"]
      },
      "templates": {
        "component": { "name_prefix": "[Vien-Comp]", "fields": ["module", "due_date", "figma_url"] },
        "bug":       { "name_prefix": "[Bug]",        "fields": ["module", "due_date", "severity"] }
      }
    }
  }
}
```

**No user GID** — OAuth `assignee: "me"` handles identity.
**No section GIDs** — fetched live from Asana MCP per project.

## Files to Create

| File | Purpose |
|------|---------|
| `packages/connectors/skills/asana/references/epost-kit-config-example.md` | MUJI's full config as example + instructions for finding GIDs in Asana URL |

## Files to Delete

| File | Reason |
|------|--------|
| `packages/platform-ios/skills/asana-muji/` (entire dir) | Replaced by `asana` skill + config |
| `packages/platform-android/skills/asana-muji/` (entire dir) | Replaced by `asana` skill + config |

## Tasks

- [ ] Write `references/epost-kit-config-example.md` — MUJI config with real GIDs as example, instructions for finding GIDs in Asana URL
- [ ] Delete `packages/platform-ios/skills/asana-muji/` (confirm with user first)
- [ ] Delete `packages/platform-android/skills/asana-muji/` (confirm with user first)

## Acceptance Criteria

- [ ] Zero `asana-muji` skill files — only `asana` skill remains
- [ ] `references/epost-kit-config-example.md` shows MUJI config with real GIDs
- [ ] Old platform-specific skills deleted (after user confirmation)
