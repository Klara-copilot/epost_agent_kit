---
title: "Fix UI post-audit flow: resolve Iron Law violation + cleanup"
status: completed
created: 2026-03-11
updated: 2026-03-10
effort: 1.5h
phases: 2
platforms: [all]
breaking: false
---

# Fix UI Post-Audit Flow

## Summary

`fix --ui` dispatches to epost-debugger (via `context: fork, agent: epost-debugger` on SKILL.md), then `ui-mode.md` tries to spawn epost-muji. Subagents cannot spawn subagents -- muji is unreachable. Same pattern potentially affects `--a11y`.

## Root Cause

`fix/SKILL.md` has a blanket `context: fork, agent: epost-debugger`. ALL flag paths (--ui, --a11y, --ci, --deep) execute inside epost-debugger's subagent context. `--ui` and `--a11y` modes need to dispatch specialist agents (muji, a11y-specialist), which is blocked by the Iron Law.

## Solution

Make `fix/SKILL.md` execute **inline** (no fork) for `--ui` and `--a11y` flags, so the main context can dispatch muji/a11y-specialist. The `context: fork, agent: epost-debugger` only applies to the general auto-detect path and `--deep`/`--ci`.

This requires removing `context: fork` from `fix/SKILL.md` frontmatter and adding explicit dispatch-to-debugger instructions in the general/deep/ci paths.

## Key Dependencies

- `packages/core/skills/fix/SKILL.md` -- main fix skill
- `packages/core/skills/fix/references/ui-mode.md` -- UI fix mode
- `packages/core/skills/fix/references/a11y-mode.md` -- a11y fix mode
- PLAN-0069 (completed) -- `.epost-data/{topic}/known-findings.json` is canonical path

## Path Correction Note

The `.epost-data/ui/known-findings.json` path in fix/SKILL.md line 65 is **correct** per PLAN-0069. The `.epost-data/a11y/known-findings.json` path on line 66 is also correct. No path changes needed.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Fix dispatch architecture (inline vs fork) | 1h | completed | [phase-1](./phase-1-fix-dispatch-architecture.md) |
| 2 | Clean up ui-mode.md (remove YAGNI, clarify close flow) | 30m | completed | [phase-2](./phase-2-ui-mode-cleanup.md) |

## Success Criteria

- `fix --ui` executes inline in main context, dispatches epost-muji successfully
- `fix --a11y` executes inline in main context, can dispatch a11y-specialist
- General `fix` (no flag) still dispatches to epost-debugger
- `--deep` and `--ci` still dispatch to epost-debugger
- No `.epost-data/` path changes (paths are already correct)
- Patch file saving removed from ui-mode.md (YAGNI)
- Close suggestion present after fix applied
