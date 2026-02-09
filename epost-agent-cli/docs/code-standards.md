# Code Standards

## Naming Conventions

### Files
- **Pattern**: kebab-case with descriptive names
- **Examples**: 
  - `profile-loader.ts` (core module)
  - `claude-md-generator.ts` (generator module)
  - `init-command.test.ts` (test file)
- **Rule**: Prefer long descriptive names over short ambiguous ones

### Variables & Functions
- **Variables**: camelCase
  - `const packageList = []`
  - `const profileConfig = {}`
- **Functions**: camelCase with verb prefix
  - `async function detectProjectProfile()`
  - `function resolvePackages()`
- **Constants**: UPPER_SNAKE_CASE
  - `export const APP_NAME = 'epost-kit'`
  - `export const GITHUB_ORG = 'Klara-copilot'`

### Types & Interfaces
- **Interfaces**: PascalCase with descriptive suffix
  - `interface ProfileDefinition {}`
  - `interface PackageManifest {}`
  - `interface DetectionResult {}`
- **Type Aliases**: PascalCase
  - `type PackageStrategy = 'base' | 'merge' | 'skip'`
  - `type ConfidenceLevel = 'high' | 'medium' | 'low'`

### Classes
- **Classes**: PascalCase
  - `class ConfigError extends Error {}`
  - `class TemplateManager {}`

## Code Patterns Found

### 1. ES Module Imports
```typescript
// Node.js built-ins with 'node:' prefix
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Third-party libraries
import { Command } from '@commander-js/extra-typings';
import { select, input } from '@inquirer/prompts';

// Local modules with .js extension (for ESM)
import { logger } from './logger.js';
import { fileExists } from './file-system.js';
```

### 2. Error Handling
```typescript
// Custom error types
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

// Try-catch with specific error handling
try {
  const result = await someOperation();
  return result;
} catch (error) {
  if (error instanceof ConfigError) {
    logger.error(`Config error: ${error.message}`);
  }
  throw error;
}
```

### 3. Type-Safe Options
```typescript
// Commander.js with extra typings
const program = new Command()
  .name('epost-kit')
  .option('--verbose', 'Enable verbose logging')
  .option('--yes', 'Skip interactive prompts');

// Type-safe option interfaces
interface InitOptions {
  kit?: string;
  profile?: string;
  packages?: string;
  fresh?: boolean;
  dryRun?: boolean;
  dir?: string;
  verbose?: boolean;
  yes?: boolean;
}
```

### 4. Async/Await Pattern
```typescript
// Async functions with proper error handling
export async function runInit(opts: InitOptions): Promise<void> {
  try {
    const projectDir = opts.dir || process.cwd();
    const profile = await detectOrSelectProfile(projectDir);
    const packages = await resolvePackages(profile);
    await installPackages(packages, projectDir);
    logger.success('Installation complete');
  } catch (error) {
    logger.error(`Init failed: ${error.message}`);
    process.exit(1);
  }
}
```

### 5. File System Operations
```typescript
// Safe file operations with existence checks
export async function safeReadFile(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, 'utf-8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

// Check file existence before operations
if (await fileExists(targetPath)) {
  const content = await safeReadFile(targetPath);
  // process content
}
```

### 6. Inquirer Prompts Pattern
```typescript
// Interactive prompts with validation
const profile = await select({
  message: 'Select a developer profile:',
  choices: [
    { name: 'Web B2B Developer', value: 'web-b2b' },
    { name: 'iOS B2C Developer', value: 'ios-b2c' },
    new Separator()
  ]
});

const customInput = await input({
  message: 'Enter project name:',
  validate: (value) => value.length > 0 || 'Required'
});
```

### 7. Logging Pattern
```typescript
// Centralized logger with levels
import { logger } from './core/logger.js';

logger.info('Starting installation...');
logger.success('✓ Profile detected: web-b2b');
logger.warn('Conflict detected in .claude/agents/orchestrator.ts');
logger.error('Installation failed');
logger.debug('[profile-loader] Checking package.json');
```

### 8. Type Guards
```typescript
// Type narrowing with type guards
function isConfigError(error: unknown): error is ConfigError {
  return error instanceof ConfigError;
}

if (isConfigError(error)) {
  // error is typed as ConfigError here
  logger.error(error.message);
}
```

## Linting/Formatting

### Tool
- **ESLint 9** with flat config (eslint.config.js)
- **TypeScript ESLint Plugin** (@typescript-eslint/eslint-plugin)

### Configuration
Located in `eslint.config.js`:

```javascript
export default [
  eslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off', // CLI needs console output
      'prefer-const': 'error',
      'no-var': 'error'
    }
  }
];
```

### Key Rules
- **No unused vars** (except `_` prefix for intentionally unused)
- **Prefer const** over let
- **No var** declarations (use const/let)
- **No explicit any** (warning, not error)
- **Console allowed** (CLI tool needs console output)
- **No explicit return types** (TypeScript infers)

### Commands
```bash
npm run lint       # Check linting errors
npm run lint --fix # Auto-fix linting errors (if available)
```

## Testing Approach

### Framework
- **Vitest 2.1** (modern Vite-based test runner)
- **Coverage**: @vitest/coverage-v8

### Test Structure
```
tests/
├── unit/                    # Unit tests for isolated modules
│   ├── core/                # Core module tests
│   │   ├── ownership.test.ts
│   │   ├── checksum.test.ts
│   │   ├── file-system.test.ts
│   │   ├── package-manager.test.ts
│   │   ├── smart-merge.test.ts
│   │   └── ui.test.ts
│   └── commands/            # Command tests
│       └── versions.test.ts
├── integration/             # Integration tests
│   ├── init-command.test.ts
│   ├── doctor-command.test.ts
│   └── uninstall-command.test.ts
├── fixtures/                # Test data
│   ├── sample-metadata.json
│   ├── corrupted-metadata.json
│   └── github-releases.json
└── helpers/                 # Test utilities
    ├── temp-project.ts      # Temporary project setup
    └── test-utils.ts        # Common test helpers
```

### Test Patterns
```typescript
// Unit test example
import { describe, it, expect } from 'vitest';
import { calculateChecksum } from '../../src/core/checksum.js';

describe('checksum', () => {
  it('should calculate SHA-256 checksum', async () => {
    const content = 'test content';
    const checksum = await calculateChecksum(content);
    expect(checksum).toMatch(/^[a-f0-9]{64}$/);
  });
});

// Integration test with temp directory
import { beforeEach, afterEach } from 'vitest';
import { setupTempProject } from '../helpers/temp-project.js';

describe('init command', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await setupTempProject();
  });

  afterEach(async () => {
    await cleanupTempProject(tempDir);
  });

  it('should initialize project', async () => {
    await runInit({ dir: tempDir, yes: true });
    // assertions
  });
});
```

### Coverage Target
- **Goal**: >80% coverage for core modules
- **Priority**: Core business logic (profile-loader, package-resolver, settings-merger)
- **Command**: `npm test` (includes coverage report)

### Test Commands
```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode for development
npm run coverage      # Generate coverage report (if configured)
```

## TypeScript Configuration

### Compiler Options
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Key Settings
- **Strict mode** enabled (all strict checks)
- **NodeNext** module resolution for ESM
- **ES2022** target for modern Node.js
- **Declaration files** generated (d.ts)
- **Source maps** for debugging
- **No unused** locals/parameters
- **No implicit returns** in functions

## Code Quality Checklist

### Before Committing
- [ ] Run `npm run typecheck` (no TypeScript errors)
- [ ] Run `npm run lint` (no ESLint errors)
- [ ] Run `npm test` (all tests pass)
- [ ] Add tests for new functionality
- [ ] Update documentation if APIs changed
- [ ] Use descriptive commit messages

### Code Review Focus
- **Type safety**: Avoid `any`, use proper types
- **Error handling**: All async operations have try-catch
- **File operations**: Check existence before read/write
- **Logging**: Use logger, not console.log
- **Testing**: New code has unit tests
- **Documentation**: Complex logic has comments

### Performance Considerations
- **Async operations**: Use Promise.all for parallel operations
- **Large files**: Stream instead of reading entirely
- **Caching**: Cache expensive computations (GitHub API calls)
- **Early returns**: Exit functions early when possible
