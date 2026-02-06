# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Table of Contents

- [Project Overview](#project-overview)
- [Repository](#repository)
- [Claude Code Agent System](#claude-code-agent-system)
- [Naming Conventions](#naming-conventions)
- [UI Library Pattern](#ui-library-pattern)
- [Guidelines](#guidelines)
- [Related Documents](#related-documents)

## Project Overview

**epost_agent_kit** — A comprehensive multi-platform agent kit framework providing specialized Claude Code agents for web, iOS, and Android development. Distributes across Claude Code, Cursor, and GitHub Copilot with klara-theme integration for Figma-to-code workflows.

**Current Capabilities**:
- **19 Agents**: 9 global agents (orchestrator, architect, implementer, reviewer, researcher, debugger, tester, documenter, git-manager) + 10 specialized agents (scout, brainstormer, database-admin, web-developer, ios-developer, android-developer, ui-ux-designer, copywriter, journal-writer, mcp-manager)
- **17+ Skills**: Core skills including code-review, sequential-thinking, docs-seeker, problem-solving, repomix, and platform-specific skills (android-development, ios-development, backend-development, frontend-development, nextjs, figma-integration)
- **Multi-Platform Support**: Distributes across Claude Code, Cursor, and GitHub Copilot
- **Parent-Child Delegation**: Global agents orchestrate; platform agents execute

**Key Features**:
- Task routing and project management via orchestrator
- Architecture design and planning coordination
- Splash pattern planning with `/plan:fast`, `/plan:hard`, `/plan:parallel` variants
- Active plan state management with session persistence
- Multi-platform implementation delegation (web, iOS, Android)
- Comprehensive code review and security analysis
- Root cause debugging with codebase search
- Test orchestration and execution
- Documentation management and generation
- klara-theme Figma-to-code workflow integration

## Repository

- **Remote**: git@github.com:Klara-copilot/epost_agent_kit.git
- **Primary branch**: master
- **Documentation**: See `/docs` directory for architecture, roadmap, and standards

## Claude Code Agent System

The repository uses Claude Code's agent system configured in `.claude/`.

### Configuration
- **Agents**: `.claude/agents/` — 19 specialized agents across global and platform-specific roles
  - **Global**: orchestrator, architect, implementer, reviewer, debugger, tester, researcher, documenter, git-manager
  - **Platform**: web-developer, ios-developer, android-developer
  - **Specialized**: scout, brainstormer, database-admin, ui-ux-designer, copywriter, journal-writer, mcp-manager
- **Commands**: `.claude/commands/` — Slash commands (`/plan`, `/cook`, `/test`, `/debug`, `/git:commit`, `/docs:component`, etc.)
- **Skills**: `.claude/skills/` — Passive knowledge (core-rules, web, iOS, Android, planning, debugging, research, databases, docker, figma-integration)
- **Workflows**: `.claude/workflows/` — Multi-step orchestration (feature development, bug fixing, klara-theme UI pipeline)

### Web Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS + SCSS
- **UI Components**: shadcn/ui or klara-theme
- **Testing**: Jest + React Testing Library, Playwright
- **State**: Redux Toolkit + Redux Persist

### klara-theme Integration
- **Workflows**: `.claude/workflows/web/klara-theme/` — Figma-to-code pipeline (plan-feature, implement-component, audit-ui, fix-findings, extract-figma, document-component)
- **Figma Skill**: `.claude/skills/web/figma-integration/` — Figma MCP tool patterns, design token mapping
- **Command**: `/docs:component <key>` — Document klara-theme components from Figma

## Naming Conventions

| Element | Pattern | Example |
|---------|---------|---------|
| **Agents** | `epost-<role>.md` | `epost-architect`, `epost-tester` |
| **Platform agents** | `epost-<platform>-developer.md` | `epost-web-developer` |
| **Commands** | `<category>/<action>.md` | `web/cook.md`, `fix/fast.md` |
| **Skills** | `<category>/<domain>/SKILL.md` | `web/nextjs/SKILL.md` |
| **Workflows** | `<scope>.md` or `<platform>/<lib>/<name>.md` | `web/klara-theme/plan-feature.md` |

- Global agents delegate to platform agents by actual name (e.g., `epost-web-developer`)
- Skills use YAML frontmatter (`name`, `description`). Sub-skills: `SKILL.md` (index) + aspect files.

## UI Library Pattern

Each platform's UI library follows:
1. `CLAUDE.md` in the library root — component patterns, tokens, conventions
2. Workflows in `.claude/workflows/<platform>/<lib>/` — development pipeline
3. Per-feature outputs in `libs/<lib>/.ai-agents/ui/<feature>/`

Currently included: klara-theme (web). Future: iOS/Android UI libs in their respective repos.

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
See `.claude/skills/core-rules/SKILL.md` for operational boundaries:
- Decision boundaries (autonomous vs approval actions)
- Environment safety (pre-execution checks)
- Context7 usage (secondary reasoning aid rules)
- Documentation standards (formatting, TOC, size limits)

## Related Documents

- `.claude/skills/core-rules/SKILL.md` — Operational rules and boundaries
- `.claude/skills/web/figma-integration/SKILL.md` — Figma MCP integration
- `.claude/workflows/web/klara-theme/` — klara-theme workflows
- `/docs/system-architecture.md` — System architecture and delegation model
- `/docs/project-roadmap.md` — Development phases and milestones
- `/docs/code-standards.md` — Coding conventions
