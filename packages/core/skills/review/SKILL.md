---
name: review
description: "(ePost) Review workflow — auto-detects code, a11y, or improvements"
user-invocable: true
context: fork
agent: epost-code-reviewer
metadata:
  argument-hint: "[--code | --a11y | --improvements]"
  connections:
    enhances: []
---

# Review — Unified Review Command

Auto-detect and execute the appropriate review workflow.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--code`: load `references/code.md` and execute.
If `$ARGUMENTS` starts with `--a11y`: load `references/a11y.md` and execute.
If `$ARGUMENTS` starts with `--improvements`: run improvements inline (see below).
Otherwise: continue to Auto-Detection.

## Aspect Files

| File | Purpose |
|------|---------|
| `references/code.md` | Ultrathink edge cases, then parallel verify with reviewers |
| `references/a11y.md` | Review accessibility compliance (WCAG 2.1 AA) |
| `references/improvements.md` | Review auto-improvement metrics, detect patterns |

## Auto-Detection

Analyze `$ARGUMENTS` keywords:

| Keyword match | Load Reference |
|--------------|----------------|
| "a11y", "accessibility", "wcag" | `references/a11y.md` |
| "improvements", "metrics", "patterns" | Run improvements inline (see below) |
| Default (no keyword match) | `references/code.md` |

## Review-Improvements (Inline)

When dispatching review-improvements, run inline instead of forking (uses haiku model, restricted tools):

1. Read session metrics from `.epost-data/improvements/sessions.jsonl`

2. Read `.epost-data/improvements/sessions.jsonl`
3. Present findings grouped by severity (high → medium → low)
4. For each finding: explain detection, recommended action, next step
5. If no findings: report healthy, show session count
6. Summary table: severity × count

## Execution

For code and a11y reviews: load the reference file and execute its workflow. For improvements: execute inline per the Review-Improvements section above.
