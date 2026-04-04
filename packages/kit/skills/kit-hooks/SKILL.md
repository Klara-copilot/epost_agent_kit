---
name: kit-hooks
description: "(ePost) Use when creating a hook, debugging hook behavior, or checking which hook event to use. Reference: event types (PreToolUse, PostToolUse, SessionStart, Stop), I/O contract, settings.json config."
user-invocable: false
metadata:
  keywords: [hook, PreToolUse, PostToolUse, SessionStart, event, automation, settings]
  triggers: [hook development, create hook, hook event, hook architecture]
  platforms: [all]
  agent-affinity: [epost-fullstack-developer]
  connections:
    enhances: [kit]
---

# Hook Development for epost_agent_kit

## Hook Types

| Type | When to use |
|------|-------------|
| **command** | Deterministic bash/node scripts — fast checks, blocking, validation |
| **prompt** | LLM-driven — context-aware validation (Stop, SubagentStop, UserPromptSubmit, PreToolUse) |

## Hook Events

| Event | When | Use For |
|-------|------|---------|
| `PreToolUse` | Before tool runs | Validation, blocking, modification |
| `PostToolUse` | After tool completes | Feedback, logging, lint/build |
| `UserPromptSubmit` | User sends prompt | Context injection, rules reminder |
| `Stop` | Agent stopping | Completeness check, notification |
| `SubagentStop` | Subagent done | Task validation |
| `SessionStart` | Session begins | Project detection, env setup |
| `SessionEnd` | Session ends | Cleanup, logging |
| `PreCompact` | Before compaction | Preserve critical context |
| `Notification` | User notified | Reactions |

## I/O Contract Summary

- **Input**: JSON via stdin — `session_id`, `cwd`, `hook_event_name`, `tool_name`, `tool_input`
- **Output**: JSON via stdout — `hookSpecificOutput.permissionDecision` (allow/deny/ask) + `systemMessage`
- **Exit codes**: 0 = success, 2 = blocking error (stderr → Claude)

## Creating a New Hook

1. Create `packages/{package}/hooks/{hook-name}.cjs` (CommonJS `.cjs`)
2. Wire into `packages/core/settings.json` under appropriate event
3. Add to `packages/{package}/package.yaml` files mapping if needed
4. Test: `echo '{"tool_name":"X"}' | node packages/{package}/hooks/{hook-name}.cjs`
5. Run `epost-kit init --fresh` to regenerate

**Source of truth**: `packages/` — never edit `.claude/` directly.

## References

- `references/hook-implementation-examples.md` — Full script template, settings.json config examples, matcher patterns, I/O contract details, epost_agent_kit hook architecture map
