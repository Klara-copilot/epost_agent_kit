---
phase: 2
title: "Create product feature page"
effort: 1.5h
depends: [1]
---

# Phase 2: Create Product Feature Page

## Overview

Create a friendly, engaging feature page for epost_agent_kit. Target: `plans/README.md` (replaces current board) with a hero section at top, followed by the live plan board.

## Content Design

### Tone
- Friendly, developer-focused, engaging
- Show value first, details second
- Use concrete examples, not abstract descriptions

### Structure for `plans/README.md`

```markdown
# epost_agent_kit — Features & Roadmap

## What is epost_agent_kit?

Multi-agent development toolkit for Claude Code. Your codebase gets a team
of AI specialists — each one skilled in a specific area — that collaborate,
review each other's work, and follow your project's conventions.

## Key Features

### Multi-Agent Team (12 Specialists)
- **Planner** — breaks complex work into phased plans
- **Fullstack Developer** — implements across web, iOS, Android, backend
- **Code Reviewer** — audits code quality, security, performance
- **Debugger** — traces errors, diagnoses root causes
- **Tester** — writes and runs tests, measures coverage
- **Researcher** — investigates libraries, best practices, prior art
- **Muji** — design system guardian (klara-theme, Figma pipeline)
- **A11y Specialist** — WCAG 2.1 AA across all platforms
- **Docs Manager** — maintains project documentation
- **Project Manager** — orchestrates multi-agent workflows
- **MCP Manager** — manages Model Context Protocol servers
- **Kit Designer** — creates new agents, skills, commands

### Smart Routing
Natural language → right agent. No slash commands needed.
"fix the login bug" → Debugger. "plan the new feature" → Planner.
Context-aware: detects platform from file types, boosts intent from git state.

### Skill System (45+ Skills)
On-demand knowledge loading. Agents discover and load skills
relevant to your task — no token waste on unused context.
Platform skills, domain skills, workflow skills, tool skills.

### Cross-Platform
One toolkit, four platforms:
- **Web**: Next.js 14, React 18, TypeScript, Tailwind, shadcn/ui
- **iOS**: Swift 6, SwiftUI + UIKit, iOS 18+
- **Android**: Kotlin, Jetpack Compose, MVVM, Hilt
- **Backend**: Java 8, Jakarta EE 8, WildFly, Hibernate

### Hybrid Audits
Two-stage code review: UI component audit (Muji) + code quality review.
Structured findings with rule IDs, severity, pass/fail criteria.

### Orchestrated Workflows
Pre-built team workflows for common scenarios:
- Feature Development (plan → implement → test → review → docs → git)
- Bug Fixing (scout → debug → fix → test → review → capture → git)
- Code Review (scout-first, then quality audit)
- Architecture Review (brainstorm → research → decide → document)

### Knowledge System
Three-tier retrieval: project docs → RAG → codebase → external.
Knowledge capture after every significant finding.
Staleness detection and cross-source bridging.

### Build & Quality Gates
Automated build verification before git commits.
Pre-audit build checks. Audit session folders for organized output.

### Extensible via epost-kit CLI
Install profiles, add packages, create custom agents/skills/commands.
Supports Claude Code, GitHub Copilot, and Cursor targets.

## Milestones Achieved

| Date | Milestone |
|------|-----------|
| Feb 2026 | Initial agent ecosystem + CLI tooling |
| Feb 10 | Skill directory flattening for agentskills.io |
| Feb 28 | Lazy skill discovery (40-60% token savings) |
| Mar 3 | /get-started onboarding, Copilot support, skill taxonomy cleanup |
| Mar 4 | Scout RAG integration, planning skill merge |
| Mar 5 | Skill consolidation 99→45, agent redesign, team workflows |
| Mar 7 | Research engine (Gemini), audit methodology transparency |
| Mar 8 | Hybrid audit orchestration, build-success gates |
| Mar 9 | Natural CLAUDE.md routing, simulator launch support |

## Roadmap (Active Plans)

[Live plan board below — updated by scripts]
```

### File to Modify
- `plans/README.md` — rewrite with feature page at top, plan board at bottom

## Validation

- Feature page is readable, friendly, informative
- All milestones sourced from completed plan dates
- Active plan board section still functional
- No broken links
