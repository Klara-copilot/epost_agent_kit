---
phase: 2
title: "Add project context and trim Copilot section"
effort: 30m
depends: [1]
---

# Phase 2: Add Project Context and Trim Copilot Section

## Changes

### File: `packages/core/CLAUDE.snippet.md`

### 1. Add project identity block (top of snippet)

Add after the header comment, before Smart Routing:

```markdown
## What This Is

epost_agent_kit is a multi-agent development toolkit for Claude Code. It provides specialized agents (planner, developer, debugger, reviewer, etc.), skills (platform conventions, workflows, knowledge retrieval), and orchestration protocols that turn Claude Code into a team of collaborators.

**How it works**: User prompts are classified by intent, then routed to the best-fit agent via subagent spawning. Agents load platform-specific skills on demand and follow shared orchestration rules.
```

This gives Claude grounding context so it can explain the project when asked and make better routing decisions.

### 2. Trim Copilot Chat section

Current: 30 lines with a full table + starter prompts + self-guide rule.

Reduce to 5 lines:
```markdown
## Copilot Chat

If running as GitHub Copilot (not Claude Code): suggest the right `@epost-{agent}` for the user's task. Agents: researcher, planner, fullstack-developer, debugger, code-reviewer, a11y-specialist, docs-manager, muji. Say: "For this I'd recommend @epost-{agent} — it has deeper context for {reason}."
```

### 3. Remove redundant "Configuration" section

The 3-line Configuration block ("Agents: .claude/agents/ -- 12 agents") adds no routing value. The agent list is already in the intent table. Remove it.

## Validation

- CLAUDE.md starts with clear project description
- Copilot section is <=5 lines
- No information loss (Copilot users can still find the right agent)
