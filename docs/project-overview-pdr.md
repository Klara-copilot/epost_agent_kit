# Project Overview & Product Development Requirements

**Created by**: Phuong Doan
**Last Updated**: 2026-02-25
**Version**: 0.1.0

## Vision Statement

epost_agent_kit is a comprehensive multi-platform agent distribution framework that enables a single source of truth for AI agents, skills, and commands with automatic conversion and distribution across Claude Code, Cursor, and GitHub Copilot.

## Project Scope

### In Scope
- Agent definitions with YAML frontmatter metadata
- Skills (passive knowledge bases) with reference documentation
- Commands (slash commands) for workflow automation
- Platform-specific packages (web, iOS, Android, backend)
- CLI distribution tool (`epost-agent-cli`)
- Management UI for visualization

### Out of Scope
- Runtime agent orchestration (handled by Claude Code)
- Cloud-based agent hosting
- Multi-tenant SaaS deployment

## Functional Requirements

### FR-01: Multi-Platform Distribution
- **Priority**: P0 (Critical)
- **Description**: Convert single source agents/commands to multiple IDE formats
- **Acceptance Criteria**:
  - Claude Code: `.claude/` with YAML frontmatter
  - Cursor: `AGENTS.md`, `.cursor/rules/`, `.cursor/commands/`
  - GitHub Copilot: `.github/agents/`, `.github/instructions/`, `.github/prompts/`

### FR-02: Package Management
- **Priority**: P0 (Critical)
- **Description**: Modular installation with dependency resolution
- **Acceptance Criteria**:
  - Install specific packages or profiles
  - Resolve dependencies automatically
  - Verify integrity via checksums

### FR-03: Parent-Child Delegation
- **Priority**: P1 (High)
- **Description**: Global agents orchestrate; platform agents execute
- **Acceptance Criteria**:
  - Global agents detect platform and delegate
  - Platform agents implement domain-specific code
  - Clear separation of concerns

### FR-04: Profile-Based Installation
- **Priority**: P1 (High)
- **Description**: Predefined installation sets for common use cases
- **Acceptance Criteria**:
  - `full`: All packages
  - `minimal`: Core only
  - Platform-specific: web-only, mobile-only, backend-only
  - Custom: User-defined selection

### FR-05: CLI Distribution Tool
- **Priority**: P0 (Critical)
- **Description**: `npx epost-kit` for installation and management
- **Acceptance Criteria**:
  - `install`, `update`, `uninstall` commands
  - `doctor` for health checks
  - `profile list/show` for profile management

## Non-Functional Requirements

### NFR-01: Performance
- CLI startup time < 2 seconds
- Package installation < 30 seconds for full profile
- Agent invocation latency < 1 second

### NFR-02: Reliability
- 99% success rate for installations
- Automatic backup before updates
- Rollback capability for failed operations

### NFR-03: Maintainability
- File size limit: 200 lines per code file (except configs)
- Documentation coverage: 100% for public APIs
- Test coverage: 80%+ for CLI, 90%+ for core modules

### NFR-04: Compatibility
- Node.js >= 20.0.0 (LTS recommended)
- Support macOS, Windows, Linux
- IDE integrations: Claude Code, Cursor, GitHub Copilot

## Platform Specifications

### Web Platform
| Attribute | Value |
|-----------|-------|
| Framework | Next.js 14 (App Router) |
| UI Library | React 18 |
| Language | TypeScript 5+ |
| Styling | Tailwind CSS + SCSS |
| Components | shadcn/ui or klara-theme |
| Testing | Jest + React Testing Library, Playwright |
| State | Redux Toolkit + Redux Persist |

### iOS Platform
| Attribute | Value |
|-----------|-------|
| Language | Swift 6 |
| UI | SwiftUI + UIKit |
| Min Target | iOS 18+ |
| Architecture | MVVM / TCA |
| Testing | XCTest, XCUITest |
| Build | Xcode, XcodeBuildMCP |

### Android Platform
| Attribute | Value |
|-----------|-------|
| Language | Kotlin |
| UI | Jetpack Compose |
| Architecture | MVVM + Hilt DI |
| Database | Room |
| Networking | Retrofit |
| Testing | JUnit, Espresso |
| Build | Gradle (Kotlin DSL) |

### Backend Platform
| Attribute | Value |
|-----------|-------|
| Language | Java 8 |
| Platform | Jakarta EE 8 / WildFly 26.1 |
| REST | JAX-RS via RESTEasy |
| ORM | Hibernate 5.6 |
| Databases | PostgreSQL + MongoDB |
| Build | Maven |
| Testing | JUnit 4, Mockito, Arquillian |

## Agent Ecosystem

### Core Agents (12)
| Agent | Model | Role |
|-------|-------|------|
| epost-a11y-specialist | sonnet | Multi-platform accessibility (WCAG 2.1 AA) |
| epost-architect | opus | Architecture & planning |
| epost-brainstormer | sonnet | Creative ideation & problem-solving |
| epost-debugger | sonnet | Root cause analysis & debugging |
| epost-documenter | haiku | Technical documentation |
| epost-git-manager | haiku | Git workflow automation |
| epost-guide | sonnet | Natural language concierge |
| epost-implementer | sonnet | Plan execution |
| epost-orchestrator | haiku | Top-level task router |
| epost-researcher | sonnet | Technology research |
| epost-reviewer | sonnet | Comprehensive code reviewer |
| epost-tester | haiku | QA & testing |

### Platform Agents
- `epost-web-developer` - Next.js/React/TypeScript specialist
- `epost-ios-developer` - Swift/SwiftUI/UIKit specialist
- `epost-android-developer` - Kotlin/Compose specialist
- `epost-backend-developer` - Java EE/WildFly specialist

## Command Categories

### Bootstrap (2 commands)
- `/bootstrap:fast` - Quick initialization
- `/bootstrap:parallel` - Parallel setup

### Cook (2 commands)
- `/cook:fast` - Quick implementation
- `/cook:parallel` - Parallel feature development

### Docs (3 commands)
- `/docs:component` - Document UI components
- `/docs:init` - Initialize documentation
- `/docs:update` - Update documentation

### Fix (7 commands)
- `/fix:fast`, `/fix:deep`, `/fix:ci`, `/fix:test`, `/fix:types`, `/fix:ui`, `/fix:logs`

### Git (3 commands)
- `/git:commit`, `/git:push`, `/git:pr`

### Plan (4 commands)
- `/plan:fast`, `/plan:deep`, `/plan:parallel`, `/plan:validate`

### Review (2 commands)
- `/review:code`, `/review:a11y`

### iOS Accessibility (4 commands)
- `/ios:a11y:audit` - Audit staged changes for accessibility
- `/ios:a11y:fix` - Fix a specific accessibility finding
- `/ios:a11y:fix-batch` - Fix top N accessibility findings
- `/ios:a11y:review` - Review iOS accessibility (buttons/headings/modals/all)

### CLI Development (3 commands)
- `/cli:cook` - Implement CLI features
- `/cli:doctor` - Health check
- `/cli:test` - Run CLI tests

### Meta (3 commands)
- `/meta:add-agent` - Add new agent
- `/meta:add-skill` - Add new skill
- `/meta:generate-command` - Generate command (splash/simple patterns)

### Generate Command (2 commands)
- `/generate-command:splash` - Create splash pattern (router + variants)
- `/generate-command:simple` - Create standalone command

## Package Structure

| Package | Category | LOC | Description |
|---------|----------|-----|-------------|
| core | core | 12,356 | Base agents, skills, commands |
| platform-ios | platform | 7,018 | iOS-specific components |
| platform-android | platform | 2,036 | Android-specific components |
| platform-backend | platform | 530 | Backend-specific components |
| platform-web | platform | 2,786 | Web-specific components |
| design-system | domain | 73,761 | UI library & Figma integration |
| domains | domain | 734 | B2B/B2C domain knowledge |
| kit-design | meta | 3,328 | Agent/skill/command development |
| **Total** | | **~114,862** | |

## Success Metrics

### Technical Metrics
- CLI installation success rate: > 99%
- Test coverage: > 80%
- Build time: < 5 minutes
- Zero critical security vulnerabilities

### User Experience Metrics
- Time to first successful installation: < 5 minutes
- Documentation clarity score: > 4.5/5
- Feature discovery rate: > 70%

## Constraints & Assumptions

### Constraints
- Must support Node.js 18+
- Must work offline after initial install
- Cannot modify user code without explicit request

### Assumptions
- Users have git installed
- Users have platform-specific tools (Xcode, Android Studio, etc.)
- Users are familiar with their target IDE

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| IDE API changes | High | Version pinning, compatibility checks |
| Dependency conflicts | Medium | Lockfile management, isolation |
| Security vulnerabilities | High | Regular audits, automated scanning |
| Performance degradation | Medium | Caching, lazy loading |

## Related Documents

- [docs/system-architecture.md](system-architecture.md) - Architecture details
- [docs/codebase-summary.md](codebase-summary.md) - Codebase overview
- [docs/code-standards.md](code-standards.md) - Coding conventions
- [docs/project-roadmap.md](project-roadmap.md) - Implementation phases
