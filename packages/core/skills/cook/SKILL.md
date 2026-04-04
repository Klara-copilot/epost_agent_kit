---
name: cook
description: (ePost) Orchestrates platform-aware feature implementation across web, iOS, Android, and backend. Use when user says "implement", "build", "add a feature", "cook", "make this work", or "continue the plan" — dispatches platform-aware feature implementation for web, iOS, Android, or backend
argument-hint: "[feature description or plan file]"
user-invocable: true
context: fork
agent: epost-fullstack-developer
metadata:
  keywords:
    - cook
    - implement
    - build
    - feature
    - continue-plan
  triggers:
    - /cook
    - implement this
    - build the feature
    - continue the plan
    - make this work
---

## Delegation — REQUIRED

This skill MUST run via `epost-fullstack-developer`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/cook`
- **Arguments**: `$ARGUMENTS` (full argument string from Skill invocation)
- If no arguments: state "no arguments — use auto-detection"

# Cook — Unified Implementation Command

Implement features with automatic platform detection.

## Step 0 — Planning Pre-Flight Check

**Before implementation, check for an active plan:**

1. Run: `node .claude/scripts/get-active-plan.cjs`
2. **If result ≠ `none`**: active plan found — proceed to Active Plan Resolution below.
3. **If result = `none`**: scan `plans/*/plan.md` for the most recently created plan with `status: pending`. Sort by directory name descending; take the first match. If found, run `node .claude/scripts/set-active-plan.cjs <plan-dir>` to activate it and proceed.
4. **If still nothing**: apply the gate below.

**Gate (when no plan exists):**

```
Stop. No active plan found.
Options:
  a) Run /plan first to create a plan
  b) Pass --no-gate to skip (for quick fixes / prototyping)
  c) Pass --plan <path> to specify a plan file explicitly
```

**Auto-skip gate when ANY of:**
- Task is clearly a bug fix with no design decisions
- `$ARGUMENTS` contains "quick fix", "just do it", or "no-gate"
- `--no-gate` flag is present
- `--plan <path>` flag is present

**Flags:**
| Flag | Behavior |
|------|---------|
| `--no-gate` | Bypass planning check; implement immediately |
| `--plan <path>` | Use specified plan file; bypass active-plan lookup |
| `--auto` | Auto-approve all gates when review finds 0 critical issues |

### Anti-Rationalization

Before bypassing the gate, verify you are NOT rationalizing with any of:

| Thought | Reality |
|---------|---------|
| "This is too simple to plan" | Simplicity is judged after design, not before |
| "I already know the solution" | Unknown unknowns exist — research confirms |
| "The user wants it fast" | Fast + broken costs more time than planned + correct |
| "The codebase is familiar" | Familiarity breeds assumption errors |
| "It's just a small change" | Small changes cause large regressions |
| "I'll fix it later" | Later never comes — design now |

If you caught yourself with any of the above: stop and run `/plan` first.

## Step 0b — Active Plan Resolution (when plan found)

**If active plan exists**, resolve which phase to implement:

1. Read the plan's `status.md` FIRST (if it exists), then `plan.md`. Identify the first phase with `status: pending` and implement it — no need to ask the user what to do.

## Step 0c — Artifact Consumption (Before Each Phase)

Before implementing a phase, check `.epost-cache/artifacts/` for prior outputs from the same plan:

1. List files matching `.epost-cache/artifacts/*-{plan-slug}*.json`
2. For each match: read the file and check `timestamp` field
3. If artifact is **< 24 hours old**: read `data` field and incorporate context (avoids re-discovering prior phase outputs)
4. If artifact is **>= 24 hours old** or missing: proceed without it — re-discovery will happen naturally

Log: "Loaded prior artifact: `.epost-cache/artifacts/{file}` ({age}h old)" or "No prior artifacts found for this plan."

See `core/references/artifact-persistence-protocol.md` for envelope format and reading instructions.

## Status Tracking

### On Resume
Read `{plan_dir}/status.md` FIRST to recover full context before reading plan.md.
status.md = current state (what happened). plan.md = spec (what to build).

### After Completing a Phase
If a workaround was needed during this phase (a tool, pattern, or convention that wasn't covered by loaded skills), note it in the journal entry "What almost went wrong" section with the skill name that should have caught it. This feeds the skill evolution pipeline.

Update `{plan_dir}/status.md`:
1. Progress table: change phase status to `Done`
2. Remove phase from **Not Yet Started** when it starts (change to `In Progress` in Progress table)
3. Add any significant design decisions to **Key Decisions**:
   `| {today} | {what was decided} | {why} |`
4. If implementation revealed architecture: update **Architecture Reference**

### After Discovering a Bug During Implementation
Add to `{plan_dir}/status.md` **Known Bugs**:
```
- {what is broken} — {steps to reproduce or context}
```
When fixed, move to **Recently Fixed**: `- {what was broken} — {how it was fixed}`

## Step 1 — Flag Override

If `$ARGUMENTS` starts with `--fast`: skip auto-detection, load `references/fast-mode.md` and execute directly. Remaining args are the task description.
If `$ARGUMENTS` starts with `--parallel`: skip auto-detection, load `references/parallel-mode.md` and execute directly. Remaining args are the task description.
If `$ARGUMENTS` contains `--auto`: set auto_approve=true — review gates auto-approve when 0 critical issues found.
Otherwise: continue to Platform Detection.

## Aspect Files

| File | Purpose |
|------|---------|
| `references/fast-mode.md` | Direct implementation — skip plan question, implement immediately |
| `references/parallel-mode.md` | Parallel implementation for multi-module features |

## Platform Detection

Detect platform per `skill-discovery` protocol.

## Complexity → Variant

- Single file or clear task → fast (skip plan question)
- Multi-file, one module → fast (batch checkpoints active for >3 file changes)
- Multi-module or unknowns → parallel
- Has existing plan in ./plans/ → follow plan
- Plan with 3+ independent tasks → consider subagent-driven mode (see `subagents-driven` skill)

## Execution

Route to the detected platform agent with feature description and platform context.

<feature>$ARGUMENTS</feature>

**IMPORTANT:** Analyze the skills catalog and activate the skills needed for the detected platform.
