---
title: "Fix 3 Splash Pattern Action Items"
description: "Add Node.js version check, document R2 gap-filling, add /plan:validate reference"
status: pending
priority: P1
effort: 1.5h
branch: feature/enhencement-agent-skill
tags: [splash-pattern, documentation, scripts, validation]
created: 2026-02-06
---

# Fix 3 Splash Pattern Action Items

## Summary

Three high-priority action items from the Splash Pattern Plan Architecture validation need resolution before merge. All are small, focused changes to existing files.

## Context

- Source: Architecture validation identified 3 gaps in documentation and scripts
- All items are independent (no cross-dependencies)
- No research needed; pure codebase modifications

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Add Node.js version check to state scripts | 30m | pending | [phase-01](./phase-01-nodejs-version-check.md) |
| 2 | Document R2 gap-filling strategy | 30m | pending | [phase-02](./phase-02-r2-gap-filling-docs.md) |
| 3 | Add /plan:validate reference | 30m | pending | [phase-03](./phase-03-plan-validate-reference.md) |

## Key Dependencies

- `.claude/scripts/set-active-plan.cjs` (Phase 1)
- `.claude/scripts/get-active-plan.cjs` (Phase 1)
- `.claude/commands/plan/hard.md` (Phase 2)
- `.claude/agents/epost-architect.md` (Phase 2)
- `docs/cli-reference.md` (Phase 3)

## Execution Strategy

All 3 phases are independent. Can be executed in parallel or sequentially.

## Critical Constraints

- No new files to create (modify existing only)
- Keep files under 200 LOC (scripts) / 300 LOC (agents, commands)
- Node.js >=18.0.0 (matches epost-agent-cli/package.json engines)
- Follow existing code patterns in each file

## Success Criteria

- [ ] State scripts exit with clear error on Node.js < 18
- [ ] R2 gap-filling strategy documented in hard.md and/or epost-architect.md
- [ ] /plan:validate referenced in cli-reference.md with description
- [ ] All modified files compile without errors
