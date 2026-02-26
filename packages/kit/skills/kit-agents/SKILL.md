---
name: kit-agents
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

| Field | Required | Source | Type | Description |
|-------|----------|--------|------|-------------|
| `name` | Yes | Official | string | Identifier (lowercase, hyphens, 3-50 chars) |
| `description` | Yes | Official | string | Triggering conditions with `<example>` blocks |
| `model` | Yes | Official | string | `inherit`, `sonnet`, `opus`, `haiku` |
| `color` | Yes | Official | string | `blue`, `cyan`, `green`, `yellow`, `magenta`, `red` |
| `tools` | No | Official | array | Restrict available tools (default: all) |
| `skills` | No | Ecosystem | array | Preload skills into agent context at startup |
| `memory` | No | Ecosystem | string | Persistent learning: `user`, `project`, `local` |
| `permissionMode` | No | Ecosystem | string | `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan` |
| `hooks` | No | Ecosystem | object | Per-agent scoped hooks (same format as settings.json hooks) |
| `disallowedTools` | No | Ecosystem | string | Comma-separated tools to deny (advisory) |
| `allowedTools` | No | Ecosystem | string | Comma-separated tools to allow |

**Source legend:** *Official* = confirmed in upstream `anthropics/claude-code` plugin-dev docs. *Ecosystem* = documented in our reference and observed working but not confirmed upstream.

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
├── agents/                           # 20 specialized agents
│   ├── epost-orchestrator.md         # Task router & project manager
│   ├── epost-architect.md            # Architecture planning
│   ├── epost-planner.md              # Plan file creation
│   ├── epost-implementer.md          # Code implementation
│   ├── epost-reviewer.md             # Code review
│   ├── epost-debugger.md             # Root cause debugging
│   ├── epost-tester.md               # Test orchestration
│   ├── epost-researcher.md           # Technology research
│   ├── epost-documenter.md           # Documentation management
│   ├── epost-git-manager.md          # Git workflow automation
│   ├── epost-guide.md                # Non-technical user concierge
│   ├── epost-web-developer.md        # Web platform specialist
│   ├── epost-ios-developer.md        # iOS platform specialist
│   ├── epost-android-developer.md    # Android platform specialist
│   ├── epost-backend-developer.md    # Java EE backend specialist
│   ├── epost-cli-developer.md        # CLI tool specialist
│   ├── epost-scout.md                # Codebase exploration
│   ├── epost-brainstormer.md         # Creative ideation
│   ├── epost-a11y-specialist.md      # Multi-platform accessibility (WCAG 2.1 AA)
│   └── epost-muji.md                 # MUJI UI library
├── commands/                         # Slash commands
│   ├── epost/                        # Global: cook, plan, fix, debug, test, review, scout, ask, brainstorm, bootstrap, guide
│   ├── web/                          # Web: cook, test
│   ├── ios/                          # iOS: cook, test, debug, simulator, a11y
│   ├── android/                      # Android: cook, test
│   ├── cook/                          # Cook: auto (plan executor)
│   ├── git/                          # Git: commit, push, pr
│   ├── docs/                         # Docs: component, init, update
│   └── plan/                         # Planning: fast, hard, parallel
├── skills/                           # Domain knowledge (44 skills)
│   ├── agents/                       # Ecosystem hub
│   │   ├── SKILL.md                  # This file
│   │   └── claude/                   # Claude Code-specific
│   │       ├── agent-development/    # Agent creation guide
│   │       └── skill-development/    # Skill creation guide
│   ├── core/                         # Operational rules (4 aspects)
│   ├── web/                          # Web skills
│   │   ├── nextjs/                   # Next.js patterns
│   │   ├── frontend-development/     # React/frontend patterns
│   │   ├── backend-development/      # Node.js/API patterns
│   │   ├── figma/                    # Figma MCP + extraction procedure
│   │   └── ui-lib-dev/               # klara-theme pipeline (5 aspects)
│   ├── ios/                          # iOS skills
│   │   └── development/              # Swift/SwiftUI patterns
│   ├── android/                      # Android skills
│   │   └── development/              # Kotlin/Compose patterns
│   ├── planning/                     # Planning methodology (context: fork)
│   ├── debugging/                    # Debug methodology (context: fork)
│   ├── research/                     # Research methodology (context: fork)
│   ├── databases/                    # Database patterns
│   ├── docker/                       # Container patterns
│   ├── code-review/                  # Code quality assessment
│   ├── docs-seeker/                  # Documentation lookup (Context7)
│   ├── error-recovery/               # Error handling patterns
│   ├── problem-solving/              # Root cause analysis
│   ├── repomix/                      # Codebase summaries
│   └── sequential-thinking/          # Step-by-step analysis
├── workflows/                        # Reference docs (NOT auto-discovered)
│   ├── feature-development.md
│   ├── bug-fixing.md
│   └── project-init.md
├── output-styles/                    # Response formatting (5 styles)
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
| **Commands** | `[Imperative verb] [object/scope]` |

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
