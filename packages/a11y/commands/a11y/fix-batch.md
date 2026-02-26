---
description: (ePost) Fix the top N priority accessibility findings in batch
agent: epost-a11y-specialist
argument-hint: "<n>"
---

Batch-fix the top $ARGUMENTS priority findings from `.epost-data/a11y/known-findings.json`.

**IMPORTANT:** Analyze the skills catalog and activate ONLY the skills needed for the detected platforms.

## Platform Detection

- `.swift`, SwiftUI → iOS → use `a11y/ios` skill
- `.kt`, Compose → Android → use `a11y/android` skill
- `.tsx`, `.jsx`, HTML → Web → use `a11y/web` skill
- Group findings by `platform` field and apply appropriate skill per group

## Instructions

1. Load `.epost-data/a11y/known-findings.json`
2. Filter findings where `resolved !== true` and `priority = 1`
3. Sort by priority (ascending) then ID (ascending)
4. Take the top N findings (from arguments)
5. For each finding:
   - Check `.epost-data/a11y/fixes/patches/` for existing patches — reuse if applicable
   - Read finding's `platform` field to select correct skill
   - Locate file via `file_pattern`, locate code via `code_pattern`
   - Apply `fix_template` per platform-specific skill rules
   - Generate unified diff
   - Determine status (FIXED / NEEDS_REVIEW / SKIPPED)
6. Show diffs for review — do NOT apply patches automatically
7. After fixes are applied and verified, suggest running `/a11y:close <id>` for each

## Output

JSON array with one object per finding:

```json
[
  {
    "finding_id": 3,
    "platform": "ios|android|web",
    "file": "path/to/file",
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
