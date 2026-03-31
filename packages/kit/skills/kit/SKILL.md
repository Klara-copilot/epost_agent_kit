---
name: kit
description: (ePost) Use when creating, editing, or improving kit content — agents, skills, hooks; or when user says "kit authoring", "scaffold a skill", "add an agent", "write a hook"
user-invocable: true
context: fork
agent: epost-fullstack-developer
metadata:
  argument-hint: "[--add-agent | --add-skill | --add-hook | --optimize] [name]"
  connections:
    enhances: []
    requires: []
---

## Delegation — REQUIRED

This skill MUST run via `epost-fullstack-developer`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/kit`
- **Arguments**: `$ARGUMENTS` (full argument string from Skill invocation)
- If no arguments: state "no arguments — use auto-detection"

# Kit — Unified Kit Authoring Command

Create or optimize agents, skills, hooks, and commands for epost_agent_kit.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--add-agent`: load `references/add-agent.md` and execute. Pass remaining args as agent name.
If `$ARGUMENTS` starts with `--add-skill`: load `references/add-skill.md` and execute. Pass remaining args as skill name.
If `$ARGUMENTS` starts with `--add-hook`: load `references/add-hook.md` and execute. Pass remaining args as hook name.
If `$ARGUMENTS` starts with `--optimize`: load `references/optimize.md` and execute. Pass remaining args as skill name.
Otherwise: continue to Auto-Detection.

## Aspect Files

| File | Purpose |
|------|---------|
| `references/add-agent.md` | Create a new agent definition |
| `references/add-skill.md` | Create a new skill definition |
| `references/add-hook.md` | Create a new hook for Claude Code automation |
| `references/optimize.md` | Optimize an existing agent skill |
| `references/agent-development.md` | Agent frontmatter, system prompts, ecosystem fields |
| `references/skill-development.md` | Skill structure, frontmatter, CSO principles |
| `references/hooks.md` | Hook events, I/O contract, architecture |
| `references/cli.md` | CLI tech stack, project structure, commands |
| `references/agents.md` | Ecosystem reference, frontmatter tables, naming |
| `references/verify.md` | Pre-release audit workflow, CLI commands |

## Auto-Detection

Analyze `$ARGUMENTS` for type keywords:

| Keyword | Load Reference |
|---------|---------------|
| "agent" | `references/add-agent.md` |
| "skill" | `references/add-skill.md` |
| "hook" | `references/add-hook.md` |
| "optim" | `references/optimize.md` |
| Empty or ambiguous | Ask user: what type to create? (agent, skill, hook, or optimize existing) |

## Execution

Load the matching reference file and execute its workflow.
