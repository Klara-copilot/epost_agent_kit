---
phase: 3
title: "Add batch checkpoints to cook execution"
effort: 2h
depends: []
---

# Phase 3: Add Batch Checkpoints to Cook Execution

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/cook/references/fast-mode.md`
- `packages/core/skills/cook/SKILL.md`

## Overview
- Priority: P1
- Status: Pending
- Description: Long cook sessions modify many files without pausing to verify progress. Add a checkpoint pattern: after every 3 file modifications, pause and self-check before continuing.

## Requirements
### Functional
- After every 3 file create/modify operations, run a self-check:
  1. Type check / lint the changed files
  2. Verify each file still compiles in context
  3. Log checkpoint: "Checkpoint N: files A, B, C — OK/FAIL"
- If checkpoint FAILS: fix before continuing (do not accumulate broken state)
- Checkpoint counter resets per phase (not per session)

### Non-Functional
- Self-check should take <15 seconds per checkpoint
- No user interaction required (self-check, not user feedback)
- Checkpoint log visible in output (not hidden)

## Files to Modify
- `packages/core/skills/cook/references/fast-mode.md:20-27` — Add checkpoint rule to Step 2 (Implement)
- `packages/core/skills/cook/SKILL.md:43-49` — Add checkpoint note to Complexity section

## Files to Create
- None

## Implementation Steps
1. **Add Batch Checkpoint Rule to cook fast-mode.md Step 2**
   ```
   ### Checkpoint Protocol (during Step 2)
   After every 3 file modifications (create or edit):
   1. Run type check on modified files
   2. Run lint on modified files
   3. If pass: log "Checkpoint {N}: {file1}, {file2}, {file3} — PASS" and continue
   4. If fail: fix immediately before modifying next file

   Exception: documentation-only changes (.md files) skip checkpoints.
   ```

2. **Add checkpoint mention to SKILL.md complexity section**
   - Under "Multi-file, one module -> fast": add note "batch checkpoints active for >3 file changes"

3. **Add checkpoint to subagent-driven implementer prompt**
   - `packages/core/skills/subagent-driven-development/references/implementer-prompt.md`
   - Add to self-review checklist: "All batch checkpoints passed (if >3 files changed)"

## Todo List
- [ ] Add checkpoint protocol to cook fast-mode.md
- [ ] Update SKILL.md complexity section
- [ ] Update implementer prompt template
- [ ] Test: implement a 5+ file change, verify checkpoint fires after file 3

## Success Criteria
- Cook session with 6 file changes produces 2 checkpoint logs
- Failed checkpoint is fixed before continuing
- Single-file changes never trigger checkpoints

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Checkpoints break flow on large changes | Med | Exception for .md files; checkpoint is self-check not user-block |
| Type check unavailable for some platforms | Low | Fall back to lint-only if no type checker configured |

## Security Considerations
- None identified
