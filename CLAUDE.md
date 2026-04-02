# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.


## Project: epost_agent_kit


## Installed Profile: `full`

**Packages**: core, a11y, platform-web, platform-ios, platform-android, platform-backend, kit, design-system, domains

**Installed by**: epost-kit v2.0.0 on 2026-04-02

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

**Parallel work** (3+ independent tasks, cross-platform) → use `subagent-driven-development` skill from main context.

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


## Accessibility (WCAG 2.1 AA)

### Agent
- `epost-a11y-specialist` — Multi-platform accessibility orchestrator (iOS, Android, Web)

### Skills
- `a11y` — Cross-platform WCAG 2.1 AA foundation (POUR, scoring)
- `ios-a11y` — iOS (VoiceOver, UIKit-primary, SwiftUI) *(extends a11y)*
- `android-a11y` — Android (Compose, Views/XML, TalkBack) *(extends a11y)*
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
- `ui-lib-dev` — UI library development pipeline (plan, implement, audit, fix, document); integration guidance via `references/guidance.md`

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

