---
phase: 4
title: JetBrains Adapter
status: completed
agent: epost-fullstack-developer
date: 2026-04-06
---

## Phase Implementation Report

- Phase: phase-04-jetbrains-adapter
- Plan: /Users/than/Projects/epost_agent_kit/plans/260405-2049-ide-converter-perfection/
- Status: completed

### Files Modified

- `src/domains/installation/jetbrains-adapter.ts` — CREATED: implements `TargetAdapter`, no-op transforms, returns `AGENTS.md` filename
- `src/domains/installation/target-adapter.ts` — MODIFIED: added `"jetbrains"` to `TargetName` type, added factory case
- `src/commands/init.ts` — MODIFIED: added `"jetbrains"` to `validTargets`, added `runJetBrainsInit` short-circuit before package-copy loop, added `generateAgentsMd` utility

### Tasks Completed

- [x] `JetBrainsAdapter` class implementing `TargetAdapter` interface
- [x] `"jetbrains"` added to `TargetName` type
- [x] `"jetbrains"` case in `createTargetAdapter` factory
- [x] JetBrains short-circuit in `runPackageInit` — loads manifests, calls `runJetBrainsInit`, returns early
- [x] `runJetBrainsInit` — collects snippets, generates `AGENTS.md`, shows compatibility report + summary
- [x] `generateAgentsMd` — produces human-readable `AGENTS.md` with agent routing table, platform conventions, key commands
- [x] `validTargets` array updated

### Key Decisions

- Short-circuit pattern: JetBrains path branches out after `createTargetAdapter` + `loadAllManifests`, before the wipe-and-copy loop. Avoids wiping project root (`installDir = "."`) and unnecessary package iteration.
- `manifests` hoisted before the JetBrains check (was originally after dual-target detection) to satisfy TypeScript declaration-before-use.
- `AGENTS.md` content: agent routing table + platform conventions from `claude_snippet` files + key commands section. Same snippet source as CLAUDE.md generation.

### Compatibility Report

`JetBrainsAdapter.getWarnings()` returns one medium-severity warning explaining that agents/skills/hooks are documentation-only. This is surfaced via the existing `formatCompatibilityReport` helper.

## Completion Evidence

- Tests: 301 passed, 0 failed — `Test Files  32 passed (32)  Tests  301 passed (301)`
- Build: success — `npx tsc --noEmit` exited 0, no errors
- Acceptance criteria:
  - [x] `epost-kit init --target jetbrains` produces `AGENTS.md` at project root (via `generateAgentsMd` writing to `join(projectDir, "AGENTS.md")`)
  - [x] `AGENTS.md` contains agent routing table and platform conventions
  - [x] No other files created — short-circuit returns before any `mkdir`/`copyFile` for agent/skill/hook dirs
  - [x] Compatibility report notes limited feature support
- Files changed: 3 files in CLI repo `src/`

Docs impact: none (internal CLI, no public API surface change)
