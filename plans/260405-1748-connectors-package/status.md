---
updated: 2026-04-05
---

# Plan Status — Connectors Package

## Progress

| Phase | Title | Status |
|-------|-------|--------|
| 1 | Package scaffold | Done |
| 2 | Asana connector | Done |
| 3 | Slack connector | Done |
| 4 | Consolidate asana-muji | Done (pending: delete old platform skills — requires user confirmation) |
| 5 | Registration + index | Done |

## Key Decisions

| Date | Decision | Why |
|------|----------|-----|
| 2026-04-05 | `connector-base.md` lives in `asana/references/` as shared reference | Plan architecture: shared file, not standalone skill |
| 2026-04-05 | Manually copied skills to `.claude/skills/` | `epost-kit install` pulls from GitHub; connectors is a new local package |
| 2026-04-05 | Replaced `.claude/skills/asana-muji` with merged version | Android version was installed; new merged version takes its place |

## Pending User Action

- Delete `packages/platform-ios/skills/asana-muji/` (old duplicate)
- Delete `packages/platform-android/skills/asana-muji/` (old duplicate)

These deletions require explicit user confirmation per plan phase 4.

## Known Bugs

None.

## Architecture Reference

```
packages/connectors/
  package.yaml                          — package manifest
  CLAUDE.snippet.md                     — CLAUDE.md snippet
  skills/
    asana/
      SKILL.md                          — generic Asana skill
      references/
        connector-base.md               — shared patterns (auth, safety, error format)
        setup.md                        — MCP config + env vars
        operations.md                   — full tool reference
      workflows/
        create-task.md
        update-task.md
        search-tasks.md
        my-tasks.md
      evals/eval-set.json
    slack/
      SKILL.md                          — generic Slack skill
      references/
        setup.md
        operations.md
      workflows/
        send-message.md
        read-channel.md
        search.md
      evals/eval-set.json
    asana-muji/
      SKILL.md                          — merged MUJI skill (was iOS+Android)
      references/env-vars.md            — full env var contract
      workflows/{create-task,update-status,my-tasks}.md
      evals/eval-set.json
```
