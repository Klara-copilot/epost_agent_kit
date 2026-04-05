# Claude Code Sub-Agent Specification

*Anthropic's authoritative sub-agent spec. For ePost-specific conventions layered on top, see the kit-agent-development skill.*

---

## What a Sub-Agent Is

A sub-agent is a specialized AI assistant that handles specific types of tasks. Each sub-agent runs in **its own context window** with a custom system prompt, specific tool access, and independent permissions.

**Key properties:**
- Receives only its own system prompt — NOT the full CC system prompt
- Does NOT inherit skills from the parent conversation (must list in `skills:` frontmatter)
- Cannot spawn other sub-agents — terminal node (iron law)
- Works independently and returns results to the calling context

---

## Built-In Sub-Agents

| Agent | Model | Tools | When Claude uses it |
|-------|-------|-------|---------------------|
| **Explore** | Haiku | Read-only | File discovery, code search, codebase exploration |
| **Plan** | Inherits | Read-only | Codebase research during plan mode |
| **general-purpose** | Inherits | All tools | Complex multi-step tasks requiring exploration + modification |

Explore accepts a thoroughness level: `quick`, `medium`, or `very thorough`.

---

## File Structure

```
.claude/agents/
└── agent-name.md    ← body = system prompt
```

---

## Frontmatter Fields

Only `name` and `description` are required.

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier. Lowercase + hyphens only. |
| `description` | Yes | When Claude should delegate to this agent. The routing signal. |
| `tools` | No | Allowlist of tools the agent can use. Inherits all if omitted. |
| `disallowedTools` | No | Denylist — removed from inherited list. |
| `model` | No | `sonnet`, `opus`, `haiku`, full model ID, or `inherit` (default). |
| `permissionMode` | No | See Permission Modes below. |
| `maxTurns` | No | Max agentic turns before agent stops. |
| `skills` | No | Skills to inject at startup. Full content injected, not just made available. |
| `mcpServers` | No | MCP servers for this agent. String = reference existing; inline object = scoped. |
| `hooks` | No | Lifecycle hooks scoped to this agent's execution. |
| `memory` | No | Persistent memory scope: `user`, `project`, or `local`. |
| `background` | No | `true` = always run as background task. |
| `effort` | No | `low`, `medium`, `high`, `max` (Opus 4.6 only). |
| `isolation` | No | `worktree` = run in a temporary git worktree (isolated copy). |
| `color` | No | `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan`. |
| `initialPrompt` | No | Auto-submitted as first user turn when agent runs as main session. |

---

## Agent Scope Priority

When multiple agents share the same name, higher-priority location wins:

| Location | Scope | Priority |
|----------|-------|----------|
| Managed settings | Organization-wide | 1 (highest) |
| `--agents` CLI flag | Current session only | 2 |
| `.claude/agents/` | Current project | 3 |
| `~/.claude/agents/` | All your projects | 4 |
| Plugin's `agents/` dir | Where plugin is enabled | 5 (lowest) |

Plugin sub-agents do NOT support `hooks`, `mcpServers`, or `permissionMode` — ignored for security.

---

## Permission Modes

| Mode | Behavior |
|------|----------|
| `default` | Standard permission checking with prompts |
| `acceptEdits` | Auto-accept file edits except in protected directories |
| `auto` | Background classifier reviews commands and protected-directory writes |
| `dontAsk` | Auto-deny permission prompts (explicitly allowed tools still work) |
| `bypassPermissions` | Skip all permission prompts ⚠️ |
| `plan` | Read-only exploration, no writes |

**Inheritance:** If parent uses `bypassPermissions`, it takes precedence and cannot be overridden. If parent uses `auto`, sub-agent inherits `auto` and `permissionMode` in frontmatter is ignored.

---

## Tool Control

### Allowlist (`tools:`)
```yaml
tools: Read, Glob, Grep, Bash
```
Only these tools are available. Agent cannot use any others.

### Denylist (`disallowedTools:`)
```yaml
disallowedTools: Write, Edit
```
Inherits every tool from main conversation except the listed ones.

**If both set:** `disallowedTools` applied first, then `tools` resolved against remaining pool. A tool in both is removed.

---

## Model Resolution Order

1. `CLAUDE_CODE_SUBAGENT_MODEL` environment variable (if set)
2. Per-invocation `model` parameter from calling context
3. `model` field in sub-agent frontmatter
4. Main conversation's model (default: `inherit`)

---

## Skills in Sub-Agents

```yaml
---
name: api-developer
description: Implement API endpoints following team conventions
skills:
  - api-conventions
  - error-handling-patterns
---
```

**Critical rule:** Sub-agents do NOT inherit skills from the parent conversation. Skills must be listed explicitly in `skills:`. The **full skill content** is injected at startup — not just made available for invocation.

This is the inverse of `context: fork` in a skill:
- `skills:` in sub-agent → sub-agent controls context, skill content is injected
- `context: fork` in skill → skill dispatches to the named agent, content injected there

---

## Persistent Memory

```yaml
memory: project
```

| Scope | Location | Use when |
|-------|----------|----------|
| `user` | `~/.claude/agent-memory/<name>/` | Learnings apply across all projects |
| `project` | `.claude/agent-memory/<name>/` | Project-specific, shareable via version control |
| `local` | `.claude/agent-memory-local/<name>/` | Project-specific, NOT in version control |

When memory is enabled: first 200 lines or 25KB of `MEMORY.md` is injected into system prompt.

**Recommended default:** `project` scope — shareable via version control.

---

## Iron Law: Sub-Agents Cannot Spawn Sub-Agents

Sub-agents cannot spawn further sub-agents. Neither Agent tool nor Task tool is available in sub-agent context.

**Multi-agent workflows must be orchestrated from the main conversation context:**

```
✅ Main → [Agent tool] → agent-1 (independent)
✅ Main → [Agent tool] → agent-2 (independent)
✅ Main reads both results and merges

❌ Main → [Agent tool] → agent-A
                             → [Agent tool] → agent-B  ← BLOCKED
```

Skills that orchestrate multi-agent workflows must NOT use `context: fork` — they must run inline in the main context.

---

## CLI-Defined Sub-Agents (Session-only)

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use after code changes.",
    "prompt": "You are a senior code reviewer...",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

Supports all frontmatter fields. Not saved to disk.
