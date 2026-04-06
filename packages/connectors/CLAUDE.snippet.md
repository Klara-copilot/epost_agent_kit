## Connectors

Config-driven external service connectors. All GIDs and IDs are supplied via env vars — no hardcoded identifiers.

### Skills

| Skill | What it does |
|-------|-------------|
| `asana` | Generic Asana task management — create, update, search, list via env-var config |
| `slack` | Generic Slack messaging — send, read, search channels and threads |
| `asana-muji` | MUJI-specific Asana workflow (create/update/list tasks across 3 boards) |

### Env Vars

| Var | Used by | Purpose |
|-----|---------|---------|
| `ASANA_USER_GID` | asana, asana-muji | Your Asana user GID |
| `ASANA_WORKSPACE_GID` | asana | Default workspace |
| `ASANA_DEFAULT_PROJECT_GID` | asana | Default project for task creation |
| `ASANA_IOS_LIBRARIES_GID` | asana-muji | iOS Libraries project |
| `ASANA_MUJI_TASKS_GID` | asana-muji | MUJI Tasks kanban project |
| `ASANA_MUJI_PLAN_GID` | asana-muji | MUJI Plan project |
| `SLACK_DEFAULT_CHANNEL` | slack | Default channel for messages |
| `SLACK_WORKSPACE` | slack | Workspace identifier (optional) |

### Setup

- Asana: see `skills/asana/references/setup.md`
- Slack: see `skills/slack/references/setup.md`
- MUJI: see `skills/asana-muji/references/env-vars.md`
