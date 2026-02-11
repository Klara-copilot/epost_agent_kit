# Code Standards

**Created by**: Phuong Doan
**Last Updated**: 2026-02-09

## Naming Conventions

### Files
- **Pattern**: kebab-case with descriptive names
- **Examples**:
  - `backup-manager.ts`
  - `package-resolver.ts`
  - `claude-md-generator.ts`
  - `epost-web-developer.md`
- **Long Names**: Acceptable if self-documenting
- **Rationale**: LLM tools (Grep, Glob) can understand purpose without reading content

### Variables
- **Pattern**: camelCase
- **Examples**:
  - `packageManager`
  - `profileLoader`
  - `configPath`
- **Constants**: UPPER_SNAKE_CASE
  - `DEFAULT_PROFILE`
  - `MAX_RETRIES`

### Components (TypeScript/React)
- **Pattern**: PascalCase
- **Examples**:
  - `BackupManager`
  - `PackageResolver`
  - `TemplateManager`

### Functions
- **Pattern**: camelCase, verb-based
- **Examples**:
  - `loadProfile()`
  - `installPackage()`
  - `generateChecksum()`

### Classes
- **Pattern**: PascalCase
- **Examples**:
  - `FileSystem`
  - `GitHubClient`
  - `HealthChecker`

### Interfaces/Types
- **Pattern**: PascalCase, prefix with `I` for interfaces (optional)
- **Examples**:
  - `PackageConfig`
  - `InstallOptions`
  - `AgentMetadata`

## Code Patterns

### TypeScript Module Structure
```typescript
// 1. Imports (external first, then internal)
import { Command } from 'commander';
import ora from 'ora';

import { Logger } from './logger.js';
import { FileSystem } from './file-system.js';

// 2. Type definitions
interface ConfigOptions {
  profile: string;
  target: string;
}

// 3. Constants
const DEFAULT_PROFILE = 'full';
const CONFIG_DIR = '.claude';

// 4. Main class/function
export class ConfigLoader {
  private logger: Logger;
  private fs: FileSystem;

  constructor(logger: Logger, fs: FileSystem) {
    this.logger = logger;
    this.fs = fs;
  }

  async load(options: ConfigOptions): Promise<void> {
    // Implementation
  }
}

// 5. Helper functions (private)
function validateConfig(config: unknown): boolean {
  // Implementation
}
```

### Error Handling
```typescript
// Custom errors
export class PackageNotFoundError extends Error {
  constructor(packageName: string) {
    super(`Package not found: ${packageName}`);
    this.name = 'PackageNotFoundError';
  }
}

// Try-catch with specific error types
try {
  await installPackage(name);
} catch (error) {
  if (error instanceof PackageNotFoundError) {
    logger.error(`Cannot find package: ${name}`);
  } else {
    logger.error('Unexpected error:', error);
  }
  throw error;
}
```

### Async/Await Pattern
```typescript
// Use async/await instead of promises
async function loadConfig(path: string): Promise<Config> {
  try {
    const content = await fs.readFile(path, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    logger.error('Failed to load config:', error);
    throw new ConfigLoadError(path);
  }
}
```

### Dependency Injection
```typescript
// Inject dependencies via constructor
export class PackageManager {
  constructor(
    private logger: Logger,
    private fs: FileSystem,
    private github: GitHubClient
  ) {}

  async install(packageName: string): Promise<void> {
    this.logger.info(`Installing ${packageName}...`);
    // Use injected dependencies
  }
}
```

### Agent Pattern (Markdown Files)
```markdown
---
name: agent-name
description: Brief description
model: sonnet
tools:
  - Read
  - Write
  - Bash
temperature: 0.7
---

# Agent Name

## Role

Clear role description

## Responsibilities

- Specific task 1
- Specific task 2
- Specific task 3

## Process

1. Step 1
2. Step 2
3. Step 3

## Examples

### Example 1
User request and agent response
```

### Skill Pattern (SKILL.md)
```markdown
---
name: skill-name
description: Brief description
license: MIT
---

# Skill Name

## Overview

Description of what this skill provides

## Usage

When to use this skill

## Key Concepts

### Concept 1
Explanation

### Concept 2
Explanation

## Examples

Examples of using this skill
```

## Code Patterns by Platform

### TypeScript (CLI)
- **Strict mode**: `"strict": true` in tsconfig.json
- **Type safety**: No `any` types except when necessary
- **Modules**: ES modules (`.js` extension in imports)
- **Exports**: Named exports preferred over default
- **Async**: Use async/await consistently

### Web (Next.js, React)
- **Components**: Functional components with hooks
- **File structure**: `components/`, `app/`, `lib/`
- **Styling**: TailwindCSS utility classes
- **State**: Redux Toolkit for global state
- **Testing**: Jest + React Testing Library

### iOS (Swift)
- **Naming**: Swift API Design Guidelines
- **UI**: SwiftUI preferred, UIKit when needed
- **Concurrency**: Swift 6 structured concurrency
- **Testing**: XCTest framework
- **Architecture**: MVVM pattern

### Android (Kotlin)
- **Naming**: Kotlin coding conventions
- **UI**: Jetpack Compose
- **Architecture**: MVVM with Hilt DI
- **Testing**: JUnit + Espresso
- **Build**: Gradle Kotlin DSL

### Backend (Java EE)
- **Naming**: Java naming conventions
- **Annotations**: Jakarta EE (`@Inject`, `@EJB`, `@Path`)
- **Persistence**: JPA with Hibernate
- **Testing**: JUnit + Arquillian
- **Build**: Maven

## Linting/Formatting

### TypeScript
- **Tool**: ESLint 9.18
- **Config**: `eslint.config.js`
- **Plugins**: @typescript-eslint/eslint-plugin
- **Run**: `npm run lint`

### Rules
- No unused variables
- No any types (warn)
- Consistent naming
- Proper error handling
- Descriptive code comments

### Formatting
- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Line Length**: 100 characters (soft limit)
- **Trailing Commas**: Required for multiline

## Testing Approach

### Framework
- **Tool**: Vitest 2.1
- **Coverage**: V8 coverage reporting
- **Location**: `tests/` directory

### Test Structure
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { PackageManager } from '../src/core/package-manager.js';

describe('PackageManager', () => {
  let manager: PackageManager;

  beforeEach(() => {
    manager = new PackageManager(
      mockLogger,
      mockFs,
      mockGithub
    );
  });

  it('should install package successfully', async () => {
    await manager.install('core');
    expect(mockFs.exists('.claude/agents')).toBe(true);
  });

  it('should throw error for invalid package', async () => {
    await expect(manager.install('invalid')).rejects.toThrow();
  });
});
```

### Coverage Target
- **Overall**: 80%+
- **Critical paths**: 90%+
- **Core modules**: 95%+

### Test Types
- **Unit Tests**: Individual functions/classes
- **Integration Tests**: Module interactions
- **E2E Tests**: Full workflow validation

## Documentation Standards

### Code Comments
```typescript
/**
 * Loads configuration from the specified file path.
 *
 * @param path - Path to the configuration file
 * @param options - Optional configuration options
 * @returns Parsed configuration object
 * @throws ConfigLoadError if file cannot be read or parsed
 */
async function loadConfig(
  path: string,
  options?: LoadOptions
): Promise<Config> {
  // Implementation
}
```

### README Files
- **Purpose**: Clear project overview
- **Structure**:
  1. Title and description
  2. Quick start
  3. Installation
  4. Usage examples
  5. API reference
  6. Contributing
  7. License

### Agent/Skill Documentation
- **Frontmatter**: YAML metadata
- **Sections**:
  - Role/Overview
  - Responsibilities/Usage
  - Process/Workflow
  - Examples
  - Related files

## Git Conventions

### Commit Messages
- **Format**: Conventional Commits
- **Types**: feat, fix, docs, style, refactor, test, chore
- **Example**: `feat: add package installation command`
- **Body**: Detailed explanation if needed
- **Footer**: Breaking changes, issue references

### Branch Naming
- **Pattern**: `type/description`
- **Examples**:
  - `feat/cli-install-command`
  - `fix/backup-restore-bug`
  - `docs/update-readme`

### Pull Requests
- **Title**: Clear, concise description
- **Description**: What, why, how
- **Checklist**: Tests pass, docs updated, lint clean
- **Reviewers**: At least one reviewer

## File Organization

### Keep Files Under 200 Lines
- **Rationale**: Optimal context management
- **Action**: Split large files into modules
- **Exceptions**: Configuration, generated files

### Module Structure
```
core/
├── backup-manager.ts       # Backup/restore
├── package-manager.ts      # Package installation
├── profile-loader.ts       # Profile loading
├── template-manager.ts     # Template processing
├── file-system.ts          # File operations
├── logger.ts               # Logging
└── ui.ts                   # Terminal UI
```

### Grouping Related Code
- **By Feature**: Group related functionality
- **By Layer**: Separate concerns (UI, logic, data)
- **By Platform**: Platform-specific code in subdirectories

## Security Standards

### Sensitive Data
- **Never commit**: API keys, passwords, credentials
- **Use env variables**: `.env` for local development
- **Gitignore**: `.env`, `*.key`, `credentials.json`

### Input Validation
- **Validate all user input**: Use Zod schemas
- **Sanitize paths**: Prevent path traversal
- **Check permissions**: Verify file access rights

### Error Messages
- **Don't leak information**: Avoid exposing system details
- **User-friendly**: Clear, actionable messages
- **Log details**: Full context in logs, not in UI

## Performance Guidelines

### CLI Performance
- **Fast startup**: Minimize initialization
- **Progress feedback**: Use ora spinners
- **Parallel operations**: When independent
- **Caching**: Cache expensive operations

### Code Efficiency
- **Avoid unnecessary IO**: Batch operations
- **Use streams**: For large files
- **Lazy loading**: Load on demand
- **Memoization**: Cache computed values

## Best Practices

### General
- **YAGNI**: Don't add unused features
- **KISS**: Keep it simple
- **DRY**: Don't repeat yourself
- **Single Responsibility**: One purpose per module
- **Clear naming**: Self-documenting code

### TypeScript Specific
- **Type everything**: No implicit any
- **Use interfaces**: For contracts
- **Avoid type assertions**: Unless necessary
- **Prefer const**: Over let when possible
- **Use strict null checks**: Handle undefined

### Agent Development
- **Clear roles**: Single, focused purpose
- **Delegation**: Parent-child pattern
- **Context awareness**: Detect platform
- **Error handling**: Graceful failures
- **Documentation**: Complete examples

### Command Development
- **File format**: Markdown with optional YAML frontmatter
- **Instruction-first**: Write commands as directives to Claude, not messages to users
- **Organization**: Group related commands in subdirectories (e.g., `/generate-command:splash`)
- **Patterns**: Use splash pattern for router + variants, simple pattern for standalone
- **Dynamic features**: Support file references, bash execution, user questions
- **Metadata**: Include name, description, argument-hint in frontmatter

## Quality Checklist

Before committing:
- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Linting passes
- [ ] No console.log statements
- [ ] Documentation updated
- [ ] Type definitions added
- [ ] Error handling implemented
- [ ] Security considerations reviewed
- [ ] Performance impact assessed
- [ ] Code review completed
