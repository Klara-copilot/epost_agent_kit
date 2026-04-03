# kit-ide-snippets Skill Scaffolded

**Date**: 2026-04-03
**Agent**: epost-fullstack-developer
**Epic**: kit
**Plan**: none (direct scaffolding task)

## What was implemented

Scaffolded `packages/kit/skills/kit-ide-snippets/` — a passive reference skill that captures how Copilot and Cursor handle agent routing and rule injection, and defines what content belongs in each snippet target (`CLAUDE.snippet.md`, `COPILOT.snippet.md`, `CURSOR.snippet.md`).

## Key decisions and why

- **Decision**: `user-invocable: false`, no `context: fork`
  **Why**: This is passive knowledge (reference, not workflow). Agents load it when working on IDE snippets — no subagent dispatch needed.

- **Decision**: Content ownership matrix as the primary structure
  **Why**: The most common mistake when updating snippets is duplicating CLAUDE.md content into Copilot/Cursor targets. The matrix makes the anti-pattern explicit.

- **Decision**: Included "Future optimization" section for Cursor split-mdc approach
  **Why**: Current `alwaysApply: true` single-file approach injects all platform context into every session. The split-mdc approach (per-platform `.mdc` with `alwaysApply: false` + `description`) mirrors how Claude Code loads skills on demand — captures this as aspirational without blocking current work.

## What almost went wrong

- The Copilot fallback behavior (falls back to `claude_snippet` when `copilot_snippet` not declared) was a non-obvious detail from the CLI source — easy to miss if editing a new package's `package.yaml`. Captured in the pipeline table.
