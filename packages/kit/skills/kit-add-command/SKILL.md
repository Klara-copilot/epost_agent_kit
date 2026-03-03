---
name: kit-add-command
description: "(ePost) Generate new slash commands interactively"
user-invocable: true
context: fork
agent: epost-implementer
metadata:
  argument-hint: "[splash|simple]"
  connections:
    requires: [kit-commands]
---

## Your Mission

Generate new command files using Command Development skill from kit-design package.

**IMPORTANT:** Activate `kit-commands` skill for guidance.

## Workflow

1. **Command Type Detection**: Determine command type from `$ARGUMENTS` or ask user:
   - If `$ARGUMENTS` contains "splash" or user wants router + variants → **Splash Mode**
   - If `$ARGUMENTS` contains "simple" or user wants a standalone command → **Simple Mode**
   - If unclear → ask user: "Splash (router + variants) or Simple (standalone)?"

2. **Simple Mode** — Generate a single standalone command file:
   - Ask for: command name, description, agent, argument-hint
   - Create command markdown with frontmatter and process sections
   - Save to `packages/{package}/commands/{name}.md`

3. **Splash Mode** — Generate router + variant command files:
   - Ask for: command namespace, variant names (e.g., fast, deep, parallel)
   - Create router command in `packages/{package}/commands/{namespace}.md`
   - Create variant commands in `packages/{package}/commands/{namespace}/{variant}.md`
   - Each variant gets its own agent, description, and process

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

**IMPORTANT:** This command handles both simple and splash generation inline (no longer delegates to variants).
**IMPORTANT:** All new commands MUST have an `agent:` field in frontmatter.
**IMPORTANT:** Commands are instructions FOR Claude, not messages TO the user.
**IMPORTANT:** Copy to `packages/{package}/commands/` as source of truth, `.claude/commands/` is generated.
