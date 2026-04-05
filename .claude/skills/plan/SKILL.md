---
name: plan
description: (ePost) Produces phased implementation plans scaled to task complexity with dependency tracking. Use when user says "plan", "design this", "architect", "spec out", "how should we build", or "create a roadmap" — produces a phased implementation plan scaled to task complexity
argument-hint: "[feature or task description]"
user-invocable: true
context: fork
agent: epost-planner
metadata:
  agent-affinity:
    - epost-planner
    - epost-project-manager
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

## Delegation — REQUIRED

This skill MUST run via `epost-planner`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/plan`
- **Arguments**: `$ARGUMENTS` (full argument string from Skill invocation)
- If no arguments: state "no arguments — use auto-detection"

Create implementation plans with automatic complexity detection.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--fast`: skip auto-detection, load `references/fast-mode.md` and execute.
If `$ARGUMENTS` starts with `--deep`: skip auto-detection, load `references/deep-mode.md` and execute.
If `$ARGUMENTS` starts with `--parallel`: skip auto-detection, load `references/parallel-mode.md` and execute.
If `$ARGUMENTS` starts with `--validate`: skip auto-detection, load `references/validate-mode.md` and execute.
If `$ARGUMENTS` starts with `--predict`: load `references/predict-mode.md`, run 3-persona debate, then continue to Complexity Auto-Detection.
Otherwise: continue to Complexity Auto-Detection.

## Complexity Auto-Detection

1. **Simple** (1 module, clear scope, < 5 files) → load `references/fast-mode.md`
2. **Moderate** (multiple files, some research needed) → load `references/deep-mode.md`
3. **Complex** (multi-module, cross-platform, needs dependency mapping) → load `references/parallel-mode.md`

Heuristics: Single sentence → `:fast` | mentions "research" → `:deep` | multiple platforms/modules → `:parallel` | mentions "dependencies" or "phases" → `:parallel` | unsure → `:fast`, escalate if needed

## Plan Output Contract

Every plan is a **directory** with a `plan.md` overview and one phase file per phase:

```
plans/{YYMMDD-HHMM-slug}/
  plan.md                    — overview, phases table with file links, success criteria
  phase-{N}-{slug}.md        — tasks, files to change, validation per phase
```

**plan.md required frontmatter fields**: `title`, `status`, `created`, `updated`, `effort`, `phases`, `platforms`, `breaking`, `blocks`, `blockedBy`

**phase file required frontmatter fields**: `phase`, `title`, `effort`, `depends`

**Phases table** must link to phase files. Each phase must declare file ownership (no overlap across parallel phases).

## Plan Lifecycle

```
draft → active → completed → archived
```

**MANDATORY final step** — after writing all plan files, run:
```bash
node .claude/scripts/set-active-plan.cjs plans/{slug}
```
This stamps `status: active` and registers the plan so `/cook` picks it up automatically. Do NOT skip.

## Auto-Validation

After deep or parallel mode completes plan files (before activation):
1. Auto-load `references/validate-mode.md`
2. Generate 3-5 critical questions about the plan
3. Present to user and document answers in `plan.md` under `## Validation Summary`
4. Then activate plan

Fast mode: skip validation. User can always skip: "Skip validation and activate".

## State Machine Modeling

When feature involves stateful behavior (UI flows, protocols, async state), generate ASCII state diagram BEFORE coding. List all states, map every transition, identify terminal states and dead ends.

Use when: auth flows, checkout/payment, form wizards, real-time sync, connection management, retry logic.
Skip for: simple CRUD, stateless utilities, pure transforms.

## --predict Mode

Auto-trigger when: 3+ interacting systems change, public API contract modified, migration/breaking change in scope, or user expresses uncertainty.

See `references/predict-mode.md` for the full 3-persona debate protocol.

## Mode Reference

| Flag | Reference | When |
|------|-----------|------|
| `--fast` | `references/fast-mode.md` | Quick lightweight plan |
| `--deep` | `references/deep-mode.md` | Thorough multi-phase with research |
| `--parallel` | `references/parallel-mode.md` | Parallelizable phases with ownership matrix |
| `--validate` | `references/validate-mode.md` | Validate existing plan |
| `--predict` | `references/predict-mode.md` | 3-persona expert debate before major changes |

## References

- `references/plan-templates.md` — example plan.md with full YAML frontmatter, example phase file with all sections filled in, sample success criteria patterns, common constraint patterns, cross-plan dependency detection steps, lifecycle script reference
- `references/fast-mode.md` — quick plan from codebase analysis only, no research
- `references/deep-mode.md` — deep plan with sequential research and comprehensive analysis
- `references/parallel-mode.md` — dependency-aware plan with file ownership matrix for parallel execution
- `references/validate-mode.md` — validate plan with critical questions interview
- `references/predict-mode.md` — 3-persona debate protocol and output format
- `references/state-machine-guide.md` — state machine notation, patterns, and validation checklist
- `references/planning-flow.dot` — planning flow diagram

<request>$ARGUMENTS</request>
<platform>{{detected_platform or "none"}}</platform>

**IMPORTANT:** Analyze the skills catalog and activate needed skills.
