---
name: kit-agent-development
description: "(ePost) Use when creating a new agent, reviewing agent structure, or checking agent frontmatter fields. Reference: agent file structure, frontmatter spec, system prompt design, ecosystem fields (skills, permissionMode, allowedTools)."
user-invocable: false
metadata:
  keywords: [agent, frontmatter, system-prompt, permissionMode, allowedTools, skills, color, model]
  triggers: [agent frontmatter, create agent, agent development, agent structure]
  platforms: [all]
  agent-affinity: [epost-fullstack-developer, epost-planner]
  connections:
    enhances: [kit]
---

# Agent Development for Claude Code

## What an Agent File Contains

Agents are markdown files with YAML frontmatter + system prompt body. Live in `packages/{package}/agents/{name}.md`.

**Source of truth**: `packages/` — `.claude/` is generated output, wiped on `epost-kit init`.

## Required Frontmatter Fields

| Field | Required | Notes |
|-------|----------|-------|
| `name` | yes | lowercase, hyphens, 3-50 chars, starts/ends alphanumeric |
| `description` | yes | triggering conditions + `<example>` blocks (2-4 examples) |
| `model` | no | `inherit` (default), `sonnet`, `opus`, `haiku` |
| `color` | no | `blue`, `cyan`, `green`, `yellow`, `magenta`, `red` |
| `allowedTools` | recommended | whitelist per principle of least privilege |
| `skills` | ePost | array of skill IDs, e.g. `[core, debugging]` |
| `permissionMode` | ePost | `default` (most agents), `acceptEdits`, `plan` (truly read-only only) |

## Naming Rules

- Pattern: `epost-<role>` (e.g., `epost-debugger`, `epost-planner`)
- File: `packages/{package}/agents/{agent-name}.md`
- Register in `packages/{package}/package.yaml` agents list

## Handoff Format (description field)

```
description: Use this agent when [conditions]. Examples:
<example>
Context: [situation]
user: "[request]"
assistant: "[response]"
<commentary>[why triggered]</commentary>
</example>
```

## permissionMode Rules

- `default` — agents that write reports, plans, or any file output
- `acceptEdits` — implementers/developers (auto-accept file edits)
- `plan` — ONLY for truly read-only agents with zero file output (blocks ALL writes including reports)
- Never use `plan` for reviewers or researchers that write report files

## allowedTools Quick Reference

| Role | Tools |
|------|-------|
| Read-only analysis | `[Read, Grep, Glob]` |
| Review + report | `[Read, Glob, Grep, Write]` |
| Planning | `[Read, Glob, Grep, Write, Edit]` |
| Implementation | `[Read, Glob, Grep, Write, Edit, Bash]` |
| Git automation | `[Read, Bash]` |

## References

- `references/agent-authoring-guide.md` — Full examples, all field options, anti-patterns, data store declaration, official CC fields (maxTurns, mcpServers, effort, isolation, background, initialPrompt)
- `references/cc-agent-spec.md` — Anthropic's authoritative sub-agent spec
