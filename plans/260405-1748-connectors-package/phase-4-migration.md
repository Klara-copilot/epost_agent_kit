---
phase: 4
title: "Consolidate asana-muji — env vars + merge iOS/Android"
effort: 0.5h
depends: [2]
---

# Phase 4 — Consolidate asana-muji

## Context

- Plan: [plan.md](./plan.md)
- Generic asana: `packages/connectors/skills/asana/` (from Phase 2)
- iOS current: `packages/platform-ios/skills/asana-muji/` (6 files, hardcoded GIDs)
- Android current: `packages/platform-android/skills/asana-muji/` (6 files, hardcoded GIDs, near-identical)

## Overview

The iOS and Android `asana-muji` skills are nearly identical — same 3-board workflow, same 3 workflow files, same MCP operations. The only differences are the project/section GIDs and the assignee GID.

Instead of thin wrappers, the right model is:
1. **One `asana-muji` skill** in `packages/connectors/skills/asana-muji/`
2. **All GIDs from env vars** — any MUJI developer sets their own `.env.connectors` and the skill works
3. **Delete** the platform-specific duplicates (`platform-ios/asana-muji`, `platform-android/asana-muji`)

No wrapper pattern needed. Generic connector (`asana`) + project skill (`asana-muji`) + env vars = full coverage for any dev.

## .epost-kit.json (replaces all env var GIDs)

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
**No `.env.connectors`** — OAuth credentials stored in system keychain via `claude mcp add`.

## Files to Create

| File | Action |
|------|--------|
| `packages/connectors/skills/asana-muji/SKILL.md` | New — merged from iOS/Android, fully env-var driven |
| `packages/connectors/skills/asana-muji/workflows/create-task.md` | Merged from iOS/Android |
| `packages/connectors/skills/asana-muji/workflows/update-status.md` | Merged |
| `packages/connectors/skills/asana-muji/workflows/my-tasks.md` | Merged |
| `packages/connectors/skills/asana-muji/references/epost-kit-config-example.md` | .epost-kit.json schema + example with real MUJI GIDs |
| `packages/connectors/skills/asana-muji/evals/eval-set.json` | Basic trigger evals |

## Files to Delete

| File | Reason |
|------|--------|
| `packages/platform-ios/skills/asana-muji/` (entire dir) | Replaced by connectors version |
| `packages/platform-android/skills/asana-muji/` (entire dir) | Replaced by connectors version |

## Tasks

- [ ] Write merged `SKILL.md` — same flags (create/status/my-tasks), reads `.epost-kit.json`
- [ ] Write merged `workflows/create-task.md` — reads config for projects/templates; sections fetched live; `assignee: "me"`
- [ ] Write merged `workflows/update-status.md` — fetches sections live from MCP, no GIDs in workflow
- [ ] Write merged `workflows/my-tasks.md` — `assignee: "me"`, filters by configured projects
- [ ] Write `references/epost-kit-config-example.md` — full config schema with MUJI GIDs filled in as example, instructions for finding GIDs in Asana URL
- [ ] Delete `packages/platform-ios/skills/asana-muji/` (confirm with user first)
- [ ] Delete `packages/platform-android/skills/asana-muji/` (confirm with user first)
- [ ] Register `asana-muji` in `packages/connectors/package.yaml`

## Acceptance Criteria

- [ ] One `asana-muji` skill in `connectors/`, zero duplicates
- [ ] Zero hardcoded GIDs — all from `.epost-kit.json`
- [ ] No user GID anywhere — `assignee: "me"` throughout
- [ ] Sections fetched live — none stored in config or skill files
- [ ] `references/epost-kit-config-example.md` documents schema + how to find GIDs
- [ ] Old platform-specific skills deleted (after user confirmation)
- [ ] Still works with flags: `create`, `status`, `my-tasks`
