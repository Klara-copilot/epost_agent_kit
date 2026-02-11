---
title: CLI Cook
description: (ePost) ⭑.ᐟ Implement CLI features in the epost-agent-cli project
agent: epost-cli-developer
argument-hint: ✨ [CLI feature description]
---

Implement CLI features in the epost-agent-cli project.

## Context

- **Project**: `epost-agent-cli/` — the epost-kit CLI tool
- **Tech**: TypeScript 5+, Commander, @inquirer/prompts, ora, picocolors, cli-table3
- **Testing**: vitest (`tests/unit/`, `tests/integration/`)
- **Build**: `npx tsc --noEmit` for type checking

## Skill Activation

Activate the `cli-development` skill for domain context (architecture, patterns, key modules).

## Task

Implement the following CLI feature: $ARGUMENTS

## Workflow

1. Read relevant source files in `epost-agent-cli/src/`
2. Follow existing patterns (command handlers in `src/commands/`, shared logic in `src/core/`)
3. Implement the feature
4. Run `npx tsc --noEmit` in `epost-agent-cli/` to verify types
5. Write tests in `tests/unit/` or `tests/integration/`
6. Run `cd epost-agent-cli && npx vitest run` to verify tests pass
7. Update `CHANGELOG.md` if the change is user-facing
