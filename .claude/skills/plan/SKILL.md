---
name: plan
description: "(ePost) Create implementation plan — auto-detects complexity"
user-invocable: true
context: fork
agent: epost-architect
metadata:
  argument-hint: "[feature or task description]"
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
    enhances: []
  triggers:
    - /plan
    - create plan
    - implementation plan
---

# Plan — Unified Planning Command

Create implementation plans with automatic complexity detection.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--fast`: skip auto-detection, load `references/fast-mode.md` and execute. Remaining args are the task description.
If `$ARGUMENTS` starts with `--deep`: skip auto-detection, load `references/deep-mode.md` and execute.
If `$ARGUMENTS` starts with `--parallel`: skip auto-detection, load `references/parallel-mode.md` and execute.
If `$ARGUMENTS` starts with `--validate`: skip auto-detection, load `references/validate-mode.md` and execute.
Otherwise: continue to Complexity Auto-Detection.

## Aspect Files

| File | Purpose |
|------|---------|
| `references/fast-mode.md` | Quick plan from codebase analysis only, no research |
| `references/deep-mode.md` | Deep plan with sequential research and comprehensive analysis |
| `references/parallel-mode.md` | Dependency-aware plan with file ownership matrix for parallel execution |
| `references/validate-mode.md` | Validate plan with critical questions interview |
| `references/state-machine-guide.md` | State machine notation, patterns, and validation checklist |
| `references/planning-flow.dot` | Planning flow diagram |

## Complexity Auto-Detection

1. **Simple** (1 module, clear scope, < 5 files) → load `references/fast-mode.md`
2. **Moderate** (multiple files, some research needed) → load `references/deep-mode.md`
3. **Complex** (multi-module, cross-platform, needs dependency mapping) → load `references/parallel-mode.md`

## Platform Detection

Detect platform per `skill-discovery` protocol. Pass detected platform as context to the selected variant.

## Heuristics

- Single sentence request → `:fast`
- Request mentions "research" or "investigate" → `:deep`
- Request mentions multiple platforms or modules → `:parallel`
- Request mentions "dependencies" or "phases" → `:parallel`
- If unsure → default to `:fast`, escalate if needed

## Planning Expertise

| Area | Key Activities |
|------|---------------|
| Requirements | Clarify ambiguity, extract functional + non-functional, identify edge cases |
| Task Breakdown | Decompose, order by dependency, estimate complexity |
| Dependencies | External packages, internal code, blockers, parallel opportunities |
| Risk Assessment | Technical/timeline/resource risks, mitigation strategies |
| Resource Estimation | Time per task, complexity levels, testing overhead |
| Timeline | Critical path, milestones, buffer allocation |

## Planning Framework

1. **Understand** — Clarify requirements
2. **Decompose** — Break into smaller tasks
3. **Sequence** — Order by dependency
4. **Estimate** — Time/complexity per task
5. **Identify** — Potential blockers
6. **Document** — Create structured plan

## State Machine Modeling

When feature involves stateful behavior (UI flows, protocols, async state, workflows), generate ASCII state diagram BEFORE coding:

1. List all states (including error, timeout, edge states)
2. Map every transition (trigger + guard conditions)
3. Identify terminal states and dead ends
4. Mark states where data is mutated

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

Use when: auth flows, checkout/payment, form wizards, real-time sync, connection management, retry logic.
Skip for: simple CRUD, stateless utilities, pure transforms.
See `references/state-machine-guide.md` for notation, patterns, and validation checklist.

## Mental Models

| Model | Application |
|-------|-------------|
| Decomposition | Start with user value, work backward. Tree structure, estimate leaves, sum parents. |
| 80/20 | 20% of work → 80% of value. Sequence high-value tasks first. |
| Risk Management | High-risk tasks early, external dependencies first, unknowns before knowns. |

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

Use `knowledge-retrieval` to consult prior decisions before planning. Use `knowledge-capture` to persist learnings after.

## Mode Reference

| Flag | Reference | When |
|------|-----------|------|
| `--fast` | `references/fast-mode.md` | Quick lightweight plan |
| `--deep` | `references/deep-mode.md` | Thorough multi-phase with research |
| `--parallel` | `references/parallel-mode.md` | Parallelizable phases with ownership matrix |
| `--validate` | `references/validate-mode.md` | Validate existing plan |

<request>$ARGUMENTS</request>
<platform>{{detected_platform or "none"}}</platform>

**IMPORTANT:** Analyze the skills catalog and activate needed skills.
