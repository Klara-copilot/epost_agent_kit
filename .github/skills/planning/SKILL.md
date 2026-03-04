---
name: planning
description: Use when user asks to plan, design, architect, spec out, or create an implementation roadmap
user-invokable: false
tier: core
context: fork
agent: epost-architect

metadata:
  agent-affinity:
    - epost-architect
    - epost-orchestrator
  keywords:
    - plan
    - planning
    - requirements
    - tasks
    - estimation
    - roadmap
    - design
    - spec
    - architecture
    - blueprint
  platforms:
    - all
  connections:
    enhances: [plan, plan-fast, plan-deep, plan-parallel, plan-validate]
  triggers:
    - /plan
    - create plan
    - implementation plan
---

# Planning Skill

## Purpose
Transform requirements into actionable plans.

## When Active
User uses /plan, asks for implementation plan.

## Expertise

### Requirements Analysis
- Clarify ambiguous requirements
- Identify edge cases
- Extract functional requirements
- Extract non-functional requirements

### Task Breakdown
- Decompose features into tasks
- Identify subtasks
- Estimate complexity
- Order by dependency

### Dependency Identification
- External dependencies (packages, APIs)
- Internal dependencies (existing code)
- Blocking issues
- Parallel opportunities

### Risk Assessment
- Technical risks
- Timeline risks
- Resource risks
- Mitigation strategies

### Resource Estimation
- Time estimates per task
- Complexity levels (simple, medium, complex)
- Developer hours
- Testing overhead

### Timeline Planning
- Critical path identification
- Milestone definition
- Buffer allocation
- Sprint planning

## Planning Framework

1. **Understand**: Clarify requirements
2. **Decompose**: Break into smaller tasks
3. **Sequence**: Order tasks by dependency
4. **Estimate**: Time/complexity per task
5. **Identify**: Potential blockers
6. **Document**: Create structured plan

### State Machine Modeling

When the feature involves **stateful behavior** (UI flows, protocols, async state, workflows), generate an ASCII state diagram BEFORE coding:

1. List all states — including error, timeout, and edge states
2. Map every transition — what triggers it, what guard conditions exist
3. Identify terminal states and dead ends
4. Mark states where data is mutated

Include the diagram in the plan under the Architecture section:
```
[INITIAL] ──(event)──▸ [STATE_A]
    │                      │
    │                  (condition)
    │                      ▼
    │               [STATE_B] ──(error)──▸ [ERROR]
    │                      │
    │                  (success)
    │                      ▼
    └──────────────▸ ◉ [DONE]
```

**Validate completeness:**
- Every state has ≥1 exit transition (no orphan states)
- Every state reachable from INITIAL
- Error states explicitly handled (not silently swallowed)
- Guard conditions exhaustive (what happens when no guard matches?)

Use when: auth flows, checkout/payment, form wizards, real-time sync, connection management, retry logic. Skip for: simple CRUD, stateless utilities, pure transforms.

See `references/state-machine-guide.md` for notation, patterns, and checklist.

## Output Format

```markdown
# Plan: [Feature]

## Overview
[Summary]

## Tasks
1. [Task] - [Estimate]
2. [Task] - [Estimate]

## Dependencies
- [External dependency]
- [Internal dependency]

## Risks
- [Potential risk] - [Mitigation]

## Success Criteria
- [Criteria 1]
- [Criteria 2]
```

## Mental Models

### Decomposition
- Start with user value, work backward to code
- Identify system boundaries
- Use tree structure (parent → child tasks)
- Estimate leaves, sum parents

### 80/20 Principle
- Identify 20% of work that delivers 80% of value
- Sequence high-value tasks first
- Defer "nice to have" to future phases

### Risk Management
- High-risk tasks early (reduce timeline risk)
- External dependencies first (reduce blocking)
- Unknown work before known (reduce surprise)

## Best Practices
- Be specific about files to create/modify
- Include database migrations if needed
- Note breaking changes
- Consider testing strategy
- Think about documentation updates
- Always create YAML frontmatter with all required fields
- Link phases with dependencies clearly
- Estimate conservatively, track actuals
- Mark file ownership for parallel execution safety
- Use Parallelization Info section only for `/plan-parallel` variant

Use `knowledge-retrieval` skill to consult prior decisions before planning. Use `knowledge-capture` skill to persist learnings after this task.

## Sub-Skill Routing

When this skill is active and user intent matches a sub-skill, delegate:

| Intent | Sub-Skill | When |
|--------|-----------|------|
| Create plan | `plan` | `/plan`, "plan this feature" |
| Fast plan | `plan-fast` | `/plan-fast`, quick lightweight plan |
| Deep plan | `plan-deep` | `/plan-deep`, thorough multi-phase |
| Parallel plan | `plan-parallel` | `/plan-parallel`, parallelizable phases |
| Validate plan | `plan-validate` | `/plan-validate`, verify existing plan |

### Related Skills
- `knowledge-retrieval` — Internal-first search protocol
- `knowledge-base` — ADR and decision storage
