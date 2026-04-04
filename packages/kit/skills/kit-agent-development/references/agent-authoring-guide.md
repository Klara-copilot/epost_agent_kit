# Agent Authoring Guide

## Complete Agent File Format

```markdown
---
name: agent-identifier
description: Use this agent when [triggering conditions]. Examples:

<example>
Context: [Situation description]
user: "[User request]"
assistant: "[How assistant should respond and use this agent]"
<commentary>
[Why this agent should be triggered]
</commentary>
</example>

<example>
[Additional example...]
</example>

model: inherit
color: blue
allowedTools: [Read, Write, Grep]
---

You are [agent role description]...

**Your Core Responsibilities:**
1. [Responsibility 1]
2. [Responsibility 2]

**Analysis Process:**
[Step-by-step workflow]

**Output Format:**
[What to return]
```

## Field Reference — All Options

### name
- Format: lowercase, numbers, hyphens only
- Length: 3-50 characters
- Pattern: must start and end with alphanumeric
- Good: `code-reviewer`, `test-generator`, `api-docs-writer`
- Bad: `helper` (generic), `-agent-` (leading hyphen), `my_agent` (underscores)

### description
Must include:
1. Triggering conditions ("Use this agent when...")
2. Multiple `<example>` blocks (2-4) with context, user, assistant, commentary
3. Cover different phrasings of same intent
4. Be specific about when NOT to use the agent

### model
- `inherit` — use same model as parent (recommended default)
- `sonnet` — balanced
- `opus` — most capable, expensive
- `haiku` — fast, cheap

### color
- `blue`/`cyan` — analysis, review
- `green` — success-oriented tasks
- `yellow` — caution, validation
- `red` — critical, security
- `magenta` — creative, generation

### allowedTools (ePost convention)
Whitelist tools per principle of least privilege:
- Read-only: `[Read, Grep, Glob]`
- Review + report: `[Read, Glob, Grep, Write]`
- Planning: `[Read, Glob, Grep, Write, Edit]`
- Implementation: `[Read, Glob, Grep, Write, Edit, Bash]`
- Git automation: `[Read, Bash]`

Note: `allowedTools` is an ePost convention; `tools` is the upstream CC spec name. Both work.

### tools (official CC field)
Same tool lists as allowedTools. ePost agents use `allowedTools` by convention for clarity.

## Additional Official CC Fields

**`maxTurns`** — Maximum agentic turns before agent stops.

**`mcpServers`** — MCP servers available to this agent.

**`effort`** — `low`, `medium`, `high`, `max` (Opus 4.6 only). Overrides session effort level.

**`isolation`** — `worktree` = run in temporary git worktree (isolated copy). Auto-cleaned if no changes.

**`background`** — `true` = always run as background task.

**`initialPrompt`** — Auto-submitted as first user turn when agent runs via `--agent`.

## Ecosystem Fields (ePost Agent Kit)

**`skills`** — Array of skill IDs: `skills: [core, debugging]`. Most agents include `core`.

**`memory`** — Controls memory scope. Use `project` for cross-session context.

**`permissionMode`**:
- `default` — Standard permission prompts (most agents)
- `acceptEdits` — Auto-accept file edits (implementers)
- `plan` — Read-only, NO writes at all (truly read-only agents only)
- `bypassPermissions` — Full autonomy (use with caution)

**`disallowedTools`** — Deprecated. Prefer `allowedTools` whitelist.

## System Prompt Design

Body becomes the agent's system prompt. Write in second person.

**DO:** Be specific about responsibilities, provide step-by-step process, define output format, keep under 10,000 characters.
**DON'T:** Write in first person, be vague, omit process steps.

## Anti-Patterns

- `permissionMode: plan` for agents that write reports → blocks ALL writes including reports. Use `default` instead.
- Listing `disallowedTools` instead of `allowedTools` → less safe, less auditable.
- Generic description without `<example>` blocks → poor triggering accuracy.
- Model set to `opus` when `inherit` works → unnecessary cost.

## Data Store Declaration

If your agent produces persistent project-level data, add to agent system prompt:

```markdown
## Data Store
- **DB:** `.epost-data/{domain}/{domain}.json` (if exists)
- **Artifacts:** `.epost-data/{domain}/artifacts/` (if exists)
- **Schema:** `.claude/assets/{domain}-schema.json`
```

Steps:
1. Create schema at `packages/{pkg}/assets/{domain}-schema.json`
2. Add the "Data Store" section to the agent's system prompt
3. Reference paths with `(if exists)` guards
