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
- Config via `epost-config.json` (committed) — project GIDs, templates, workflow config
- Personal secrets (OAuth credentials) stay in system keychain via `claude mcp add`
- No user GID in config — OAuth `assignee: "me"` resolves identity automatically
- Sections fetched live from Asana MCP (not stored in config)
- Teams define their own task templates in `epost-config.json`
- `connector-base.md` = shared reference file, NOT standalone skill
- Asana + Slack only (YAGNI)
- No webhooks — interactive commands only
- `allowed-tools` in frontmatter declares MCP tools
- Auth boundary: inline or first-level subagents only
- **Asana V2 MCP** — endpoint `https://mcp.asana.com/v2/mcp`, HTTP transport, OAuth 2.0
  - V1 SSE (`mcp.asana.com/sse`) deprecated May 11, 2026 — do NOT use V1

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Package scaffold | 0.5h | pending | [phase-1](./phase-1-package-scaffold.md) |
| 2 | Asana connector | 2h | pending | [phase-2](./phase-2-asana-connector.md) |
| 3 | Slack connector | 1.5h | pending | [phase-3](./phase-3-slack-connector.md) |
| 4 | Consolidate asana-muji — env vars + merge iOS/Android into one | 0.5h | pending | [phase-4](./phase-4-migration.md) |
| 5 | Registration + index | 1h | pending | [phase-5](./phase-5-registration-index.md) |

## epost-config.json Schema (final)

```json
{
  "connectors": {
    "asana": {
      "workspace_gid": "...",
      "projects": {
        "iOS Libraries": "...",
        "MUJI Tasks":    "...",
        "MUJI Plan":     "..."
      },
      "create_task": {
        "target":  "iOS Libraries",
        "link_to": ["MUJI Tasks", "MUJI Plan"]
      },
      "templates": {
        "component": { "name_prefix": "[Vien-Comp]", "fields": ["module", "due_date", "figma_url"] },
        "bug":       { "name_prefix": "[Bug]",        "fields": ["module", "due_date", "severity"] }
      }
    },
    "slack": {
      "default_channel": "dev-ios"
    }
  }
}
```

- `workspace_gid` — only GID that can't be auto-discovered
- `projects` — free-form display names → GIDs; sections fetched live via MCP
- `create_task` — workflow config: where to create, where to multi-home
- `templates` — team-defined task types with name prefix + field list
- No user GID — OAuth `assignee: "me"` resolves identity from token

## Constraints

- ALL edits in `packages/` — never `.claude/` directly
- MCP tool names: V2 prefix TBD (verify with ToolSearch after V2 registration)
- V1 `mcp__claude_ai_Asana__*` prefix may change in V2 — check before writing operations.md
- No wrapper skills — epost-config.json + OAuth is sufficient for every developer

## Success Criteria

- [ ] `packages/connectors/package.yaml` registered and installable
- [ ] Generic `asana` skill targets V2 endpoint, uses OAuth identity
- [ ] Generic `slack` skill works with any workspace
- [ ] `asana-muji` merged into one skill (connectors/) — no iOS/Android duplicates
- [ ] Zero hardcoded GIDs — config-driven via `epost-config.json`
- [ ] Teams can define custom templates in `epost-config.json`
- [ ] `skill-index.json` regenerated, count correct
