# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.


## Project: epost_agent_kit


## Installed Profile: ``

**Packages**: core, platform-android, platform-backend, platform-ios, platform-web, domains, design-system, kit-design

**Installed by**: epost-kit v0.1.0 on 2026-02-25

---

## Claude Code Agent System

### Configuration
- **Agents**: `.claude/agents/` — 19 agents
- **Commands**: `.claude/commands/` — Slash commands
- **Skills**: `.claude/skills/` — Passive knowledge



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
- `/ios:a11y:audit` — Audit staged Swift changes for accessibility
- `/ios:a11y:fix` — Fix a specific accessibility finding
- `/ios:a11y:fix-batch` — Fix top N accessibility findings
- `/ios:a11y:review` — Review iOS accessibility (buttons/headings/modals/all)

### Agents
- `epost-ios-developer` — iOS platform specialist
- `epost-a11y-specialist` — iOS accessibility auditing and fixing (WCAG 2.1 AA)

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


## Business Domains

### B2B Domain
B2B modules: Monitoring, Communities, Inbox, Smart Send, Composer, Archive, Contacts, Organization, Smart Letter.

### B2C Domain
Consumer mobile application patterns for iOS and Android.

---


## Design System

### Agent
- `epost-muji` — MUJI UI library agent for design system development, component knowledge, Figma-to-code pipeline

### Skills
- `web/figma` — Figma MCP tool patterns and design token extraction
- `web/figma-variables` — Vien 2.0 design system variable architecture (1,059 variables, 42 collections)
- `web/ui-lib` — Web UI library component catalog (React/Next.js)
- `web/ui-lib-dev` — klara-theme development pipeline (plan, implement, audit, fix, document)

---


## Kit Design Tools

### Agents
- `epost-scout` — Codebase exploration and file discovery

### Skills
- `agents/claude/agent-development/` — Agent creation and maintenance patterns
- `agents/claude/skill-development/` — Skill authoring and frontmatter conventions

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

