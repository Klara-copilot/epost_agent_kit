# epost-kit CLI - System Architecture

**Version**: 0.1.0
**Phase**: 01 - Project Setup
**Status**: Foundation Complete
**Last Updated**: 2026-02-06

## Architecture Overview

epost-kit is a **distribution CLI** that enables seamless installation of the epost-agent-kit framework across multiple IDE platforms (Claude Code, Cursor, GitHub Copilot).

### Design Principles

1. **Single Source of Truth**: One CLI, three IDE targets
2. **Non-Destructive**: Never overwrites user files without tracking
3. **Reversible**: Track all changes via metadata
4. **Safe Defaults**: Protected patterns prevent accidents

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│  User (Terminal)                                    │
│  $ epost-kit install --target claude                │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  CLI Handler (Commander.js)                         │
│  - Parse arguments                                  │
│  - Resolve options                                  │
│  - Route to command handler                         │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Command Layer (Phase 03+)                          │
│  - install: Copy kit files to target IDE            │
│  - list: Show installed components                  │
│  - update: Sync with newer versions                 │
│  - create: Generate new agents/skills               │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Core Services (Phase 02+)                          │
│  - ConfigLoader: Load .epostrc, epost.config.*      │
│  - FileManager: Safe file operations                │
│  - GitHubClient: Fetch releases, assets             │
│  - MetadataManager: Track installed files           │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  File System                                        │
│  - .epostrc config                                  │
│  - Project files                                    │
│  - .epost-metadata.json                             │
└─────────────────────────────────────────────────────┘
```

## Module Organization

### Current (Phase 01)

```
src/
├── cli.ts                  # Entry point - Command definition
├── constants.ts            # App-wide constants
└── types/
    └── index.ts            # TypeScript interfaces

dist/                       # Compiled output
└── cli.js                  # Binary entry point
```

### Phase 02 (Core Utilities)

```
src/
├── cli.ts                  # (existing)
├── constants.ts            # (existing)
├── types/
│   ├── index.ts            # (existing)
│   ├── config.ts           # Config-specific types
│   └── commands.ts         # Command-specific types
└── utils/
    ├── config-loader.ts    # Cosmiconfig integration
    ├── file-manager.ts     # Safe file operations
    ├── github-client.ts    # GitHub API wrapper
    └── metadata-manager.ts # Installation tracking
```

### Phase 03 (Commands)

```
src/
├── (previous structure)
└── commands/
    ├── install.ts          # Install components
    ├── list.ts             # List installed
    ├── update.ts           # Update components
    └── create.ts           # Create new agent/skill
```

## Component Details

### 1. CLI Entry Point (`src/cli.ts`)

**Purpose**: Main command router

**Responsibilities**:
- Initialize Commander program
- Register top-level options (--version, --help)
- Parse process arguments
- Delegate to command handlers

**Dependencies**: Commander.js, fs

**Current Features**:
- Version from package.json
- Help information

**Future (Phase 03)**:
- Command registration
- Global option parsing
- Error handling

### 2. Type System (`src/types/index.ts`)

**Purpose**: Shared type definitions

**Key Types**:

#### EpostConfig
User configuration from `.epostrc` or `epost.config.*`

```typescript
interface EpostConfig {
  repository?: string;              // GitHub repo URL
  target?: 'claude' | 'cursor' | 'github-copilot';
  installDir?: string;              // Override default
  protectedPatterns?: string[];     // Additional protected files
}
```

#### FileOwnership
Tracks installed files in metadata

```typescript
interface FileOwnership {
  path: string;                 // Relative path
  checksum: string;             // SHA256 (LF normalized)
  installedAt: string;          // ISO 8601 timestamp
  version: string;              // Source version
  modified: boolean;            // Modification flag
}
```

#### Metadata
Metadata structure (`.epost-metadata.json`)

```typescript
interface Metadata {
  cliVersion: string;           // CLI version used
  target: string;               // IDE target
  kitVersion: string;           // Kit version installed
  installedAt: string;          // Installation timestamp
  updatedAt?: string;           // Last update timestamp
  files: Record<string, FileOwnership>;  // Tracked files
}
```

#### CommandOptions
Common CLI options

```typescript
interface CommandOptions {
  verbose?: boolean;            // Verbose logging
  yes?: boolean;                // Skip prompts (CI mode)
  dryRun?: boolean;             // Simulate only
}
```

### 3. Constants (`src/constants.ts`)

**Purpose**: Application constants

**Key Constants**:

| Constant | Value | Purpose |
|----------|-------|---------|
| APP_NAME | 'epost-kit' | CLI program name |
| GITHUB_ORG | 'Klara-copilot' | Default org |
| GITHUB_REPO | 'epost_agent_kit' | Default repo |
| METADATA_FILE | '.epost-metadata.json' | Tracking file |
| IDE_TARGETS | { CLAUDE: '.claude', ... } | Install directories |
| PROTECTED_FILE_PATTERNS | ['.git/**', ...] | Never-modify patterns |
| CONFIG_FILE_NAMES | ['.epostrc', ...] | Config search order |

## Data Flow

### Installation Flow (Phase 03)

```
User Input
  │
  ├─ Parse arguments (--target claude, --dry-run)
  │
  ▼
Load Configuration
  ├─ Search cosmiconfig files (.epostrc, epost.config.js)
  ├─ Merge with CLI defaults
  ├─ Validate schema (zod)
  │
  ▼
Fetch Kit Components
  ├─ Query GitHub API for latest release
  ├─ Download asset metadata
  │
  ▼
Plan Installation
  ├─ Determine target IDE (.claude, .cursor, .github)
  ├─ Check file existence
  ├─ Detect conflicts/modifications
  │
  ▼
Execute Installation
  ├─ Copy files (or --dry-run simulation)
  ├─ Update .epost-metadata.json
  │
  ▼
Report Results
  ├─ List installed files
  ├─ Show summary
```

### Update Flow (Phase 03)

```
Check Latest
  │
  ├─ Query GitHub for newer version
  │
  ▼
Compare Metadata
  ├─ Check .epost-metadata.json
  ├─ Identify changed files
  │
  ▼
Show Changeset
  ├─ List new files
  ├─ List modified files
  ├─ List removed files
  │
  ▼
Confirm Update
  ├─ Interactive prompt or --yes
  │
  ▼
Execute Update
  ├─ Apply changes
  ├─ Update metadata timestamps
```

## Dependency Graph

```
Commander.js (CLI parsing)
  │
  ├─ @inquirer/prompts (Interactive input)
  ├─ cosmiconfig (Config discovery)
  ├─ execa (Shell commands)
  ├─ ora (Progress spinners)
  ├─ picocolors (Terminal colors)
  └─ zod (Schema validation)

fs/path (Node.js builtins)

@types/node (Type definitions)
```

## Configuration Discovery

Uses **cosmiconfig** for flexible config loading:

```
Project Root
  │
  ├─ .epostrc
  ├─ .epostrc.json
  ├─ .epostrc.yaml / .epostrc.yml
  ├─ epost.config.js
  ├─ epost.config.cjs
  ├─ epost.config.mjs
  │
  └─ (searches in order, uses first found)

Home Directory (~/)
  └─ .epostrc / epost.config.js (future global config)
```

## Installation Tracking

### Metadata System

Files tracked in `.epost-metadata.json`:

```json
{
  "cliVersion": "0.1.0",
  "target": "claude",
  "kitVersion": "1.0.0",
  "installedAt": "2026-02-06T11:39:00Z",
  "updatedAt": "2026-02-06T11:39:00Z",
  "files": {
    ".claude/agents/orchestrator.md": {
      "path": ".claude/agents/orchestrator.md",
      "checksum": "sha256...",
      "installedAt": "2026-02-06T11:39:00Z",
      "version": "1.0.0",
      "modified": false
    }
  }
}
```

**Purposes**:
- Track CLI version (detect upgrade needs)
- Identify user modifications
- Enable safe updates/rollbacks
- Prevent corruption of manual changes

## Error Handling Strategy

### Error Categories

1. **ConfigError**: Invalid or missing config
2. **FileError**: File system operation failed
3. **GitHubError**: API request failed
4. **ValidationError**: Input doesn't match schema

### Error Recovery

```typescript
try {
  // Attempt operation
} catch (error) {
  if (error instanceof ConfigError) {
    // Guide user to fix config
  } else if (error instanceof FileError) {
    // Check permissions, disk space
  } else {
    // Unknown error - log and exit
  }
}
```

## Security Model

### Protected Files

Never modified by CLI:

```
.git/**              # Repository metadata
node_modules/**      # Dependencies
.env, .env.*         # Secrets
*.key, *.pem         # Cryptographic keys
*.p12, *.pfx         # Certificate stores
```

### File Validation

- SHA256 checksum (LF-normalized)
- Timestamp comparison
- Modification detection flag
- User confirmation required for modified files

### Safe Operations

- Dry-run mode (--dry-run)
- Verbose logging (-v, --verbose)
- Interactive confirmation (default)
- CI mode (-y, --yes)

## Performance Considerations

### Current (Phase 01)

- Minimal startup overhead
- TypeScript compilation to ES2022

### Future Optimizations (Phase 02+)

- Cache GitHub API responses (1 hour TTL)
- Lazy-load commands
- Parallel file operations
- Compression for large payloads

## Testing Architecture

### Test Pyramid

```
Unit Tests (80%)
  - Type validation
  - Config parsing
  - File operations
  - GitHub client mocking

Integration Tests (15%)
  - Config + File operations
  - End-to-end command flow
  - Metadata tracking

E2E Tests (5%)
  - Full CLI flow
  - Real GitHub API (if public)
  - File system side effects
```

### Test Organization

```
tests/
├── unit/
│   ├── config-loader.test.ts
│   ├── file-manager.test.ts
│   └── metadata.test.ts
└── integration/
    └── install-command.test.ts
```

## Deployment & Distribution

### Binary Generation

```
npm run build           # TypeScript → JavaScript
```

Output: `dist/cli.js` with shebang

### Distribution Methods

1. **npm Package**
   ```bash
   npm install -g epost-kit
   epost-kit --help
   ```

2. **Monorepo Distribution**
   ```bash
   npm install -w epost-agent-cli
   npx epost-kit --help
   ```

3. **GitHub Releases**
   - Assets: epost-kit-v0.1.0.tar.gz
   - Checksums for verification

## Future Architecture (Phases 02-04)

### Phase 02: Core Utilities
- Config loader with validation
- Async file operations
- GitHub API wrapper
- Metadata manager

### Phase 03: Commands
- `install` - Deploy kit components
- `list` - Show installed components
- `update` - Sync with newer versions
- `create` - Generate new agents/skills

### Phase 04: Advanced Features
- Multi-target installation
- Conflict resolution
- Rollback mechanism
- Skill marketplace integration

---

**Created by**: Phuong Doan
**Architecture Approach**: Modular, type-safe, distribution-focused
**Next**: Phase 02 - Core Utilities
