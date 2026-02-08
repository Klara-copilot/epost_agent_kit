# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.


## Project: epost_agent_kit


## Installed Profile: `web-ui-lib`

**Packages**: core, platform-web, ui-ux, meta-kit-design, rag-web

**Installed by**: epost-kit v0.1.0 on 2026-02-08

---

## Claude Code Agent System

### Configuration
- **Agents**: `.claude/agents/` — 21 agents
- **Commands**: `.claude/commands/` — Slash commands
- **Skills**: `.claude/skills/` — Passive knowledge



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


## Kit Design Tools

### Agents
- `epost-scout` — Codebase exploration and file discovery
- `epost-mcp-manager` — MCP server integration management

### Skills
- `agents/claude/agent-development/` — Agent creation and maintenance patterns
- `agents/claude/skill-development/` — Skill authoring and frontmatter conventions

---


## Web RAG System

### Connection
- **Server**: `epost_web_theme_rag` (port 2636)
- **MCP Tools**: `query_rag`, `get_rag_status`, `sanitize_text`
- **Target**: klara-theme components, Next.js codebase (`luz_next`)

### Usage
- Query before implementing UI components
- Search design tokens, component patterns, existing implementations
- Filter by: component, topic (design-system, ui, state-management), category, file_type

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

