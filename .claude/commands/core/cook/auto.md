---
description: ⚡⚡ Trust-based fast track implementation
argument-hint: [tasks]
---

**Ultrathink** to plan & start working on these tasks follow the Orchestration Protocol, Core Responsibilities, and Development Rules:
<tasks>$ARGUMENTS</tasks>

**IMPORTANT:** Analyze the skills catalog at `.claude/skills/*` and activate skills needed for the task during the process.
**Ensure token efficiency while maintaining high quality.**

## Workflow

1. Trigger slash command `/plan <detailed-instruction-prompt>` to create an implementation plan based on the given tasks.
2. Trigger slash command `/code <plan>` to implement the plan.
3. Finally use `AskUserQuestion` tool to ask user if they want to commit to git repository, if yes trigger `/git:cm` slash command to create a commit.
