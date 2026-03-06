# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.


## Project: epost_agent_kit


## Installed Profile: `full`

**Packages**: core, a11y, platform-web, platform-ios, platform-android, platform-backend, kit, design-system, domains

**Installed by**: epost-kit v2.0.0 on 2026-03-06

---

## Claude Code Agent System

### Configuration
- **Agents**: `.claude/agents/` — 15 agents
- **Commands**: `.claude/commands/` — Slash commands
- **Skills**: `.claude/skills/` — Passive knowledge



---


## Smart Routing

On every user prompt involving a dev task, sense context before acting:
1. Check git state (branch, staged/unstaged files)
2. Detect platform from changed file extensions (`.tsx`→web, `.swift`→ios, `.kt`→android, `.java`→backend)
3. Check for active plans in `./plans/`
4. Route to best-fit skill based on intent + context

**This applies to every prompt — not just `/epost` invocations.**

### Prompt Classification
- **Dev task** (action verbs: cook, fix, plan, test, debug, etc.) → route via intent map below
- **Kit question** ("which agent", "list skills", "our conventions") → route to `epost-project-manager`
- **External tech question** ("how does React...", "what is gRPC") → route to `epost-researcher`
- **Conversational** (greetings, opinions, clarifications) → respond directly, no routing

### Intent → Skill Map

| Intent | Signal Words | Routes To |
|--------|-------------|-----------|
| Build | cook, implement, build, create, add, make, continue | Spawn `epost-fullstack-developer` via Task tool |
| Fix | fix, broken, error, crash, failing, what's wrong | Spawn `epost-debugger` via Task tool |
| Plan | plan, design, architect, spec, roadmap | Spawn `epost-planner` via Task tool (`/plan` skill) |
| Research | research, investigate, compare, best practices | Spawn `epost-researcher` via Task tool |
| Test | test, coverage, validate, verify | Spawn `epost-tester` via Task tool |
| Debug | debug, trace, inspect, diagnose | Spawn `epost-debugger` via Task tool |
| Review | review, check code, audit | Spawn `epost-code-reviewer` via Task tool |
| Git | commit, push, pr, merge, done, ship | `/git --commit`, `/git --push`, `/git --pr` |
| Docs | docs, document, write docs | `/docs` |
| Scaffold | bootstrap, init, scaffold, new project, new module | `/bootstrap` |
| Convert | convert, prototype, migrate | `/convert` |
| A11y | a11y, accessibility, wcag | `/fix --a11y` or `/review --a11y` |
| Onboard | get started, begin, onboard, new to project, what is this | `/get-started` |
| Journal | journal, postmortem, what went wrong, failure log | `epost-journal-writer` (direct) |
| Simplify | simplify, refactor, clean up, reduce complexity | Spawn `epost-fullstack-developer` via Task tool |
| MCP | mcp, tools, discover tools, rag query | `epost-mcp-manager` (direct) |
| Design | design, ui, ux, wireframe, screenshot to code, visual asset | `epost-muji` (direct) |

> **Delegation rule**: When routing to a skill with `context: fork`, use the **Task tool** to spawn the skill's `agent:` value. Never execute fork-context skills inline.

### Context Boost Rules
- TypeScript/build errors detected → always route to `/fix` first
- Staged files present → boost Git or Review intent
- Active plan file exists → boost Build intent ("continue" → `/cook`)
- Merge conflicts → suggest fix/resolve
- Feature branch with no changes → boost Plan or Build

### Multi-Step Workflow Detection
- Multi-intent ("plan and build X") → `epost-project-manager` → `workflow-feature-development`
- Research then plan ("research X, then plan") → `epost-project-manager` → spawns epost-researcher (report) → epost-planner reads report → creates plan
- Bug report with context → `epost-debugger` → `workflow-bug-fixing`
- New project/module → `workflow-project-init`
- Architecture question ("should we migrate...") → `epost-brainstormer` → `workflow-architecture-review`
- Parallel work (3+ independent tasks) → `subagent-driven-development` skill

### Rules
- If user types a slash command explicitly → execute it directly, skip routing
- If ambiguous → use context boost to break tie; if still ambiguous → ask user (max 1 question)
- If multi-intent ("plan and build X") → delegate to `epost-project-manager`
- All agent delegations follow `core/references/orchestration.md` protocol

---


## Accessibility (WCAG 2.1 AA)

### Agent
- `epost-a11y-specialist` — Multi-platform accessibility orchestrator (iOS, Android, Web)

### Skills
- `a11y` — Cross-platform WCAG 2.1 AA foundation (POUR, scoring)
- `ios-a11y` — iOS (VoiceOver, UIKit-primary, SwiftUI) *(extends ios/\*)*
- `android-a11y` — Android (Compose, Views/XML, TalkBack) *(extends android/\*)*
- `web-a11y` — Web (ARIA, keyboard, screen readers) *(extends web/\*)*

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
- `web-modules` — B2B module integration

---


## iOS Platform

### Tech Stack
- **Language**: Swift 6
- **UI**: SwiftUI + UIKit
- **Minimum Target**: iOS 18+
- **Testing**: XCTest, XCUITest
- **Build**: Xcode, XcodeBuildMCP

### Skills
- `ios-development` — Swift 6, SwiftUI/UIKit patterns, Xcode builds
- `ios-ui-lib` — iOS theme SwiftUI components and design tokens
- `ios-rag` — iOS codebase vector search

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
- `android-development` — Kotlin, Jetpack Compose, Hilt DI patterns
- `android-ui-lib` — Android theme Compose components and design tokens

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


## Kit Authoring Tools

### Skills
- `kit-agents` — Agent ecosystem reference and naming conventions
- `kit-agent-development` — Agent frontmatter, system prompts, triggering patterns
- `kit-skill-development` — Skill authoring, progressive disclosure, validation
- `kit-hooks` — Hook event types, I/O contract, creation workflow
- `kit-cli` — epost-kit CLI development (Commander.js, TypeScript)

---


## Design System

### Agent
- `epost-muji` — MUJI UI library agent for design system development, component knowledge, Figma-to-code pipeline

### Skills
- `figma` — Figma MCP tool patterns and design token extraction (all platforms)
- `design-tokens` — Vien 2.0 design system variable architecture (1,059 variables, 42 collections)
- `ui-lib-dev` — UI library development pipeline (plan, implement, audit, fix, document)
- `ui-guidance` — Integration consulting and design-code conflict resolution

---


## Business Domains

### B2B Domain
B2B modules: Monitoring, Communities, Inbox, Smart Send, Composer, Archive, Contacts, Organization, Smart Letter.

### B2C Domain
Consumer mobile application patterns for iOS and Android.

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

