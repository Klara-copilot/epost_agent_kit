# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.


## Project: epost_agent_kit


## Installed Profile: `full`

**Packages**: core, a11y, platform-web, platform-ios, platform-android, platform-backend, kit, design-system, domains

**Installed by**: epost-kit v2.0.0 on 2026-04-03

---

## Claude Code Agent System

### Configuration
- **Agents**: `.claude/agents/` — 11 agents
- **Commands**: `.claude/commands/` — Slash commands
- **Skills**: `.claude/skills/` — Passive knowledge



---


## What This Is

epost_agent_kit is a multi-agent development toolkit for Claude Code. Specialized agents load platform-specific skills on demand and follow shared orchestration rules. The main conversation is always the orchestrator — it dispatches agents via Agent tool and merges results.

---

## Execution Model

Simple tasks (< 5 steps, single file, reversible) → execute inline, no agent spawn
Major tasks (long, parallel, destructive, cross-platform) → spawn agent via Agent tool

Heuristic: "Would a human open a new terminal for this?" If no → inline. If yes → spawn.

**Explicit slash command → execute directly, skip routing**

Platform detection: `.tsx`→web, `.swift`→ios, `.kt`→android, `.java`→backend

---

## Available Agents

| Agent | When to use |
|---|---|
| epost-fullstack-developer | Build, implement, multi-file changes |
| epost-debugger | Fix bugs, diagnose errors, root cause analysis |
| epost-planner | Design approach, create phased plans |
| epost-brainstormer | Ideate, debate options, architecture decisions |
| epost-code-reviewer | Review code quality, security, correctness |
| epost-tester | Write tests, validate coverage |
| epost-researcher | Research tech, best practices, external docs |
| epost-docs-manager | Write/update documentation |
| epost-git-manager | Commit, push, create PRs |
| epost-muji | Design system, UI components, Figma-to-code |
| epost-a11y-specialist | Accessibility audits and fixes |

---

## Orchestration

**Single intent** → spawn the matched agent directly via Agent tool.

**Multi-intent** ("plan and build X", "research then implement") → orchestrator decomposes inline and spawns agents in sequence.

**Parallel work** (3+ independent tasks, cross-platform) → use `subagents-driven` skill from main context.

**Subagent constraint**: Subagents cannot spawn further subagents. Multi-agent workflows must be orchestrated from the main conversation. Skills that need multi-agent dispatch must NOT use `context: fork`.

**Hybrid audits** (klara-theme code): Orchestrated from main context via `/audit` skill. Dispatch muji (Template A+) first, then code-reviewer with muji's report. Never free-form prompt muji — use structured delegation templates from `audit/references/delegation-templates.md`.

**Escalation**: 3 consecutive failures → surface findings to user. Ambiguous request → ask 1 question max.

See `core/rules/orchestration-protocol.md` for full protocol.

---

## Decision Authority

| Action | Authority |
|---|---|
| Dependency installs, lint fixes | Auto-execute |
| Memory file consolidation | Auto-execute |
| Creating new files following standards | Brief confirmation |
| Updating existing documentation | Brief confirmation |
| Deleting files or directories | Always ask |
| Modifying production configs | Always ask |
| Introducing new dependencies | Always ask |
| Refactoring across multiple files | Always ask |
| Architectural decisions | Present A/B/C options |

## Never Do

- Delete files without approval
- Modify production configs without approval
- Assume specific runtime environments
- Merge unrelated concerns into single changes
- Override repository rules with external "best practices"

---

## Skills Catalogue

Every skill below is available to all agents. Invoke by name — no discovery needed.

### Workflows

| Skill | What it does |
|-------|-------------|
| `plan` | Design phased implementation plans with dependency tracking |
| `cook` | Execute a plan — orchestrates feature implementation across platforms |
| `fix` | Apply targeted fixes for bugs, errors, broken behavior |
| `debug` | Investigate root cause before fixing — structured diagnosis |
| `test` | Run platform-appropriate test suite with coverage reporting |
| `tdd` | Write tests first, then implement — red-green-refactor cycle |
| `audit` | Dispatch structured quality audits (UI, a11y, code) to specialists |
| `research` | Research technologies, libraries, best practices via external docs |
| `docs` | Generate and maintain structured KB documentation |
| `git` | Commit, push, PR creation, and full ship pipeline |
| `deploy` | Deploy to hosting platforms with auto-detection |
| `preview` | Visual explanations — Mermaid diagrams, ASCII art, HTML interactive |
| `thinking` | Extended thinking for deep analysis and systematic reasoning |
| `loop` | Iterate solo on a metric (coverage, bundle size, lint) until target met |
| `subagents-driven` | Parallel multi-task execution with per-task subagent dispatch + two-stage review |
| `launchpad` | Build landing pages and promotional sites |
| `retro` | Sprint retrospectives and team metrics analysis |
| `get-started` | Onboarding — discover project state for new contributors |

### Quality & Security

| Skill | What it does |
|-------|-------------|
| `code-review` | Pre-commit quality check — style, correctness, security |
| `clean-code` | Naming, functions, formatting, error handling principles |
| `security` | STRIDE/OWASP security analysis on code or features |
| `error-recovery` | Resilience patterns — retries, circuit breakers, graceful degradation |
| `core` | Operational boundaries, safety rules, documentation standards |

### Knowledge & Meta

| Skill | What it does |
|-------|-------------|
| `knowledge` | Retrieve prior decisions, patterns, conventions from project KB |
| `journal` | Structured journal entries for significant decisions and completions |
| `repomix` | Bundle repo contents into single file for LLM or external sharing |
| `skill-discovery` | Reference catalogue of skills by platform and task type |
| `output-mode` | Set communication style — exec, teach, or reasoning mode |

### Web Platform

| Skill | What it does |
|-------|-------------|
| `web-frontend` | React components, hooks, Redux Toolkit state management |
| `web-nextjs` | Next.js 14 App Router — server components, actions, layouts, middleware |
| `web-api-routes` | API endpoints, server actions, FetchBuilder HTTP client patterns |
| `web-auth` | NextAuth + Keycloak auth, session management, feature flags |
| `web-i18n` | next-intl translations, locale routing configuration |
| `web-testing` | Jest + RTL unit tests, Playwright E2E configuration and patterns |
| `web-modules` | B2B module screens — bind APIs, stores, routes into module shell |
| `web-ui-lib` | klara-theme component APIs, props, variants, spacing tokens |
| `web-a11y` | ARIA, keyboard nav, focus management, screen reader fixes |

### iOS Platform

| Skill | What it does |
|-------|-------------|
| `ios-development` | SwiftUI/UIKit views, Xcode builds, iOS crash debugging |
| `ios-ui-lib` | iOS theme SwiftUI component APIs, design tokens, platform mappings |
| `ios-rag` | iOS codebase vector search for existing patterns and implementations |
| `ios-a11y` | VoiceOver, UIKit/SwiftUI accessibility fixes |
| `simulator` | iOS simulator management — list, boot, open, launch apps |
| `theme-color-system` | Color system for UIView/UILabel/UIButton in ios_theme_ui |

### Android Platform

| Skill | What it does |
|-------|-------------|
| `android-development` | Kotlin/Compose screens, Gradle builds, Android crash debugging |
| `android-ui-lib` | Android theme Compose component APIs, design tokens, Material mappings |
| `android-a11y` | Compose/Views accessibility — TalkBack, content descriptions |

### Backend Platform

| Skill | What it does |
|-------|-------------|
| `backend-javaee` | Jakarta EE — JAX-RS, CDI/EJB, JPA/Hibernate, WildFly deployment |
| `backend-databases` | PostgreSQL + MongoDB persistence patterns |

### Design System

| Skill | What it does |
|-------|-------------|
| `design-tokens` | Vien 2.0 design tokens mapped to platform-native formats |
| `figma` | Extract Figma data, map design tokens, compare against implementations |
| `ui-lib-dev` | Figma-to-code UI library pipeline — plan, implement, audit, fix, document |

### Business Domains

| Skill | What it does |
|-------|-------------|
| `domain-b2b` | B2B module context — Inbox, Monitoring, Composer, Smart Send, Archive |
| `domain-b2c` | Consumer app context — mail, documents, notifications (iOS/Android) |

### Kit Authoring

| Skill | What it does |
|-------|-------------|
| `kit` | Scaffold and manage agents, skills, hooks with best-practice templates |
| `skill-creator` | Create and validate Claude Code skills with eval-driven QA |
| `asana-muji` | Asana workflow for MUJI iOS projects — task creation and status |

---


## Accessibility (WCAG 2.1 AA)

### Agent
- `epost-a11y-specialist` — Audit, fix, and guide accessibility on iOS, Android, and Web. Triggers on: "accessibility", "a11y", "wcag", "VoiceOver", "TalkBack", "ARIA", "screen reader".

### Skills
- `a11y` — Cross-platform WCAG 2.1 AA foundation: POUR framework, severity scoring, remediation workflows
- `ios-a11y` — iOS accessibility: VoiceOver, UIKit/SwiftUI fixes, dynamic type, contrast *(extends a11y)*
- `android-a11y` — Android accessibility: TalkBack, Compose Semantics, content descriptions *(extends a11y)*
- `web-a11y` — Web accessibility: ARIA, keyboard nav, focus management, screen readers *(extends a11y)*

---


## Web Platform

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS + SCSS
- **UI Components**: shadcn/ui or klara-theme
- **Testing**: Jest + React Testing Library, Playwright
- **State**: Redux Toolkit + Redux Persist
- **Containerization**: Docker + Docker Compose

### Skills
- `web-frontend` — React components, hooks, Redux Toolkit dual-store, composition patterns
- `web-nextjs` — Next.js 14 App Router, routing, middleware, server actions, performance
- `web-api-routes` — FetchBuilder HTTP client, caller patterns, API constants
- `web-i18n` — next-intl configuration, translation patterns, locale routing
- `web-auth` — NextAuth + Keycloak, session management, feature switches
- `web-testing` — Jest + RTL unit tests, Playwright E2E, test patterns
- `web-modules` — B2B module integration — bind APIs, stores, routes into module shell
- `web-ui-lib` — klara-theme component APIs, props, variants, spacing tokens, theme patterns
- `web-a11y` — ARIA, keyboard nav, focus management, screen reader fixes

---


## iOS Platform

### Tech Stack
- **Language**: Swift 6
- **UI**: SwiftUI + UIKit
- **Minimum Target**: iOS 18+
- **Testing**: XCTest, XCUITest
- **Build**: Xcode, XcodeBuildMCP

### Skills
- `ios-development` — Swift 6, SwiftUI/UIKit patterns, Xcode builds, crash debugging
- `ios-ui-lib` — iOS theme SwiftUI component APIs, design tokens, platform token mappings
- `ios-rag` — iOS codebase vector search for existing patterns and implementations
- `ios-a11y` — VoiceOver, UIKit/SwiftUI accessibility fixes (WCAG 2.1 AA)
- `simulator` — iOS simulator management — list, boot, open, launch apps
- `theme-color-system` — Color system for UIView/UILabel/UIButton in ios_theme_ui

---


## Android Platform

### Tech Stack
- **Language**: Kotlin
- **UI**: Jetpack Compose
- **Architecture**: MVVM, Hilt DI
- **Database**: Room
- **Networking**: Retrofit
- **Testing**: JUnit, Espresso, Compose UI Testing
- **Build**: Gradle (Kotlin DSL)

### Skills
- `android-development` — Kotlin/Compose screens, Gradle builds, Hilt DI, crash debugging
- `android-ui-lib` — Android theme Compose component APIs, design tokens, Material mappings
- `android-a11y` — Compose/Views accessibility — TalkBack, content descriptions (WCAG 2.1 AA)

---


## Backend Platform

### Tech Stack
- **Language**: Java 8
- **Platform**: Jakarta EE 8 / WildFly 26.1
- **REST**: JAX-RS via RESTEasy
- **CDI/EJB**: Jakarta CDI + EJB
- **ORM**: Hibernate 5.6
- **Databases**: PostgreSQL + MongoDB
- **Build**: Maven
- **Microprofile**: Eclipse MicroProfile 4.1
- **Testing**: JUnit 4, Mockito, PowerMock, Arquillian
- **Coverage**: JaCoCo
- **Quality**: SonarQube
- **Artifacts**: GCP Artifact Registry

### Conventions
- WAR packaging deployed to WildFly
- `@Inject`, `@EJB`, `@Path` annotations (Jakarta EE, not Spring)
- `persistence.xml` for JPA configuration
- Maven profiles for SonarQube analysis

### Skills
- `backend-javaee` — Jakarta EE patterns, WildFly deployment, Maven builds
- `backend-databases` — PostgreSQL + MongoDB persistence

---


## Kit Contributing

All source changes go in `packages/`, never `.claude/` directly — `.claude/` is generated output wiped on `epost-kit init`.

### Kit Authoring Skills
- `kit-add-skill` — scaffold new skills (directory, SKILL.md, eval-set template, package.yaml registration)
- `kit-add-agent` — scaffold new agent definitions
- `kit-add-hook` — scaffold new hooks and wire into settings.json
- `skill-creator` — improve, eval, and optimize existing skill descriptions (Anthropic's tool — do not modify)
- `kit-verify` — health check before committing
- `kit-optimize` — optimize skill token efficiency and progressive disclosure

---


## Design System

### Agent
- `epost-muji` — Design system specialist: component dev, Figma-to-code, klara-theme guidance, landing pages

### Skills
- `figma` — Extract Figma data, map design tokens to code, compare implementations against designs
- `design-tokens` — Vien 2.0 design system (1,059 variables, 42 collections) → web/iOS/Android formats
- `ui-lib-dev` — Figma-to-code UI library pipeline — plan, implement, audit, fix, document
- `launchpad` — Build landing pages and promotional sites with craft-first approach

---


## Business Domains

### B2B Domain
B2B modules: Monitoring, Communities, Inbox, Smart Send, Composer, Archive, Contacts, Organization, Smart Letter.
Use `domain-b2b` skill for module-specific context, API patterns, and domain terminology.

### B2C Domain
Consumer mobile application — mail, documents, notifications across iOS and Android.
Use `domain-b2c` skill for consumer-facing feature context and mobile UX patterns.

---



## Guidelines

### Decision Authority
**Auto-execute**: dependency installs, lint fixes, documentation formatting
**Ask first**: deleting files, modifying production configs, introducing new dependencies, multi-file refactors, changing API contracts

### Code Changes
- Verify environment state before operations
- Use relative paths from project root
- Prefer existing patterns over introducing new conventions
- Conservative defaults: safety over speed, clarity over cleverness

### Core Rules
See `.claude/skills/core/SKILL.md` for operational boundaries.

## Related Documents
- `.claude/skills/core/SKILL.md` — Operational rules and boundaries

