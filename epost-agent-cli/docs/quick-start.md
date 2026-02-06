# epost-kit CLI - Quick Start Guide

**Version**: 0.1.0
**Status**: Phase 01 Complete
**Last Updated**: 2026-02-06

## Installation

### From Source

```bash
# Navigate to project
cd epost-agent-cli

# Install dependencies
npm install

# Build
npm run build

# Use locally
node dist/cli.js --help
```

### As npm Global

```bash
npm install -g epost-kit
epost-kit --help
```

## Current Commands

Currently available:

```bash
epost-kit --help           # Show this help
epost-kit --version        # Show version (0.1.0)
epost-kit -h              # Short help
epost-kit -v              # Short version
```

## Development Workflow

### Local Development

```bash
# Watch mode (recompile on changes)
npm run dev

# In another terminal, test the CLI
node dist/cli.js --help
```

### Testing

```bash
# Run all tests once
npm run test

# Watch mode
npm run test:watch

# Check coverage
npm run test:watch -- --coverage
```

### Code Quality

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

### Full Validation (Before Commit)

```bash
npm run prepublishOnly  # Runs: typecheck → lint → test → build
```

## Project Structure

```
epost-agent-cli/
├── src/                    # TypeScript source
│   ├── cli.ts             # Main CLI entry point
│   ├── constants.ts       # App constants
│   └── types/
│       └── index.ts       # Type definitions
├── tests/
│   └── unit/
│       └── setup.test.ts  # Current test
├── docs/                  # Documentation (this phase)
│   ├── codebase-summary.md
│   ├── code-standards.md
│   ├── system-architecture.md
│   ├── project-overview-pdr.md
│   └── quick-start.md (you are here)
├── dist/                  # Built JavaScript
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vitest.config.ts       # Test config
└── eslint.config.js       # Lint config
```

## Configuration (Future)

Will support configuration from:

```bash
# Project root
.epostrc                   # JSON format
.epostrc.yaml              # YAML format
epost.config.js            # JavaScript/ESM
epost.config.cjs           # CommonJS

# Home directory (future)
~/.epostrc                 # Global config
~/.epost.config.js         # Global JS config
```

## Next Phase (Phase 02)

Coming soon:

```bash
# Configuration loading
# File operations
# GitHub integration
# Metadata tracking

# Then Phase 03:
epost-kit install --target claude
epost-kit list
epost-kit update
epost-kit create
```

## Troubleshooting

### Issue: "command not found: epost-kit"

**Solution**: Install globally or use npx

```bash
# Global install
npm install -g epost-kit

# Or use npx with local version
npx epost-kit --help
```

### Issue: "ModuleNotFoundError"

**Solution**: Rebuild and run from dist

```bash
npm install
npm run build
node dist/cli.js --help
```

### Issue: Type errors in IDE

**Solution**: Ensure TypeScript is aware

```bash
npm run typecheck
```

### Issue: Lint errors

**Solution**: Check code quality

```bash
npm run lint              # See errors
npm run lint -- --fix     # Auto-fix where possible
```

## Contributing

### Before Committing

Run full validation:

```bash
npm run prepublishOnly
```

This runs in order:
1. `npm run typecheck` - Type safety
2. `npm run lint` - Code quality
3. `npm run test` - Unit tests
4. `npm run build` - Compilation

All must pass.

### Code Standards

See [code-standards.md](./code-standards.md) for:
- TypeScript conventions
- Naming rules
- File organization
- Testing patterns

## Documentation Map

| Document | Purpose |
|----------|---------|
| [quick-start.md](./quick-start.md) | This guide |
| [codebase-summary.md](./codebase-summary.md) | Code structure & stats |
| [code-standards.md](./code-standards.md) | Coding conventions |
| [system-architecture.md](./system-architecture.md) | Design & components |
| [project-overview-pdr.md](./project-overview-pdr.md) | Vision & requirements |

## Common Tasks

### Add a Dependency

```bash
npm install package-name
npm run build
npm run test
```

### Create a New File

1. Choose appropriate directory (src/ or src/utils/, etc.)
2. Follow naming: kebab-case.ts
3. Add type definitions
4. Write tests in tests/
5. Run `npm run prepublishOnly`

### Run a Single Test

```bash
npm run test -- tests/unit/setup.test.ts
```

### Debug a Test

```bash
npm run test:watch tests/unit/setup.test.ts
```

## File Locations

| File | Purpose |
|------|---------|
| src/cli.ts | CLI entry point |
| src/constants.ts | Constants |
| src/types/index.ts | Type definitions |
| tests/unit/setup.test.ts | Tests |
| package.json | Dependencies |
| tsconfig.json | TypeScript config |
| vitest.config.ts | Test config |
| eslint.config.js | Lint config |

## Performance Tips

### Build
- `npm run build` compiles TypeScript to JavaScript (~5s)
- Output in dist/

### Testing
- `npm run test` runs once (~2s)
- `npm run test:watch` watches for changes

### Development
- `npm run dev` watches and recompiles on change

## Version Info

- **CLI Version**: 0.1.0
- **Node Version Required**: >=18.0.0
- **TypeScript Version**: 5.7.3
- **Vitest Version**: 2.1.8

---

**Created by**: Phuong Doan
**Status**: Phase 01 Complete
**Next**: Phase 02 - Core Utilities
