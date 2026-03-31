---
phase: 4
title: "Add error mutation discipline to error-recovery"
effort: 2h
depends: []
---

# Phase 4: Add Error Mutation Discipline to Error-Recovery

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/error-recovery/SKILL.md`
- `packages/core/skills/cook/references/fast-mode.md:46` — existing auto-escalation rule

## Overview
- Priority: P2
- Status: Pending
- Description: Current error-recovery has retry patterns but no requirement to change approach between retries. Add mutation discipline: on 2nd retry, MUST use a different strategy. On 3rd failure, escalate.

## Requirements
### Functional
- Add "Error Mutation Discipline" section to error-recovery SKILL.md
- Rule: retry attempt N+1 MUST differ from attempt N in at least one dimension:
  - Different algorithm/approach
  - Different scope (smaller/larger)
  - Different tool/dependency
  - Different error handling strategy
- Track retry attempts with brief log: `Attempt {N}: {approach} — {result}`
- After 2 failed different approaches: escalate to user with attempt log
- Integrate with cook fast-mode's existing "escalate after 2 failures" rule (make them consistent)

### Non-Functional
- No persistent storage needed (attempt tracking is per-session)
- Mutation log must be human-readable (not just "retry 1, retry 2")

## Files to Modify
- `packages/core/skills/error-recovery/SKILL.md` — Add new section after "Core Patterns" (~line 30)
- `packages/core/skills/cook/references/fast-mode.md:46` — Update auto-escalation to reference mutation discipline

## Files to Create
- None

## Implementation Steps
1. **Add "Error Mutation Discipline" section to error-recovery SKILL.md**
   ```markdown
   ### 4. Error Mutation Discipline

   **When**: Any retry after a failed approach (implementation, test fix, debug)

   **Rule**: Each retry MUST differ from the previous attempt.

   | Attempt | Requirement |
   |---------|------------|
   | 1st | Try primary approach |
   | 2nd | MUST change approach (different algorithm, scope, or tool) |
   | 3rd | Escalate to user with attempt log |

   **Mutation dimensions** (change at least one):
   - Algorithm: different data structure, pattern, or logic
   - Scope: narrower fix (isolate) or broader fix (refactor surrounding code)
   - Tool: different library, API, or technique
   - Strategy: different error handling (fail-fast vs. graceful vs. retry)

   **Attempt log format**:
   ```
   Attempt 1: {approach description} — FAILED: {error summary}
   Attempt 2: {different approach} — FAILED: {error summary}
   → Escalating: 2 different approaches failed. See attempt log above.
   ```

   **Anti-pattern**: Retrying the same approach with minor tweaks (e.g., changing a variable name). This is NOT a mutation.
   ```

2. **Update Decision Matrix** — Add row for "Implementation retry" with mutation discipline

3. **Update cook fast-mode.md auto-escalation** — Cross-reference error mutation:
   - Change line 46 from "If tests fail twice with different fixes attempted" to reference error-recovery mutation discipline explicitly

## Todo List
- [ ] Add Error Mutation Discipline section to error-recovery SKILL.md
- [ ] Update Decision Matrix table with implementation retry row
- [ ] Update cook fast-mode cross-reference
- [ ] Review: ensure cook and error-recovery rules are consistent (both say 2 attempts + escalate)

## Success Criteria
- Error-recovery SKILL.md has clear mutation requirement
- Attempt log format is defined and usable
- Cook fast-mode references error-recovery for retry policy (single source of truth)

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Agents ignore mutation discipline | Med | Make it an Iron Law (bolded) not a suggestion |
| "Different approach" too vague | Med | Explicit mutation dimensions table |

## Security Considerations
- None identified
