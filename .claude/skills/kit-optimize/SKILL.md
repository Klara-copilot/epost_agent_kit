---
name: kit-optimize
description: (ePost) Use when optimizing an existing skill for token efficiency, progressive disclosure, or CSO compliance. Use when user says "optimize skill", "improve skill", or "make skill more efficient".
argument-hint: "[skill-name] [prompt]"
user-invocable: true
context: fork
agent: epost-fullstack-developer
metadata:
  keywords: [optimize, skill, CSO, token-efficiency, progressive-disclosure]
  triggers: [/kit-optimize, optimize skill, improve skill, CSO fix]
  platforms: [all]
  agent-affinity: [epost-fullstack-developer]
  connections:
    requires: []
---

## Delegation — REQUIRED

This skill MUST run via `epost-fullstack-developer`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/kit-optimize`
- **Arguments**: $ARGUMENTS
- If no arguments: state "no arguments — target all skills"

Think harder.
Read `.claude/skills/kit-skill-development/SKILL.md` for skill structure and CSO principles.
Use `docs-seeker` skills to search for documentation if needed.

## Arguments
SKILL: $1 (default: `*`)
PROMPT: $2 (default: empty)

## Your mission
Optimize an existing skill in `.claude/skills/${SKILL}` directory.
Always keep in mind that `SKILL.md` and reference files should be token consumption efficient, so that **progressive disclosure** can be leveraged at best.
`SKILL.md` is always short and concise, straight to the point, treat it as a quick reference guide.

**IMPORTANT:**
- Skills are not documentation, they are practical instructions for Claude Code to use the tools, packages, plugins or APIs to achieve the tasks.
- Each skill teaches Claude how to perform a specific development task, not what a tool does.
- Claude Code can activate multiple skills automatically to achieve the user's request.

## Additional instructions
<additional-instructions>$PROMPT</additional-instructions>
