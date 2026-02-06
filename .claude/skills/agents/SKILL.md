---
name: agents
description: Claude Code agent ecosystem structure, component reference, and development patterns. Use when creating or modifying agents, skills, commands, hooks, or planning ecosystem changes.
user-invocable: false
---

# Agent Ecosystem Reference

Persistent reference for the epost_agent_kit Claude Code ecosystem. Use this when planning changes, creating new components, or auditing the agent system.

## Claude Code Official Components

| Component | Location | Auto-discovered | Purpose |
|-----------|----------|----------------|---------|
| **Agents** | `.claude/agents/` | Yes | Autonomous subprocesses for complex tasks |
| **Skills** | `.claude/skills/` | Yes (nested) | Domain knowledge and workflows |
| **Commands** | `.claude/commands/` | Yes (nested) | User-triggered slash commands (merged into skills) |
| **Hooks** | `.claude/settings.json` | Yes | Event-triggered actions (PreToolUse, PostToolUse, Stop, etc.) |
| **Output Styles** | `.claude/output-styles/` | Yes | Custom response formatting |
| **MCP Servers** | `.mcp.json` (project) / `settings.json` (user) | Yes | External tool integrations |
| **Plugins** | `.claude-plugin/plugin.json` | Via `--plugin-dir` | Distributable component bundles |

**NOT official:** `.claude/workflows/` — Custom reference documentation only, not auto-discovered by Claude Code.

## Commands & Skills Merge

Commands and skills are functionally equivalent and share the same frontmatter fields. Both create `/slash-command` entries. Skills are the preferred format for new additions. Commands in `.claude/commands/` continue to work.

**Key difference:** Skills use `SKILL.md` in a directory; commands are standalone `.md` files in `commands/`.

## Nested Directory Support

Skills support nested directories. Claude Code auto-discovers `SKILL.md` files at any depth under `.claude/skills/`. This enables hierarchical organization like `skills/agents/claude/agent-development/SKILL.md`.

## Agent Frontmatter Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `name` | Yes | string | Identifier (lowercase, hyphens, 3-50 chars) |
| `description` | Yes | string | Triggering conditions with `<example>` blocks |
| `model` | Yes | string | `inherit`, `sonnet`, `opus`, `haiku` |
| `color` | Yes | string | `blue`, `cyan`, `green`, `yellow`, `magenta`, `red` |
| `tools` | No | array | Restrict available tools (default: all) |
| `skills` | No | array | Preload skills into agent context at startup |
| `memory` | No | string | Persistent learning: `user`, `project`, `local` |
| `permissionMode` | No | string | `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan` |
| `hooks` | No | object | Per-agent scoped hooks (same format as settings.json hooks) |
| `disallowedTools` | No | string | Comma-separated tools to deny |
| `allowedTools` | No | string | Comma-separated tools to allow |

## Skill Frontmatter Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `name` | Yes | string | Skill identifier |
| `description` | Yes | string | When to use (third-person with trigger phrases) |
| `context` | No | string | `fork` — run in isolated subagent |
| `agent` | No | string | Which subagent type for `context: fork` |
| `user-invocable` | No | boolean | `false` hides from `/` menu |
| `disable-model-invocation` | No | boolean | `true` prevents auto-trigger |
| `allowed-tools` | No | array | Restrict tools in forked context |
| `hooks` | No | object | Per-skill hooks |
| `model` | No | string | Override model for this skill |
| `argument-hint` | No | string | Placeholder text for skill argument |

**Invalid fields:** `version` (not recognized by Claude Code)

## Directory Structure

```
.claude/
├── agents/                           # 12 specialized agents
│   ├── epost-orchestrator.md
│   ├── epost-architect.md
│   ├── epost-implementer.md
│   ├── epost-reviewer.md
│   ├── epost-debugger.md
│   ├── epost-tester.md
│   ├── epost-researcher.md
│   ├── epost-documenter.md
│   ├── epost-git-manager.md
│   ├── epost-web-developer.md
│   ├── epost-ios-developer.md
│   └── epost-android-developer.md
├── commands/                         # Slash commands (28)
│   ├── core/                         # Global commands
│   ├── web/                          # Web platform
│   ├── ios/                          # iOS platform
│   ├── android/                      # Android platform (SKELETON)
│   ├── fix/                          # Bug fix commands
│   ├── git/                          # Git workflow
│   ├── docs/                         # Documentation
│   └── design/                       # UI design
├── skills/                           # Domain knowledge (14 skills)
│   ├── agents/                       # Ecosystem hub
│   │   ├── SKILL.md                  # This file
│   │   └── claude/                   # Claude Code-specific
│   │       ├── agent-development/    # Agent creation guide
│   │       └── skill-development/    # Skill creation guide
│   ├── core/                         # Operational rules (4 aspects)
│   ├── web/                          # Web skills (5)
│   │   ├── klara-theme/              # klara-theme pipeline (5 aspects)
│   ├── ios/                          # iOS skills (1 + 3 aspects)
│   ├── android/                      # Android skills (SKELETON)
│   ├── planning/                     # Planning methodology
│   ├── debugging/                    # Debug methodology
│   ├── research/                     # Research methodology
│   ├── databases/                    # Database patterns
│   └── docker/                       # Container patterns
├── workflows/                        # Reference docs (NOT auto-discovered)
│   ├── feature-development.md
│   ├── bug-fixing.md
│   └── project-init.md
├── output-styles/                    # Response formatting (2 styles)
└── settings.json                     # Hooks, permissions, env vars
```

## Naming Conventions

| Component | Pattern | Example |
|-----------|---------|---------|
| Agent files | `epost-<role>.md` | `epost-architect.md` |
| Platform agents | `epost-<platform>-developer.md` | `epost-web-developer.md` |
| Commands | `<category>/<action>.md` | `web/cook.md` |
| Skills | `<domain>/SKILL.md` | `web/nextjs/SKILL.md` |
| Nested skills | `<parent>/<child>/<domain>/SKILL.md` | `agents/claude/agent-development/SKILL.md` |

## Description Patterns

| Component | Pattern |
|-----------|---------|
| **Agents** | `[Role] agent that [does X]. Use for [contexts].` |
| **Skills** | `[Domain] [description]. Use when [contexts].` |
| **Commands** | `⭑.ᐟ [Imperative verb] [object/scope]` |

## Plugin System

Distributable via `.claude-plugin/plugin.json`:

```json
{
  "name": "plugin-name",
  "description": "Plugin description",
  "version": "1.0.0",
  "commands": ["./.claude/commands/"],
  "agents": ["./.claude/agents/"],
  "skills": ["./.claude/skills/"]
}
```

Load with: `claude --plugin-dir /path/to/plugin`

## Sub-Skills

- `claude/agent-development/SKILL.md` — Agent creation, frontmatter, system prompts, triggering
- `claude/skill-development/SKILL.md` — Skill creation, progressive disclosure, validation

## Related Documents

- `CLAUDE.md` — Project overview and guidelines
- `.claude/skills/core/SKILL.md` — Operational rules
- `.claude/agents/` — Agent definitions
