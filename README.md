# epost_agent_kit

A multi-agent development toolkit for Claude Code — 11 specialized agents, 80 skills, one install command.

## What It Does

- **Routes automatically** — every prompt is classified by intent and dispatched to the right agent
- **Loads skills on demand** — platform skills (web, iOS, Android, backend) load when needed, not all at startup
- **Covers the full dev cycle** — plan → build → test → review → ship, each step delegated to a specialist
- **Composable by profile** — install only the packages your stack needs

## Quick Start

> **Install the CLI first** — see [epost-agent-kit-cli](https://github.com/Klara-copilot/epost-agent-kit-cli) for installation instructions and the latest CLI docs.

```bash
# Web + backend stack
epost-kit init --profile web-fullstack

# All platforms
epost-kit init --profile full
```

After init, `.claude/` is ready. Your first command:

```
/get-started
```

## Agents

| Agent | Role | Triggers |
|-------|------|---------|
| `epost-fullstack-developer` | Builds features across web/iOS/Android/backend | "add", "implement", "make X work" |
| `epost-planner` | Phased plans with dependency tracking | "plan", "how should we build" |
| `epost-debugger` | Root cause analysis — not just surface fixes | "broken", "crashes", "why does X" |
| `epost-code-reviewer` | STRIDE threats + OWASP + code quality | "review", "check before merge" |
| `epost-tester` | Test suites, coverage, edge case decomposition | "add tests", "is this covered" |
| `epost-researcher` | Multi-source tech research | "how does X work", "compare A vs B" |
| `epost-docs-manager` | KB structure, lifecycle, orphan detection | "document this", "update the docs" |
| `epost-git-manager` | Commit + push + PR with security scan | "commit", "ship it", "done" |
| `epost-muji` | Figma-to-code, design system, UI/UX | "component", "design token", "Figma" |
| `epost-a11y-specialist` | WCAG 2.1 AA across iOS/Android/Web | "a11y", "accessibility", "screen reader" |

## Key Workflows

### Build a feature
```
/cook
```
Auto-detects platform from file extensions, checks for an active plan, routes to the right agent. Supports `--fast` for quick tasks, `--parallel` for multi-module work.

### Fix a bug
```
/fix
```
Root cause first — reads error context, traces origin, applies minimal targeted fix. Never patches symptoms.

### Create an implementation plan
```
/plan
```
Outputs phased plan with dependency graph. Supports `--fast`, `--deep` (ADRs + trade-offs), `--parallel` (independent phases mapped for concurrent execution).

### Ship it
```
/git --ship
```
Full pipeline: test → security scan → commit → push → PR. Single command, no steps skipped.

### End-of-day summary
```
/git --watzup
```
Session summary of all changes since last push — what moved, what's still open.

### Sprint retrospective
```
/git --retro
```
Git-metrics retrospective: commit cadence, churn, author contributions since last tag.

### Edge case coverage
```
/test --scenario
```
12-dimension decomposition: boundary values, concurrency, auth states, network failure, i18n, and more.

### Explain complex code
```
/preview
```
Diagrams + ASCII art + prose explanation. Add `--html` for a self-contained interactive HTML page.

### Deploy
```
/deploy
```
Auto-detects target (Vercel, Netlify, Cloudflare, Railway, Fly.io, Docker) → shows plan → confirms → deploys.

### Security scan
```
/security
```
STRIDE threat model + OWASP Top 10 scan on the current diff or named feature.

## Skills by Package

| Package | Skills |
|---------|--------|
| `core` | cook, fix, plan, debug, test, review, docs, git, security, error-recovery, clean-code, tdd, journal, get-started, skill-discovery, subagent-driven-development |
| `platform-web` | web-frontend, web-nextjs, web-api-routes, web-i18n, web-auth, web-testing, web-modules, web-a11y, web-ui-lib |
| `platform-ios` | ios-development, ios-testing, ios-ui-lib, ios-a11y, simulator |
| `platform-android` | android-development, android-testing, android-ui-lib, android-a11y |
| `platform-backend` | backend-javaee, backend-databases |
| `a11y` | a11y (cross-platform WCAG foundation) |
| `design-system` | figma, design-tokens, ui-lib-dev, launchpad |
| `domains` | domain-b2b, domain-b2c |
| `kit` | kit (agent/skill/hook authoring), skill-creator, audit |

## Packages

| Package | What It Adds |
|---------|-------------|
| `core` | 9 agents + 25 cross-cutting skills |
| `kit` | Skill authoring tools, evals, agent/hook development guides |
| `platform-web` | Next.js 14 / React 18 / Redux skills + web a11y |
| `platform-ios` | Swift 6, SwiftUI/UIKit, Xcode skills |
| `platform-android` | Kotlin, Jetpack Compose, Hilt skills |
| `platform-backend` | Jakarta EE 8, WildFly, Hibernate skills |
| `a11y` | `epost-a11y-specialist` agent + platform a11y skills |
| `design-system` | `epost-muji` agent, Figma pipeline, design tokens |
| `domains` | B2B and B2C domain knowledge |

## How It Works

```
packages/          ← source of truth (edit here)
    └── core/
    └── platform-web/
    └── ...
         ↓ epost-kit init
.claude/           ← generated output (never edit directly)
    └── agents/
    └── skills/
    └── hooks/
```

**Routing**: Every prompt is classified by intent → dispatched to a specialist agent via the Agent tool → result merged back into main context.

**Skill loading**: Agents load platform skills on demand via `skill-discovery`. Only what's needed, when it's needed.

**Orchestration**: Main conversation = orchestrator only. Agents do not spawn further agents. Parallel work is dispatched as independent branches from main context and merged.

## Key Rules

- **Never edit `.claude/` directly** — regenerated on every `epost-kit init`, changes are lost
- All edits belong in `packages/`
- Subagents cannot spawn further subagents — multi-agent workflows are orchestrated from the main conversation
- `packages/` is committed; `.claude/` is generated locally

## License

Proprietary — Klara-copilot
