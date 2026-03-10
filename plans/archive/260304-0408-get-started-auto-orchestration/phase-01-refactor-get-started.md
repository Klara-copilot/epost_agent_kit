# Phase 01: Refactor get-started for orchestrator dispatch

## Context Links
- Parent plan: [plan.md](./plan.md)
- Source file: `packages/core/skills/get-started/SKILL.md`
- Orchestrator: `.claude/agents/epost-orchestrator.md`
- Reference: `packages/core/skills/epost/SKILL.md` (hub handoff pattern)

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Change get-started to fork as orchestrator, refactor Step 4 to dispatch follow-up skills as subagents
**Implementation Status**: Pending

## Key Insights
- get-started currently has NO `context: fork` -- runs inline in parent session
- The orchestrator's chain execution pattern (Hub Handoff -> Intent Chain -> sequential dispatch) is proven
- `docs-init` and `docs-update` already have `context: fork, agent: epost-documenter` -- they will fork correctly when invoked via Skill tool from orchestrator
- The Skill tool is available to orchestrator (`tools: Read, Glob, Grep, Bash, Edit, Write` in agent def -- but Skill is always available to all agents)

## Requirements
### Functional
- Add `context: fork` and `agent: epost-orchestrator` to get-started frontmatter
- Steps 1-3 (Detect Doc State, Audit/Read, Present Insights) remain identical
- Step 4 uses `Skill()` tool to dispatch follow-up (same as current, but now from orchestrator context)
- The dispatched skill (`docs-init`, `docs-update`) forks its own subagent (epost-documenter)

### Non-Functional
- Triage phase (Steps 1-3) must complete in < 15s (same as current)
- No regression in output quality of project insights

## Architecture

```
User invokes /get-started
  |
  v
[epost-orchestrator subagent] (forked by context: fork)
  |
  +-- Step 1: Detect doc state (Glob)
  +-- Step 2a/2b/2c: Audit/read docs
  +-- Step 3: Present insights to user
  +-- Step 4: Auto-route decision
        |
        +-- No docs -> Skill("docs-init")
        |     └── [epost-documenter subagent] (forked by docs-init's context: fork)
        |
        +-- Flat docs -> Skill("docs-init", "--migrate")
        |     └── [epost-documenter subagent]
        |
        +-- KB with gaps -> Skill("docs-update", "--verify")
        |     └── [epost-documenter subagent]
        |
        +-- KB complete -> Stop, suggest /cook or /plan
        |
        +-- User question -> Answer directly, stop
```

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/skills/get-started/SKILL.md` - Add frontmatter, minor Step 4 rewording [OWNED]
- `packages/core/skills/skill-index.json` - Update agent-affinity [OWNED]

### Read-Only
- `packages/core/skills/epost/SKILL.md` - Hub handoff pattern reference
- `packages/core/skills/docs-init/SKILL.md` - Dispatch target
- `packages/core/skills/docs-update/SKILL.md` - Dispatch target
- `.claude/agents/epost-orchestrator.md` - Agent definition reference

## Implementation Steps

### 1. Update get-started frontmatter

Add `context: fork` and `agent: epost-orchestrator` to YAML:

```yaml
---
name: get-started
description: "(ePost) Onboard to a project -- read docs, summarize project state, route to next action"
user-invocable: true
context: fork
agent: epost-orchestrator
metadata:
  argument-hint: "[project path or question]"
  keywords: [onboard, get-started, begin, new-project, what-is-this, existing-project]
  agent-affinity: [epost-orchestrator]
  platforms: [all]
  connections:
    enhances: [docs-init, docs-update]
---
```

Changes:
- Added `context: fork` (was missing)
- Added `agent: epost-orchestrator` (dispatches as orchestrator subagent)
- Changed `agent-affinity` from `epost-researcher` to `epost-orchestrator`

### 2. Refactor Step 4 wording

Current Step 4 already says "call Skill tool". Keep the logic identical but add explicit context that this runs from orchestrator:

```markdown
## Step 4 -- Auto-Route (Orchestrator Dispatch)

After presenting insights, dispatch the follow-up skill as a subagent. You are running as epost-orchestrator -- use the Skill tool to fork the appropriate docs agent.

| Condition | Action |
|-----------|--------|
| No docs at all | "No docs found -- generating KB now." -> Skill("docs-init") |
| Flat docs found | "Flat docs detected -- converting to KB." -> Skill("docs-init", "--migrate") |
| KB exists, has gaps | "KB found with gaps -- verifying." -> Skill("docs-update", "--verify") |
| KB exists, all good | "Well-documented. Ready to code -- /cook or /plan." (stop) |
| User has specific question | Answer from triage data, suggest /scout (stop) |
```

### 3. Update skill-index.json

In `packages/core/skills/skill-index.json`, find the `get-started` entry and change:
- `agent-affinity`: `["epost-researcher"]` -> `["epost-orchestrator"]`

### 4. Run `epost-kit init` to regenerate `.claude/`

After editing packages/, regenerate installed files.

## Todo List
- [ ] Update get-started SKILL.md frontmatter (add context: fork, agent)
- [ ] Update get-started SKILL.md Step 4 wording
- [ ] Update skill-index.json agent-affinity
- [ ] Run epost-kit init to regenerate .claude/
- [ ] Test: /get-started on project with no docs/ -> docs-init fires
- [ ] Test: /get-started on project with KB gaps -> docs-update fires
- [ ] Test: /get-started on well-documented project -> stops cleanly

## Success Criteria
- /get-started forks as orchestrator subagent
- Step 4 dispatches docs skills via Skill tool
- Docs skills fork their own epost-documenter subagents
- Full chain completes without manual intervention

## Risk Assessment
**Risks**: Haiku model may produce lower quality triage output than current inline execution (which uses whatever model the parent session has)
**Mitigation**: Triage is mechanical (Glob patterns, counting entries, table formatting). Haiku handles this fine. If quality drops, can override model in skill frontmatter or switch agent-affinity to a stronger model agent.

## Security Considerations
- get-started remains read-only in Steps 1-3 (no file creation)
- File creation only happens in the docs-init/docs-update subagent (which has appropriate agent: epost-documenter with write tools)

## Next Steps
After completion:
1. Test the full onboarding flow on 2-3 different project states
2. Consider adding this "auto-chain via orchestrator" as a reusable pattern in the orchestrator agent definition
3. Update the original get-started plan (260303-0818) to reference this enhancement
