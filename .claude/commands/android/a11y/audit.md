---
description: (ePost) Audit staged Kotlin changes for WCAG 2.1 AA accessibility violations
agent: epost-a11y-specialist
---

**Mode: Audit — Do NOT use Write or Edit tools. Output valid JSON only.**

Audit all Kotlin files changed in the current Git diff for accessibility violations.

## Instructions

1. Get the current Git diff (all changed `.kt` files)
2. For each changed Kotlin file, scan for accessibility violations using `android/accessibility/` skill rules
3. Check against `.agent-knowledge/epost-known-findings-android.json` (if exists) to match known issues
4. Classify each violation by type, WCAG criterion, severity, and finding ID
5. Determine if PR should be blocked (critical violations = block)

## Output

Valid JSON only — no prose. Structure:

```json
{
  "total_violations": 0,
  "critical": 0,
  "violations": [
    {
      "file": "path/to/Screen.kt",
      "line": 45,
      "type": "button",
      "wcag": "1.1.1",
      "severity": "critical",
      "message": "IconButton missing contentDescription",
      "finding_id": null
    }
  ],
  "should_block_pr": false
}
```

Types: `button`, `heading`, `form`, `image`, `focus`, `color`, `other`
Severity: `critical`, `high`, `medium`, `low`
