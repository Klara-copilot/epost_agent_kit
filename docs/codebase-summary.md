# Codebase Summary

**Created by**: Phuong Doan
**Last Updated**: 2026-02-25
**Version**: 0.1.0

## Project Overview

epost_agent_kit is a multi-platform agent distribution framework enabling single-source AI agents, skills, and commands with automatic conversion across Claude Code, Cursor, and GitHub Copilot.

## Tech Stack

### Core Framework
| Component | Version | Purpose |
|-----------|---------|---------|
| TypeScript | 5.7+ | Primary language |
| Node.js | >=20.0.0 (LTS) | Runtime |
| Commander.js | 12.1 | CLI framework |
| Inquirer | 7.2 | Interactive prompts |
| Ora | 8.1 | Spinners |
| Vitest | 2.1 | Testing |
| ESLint | 9.18 | Linting |
| Cosmiconfig | 9.0 | Configuration |
| Zod | 3.24 | Validation |
| Execa | 9.5 | Process management |

### Platform Support
| Platform | Language | Framework | Build |
|----------|----------|-----------|-------|
| Web | TypeScript | Next.js 14, React 18 | npm/Vercel |
| iOS | Swift 6 | SwiftUI/UIKit | Xcode |
| Android | Kotlin | Jetpack Compose | Gradle |
| Backend | Java 8 | Jakarta EE 8 | Maven |

## Lines of Code Summary

| Package | LOC | Description |
|---------|-----|-------------|
| packages/core | 12,356 | Base agents, skills, commands |
| packages/platform-ios | 7,018 | iOS platform components |
| packages/platform-android | 2,036 | Android platform components |
| packages/platform-backend | 530 | Backend platform components |
| packages/platform-web | 2,786 | Web platform components |
| packages/design-system | 73,761 | UI library & Figma variables |
| packages/domains | 734 | B2B/B2C domain knowledge |
| packages/kit-design | 3,328 | Kit development tools |
| epost-agent-cli | 6,322 | Distribution CLI tool |
| tools/management-ui | 4,991 | Next.js visualization app |
| **Total** | **~114,862** | |

## Directory Structure

```
epost_agent_kit/
├── README.md
├── CLAUDE.md
├── CHANGELOG.md
├── .epost-metadata.json
├── .mcp.json
│
├── docs/                          # Documentation
│   ├── project-overview-pdr.md    # Vision & requirements
│   ├── project-roadmap.md         # Phases & milestones
│   ├── system-architecture.md     # Architecture details
│   ├── codebase-summary.md        # This file
│   ├── code-standards.md          # Coding conventions
│   ├── api-routes.md              # API documentation
│   ├── data-models.md             # Data structures
│   └── deployment-guide.md        # Deployment instructions
│
├── .claude/                       # Claude Code configuration (installed)
│   ├── agents/                    # 16 agents (installed from packages)
│   ├── commands/                  # 53 commands (installed from packages)
│   ├── skills/                    # 41 skills (installed from packages)
│   ├── hooks/
│   ├── output-styles/
│   ├── workflows/
│   └── settings.json
│
├── epost-agent-cli/              # Distribution CLI
│   ├── src/
│   │   ├── types/
│   │   ├── core/
│   │   │   ├── backup-manager.ts
│   │   │   ├── branding.ts
│   │   │   ├── checksum.ts
│   │   │   ├── claude-md-generator.ts
│   │   │   ├── config-loader.ts
│   │   │   ├── errors.ts
│   │   │   ├── file-system.ts
│   │   │   ├── github-client.ts
│   │   │   ├── health-checks.ts
│   │   │   ├── logger.ts
│   │   │   ├── ownership.ts
│   │   │   ├── package-manager.ts
│   │   │   ├── package-resolver.ts
│   │   │   ├── profile-loader.ts
│   │   │   ├── self-update.ts
│   │   │   ├── settings-merger.ts
│   │   │   ├── template-manager.ts
│   │   │   └── ui.ts
│   │   ├── commands/
│   │   ├── cli.ts
│   │   └── index.ts
│   ├── dist/
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── packages/                     # Modular packages
│   ├── core/
│   ├── platform-web/
│   ├── platform-ios/
│   ├── platform-android/
│   ├── platform-backend/
│   ├── design-system/
│   ├── domains/
│   └── kit-design/
│
├── tools/
│   └── management-ui/           # Next.js visualization
│       ├── app/
│       ├── components/
│       └── lib/
│
├── profiles/                    # Installation profiles
│   └── full.yaml
│
├── plans/                       # Implementation plans
├── .knowledge/                  # Design system data
│
├── install-macos.sh
├── install.ps1
└── install.cmd
```

## Key Components

### CLI Tool (epost-agent-cli)

**Entry Point**: `src/cli.ts`

**Core Modules**:
| Module | Purpose |
|--------|---------|
| backup-manager.ts | Backup/restore functionality |
| package-manager.ts | Package installation |
| profile-loader.ts | Profile loading |
| template-manager.ts | Template processing |
| github-client.ts | GitHub API integration |
| file-system.ts | File operations |
| config-loader.ts | Configuration management |
| logger.ts | Logging system |
| ui.ts | Terminal UI components |

### Agent System

| Category | Count | Examples |
|----------|-------|----------|
| Core Agents | 12 | orchestrator, architect, implementer, reviewer, researcher |
| Platform Agents | 4 | web-developer, ios-developer, android-developer, backend-developer |
| Specialized Agents | 4 | scout, brainstormer, muji, cli-developer |

### Command Categories

| Category | Count | Commands |
|----------|-------|----------|
| bootstrap | 2 | fast, parallel |
| cook | 2 | fast, parallel |
| docs | 3 | component, init, update |
| fix | 7 | fast, deep, ci, test, types, ui, logs |
| git | 3 | commit, push, pr |
| plan | 4 | fast, deep, parallel, validate |
| review | 2 | code, a11y |
| ios/a11y | 4 | audit, fix, fix-batch, review |
| cli | 3 | cook, doctor, test |
| meta | 3 | add-agent, add-skill, generate-command |
| generate-command | 2 | simple, splash |

## CLI Commands

### Installation
```bash
npx epost-kit install              # Install kit
npx epost-kit install --target cursor
npx epost-kit update               # Update kit
npx epost-kit uninstall            # Remove kit
```

### Management
```bash
npx epost-kit list                 # List components
npx epost-kit doctor               # Health check
npx epost-kit profile list         # List profiles
npx epost-kit package list         # List packages
```

### Development
```bash
npx epost-kit dev                  # Development mode
npx epost-kit workspace init       # Initialize workspace
```

## Testing Strategy

| Aspect | Details |
|--------|---------|
| Framework | Vitest 2.1 |
| Coverage | V8 coverage |
| Location | `epost-agent-cli/tests/` |
| Target | 80%+ overall, 90%+ core |

## Build Process

1. TypeScript compilation (`tsc`)
2. Output to `dist/`
3. Linting validation
4. Test execution
5. Binary linking

## Configuration Files

| File | Purpose |
|------|---------|
| package.json | npm dependencies |
| tsconfig.json | TypeScript config |
| eslint.config.js | Linting rules |
| vitest.config.ts | Test config |
| .epost-metadata.json | Kit metadata |
| .claude/settings.json | Claude settings |

## Getting Started

1. **Install**: `./install-macos.sh` or `npx epost-kit install`
2. **Verify**: `npx epost-kit --version`
3. **Use**: Invoke with `/` commands in Claude Code
4. **Read**: Start with `docs/project-overview-pdr.md`

## Related Documents

- [project-overview-pdr.md](project-overview-pdr.md) - Vision & requirements
- [project-roadmap.md](project-roadmap.md) - Phases & milestones
- [system-architecture.md](system-architecture.md) - Architecture details
- [code-standards.md](code-standards.md) - Coding conventions
- [deployment-guide.md](deployment-guide.md) - Deployment instructions
