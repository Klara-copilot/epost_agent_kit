# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.


## Project: epost_agent_kit


## Installed Profile: `full`

**Packages**: core, a11y, platform-web, platform-ios, platform-android, platform-backend, kit, design-system, domains

**Installed by**: epost-kit v0.1.0 on 2026-02-26

---

## Claude Code Agent System

### Configuration
- **Agents**: `.claude/agents/` — 20 agents
- **Commands**: `.claude/commands/` — Slash commands
- **Skills**: `.claude/skills/` — Passive knowledge



---


## Accessibility (WCAG 2.1 AA)

### Agent
- `epost-a11y-specialist` — Multi-platform accessibility orchestrator (iOS, Android, Web)

### Commands
- `/audit:a11y` — Audit staged changes for violations (auto-detects platform)
- `/audit:a11y-close <id>` — Mark a finding as resolved
- `/fix:a11y <id>` — Fix a specific finding by ID
- `/fix:a11y-batch <n>` — Batch-fix top N priority findings
- `/review:a11y` — Review accessibility compliance by focus area

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

### Commands
- `/web:cook` — Implement web features (Next.js, React, TypeScript)
- `/web:test` — Run web tests (Jest, Playwright, RTL)

### Agent
- `epost-web-developer` — Web platform specialist for Next.js development

---


## iOS Platform

### Tech Stack
- **Language**: Swift 6
- **UI**: SwiftUI + UIKit
- **Minimum Target**: iOS 18+
- **Testing**: XCTest, XCUITest
- **Build**: Xcode, XcodeBuildMCP

### Commands
- `/ios:cook` — Implement iOS features (Swift, SwiftUI)
- `/ios:test` — Run iOS unit and UI tests
- `/ios:debug` — Debug crashes, concurrency, SwiftUI state
- `/ios:simulator` — Manage iOS simulators

### Agents
- `epost-ios-developer` — iOS platform specialist

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

### Commands
- `/android:cook` — Implement Android features (Kotlin, Compose)
- `/android:test` — Run Android unit and instrumented tests

### Agent
- `epost-android-developer` — Android platform specialist

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

### Commands
- `/backend:cook` — Implement backend features (Java EE, WildFly)
- `/backend:test` — Run Maven tests (unit + integration via Arquillian)

### Agent
- `epost-backend-developer` — Java EE backend specialist

---


## Kit Authoring Tools

### Agent
- `epost-kit-designer` — Creates and maintains agents, skills, commands, and hooks for epost_agent_kit

### Commands
- `/kit:add-agent` — Create a new agent definition
- `/kit:add-skill` — Create a new skill definition
- `/kit:add-command` — Generate slash commands (simple or splash variants)
- `/kit:add-hook` — Create a new hook script
- `/kit:optimize-skill` — Optimize an existing skill

### Skills
- `kit-agents` — Agent ecosystem reference and naming conventions
- `kit-agent-development` — Agent frontmatter, system prompts, triggering patterns
- `kit-skill-development` — Skill authoring, progressive disclosure, validation
- `kit-commands` — Slash command structure, frontmatter, arguments
- `kit-hooks` — Hook event types, I/O contract, creation workflow

## CLI Development Tools

### Agent
- `epost-cli-developer` — CLI specialist for epost-agent-cli TypeScript development

### Commands
- `/cli:cook` — Implement CLI features
- `/cli:doctor` — Diagnose CLI issues
- `/cli:test` — Run CLI tests

---


## Design System

### Agent
- `epost-muji` — MUJI UI library agent for design system development, component knowledge, Figma-to-code pipeline

### Skills
- `web-figma` — Figma MCP tool patterns and design token extraction
- `web-figma-variables` — Vien 2.0 design system variable architecture (1,059 variables, 42 collections)
- `web-ui-lib` — Web UI library component catalog (React/Next.js)
- `web-ui-lib-dev` — klara-theme development pipeline (plan, implement, audit, fix, document)

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

