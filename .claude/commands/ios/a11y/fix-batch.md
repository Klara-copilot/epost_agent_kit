---
description: "Fix the top N priority accessibility findings in batch"
agent: epost-a11y-specialist
---

Batch-fix the top $ARGUMENTS priority findings from `.agent-knowledge/epost-known-findings.json`.

## Instructions

1. Load `.agent-knowledge/epost-known-findings.json`
2. Filter findings where `priority = 1` and not yet fixed
3. Sort by priority (ascending) then ID (ascending)
4. Take the top N findings (from arguments)
5. For each finding:
   - Locate file via `file_pattern`, locate code via `code_pattern`
   - Apply `fix_template` per `ios/ios-accessibility/` rules
   - Generate unified diff
   - Determine status (FIXED / NEEDS_REVIEW / SKIPPED)
6. Show diffs for review — do NOT apply patches automatically

## Output

JSON array with one object per finding:

```json
[
  {
    "finding_id": 3,
    "file": "path/to/file.swift",
    "status": "FIXED",
    "diff_summary": "Added accessibilityLabel to mapButton",
    "lines_changed": 2,
    "confidence": "high"
  }
]
```

## Constraints
- Minimal, surgical changes only
- Do NOT refactor unrelated code
- If ambiguous, return `NEEDS_REVIEW` with explanation
