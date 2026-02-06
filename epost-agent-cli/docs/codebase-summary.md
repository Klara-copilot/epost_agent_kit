# epost-kit CLI - Codebase Summary

**Project**: epost-agent-kit Distribution CLI
**Version**: 0.1.0
**Status**: Phase 01 Complete - Project Setup
**Last Updated**: 2026-02-06

## Overview

epost-kit is the distribution CLI for the epost-agent-kit framework. It enables installation and management of multi-IDE agent kits across Claude Code, Cursor, and GitHub Copilot.

## Quick Stats

- **Total Files**: 10
- **Language**: TypeScript (ES2022)
- **Total Tokens**: 2,626
- **Total Chars**: 9,964
- **Node Version**: >=18.0.0
- **Package Manager**: npm

## Directory Structure

```
epost-agent-cli/
├── src/                              # Source code (TypeScript)
│   ├── cli.ts                        # CLI entry point (Commander.js)
│   ├── constants.ts                  # Application constants
│   └── types/
│       └── index.ts                  # Type definitions & interfaces
├── tests/
│   └── unit/
│       └── setup.test.ts             # Basic setup test
├── dist/                             # Compiled JavaScript (generated)
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── vitest.config.ts                  # Vitest configuration
├── eslint.config.js                  # ESLint configuration
├── .gitignore                        # Git ignore rules
└── README.md                         # Project README (stub)
```

## Core Components

### 1. CLI Entry Point (`src/cli.ts`)
- **Purpose**: Main CLI command handler
- **Dependencies**: Commander.js v12, fs, path
- **Current**: Scaffold with --help, --version
- **Features**:
  - Version read from package.json
  - Help information display
  - Ready for command registration (Phase 03)

### 2. Type Definitions (`src/types/index.ts`)
- **Purpose**: TypeScript interfaces for the CLI
- **Key Types**:
  - `EpostConfig`: User configuration interface
  - `FileOwnership`: File tracking metadata
  - `Metadata`: Installation metadata structure
  - `CommandOptions`: Common CLI options
  - `GitHubRelease`: GitHub API response shape

### 3. Constants (`src/constants.ts`)
- **Purpose**: Application-wide constants
- **Constants**:
  - `APP_NAME`: "epost-kit"
  - `GITHUB_ORG`, `GITHUB_REPO`, `GITHUB_REPO_URL`
  - `CONFIG_FILE_NAMES`: Configuration search order
  - `PROTECTED_FILE_PATTERNS`: Files never to modify
  - `IDE_TARGETS`: Installation directories
  - `METADATA_FILE`: Metadata filename

## Build & Runtime

### TypeScript Configuration (`tsconfig.json`)
- **Target**: ES2022
- **Module**: NodeNext (ESM)
- **Strict Mode**: Enabled
- **Declaration Files**: Generated
- **Output**: `dist/` directory

### Vitest Configuration (`vitest.config.ts`)
- **Environment**: Node.js
- **Coverage**: 80% threshold (lines, functions, branches, statements)
- **Reporters**: text, json, html
- **Globals**: Enabled for test functions

### ESLint Configuration (`eslint.config.js`)
- **Parser**: @typescript-eslint/parser
- **Extends**: @eslint/js recommended + TypeScript rules
- **Key Rules**:
  - Unused vars (error, except prefixed with _)
  - No explicit any (warn)
  - Console output allowed (CLI requirement)
  - Prefer const/no var (error)

## Dependencies

### Runtime (Production)
| Package | Version | Purpose |
|---------|---------|---------|
| commander | ^12.1.0 | CLI argument parsing & command registration |
| @commander-js/extra-typings | ^12.1.0 | TypeScript definitions for Commander |
| @inquirer/prompts | ^7.2.0 | Interactive CLI prompts |
| cosmiconfig | ^9.0.0 | Configuration file discovery & parsing |
| execa | ^9.5.2 | Execute shell commands |
| ora | ^8.1.1 | Terminal spinner/loader |
| picocolors | ^1.1.1 | Lightweight colored terminal output |
| zod | ^3.24.1 | Runtime schema validation |

### Development (DevDependencies)
| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^5.7.3 | TypeScript compiler |
| vitest | ^2.1.8 | Unit test framework |
| eslint | ^9.18.0 | Linting |
| @typescript-eslint/eslint-plugin | ^8.20.0 | TypeScript ESLint rules |
| @typescript-eslint/parser | ^8.20.0 | TypeScript parser for ESLint |
| @types/node | ^22.10.5 | Node.js type definitions |

## Build Pipeline

### Scripts

```bash
npm run build          # Compile TypeScript → dist/
npm run dev           # Watch mode (tsc --watch)
npm run test          # Run Vitest (single run)
npm run test:watch    # Run Vitest (watch mode)
npm run lint          # Check code with ESLint
npm run typecheck     # Type check without emitting
npm run prepublishOnly # Full validation (typecheck → lint → test → build)
```

## CLI Binary

- **Entry Point**: `dist/cli.js`
- **Shebang**: `#!/usr/bin/env node`
- **Command**: `epost-kit`
- **Global Installation**: Via `npm install -g epost-kit`

## Configuration

### Config File Discovery (via cosmiconfig)

Searched in order:
1. `.epostrc`
2. `.epostrc.json`
3. `.epostrc.yaml` / `.epostrc.yml`
4. `epost.config.js` / `epost.config.cjs` / `epost.config.mjs`

### Config Schema (`EpostConfig`)

```typescript
{
  repository?: string;                      // GitHub repo (default: Klara-copilot/epost_agent_kit)
  target?: 'claude' | 'cursor' | 'github-copilot';  // IDE target
  installDir?: string;                      // Override installation directory
  protectedPatterns?: string[];             // Additional protected patterns
}
```

## Security

### Protected Files (Never Modified)

Default patterns:
- `.git/**` - Git repository
- `node_modules/**` - Dependencies
- `.env`, `.env.*` - Environment variables
- `*.key`, `*.pem`, `*.p12`, `*.pfx` - Cryptographic keys

### File Ownership Tracking

The CLI tracks installed files via `.epost-metadata.json`:
- File path
- SHA256 checksum
- Installation timestamp
- Source version
- Modification status

## Testing

### Current Test Suite

- `tests/unit/setup.test.ts`: Basic setup validation

### Test Framework

- **Tool**: Vitest
- **Environment**: Node.js
- **Coverage Threshold**: 80%
- **Reporters**: text, json, html

## Next Phases

### Phase 02 - Core Utilities
- Configuration loading (cosmiconfig integration)
- File operations utility
- GitHub API client
- Spinner/progress management

### Phase 03 - Commands Core
- `install` command
- `list` command
- `update` command
- `create` command

### Phase 04+ - Advanced Features
- Package publishing
- Multi-IDE sync
- Conflict resolution
- Rollback mechanisms

## Quality Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Type Safety | Strict TS | ✓ Enabled |
| Linting | ESLint | ✓ Configured |
| Testing | Vitest 80% | ✓ Framework ready |
| Build | TypeScript | ✓ Working |

## Git Ignore Rules

Categories:
- **Dependencies**: `node_modules/`
- **Build**: `dist/`, `*.tsbuildinfo`
- **Coverage**: `coverage/`
- **Secrets**: `.env*`, `*.key`, `*.pem`, `*.p12`, `*.pfx`
- **OS**: `.DS_Store`, `Thumbs.db`
- **IDE**: `.vscode/`, `.idea/`, `*.swp`, `*.swo`
- **Logs**: `*.log`, `npm-debug.log*`, `yarn-*.log*`
- **Test**: `.nyc_output/`

---

**Created by**: Phuong Doan
**Architecture**: Multi-IDE CLI Distribution
**Repository**: https://github.com/Klara-copilot/epost_agent_kit
