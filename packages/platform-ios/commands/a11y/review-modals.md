---
description: "Review modal dialog focus management for VoiceOver accessibility"
agent: epost-a11y-specialist
---

Review modal/dialog focus management in $ARGUMENTS for accessibility compliance.

## Instructions

1. Review modal presentation code in the file
2. Check against `ios/ios-accessibility/a11y-focus.md`:
   - Focus moves into dialog when presented?
   - `accessibilityViewIsModal` set on modal view?
   - Focus returns to triggering element when dismissed?
   - Screen change is announced?
3. Provide complete code for presentation and dismissal

## Expected Patterns

```swift
// Presentation
func presentModal() {
    let modalVC = ModalViewController()
    present(modalVC, animated: true) {
        modalVC.view.accessibilityViewIsModal = true
        UIAccessibility.post(notification: .screenChanged, argument: modalVC.firstElement)
        UIAccessibility.post(notification: .announcement, argument: "Dialog opened")
    }
}

// Dismissal
func dismissModal() {
    dismiss(animated: true) {
        UIAccessibility.post(notification: .screenChanged, argument: self.triggeringButton)
    }
}
```

Critical: Ensure dismiss button is always accessible to prevent focus traps.
