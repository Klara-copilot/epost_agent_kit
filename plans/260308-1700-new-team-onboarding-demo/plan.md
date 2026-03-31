---
id: 260308-1700-new-team-onboarding-demo
title: "New team onboarding demo — Java devs → React/Next.js with kit"
status: archived
effort: 2h
phases: 4
audience: 6 Java/JSF devs, VSCode + Copilot only, no Claude Code
demo: live screen share, tomorrow
---

# New Team Onboarding Demo

## Context

6 Java/JSF/PrimeFaces devs joining luz_next web project.
Stack they're learning: React 18 + Next.js 14 App Router + klara-theme.
Tools: VSCode + GitHub Copilot only. No Claude Code, no Anthropic API.

## Key Insight

The kit CAN be installed for Copilot via `epost-kit init --target vscode`.
Outputs `.github/agents/*.agent.md` + `copilot-instructions.md`.
In VSCode Copilot Chat: type `@` → see kit agents → invoke them directly.

This means they get: `@epost-fullstack-developer`, `@epost-planner`,
`@epost-debugger`, `@epost-researcher` right in their Copilot.

## Deliverables

| # | Phase | Output | Purpose |
|---|-------|--------|---------|
| 1 | Verify install flow | Tested kit in luz_next (Copilot target) | Demo doesn't break live |
| 2 | Java→React cheat sheet | `docs/java-to-react.md` in luz_next | Daily reference card |
| 3 | Agent usage guide | `docs/agents-for-copilot.md` in luz_next | How to use @ agents |
| 4 | Demo script | `plans/260308-1700.../demo-script.md` | 40-min walkthrough |

## Phases

| # | Phase | Effort | File |
|---|-------|--------|------|
| 1 | Verify + pre-install | 20m | [phase-1](./phase-1-verify-install.md) |
| 2 | Java→React cheat sheet | 30m | [phase-2](./phase-2-java-react-cheatsheet.md) |
| 3 | Agent usage guide | 20m | [phase-3](./phase-3-agent-usage-guide.md) |
| 4 | Demo script | 30m | [phase-4](./phase-4-demo-script.md) |

## Demo Flow (40 min)

```
0:00  Hook        — "What if Copilot knew your entire codebase conventions?"
0:05  Install     — epost-kit install one-liner → epost-kit init → .github/ appears
0:12  Discovery   — @ in Copilot, show available agents
0:15  Explore     — @epost-researcher "I'm a Java dev, explain this project"
0:22  Plan        — @epost-planner "plan a new [module] feature"
0:30  Build       — @epost-fullstack-developer "implement step 1 of the plan"
0:35  Debug       — @epost-debugger "this TypeScript error: ..."
0:38  Q&A + wrap  — "Here's your cheat sheet, here's how to use it daily"
```

## Key Message for Team

"You already know components (PrimeFaces). React is just components.
You already know server-side rendering (JSF). Next.js App Router is just that.
What changes is: how state lives (client-side), how routing works (folder = route),
and which component library you use (klara-theme instead of PrimeFaces).
The agents know all of this — ask them when stuck."
