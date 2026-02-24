---
description: (ePost) ⚙️ Create a new agent definition
agent: epost-implementer
argument-hint: [agent-name] [description]
---

## Your Mission

Create a new agent definition file following epost_agent_kit conventions.

**IMPORTANT:** Use `agent-development` skill for frontmatter reference and best practices.

## Arguments

- AGENT_NAME: $1 (required — lowercase, hyphens, e.g. `epost-my-agent`)
- DESCRIPTION: $2 (optional — what the agent does)

## Workflow

1. **Gather Info** (if not provided via arguments):
   - Agent name (must follow `epost-<role>` pattern)
   - Purpose / what tasks it handles
   - Which package it belongs to (core, platform-web, platform-ios, platform-android, platform-backend, meta-kit-design, ui-ux)
   - Model tier: haiku (routing/search), sonnet (implementation), opus (architecture)
   - Color: blue, cyan, green, yellow, magenta, red

2. **Scaffold Agent File**:
   - Create `.claude/agents/{agent-name}.md` with proper frontmatter
   - Include: name, description (with `<example>` blocks), model, color
   - Add: skills, permissionMode, disallowedTools as needed
   - Write system prompt body with role definition, workflow, and rules

3. **Copy to Package Source**:
   - Copy agent file to `packages/{package}/agents/{agent-name}.md`
   - This is the source of truth — `.claude/` is generated output

4. **Register**:
   - Update `packages/{package}/package.yaml` agents list
   - Update `.claude/skills/agents/SKILL.md` agent tree
   - Update `packages/meta-kit-design/skills/agents/SKILL.md` agent tree

5. **Report**: Agent name, package, model, file paths created

## Rules

- Agent names MUST start with `epost-`
- Description MUST include `<example>` blocks for triggering
- Read-only agents (reviewer, researcher) use `permissionMode: plan`
- Follow YAGNI — don't add tools/skills the agent won't use
