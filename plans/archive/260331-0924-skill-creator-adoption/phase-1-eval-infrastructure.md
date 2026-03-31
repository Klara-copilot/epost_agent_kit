---
phase: 1
title: "Eval Infrastructure + Skill-Creator Skill"
effort: 1.5h
depends: []
---

# Phase 1: Eval Infrastructure + Skill-Creator Skill

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/` — existing skills directory
- `packages/core/scripts/` — existing scripts directory
- `packages/core/package.yaml` — skill registration

## Overview
- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Create the skill-creator skill and the deterministic eval runner script

## Requirements
### Functional
- `skill-creator` skill with SKILL.md, 3 reference files
- `run-skill-eval.cjs` script that reads `evals/evals.json`, grades assertions, writes `evals/benchmark.json`

### Non-Functional
- SKILL.md < 500 lines (progressive disclosure cap)
- Script is pure CJS, no external deps, no LLM calls
- Idempotent: re-running eval produces same benchmark

## Related Code Files
### Files to Create
- `packages/core/skills/skill-creator/SKILL.md` — Main skill file: when to use, 3-stage workflow overview, aspect table
- `packages/core/skills/skill-creator/references/eval-schema.md` — JSON schemas for `evals.json`, `benchmark.json`, `grading.json`, `trigger-evals.json`
- `packages/core/skills/skill-creator/references/workflow.md` — 3-stage loop: Draft (write skill) -> Test (run evals) -> Refine (fix failures, iterate)
- `packages/core/skills/skill-creator/references/theory-of-mind.md` — Instruction writing guide: replace MUST/ALWAYS/NEVER with "because [reason]" explanations
- `packages/core/scripts/run-skill-eval.cjs` — Deterministic eval runner

### Files to Modify
- None in this phase (registration happens in Phase 4)

## Implementation Steps

1. **Create `skill-creator/SKILL.md`**
   - Frontmatter: `name: skill-creator`, `user-invocable: true`, `context: fork`, `agent: epost-code-reviewer`
   - Description: trigger on "create evals", "test this skill", "measure skill quality", "benchmark skill", "optimize description"
   - Body sections: When to Use, 3-Stage Workflow (summary table), Eval Structure, Theory-of-Mind Basics, Aspect Files table
   - Keep body under 150 lines — detail goes to references/

2. **Create `references/eval-schema.md`**
   - `evals.json` schema: `{ evals: [{ id, prompt, expected_output, expectations: [{ description, assertion_type, expected_value }] }] }`
   - `benchmark.json` schema: `{ skill, timestamp, runs: [{ eval_id, pass_rate, assertions_passed, assertions_total, notes }], summary: { total_pass_rate } }`
   - `trigger-evals.json` schema: `{ skill, queries: [{ prompt, should_trigger: boolean, reason }] }`
   - Include 1 concrete example per schema

3. **Create `references/workflow.md`**
   - Stage 1 — Draft: write SKILL.md, follow progressive disclosure, use theory-of-mind
   - Stage 2 — Test: create evals/evals.json, run `node .claude/scripts/run-skill-eval.cjs <skill-dir>`, review benchmark.json
   - Stage 3 — Refine: fix failing assertions, adjust instructions, re-run (max 5 iterations)
   - Include flowchart (ASCII)

4. **Create `references/theory-of-mind.md`**
   - Problem: rigid MUST/ALWAYS/NEVER overfits to specific cases, breaks on edge cases
   - Solution: "because [reason]" explanations — model generalizes from rationale
   - Before/After examples (3 pairs from real epost skills)
   - When rigid rules ARE appropriate: security constraints, destructive operations
   - Checklist: 5 items to review when editing skill instructions

5. **Create `run-skill-eval.cjs`**
   - Usage: `node .claude/scripts/run-skill-eval.cjs <path-to-skill-dir>`
   - Reads `<skill-dir>/evals/evals.json`
   - For each eval: checks expectations against expected_output using assertion_type (contains, equals, regex, not_contains)
   - Writes `<skill-dir>/evals/benchmark.json` with pass rates
   - Exits 0 if all pass, 1 if any fail
   - Console output: summary table (eval_id | pass | fail | rate)

## Todo List
- [ ] Create `packages/core/skills/skill-creator/SKILL.md`
- [ ] Create `packages/core/skills/skill-creator/references/eval-schema.md`
- [ ] Create `packages/core/skills/skill-creator/references/workflow.md`
- [ ] Create `packages/core/skills/skill-creator/references/theory-of-mind.md`
- [ ] Create `packages/core/scripts/run-skill-eval.cjs`
- [ ] Verify script runs on a dummy evals.json

## Success Criteria
- `node packages/core/scripts/run-skill-eval.cjs <test-dir>` runs without error on sample data
- SKILL.md body < 150 lines
- All 3 reference files have concrete examples

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Schema too rigid for future needs | Med | Keep schemas extensible (allow extra fields) |
| Script assertion types insufficient | Low | Start with 4 types (contains, equals, regex, not_contains), add more later |

## Security Considerations
- Script reads/writes only within the specified skill directory — no escalation risk
- No network calls, no LLM calls

## Next Steps
- Phase 2 uses this infrastructure to eval 3 skills
