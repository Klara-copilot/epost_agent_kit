# epost_agent_kit

Multi-platform agent distribution framework for Claude Code, Cursor, and GitHub Copilot.

## Overview

- **Multi-Platform Support**: Single source of truth converting across IDEs
- **Parent-Child Delegation**: Global agents orchestrate; platform agents execute
- **CLI Distribution**: `npx epost-kit` for installation and management
- **Modular Architecture**: Package-based installation with profiles

## Quick Start

### Installation

**From npm:**
```bash
npx epost-kit install                # Auto-detect platform
npx epost-kit install --target cursor
npx epost-kit install --target copilot
```

**Local Development (macOS):**
```bash
./install-macos.sh
```

**Local Development (Windows):**
```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```

**Requirements:** Node.js >= 18.0.0

### Verification
```bash
npx epost-kit --version  # 0.1.0
npx epost-kit doctor     # Health check
```

## Architecture

```
User Request → Orchestrator → Global Agent → Platform Agent → Execute
```

**Global Agents** (orchestrate):
| Agent | Model | Role |
|-------|-------|------|
| orchestrator | haiku | Task router |
| architect | opus | System design |
| implementer | sonnet | Feature implementation |
| reviewer | sonnet | Code review |
| researcher | sonnet | Technology research |
| debugger | sonnet | Debugging |
| tester | haiku | QA & testing |
| documenter | haiku | Documentation |
| git-manager | haiku | Git operations |
| brainstormer | sonnet | Creative ideation |
| guide | sonnet | Natural language concierge |
| a11y-specialist | sonnet | Accessibility (WCAG 2.1 AA) |

**Platform Agents** (execute):
- `web-developer` - Next.js 14, React 18, TypeScript
- `ios-developer` - Swift 6, SwiftUI, UIKit
- `android-developer` - Kotlin, Jetpack Compose
- `backend-developer` - Java 8, Jakarta EE, WildFly

## Commands

### Core Commands
```
/plan           Create implementation plan
/cook           Implement features (auto-detect platform)
/test           Run tests
/debug          Debug issues
/review         Code review
/git:commit     Git operations
```

### Platform Commands
```
/web:cook           Web implementation
/web:test           Web tests
/ios:cook           iOS implementation
/ios:test           iOS tests
/ios:a11y:audit     Accessibility audit
/ios:a11y:fix       Fix a11y issue
/ios:a11y:fix-batch Fix batch a11y issues
/ios:a11y:review    Review iOS accessibility
/android:cook       Android implementation
/backend:cook       Backend implementation
```

## Platform Specifications

| Platform | Language | Framework | Architecture |
|----------|----------|-----------|--------------|
| Web | TypeScript | Next.js 14, React 18 | App Router |
| iOS | Swift 6 | SwiftUI/UIKit | MVVM/TCA |
| Android | Kotlin | Jetpack Compose | MVVM+Hilt |
| Backend | Java 8 | Jakarta EE 8 | WildFly 26.1 |

## Packages

| Package | LOC | Description |
|---------|-----|-------------|
| core | 12,356 | Base agents, skills, commands |
| platform-ios | 7,018 | iOS components |
| platform-android | 2,036 | Android components |
| platform-backend | 530 | Backend components |
| platform-web | 2,786 | Web components |
| design-system | 73,761 | UI library & Figma |
| domains | 734 | B2B/B2C knowledge |
| kit-design | 3,328 | Kit development tools |
| **Total** | **~115K** | |

## Project Status

**Version**: 0.1.0
**Phase**: Active Development (Phase 3-6)

**Completed**:
- Phase 0-2: Foundation & Global Agents
- Core CLI functionality
- 12 core agents + 4 platform agents

**In Progress**:
- Phase 3-4: Platform & Specialized Agents
- Phase 5-6: iOS & Android completion

## Directory Structure

```
epost_agent_kit/
├── README.md
├── CLAUDE.md
├── docs/                      # Documentation
│   ├── project-overview-pdr.md
│   ├── project-roadmap.md
│   ├── system-architecture.md
│   ├── codebase-summary.md
│   ├── code-standards.md
│   ├── deployment-guide.md
│   ├── data-models.md
│   └── api-routes.md
├── .claude/                   # Claude Code config (installed)
│   ├── agents/               # 16 agents
│   ├── commands/             # 53 commands
│   ├── skills/               # 41 skills
│   └── settings.json
├── epost-agent-cli/          # Distribution CLI
│   └── src/
│       ├── core/             # Core modules
│       └── commands/         # CLI handlers
├── packages/                 # Source packages
│   ├── core/                 # 12 core agents + base commands
│   ├── platform-web/         # Web platform
│   ├── platform-ios/         # iOS platform + a11y commands
│   ├── platform-android/     # Android platform
│   ├── platform-backend/     # Backend platform
│   ├── design-system/        # UI library + Figma
│   ├── domains/              # B2B/B2C knowledge
│   └── kit-design/           # Kit development tools
├── tools/
│   └── management-ui/        # Next.js visualization app
├── profiles/                 # Installation profiles
│   └── full.yaml
├── .knowledge/               # Design system data
└── install-macos.sh          # Installers
```

## Documentation

| Document | Purpose |
|----------|---------|
| [project-overview-pdr.md](docs/project-overview-pdr.md) | Vision & requirements |
| [project-roadmap.md](docs/project-roadmap.md) | Phases & milestones |
| [system-architecture.md](docs/system-architecture.md) | Architecture details |
| [codebase-summary.md](docs/codebase-summary.md) | Codebase overview |
| [code-standards.md](docs/code-standards.md) | Coding conventions |
| [deployment-guide.md](docs/deployment-guide.md) | Deployment instructions |

## CLI Reference

```bash
npx epost-kit install          # Install kit
npx epost-kit update           # Update kit
npx epost-kit uninstall        # Remove kit
npx epost-kit list             # List components
npx epost-kit doctor           # Health check
npx epost-kit profile list     # List profiles
npx epost-kit package list     # List packages
```

## Multi-Platform Conversion

| Component | Claude Code | Cursor | GitHub Copilot |
|-----------|-------------|--------|----------------|
| Agents | `.claude/agents/*.md` | `AGENTS.md` | `.github/agents/*.agent.md` |
| Rules | `CLAUDE.md` | `.cursor/rules/*.mdc` | `.github/instructions/*.md` |
| Commands | `.claude/commands/*.md` | `.cursor/commands/*.md` | `.github/prompts/*.prompt.md` |

## Development

```bash
# Setup
npm install
npm run build

# Testing
npm test
npm run lint

# Local linking
npm link
npx epost-kit --version
```

## License

Proprietary - Klara-copilot GitHub organization

---

**Created by**: Phuong Doan
**Last Updated**: 2026-02-25
**Version**: 0.1.0
