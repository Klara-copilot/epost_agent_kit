---
name: cli-doctor
description: "(ePost) Debug issues in the epost-kit CLI tool"
user-invocable: true
context: fork
agent: epost-debugger
metadata:
  argument-hint: "[symptom or error]"
---

Debug issues in the epost-kit CLI tool.

## Context

- **Project**: `epost-agent-cli/`
- **Tech**: TypeScript 5+, Commander, @inquirer/prompts, ora, picocolors, cli-table3
- **Entry**: `src/index.ts` → Commander program
- **Commands**: `src/commands/*.ts`
- **Core modules**: `src/core/*.ts`

## Skill Activation

Activate the `kit-cli` and `debugging` skills.

## Task

Debug the following CLI issue: $ARGUMENTS

## Workflow

1. Reproduce or understand the issue from the description
2. Trace through relevant source files in `epost-agent-cli/src/`
3. Check type errors: `cd epost-agent-cli && npx tsc --noEmit`
4. Run tests: `cd epost-agent-cli && npx vitest run`
5. Identify root cause and apply fix
6. Verify fix with type check and tests
7. Report findings and resolution
