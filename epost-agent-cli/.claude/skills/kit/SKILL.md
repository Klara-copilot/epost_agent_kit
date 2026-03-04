---
name: kit
description: "(ePost) Kit authoring — create agents, skills, hooks, or optimize"
user-invocable: true
context: fork
agent: epost-implementer
metadata:
  argument-hint: "[--add-agent | --add-skill | --add-hook | --optimize] [name]"
  connections:
    enhances: [kit-add-agent, kit-add-skill, kit-add-hook, kit-optimize-skill]
    requires: [kit-agents, kit-skill-development]
---

# Kit — Unified Kit Authoring Command

Create or optimize agents, skills, hooks, and commands for epost_agent_kit.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--add-agent`: dispatch `kit-add-agent`. Pass remaining args as agent name.
If `$ARGUMENTS` starts with `--add-skill`: dispatch `kit-add-skill`. Pass remaining args as skill name.
If `$ARGUMENTS` starts with `--add-hook`: dispatch `kit-add-hook`. Pass remaining args as hook name.
If `$ARGUMENTS` starts with `--optimize`: dispatch `kit-optimize-skill`. Pass remaining args as skill name.
Otherwise: continue to Auto-Detection.

## Auto-Detection

Analyze `$ARGUMENTS` for type keywords:

| Keyword | Dispatch |
|---------|----------|
| "agent" | `kit-add-agent` |
| "skill" | `kit-add-skill` |
| "hook" | `kit-add-hook` |
| "optim" | `kit-optimize-skill` |
| Empty or ambiguous | Ask user: what type to create? (agent, skill, hook, or optimize existing) |

## Execution

Load the reference documentation for the dispatched variant and execute its workflow.
