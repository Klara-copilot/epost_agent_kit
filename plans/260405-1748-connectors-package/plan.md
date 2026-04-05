---
id: PLAN-0097
title: "Connectors Package — Generic Asana + Slack Skills"
status: active
created: 2026-04-05
updated: 2026-04-05
effort: 6h
phases: 5
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

# Connectors Package — Generic Asana + Slack Skills

## Scope Rationale

1. **Problem**: Asana skills are hardcoded per-user/project, duplicated across iOS (`asana-muji`) and Android (`asana-muji`). No Slack skill exists.
2. **Why this way**: Config-driven connectors eliminate duplication; env vars replace hardcoded GIDs.
3. **Why now**: Two identical copies exist; adding Slack without genericizing creates a third pattern.
4. **Simplest version**: Two connectors (Asana + Slack), env-var config, shared connector-base reference.
5. **50% cut**: Drop Slack, just do Asana + migration. Slack is small incremental though.

## Architecture (pre-decided)

- One skill per service (flat, not layered)
- Config via env vars (not hardcoded GIDs)
- `connector-base.md` = shared reference file, NOT standalone skill
- Asana + Slack only (YAGNI)
- No webhooks — interactive commands only
- `allowed-tools` in frontmatter declares MCP tools
- Auth boundary: inline or first-level subagents only

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Package scaffold | 0.5h | pending | [phase-1](./phase-1-package-scaffold.md) |
| 2 | Asana connector | 2h | pending | [phase-2](./phase-2-asana-connector.md) |
| 3 | Slack connector | 1.5h | pending | [phase-3](./phase-3-slack-connector.md) |
| 4 | Consolidate asana-muji — env vars + merge iOS/Android into one | 0.5h | pending | [phase-4](./phase-4-migration.md) |
| 5 | Registration + index | 1h | pending | [phase-5](./phase-5-registration-index.md) |

## Constraints

- ALL edits in `packages/` — never `.claude/` directly
- Env vars: `ASANA_USER_GID`, `ASANA_WORKSPACE_GID`, `SLACK_DEFAULT_CHANNEL` (examples)
- MCP tool names use `mcp__claude_ai_Asana__*` and `mcp__claude_ai_Slack__*` prefixes (verified from ToolSearch)
- No wrapper skills — generic connector + env vars is sufficient for every developer

## Success Criteria

- [ ] `packages/connectors/package.yaml` registered and installable
- [ ] Generic `asana` skill works with any project/user via env vars
- [ ] Generic `slack` skill works with any workspace via env vars
- [ ] `asana-muji` merged into one skill (in `connectors/`) — no iOS/Android duplicates
- [ ] All GIDs in `asana-muji` driven by env vars (zero hardcoded IDs)
- [ ] `skill-index.json` regenerated with new skills, count correct
- [ ] No hardcoded GIDs anywhere in connectors package
