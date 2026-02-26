---
description: (ePost) Review Android accessibility for WCAG 2.1 AA compliance
agent: epost-a11y-specialist
argument-hint: [buttons|headings|modals] (optional)
---

Review Android accessibility compliance. Auto-detects focus area from argument.

<focus>$ARGUMENTS</focus>

## Focus Detection

| Argument | Scope |
|----------|-------|
| `buttons` | Button contentDescriptions, Role.Button, touch targets, toggle state |
| `headings` | heading() semantics, hierarchy, TalkBack Rotor navigation order |
| `modals` | paneTitle, focus on open, FocusRequester on dismiss |
| _(empty)_ | **All three** — buttons, headings, and modals |

## Instructions

1. Get the current Git diff (all changed `.kt` files)
2. For the detected focus area(s), scan using `android/accessibility/` skill rules
3. Check against `.agent-knowledge/epost-known-findings-android.json` (if exists) for known issues

### Buttons Review
- Every `IconButton` has non-null `contentDescription`
- Custom `clickable {}` composables have `semantics { role = Role.Button }`
- Minimum 48×48dp touch target
- Toggle buttons/switches expose state via `stateDescription`

### Headings Review
- Visual section headers have `semantics { heading() }`
- Heading hierarchy is logical (no skipped levels)
- TalkBack Rotor navigation works correctly for headings
- Dynamic headings update when content changes

### Modals Review
- `AlertDialog`/`Dialog` has `semantics { paneTitle = "..." }`
- Focus moves to modal on presentation (`FocusRequester + LaunchedEffect`)
- Focus returns to trigger on dismissal
- Dismiss action is accessible (Cancel/Close button)

## Output

Valid JSON — no prose:

```json
{
  "focus": "buttons|headings|modals|all",
  "total_violations": 0,
  "critical": 0,
  "violations": [
    {
      "file": "path/to/Screen.kt",
      "line": 45,
      "type": "button|heading|modal",
      "wcag": "1.1.1",
      "severity": "critical|high|medium|low",
      "message": "Description of the issue",
      "finding_id": null
    }
  ],
  "should_block_pr": false
}
```
