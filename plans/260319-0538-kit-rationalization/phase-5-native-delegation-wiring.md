---
phase: 5
title: "Native Delegation Wiring"
effort: 2h
depends: [1, 2]
---

# Phase 5: Native Delegation Wiring

## Context Links
- [Plan](./plan.md)
- Research: `reports/260319-1225-native-agent-primitives-reuse-epost-researcher.md`
- `packages/core/agents/` — agent source files

## Overview
- Priority: P2
- Status: Pending
- Effort: 2h
- Description: Update custom agents to use Claude Code built-in primitives (Explore, Plan) for heavy lifting. Custom agents become thin wrappers: native primitive for execution + domain skills for context.

## Core Pattern

```
Custom Agent = Native Primitive (execution) + Domain Skills (knowledge) + epost Format (output)
```

Agents are WRAPPERS, not replacements. They add domain knowledge on top of native capabilities.

## Available Native Primitives

| Primitive | Model | Tools | Best For |
|-----------|-------|-------|----------|
| `Explore` | Haiku (fast) | Read-only | Codebase scanning, file discovery, pattern search |
| `Plan` | Inherits | Read-only | Pre-planning research, context gathering |
| `general-purpose` | Inherits | All | Multi-step tasks requiring modification |

## Wiring Tasks

### Task 1: epost-planner — Use Explore for codebase analysis

**File**: `packages/core/agents/epost-planner.md`

Add instruction block to agent prompt:
```
## Codebase Analysis
When analyzing codebase for planning:
- Use the Explore subagent for fast file discovery and pattern scanning
- Reserve Grep/Glob for targeted lookups after Explore identifies areas of interest
- Explore is read-only and uses Haiku — fast and cheap for broad scanning
```

**Why**: Explore agent uses Haiku model, handles broad codebase scanning with lower token cost than running Grep/Glob chains in the planner context (which uses full model).

### Task 2: epost-debugger — Use Explore for investigation phase

**File**: `packages/core/agents/epost-debugger.md`

Add instruction block:
```
## Investigation Phase
When investigating bugs:
- Use the Explore subagent to scan related files and trace call chains
- Bring findings back into debugger context for root cause analysis
- Apply platform-specific debug skills after exploration narrows scope
```

**Why**: Debug investigation phase is primarily read-only. Offloading to Explore keeps debugger context clean for the actual fix.

### Task 3: epost-code-reviewer — Use Explore for context gathering

**File**: `packages/core/agents/epost-code-reviewer.md`

Add instruction block:
```
## Context Gathering
When reviewing code:
- Use the Explore subagent to understand surrounding code and dependencies
- Bring context back for quality assessment against platform conventions
```

### Task 4: epost-researcher — Use Explore for codebase portion

**File**: `packages/core/agents/epost-researcher.md`

Add instruction block:
```
## Internal Codebase Research
When researching involves codebase analysis:
- Use the Explore subagent for internal codebase scanning
- Reserve researcher context for external source synthesis and report generation
```

### Task 5: Document the wrapper pattern

**File**: `packages/core/skills/core/references/orchestration.md`

Add section documenting the hybrid wrapper pattern:
```
## Native Delegation Pattern
Custom agents are wrappers: native primitive (execution) + domain skills (knowledge).
- Explore: read-only codebase scanning (any agent doing investigation)
- Plan: pre-planning research (epost-planner during deep mode)
- general-purpose: multi-step isolated tasks (future, when skill injection stabilizes)
```

## NOT Doing (Deferred)

| Pattern | Why Deferred | Revisit |
|---------|-------------|---------|
| epost-planner calling Plan subagent | Plan agent designed for plan-mode context; benefit unclear for our structured phase output | Q2 2026 |
| epost-debugger using general-purpose | Skill injection into subagents still buggy (`context: fork` + `agent:` ignored) | Q2 2026 when stable |
| Parallel Plan + researcher | Coordination overhead vs benefit unclear; needs benchmarking | Q3 2026 |

## Related Code Files

### Files to Modify
- `packages/core/agents/epost-planner.md` — add Explore usage instruction
- `packages/core/agents/epost-debugger.md` — add Explore usage instruction
- `packages/core/agents/epost-code-reviewer.md` — add Explore usage instruction
- `packages/core/agents/epost-researcher.md` — add Explore usage instruction
- `packages/core/skills/core/references/orchestration.md` — document wrapper pattern

## Todo List
- [ ] Add Explore instruction to epost-planner
- [ ] Add Explore instruction to epost-debugger
- [ ] Add Explore instruction to epost-code-reviewer
- [ ] Add Explore instruction to epost-researcher
- [ ] Document wrapper pattern in orchestration.md
- [ ] Run epost-kit init and verify
- [ ] Spot-check: agents actually invoke Explore during tasks

## Success Criteria
- 4 agents updated with Explore delegation instructions
- Wrapper pattern documented in orchestration.md
- No workflow regressions
- Agents use Explore for broad scanning tasks (observable in practice)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Explore agent misses context planner needs | Low | Planner retains Grep/Glob as fallback |
| Over-delegation slows down simple tasks | Low | Instructions say "when analyzing codebase" — skip for small tasks |
| Agents ignore new instructions | Low | Monitor in practice; add to agent evaluation criteria |

## Security Considerations
- Explore is read-only — no risk of unintended modifications
