---
name: kit
description: (ePost) Scaffolds and manages kit content — agents, skills, hooks — with best-practice templates. Use when creating, editing, or improving kit content — agents, skills, hooks; or when user says "kit authoring", "scaffold a skill", "add an agent", "write a hook"
user-invocable: true
context: fork
agent: epost-fullstack-developer
metadata:
  argument-hint: "[--add-agent | --add-skill | --add-hook | --optimize] [name]"
  keywords: [kit, scaffold, agent, skill, hook, authoring, create]
  triggers:
    - /kit
    - scaffold agent
    - create skill
    - manage hooks
    - add an agent
  platforms: [all]
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

If `$ARGUMENTS` starts with `--add-agent`: Read `.claude/skills/kit-add-agent/SKILL.md` and execute its workflow. Pass remaining args as agent name.
If `$ARGUMENTS` starts with `--add-skill`: Read `.claude/skills/kit-add-skill/SKILL.md` and execute its workflow. Pass remaining args as skill name.
If `$ARGUMENTS` starts with `--add-hook`: Read `.claude/skills/kit-add-hook/SKILL.md` and execute its workflow. Pass remaining args as hook name.
If `$ARGUMENTS` starts with `--optimize`: load `references/optimize.md` and execute. Pass remaining args as skill name.
Otherwise: continue to Auto-Detection.

## Aspect Files

| File | Purpose |
|------|---------|
| `.claude/skills/kit-add-agent/SKILL.md` | Create a new agent definition |
| `.claude/skills/kit-add-skill/SKILL.md` | Create a new skill definition |
| `.claude/skills/kit-add-hook/SKILL.md` | Create a new hook for Claude Code automation |
| `references/optimize.md` | Optimize an existing skill |
| `.claude/skills/kit-agent-development/SKILL.md` | Agent frontmatter, system prompts, ecosystem fields |
| `.claude/skills/kit-skill-development/SKILL.md` | Skill structure, frontmatter, CSO principles |
| `.claude/skills/kit-hooks/SKILL.md` | Hook events, I/O contract, architecture |
| `.claude/skills/kit-agents/SKILL.md` | Ecosystem reference, frontmatter tables, naming |
| `references/verify.md` | Pre-release audit workflow, CLI commands |

## Auto-Detection

Analyze `$ARGUMENTS` for type keywords:

| Keyword | Action |
|---------|--------|
| "agent" | Read `.claude/skills/kit-add-agent/SKILL.md` and execute |
| "skill" | Read `.claude/skills/kit-add-skill/SKILL.md` and execute |
| "hook" | Read `.claude/skills/kit-add-hook/SKILL.md` and execute |
| "optim" | Load `references/optimize.md` and execute |
| Empty or ambiguous | Ask user: what type to create? (agent, skill, hook, or optimize existing) |

## Execution

Read the matching skill file or reference file and execute its workflow.
