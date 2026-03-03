# Phase 02: Add Findings Persistence to Audit/Fix/Review

## Context Links
- Parent plan: [plan.md](./plan.md)
- `packages/a11y/skills/audit-a11y/SKILL.md`
- `packages/a11y/skills/fix-a11y/SKILL.md`
- `packages/a11y/skills/review-a11y/SKILL.md`
- `packages/a11y/assets/known-findings-schema.json`

## Overview
**Date**: 2026-03-03
**Priority**: P1
**Description**: Add findings persistence so audit/review auto-store new violations and fix updates finding status
**Implementation Status**: Pending

## Key Insights

Current workflow is broken:
```
audit-a11y  -> outputs JSON -> GONE (not stored)
review-a11y -> outputs JSON -> GONE (not stored)
fix-a11y    -> reads known-findings -> fixes code -> DOES NOT update status
audit-close -> only manual trigger to mark resolved
```

Target workflow:
```
audit-a11y  -> outputs JSON -> PERSISTS new findings to known-findings.json
review-a11y -> outputs JSON -> PERSISTS new findings to known-findings.json
fix-a11y    -> reads + fixes -> UPDATES status to "fix_applied: true"
audit-close -> marks resolved (unchanged, human verification step)
```

Key design decisions:
- Auto-persist should NOT auto-resolve — human must verify via `audit-close`
- New findings get auto-assigned IDs (max existing ID + 1)
- Dedup: match by `file_pattern` + `code_pattern` + `wcag` to avoid duplicates
- Fix should mark `fix_applied: true` (new field) but NOT `resolved: true` — close does that

## Requirements
### Functional
- audit-a11y: after outputting JSON, persist unmatched violations as new findings
- review-a11y: same persistence behavior as audit
- fix-a11y: after successful fix (status=FIXED), set `fix_applied: true` + `fix_applied_date` on finding
- Deduplication: skip persisting if finding with same `file_pattern` + `code_pattern` + `wcag` exists
- Auto-assign next available ID to new findings
- Create `known-findings.json` if it doesn't exist (using schema defaults)

### Non-Functional
- Persistence step must be clearly separated in skill instructions (not mixed with analysis)
- Schema backward-compatible (new optional fields only)

## Architecture

### Persistence Flow (audit/review)

```
[Analyze files] -> [Output JSON report]
                         |
                    [Load known-findings.json]
                         |
                    [For each violation in report]
                         |
                  [Match against existing findings]
                    /              \
              [matched]        [unmatched]
                  |                |
           [Set finding_id    [Create new finding]
            in output]         [Auto-assign ID]
                               [Set priority from severity]
                               [Append to critical_findings]
                         |
                    [Save known-findings.json]
                         |
                    [Report: "N new findings persisted, M matched existing"]
```

### Schema Changes

New optional fields on finding object:
```json
{
  "fix_applied": false,
  "fix_applied_date": null,
  "source": "audit|review|manual",
  "first_detected_date": "2026-03-03"
}
```

Severity -> priority mapping:
- critical -> priority 1
- serious -> priority 1
- moderate -> priority 2
- minor -> priority 3

## Related Code Files
### Modify
- `packages/a11y/skills/audit-a11y/SKILL.md` — add persistence step [OWNED]
- `packages/a11y/skills/review-a11y/SKILL.md` — add persistence step [OWNED]
- `packages/a11y/skills/fix-a11y/SKILL.md` — add fix_applied update step [OWNED]
- `packages/a11y/assets/known-findings-schema.json` — add new optional fields, bump version [OWNED]

### Read-Only
- `packages/a11y/skills/a11y/SKILL.md` — base skill reference
- `packages/a11y/skills/audit-close-a11y/SKILL.md` — close workflow reference

## Implementation Steps

### 1. Update schema (known-findings-schema.json)
- Bump version enum to include "1.3"
- Add optional fields to finding object:
  - `fix_applied` (boolean, default false)
  - `fix_applied_date` (string|null, format date)
  - `source` (string, enum: ["audit", "review", "manual"])
  - `first_detected_date` (string, format date)

### 2. Update audit-a11y SKILL.md
Add step 8 after current step 7:

```
8. **Persist new findings** — For each violation NOT matched to existing findings:
   a. Create finding object: map violation fields to schema
   b. Auto-assign ID: max(existing IDs) + 1
   c. Map severity to priority (critical/serious->1, moderate->2, minor->3)
   d. Set `source: "audit"`, `first_detected_date: today`
   e. Infer `file_pattern` from violation file path
   f. Infer `code_pattern` from violation context (if determinable, else null)
   g. Infer `fix_template` from violation type (use type->template mapping)
   h. Append to `critical_findings` array
   i. Save file
   j. Report: "Persisted N new findings (IDs: X, Y, Z)"
```

Add dedup rule:
```
Dedup: Finding exists if ALL match: wcag + file_pattern + code_pattern (when non-null)
If matched and resolved: flag as regression (existing behavior)
If matched and unresolved: skip, set finding_id in output
```

Add type->template mapping table:
```
missing_button_label -> add_button_label
missing_form_label -> add_form_label
missing_image_label -> (platform-specific)
missing_heading_trait -> add_heading_trait
focus_trap -> add_modal_focus_trap
missing_status_announcement -> add_status_announcement
* -> other_manual
```

### 3. Update review-a11y SKILL.md
Add same persistence step as audit (step 6 after current step 5). Use `source: "review"`.

### 4. Update fix-a11y SKILL.md
After step generating diff (for both single and batch modes), add:
```
- If status is FIXED:
  a. Load known-findings.json
  b. Find finding by ID
  c. Set `fix_applied: true`, `fix_applied_date: today`
  d. Save file
  e. Report: "Finding #{id} marked as fix_applied. Run /audit-close-a11y {id} after verification."
```

### 5. Add initialization logic
Add to audit-a11y and review-a11y:
```
If `.epost-data/a11y/known-findings.json` does not exist:
  Create with: { "version": "1.3", "audit_date": today, "critical_findings": [] }
  Create `.epost-data/a11y/` directory if needed
```

## Todo List
- [ ] Bump schema version, add new fields
- [ ] Add persistence step to audit-a11y
- [ ] Add persistence step to review-a11y
- [ ] Add fix_applied update to fix-a11y
- [ ] Add initialization logic for missing known-findings.json
- [ ] Add dedup rules
- [ ] Add severity->priority and type->template mapping tables

## Success Criteria
- Running `/audit-a11y` on code with violations creates entries in known-findings.json
- Running `/review-a11y` does the same
- Running `/fix-a11y #3` with successful fix sets `fix_applied: true` on finding #3
- Duplicate violations are not re-added
- Schema validates with new fields

## Risk Assessment
**Risks**: Auto-persistence could create low-quality findings (bad file_pattern, wrong fix_template)
**Mitigation**: Use `other_manual` as default template when uncertain; require human review via audit-close before marking resolved; `fix_applied` != `resolved`

## Security Considerations
- known-findings.json should be in `.gitignore` per data-store convention (project-specific data)
- No secrets involved

## Next Steps
After completion:
1. Run `epost-kit init` to regenerate `.claude/`
2. Test with `/audit-a11y ios` on a branch with known violations
3. Verify findings persisted correctly
4. Test `/fix-a11y #<new-id>` to verify fix_applied flow
