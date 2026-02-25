# API Routes

**Created by**: Phuong Doan
**Last Updated**: 2026-02-25
**Version**: 0.1.0

## Overview

This document covers the API structure for the epost_agent_kit project, including CLI commands, agent interactions, and platform-specific endpoints.

## CLI API

### Installation Commands

| Command | Description | Parameters |
|---------|-------------|------------|
| `npx epost-kit install` | Install kit | `--target <platform>`, `--profile <name>`, `--backup` |
| `npx epost-kit update` | Update kit | `--force`, `--skip-backup` |
| `npx epost-kit uninstall` | Remove kit | `--keep-config`, `--no-backup` |
| `npx epost-kit list` | List components | `--packages`, `--agents`, `--skills` |

#### Install Command Details
```typescript
interface InstallOptions {
  target?: 'claude-code' | 'cursor' | 'copilot';  // Default: auto-detect
  profile?: string;                                 // Default: 'full'
  backup?: boolean;                                 // Default: true
  force?: boolean;                                  // Default: false
  skipDeps?: boolean;                               // Default: false
}

// Usage
await packageManager.install({
  target: 'claude-code',
  profile: 'full',
  backup: true
});
```

### Package Management Commands

| Command | Description | Parameters |
|---------|-------------|------------|
| `npx epost-kit create skill <name>` | Create new skill | `<name>`, `--platform <platform>` |
| `npx epost-kit create agent <name>` | Create new agent | `<name>`, `--type <type>` |
| `npx epost-kit validate` | Validate installation | `--strict` |
| `npx epost-kit doctor` | Health check | `--fix`, `--verbose` |

### Backup Commands

| Command | Description | Parameters |
|---------|-------------|------------|
| `npx epost-kit backup` | Create backup | `--output <path>` |
| `npx epost-kit restore` | Restore backup | `--from <path>`, `--force` |
| `npx epost-kit backup list` | List backups | `--json` |

## Agent API

### Command Interface

Agent commands follow a consistent pattern:

```markdown
# Command Format
/<namespace>:<command> <arguments> <flags>

# Examples
/plan feature-name --parallel
/cook --platform web
/test --coverage
/debug --verbose
```

### Global Agent Commands

| Command | Agent | Description | Arguments |
|---------|-------|-------------|-----------|
| `/plan` | architect, planner | Create implementation plan | `<feature>`, `--parallel`, `--fast`, `--hard` |
| `/cook` | implementer | Implement features | `<feature>`, `--auto`, `--parallel` |
| `/test` | tester | Run tests | `--platform <platform>`, `--coverage` |
| `/debug` | debugger | Debug issues | `<issue>`, `--verbose` |
| `/review` | reviewer | Code review | `--security`, `--performance` |
| `/git:commit` | git-manager | Git operations | `-m <message>`, `--push` |

### Platform-Specific Commands

#### Web Platform
| Command | Description | Arguments |
|---------|-------------|-----------|
| `/web:cook` | Implement web features | `<feature>` |
| `/web:test` | Run web tests | `--unit`, `--e2e`, `--coverage` |

#### iOS Platform
| Command | Description | Arguments |
|---------|-------------|-----------|
| `/ios:cook` | Implement iOS features | `<feature>` |
| `/ios:test` | Run iOS tests | `--ui`, `--unit` |
| `/ios:debug` | Debug iOS issues | `<issue>` |
| `/ios:simulator` | Manage simulators | `list`, `boot`, `shutdown` |
| `/ios:a11y:audit` | Audit accessibility | `--staged` |
| `/ios:a11y:fix` | Fix a11y issue | `<id>` |
| `/ios:a11y:fix-batch` | Fix top N a11y issues | `<count>` |
| `/ios:a11y:review` | Review iOS a11y | `--buttons`, `--headings`, `--all` |

#### Android Platform
| Command | Description | Arguments |
|---------|-------------|-----------|
| `/android:cook` | Implement Android features | `<feature>` |
| `/android:test` | Run Android tests | `--unit`, `--instrumented` |

#### Backend Platform
| Command | Description | Arguments |
|---------|-------------|-----------|
| `/backend:cook` | Implement backend features | `<feature>` |
| `/backend:test` | Run backend tests | `--unit`, `--integration` |

## Package Metadata API

### package.yaml Structure

```yaml
# Package metadata
name: package-name                    # Required: kebab-case
version: 0.1.0                        # Required: semver
description: Package description      # Required: brief
category: platform|domain|meta|rag    # Required: category
license: MIT                          # Optional: default MIT

# Dependencies
depends:                              # Optional: array
  - core
  - platform-web

# Components
agents:                               # Optional: array
  - agent-name

skills:                               # Optional: array
  - skill/path

commands:                             # Optional: array
  - command-name

# Installation hooks
preInstall: script.sh                 # Optional: pre-install script
postInstall: script.sh                # Optional: post-install script
```

### Package Resolution Response

```typescript
interface ResolvedPackage {
  name: string;
  version: string;
  path: string;
  dependencies: string[];
  agents: string[];
  skills: string[];
  commands: string[];
  installOrder: number;
}

interface ResolutionResult {
  packages: ResolvedPackage[];
  installOrder: string[];
  errors: string[];
}
```

## Agent Metadata API

### Agent Frontmatter

```yaml
---
name: agent-name                      # Required: kebab-case
description: Brief description        # Required: one-line
model: sonnet|opus|haiku|sonnet-4|opus-4|claude-4-5  # Optional: default sonnet
tools:                                # Optional: array
  - Read
  - Write
  - Bash
  - Grep
temperature: 0.7                      # Optional: 0.0-1.0
maxTokens: 4000                       # Optional: token limit
outputStyle: concise|verbose          # Optional: default concise
---
```

### Agent Invocation API

```typescript
interface AgentInvocation {
  name: string;                       // Agent name
  prompt: string;                     // User prompt
  context?: string[];                 // File paths for context
  temperature?: number;               // Override default
  model?: 'sonnet' | 'opus' | 'haiku' | 'sonnet-4' | 'opus-4' | 'claude-4-5';
  background?: boolean;               // Run in background
}

interface AgentResponse {
  success: boolean;
  output: string;
  errors?: string[];
  files?: string[];                   // Modified files
  metadata: {
    model: string;
    tokens: number;
    duration: number;
  };
}
```

## Skill API

### Skill Frontmatter

```yaml
---
name: skill-name                      # Required: kebab-case
description: Brief description        # Required: one-line
license: MIT                          # Optional: default MIT
triggers:                             # Optional: auto-activation
  - keyword1
  - keyword2
dependencies:                         # Optional: other skills
  - core/skill-name
version: 1.0.0                        # Optional: semver
---
```

### Skill Access API

```typescript
interface Skill {
  name: string;
  path: string;
  content: string;
  metadata: {
    description: string;
    triggers: string[];
    dependencies: string[];
  };
}

// Load skill
const skill = await skillLoader.load('web/nextjs');

// Check if skill is active
const isActive = skillManager.isActive('core/code-review');
```

## File System API

### Core Operations

```typescript
interface FileSystem {
  // Read operations
  exists(path: string): Promise<boolean>;
  readFile(path: string): Promise<string>;
  readJSON(path: string): Promise<unknown>;
  readYAML(path: string): Promise<unknown>;

  // Write operations
  writeFile(path: string, content: string): Promise<void>;
  writeJSON(path: string, data: unknown): Promise<void>;
  writeYAML(path: string, data: unknown): Promise<void>;

  // Directory operations
  createDir(path: string): Promise<void>;
  copyDir(source: string, target: string): Promise<void>;
  deleteDir(path: string): Promise<void>;

  // Search operations
  glob(pattern: string): Promise<string[]>;
  find(pattern: string, dir: string): Promise<string[]>;
}
```

## Configuration API

### Settings Schema

```typescript
interface Settings {
  // Claude Code settings
  workspace: {
    name: string;
    version: string;
  };

  agents: {
    enabled: string[];
    default: string;
  };

  skills: {
    autoLoad: boolean;
    paths: string[];
  };

  features: {
    autoBackup: boolean;
    checksumVerify: boolean;
    parallelInstall: boolean;
  };

  platform: {
    target: 'claude-code' | 'cursor' | 'copilot';
    profile: string;
  };
}
```

### Config Loading

```typescript
interface ConfigLoader {
  // Load configuration
  load(path?: string): Promise<Settings>;

  // Merge configurations
  merge(base: Settings, override: Partial<Settings>): Settings;

  // Validate configuration
  validate(config: Settings): ValidationResult;

  // Save configuration
  save(config: Settings, path: string): Promise<void>;
}
```

## Backup API

### Backup Structure

```typescript
interface BackupMetadata {
  timestamp: string;                  // ISO 8601
  version: string;                    // Kit version
  profile: string;                    // Installation profile
  packages: string[];                 // Installed packages
  checksum: string;                   // Integrity hash
}

interface Backup {
  metadata: BackupMetadata;
  files: {
    path: string;
    content: string;
  }[];
}
```

### Backup Operations

```typescript
interface BackupManager {
  // Create backup
  create(name?: string): Promise<string>;  // Returns backup path

  // Restore backup
  restore(path: string, force?: boolean): Promise<void>;

  // List backups
  list(): Promise<BackupMetadata[]>;

  // Delete backup
  delete(path: string): Promise<void>;

  // Verify backup
  verify(path: string): Promise<boolean>;
}
```

## Checksum API

### Integrity Verification

```typescript
interface ChecksumManager {
  // Generate checksum
  generate(path: string): Promise<string>;

  // Verify checksum
  verify(path: string, expected: string): Promise<boolean>;

  // Generate manifest
  generateManifest(dir: string): Promise<Manifest>;

  // Verify manifest
  verifyManifest(dir: string, manifest: Manifest): Promise<VerificationResult>;
}

interface Manifest {
  files: {
    path: string;
    checksum: string;
  }[];
  timestamp: string;
}

interface VerificationResult {
  valid: boolean;
  errors: {
    path: string;
    expected: string;
    actual: string;
  }[];
}
```

## Logger API

### Logging Interface

```typescript
interface Logger {
  // Log levels
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
  success(message: string, ...args: unknown[]): void;

  // Formatting
  table(data: unknown[]): void;
  json(data: unknown): void;

  // Spinners
  spinner(text: string): Spinner;
}

interface Spinner {
  start(): void;
  succeed(text?: string): void;
  fail(text?: string): void;
  warn(text?: string): void;
  info(text?: string): void;
  stop(): void;
}
```

## Error API

### Error Types

```typescript
// Base error
class EpostError extends Error {
  code: string;
  details?: unknown;
}

// Specific errors
class PackageNotFoundError extends EpostError {}
class InstallationError extends EpostError {}
class ValidationError extends EpostError {}
class BackupError extends EpostError {}
class ConfigurationError extends EpostError {}
class ChecksumError extends EpostError {}
class NetworkError extends EpostError {}

// Error response
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    stack?: string;
  };
}
```

## Health Check API

### Health Status

```typescript
interface HealthCheck {
  // Overall health
  check(): Promise<HealthStatus>;

  // Component health
  checkComponent(name: string): Promise<ComponentHealth>;

  // Repair issues
  repair(issue: string): Promise<RepairResult>;
}

interface HealthStatus {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  components: ComponentHealth[];
  issues: Issue[];
}

interface ComponentHealth {
  name: string;
  status: 'ok' | 'warn' | 'error';
  message?: string;
}

interface Issue {
  severity: 'info' | 'warning' | 'error';
  component: string;
  message: string;
  fix?: string;                       // Auto-fix command
}
```

## Related Documents

- [docs/system-architecture.md](system-architecture.md) - Architecture details
- [docs/code-standards.md](code-standards.md) - Coding conventions
- [docs/deployment-guide.md](deployment-guide.md) - Deployment instructions
