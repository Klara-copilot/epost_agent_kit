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

## Env Var Contract

```bash
# Who I am
ASANA_USER_GID=1207699335267611        # my Asana user GID

# Which projects (MUJI-specific)
ASANA_IOS_LIBRARIES_GID=...            # iOS Libraries project
ASANA_MUJI_TASKS_GID=...              # MUJI Tasks project
ASANA_MUJI_PLAN_GID=...               # MUJI Plan project

# Section GIDs (MUJI Tasks kanban)
ASANA_SECTION_TODO_GID=...
ASANA_SECTION_INPROGRESS_GID=...
ASANA_SECTION_DONE_GID=...

# Section GIDs (MUJI Plan 5-step)
ASANA_SECTION_NEW_REQUESTS_GID=...
ASANA_SECTION_IN_PROGRESS_GID=...
ASANA_SECTION_INTEGRATION_GID=...
ASANA_SECTION_TEST_GID=...
ASANA_SECTION_PLAN_DONE_GID=...

# iOS Libraries module sections
ASANA_SECTION_IOS_THEME_SHOWCASE_GID=...
ASANA_SECTION_IOS_THEME_UI_GID=...
ASANA_SECTION_EPOST_BOTTOM_MENU_GID=...
```

## Files to Create

| File | Action |
|------|--------|
| `packages/connectors/skills/asana-muji/SKILL.md` | New — merged from iOS/Android, fully env-var driven |
| `packages/connectors/skills/asana-muji/workflows/create-task.md` | Merged from iOS/Android |
| `packages/connectors/skills/asana-muji/workflows/update-status.md` | Merged |
| `packages/connectors/skills/asana-muji/workflows/my-tasks.md` | Merged |
| `packages/connectors/skills/asana-muji/references/env-vars.md` | Env var contract + setup instructions |
| `packages/connectors/skills/asana-muji/evals/eval-set.json` | Basic trigger evals |

## Files to Delete

| File | Reason |
|------|--------|
| `packages/platform-ios/skills/asana-muji/` (entire dir) | Replaced by connectors version |
| `packages/platform-android/skills/asana-muji/` (entire dir) | Replaced by connectors version |

## Tasks

- [ ] Write merged `SKILL.md` — same flags (create/status/my-tasks), all GIDs via `$ENV_VAR_NAME` references
- [ ] Write merged `workflows/create-task.md` — same 5-step flow, env var substitution for GIDs
- [ ] Write merged `workflows/update-status.md` — same section transitions, env var substitution
- [ ] Write merged `workflows/my-tasks.md` — same fetch + display, env var for project filter
- [ ] Write `references/env-vars.md` — full var list, how to find GIDs in Asana UI, example `.env.connectors`
- [ ] Delete `packages/platform-ios/skills/asana-muji/` (confirm with user first)
- [ ] Delete `packages/platform-android/skills/asana-muji/` (confirm with user first)
- [ ] Register `asana-muji` in `packages/connectors/package.yaml`

## Acceptance Criteria

- [ ] One `asana-muji` skill in `connectors/`, zero duplicates
- [ ] Zero hardcoded GIDs anywhere in the skill or workflows
- [ ] `references/env-vars.md` documents every required env var
- [ ] Old platform-specific skills deleted (after user confirmation)
- [ ] Still works with flags: `create`, `status`, `my-tasks`
