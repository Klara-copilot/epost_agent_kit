---
plan: 260405-1748-connectors-package
agent: epost-fullstack-developer
date: 2026-04-05
status: completed
---

# Phase Implementation Report

- Plan: `260405-1748-connectors-package` | Status: completed (all 5 phases)

## Files Modified

**Created — packages/connectors/**
- `package.yaml`
- `CLAUDE.snippet.md`
- `skills/asana/SKILL.md`
- `skills/asana/references/connector-base.md`
- `skills/asana/references/setup.md`
- `skills/asana/references/operations.md`
- `skills/asana/workflows/create-task.md`
- `skills/asana/workflows/update-task.md`
- `skills/asana/workflows/search-tasks.md`
- `skills/asana/workflows/my-tasks.md`
- `skills/asana/evals/eval-set.json`
- `skills/slack/SKILL.md`
- `skills/slack/references/setup.md`
- `skills/slack/references/operations.md`
- `skills/slack/workflows/send-message.md`
- `skills/slack/workflows/read-channel.md`
- `skills/slack/workflows/search.md`
- `skills/slack/evals/eval-set.json`
- `skills/asana-muji/SKILL.md`
- `skills/asana-muji/references/env-vars.md`
- `skills/asana-muji/workflows/create-task.md`
- `skills/asana-muji/workflows/update-status.md`
- `skills/asana-muji/workflows/my-tasks.md`
- `skills/asana-muji/evals/eval-set.json`

**Modified**
- `packages/platform-ios/package.yaml` — added `connectors` dependency
- `packages/platform-android/package.yaml` — added `connectors` dependency

**Generated (.claude/ — from packages)**
- `.claude/skills/asana/` — copied from packages/connectors
- `.claude/skills/slack/` — copied from packages/connectors
- `.claude/skills/asana-muji/` — replaced with merged version
- `.claude/skills/skill-index.json` — regenerated (81 skills, +2 from before)

## Tasks Completed

- [x] Phase 1: Package scaffold — `package.yaml`, `CLAUDE.snippet.md`, dir tree, `connector-base.md`
- [x] Phase 2: Asana connector — SKILL.md, setup, operations, 4 workflows, eval-set (8 evals)
- [x] Phase 3: Slack connector — SKILL.md, setup, operations, 3 workflows, eval-set (8 evals)
- [x] Phase 4: asana-muji merged — single skill, all GIDs via env vars, env-vars.md
- [x] Phase 5: Registration — platform packages updated, .claude/skills populated, index regenerated

## Tests Status

- Skill index: 81 skills, 0 errors, `asana`, `slack`, `asana-muji` all present
- Eval sets: asana 8 evals (6 positive, 2 negative), slack 8 evals (6 positive, 2 negative), asana-muji 7 evals (5 positive, 2 negative)
- No TypeScript/build step for skills (markdown-only package)

## Completion Evidence

- Tests: skill index regenerated with 0 errors — "81 skills indexed (0 duplicates removed)"
- Build: N/A (markdown skill package — no compilation)
- Acceptance criteria:
  - [x] `packages/connectors/package.yaml` registered with asana, slack, asana-muji
  - [x] Generic `asana` skill — env-var driven, zero hardcoded GIDs
  - [x] Generic `slack` skill — env-var driven, preview-before-send enforced
  - [x] `asana-muji` merged into one skill in `connectors/` — no iOS/Android duplicates
  - [x] All GIDs in `asana-muji` via env vars (zero hardcoded in skill/workflows)
  - [x] `skill-index.json` regenerated, count correct (81)
  - [x] No hardcoded GIDs anywhere in connectors package
  - [ ] Old platform-specific `asana-muji` skills deleted — **PENDING USER CONFIRMATION**
- Files changed: 24 created in packages/, 2 modified, 3 updated in .claude/

## Issues Encountered

1. `epost-kit install connectors` not supported (pulls from GitHub, not local packages) — manually copied skills to `.claude/skills/` as workaround. Full resolution requires `epost-kit init` after this package is published to the kit repo.
2. `.claude/skills/asana-muji` was the Android version — replaced with merged connectors version directly.

## Next Steps (Requires User Action)

1. **Confirm deletion** of old platform-specific skills:
   - `packages/platform-ios/skills/asana-muji/`
   - `packages/platform-android/skills/asana-muji/`
2. **Run `epost-kit init`** when connectors package is published to kit repo (for clean install path)
3. **Commit** — all changes in `packages/` + `.claude/` updates

Docs impact: `major` — new package, new skills, CLAUDE.md needs connectors section added.
