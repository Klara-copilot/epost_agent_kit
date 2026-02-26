---
description: (ePost) Audit staged Swift changes for WCAG 2.1 AA accessibility violations
agent: epost-a11y-specialist
---

**Mode: Audit — Do NOT use Write or Edit tools. Output valid JSON only.**

Audit all Swift files changed in the current Git diff for accessibility violations.

## Instructions

1. Get the current Git diff (all changed `.swift` files)
2. For each changed Swift file, scan for accessibility violations using `ios/accessibility/` skill rules
3. Check against `.epost-data/a11y/known-findings.json` (if exists) to match known issues
4. If a matched finding has `resolved: true` but the violation reappears, flag as `regression`
5. Classify each violation by type, WCAG criterion, severity, finding ID, and regression status
6. Determine if PR should be blocked (critical violations or regressions = block)

## Output

Valid JSON only — no prose. Structure:

```json
{
  "total_violations": 0,
  "critical": 0,
  "violations": [
    {
      "file": "path/to/file.swift",
      "line": 45,
      "type": "button",
      "wcag": "4.1.2",
      "severity": "critical",
      "message": "Button missing accessibilityLabel",
      "finding_id": null,
      "regression": false
    }
  ],
  "regressions": 0,
  "should_block_pr": false
}
```

Types: `button`, `heading`, `form`, `image`, `focus`, `color`, `other`
Severity: `critical`, `high`, `medium`, `low`
