# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.


## Project: epost_agent_kit


## Installed Profile: `full`

**Current Capabilities**:
- **20 Agents**: 10 global agents (orchestrator, architect, planner, implementer, reviewer, researcher, debugger, tester, documenter, git-manager) + 10 specialized agents (scout, brainstormer, database-admin, web-developer, ios-developer, android-developer, ui-ux-designer, copywriter, journal-writer, mcp-manager)
- **17+ Skills**: Core skills including code-review, sequential-thinking, docs-seeker, problem-solving, repomix, and platform-specific skills (android-development, ios-development, backend-development, frontend-development, nextjs, figma-integration)
- **Multi-Platform Support**: Distributes across Claude Code, Cursor, and GitHub Copilot
- **Parent-Child Delegation**: Global agents orchestrate; platform agents execute

**Key Features**:
- Task routing and project management via orchestrator
- Architecture design and research orchestration via architect
- Detailed plan creation via planner (delegated from architect)
- Splash pattern planning with `/plan:fast`, `/plan:hard`, `/plan:parallel` variants
- Active plan state management with session persistence
- Multi-platform implementation delegation (web, iOS, Android)
- Comprehensive code review and security analysis
- Root cause debugging with codebase search
- Test orchestration and execution
- Documentation management and generation
- klara-theme Figma-to-code workflow integration
**Packages**: core, platform-web, platform-ios, platform-android, platform-backend, ui-ux, arch-cloud, domain-b2b, domain-b2c, meta-kit-design

**Installed by**: epost-kit v0.1.0 on 2026-02-07

---

## Claude Code Agent System

### Configuration
- **Agents**: `.claude/agents/` — 20 specialized agents across global and platform-specific roles
  - **Global**: orchestrator, architect, planner, implementer, reviewer, debugger, tester, researcher, documenter, git-manager
  - **Platform**: web-developer, ios-developer, android-developer
  - **Specialized**: scout, brainstormer, database-admin, ui-ux-designer, copywriter, journal-writer, mcp-manager
- **Commands**: `.claude/commands/` — Slash commands (`/plan`, `/cook`, `/test`, `/debug`, `/git:commit`, `/docs:component`, etc.)
- **Skills**: `.claude/skills/` — Passive knowledge (core, web, iOS, Android, planning, debugging, research, databases, docker, figma-integration, klara-theme)
- **Workflows**: `.claude/workflows/` — Reference orchestration docs (feature development, bug fixing)



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

### Agent
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


## UI/UX Design System (MUJI)

### Agent
- `epost-muji` — MUJI UI library agent with two flows: library development (Figma-to-code pipeline) and consumer guidance (component knowledge, integration patterns)

### Design System Ownership
MUJI team owns UI component libraries across all platforms:

| Library | Platform | Source |
|---------|----------|--------|
| klara-theme | Web (React) | Storybook, Figma |
| ios-theme | iOS (SwiftUI) | Figma |
| android-theme | Android (Compose) | Figma |

### Consumer Guidance
- Component API reference (props, variants, code examples)
- Design system guidelines (tokens, spacing, colors, typography)
- Integration patterns (theme provider, composition, state management)
- Audit consumer UI implementations against the design system
- Contributing components back to the MUJI team

### Library Development
- `/docs:component <key>` — Document klara-theme components from Figma
- `/design:fast` — Quick UI design implementation
- Figma-to-code pipeline: plan-feature → implement-component → audit-ui → fix-findings → document-component
- Figma MCP integration for design token extraction

### Skills
- `muji/klara-theme`, `muji/ios-theme`, `muji/android-theme` — Platform component knowledge
- `muji/figma-variables` — Design token architecture (semantic → component → raw)
- `web/klara-theme` — Component development pipeline
- `web/figma-integration` — Figma MCP tool patterns

---


## Cloud Architecture

### Infrastructure
- **Cloud Provider**: Google Cloud Platform (GCP)
- **Artifacts**: GCP Artifact Registry (Maven)
- **CI/CD**: Cloud Build
- **Infrastructure as Code**: Terraform

### Agent
- `epost-database-admin` — Database specialist for queries, performance, schema design

---


## B2B Domain

### Business Modules
The web monorepo contains these B2B modules serving company users:

| Module | Description |
|--------|-------------|
| Monitoring | System monitoring and alerting |
| Communities | Community management features |
| Inbox | Unified inbox for messages |
| Smart Send | Intelligent message routing and delivery |
| Composer | Content composition tools |
| Archive | Document archival and retrieval |
| Contacts | Contact management |
| Organization | Organization structure and settings |

### Conventions
- Each module has its own feature area within the Next.js monorepo
- Shared components and utilities across modules
- Module-specific state management per feature area

---


## B2C Domain

### Consumer App
The B2C domain covers the ePost consumer mobile application, available on iOS and Android.

### Conventions
- Separate native apps per platform (iOS: Swift/SwiftUI, Android: Kotlin/Compose)
- Backend APIs serving mobile clients (Java EE on WildFly)
- Shared business logic patterns across platforms where applicable

---


## Kit Design Tools

### Agents
- `epost-scout` — Codebase exploration and file discovery
- `epost-brainstormer` — Creative ideation and problem-solving
- `epost-journal-writer` — Technical journal for development challenges
- `epost-mcp-manager` — MCP server integration management

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

