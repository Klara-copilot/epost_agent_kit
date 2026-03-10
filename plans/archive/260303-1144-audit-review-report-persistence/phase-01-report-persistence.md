# Phase 01: Add Report Persistence

## Context Links
- Parent plan: [plan.md](./plan.md)
- `packages/core/skills/review-code/SKILL.md`
- `packages/a11y/skills/audit-a11y/SKILL.md`
- `packages/a11y/skills/review-a11y/SKILL.md`

## Overview
**Date**: 2026-03-03
**Priority**: P2
**Description**: Add a "save report" step to review-code, audit-a11y, review-a11y
**Implementation Status**: Pending

## Key Insights

- `.epost-data/` is the project-local data store (gitignored per data-store convention)
- `plans/reports/` is for subagent reports (different purpose: agent handoff artifacts)
- `.epost-data/reports/` is the right home for command output persistence
- Timestamp format `YYMMDD-HHMM` matches existing naming conventions
- audit-ui already has its own per-component persistence — no change needed
- review-improvements already writes to docs/summaries/ — no change needed

## Requirements
### Functional
- Each command writes its final output to `.epost-data/reports/<command>-YYMMDD-HHMM.<ext>`
- Create `.epost-data/reports/` directory if missing
- Report content = same as what's shown inline (no extra formatting)
- Print "Report saved: .epost-data/reports/<filename>" as final line

### Non-Functional
- Persistence step must not fail the command — wrap in try/catch logic ("if write fails, warn but continue")
- No new dependencies

## Architecture

```
[Command runs normally] -> [Produces output]
                                |
                           [Write to .epost-data/reports/<name>-YYMMDD-HHMM.<ext>]
                                |
                           [Print "Report saved: <path>"]
```

## Related Code Files
### Modify
- `packages/core/skills/review-code/SKILL.md` — add step 8: save report [OWNED]
- `packages/a11y/skills/audit-a11y/SKILL.md` — add final step: save JSON report [OWNED]
- `packages/a11y/skills/review-a11y/SKILL.md` — add final step: save JSON report [OWNED]

### Read-Only
- `packages/core/skills/code-review/SKILL.md` — parent skill reference
- `packages/design-system/skills/web-ui-lib-dev/references/audit-ui.md` — already persists (no change)

## Implementation Steps

### 1. Update review-code SKILL.md

Add after step 7 (Final Report):

```markdown
### 8. Save Report

Write the final report (from step 7) to `.epost-data/reports/review-code-YYMMDD-HHMM.md`.
- Create `.epost-data/reports/` if it doesn't exist
- Include: edge case summary table, spec compliance, unhandled list, fix status
- Print: `Report saved: .epost-data/reports/review-code-YYMMDD-HHMM.md`
- If write fails, warn but do not block the review
```

### 2. Update audit-a11y SKILL.md

Add as final step (after persist findings step 8):

```markdown
9. **Save report** — Write the JSON output to `.epost-data/reports/audit-a11y-YYMMDD-HHMM.json`.
   - Create `.epost-data/reports/` if missing
   - Print: `Report saved: .epost-data/reports/audit-a11y-YYMMDD-HHMM.json`
```

### 3. Update review-a11y SKILL.md

Add as final step (after persist findings step 6):

```markdown
7. **Save report** — Write the JSON output to `.epost-data/reports/review-a11y-YYMMDD-HHMM.json`.
   - Create `.epost-data/reports/` if missing
   - Print: `Report saved: .epost-data/reports/review-a11y-YYMMDD-HHMM.json`
```

## Todo List
- [ ] Add save report step to review-code
- [ ] Add save report step to audit-a11y
- [ ] Add save report step to review-a11y
- [ ] Run `epost-kit init` to regenerate `.claude/`

## Success Criteria
- `/review-code auth` produces `.epost-data/reports/review-code-260303-1200.md` (example)
- `/audit-a11y ios` produces `.epost-data/reports/audit-a11y-260303-1200.json` (example)
- `/review-a11y web forms` produces `.epost-data/reports/review-a11y-260303-1200.json` (example)
- Report content matches inline output
- Commands still work if write fails (graceful degradation)

## Risk Assessment
**Risks**: Minimal. Adding a write step to existing skill instructions.
**Mitigation**: "If write fails, warn but continue" — prevents report persistence from breaking the command.

## Security Considerations
- `.epost-data/` is gitignored — reports stay local
- No secrets in audit/review output

## Next Steps
After completion:
1. Run `epost-kit init`
2. Test each command and verify report file created
3. Consider: add `/reports` command to list/search saved reports (future enhancement)
