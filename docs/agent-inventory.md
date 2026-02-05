# Agent Inventory

Complete reference of all 15 agents in epost_agent_kit with their responsibilities, models, and delegation patterns.

## Global Agents (9)

| Agent | Model | Purpose | Delegates To |
|-------|-------|---------|-------------|
| epost-orchestrator | haiku | Task routing, workflow coordination, project state management | All agents |
| epost-architect | opus | Planning, architecture design, implementation strategy | epost-researcher |
| epost-implementer | sonnet | Code execution from plans, platform delegation | Platform agents |
| epost-reviewer | sonnet | Code quality, security review, performance analysis | epost-scout |
| epost-debugger | sonnet | Root cause analysis, systematic debugging | epost-scout, platform agents |
| epost-tester | haiku | Test execution, coverage analysis, validation | Platform agents |
| epost-researcher | haiku | Multi-source research, technical validation | (none) |
| epost-documenter | haiku | Documentation management, updates, generation | (none) |
| epost-git-manager | inherit | Git operations, commits, branch management | (none) |

## Specialized Agents (3)

| Agent | Model | Purpose | Delegates To |
|-------|-------|---------|-------------|
| epost-scout | haiku | Codebase file search, pattern matching | (none) |
| epost-brainstormer | sonnet | Solution evaluation, design alternatives | epost-architect, epost-researcher |
| epost-database-admin | sonnet | Database optimization, schema design | (none) |

## Platform Agents (3)

| Agent | Model | Platform | Tech Stack |
|-------|-------|----------|-----------|
| epost-web-developer | sonnet | Web | Next.js, React, TypeScript, Tailwind |
| epost-ios-developer | sonnet | iOS | Swift 6, SwiftUI, UIKit, XCTest |
| epost-android-developer | sonnet | Android | Kotlin, Jetpack Compose, Gradle |

## Agent Responsibilities

### Global Orchestration

**epost-orchestrator**: Routes incoming tasks to appropriate agents, manages project state, coordinates workflows. Entry point for all user requests.

**epost-architect**: Designs system architecture, creates implementation plans with TODO tasks, identifies technical constraints and dependencies.

**epost-implementer**: Executes code implementation from architecture plans, detects platform context, delegates platform-specific work to specialized agents.

### Quality & Validation

**epost-reviewer**: Analyzes code quality, identifies security issues, optimizes performance, provides improvement recommendations.

**epost-tester**: Runs test suites, measures coverage, validates requirements, analyzes failures.

**epost-debugger**: Performs root cause analysis, uses codebase search for context, coordinates with platform agents for systematic debugging.

### Information Gathering

**epost-researcher**: Conducts multi-source research on technical topics, validates approaches, provides evidence-based recommendations.

**epost-scout**: Searches codebase for patterns, references, and dependencies. Supports reviewer and debugger with file discovery.

### Specialization

**epost-brainstormer**: Evaluates alternative solutions, explores design options, validates against requirements.

**epost-database-admin**: Optimizes database schemas, analyzes query performance, recommends indexing strategies.

### Supporting Operations

**epost-documenter**: Maintains project documentation, updates architecture diagrams, generates API references, keeps changelog current.

**epost-git-manager**: Handles version control operations—creates commits, manages branches, prepares pull requests.

## Platform Agents

### Web Development
**epost-web-developer**: Implements features for Next.js applications using React, TypeScript, and Tailwind CSS. Handles frontend logic, API integration, and responsive design.

### iOS Development
**epost-ios-developer**: Implements features in Swift using SwiftUI and UIKit. Manages iOS-specific patterns, platform constraints, and testing with XCTest.

### Android Development
**epost-android-developer**: Implements features in Kotlin using Jetpack Compose. Handles Android-specific lifecycle, permissions, and testing patterns.

## Skills Coverage

Each agent includes cross-cutting capabilities:
- Token efficiency awareness
- YAGNI/KISS/DRY principles enforcement
- Report naming conventions
- Large file handling protocols
- Project standards awareness
- Skill activation instructions
- Concision for clarity

Total skills available: 17
- **Core**: code-review, sequential-thinking, docs-seeker, problem-solving, repomix, debugging, research, planning
- **Platform**: android-development, ios-development, backend-development, frontend-development, nextjs
- **Specialized**: better-auth, databases, docker, shadcn-ui

## Delegation Patterns

### Feature Development Workflow
```
User → Orchestrator → Architect (plan) → Implementer (code)
  → Tester (verify) → Reviewer (quality) → Documenter (record)
```

### Bug Fix Workflow
```
User → Orchestrator → Debugger (analyze) → Scout (search)
  → Implementer (fix) → Tester (verify) → Reviewer (validate)
```

### Architecture Design Workflow
```
User → Orchestrator → Architect (design) → Brainstormer (alternatives)
  → Researcher (validate) → Documenter (record)
```

## Model Distribution

- **Haiku (Fast, Economical)**: orchestrator, tester, researcher, documenter, scout (5 agents)
- **Sonnet (Balanced)**: implementer, reviewer, debugger, brainstormer, database-admin, web-developer, ios-developer, android-developer (8 agents)
- **Opus (Powerful)**: architect (1 agent)
- **Inherit**: git-manager (1 agent)

## Integration Points

All agents include:
1. Cross-cutting patterns (skills, token awareness, principles)
2. Report templates with consistent naming
3. Reference to project documentation
4. Delegation delegation to other agents
5. Token-efficient context management
6. Security and code standards awareness

---

**Created by**: Phuong Doan
**Last Updated**: 2026-02-05
**Version**: 1.0
