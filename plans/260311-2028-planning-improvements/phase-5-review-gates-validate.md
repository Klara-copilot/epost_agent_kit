---
phase: 5
title: "Enforce review gates + auto-validate trigger"
effort: 3h
depends: []
---

# Phase 5: Enforce Review Gates + Auto-Validate Trigger

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/subagent-driven-development/SKILL.md`
- `packages/core/skills/subagent-driven-development/references/spec-reviewer-prompt.md`
- `packages/core/skills/subagent-driven-development/references/code-quality-reviewer-prompt.md`
- `packages/core/skills/plan/SKILL.md`
- `packages/core/skills/plan/references/validate-mode.md`
- `packages/core/skills/plan/references/deep-mode.md`
- `packages/core/skills/plan/references/parallel-mode.md`

## Overview
- Priority: P1
- Status: Pending
- Description: Two improvements: (A) Make two-stage review gates in subagent-driven development non-skippable with explicit blocking language. (B) Auto-trigger validation questions after deep/parallel plan creation, before activation.

## Requirements

### A: Enforce Two-Stage Review Gates
- Add Iron Law statement: "Stage 2 (Quality) MUST NOT run until Stage 1 (Spec) passes"
- Add explicit gate check: spec reviewer must output PASS/FAIL verdict
- If spec reviewer outputs FAIL: go to fix loop, do NOT proceed to quality review
- Add "Never Do" section listing gate violations

### B: Auto-Validate After Deep/Parallel Plans
- After deep-mode.md or parallel-mode.md generates plan files, auto-run validate-mode
- Present 3-5 critical questions to user before activating plan
- If user declines validation: activate anyway (validation is recommended, not blocking)
- Fast mode is exempt (no auto-validate — speed is the point)

### Non-Functional
- Gate enforcement is documentation/instruction only (no runtime tooling)
- Validation adds ~2 minutes to deep/parallel planning

## Files to Modify
- `packages/core/skills/subagent-driven-development/SKILL.md` — Strengthen two-stage review section
- `packages/core/skills/subagent-driven-development/references/spec-reviewer-prompt.md` — Add PASS/FAIL verdict format
- `packages/core/skills/subagent-driven-development/references/code-quality-reviewer-prompt.md` — Add gate check at top
- `packages/core/skills/plan/SKILL.md` — Add auto-validate note to complexity routing
- `packages/core/skills/plan/references/deep-mode.md` — Add validation step before activation
- `packages/core/skills/plan/references/parallel-mode.md` — Add validation step before activation

## Files to Create
- None

## Implementation Steps

### Part A: Review Gate Enforcement

1. **Update subagent-driven-development SKILL.md Two-Stage Review section**
   - Add Iron Law block:
   ```
   **Iron Law**: Quality review (Stage 2) is BLOCKED until spec review (Stage 1) returns PASS.
   Never run both in parallel. Never skip Stage 1 for "simple" changes.
   ```
   - Add Never Do list:
   ```
   ## Never Do
   - Skip spec review for "obvious" implementations
   - Run quality review before spec review passes
   - Merge spec + quality into a single review pass
   - Accept "mostly passes" — spec review is binary PASS/FAIL
   ```

2. **Update spec-reviewer-prompt.md**
   - Add required verdict format at end of output:
   ```
   ## Verdict
   **PASS** or **FAIL**

   If FAIL: list each deviation as `- FAIL: {requirement} — {what's wrong} (file:line)`
   ```

3. **Update code-quality-reviewer-prompt.md**
   - Add gate check at top of prompt:
   ```
   ## Pre-Check (REQUIRED)
   Before reviewing code quality, verify spec review passed:
   - If no spec review result available: REFUSE to review. Output: "BLOCKED: Spec review must pass first."
   - If spec review FAILED: REFUSE to review. Output: "BLOCKED: Spec review failed. Fix spec deviations first."
   ```

### Part B: Auto-Validate After Deep/Parallel Plans

4. **Update plan SKILL.md** — After complexity auto-detection section, add:
   ```
   ## Auto-Validation
   After deep or parallel mode completes plan files:
   1. Auto-load `references/validate-mode.md`
   2. Generate 3-5 critical questions about the plan
   3. Present to user
   4. Document answers in plan.md Validation Summary
   5. Then activate plan

   Fast mode: skip validation (speed is the priority).
   User can skip: "Skip validation and activate" is always an option.
   ```

5. **Update deep-mode.md** — Add final step before activation:
   ```
   ### N. Validate Plan (auto-triggered)
   Run validate-mode questions before activating.
   If user skips: proceed to activation.
   ```

6. **Update parallel-mode.md** — Same addition as deep-mode.md

## Todo List
- [ ] Add Iron Law to subagent-driven-development SKILL.md
- [ ] Add Never Do section to subagent-driven-development SKILL.md
- [ ] Update spec-reviewer-prompt with PASS/FAIL verdict format
- [ ] Update code-quality-reviewer-prompt with gate pre-check
- [ ] Add Auto-Validation section to plan SKILL.md
- [ ] Add validate step to deep-mode.md
- [ ] Add validate step to parallel-mode.md

## Success Criteria
- Quality reviewer refuses to run when spec review hasn't passed
- Spec reviewer always outputs explicit PASS/FAIL
- Deep plan creation prompts user with validation questions before activation
- Fast plan skips validation entirely

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Gate enforcement is instruction-only, agents may skip | Med | Iron Law + Never Do list; same pattern used successfully in audit skill |
| Auto-validate slows deep planning | Low | User can skip; 3-5 questions take ~1 min |
| Validate questions are low-quality/generic | Med | Validate mode already has good question generation logic |

## Security Considerations
- None identified
