# Report: Auto-Orchestrating /get-started

**Agent**: epost-architect
**Date**: 2026-03-04
**Plan**: `plans/260304-0408-get-started-auto-orchestration/`

## Summary

Created plan to refactor `/get-started` skill to use orchestrator-driven subagent dispatch for its Step 4 auto-routing.

## Key Decision

**Option A (Recommended)**: Add `context: fork, agent: epost-orchestrator` to get-started. Orchestrator handles triage (Steps 1-3), then dispatches `docs-init` or `docs-update` as subagents via Skill tool. Those skills already have `context: fork, agent: epost-documenter` so they fork correctly.

**Why not Option B (inline handoff)**: Requires parent session to understand handoff format. Couples get-started to caller.

## Changes Required

| File | Change |
|------|--------|
| `packages/core/skills/get-started/SKILL.md` | Add `context: fork`, `agent: epost-orchestrator`, update agent-affinity |
| `packages/core/skills/skill-index.json` | Update agent-affinity to epost-orchestrator |

## Architecture

```
/get-started -> [orchestrator fork] -> triage -> Skill("docs-init") -> [documenter fork]
```

## Effort: 1.5h (1 phase)

## Unresolved Questions

1. Haiku model for orchestrator -- adequate for triage scanning? Likely yes (mechanical Glob/Read), but untested.
2. Should "auto-chain via orchestrator" become a documented reusable pattern?
