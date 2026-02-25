---
description: (ePost) Fix the top N priority Android accessibility findings in batch
agent: epost-a11y-specialist
---

Batch-fix the top $ARGUMENTS priority findings from `.agent-knowledge/epost-known-findings-android.json`.

## Instructions

1. Load `.agent-knowledge/epost-known-findings-android.json`
2. Filter findings where `priority = 1` and not yet fixed
3. Sort by priority (ascending) then ID (ascending)
4. Take the top N findings (from arguments)
5. For each finding:
   - Locate file via `file_pattern`, locate code via `code_pattern`
   - Apply `fix_template` per `android/accessibility/` rules
   - Generate unified diff
   - Determine status (FIXED / NEEDS_REVIEW / SKIPPED)
6. Show diffs for review — do NOT apply patches automatically

## Output

JSON array with one object per finding:

```json
[
  {
    "finding_id": 3,
    "file": "path/to/Screen.kt",
    "status": "FIXED",
    "diff_summary": "Added contentDescription to close IconButton",
    "lines_changed": 1,
    "confidence": "high"
  }
]
```

## Constraints
- Minimal, surgical changes only
- Do NOT refactor unrelated code
- If ambiguous, return `NEEDS_REVIEW` with explanation
