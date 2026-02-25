# Data Models - Internal

**Created by**: Phuong Doan
**Last Updated**: 2026-02-25
**Version**: 0.1.0

## Overview

This document defines internal data models, utility types, and system-level structures used by the epost_agent_kit CLI and core systems.

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

- [docs/data-models.md](data-models.md) - Core data models
- [docs/api-routes.md](api-routes.md) - API endpoints
- [docs/system-architecture.md](system-architecture.md) - Architecture details
