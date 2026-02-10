# Data Models

**Created by**: Phuong Doan
**Last Updated**: 2026-02-09

## Overview

This document defines the core data models, TypeScript types, and data structures used throughout the epost_agent_kit project.

## Package Models

### Package Metadata

```typescript
/**
 * Package metadata defined in package.yaml
 */
interface PackageMetadata {
  /** Package identifier (kebab-case) */
  name: string;

  /** Semantic version (e.g., "0.1.0") */
  version: string;

  /** Brief description */
  description: string;

  /** Package category */
  category: 'platform' | 'domain' | 'meta' | 'rag' | 'core';

  /** License (default: MIT) */
  license?: string;

  /** Package dependencies */
  depends?: string[];

  /** Included agents */
  agents?: string[];

  /** Included skills */
  skills?: string[];

  /** Included commands */
  commands?: string[];

  /** Pre-install hook script */
  preInstall?: string;

  /** Post-install hook script */
  postInstall?: string;

  /** Custom metadata */
  meta?: Record<string, unknown>;
}
```

### Resolved Package

```typescript
/**
 * Package after dependency resolution
 */
interface ResolvedPackage {
  /** Package name */
  name: string;

  /** Package version */
  version: string;

  /** Absolute path to package directory */
  path: string;

  /** Original metadata */
  metadata: PackageMetadata;

  /** Resolved dependencies (flat list) */
  dependencies: string[];

  /** Installation order (0-based) */
  installOrder: number;

  /** Checksum for integrity verification */
  checksum: string;
}
```

### Package Installation State

```typescript
/**
 * Tracks package installation status
 */
interface PackageInstallState {
  /** Package name */
  package: string;

  /** Installation status */
  status: 'pending' | 'installing' | 'installed' | 'failed';

  /** Installation timestamp */
  timestamp: string;

  /** Error if failed */
  error?: string;

  /** Installed components */
  components: {
    agents: string[];
    skills: string[];
    commands: string[];
  };
}
```

## Agent Models

### Agent Definition

```typescript
/**
 * Agent metadata from frontmatter
 */
interface AgentDefinition {
  /** Agent name (kebab-case) */
  name: string;

  /** Brief description */
  description: string;

  /** Model to use */
  model?: 'sonnet' | 'opus' | 'haiku';

  /** Available tools */
  tools?: string[];

  /** Temperature setting (0.0-1.0) */
  temperature?: number;

  /** Max tokens */
  maxTokens?: number;

  /** Output style */
  outputStyle?: 'concise' | 'standard' | 'verbose' | 'developer' | 'documenter';

  /** Custom instructions */
  instructions?: string;
}
```

### Agent Registry Entry

```typescript
/**
 * Agent registration in the system
 */
interface AgentRegistryEntry {
  /** Agent definition */
  definition: AgentDefinition;

  /** File path */
  path: string;

  /** Package that provides this agent */
  package: string;

  /** Agent type */
  type: 'global' | 'platform' | 'specialized';

  /** Platform (if platform agent) */
  platform?: 'web' | 'ios' | 'android' | 'backend';

  /** Enabled status */
  enabled: boolean;
}
```

## Skill Models

### Skill Definition

```typescript
/**
 * Skill metadata from frontmatter
 */
interface SkillDefinition {
  /** Skill name (path-based) */
  name: string;

  /** Brief description */
  description: string;

  /** License */
  license?: string;

  /** Auto-activation triggers */
  triggers?: string[];

  /** Required dependencies */
  dependencies?: string[];

  /** Version */
  version?: string;
}
```

### Skill Registry Entry

```typescript
/**
 * Skill registration in the system
 */
interface SkillRegistryEntry {
  /** Skill definition */
  definition: SkillDefinition;

  /** File path */
  path: string;

  /** Package that provides this skill */
  package: string;

  /** Skill content (markdown) */
  content: string;

  /** Category */
  category: 'core' | 'platform' | 'domain' | 'meta';

  /** Active status */
  active: boolean;
}
```

## Command Models

### Command Definition

```typescript
/**
 * Command metadata
 */
interface CommandDefinition {
  /** Command name */
  name: string;

  /** Description */
  description: string;

  /** Usage example */
  usage?: string;

  /** Command arguments */
  arguments?: CommandArgument[];

  /** Command flags/options */
  options?: CommandOption[];

  /** Delegates to agent */
  agent?: string;

  /** Platform-specific */
  platform?: string;
}

interface CommandArgument {
  name: string;
  description: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean';
}

interface CommandOption {
  flag: string;
  shortFlag?: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
  default?: unknown;
}
```

### Command Registry Entry

```typescript
/**
 * Command registration
 */
interface CommandRegistryEntry {
  /** Command definition */
  definition: CommandDefinition;

  /** File path */
  path: string;

  /** Package that provides this command */
  package: string;

  /** Namespace (e.g., "web", "ios") */
  namespace?: string;

  /** Handler function (if programmatic) */
  handler?: CommandHandler;
}

type CommandHandler = (
  args: string[],
  options: Record<string, unknown>
) => Promise<void>;
```

## Profile Models

### Installation Profile

```typescript
/**
 * Installation profile definition
 */
interface InstallationProfile {
  /** Profile name */
  name: string;

  /** Description */
  description: string;

  /** Packages to install */
  packages: string[];

  /** Custom settings */
  settings?: Partial<Settings>;

  /** Platform overrides */
  platformOverrides?: Record<string, Partial<PackageMetadata>>;
}
```

### Available Profiles

```typescript
/**
 * Built-in profiles
 */
enum ProfileType {
  FULL = 'full',           // All packages
  MINIMAL = 'minimal',     // Core only
  WEB_ONLY = 'web-only',   // Core + web
  MOBILE_ONLY = 'mobile-only', // Core + iOS + Android
  BACKEND_ONLY = 'backend-only', // Core + backend
  CUSTOM = 'custom'        // User-defined
}
```

## Configuration Models

### Settings

```typescript
/**
 * System settings
 */
interface Settings {
  /** Workspace configuration */
  workspace: {
    name: string;
    version: string;
  };

  /** Agent configuration */
  agents: {
    enabled: string[];
    default: string;
    registry: AgentRegistryEntry[];
  };

  /** Skill configuration */
  skills: {
    autoLoad: boolean;
    paths: string[];
    registry: SkillRegistryEntry[];
  };

  /** Command configuration */
  commands: {
    prefix: string;
    registry: CommandRegistryEntry[];
  };

  /** Feature flags */
  features: {
    autoBackup: boolean;
    checksumVerify: boolean;
    parallelInstall: boolean;
  };

  /** Platform configuration */
  platform: {
    target: 'claude-code' | 'cursor' | 'copilot';
    profile: string;
  };

  /** Paths */
  paths: {
    agents: string;
    skills: string;
    commands: string;
    backups: string;
  };
}
```

### Kit Metadata

```typescript
/**
 * Kit installation metadata (.epost-metadata.json)
 */
interface KitMetadata {
  /** Kit version */
  version: string;

  /** Installation timestamp */
  installedAt: string;

  /** Installation profile */
  profile: string;

  /** Installed packages */
  packages: PackageInstallState[];

  /** Target platform */
  target: 'claude-code' | 'cursor' | 'copilot';

  /** Checksums */
  checksums: Record<string, string>;

  /** Last update */
  lastUpdate?: string;

  /** Backup location */
  backup?: string;
}
```

## Backup Models

### Backup Metadata

```typescript
/**
 * Backup metadata
 */
interface BackupMetadata {
  /** Backup ID */
  id: string;

  /** Creation timestamp */
  timestamp: string;

  /** Kit version at backup */
  version: string;

  /** Installation profile */
  profile: string;

  /** Packages at backup */
  packages: string[];

  /** Checksum */
  checksum: string;

  /** File count */
  fileCount: number;

  /** Total size (bytes) */
  size: number;

  /** Notes */
  notes?: string;
}
```

### Backup Archive

```typescript
/**
 * Backup archive structure
 */
interface BackupArchive {
  /** Metadata */
  metadata: BackupMetadata;

  /** Files */
  files: BackupFile[];
}

interface BackupFile {
  /** Relative path */
  path: string;

  /** File content */
  content: string;

  /** File permissions */
  mode: number;

  /** Checksum */
  checksum: string;
}
```

## Validation Models

### Validation Result

```typescript
/**
 * Generic validation result
 */
interface ValidationResult {
  /** Overall validity */
  valid: boolean;

  /** Validation errors */
  errors: ValidationError[];

  /** Warnings */
  warnings: ValidationWarning[];
}

interface ValidationError {
  /** Error code */
  code: string;

  /** Error message */
  message: string;

  /** Field/path */
  path?: string;

  /** Expected value */
  expected?: unknown;

  /** Actual value */
  actual?: unknown;
}

interface ValidationWarning {
  /** Warning message */
  message: string;

  /** Affected field */
  field?: string;

  /** Suggestion */
  suggestion?: string;
}
```

## Health Check Models

### Health Status

```typescript
/**
 * System health status
 */
interface HealthStatus {
  /** Overall health */
  overall: 'healthy' | 'degraded' | 'unhealthy';

  /** Component health */
  components: ComponentHealth[];

  /** Issues found */
  issues: HealthIssue[];

  /** Check timestamp */
  timestamp: string;

  /** Check duration (ms) */
  duration: number;
}

interface ComponentHealth {
  /** Component name */
  name: string;

  /** Health status */
  status: 'ok' | 'warn' | 'error';

  /** Status message */
  message?: string;

  /** Metrics */
  metrics?: Record<string, number>;
}

interface HealthIssue {
  /** Issue severity */
  severity: 'info' | 'warning' | 'error';

  /** Affected component */
  component: string;

  /** Issue description */
  message: string;

  /** Auto-fix command */
  fix?: string;

  /** Details */
  details?: unknown;
}
```

## CLI Models

### Command Options

```typescript
/**
 * CLI command options
 */
interface InstallOptions {
  /** Target platform */
  target?: 'claude-code' | 'cursor' | 'copilot';

  /** Installation profile */
  profile?: string;

  /** Create backup */
  backup?: boolean;

  /** Force reinstall */
  force?: boolean;

  /** Skip dependencies */
  skipDeps?: boolean;

  /** Dry run */
  dryRun?: boolean;

  /** Verbose output */
  verbose?: boolean;
}

interface UpdateOptions {
  /** Force update */
  force?: boolean;

  /** Skip backup */
  skipBackup?: boolean;

  /** Update specific package */
  package?: string;

  /** Check only (no install) */
  checkOnly?: boolean;
}

interface CreateOptions {
  /** Platform (for skills/agents) */
  platform?: string;

  /** Template to use */
  template?: string;

  /** Output directory */
  output?: string;

  /** Overwrite existing */
  overwrite?: boolean;
}
```

## Error Models

### Error Response

```typescript
/**
 * Structured error response
 */
interface ErrorResponse {
  /** Success flag (false) */
  success: false;

  /** Error details */
  error: {
    /** Error code */
    code: string;

    /** Error message */
    message: string;

    /** Additional details */
    details?: unknown;

    /** Stack trace (dev only) */
    stack?: string;
  };
}
```

### Error Codes

```typescript
/**
 * Standard error codes
 */
enum ErrorCode {
  // Package errors
  PACKAGE_NOT_FOUND = 'PACKAGE_NOT_FOUND',
  PACKAGE_INVALID = 'PACKAGE_INVALID',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',

  // Installation errors
  INSTALL_FAILED = 'INSTALL_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  CHECKSUM_MISMATCH = 'CHECKSUM_MISMATCH',

  // Configuration errors
  CONFIG_NOT_FOUND = 'CONFIG_NOT_FOUND',
  CONFIG_INVALID = 'CONFIG_INVALID',
  PROFILE_NOT_FOUND = 'PROFILE_NOT_FOUND',

  // Backup errors
  BACKUP_FAILED = 'BACKUP_FAILED',
  RESTORE_FAILED = 'RESTORE_FAILED',
  BACKUP_CORRUPTED = 'BACKUP_CORRUPTED',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  GITHUB_API_ERROR = 'GITHUB_API_ERROR',

  // System errors
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  INVALID_PATH = 'INVALID_PATH',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}
```

## State Management

### Installation State

```typescript
/**
 * Tracks installation progress
 */
interface InstallationState {
  /** Current phase */
  phase: 'init' | 'resolve' | 'install' | 'verify' | 'complete' | 'error';

  /** Current package */
  currentPackage?: string;

  /** Progress (0-100) */
  progress: number;

  /** Installed packages */
  installed: string[];

  /** Failed packages */
  failed: string[];

  /** Start time */
  startTime: string;

  /** Errors */
  errors: string[];
}
```

### Registry State

```typescript
/**
 * Component registry state
 */
interface RegistryState {
  /** Agent registry */
  agents: Map<string, AgentRegistryEntry>;

  /** Skill registry */
  skills: Map<string, SkillRegistryEntry>;

  /** Command registry */
  commands: Map<string, CommandRegistryEntry>;

  /** Last update */
  lastUpdate: string;

  /** Loaded packages */
  packages: string[];
}
```

## TypeScript Types

### Utility Types

```typescript
/**
 * Make specific properties required
 */
type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Deep partial
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Async function type
 */
type AsyncFunction<T = void> = (...args: any[]) => Promise<T>;

/**
 * JSON-serializable types
 */
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };
```

## Enums

### Platform Types

```typescript
enum PlatformType {
  CLAUDE_CODE = 'claude-code',
  CURSOR = 'cursor',
  COPILOT = 'copilot'
}

enum AgentType {
  GLOBAL = 'global',
  PLATFORM = 'platform',
  SPECIALIZED = 'specialized'
}

enum PackageCategory {
  CORE = 'core',
  PLATFORM = 'platform',
  DOMAIN = 'domain',
  META = 'meta',
  RAG = 'rag'
}
```

## Constants

### File Paths

```typescript
/**
 * Standard file paths
 */
const FILE_PATHS = {
  CLAUDE_DIR: '.claude',
  AGENTS_DIR: '.claude/agents',
  SKILLS_DIR: '.claude/skills',
  COMMANDS_DIR: '.claude/commands',
  SETTINGS: '.claude/settings.json',
  METADATA: '.epost-metadata.json',
  BACKUP_DIR: '.epost-backups',
  PACKAGE_FILE: 'package.yaml'
} as const;
```

### Default Values

```typescript
/**
 * Default configuration values
 */
const DEFAULTS = {
  PROFILE: 'full',
  MODEL: 'sonnet' as const,
  TEMPERATURE: 0.7,
  MAX_TOKENS: 4000,
  BACKUP: true,
  VERIFY_CHECKSUM: true,
  AUTO_LOAD_SKILLS: true
} as const;
```

## Related Documents

- [docs/api-routes.md](api-routes.md) - API endpoints
- [docs/system-architecture.md](system-architecture.md) - Architecture details
- [docs/code-standards.md](code-standards.md) - Coding conventions
