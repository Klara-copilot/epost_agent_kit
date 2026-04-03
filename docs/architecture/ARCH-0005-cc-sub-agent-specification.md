# ARCH-0005: Claude Code Sub-Agent Specification

**Status**: Current (authoritative)
**Source**: Claude Code documentation — "Create custom subagents" (code.claude.com/docs/en/sub-agents)
**Audience**: Agent, human

This document is the ground truth for CC sub-agent structure, frontmatter fields, permission modes, and behavior. It describes what Claude Code defines officially, before any ePost additions. See CONV-0003 for ePost-specific conventions layered on top.

---

## What a Sub-Agent Is

A sub-agent is a specialized AI assistant that handles specific types of tasks. Each sub-agent runs in **its own context window** with a custom system prompt, specific tool access, and independent permissions.

**Key properties:**
- Receives only its own system prompt (NOT the full CC system prompt)
- Does NOT inherit skills from the parent conversation (must list them in `skills:` frontmatter)
- Cannot spawn other sub-agents (iron law — subagents cannot nest)
- Works independently and returns results to the calling context

---

## Built-In Sub-Agents

| Agent | Model | Tools | When Claude uses it |
|-------|-------|-------|---------------------|
| **Explore** | Haiku (fast) | Read-only (no Write/Edit) | File discovery, code search, codebase exploration |
| **Plan** | Inherits | Read-only (no Write/Edit) | Codebase research during plan mode |
| **general-purpose** | Inherits | All tools | Complex multi-step tasks requiring exploration + modification |
| statusline-setup | Sonnet | Read, Edit | When `/statusline` is run |
| Claude Code Guide | Haiku | Read-only | Questions about Claude Code features |

Explore accepts a **thoroughness level** from the caller: `quick` (targeted lookups), `medium` (balanced), or `very thorough` (comprehensive).

---

## File Structure

Sub-agents are Markdown files with YAML frontmatter:

```
.claude/agents/
└── agent-name.md
```

The body of the file becomes the system prompt.

---

## Frontmatter Fields

Only `name` and `description` are required.

| Field | Required | Description |
|-------|----------|-------------|
| `name` | **Yes** | Unique identifier. Lowercase letters and hyphens. |
| `description` | **Yes** | When Claude should delegate to this sub-agent. This is the routing signal — write it clearly. |
| `tools` | No | Allowlist of tools the sub-agent can use. Inherits all tools if omitted. |
| `disallowedTools` | No | Denylist — removed from inherited or specified list. |
| `model` | No | Model alias (`sonnet`, `opus`, `haiku`), full model ID (e.g. `claude-opus-4-6`), or `inherit`. Defaults to `inherit`. |
| `permissionMode` | No | See Permission Modes below. |
| `maxTurns` | No | Maximum agentic turns before sub-agent stops. |
| `skills` | No | Skills to load into sub-agent's context at startup. Full content injected, not just made available. |
| `mcpServers` | No | MCP servers available to this sub-agent. String = reference existing; inline object = scoped to this agent only. |
| `hooks` | No | Lifecycle hooks scoped to this sub-agent's execution. |
| `memory` | No | Persistent memory scope: `user`, `project`, or `local`. Enables cross-session learning. |
| `background` | No | `true` = always run as a background task. Default: `false`. |
| `effort` | No | `low`, `medium`, `high`, `max` (Opus 4.6 only). Overrides session effort level. |
| `isolation` | No | `worktree` = run in a temporary git worktree (isolated copy). Cleaned up if no changes made. |
| `color` | No | Display color: `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan`. |
| `initialPrompt` | No | Auto-submitted as first user turn when agent runs as the main session agent (via `--agent` or `agent` setting). Commands and skills are processed. Prepended to any user-provided prompt. |

---

## Sub-Agent Scopes

When multiple sub-agents share the same name, higher-priority location wins:

| Location | Scope | Priority |
|----------|-------|----------|
| Managed settings | Organization-wide | 1 (highest) |
| `--agents` CLI flag | Current session only | 2 |
| `.claude/agents/` | Current project | 3 |
| `~/.claude/agents/` | All your projects | 4 |
| Plugin's `agents/` dir | Where plugin is enabled | 5 (lowest) |

**Project sub-agents** (`.claude/agents/`) are ideal for codebase-specific agents. Check them into version control for team sharing.

**Plugin sub-agents** do NOT support `hooks`, `mcpServers`, or `permissionMode` fields — these are ignored for security reasons.

---

## Permission Modes

| Mode | Behavior |
|------|----------|
| `default` | Standard permission checking with prompts |
| `acceptEdits` | Auto-accept file edits except in protected directories |
| `auto` | Background classifier reviews commands and protected-directory writes |
| `dontAsk` | Auto-deny permission prompts (explicitly allowed tools still work) |
| `bypassPermissions` | Skip all permission prompts ⚠️ |
| `plan` | Read-only exploration mode |

**Inheritance rules:**
- If parent uses `bypassPermissions` → this takes precedence and cannot be overridden by sub-agent
- If parent uses `auto` mode → sub-agent inherits `auto` mode, `permissionMode` in frontmatter is ignored

**`bypassPermissions` exception:** Writes to `.git`, `.claude`, `.vscode`, `.idea`, `.husky` still prompt for confirmation — except for `.claude/commands`, `.claude/agents`, `.claude/skills`.

---

## Tool Control

### Allowlist (`tools:`)
```yaml
tools: Read, Glob, Grep, Bash
```
Only these tools are available. The sub-agent cannot edit files, write files, or use MCP tools.

### Denylist (`disallowedTools:`)
```yaml
disallowedTools: Write, Edit
```
Inherits every tool from the main conversation except Write and Edit.

**If both are set:** `disallowedTools` is applied first, then `tools` is resolved against the remaining pool. A tool in both is removed.

### Restricting Which Sub-Agents Can Be Spawned
When an agent runs as the main thread via `claude --agent`, use `Agent(name)` syntax in `tools:`:
```yaml
tools: Agent(worker, researcher), Read, Bash
```
This is an allowlist — only `worker` and `researcher` can be spawned. To allow all sub-agents: use `Agent` without parentheses. If `Agent` is omitted entirely, no sub-agents can be spawned.

*Note: This restriction only applies to agents running as the main thread. Sub-agents cannot spawn other sub-agents regardless.*

---

## Model Resolution Order

When a sub-agent runs, its model is resolved in this priority order:

1. `CLAUDE_CODE_SUBAGENT_MODEL` environment variable (if set)
2. Per-invocation `model` parameter passed by the calling context
3. `model` field in the sub-agent's frontmatter
4. The main conversation's model (default: `inherit`)

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

**Critical rule:** Sub-agents do NOT inherit skills from the parent conversation. Skills must be listed explicitly. The full skill content is injected into the sub-agent's context at startup — not just made available for invocation.

This is the inverse of `context: fork` in a skill definition:
- `skills:` in sub-agent frontmatter → sub-agent controls context, skill content is injected
- `context: fork` in skill → skill dispatches to the named agent, content injected there

Both use the same underlying injection system.

---

## Persistent Memory

```yaml
memory: project
```

| Scope | Location | Use when |
|-------|----------|----------|
| `user` | `~/.claude/agent-memory/<name>/` | Learnings apply across all projects |
| `project` | `.claude/agent-memory/<name>/` | Project-specific, shareable via version control |
| `local` | `.claude/agent-memory-local/<name>/` | Project-specific, NOT checked into version control |

When memory is enabled:
- System prompt includes read/write instructions for the memory directory
- First 200 lines or 25KB of `MEMORY.md` is injected into system prompt
- `Read`, `Write`, `Edit` tools are automatically enabled

**Recommended default:** `project` scope — makes knowledge shareable via version control.

---

## Hooks in Sub-Agents

Two ways to configure hooks:

1. **In sub-agent frontmatter** — run only while that sub-agent is active, cleaned up when it finishes
2. **In `settings.json`** — run in the main session when sub-agents start or stop

Example: Only allow read-only DB queries:
```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
```

---

## Iron Law: Sub-Agents Cannot Spawn Sub-Agents

**Sub-agents (spawned via Agent tool) cannot spawn further sub-agents.** Neither Agent tool nor Task tool is available in sub-agent context.

**Implication:** Multi-agent workflows (parallel research, hybrid audits) must be orchestrated from the **main conversation context**, not from within a sub-agent.

```
✅ Main context → [Agent tool] → agent-1 (independent)
✅ Main context → [Agent tool] → agent-2 (independent)
✅ Main context reads both results and merges

❌ Main context → [Agent tool] → agent-A
                                    → [Agent tool] → agent-B  ← BLOCKED
```

Skills that orchestrate multi-agent workflows must NOT use `context: fork` — they must run inline in the main context.

---

## CLI-Defined Sub-Agents

Pass as JSON when launching Claude Code. Session-only, not saved to disk:

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer...",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

Supports all frontmatter fields: `description`, `prompt`, `tools`, `disallowedTools`, `model`, `permissionMode`, `mcpServers`, `hooks`, `maxTurns`, `skills`, `initialPrompt`, `memory`, `effort`, `background`, `isolation`, `color`.

---

## Disabling Sub-Agents

Add to `permissions.deny` in settings:
```json
{
  "permissions": {
    "deny": ["Agent(Explore)", "Agent(my-custom-agent)"]
  }
}
```

Or via CLI flag: `claude --disallowedTools "Agent(Explore)"`

---

*Source: Claude Code documentation — code.claude.com/docs/en/sub-agents*
*Related: ARCH-0004 (CC Skill Spec), CONV-0003 (ePost Skill Standards)*
