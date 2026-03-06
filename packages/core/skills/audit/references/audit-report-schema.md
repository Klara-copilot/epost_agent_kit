# Audit Report Schema

## Finding Object

```json
{
  "id": "WEB-TOKEN-001",
  "ruleId": "TOKEN-003",
  "severity": "critical",
  "category": "token",
  "location": "button.tsx:42",
  "issue": "Raw hex color #FF0000 used instead of semantic token",
  "expected": "bg-signal-error or text-signal-on-error",
  "actual": "style={{ color: '#FF0000' }}",
  "fix": "Replace with className='text-signal-error' in button-styles.ts",
  "mentoring": "Semantic tokens auto-adapt to brand and dark mode. Hardcoded colors break theming."
}
```

**Finding ID format:** `{PLATFORM}-{CATEGORY}-{NNN}`
- Platform: `WEB`, `IOS`, `ANDROID`
- Category: `STRUCT`, `PROPS`, `TOKEN`, `BIZ`, `A11Y`, `TEST`
- NNN: zero-padded sequence within that category for this audit (e.g., `001`, `002`)

## Report Envelope

```json
{
  "component": "ComponentName",
  "platform": "web",
  "auditor": "epost-muji",
  "date": "YYYY-MM-DD",
  "version": "1.0",
  "summary": {
    "total": 5,
    "critical": 1,
    "high": 2,
    "medium": 1,
    "low": 1,
    "score": "28/35",
    "verdict": "fix-and-reaudit"
  },
  "findings": [],
  "mentoringPoints": [
    "Top teaching point 1",
    "Top teaching point 2",
    "Top teaching point 3"
  ]
}
```

## Severity Definitions

| Severity | Meaning | Examples |
|----------|---------|---------|
| critical | Breaks library contract, theming, or isolation | Domain types in component, raw colors, missing styles file |
| high | Convention violation affecting consistency | Wrong prop naming, missing tests, no `use client` |
| medium | Quality gap, maintainability concern | Missing JSDoc, no displayName, custom state layer |
| low | Style preference, minor improvement | Boolean typing, Map vs object for simple cases |

## Verdict Logic

```
verdict =
  if (critical >= 2) => "redesign"
  else if (high >= 1 || medium >= 3) => "fix-and-reaudit"
  else => "pass"
```

## Score Calculation

- Score = `{PASS_COUNT}/35`
- Count only the 35 rules from `checklist-web.md`
- N/A rules do not count toward total (adjust denominator)
- Example: 32 applicable rules, 28 pass → score = `28/32`
