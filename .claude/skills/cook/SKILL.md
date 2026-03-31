---
name: cook
description: (ePost) Use when user says "implement", "build", "add a feature", "cook", "make this work", or "continue the plan" — dispatches platform-aware feature implementation for web, iOS, Android, or backend
user-invocable: true
context: fork
agent: epost-fullstack-developer
metadata:
  argument-hint: "[feature description or plan file]"
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

## Step 0b — Active Plan Resolution (when plan found)

**If active plan exists**, resolve which phase to implement:

1. Read the plan's `status.md` FIRST (if it exists), then `plan.md`. Identify the first phase with `status: pending` and implement it — no need to ask the user what to do.

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
- Plan with 3+ independent tasks → consider subagent-driven mode (see `subagent-driven-development` skill)

## Execution

Route to the detected platform agent with feature description and platform context.

<feature>$ARGUMENTS</feature>

**IMPORTANT:** Analyze the skills catalog and activate the skills needed for the detected platform.
