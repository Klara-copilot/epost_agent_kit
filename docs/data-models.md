# Data Models

**Created by**: Phuong Doan
**Last Updated**: 2026-02-25
**Version**: 0.1.0

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
  model?: 'sonnet' | 'opus' | 'haiku' | 'sonnet-4' | 'opus-4' | 'claude-4-5';

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

## Related Documents

- [docs/data-models-internal.md](data-models-internal.md) - Internal models (validation, health, CLI, errors, state)
- [docs/api-routes.md](api-routes.md) - API endpoints
- [docs/system-architecture.md](system-architecture.md) - Architecture details
- [docs/code-standards.md](code-standards.md) - Coding conventions
