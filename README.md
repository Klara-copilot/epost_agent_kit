# epost_agent_kit

A comprehensive multi-platform agent kit framework for distributing AI agents across Claude Code, Cursor, and GitHub Copilot using parent-child delegation architecture.

## Overview

epost_agent_kit is an architecture and distribution framework that enables:

- **Multi-Platform Support**: Single source of truth for agents, rules, skills, and commands that automatically converts across Claude Code, Cursor, and GitHub Copilot
- **Parent-Child Delegation**: Global agents orchestrate and delegate platform-specific work to specialized platform agents
- **CLI Distribution**: `npx epost-kit` command-line tool for installing components into any IDE
- **Modular Architecture**: Agents, rules, skills, and commands organized by platform with cross-platform core components

## Quick Start

### Installation

```bash
# Add this kit to your Claude Code project
npx epost-kit install

# Or target a specific platform
npx epost-kit install --target cursor
npx epost-kit install --target copilot
```

### Basic Usage

Once installed, use platform-specific commands:

**Claude Code**:
```
/cook        # Run implementer with auto-platform detection
/web:cook    # Explicitly target web platform implementer
```

**Cursor**:
```
/cook        # Via .cursor/commands/cook.md
```

**GitHub Copilot**:
```
/cook        # Via .github/prompts/cook.prompt.md
```

## Architecture

### Parent-Child Delegation Model

```
User Request → Orchestrator → Global Agent → Platform Agent → Execute
                                  ↓
                            (architect, implementer,
                             reviewer, debugger, tester,
                             researcher, documenter)
                                  ↓
                            (web/, ios/, android/
                             platform-specific agents)
```

**Global Agents** (orchestrate workflows):
- `orchestrator` - Task router and project manager
- `architect` - System design and research orchestration
- `planner` - Plan creation specialist (delegated from architect)
- `implementer` - Delegates to platform implementers
- `reviewer` - Code review and performance analysis
- `researcher` - Multi-source research and validation
- `debugger` - Debugging coordination
- `tester` - Test orchestration
- `documenter` - Cross-platform documentation
- `git-manager` - Git operations

**Platform Agents** (execute within domain):
- `web/` - Next.js, React, TypeScript, Tailwind
- `ios/` - Swift 6, SwiftUI, UIKit
- `android/` - Kotlin, Jetpack Compose

## Key Files

- **[README.md](README.md)** - Quick start and overview
- **[docs/project-overview-pdr.md](docs/project-overview-pdr.md)** - Vision, requirements, and success criteria
- **[docs/system-architecture.md](docs/system-architecture.md)** - Detailed architecture and component interactions
- **[docs/codebase-summary.md](docs/codebase-summary.md)** - Current state and directory structure
- **[docs/code-standards.md](docs/code-standards.md)** - Coding conventions and best practices
- **[docs/project-roadmap.md](docs/project-roadmap.md)** - Implementation phases and timeline

## Project Status

**Current Phase**: Agent Enhancement (Phase 2)

**Progress**: Phase 2 Completed (Global Agents Enhancement + Planner Agent)

**Agents**: 20 agents (10 global + 10 specialized)

**Key Milestones**:
- Phase 0: Dependencies & Audit (✓ Completed)
- Phase 1: Enhancement Strategy (✓ Completed)
- Phase 2: Global Agents Enhancement (✓ Completed 2026-02-05)
- Phase 3-4: Platform agents & new agents (In Progress)
- Phase 5-6: iOS and Android agents (Planned)
- Phase 7-9: CLI, sync, and E2E verification (Planned)

## Core Concepts

### Global vs Platform Agents

**Global agents** detect context and delegate:
- Read task requirements
- Analyze file types and project structure
- Route to appropriate platform agent
- Never write platform-specific code directly

**Platform agents** execute within their domain:
- Implement features in their language/framework
- Use platform-specific skills and tools
- Report back to global agent
- Self-contained within their platform

### Multi-Platform Conversion

The kit automatically converts components across platforms:

| Component | Claude Code | Cursor | GitHub Copilot |
|-----------|------------|--------|-----------------|
| Agents | `.claude/agents/*.md` | `AGENTS.md` | `.github/agents/*.agent.md` |
| Rules | `CLAUDE.md` | `.cursor/rules/*.mdc` | `.github/instructions/*.instructions.md` |
| Commands | `.claude/skills/*/SKILL.md` | `.cursor/commands/*.md` | `.github/prompts/*.prompt.md` |

## Distribution Strategy

### Two-Layer Architecture

**Layer 1**: Skills only
```bash
npx skills add Klara-copilot/epost_agent_kit
```

**Layer 2**: Full ecosystem
```bash
npx epost-kit install
```

### Target Platforms

- **Claude Code** (native) - `.claude/` with YAML frontmatter agents
- **Cursor** - `AGENTS.md`, `.cursor/rules/`, `.cursor/commands/`
- **GitHub Copilot** - `.github/agents/`, `.github/instructions/`, `.github/prompts/`

## Repository Structure

```
epost_agent_kit/
├── README.md
├── CLAUDE.md
├── docs/                           # Documentation
│   ├── project-overview-pdr.md
│   ├── system-architecture.md
│   ├── codebase-summary.md
│   ├── code-standards.md
│   └── project-roadmap.md
├── .claude/
│   ├── agents/                     # Global agents
│   │   ├── orchestrator.md
│   │   ├── architect.md
│   │   ├── implementer.md
│   │   ├── reviewer.md
│   │   ├── web/                    # Web platform agents
│   │   ├── ios/                    # iOS platform agents
│   │   └── android/                # Android platform agents
│   ├── skills/                     # Skills by platform
│   ├── rules/                      # Global rules
│   └── commands/                   # Commands by category
├── .github/
│   ├── agents/                     # Copilot agents (generated)
│   ├── instructions/               # Copilot instructions
│   └── prompts/                    # Copilot prompts
├── .cursor/
│   ├── rules/                      # Cursor rules (generated)
│   └── commands/                   # Cursor commands (generated)
├── plans/                          # Implementation plans
│   └── 260205-0834-unified-architecture-implementation/
├── knowledge/                      # Design system data
└── .git/                          # Git repository
```

## Getting Started

1. **Read the Documentation**
   - Start with [docs/project-overview-pdr.md](docs/project-overview-pdr.md) for project vision
   - Review [docs/system-architecture.md](docs/system-architecture.md) for architecture details
   - Check [docs/project-roadmap.md](docs/project-roadmap.md) for implementation phases

2. **Understand the Architecture**
   - Global agents coordinate; platform agents execute
   - Tasks flow through orchestrator → global agent → platform agent
   - Each agent has specific responsibilities (architect plans, implementer codes, reviewer checks)

3. **Use the CLI**
   - Install with `npx epost-kit install`
   - List components with `npx epost-kit list`
   - Create new skills with `npx epost-kit create skill {platform} {name}`

4. **Contribute**
   - Follow [docs/code-standards.md](docs/code-standards.md)
   - Submit changes as PRs with clear descriptions
   - Ensure documentation stays current with code changes

## License

Proprietary - Klara-copilot GitHub organization

## Support

For questions or issues:
1. Check [docs/project-roadmap.md](docs/project-roadmap.md) for known limitations
2. Review implementation phases for upcoming features
3. Contact project maintainers

---

**Created by**: Phuong Doan
**Last Updated**: 2026-02-05
**Status**: Planning Phase
