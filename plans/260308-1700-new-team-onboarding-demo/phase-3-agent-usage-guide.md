---
phase: 3
title: "Agent usage guide for Copilot"
effort: 20m
depends: [1]
---

# Phase 3: Agent Usage Guide

Create `docs/agents-for-copilot.md` in luz_next. Practical "use this when..." card.

## Content to Write

### Opening (2 lines)

After running `epost-kit init`, type `@` in Copilot Chat to see available agents.
Each agent is a specialist — pick the right one for the job.

### Agent Quick Reference

| When you want to... | Use this agent | Example prompt |
|---------------------|---------------|----------------|
| Understand the project / module structure | `@epost-researcher` | "Explain the Inbox module. I'm a Java dev, use JSF analogies." |
| Plan a new feature before coding | `@epost-planner` | "Plan a new Contact List page with filter and pagination." |
| Implement a feature | `@epost-fullstack-developer` | "Implement phase 1 of plan 260308-xxx." |
| Fix a bug or TypeScript error | `@epost-debugger` | "Fix this error: [paste error]" |
| Review code before committing | `@epost-code-reviewer` | "Review my changes to src/features/contacts/" |
| Ask how React/Next.js works | `@epost-researcher` | "How does useEffect work? Compare to @PostConstruct in JSF." |
| Write a component | `@epost-fullstack-developer` | "Create a ContactCard component using klara-theme Button and Avatar." |
| Check accessibility | `@epost-a11y-specialist` | "Check this form for keyboard accessibility." |

### Workflow for building a new feature (step by step)

```
Step 1 — Understand first
  @epost-researcher "What does the [module] module do? Show me the file structure."

Step 2 — Plan before coding
  @epost-planner "Plan a new [feature]. I need: [describe what it does]."
  → Agent creates a plan file in plans/

Step 3 — Implement
  @epost-fullstack-developer "Implement phase 1 of the plan at plans/[plan-dir]"
  → Agent writes code following project conventions

Step 4 — Fix errors
  @epost-debugger "[paste error message and file]"
  → Agent diagnoses and suggests fix

Step 5 — Review
  @epost-code-reviewer "Review my changes. Staged files: [list]"
```

### Tips for Java devs

- **Don't code first, plan first.** In JSF you had XML configs to think through. Here, run `@epost-planner` first — it maps out what files to create before you touch anything.
- **Stuck on a React concept?** Ask `@epost-researcher "explain [concept] like I know JSF"` — it will give you Java analogies.
- **Type error you don't understand?** Paste the full error to `@epost-debugger` — TypeScript errors are verbose but the agent will translate them.
- **klara-theme component exists for almost everything.** Before writing any HTML, ask `@epost-researcher "does klara-theme have a [component] component?"`.

### What agents CAN'T do in Copilot (vs Claude Code)

- Auto-load project skills/conventions (skills field dropped in Copilot adapter) — just tell the agent your context
- Run hooks automatically
- Use memory across sessions — re-introduce yourself if starting a new chat
