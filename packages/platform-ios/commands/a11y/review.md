---
description: (ePost) Review iOS accessibility for WCAG 2.1 AA compliance
agent: epost-a11y-specialist
argument-hint: "[buttons|headings|modals] (optional)"
---

Review iOS accessibility compliance. Auto-detects focus area from argument.

<focus>$ARGUMENTS</focus>

## Focus Detection

| Argument | Scope |
|----------|-------|
| `buttons` | Button labels, traits, tap targets, roles |
| `headings` | Heading traits, hierarchy, navigation order |
| `modals` | Focus trapping, `accessibilityViewIsModal`, dismiss actions |
| _(empty)_ | **All three** — buttons, headings, and modals |

## Instructions

1. Get the current Git diff (all changed `.swift` files)
2. For the detected focus area(s), scan using `ios/accessibility/` skill rules
3. Check against `.agent-knowledge/epost-known-findings.json` (if exists) for known issues

### Buttons Review
- Every tappable element has `accessibilityLabel`
- `accessibilityTraits` includes `.button`
- Minimum 44×44pt tap target
- Toggle buttons expose state via `accessibilityValue`

### Headings Review
- Section headers have `.header` trait
- Heading hierarchy is logical (no skipped levels)
- VoiceOver rotor navigation works correctly
- Dynamic type support on heading text

### Modals Review
- `accessibilityViewIsModal = true` on modal container
- Focus moves to modal on presentation
- Focus returns to trigger on dismissal
- Dismiss action available via `accessibilityCustomActions`

## Output

Valid JSON — no prose:

```json
{
  "focus": "buttons|headings|modals|all",
  "total_violations": 0,
  "critical": 0,
  "violations": [
    {
      "file": "path/to/file.swift",
      "line": 45,
      "type": "button|heading|modal",
      "wcag": "4.1.2",
      "severity": "critical|high|medium|low",
      "message": "Description of the issue",
      "finding_id": null
    }
  ],
  "should_block_pr": false
}
```
