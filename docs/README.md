# epost_agent_kit

A next-generation agent kit framework designed to eliminate platform fragmentation in AI development tooling. It provides a unified architecture that allows teams to define agents, rules, skills, and commands once and automatically deploy them across **Claude Code**, **Cursor**, and **GitHub Copilot** with zero platform-specific rewrites.

[![epost_agent_kit](https://img.shields.io/badge/epost--agent_kit-v0.1.0--planning-purple)](https://github.com/Klara-copilot/epost_agent_kit)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## Vision

Empower developers with AI assistance that follows them across their entire development environment, regardless of which IDE or tool they use.

## Mission

Build the foundational infrastructure that makes multi-platform agent distribution seamless, maintainable, and scalable.

## Current Capabilities

**15 Agents**, **17 Skills**, **30 Commands**, **6 Hooks** providing:
- Parent-child delegation architecture for orchestration across platforms
- Multi-platform workflow automation (web, iOS, Android)
- Comprehensive task routing and project management
- Advanced debugging, code review, and security analysis
- Code generation and testing automation
- Git workflow automation with pre-commit security checks
- Knowledge management through skills and agent specialization

## Key Features

### 1. Multi-Platform Agent Architecture

**Supported Platforms:**
- **Claude Code**: Native agent support with YAML frontmatter
- **Cursor**: AGENTS.md format with .mdc rules
- **GitHub Copilot**: Agent YAML with instructions and prompts

**Benefits:**
- Single source of truth for all agent definitions
- Consistent behavior across IDEs
- Zero manual rewrites required
- Platform-specific optimizations where needed

### 2. Parent-Child Delegation Architecture

Global agents orchestrate work by detecting context and delegating to specialized platform agents. This separation of concerns ensures clean boundaries and maintainability.

**Example Flow:**
```
User Request
    ↓
Orchestrator Agent (detects platform, routes task)
    ↓
Global Agent (architect, implementer, reviewer, etc.)
    ↓
Platform Agent (web/implementer, ios/implementer, etc.)
    ↓
Execution (implement feature, write code, etc.)
```

**Benefits:**
- Single workflow definition used across all platforms
- Clear separation between orchestration and execution
- Easier to add new platforms (add platform agents only)
- Reduced code duplication

### 3. Automatic Multi-Platform Conversion

Define agents, rules, and commands once; automatically deploy to any supported IDE.

**Conversion Support:**
- **Agents**: Claude agent YAML → Cursor AGENTS.md → Copilot agent YAML
- **Rules**: CLAUDE.md sections → Cursor .mdc rules → Copilot instructions
- **Commands**: Claude skills → Cursor commands → Copilot prompts

**Benefits:**
- Maintain single source of truth
- Consistency across IDEs
- Reduced manual porting effort
- Platform-specific optimizations

### 4. Modular Skill Organization

Skills organized by platform with shared core components, enabling team members to specialize while maintaining platform independence.

```
.claude/skills/
├── planning/           # Global (all platforms)
├── research/           # Global (all platforms)
├── web/                # Web-specific
├── ios/                # iOS-specific
└── android/            # Android-specific
```

**Benefits:**
- Clear ownership boundaries
- Platform-specific expertise isolated
- Easy discovery and reuse

### 5. CLI Distribution (`npx epost-kit`)

Simple command-line interface for installing, validating, and managing components.

**Key Commands:**
```bash
# Full installation
npx epost-kit install

# List all components
npx epost-kit list

# Create new skill
npx epost-kit create skill

# Validate spec compliance
npx epost-kit validate
```

**Benefits:**
- One-command setup
- No manual file placement
- Consistent installation across teams

## Architecture Overview

### Global Agents (9 total)

| Agent | Model | Responsibility | Delegates To |
|-------|-------|---|---|
| **orchestrator** | haiku | Top-level router, project manager | All other agents |
| **architect** | opus | Design, planning, research | Implementer (if platform-specific) |
| **implementer** | sonnet | Feature implementation | web/impl, ios/impl, android/impl |
| **reviewer** | sonnet | Code review, security, performance | All platforms |
| **researcher** | haiku | Multi-source research | None (WebSearch, WebFetch) |
| **debugger** | sonnet | Debugging coordination | All platforms + database-admin |
| **tester** | haiku | Test orchestration | web/tester, ios/tester, etc. |
| **documenter** | haiku | Cross-platform docs | None (codebase analysis) |
| **git-manager** | haiku | Git operations & versioning | None (git commands) |

### Specialized Agents (3 total)

| Agent | Model | Responsibility |
|-------|-------|---|
| **scout** | haiku | Codebase search & file discovery |
| **brainstormer** | haiku | Problem-solving & design evaluation |
| **database-admin** | sonnet | Database optimization & schema design |

### Platform Agents (3 platforms)

**Web Platform** (`web/`):
- `implementer` - Next.js, React, TypeScript, Tailwind
- `tester` - Vitest, Playwright, Testing Library
- `designer` - shadcn, Figma, accessibility

**iOS Platform** (`ios/`):
- `implementer` - Swift 6, SwiftUI, UIKit
- `tester` - XCTest, XCUITest
- `simulator` - Simulator management

**Android Platform** (`android/`):
- `implementer` - Kotlin, Jetpack Compose
- `tester` - JUnit, Espresso

## Documentation

### 📚 Core Documentation
- **[Project Overview & PDR](./project-overview-pdr.md)** - Vision, requirements, and product development requirements
- **[Codebase Summary](./codebase-summary.md)** - High-level overview of project structure, technologies, and components
- **[Code Standards](./code-standards.md)** - Coding standards, naming conventions, and best practices
- **[System Architecture](./system-architecture.md)** - Detailed architecture documentation, component interactions, and data flow
- **[Project Roadmap](./project-roadmap.md)** - Implementation phases and timeline
- **[Agent Inventory](./agent-inventory.md)** - Quick reference for all 15 agents and their responsibilities

### 📖 Reference & Guides
- **[CLI Reference](./cli-reference.md)** - Complete command catalog with usage examples
- **[Deployment Guide](./deployment-guide.md)** - Installation and configuration for production
- **[Troubleshooting Guide](./troubleshooting-guide.md)** - Common issues and solutions
- **[Glossary](./glossary.md)** - Project-specific terminology and definitions

## Implementation Phases

### Phase 0: Dependencies & Audit (1h)
- Audit existing agents, skills, commands
- Document cross-platform format requirements
- Prepare tool ecosystem

### Phase 1: Rules Foundation (2h)
- Create `.claude/rules/` governance files
- Define primary workflow, development rules, orchestration protocol

### Phase 2: Global Agents Restructuring (4h)
- Rename agents (planner→architect, etc.)
- Create orchestrator, merge PM+performance duties
- Update command references

### Phase 3: Web Platform Agents (3h)
- Create web/implementer, web/tester, web/designer
- Move platform-specific skills

### Phase 4: Functional Verification (2h)
- Test agent routing and delegation
- Verify all commands work
- End-to-end smoke tests

### Phase 5: iOS Platform Agents (3h)
- Create ios/implementer, ios/tester, ios/simulator

### Phase 6: Android Platform Agents (2h)
- Create android/implementer, android/tester

### Phase 7: CLI Build (8h)
- Implement discovery, installer, converter
- Build package.json, commander interface
- Create validation tool

### Phase 8: Platform Sync (4h)
- Generate Cursor AGENTS.md and rules
- Generate Copilot agents and instructions
- Test all platform output

### Phase 9: E2E Verification (3h)
- Verify each platform independently
- Cross-platform command testing
- Documentation review

**Total Effort**: 32 hours

## Technical Constraints

### Component Specifications

**Agent Frontmatter** (Claude Code):
- `name` - Unique identifier (required)
- `description` - 1-2 sentences (required)
- `tools` - Allowlist of tools (optional)
- `model` - Override model (optional)
- `color` - UI color (optional)

**Rules Format:**
- Claude Code: Sections in CLAUDE.md
- Cursor: `.mdc` files with YAML frontmatter
- Copilot: `.instructions.md` with `applyTo` globs

**Command/Skill Format:**
- Claude Code: Markdown + optional YAML
- Cursor: Plain markdown in `.cursor/commands/`
- Copilot: Markdown + YAML in `.github/prompts/`

### Size Limits

- **Agent prompts**: Max 200 lines
- **Individual skills**: Max 300 lines
- **CLAUDE.md**: Max 400 lines
- **Commands**: Max 150 lines

## Success Criteria

### Functional Requirements
- [ ] 9 global agents exist with correct names
- [ ] Platform agents created in web/, ios/, android/
- [ ] `/cook` commands route correctly
- [ ] CLI distribution works end-to-end
- [ ] All commands work across all platforms

### Quality Gates
- [ ] Build completes without errors
- [ ] TypeScript passes ESLint
- [ ] 80% code coverage minimum
- [ ] Cross-platform compatibility verified
- [ ] 100% API documented with examples

## Technology Stack

### CLI Tool
- **Runtime**: Node.js 18+ LTS
- **TypeScript**: 5+
- **Framework**: Commander.js
- **Validation**: zod
- **Output**: Chalk for colored CLI output

### Agent Platforms
- **Claude Code**: SDK (native)
- **Cursor**: AGENTS.md spec + API
- **GitHub Copilot**: REST API + VS Code SDK

### Testing
- **Vitest**: Unit testing
- **Playwright**: Cross-platform E2E testing
- **Manual IDE Testing**: Claude Code, Cursor, Copilot

## Quick Start

### For Claude Code Users

1. **Clone or fork the repository**:
   ```bash
   git clone https://github.com/Klara-copilot/epost_agent_kit.git
   cd epost_agent_kit
   ```

2. **Open in Claude Code**:
   - Use Claude Code to open the project directory
   - Agents and skills are automatically discovered

3. **Try a command**:
   ```
   /plan Build a REST API for user management
   ```

### For Developers

1. **Review the architecture**:
   - Start with [System Architecture](./system-architecture.md)
   - Review [Agent Inventory](./agent-inventory.md)

2. **Understand the workflow**:
   - Read [Project Roadmap](./project-roadmap.md)
   - Check [Code Standards](./code-standards.md)

3. **Set up development**:
   ```bash
   npm install
   npm run lint
   npm test
   ```

4. **Deploy to other platforms**:
   - See [Deployment Guide](./deployment-guide.md) for Cursor and GitHub Copilot setup

## Project Status

**Current Phase**: Active Development
**Status**: Planning Phase Complete - Implementation Ready
**Components**: 15 agents ✓ | 17 skills ✓ | 30 commands ✓ | 6 hooks ✓
**Last Updated**: 2026-02-05

## Contributing

1. Review the [Project Roadmap](./docs/project-roadmap.md)
2. Check existing implementation plans in [plans/](./plans/)
3. Follow the [Code Standards](./docs/code-standards.md)
4. Create feature branches and submit pull requests

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support & Community

- **GitHub**: https://github.com/Klara-copilot/epost_agent_kit
- **Issues**: https://github.com/Klara-copilot/epost_agent_kit/issues
- **Discussions**: https://github.com/Klara-copilot/epost_agent_kit/discussions

## Related Projects

- **[ClaudeKit Engineer](../claudekit-engineer-main/)** - Companion boilerplate for Claude Code and Open Code
- **[Claude Code](https://docs.claude.com/en/docs/claude-code/overview)** - Official Claude Code documentation
- **[Cursor](https://www.cursor.sh/)** - AI-powered code editor
- **[GitHub Copilot](https://github.com/features/copilot)** - AI pair programmer

---

**Created By**: Phuong Doan
**Last Updated**: 2026-02-05
**Version**: 0.1.0 (Planning)
