---
title: "Auto-orchestrating /get-started with subagent dispatch"
description: "Enhance /get-started Step 4 to use orchestrator-pattern subagent dispatch for reliable auto-chaining"
status: draft
priority: P2
effort: 1.5h
branch: master
tags: [skill, onboarding, orchestration, subagent]
created: 2026-03-04
---

# Auto-Orchestrating /get-started

## Overview

Enhance `/get-started` so the auto-routing in Step 4 uses a structured orchestration pattern. Currently the skill runs inline and calls `Skill()` to chain to `docs-init` / `docs-update`. The proposal: formalize this as an orchestrator-driven flow where get-started produces a handoff and the orchestrator dispatches the right follow-up subagent.

## Current State

- `/get-started` runs inline (no `context: fork`), `agent-affinity: epost-researcher`
- Step 4 calls `Skill(skill: "docs-init")` or `Skill(skill: "docs-update")` directly
- Those skills have `context: fork, agent: epost-documenter` -- they fork documenter subagents
- **Problem**: inline Skill() chaining works BUT relies on the calling agent having Skill tool access AND the chained skill forking correctly. This is fragile -- if get-started is invoked from a subagent context, Skill() may not be available.

## Target State

Two options analyzed:

### Option A: Orchestrator Wrapping (Recommended)
- Add `context: fork, agent: epost-orchestrator` to `/get-started` frontmatter
- Orchestrator runs Steps 1-3 (triage is lightweight, haiku can handle it)
- Step 4 dispatches follow-up via Task tool (subagent) -- orchestrator already knows this pattern
- Orchestrator forks `docs-init` / `docs-update` as subagents
- Single hop: user -> orchestrator (get-started) -> documenter subagent

### Option B: Keep Inline, Formalize Handoff
- Keep get-started inline (no fork)
- Step 4 produces a structured handoff block (like `/epost` hub does)
- Parent session agent reads handoff and dispatches via Skill tool
- Problem: requires parent agent to understand handoff format -- coupling

**Recommendation**: Option A. The orchestrator already has chain execution infrastructure.

## Platform Scope
- [x] All (platform-agnostic)

## Implementation Phases

1. [Phase 01: Refactor get-started for orchestrator dispatch](./phase-01-refactor-get-started.md)

## Key Dependencies

- `epost-orchestrator` agent definition
- `packages/core/skills/get-started/SKILL.md` (source of truth)
- `docs-init` and `docs-update` skills (dispatch targets)
- `skill-index.json` (update agent-affinity)

## Success Criteria

- [ ] `/get-started` uses `context: fork, agent: epost-orchestrator`
- [ ] Steps 1-3 (triage) work identically
- [ ] Step 4 dispatches follow-up skill via Task tool subagent
- [ ] Flow: `/get-started` on empty project -> docs-init runs automatically
- [ ] Flow: `/get-started` on project with KB gaps -> docs-update --verify runs
- [ ] Flow: `/get-started` on well-documented project -> stops with suggestion (no dispatch)

## Risk Assessment

- `model: haiku` on orchestrator may struggle with codebase triage (Steps 1-3 require reading files). Mitigation: triage is simple pattern matching (Glob for file existence), not deep analysis.
- Orchestrator dispatching docs-init as subagent adds a fork layer. Mitigation: already the pattern for all `context: fork` skills.

## Unresolved Questions

1. Should orchestrator's haiku model handle the triage scanning (Glob, Read index.json)? Or should we override with a stronger model for get-started specifically?
2. The orchestrator currently handles Hub Handoff from `/epost`. Adding get-started auto-dispatch is a NEW entry path. Should we document this as a generic "auto-chain" pattern in the orchestrator?
