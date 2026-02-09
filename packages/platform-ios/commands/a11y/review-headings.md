---
description: "Review heading structure for VoiceOver navigation compliance"
agent: epost-a11y-specialist
---

Review heading structure in $ARGUMENTS for accessibility compliance.

## Instructions

1. Identify all `UILabel` instances that serve as visual headings/titles
2. Check against `ios/ios-accessibility/a11y-headings.md`:
   - Does it have `.header` trait?
   - Is heading level set appropriately? (H1 for main title, H2 for sections, etc.)
   - Does label match visible text?
3. For each heading, determine appropriate level (1-6) and provide exact code

## Output

For each heading:
```swift
// Heading: "Settings" (line 23)
// Current: Missing .header trait
// Level: 1 (main screen title)
// Fix:
settingsTitleLabel.accessibilityTraits = .header
```

Rules: One H1 per screen. Maintain logical hierarchy (H1 > H2 > H3, don't skip levels).
