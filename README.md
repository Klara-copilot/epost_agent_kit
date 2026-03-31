# epost_agent_kit

A modular multi-agent toolkit for Claude Code. Installs specialized AI agents, skills, and hooks into your project via the `epost-kit` CLI.

## What It Is

epost_agent_kit provides a layered set of packages — each contributing agents, skills, and hooks — that wire into Claude Code's agent and skill system. You pick a profile (e.g. `web-fullstack`) and the CLI assembles the right packages into your project's `.claude/` directory.

The main conversation acts as **orchestrator**: it reads context, routes to the right agent via the Agent tool, and merges results. Agents are specialized; they do not spawn further agents.

## Packages

| Package | Layer | What It Provides |
|---------|-------|-----------------|
| `core` | 0 | 9 agents (planner, developer, reviewer, debugger, tester, researcher, docs, git, brainstormer) + 25 cross-cutting skills |
| `kit` | 1 | Kit authoring tools: skill-creator, skill evals, agent/skill/hook development guides |
| `platform-web` | 1 | 10 skills: web-frontend, web-nextjs, web-i18n, web-auth, web-api-routes, web-testing, web-modules + more |
| `platform-ios` | 1 | iOS development skills (Swift 6, SwiftUI, UIKit) |
| `platform-android` | 1 | Android skills (Kotlin, Jetpack Compose, Hilt) |
| `platform-backend` | 1 | Jakarta EE 8 / WildFly skills (Java 8, JAX-RS, Hibernate) |
| `a11y` | 1 | WCAG 2.1 AA agent + iOS/Android/Web accessibility skills |
| `design-system` | 2 | `epost-muji` agent, Figma integration, design tokens, UI library pipeline |
| `domains` | 2 | B2B and B2C business domain knowledge |

## Installation

Requires the CLI (separate repo, globally linked):

```bash
npm install -g epost-agent-kit-cli
```

Then initialize a profile in your project:

```bash
# Install web-fullstack profile (core + web + backend + a11y + design-system + domains)
epost-kit init --profile web-fullstack

# Install full profile (all packages)
epost-kit init --profile full

# Reinstall / update
epost-kit init
```

The CLI writes agents, skills, hooks, and settings into `.claude/`. The `packages/` directory is the source of truth — `.claude/` is regenerated on each init.

## Agents

| Agent | Intent |
|-------|--------|
| `epost-fullstack-developer` | Build / implement features |
| `epost-debugger` | Fix bugs, diagnose errors |
| `epost-planner` | Create implementation plans |
| `epost-code-reviewer` | Code review and audits |
| `epost-tester` | Write and validate tests |
| `epost-researcher` | Technology research |
| `epost-docs-manager` | Write and manage docs |
| `epost-git-manager` | Commit, push, create PRs |
| `epost-a11y-specialist` | WCAG 2.1 AA accessibility |
| `epost-muji` | Design system / UI components |

## Skills

Skills are passive knowledge files loaded by agents or invoked by the user with `/skill-name`. Each skill has a `description` field that drives model-invocation routing.

Key user-invocable skills: `/cook`, `/fix`, `/plan`, `/debug`, `/test`, `/docs`, `/review`, `/git`, `/get-started`, `/web-i18n`, `/kit`

## Skill Evals

Trigger evals test whether a skill's description causes Claude to invoke it for the right queries:

```bash
# Run evals for all skills
node .claude/scripts/run-skill-eval-all.cjs

# Run for a specific skill
node .claude/scripts/run-skill-eval.cjs --skill-path .claude/skills/web-i18n

# Filter by pattern
node .claude/scripts/run-skill-eval-all.cjs --filter "web-*"
```

Requires: `python3`, `pyyaml`, `claude` CLI on PATH.

## Repository Structure

```
epost_agent_kit/
├── packages/              # Source of truth — edit here, not .claude/
│   ├── core/              # Universal agents + skills
│   ├── kit/               # Kit authoring tools
│   ├── platform-web/      # Web platform skills
│   ├── platform-ios/      # iOS platform skills
│   ├── platform-android/  # Android platform skills
│   ├── platform-backend/  # Backend platform skills
│   ├── a11y/              # Accessibility package
│   ├── design-system/     # Design system package
│   └── domains/           # Business domain knowledge
├── .claude/               # Generated output (gitignored locally, not in repo)
├── plans/                 # Implementation plans
├── reports/               # Eval and audit reports
├── docs/                  # Project documentation
└── bundles.yaml           # Profile definitions
```

## Key Rules

- **Never edit `.claude/` directly** — changes are lost on next `epost-kit init`
- All edits go in `packages/`
- Subagents cannot spawn further subagents — multi-agent workflows must be orchestrated from the main conversation
- `packages/` is committed; `.claude/` is local-only

## License

Proprietary — Klara-copilot
