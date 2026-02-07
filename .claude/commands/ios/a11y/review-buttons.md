---
description: "Review all buttons in current file for WCAG 2.1 AA accessibility compliance"
agent: epost-a11y-specialist
---

Review all buttons in $ARGUMENTS for accessibility compliance.

## Instructions

1. Scan the file for all `UIButton` instances (including `@IBOutlet` and programmatically created)
2. For each button, check against `ios/ios-accessibility/a11y-buttons.md`:
   - Has `accessibilityLabel` (or visible title text)?
   - Has `.button` trait set?
   - Icon-only buttons have descriptive labels?
   - State changes reflected in traits/value?
   - Disabled buttons have `.notEnabled` trait?
3. Provide exact code fixes for each issue found

## Output

For each button:
```swift
// Button: closeButton (line 45)
// Issue: Missing accessibilityLabel for icon-only button
// Fix:
closeButton.accessibilityLabel = "Close"
closeButton.accessibilityTraits = .button
```

Reference specific rules from `a11y-buttons.md` when applicable.
