---
phase: 2
title: "Add regression scan step to code-review SKILL.md"
effort: 1.5h
depends: [1]
---

# Phase 2: Regression Scan Step

## Context

- Plan: [plan.md](./plan.md)
- Target file: `packages/core/skills/code-review/SKILL.md`
- Data source: `reports/known-findings/code.json` (read-only)

## Overview

Add a "Regression Scan" step to the review process that reads the known-findings DB before writing new findings. Surface repeated rule violations in the report.

## Requirements

### New Step: Regression Scan (before Systematic Review)

Insert between step 3 (check `docs/conventions/`) and step 4 (systematic review) in the `### Review Process` section:

```markdown
4. **Regression scan** — read `reports/known-findings/code.json` (if exists):
   a. Group open findings (`resolved: false`) by `rule_id`
   b. Count occurrences per rule across all findings
   c. If any `rule_id` appears 3+ times → flag as "recurring" for the report
   d. If current review touches a file matching an open finding's `file_pattern` → note "known issue" (don't re-flag as new)
   e. Store scan results for the report's Regression Trends section
```

Renumber existing steps 4-6 to 5-7.

### Report Section: Regression Trends

Add to `## Output Format` section, after the Findings table description:

```markdown
- **Regression Trends** section (include when regression scan found recurring rules):
  - Table: Rule ID | Count | Last Seen | Pattern
  - Only rules with 3+ open occurrences
  - Recommendation: "Consider adding lint rule or architectural fix for {RULE-ID}"
```

### Update Persist Findings Step

In the existing "Persist Findings" section, update step 2 (pre-scan for regressions):

Current text references regression detection but doesn't surface it. Add:

```markdown
2b. **Surface recurring rules**: after pre-scan, if any `rule_id` has 3+ open entries in DB, include in report's Regression Trends section with count and file patterns.
```

### Lightweight vs Escalated Behavior

- **Lightweight**: regression scan runs but only surfaces rules with 5+ occurrences (reduce noise)
- **Escalated**: surfaces rules with 3+ occurrences (full sensitivity)

## Files to Change

- `packages/core/skills/code-review/SKILL.md` — add regression scan step + report section + update persist step

## TODO

- [ ] Insert regression scan as step 4 in Review Process
- [ ] Renumber subsequent steps
- [ ] Add Regression Trends to Output Format section
- [ ] Update Persist Findings step 2 with 2b surfacing logic
- [ ] Add lightweight/escalated thresholds (5+ vs 3+)
- [ ] Verify SKILL.md stays under 250 lines

## Success Criteria

- Regression scan step is clearly positioned before systematic review (so reviewer has context)
- Report section only appears when recurring rules exist (no empty section)
- Thresholds differentiate lightweight vs escalated mode
- DB schema unchanged — purely read-only access
