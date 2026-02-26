---
description: (ePost) Audit staged changes for WCAG 2.1 AA accessibility violations
agent: epost-a11y-specialist
argument-hint: "[ios|android|web]"
---

**Mode: Audit — Do NOT use Write or Edit tools. Output valid JSON only.**

Audit all changed files for accessibility violations, scoped to the detected platform.

<platform>$ARGUMENTS</platform>

**IMPORTANT:** Analyze the skills catalog and activate ONLY the skills needed for the detected platform.

## Platform Detection

- `.swift`, SwiftUI → iOS → use `a11y/ios` skill
- `.kt`, Compose → Android → use `a11y/android` skill
- `.tsx`, `.jsx`, HTML → Web → use `a11y/web` skill
- Explicit argument overrides auto-detection
- No signal → ask user

## Instructions

1. **Detect platform** — from argument or changed file extensions
2. **Get Git diff** — all changed files matching detected platform
3. **Scan each file** — for accessibility violations using platform-specific skill rules
4. **Check known findings** — match against `.epost-data/a11y/known-findings.json` (if exists)
5. **Detect regressions** — if a `resolved: true` finding reappears, flag as `regression`
6. **Classify violations** — type, WCAG criterion, severity, finding ID, regression status
7. **Determine block** — critical violations, regressions, or 5+ serious = block PR

## Output

Valid JSON only — no prose:

```json
{
  "platform": "ios|android|web",
  "total_violations": 0,
  "critical": 0,
  "violations": [
    {
      "file": "path/to/file",
      "line": 45,
      "type": "button|heading|form|image|focus|color|other",
      "wcag": "4.1.2",
      "severity": "critical|serious|moderate|minor",
      "message": "Description of the issue",
      "finding_id": null,
      "regression": false
    }
  ],
  "regressions": 0,
  "should_block_pr": false
}
```
