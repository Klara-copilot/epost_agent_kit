---
title: CLI Test
description: (ePost) ⭑.ᐟ Run and manage tests for the epost-kit CLI project
agent: epost-cli-developer
argument-hint: 🧪 [test scope or file]
---

Run and manage tests for the epost-kit CLI project.

## Context

- **Project**: `epost-agent-cli/`
- **Framework**: vitest
- **Unit tests**: `tests/unit/`
- **Integration tests**: `tests/integration/`

## Skill Activation

Activate the `cli-development` skill for project context.

## Task

Run CLI tests for: $ARGUMENTS

## Commands

```bash
# All tests
cd epost-agent-cli && npx vitest run

# Specific file
cd epost-agent-cli && npx vitest run tests/unit/core/ui.test.ts

# Watch mode
cd epost-agent-cli && npx vitest

# Coverage
cd epost-agent-cli && npx vitest run --coverage
```

## Workflow

1. Identify test scope from arguments (all, unit, integration, specific file)
2. Run the appropriate vitest command
3. Analyze failures — check stack traces and assertions
4. If writing new tests, follow existing patterns in `tests/unit/`
5. Verify all tests pass before reporting
