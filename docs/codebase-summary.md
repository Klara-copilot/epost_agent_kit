# Codebase Summary

**Created by**: Phuong Doan
**Last Updated**: 2026-02-10

## Project Overview

epost_agent_kit is a comprehensive multi-platform agent framework that enables distribution of AI agents across Claude Code, Cursor, and GitHub Copilot. It implements a parent-child delegation architecture where global agents coordinate workflows while platform-specific agents execute domain-specific implementations.

## Tech Stack

### Core Framework
- **Language**: TypeScript 5.7+
- **Runtime**: Node.js >=18.0.0
- **CLI Framework**: Commander.js 12.1
- **UI/Prompts**: Inquirer 7.2, Ora 8.1, cli-table3
- **Testing**: Vitest 2.1, Coverage V8
- **Linting**: ESLint 9.18 with TypeScript plugin
- **Config Management**: Cosmiconfig 9.0
- **Validation**: Zod 3.24
- **Process Management**: Execa 9.5

### Platform Support
- **Web**: Next.js 14, React 18, TypeScript, TailwindCSS, Jest, Playwright
- **iOS**: Swift 6, SwiftUI, UIKit, XCTest, Xcode
- **Android**: Kotlin, Jetpack Compose, MVVM, JUnit, Espresso, Gradle
- **Backend**: Java 8, Jakarta EE 8, WildFly 26.1, PostgreSQL, Maven

## Directory Structure

```
epost_agent_kit/
├── README.md                       # Quick start guide
├── CLAUDE.md                       # Claude Code configuration
├── CHANGELOG.md                    # Version history
├── .epost-metadata.json           # Kit metadata
├── .gitignore
├── .mcp.json
│
├── docs/                          # Documentation (NEWLY CREATED)
│   ├── codebase-summary.md       # This file
│   ├── code-standards.md         # Coding conventions
│   ├── system-architecture.md    # Architecture details
│   ├── api-routes.md             # API documentation
│   ├── data-models.md            # Data structures
│   └── deployment-guide.md       # Deployment instructions
│
├── .claude/                       # Claude Code configuration
│   ├── agents/                    # 21 agent definitions
│   │   ├── epost-orchestrator.md
│   │   ├── epost-architect.md
│   │   ├── epost-planner.md
│   │   ├── epost-implementer.md
│   │   ├── epost-reviewer.md
│   │   ├── epost-researcher.md
│   │   ├── epost-debugger.md
│   │   ├── epost-tester.md
│   │   ├── epost-documenter.md
│   │   ├── epost-git-manager.md
│   │   ├── epost-scout.md
│   │   ├── epost-brainstormer.md
│   │   ├── epost-database-admin.md
│   │   ├── epost-backend-developer.md
│   │   ├── epost-web-developer.md
│   │   ├── epost-ios-developer.md
│   │   ├── epost-android-developer.md
│   │   ├── epost-a11y-specialist.md
│   │   ├── epost-ui-ux-designer.md
│   │   ├── epost-copywriter.md
│   │   ├── epost-journal-writer.md
│   │   └── epost-mcp-manager.md
│   │
│   ├── commands/                  # Slash commands
│   │   ├── plan.md
│   │   ├── cook.md
│   │   ├── test.md
│   │   ├── debug.md
│   │   ├── git-commit.md
│   │   ├── web-cook.md
│   │   ├── web-test.md
│   │   ├── ios-cook.md
│   │   ├── ios-test.md
│   │   ├── ios-debug.md
│   │   ├── ios-simulator.md
│   │   ├── ios-a11y-*.md
│   │   ├── android-cook.md
│   │   ├── android-test.md
│   │   ├── backend-cook.md
│   │   ├── backend-test.md
│   │   └── docs-component.md
│   │
│   ├── skills/                    # Knowledge base
│   │   ├── core/
│   │   ├── research/
│   │   ├── docker/
│   │   ├── code-review/
│   │   ├── debugging/
│   │   ├── planning/
│   │   ├── problem-solving/
│   │   ├── sequential-thinking/
│   │   ├── docs-seeker/
│   │   ├── repomix/
│   │   ├── web/
│   │   │   ├── frontend-development/
│   │   │   ├── nextjs/
│   │   │   ├── api-routes/
│   │   │   ├── klara-theme/
│   │   │   └── figma-integration/
│   │   ├── ios/
│   │   │   └── ios-development/
│   │   ├── android/
│   │   │   └── android-development/
│   │   └── backend/
│   │       └── backend-development/
│   │
│   ├── hooks/                     # Git hooks and lifecycle
│   ├── output-styles/             # Response formatting
│   ├── scripts/                   # Automation scripts
│   ├── workflows/                 # Workflow definitions
│   └── settings.json              # Claude settings
│
├── scripts/                       # Project automation
│   └── migrate-skills.mjs         # agentskills.io compliance migration
│
├── epost-agent-cli/              # Distribution CLI tool
│   ├── src/
│   │   ├── types/                # TypeScript type definitions
│   │   ├── core/                 # Core functionality
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
│   │   ├── commands/             # CLI command handlers
│   │   ├── cli.ts                # CLI entry point
│   │   └── index.ts              # Module exports
│   ├── dist/                     # Compiled output
│   ├── tests/                    # Test suite
│   ├── package.json              # Dependencies
│   ├── tsconfig.json             # TypeScript config
│   ├── eslint.config.js          # ESLint config
│   └── vitest.config.ts          # Test config
│
├── packages/                     # Package library
│   ├── core/                     # Core package components
│   ├── platform-web/             # Web platform package
│   ├── platform-ios/             # iOS platform package
│   ├── platform-android/         # Android platform package
│   ├── platform-backend/         # Backend platform package
│   ├── ui-ux/                    # UI/UX design system
│   ├── arch-cloud/               # Cloud architecture
│   ├── domain-b2b/               # B2B domain
│   ├── domain-b2c/               # B2C domain
│   ├── meta-kit-design/          # Kit design tools
│   ├── rag-web/                  # Web RAG system
│   └── rag-ios/                  # iOS RAG system
│
├── plans/                        # Implementation plans
│   └── 260205-0834-unified-architecture-implementation/
│
├── profiles/                     # Installation profiles
│   └── full.yaml
│
├── templates/                    # Template files
│
├── install-macos.sh             # macOS installer
├── install.ps1                  # Windows PowerShell installer
└── install.cmd                  # Windows CMD installer
```

## Key Components

### CLI Tool (epost-agent-cli)
- **Entry Point**: `src/cli.ts` - Commander.js CLI setup
- **Core Modules**:
  - `backup-manager.ts` - Backup/restore functionality
  - `package-manager.ts` - Package installation
  - `profile-loader.ts` - Profile loading
  - `template-manager.ts` - Template processing
  - `github-client.ts` - GitHub API integration
  - `file-system.ts` - File operations
  - `config-loader.ts` - Configuration management
  - `logger.ts` - Logging system
  - `ui.ts` - Terminal UI components

### Agent System
- **21 Total Agents**: 10 global + 11 specialized
- **Global Agents**: Orchestration and coordination
- **Platform Agents**: Domain-specific execution (web, iOS, Android, backend)
- **Specialized Agents**: Scout, brainstormer, database-admin, a11y-specialist, etc.

### Package System
- **12 Packages**: Organized by platform and domain
- **Modular Installation**: Install specific packages as needed
- **Profile-Based**: Use predefined profiles (full, minimal, etc.)

## Installation Scripts

### macOS (`install-macos.sh`)
- Checks Node.js version
- Installs dependencies
- Builds CLI tool
- Links binary for npx usage

### Windows PowerShell (`install.ps1`)
- Version validation
- npm install
- Build process
- Global linking

### Windows CMD (`install.cmd`)
- Same functionality as PowerShell
- CMD-compatible syntax

## Key Features

### 1. Multi-Platform Distribution
- Single source for agents, skills, commands
- Auto-converts for Claude Code, Cursor, GitHub Copilot
- Platform-specific optimizations

### 2. Parent-Child Delegation
- Global agents orchestrate
- Platform agents execute
- Clear separation of concerns

### 3. Package Management
- Modular installation
- Profile-based setup
- Dependency resolution

### 4. Version Control
- Checksums for integrity
- Backup/restore functionality
- Update management

### 5. Extensibility
- Custom profiles
- Package creation
- Template system

## Entry Points

### CLI Commands
```bash
npx epost-kit install              # Install kit
npx epost-kit install --target cursor
npx epost-kit list                 # List components
npx epost-kit update               # Update kit
npx epost-kit create skill <name>  # Create skill
npx epost-kit --version            # Show version
```

### Agent Commands
```
/plan           # Create implementation plan
/cook           # Implement features
/test           # Run tests
/debug          # Debug issues
/git:commit     # Git operations
/web:cook       # Web implementation
/ios:cook       # iOS implementation
/android:cook   # Android implementation
/backend:cook   # Backend implementation
```

## Testing Strategy

- **Framework**: Vitest 2.1
- **Coverage**: V8 coverage reporting
- **Test Location**: `epost-agent-cli/tests/`
- **Run Tests**: `npm test` or `npm run test:watch`

## Build Process

1. TypeScript compilation (`tsc`)
2. Output to `dist/` directory
3. Linting validation
4. Test execution
5. Binary linking

## Configuration Files

- `package.json` - npm configuration and dependencies
- `tsconfig.json` - TypeScript compiler options
- `eslint.config.js` - Code linting rules
- `vitest.config.ts` - Test configuration
- `.epost-metadata.json` - Kit metadata
- `.claude/settings.json` - Claude settings
- `.mcp.json` - MCP server configuration

## Getting Started

1. **Install Kit**:
   ```bash
   ./install-macos.sh  # macOS
   # or
   install.ps1         # Windows PowerShell
   ```

2. **Verify Installation**:
   ```bash
   npx epost-kit --version
   ```

3. **Use Agents**:
   - Invoke with `/` commands in Claude Code
   - Commands auto-route to appropriate agents

4. **Read Documentation**:
   - Start with README.md
   - Review docs/system-architecture.md
   - Check docs/code-standards.md

## Next Steps

- Implement Phase 3-4 platform agents
- Complete iOS and Android agents
- Enhance CLI features
- Add E2E verification
- Improve documentation
