---
phase: 6
title: "Auto Re-Audit after fix"
effort: 2h
depends: [3]
---

# Phase 6: Auto Re-Audit After Fix

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/fix/references/ui-mode.md` — current fix-ui flow
- `packages/core/skills/audit/SKILL.md` — audit skill
- `packages/core/skills/audit/references/ui-workflow.md` — UI audit workflow

## Overview
- Priority: P2
- Status: Pending
- Effort: 2h
- Description: After `/fix --ui` applies fixes, automatically run a targeted re-audit on the changed files to verify the fix resolved the finding. Update known-findings DB with verification result.

## Requirements
### Functional
- After fix-ui step 7 (apply fixes), add step 7.5: targeted re-audit
- Re-audit scope: only the files that were modified by the fix
- Re-audit checks only the specific rule(s) that were violated (not full audit)
- Update known-findings DB: `verified: true/false`, `verified_date`
- Output: "Re-audit: 3/3 findings resolved" or "Re-audit: 2/3 resolved, 1 still failing (RULE-001)"

### Non-Functional
- Re-audit is fast (< 30s) — scoped to specific files + rules
- User can skip with `--no-verify` flag
- No new agent dispatch — re-audit runs in same muji context

## Related Code Files
### Files to Modify
- `packages/core/skills/fix/references/ui-mode.md:46-49` — steps 7-10
  - Insert step 7.5 after step 7 (apply fixes)
  - Step 7.5: Re-dispatch epost-muji with targeted audit scope
  - Step 8 update: also set `verified: true/false` based on re-audit result
  - Step 10 update: if re-audit passes, auto-suggest `--close` instead of manual verification
- `packages/core/skills/audit/references/ui-findings-schema.md` — add `verified` and `verified_date` fields to schema

### Files to Create
- None (all changes are additions to existing files)

### Files to Delete
- None

## Implementation Steps
1. **Update ui-findings-schema.md** — add fields:
   ```json
   "verified": false,
   "verified_date": null
   ```
2. **Update ui-mode.md** — insert step 7.5:
   ```
   7.5. **Targeted Re-Audit** (unless `--no-verify`):
     - Collect files changed in step 7
     - Collect rule IDs from the applied findings
     - Dispatch epost-muji via Agent tool with:
       - Mode: verify (check specific rules only)
       - Files: only changed files
       - Rules: only violated rule IDs
     - Parse result: for each finding, set `verified: true` if rule passes, `false` if still failing
   ```
3. **Update step 8** — add verification fields to DB update:
   ```
   Set `verified: true/false`, `verified_date: today` for each applied finding
   ```
4. **Update step 10** — conditional suggestion:
   ```
   If all verified=true: "All findings resolved. Run `/audit --close --ui` to close them."
   If some verified=false: "N findings still failing. Review and re-fix, or run `/fix --ui {component} --top N`"
   ```
5. **Add `--no-verify` flag** to ui-mode.md Step 0:
   ```
   If $ARGUMENTS contains --no-verify: skip step 7.5 (no re-audit after fix)
   ```

## Todo List
- [ ] Add verified/verified_date to findings schema
- [ ] Insert step 7.5 in ui-mode.md
- [ ] Update step 8 with verification fields
- [ ] Update step 10 with conditional suggestion
- [ ] Add --no-verify flag support
- [ ] Document verify mode for muji dispatch

## Success Criteria
- After `/fix --ui EpostButton`, a targeted re-audit runs automatically
- Re-audit output shows pass/fail per finding
- Known-findings DB updated with `verified` status
- `--no-verify` skips the re-audit step

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Re-audit takes too long | Med | Scope to specific files + rules only |
| Muji dispatch overhead | Low | Single focused dispatch, not full audit |
| Verify mode not yet in muji | Med | Define verify mode as subset of audit (files + rules filter) |

## Security Considerations
- None identified

## Next Steps
- Consider extending auto re-audit to `/fix --a11y` flow as well
