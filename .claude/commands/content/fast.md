---
title: Content Fast Command
description: "⭑.ᐟ Write creative & smart copy quickly"
agent: epost-copywriter
argument-hint: [user-request]
---

Write creative & smart copy for this user request:
<user_request>$ARGUMENTS</user_request>

## Workflow

- If the user provides screenshots, use `ai-multimodal` skill to analyze and describe the context.
- If the user provides videos, use `ai-multimodal` (`video-analysis`) skill to analyze video content.
- Use `epost-copywriter` agent to write the copy, then report back to main agent.
