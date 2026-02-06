# epost-kit CLI - Code Standards

**Version**: 0.1.0
**Status**: Phase 01 - Foundation
**Last Updated**: 2026-02-06

## Table of Contents

1. [TypeScript Standards](#typescript-standards)
2. [Naming Conventions](#naming-conventions)
3. [File Organization](#file-organization)
4. [Code Quality](#code-quality)
5. [Error Handling](#error-handling)
6. [Testing Standards](#testing-standards)
7. [CLI Design](#cli-design)

## TypeScript Standards

### Compiler Settings

```json
{
  "strict": true,
  "target": "ES2022",
  "module": "NodeNext",
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "forceConsistentCasingInFileNames": true
}
```

### Key Principles

- **Explicit Types**: Always provide return types for functions
- **No `any`**: Use `unknown` with type guards or specific types
- **Strict Null**: Handle null/undefined explicitly
- **Module Safety**: Module resolution must be explicit

### Type Definitions

Place types in dedicated files:

```typescript
// src/types/index.ts
export interface ConfigSchema {
  // interface definition
}

// Usage in other modules
import type { ConfigSchema } from './types';
```

## Naming Conventions

### Files & Directories

- **kebab-case** for all file names
- **Descriptive names**: Convey purpose immediately
- **Max file size**: 200 lines (split when exceeded)

Examples:
```
src/
  cli.ts                    // Main CLI entry
  constants.ts              // Constants only
  config-loader.ts          # Future: config loading
  github-api-client.ts      # Future: GitHub API
  types/
    index.ts                # Type exports only
```

### Variables & Functions

- **camelCase** for functions and variables
- **PascalCase** for interfaces, types, classes
- **UPPER_SNAKE_CASE** for constants

```typescript
// Variables & functions
const appName = 'epost-kit';
function loadConfig() { }
const handleError = (err) => { };

// Interfaces & types
interface EpostConfig { }
type CommandOption = 'verbose' | 'dryRun';

// Constants
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;
```

### Command Names

- **kebab-case** for CLI commands and options
- Consistent across Commander.js definitions

```typescript
// ✓ Good
.command('install-config')
.option('--dry-run')
.option('--target <ide>')

// ✗ Avoid
.command('installConfig')
.option('--dryRun')
```

## File Organization

### Module Structure

```typescript
// 1. Imports (grouped by type)
import { Command } from 'commander';  // External
import type { Config } from './types'; // Types
import { loadConfig } from './utils';  // Internal

// 2. Constants
const MAX_RETRIES = 3;

// 3. Type/Interface definitions (if not in types/)
interface LocalState { }

// 4. Main implementation
export async function executeCommand() { }

// 5. Helpers/Private functions
function validateInput() { }
```

### Directory Rules

- `src/`: Source code only
- `src/types/`: Type definitions & interfaces
- `src/commands/`: Command implementations (Phase 03+)
- `src/utils/`: Utility functions (Phase 02+)
- `tests/`: Test files mirroring src/ structure
- `dist/`: Compiled output (generated)

### Re-exports

Create barrel exports for cleaner imports:

```typescript
// src/types/index.ts
export type { EpostConfig, Metadata, FileOwnership } from './config';
export type { CommandOptions } from './commands';

// Usage
import type { EpostConfig, CommandOptions } from './types';
```

## Code Quality

### ESLint Rules

```javascript
{
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-explicit-any': 'warn',
  'no-console': 'off',  // CLI apps need console
  'prefer-const': 'error',
  'no-var': 'error'
}
```

### Function Return Types

Always explicit (except for obvious cases):

```typescript
// ✓ Good
function getVersion(): string {
  return packageJson.version;
}

async function installKit(): Promise<void> {
  // ...
}

// ✗ Avoid
function getVersion() {  // Inferred type ok
  return packageJson.version;
}
```

### Comments

- Document **why**, not **what**
- Use JSDoc for public exports
- Keep comments near code

```typescript
// ✓ Good
/**
 * Load configuration from cosmiconfig search
 * Returns merged config with CLI defaults
 */
export async function loadConfig(): Promise<EpostConfig> {
  // First check home directory for global config
  const globalConfig = await searchGlobalConfig();
  return { ...defaults, ...globalConfig };
}

// ✗ Avoid
function loadConfig() {  // No doc
  // Get config
  const cfg = getConfig();
  return cfg;
}
```

## Error Handling

### Error Classes

Create specific error types:

```typescript
// src/errors/index.ts
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export class FileError extends Error {
  constructor(path: string, message: string) {
    super(`File operation failed: ${path} - ${message}`);
    this.name = 'FileError';
  }
}
```

### Error Handling Pattern

```typescript
try {
  const config = await loadConfig();
  return config;
} catch (error) {
  if (error instanceof ConfigError) {
    console.error(`Configuration error: ${error.message}`);
    process.exit(1);
  }
  throw error; // Re-throw unknown errors
}
```

### CLI Error Messages

Use Ora spinners with proper error handling:

```typescript
import ora from 'ora';
import pc from 'picocolors';

const spinner = ora('Installing components...').start();

try {
  await installKit();
  spinner.succeed('Installation complete');
} catch (error) {
  spinner.fail(`Installation failed: ${error.message}`);
  process.exit(1);
}
```

## Testing Standards

### Test Structure

```typescript
// tests/unit/config.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { loadConfig } from '../../src/config-loader';

describe('Config Loader', () => {
  beforeEach(() => {
    // Setup
  });

  it('should load config from .epostrc', async () => {
    // Arrange
    // Act
    const config = await loadConfig();
    // Assert
    expect(config).toBeDefined();
  });

  it('should handle missing config gracefully', async () => {
    // Test error case
  });
});
```

### Coverage Requirements

- **Minimum**: 80% lines, functions, branches, statements
- **Core Logic**: 85%+ coverage
- **Utils**: 90%+ coverage
- **CLI Commands**: 80%+ coverage

### Test Patterns

```typescript
// ✓ Unit test - isolated function
it('should validate config schema', () => {
  const valid = { repository: 'org/repo' };
  expect(isValidConfig(valid)).toBe(true);
});

// ✓ Integration test - with dependencies
it('should load and merge configs', async () => {
  const config = await loadConfig();
  expect(config.repository).toBeDefined();
});

// ✗ Avoid - too high-level
it('should work', () => {
  expect(true).toBe(true);
});
```

## CLI Design

### Command Structure

Commands follow this structure:

```typescript
import { Command } from '@commander-js/extra-typings';

program
  .command('install')
  .description('Install epost-kit components')
  .option('--target <ide>', 'Target IDE')
  .option('--dry-run', 'Simulate without modifying files')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    // Validate options
    // Execute command
    // Report results
  });
```

### Option Naming

- **Boolean flags**: `--dry-run`, `--verbose`, `--force`
- **Value options**: `--target <ide>`, `--dir <path>`
- **Short options**: `-v` for common flags

### Output Standards

Use Ora spinners for progress:

```typescript
import ora from 'ora';
import pc from 'picocolors';

const spinner = ora('Processing...').start();

try {
  await doWork();
  spinner.succeed(pc.green('Done'));
} catch (error) {
  spinner.fail(pc.red(`Error: ${error.message}`));
}
```

### Exit Codes

- `0`: Success
- `1`: General error
- `2`: CLI usage error
- `130`: Ctrl+C (SIGINT)

```typescript
process.exit(0);  // Success
process.exit(1);  // Error
```

## Configuration Validation

Use Zod for runtime validation:

```typescript
import { z } from 'zod';

const configSchema = z.object({
  repository: z.string().url().optional(),
  target: z.enum(['claude', 'cursor', 'github-copilot']).optional(),
  installDir: z.string().optional(),
});

type EpostConfig = z.infer<typeof configSchema>;

export function validateConfig(data: unknown): EpostConfig {
  return configSchema.parse(data);
}
```

## Pre-commit Checks

Run before committing:

```bash
npm run typecheck   # Type safety
npm run lint        # Code quality
npm run test        # Unit tests
npm run build       # Compilation
```

Package.json includes `prepublishOnly` hook:

```bash
npm run prepublishOnly  # Full validation before publish
```

---

**Created by**: Phuong Doan
**Last Updated**: 2026-02-06
**Status**: Foundation Phase Complete
