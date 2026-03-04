---
name: review
description: "(ePost) Review workflow — auto-detects code, a11y, or improvements"
user-invocable: true
context: fork
agent: epost-reviewer
metadata:
  argument-hint: "[--code | --a11y | --improvements]"
  connections:
    enhances: [review-code, review-a11y, review-improvements]
---

# Review — Unified Review Command

Auto-detect and execute the appropriate review workflow.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--code`: dispatch `review-code` directly.
If `$ARGUMENTS` starts with `--a11y`: dispatch `review-a11y` directly.
If `$ARGUMENTS` starts with `--improvements`: run review-improvements inline (see below).
Otherwise: continue to Auto-Detection.

## Auto-Detection

Analyze `$ARGUMENTS` keywords:

| Keyword match | Dispatch |
|--------------|----------|
| "a11y", "accessibility", "wcag" | `review-a11y` |
| "improvements", "metrics", "patterns" | Run review-improvements inline |
| Default (no keyword match) | `review-code` |

## Review-Improvements (Inline)

When dispatching review-improvements, run inline instead of forking (uses haiku model, restricted tools):

1. Run detection script:
```bash
node packages/core/scripts/detect-improvements.cjs 2>/dev/null || node .claude/scripts/detect-improvements.cjs
```

2. Read `.epost-data/improvements/sessions.jsonl`
3. Present findings grouped by severity (high → medium → low)
4. For each finding: explain detection, recommended action, next step
5. If no findings: report healthy, show session count
6. Summary table: severity × count

## Execution

For `review-code` and `review-a11y`: load the reference documentation for the dispatched variant and execute its workflow.
