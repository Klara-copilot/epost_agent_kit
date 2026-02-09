# Codebase Summary

## Project Overview

**epost-kit** is a distribution CLI tool for the epost-agent-kit framework — a multi-IDE agent framework supporting Claude Code, GitHub Copilot, and Cursor. It provides package-based installation of AI agent kits with smart conflict resolution, version management, and developer profile workflows.

**Purpose**: Distribute and manage AI agent configurations across different IDEs through a unified CLI interface.

**Key Capabilities**:
- Multi-IDE support (.claude/, .cursor/, .github/)
- Profile-based package selection (web-b2b, ios-b2c, etc.)
- Smart file merging with ownership tracking
- Auto-detection of project types
- Health checks and integrity verification
- CI/CD-ready automation

## Tech Stack

- **Language**: TypeScript 5.7
- **Runtime**: Node.js 18+
- **Module System**: ES Modules (NodeNext)
- **CLI Framework**: Commander.js (12.1) with extra typings
- **Terminal UI**: @inquirer/prompts (7.2), ora, cli-table3
- **Testing**: Vitest (2.1)
- **Linting**: ESLint 9 with TypeScript plugin
- **Package Manager**: npm
- **Build**: TypeScript compiler (tsc)
- **Distribution**: npm registry (epost-kit)

## Directory Structure

```
epost-agent-cli/
├── src/                      # TypeScript source code
│   ├── cli.ts                # CLI entry point (202 lines)
│   ├── constants.ts          # App constants, GitHub config
│   ├── commands/             # CLI command implementations
│   │   ├── init.ts           # Initialize in existing project (30k+ lines)
│   │   ├── new.ts            # Create new project
│   │   ├── doctor.ts         # Health checks
│   │   ├── versions.ts       # List GitHub releases
│   │   ├── update.ts         # Update to latest version
│   │   ├── uninstall.ts      # Remove kit
│   │   ├── onboard.ts        # First-time setup wizard
│   │   ├── profile.ts        # Profile management (list/show)
│   │   ├── package.ts        # Package management (list/add/remove)
│   │   ├── workspace.ts      # Workspace-level CLAUDE.md generation
│   │   └── dev.ts            # Live sync watcher for development
│   ├── core/                 # Core business logic
│   │   ├── profile-loader.ts      # Auto-detect, list profiles
│   │   ├── package-resolver.ts    # Profile → packages, dependency resolution
│   │   ├── settings-merger.ts     # Multi-layer settings merge
│   │   ├── claude-md-generator.ts # CLAUDE.md generation
│   │   ├── ownership.ts           # File ownership tracking
│   │   ├── checksum.ts            # File integrity verification
│   │   ├── smart-merge.ts         # Smart file conflict resolution
│   │   ├── file-system.ts         # File operations utilities
│   │   ├── template-manager.ts    # Template rendering
│   │   ├── backup-manager.ts      # Backup/restore functionality
│   │   ├── config-loader.ts       # Cosmiconfig integration
│   │   ├── github-client.ts       # GitHub API client
│   │   ├── self-update.ts         # Self-update mechanism
│   │   ├── health-checks.ts       # Installation verification
│   │   ├── package-manager.ts     # npm/yarn detection
│   │   ├── logger.ts              # Logging utilities
│   │   ├── branding.ts            # CLI branding/colors
│   │   ├── ui.ts                  # Terminal UI helpers
│   │   └── errors.ts              # Custom error types
│   └── types/                # TypeScript type definitions
│       ├── command-options.ts     # CLI option types
│       └── index.ts               # Exported types
├── tests/                    # Test suites
│   ├── unit/                 # Unit tests (core/, commands/)
│   ├── integration/          # Integration tests
│   ├── fixtures/             # Test data (JSON)
│   └── helpers/              # Test utilities
├── dist/                     # Compiled JavaScript output
├── plans/                    # Project plans (JSON index)
├── package.json              # npm package manifest
├── tsconfig.json             # TypeScript config
├── eslint.config.js          # ESLint flat config
├── README.md                 # User documentation
└── .gitignore                # Git ignore rules
```

## Key Files

- `src/cli.ts` — CLI entry point, command registration with Commander.js
- `src/commands/init.ts` — Core installation logic (30k+ lines, complex merge workflows)
- `src/core/profile-loader.ts` — Profile auto-detection and listing
- `src/core/package-resolver.ts` — Resolves profile → packages, dependency graph
- `src/core/settings-merger.ts` — Multi-layer settings merge (base → package → profile)
- `src/core/claude-md-generator.ts` — Generates CLAUDE.md from installed packages
- `src/core/ownership.ts` — Tracks file ownership for smart updates
- `src/core/smart-merge.ts` — Smart file conflict resolution (keep/overwrite/merge)
- `src/core/health-checks.ts` — Installation integrity verification
- `src/constants.ts` — App-wide constants (GitHub org/repo, file patterns)
- `package.json` — npm manifest, entry point (dist/cli.js)
- `tsconfig.json` — TypeScript compiler config (ES2022, NodeNext)

## Getting Started

### Installation

```bash
# Global install
npm install -g epost-kit

# Or use with npx
npx epost-kit <command>
```

### Development

```bash
# Clone repo
git clone https://github.com/Klara-copilot/epost_agent_kit.git
cd epost_agent_kit/epost-agent-cli

# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run locally
node dist/cli.js --help
```

### Build Commands

```bash
npm run build          # Compile TypeScript to dist/
npm run dev            # Watch mode (tsc --watch)
npm test               # Run Vitest tests
npm run test:watch     # Watch mode for tests
npm run lint           # ESLint check
npm run typecheck      # TypeScript check (no emit)
npm run prepublishOnly # Pre-publish checks (typecheck, lint, test, build)
```

## Architecture Highlights

### Profile System
- **Profiles** define developer roles (e.g., web-b2b, ios-b2c, android-b2c)
- Each profile maps to a set of **packages** (core, platform-web, platform-ios, etc.)
- **Auto-detection** suggests profiles based on project structure (package.json, .xcodeproj)

### Package System
- **Packages** are modular units (core, platform-*, domain-*, ui-ux, etc.)
- Each package provides: agents, skills, commands, settings
- **Dependency resolution**: topological sort, circular dependency detection
- **Layer system**: packages have layers (0=core, 1=platform, 2=domain, 3=specialized)

### Settings Merge
- **3-layer merge**: base settings → package settings → profile settings
- **Strategies**: base (replace), merge (deep merge), skip (ignore)
- Handles complex nested structures (agents, skills, commands)

### Ownership Tracking
- **Metadata file** (.epost-metadata.json) tracks installed files
- **Checksums** verify file integrity
- **Smart updates**: respect user modifications, offer merge strategies

### File Conflict Resolution
- **Strategies**: keep (preserve local), overwrite (use incoming), merge (smart merge)
- **Merge algorithm**: preserves user content, updates kit content
- **Backup**: automatic backup before overwrite

## Data Flow

1. **Command Invocation** (cli.ts) → Commander.js parses args
2. **Command Handler** (commands/*.ts) → business logic
3. **Profile Resolution** (profile-loader.ts) → auto-detect or user selection
4. **Package Resolution** (package-resolver.ts) → resolve dependencies, topological sort
5. **Settings Merge** (settings-merger.ts) → merge base + packages + profile
6. **File Operations** (ownership.ts, smart-merge.ts) → write files with conflict resolution
7. **CLAUDE.md Generation** (claude-md-generator.ts) → generate IDE config
8. **Health Checks** (health-checks.ts) → verify installation

## Key Patterns

- **Commander.js** for CLI structure (commands, options, help)
- **Inquirer prompts** for interactive workflows
- **Cosmiconfig** for flexible config file discovery
- **GitHub API** for version management (releases, tags)
- **Checksum-based integrity** (SHA-256 hashes)
- **Topological sort** for dependency resolution
- **Deep merge** for settings composition
- **Ownership tracking** for smart updates
- **Template rendering** (Handlebars-style)
- **Error handling** with custom error types
