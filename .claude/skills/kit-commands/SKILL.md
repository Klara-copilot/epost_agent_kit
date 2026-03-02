---
name: kit-commands
description: This skill should be used when the user asks to "create a slash command", "add a command", "write a custom command", "define command arguments", "use command frontmatter", "organize commands", "create command with file references", "interactive command", "use AskUserQuestion in command", or needs guidance on slash command structure, YAML frontmatter fields, dynamic arguments, bash execution in commands, user interaction patterns, or command development best practices for Claude Code.
disable-model-invocation: true
metadata:
  keywords:
    - command
    - slash-command
    - add-command
    - command-frontmatter
  agent-affinity:
    - epost-implementer
  platforms:
    - all
---

# Command Development for Claude Code

Slash commands are Markdown files that Claude executes when invoked. They provide reusability, consistency, and quick access to complex workflows.

**Critical:** Commands are written **for Claude to execute**, not for the user to read. Write directives TO Claude about what to do.

## Command Locations

| Location | Scope | Use for |
|----------|-------|---------|
| `.claude/commands/` | Project (shared with team) | Team workflows, project-specific tasks |
| `~/.claude/commands/` | Global (all projects) | Personal utilities, cross-project tools |
| `plugin-name/commands/` | Plugin (when installed) | Plugin-specific functionality |

## Basic File Format

```markdown
---
description: Review code for security issues
allowed-tools: Read, Bash(git:*)
model: sonnet
argument-hint: [pr-number]
---

Review pull request #$ARGUMENTS for security vulnerabilities...
```

No frontmatter needed for simple commands.

## Quick Frontmatter Reference

| Field | Type | Purpose |
|-------|------|---------|
| `description` | String | Shown in `/help`. **MUST** start with `(ePost)` prefix |
| `allowed-tools` | String | Tools command can use (e.g. `Read, Bash(git:*)`) |
| `model` | String | `sonnet`, `opus`, or `haiku` |
| `argument-hint` | String | Documents arguments for autocomplete |
| `agent` | String | Route to specific agent (rarely needed) |
| `disable-model-invocation` | Boolean | Prevent programmatic invocation |

## Dynamic Arguments

```
$ARGUMENTS    → all arguments as one string
$1, $2, $3    → positional arguments
@$1           → file reference (reads the file)
!`command`    → bash execution (inline context gathering)
```

**Example:**
```markdown
---
argument-hint: [pr-number]
allowed-tools: Bash(gh:*)
---

PR info: !`gh pr view $1`

Review PR #$1 for code quality and security.
```

## Command Organization

**Flat** (< 15 commands): All files in `commands/` root.

**Namespaced** (15+ commands):
```
commands/
├── git/commit.md     → /commit
├── git/pr.md         → /pr
└── deploy/staging.md → /staging
```

## Best Practices

- **Single responsibility** — one command, one task
- **Description prefix** — ALL commands MUST have `(ePost)` prefix in description field (e.g., `description: (ePost) Fix issues`)
- **Explicit dependencies** — use `allowed-tools` when needed
- **Always add `argument-hint`** when command takes arguments
- **Validate arguments early** — check for required args in prompt body
- **Verb-noun naming** — `review-pr`, `fix-issue`, `deploy-staging`

## Reference Files

- **`references/command-structure.md`** — Full frontmatter field specs, dynamic arguments, file reference syntax, bash execution examples, common patterns, troubleshooting
- **`references/plugin-features-reference.md`** — Plugin-specific features (`CLAUDE_PLUGIN_ROOT`), multi-component workflows, validation patterns, agent/skill/hook integration
