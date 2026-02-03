# Accessibility Core Rules

## Purpose

Foundational accessibility rules for iOS VoiceOver support, ensuring all UI elements are accessible and follow WCAG 2.1 AA standards.

## Table of Contents

- [Core Principles](#core-principles) → Lines 10-20
- [Making Elements Accessible](#making-elements-accessible) → Lines 22-40
- [Accessibility Properties](#accessibility-properties) → Lines 42-80
- [VoiceOver Detection](#voiceover-detection) → Lines 82-95
- [Required Properties](#required-properties) → Lines 97-120
- [Best Practices](#best-practices) → Lines 122-150

## Related Documents

- [a11y-buttons](./a11y-buttons.mdc) - Button-specific accessibility
- [a11y-forms](./a11y-forms.mdc) - Form input accessibility
- [a11y-headings](./a11y-headings.mdc) - Heading structure
- [a11y-focus](./a11y-focus.mdc) - Focus management
- [a11y-images](./a11y-images.mdc) - Image accessibility
- [a11y-colors-contrast](./a11y-colors-contrast.mdc) - Color and contrast
- [a11y-testing](./a11y-testing.mdc) - Testing guidelines

## Core Principles

**WCAG 2.1 AA Requirements:**
- **Perceivable**: UI elements must be detectable by assistive technologies
- **Operable**: All interactive elements must be keyboard/VoiceOver navigable
- **Understandable**: Labels, hints, and values must be clear
- **Robust**: Accessibility properties must be correctly set

**iOS-Specific:**
- All interactive elements must be VoiceOver accessible
- Custom views must explicitly enable accessibility
- Labels must be concise and descriptive
- Hints should explain actions, not repeat labels

## Making Elements Accessible

### Enable Accessibility

**Standard UIKit Controls:**
- Buttons, text fields, labels are accessible by default
- No additional setup required for standard controls

**Custom Views:**
- Must explicitly enable accessibility
- Set `isAccessibilityElement = true` before setting other properties

```swift
// ✅ Correct: Enable accessibility first
customView.isAccessibilityElement = true
customView.accessibilityLabel = "Custom view description"

// ❌ Wrong: Setting label without enabling
customView.accessibilityLabel = "Description" // Won't work
```

### Container Views

**Views containing multiple elements:**
- Set `isAccessibilityElement = false` on container
- Individual child elements handle their own accessibility
- Use `accessibilityContainer` for complex hierarchies

```swift
// Container with multiple interactive elements
containerView.isAccessibilityElement = false
button1.isAccessibilityElement = true
button2.isAccessibilityElement = true
```

## Accessibility Properties

### Label (Required)

**Purpose:** Identifies the element to VoiceOver users

**Rules:**
- Must be concise (1-2 words when possible)
- Describe what the element is, not what it does
- Use sentence case, no trailing punctuation
- Localize all labels

```swift
// ✅ Good labels
button.accessibilityLabel = "Save"
imageView.accessibilityLabel = "Profile photo"
label.accessibilityLabel = "Welcome message"

// ❌ Bad labels
button.accessibilityLabel = "Click here to save your document" // Too verbose
imageView.accessibilityLabel = "Image" // Too generic
label.accessibilityLabel = "Welcome!" // Punctuation unnecessary
```

### Hint (Optional)

**Purpose:** Explains what happens when user interacts with element

**Rules:**
- Only add when action isn't obvious from label
- Start with verb (e.g., "Opens", "Navigates to")
- Keep under 10 words
- Don't repeat information from label

```swift
// ✅ Good hints
deleteButton.accessibilityHint = "Deletes the selected item"
infoButton.accessibilityHint = "Opens help documentation"

// ❌ Bad hints
saveButton.accessibilityHint = "Saves" // Obvious from label
button.accessibilityHint = "This button saves your document when you tap it" // Too verbose
```

### Value (Dynamic Content)

**Purpose:** Describes current state or value of element

**Rules:**
- Use for elements with changing values (sliders, progress bars, toggles)
- Update value when state changes
- Combine with label for complete description

```swift
// ✅ Good value usage
slider.accessibilityLabel = "Volume"
slider.accessibilityValue = "50 percent"

progressView.accessibilityLabel = "Download progress"
progressView.accessibilityValue = "75 percent complete"

toggle.accessibilityLabel = "Dark mode"
toggle.accessibilityValue = isEnabled ? "On" : "Off"
```

### Traits

**Purpose:** Describes element type and behavior to VoiceOver

**Common Traits:**
- `.button` - Interactive button
- `.header` - Section heading
- `.link` - Navigational link
- `.image` - Image element
- `.searchField` - Search input
- `.selected` - Currently selected
- `.adjustable` - Value can be adjusted
- `.notEnabled` - Disabled state

```swift
// ✅ Setting appropriate traits
saveButton.accessibilityTraits = .button
sectionHeader.accessibilityTraits = .header
linkLabel.accessibilityTraits = .link
slider.accessibilityTraits = [.adjustable, .updatesFrequently]

// Multiple traits
customButton.accessibilityTraits = [.button, .selected]
```

## VoiceOver Detection

### Check VoiceOver Status

**Detect if VoiceOver is running:**
- Use `UIAccessibility.isVoiceOverRunning`
- Adjust UI behavior when VoiceOver is active
- Don't rely on this for core accessibility (always set properties)

```swift
if UIAccessibility.isVoiceOverRunning {
    // Adjust UI for VoiceOver users
    // Example: Show persistent overlays instead of auto-dismissing
}
```

### VoiceOver Notifications

**Listen for VoiceOver status changes:**
- Observe `voiceOverStatusDidChangeNotification`
- Update UI when VoiceOver starts/stops

```swift
NotificationCenter.default.addObserver(
    self,
    selector: #selector(voiceOverStatusChanged),
    name: UIAccessibility.voiceOverStatusDidChangeNotification,
    object: nil
)

@objc private func voiceOverStatusChanged() {
    if UIAccessibility.isVoiceOverRunning {
        // Adjust UI for VoiceOver
    }
}
```

## Required Properties

### Minimum Requirements

**Every accessible element must have:**
1. `isAccessibilityElement = true` (for custom views)
2. `accessibilityLabel` (identifies element)
3. Appropriate `accessibilityTraits` (describes type)

**Optional but recommended:**
- `accessibilityHint` (when action isn't obvious)
- `accessibilityValue` (for dynamic content)

### Property Order

**Set properties in this order:**
1. `isAccessibilityElement`
2. `accessibilityLabel`
3. `accessibilityTraits`
4. `accessibilityValue` (if needed)
5. `accessibilityHint` (if needed)

```swift
// ✅ Correct order
element.isAccessibilityElement = true
element.accessibilityLabel = "Element name"
element.accessibilityTraits = .button
element.accessibilityValue = "Current value"
element.accessibilityHint = "Action description"
```

## Best Practices

### Label Writing

**Guidelines:**
- Use nouns for static elements ("Save button")
- Use verbs for actions only in hints
- Avoid redundant words ("button" already implied by trait)
- Match visible text when possible

```swift
// ✅ Good: Concise, clear
button.accessibilityLabel = "Save"

// ✅ Good: Matches visible text
button.setTitle("Delete", for: .normal)
button.accessibilityLabel = "Delete"

// ❌ Bad: Redundant
button.accessibilityLabel = "Save button" // "button" redundant
```

### Dynamic Labels

**Update labels when content changes:**
- Refresh accessibility properties after state changes
- Use `UIAccessibility.post()` for important updates

```swift
func updateScore(_ newScore: Int) {
    scoreLabel.text = "\(newScore)"
    scoreLabel.accessibilityLabel = "Score"
    scoreLabel.accessibilityValue = "\(newScore) points"
    
    // Announce important changes
    UIAccessibility.post(notification: .announcement, argument: "Score updated to \(newScore)")
}
```

### Container Accessibility

**Grouping related elements:**
- Use `accessibilityContainer` for complex hierarchies
- Set container's `isAccessibilityElement = false`
- Let child elements handle their own accessibility

```swift
// Complex view hierarchy
parentView.isAccessibilityElement = false
childView1.isAccessibilityElement = true
childView1.accessibilityLabel = "First item"
childView2.isAccessibilityElement = true
childView2.accessibilityLabel = "Second item"
```

### Localization

**All accessibility strings must be localized:**
- Use `NSLocalizedString()` for labels and hints
- Test with different languages
- Ensure VoiceOver announcements work in all supported languages

```swift
button.accessibilityLabel = NSLocalizedString("save_button_label", comment: "Save button")
button.accessibilityHint = NSLocalizedString("save_button_hint", comment: "Saves the current document")
```
