---
name: a11y
description: "(ePost) Accessibility workflow — auto-detects audit, fix, review, or close"
user-invocable: true
context: fork
agent: epost-a11y-specialist
metadata:
  argument-hint: "[--audit [platform] | --fix [#id|n] | --review [area] | --close [id]]"
  connections:
    enhances: [audit-a11y, fix-a11y, review-a11y, audit-close-a11y]
---

# A11y — Unified Accessibility Command

Auto-detect and execute the appropriate accessibility workflow.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--audit`: dispatch `audit-a11y`. Pass remaining args as platform hint.
If `$ARGUMENTS` starts with `--fix`: dispatch `fix-a11y`. Pass remaining args as finding ID or count.
If `$ARGUMENTS` starts with `--review`: dispatch `review-a11y`. Pass remaining args as focus area.
If `$ARGUMENTS` starts with `--close`: dispatch `audit-close-a11y`. Pass remaining args as finding ID.
Otherwise: continue to Auto-Detection.

## Auto-Detection

Analyze `$ARGUMENTS` for positional patterns and keywords:

| Pattern | Dispatch |
|---------|----------|
| `audit` or empty + staged changes exist | `audit-a11y` (detect platform from changed file extensions) |
| `fix` or `#<id>` or bare number | `fix-a11y` with the ID/count |
| `review` | `review-a11y` |
| `close` or `resolve` | `audit-close-a11y` |
| Ambiguous | Ask user: audit, fix, review, or close? |

## Platform Hint

When dispatching `audit-a11y`, detect platform from context:
- `.swift` files → ios
- `.kt`/`.kts` files → android
- `.tsx`/`.jsx` files → web

## Execution

Load the reference documentation for the dispatched variant and execute its workflow.
