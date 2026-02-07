---
title: Content Good Command
description: "⭑.ᐟ Write good creative & smart copy"
agent: epost-copywriter
argument-hint: [user-request]
---

Write good creative & smart copy for this user request:
<user_request>$ARGUMENTS</user_request>

## Workflow

- If the user provides screenshots, use `ai-multimodal` skill to analyze and describe the context in detail.
- If the user provides videos, use `ai-multimodal` (`video-analysis`) skill to analyze video content.
- Use multiple `epost-researcher` agents in parallel to search for relevant information, then report back to main agent.
- Use `/scout:ext` (preferred) or `/scout` (fallback) slash command to search the codebase for files needed to complete the task
- Use `epost-architect` agent to plan the copy, make sure it can satisfy the user request.
- Use `epost-copywriter` agent to write the copy based on the plan, then report back to main agent.
