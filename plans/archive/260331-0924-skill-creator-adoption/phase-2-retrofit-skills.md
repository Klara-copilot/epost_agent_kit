---
phase: 2
title: "Retrofit 3 Skills with Evals + Theory-of-Mind"
effort: 1.5h
depends: [1]
---

# Phase 2: Retrofit 3 Skills with Evals + Theory-of-Mind

## Context Links
- [Plan](./plan.md)
- [Phase 1](./phase-1-eval-infrastructure.md)
- `packages/core/skills/plan/SKILL.md` (238 lines)
- `packages/core/skills/debug/SKILL.md` (240 lines)
- `packages/core/skills/code-review/SKILL.md` (168 lines)

## Overview
- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Add evals.json to plan, debug, code-review skills. Apply theory-of-mind instruction phrasing to each.

## Requirements
### Functional
- Each skill gets `evals/evals.json` with 3 realistic test cases
- Each skill gets theory-of-mind instruction phrasing (replace rigid rules with "because" explanations)
- All skills remain under 500-line progressive disclosure cap

### Non-Functional
- Theory-of-mind changes must NOT alter observable behavior — only instruction phrasing
- Evals must be realistic scenarios, not toy examples

## Related Code Files
### Files to Create
- `packages/core/skills/plan/evals/evals.json` — 3 plan skill eval cases
- `packages/core/skills/debug/evals/evals.json` — 3 debug skill eval cases
- `packages/core/skills/code-review/evals/evals.json` — 3 code-review skill eval cases

### Files to Modify
- `packages/core/skills/plan/SKILL.md` — theory-of-mind phrasing pass
- `packages/core/skills/debug/SKILL.md` — theory-of-mind phrasing pass
- `packages/core/skills/code-review/SKILL.md` — theory-of-mind phrasing pass

## Implementation Steps

1. **Plan skill evals** (`packages/core/skills/plan/evals/evals.json`)
   - Eval 1: "Plan a new REST endpoint" — expectations: has phases table, has file paths, has success criteria
   - Eval 2: "Plan a multi-platform feature" — expectations: detects cross-platform, has platform section, mentions dependency order
   - Eval 3: "Plan a simple bug fix" — expectations: uses fast mode, plan < 80 lines, no research phase

2. **Debug skill evals** (`packages/core/skills/debug/evals/evals.json`)
   - Eval 1: "TypeError: Cannot read property of undefined" — expectations: identifies variable name, suggests null check, reads relevant file
   - Eval 2: "Build fails with module not found" — expectations: checks import path, suggests install or path fix
   - Eval 3: "Component renders but state doesn't update" — expectations: checks state mutation pattern, looks for useEffect deps

3. **Code-review skill evals** (`packages/core/skills/code-review/evals/evals.json`)
   - Eval 1: Review a component with missing error handling — expectations: flags missing try/catch, suggests error boundary
   - Eval 2: Review code with unused imports — expectations: identifies dead code, suggests removal
   - Eval 3: Review API route without input validation — expectations: flags security issue, suggests validation

4. **Theory-of-mind pass on plan/SKILL.md**
   - Scan for MUST/ALWAYS/NEVER that lack rationale
   - Convert: "MUST include phases table" -> "Include a phases table because cook/implement agents parse it to determine execution order"
   - Keep rigid rules for: frontmatter requirements (tooling depends on them), file path conventions (scripts depend on them)

5. **Theory-of-mind pass on debug/SKILL.md**
   - Convert: "ALWAYS read the file before diagnosing" -> "Read the file before diagnosing because stack traces often mislead about the actual error location"
   - Keep rigid: safety constraints (don't modify production data during debug)

6. **Theory-of-mind pass on code-review/SKILL.md**
   - Convert: "NEVER approve without checking tests" -> "Check tests before approving because untested code frequently regresses within days"
   - Keep rigid: security review requirements

7. **Run evals** for each skill
   - `node packages/core/scripts/run-skill-eval.cjs packages/core/skills/plan`
   - `node packages/core/scripts/run-skill-eval.cjs packages/core/skills/debug`
   - `node packages/core/scripts/run-skill-eval.cjs packages/core/skills/code-review`
   - All should pass (evals match expected_output by design in this initial set)

## Todo List
- [ ] Create plan evals/evals.json (3 cases)
- [ ] Create debug evals/evals.json (3 cases)
- [ ] Create code-review evals/evals.json (3 cases)
- [ ] Theory-of-mind pass on plan/SKILL.md
- [ ] Theory-of-mind pass on debug/SKILL.md
- [ ] Theory-of-mind pass on code-review/SKILL.md
- [ ] Run eval script on all 3, verify pass

## Success Criteria
- All 3 skills have evals/evals.json with 3+ cases each
- `run-skill-eval.cjs` reports 100% pass on all 3
- No behavioral changes in skill instructions (only phrasing)
- All 3 SKILL.md files remain under 500 lines

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Theory-of-mind changes accidentally alter behavior | High | Diff review before commit; keep security/safety rules rigid |
| Evals too easy (always pass) | Med | Include at least 1 "tricky" case per skill that tests edge behavior |

## Security Considerations
- None — eval files are JSON data, no executable code

## Next Steps
- Phase 3 adds trigger evals for description optimization
