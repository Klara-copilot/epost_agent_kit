---
description: (ePost) ⚙️ Generate new slash commands interactively
agent: epost-kit-designer
argument-hint: "[splash|simple]"
---

## Your Mission

Generate new command files using Command Development skill from kit-design package.

**IMPORTANT:** Activate `command-development` skill for guidance.

## Workflow

1. **Command Type Selection**: Ask user to select command type:
   - `splash` — Router command with multiple variants (e.g., /plan, /plan:fast, /plan:deep)
   - `simple` — Single standalone command

2. **Route to Variant**:
   - If user selects `splash` → delegate to `/add-command:splash`
   - If user selects `simple` → delegate to `/add-command:simple`

## Delegation

Use the Skill tool to invoke the appropriate variant:

```
Skill("add-command:splash")   # For splash command generation
Skill("add-command:simple")   # For simple command generation
```

## Command Naming Convention

All epost_agent_kit commands follow `{namespace}/{action-or-variant}` pattern:

| Pattern | Example | Description |
|---------|---------|-------------|
| `{domain}/{action}` | `git/commit`, `fix/fast` | Domain-scoped action |
| `{action}/{variant}` | `cook/fast`, `cook/parallel` | Action with speed/depth variants |
| `{platform}/{action}` | `web/cook`, `ios/test` | Platform-specific action |
| `{namespace}/{verb-noun}` | `kit/add-agent`, `docs/update` | Namespace + verb-noun |

### Naming Rules

- Lowercase, hyphens only — no underscores or camelCase
- Verb-first when possible: `add-agent` not `agent-add`
- Consistent variant names: `fast`, `deep`, `parallel` for speed/depth
- Router commands go in namespace dir, variants go in action dir

## Frontmatter Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | yes | Brief description shown in `/help` |
| `agent` | string | recommended | Agent to handle execution (e.g., `epost-implementer`) |
| `argument-hint` | string | optional | Document expected arguments for autocomplete |
| `title` | string | optional | Display title |
| `allowed-tools` | string | optional | Restrict tool access |
| `model` | string | optional | Override model (haiku/sonnet/opus) |
| `context` | string | optional | `fork` for isolated execution |
| `disable-model-invocation` | bool | optional | Prevent programmatic invocation |

## Important Notes

**IMPORTANT:** This is a router command — it delegates to variants, does not generate commands directly.
**IMPORTANT:** All new commands MUST have an `agent:` field in frontmatter.
**IMPORTANT:** Commands are instructions FOR Claude, not messages TO the user.
**IMPORTANT:** Copy to `packages/{package}/commands/` as source of truth, `.claude/commands/` is generated.
