---
name: subagents-driven
description: "(ePost) Use when a plan has 3+ independent tasks or non-overlapping phases, or user says \"parallel implementation\", \"execute all phases\". Dispatches per-task subagents with two-stage review."
user-invocable: false

metadata:
  agent-affinity: [epost-project-manager, epost-fullstack-developer, epost-planner]
  keywords: [parallel, subagent, dispatch, implementation-loop, two-stage-review]
  platforms: [all]
  triggers:
    - parallel tasks
    - dispatch subagents
    - multi-task execution
    - execute all phases
  connections:
    enhances: [plan]
---

# Subagent-Driven Development

## When to Use

Activate when a plan has 3+ independent tasks that can be implemented and reviewed separately. Do NOT use for single-task or tightly-coupled work.

## Per-Task Loop

For each task in the plan:

1. **Dispatch Implementer** — Fresh subagent with task context (see `references/implementer-prompt.md`)
2. **Spec Review** — Fresh subagent verifies code matches spec (see `references/spec-reviewer-prompt.md`)
3. **Quality Review** — Fresh subagent reviews code quality (see `references/code-quality-reviewer-prompt.md`)
4. **Fix Loop** — If either review fails: fix → re-review (max 3 iterations)
5. **Mark Done** — Update plan TODO, move to next task

## Two-Stage Review

Every task gets TWO independent reviews, in strict order:

### Stage 1: Spec Compliance
- Does the code do what the spec says?
- Line-by-line comparison against requirements
- Output: ✅ matches / ❌ deviates / ⚠️ partial with file:line
- **Verdict**: PASS (all matched, 0 deviations, 0 partial) or FAIL

### Stage 2: Code Quality
- Is the code well-written?
- Security, performance, maintainability
- **Verdict**: PASS (no CRITICAL/HIGH) or FAIL

**Iron Law**: Quality review (Stage 2) is BLOCKED until spec review (Stage 1) returns PASS. Never run both in parallel. Never skip Stage 1 for "simple" changes.

## Never Do

- Skip spec review for "obvious" implementations
- Run quality review before spec review passes
- Merge spec + quality into a single review pass
- Accept "mostly passes" — spec review is binary PASS/FAIL
- Proceed to next task with either review in FAIL state

## Context Economics

**~15x token cost** over single-agent baseline — accept this only when work genuinely exceeds one context window or when file ownership isolation is required. Do NOT use for tasks that fit in a single context.

**Each subagent prompt MUST be minimal:** pass only files-to-modify, files-to-read, and acceptance criteria. Never pass full session history. Verbose prompts bloat the subagent's context immediately and reduce its effective working space.

## Rules

- Never start work on main/master without user consent
- Never skip either review stage — both MUST show PASS before task completion
- Never dispatch parallel implementation subagents (serial only — one task at a time)
- Each subagent gets a FRESH context (no stale state)
- Max 3 fix-review iterations per task; escalate to user after 3
- Implementer subagent MUST report files created/modified/read at end (artifact trail)

## Task Dispatch Order

1. Foundation tasks first (shared utilities, types, config)
2. Independent features in plan order
3. Integration tasks last (wire components together)

## Prompt Templates

- `references/implementer-prompt.md` — Task context and self-review checklist
- `references/spec-reviewer-prompt.md` — Skeptical spec comparison
- `references/code-quality-reviewer-prompt.md` — Quality review after spec passes

### Related Skills
- `verification-before-completion` — Verify each task before marking done
- `code-review` — Quality review patterns
- `plan` — Plan structure that feeds task dispatch
