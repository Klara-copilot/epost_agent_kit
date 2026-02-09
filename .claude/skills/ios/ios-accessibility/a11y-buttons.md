---
name: a11y-buttons
description: Button accessibility rules — labels, traits, states, icon buttons, toggle buttons, groups
---

# Button Accessibility Rules

## Purpose

Accessibility rules specific to buttons and button-like interactive elements, ensuring VoiceOver users can identify and interact with all buttons.

## Table of Contents

- [Button Basics](#button-basics)
- [Button Labels](#button-labels)
- [Button States](#button-states)
- [Toggle Buttons](#toggle-buttons)
- [Icon Buttons](#icon-buttons)
- [Button Groups](#button-groups)
- [Custom Buttons](#custom-buttons)

## Related Documents

- [a11y-core](./a11y-core.md) - Core accessibility principles
- [a11y-forms](./a11y-forms.md) - Form accessibility
- [a11y-focus](./a11y-focus.md) - Focus management

## Button Basics

### Standard UIButton

**Default Behavior:**
- `UIButton` is accessible by default
- Title text becomes accessibility label automatically
- `.button` trait is set automatically
- No additional setup needed for simple buttons

```swift
// ✅ Standard button - automatically accessible
let button = UIButton(type: .system)
button.setTitle("Save", for: .normal)
// VoiceOver reads: "Save, Button"
```

### Button Trait

**Always set `.button` trait:**
- Required for VoiceOver to recognize as button
- Enables button-specific gestures
- Standard buttons have this automatically

```swift
// ✅ Explicit trait setting
customButton.accessibilityTraits = .button

// ✅ Multiple traits
customButton.accessibilityTraits = [.button, .selected]
```

## Button Labels

### Label Guidelines

**Rules:**
- Use verb or action word ("Save", "Delete", "Cancel")
- Match visible button text when possible
- Keep concise (1-2 words preferred)
- No trailing punctuation

```swift
// ✅ Good labels
button.accessibilityLabel = "Save"
button.accessibilityLabel = "Delete item"
button.accessibilityLabel = "Cancel"

// ❌ Bad labels
button.accessibilityLabel = "Save button" // Redundant
button.accessibilityLabel = "Click here to save" // Too verbose
button.accessibilityLabel = "Save!" // Punctuation unnecessary
```

### Buttons with Icons Only

**Icon-only buttons must have labels:**
- Never rely on icon alone
- Provide descriptive label
- Consider hint if action isn't obvious

```swift
// ✅ Icon button with label
let closeButton = UIButton(type: .system)
closeButton.setImage(UIImage(systemName: "xmark"), for: .normal)
closeButton.accessibilityLabel = "Close"
closeButton.accessibilityTraits = .button

// ✅ Icon button with descriptive label
let shareButton = UIButton(type: .system)
shareButton.setImage(UIImage(systemName: "square.and.arrow.up"), for: .normal)
shareButton.accessibilityLabel = "Share"
shareButton.accessibilityHint = "Opens share options"
```

### Buttons with Both Text and Icon

**Prefer text as label:**
- Use visible text as accessibility label
- Icon is decorative in this case
- No need to mention icon in label

```swift
// ✅ Button with text and icon
let saveButton = UIButton(type: .system)
saveButton.setTitle("Save", for: .normal)
saveButton.setImage(UIImage(systemName: "checkmark"), for: .normal)
saveButton.accessibilityLabel = "Save" // Text is sufficient

// ❌ Don't mention icon
saveButton.accessibilityLabel = "Save with checkmark icon" // Unnecessary
```

## Button States

### Enabled/Disabled

**Disabled buttons:**
- Set `.notEnabled` trait
- Update label to indicate disabled state
- VoiceOver announces "dimmed" automatically

```swift
// ✅ Disabled button
saveButton.isEnabled = false
saveButton.accessibilityTraits = [.button, .notEnabled]
// VoiceOver reads: "Save, Button, Dimmed"
```

### Selected State

**Selected buttons:**
- Add `.selected` trait
- Update value if state is meaningful
- Common for segmented controls, filters

```swift
// ✅ Selected button
filterButton.isSelected = true
filterButton.accessibilityTraits = [.button, .selected]
filterButton.accessibilityValue = "Selected"

// ✅ Toggle button with state
toggleButton.accessibilityLabel = "Dark mode"
toggleButton.accessibilityValue = isEnabled ? "On" : "Off"
toggleButton.accessibilityTraits = [.button, .toggleButton]
```

### Loading State

**Buttons in loading state:**
- Update label to indicate loading
- Consider disabling interaction
- Announce state changes

```swift
// ✅ Loading button
func setLoading(_ isLoading: Bool) {
    if isLoading {
        button.accessibilityLabel = "Loading"
        button.isEnabled = false
        button.accessibilityTraits = [.button, .notEnabled]
    } else {
        button.accessibilityLabel = "Submit"
        button.isEnabled = true
        button.accessibilityTraits = .button
    }
}
```

## Toggle Buttons

### Toggle Button Trait

**iOS 17+ toggle buttons:**
- Use `.toggleButton` trait
- Set value to "On" or "Off"
- VoiceOver announces state clearly

```swift
// ✅ Toggle button (iOS 17+)
if #available(iOS 17.0, *) {
    darkModeButton.accessibilityTraits = [.button, .toggleButton]
    darkModeButton.accessibilityValue = isDarkMode ? "On" : "Off"
} else {
    // Fallback for older iOS
    darkModeButton.accessibilityTraits = .button
    darkModeButton.accessibilityValue = isDarkMode ? "On" : "Off"
}
```

### Toggle Button Labels

**Labels for toggles:**
- Describe what is being toggled
- Value indicates current state
- Hint explains what happens when toggled

```swift
// ✅ Toggle button setup
muteButton.accessibilityLabel = "Sound"
muteButton.accessibilityValue = isMuted ? "Muted" : "Unmuted"
muteButton.accessibilityHint = "Double tap to toggle sound"
muteButton.accessibilityTraits = [.button, .toggleButton]
```

## Icon Buttons

### Decorative Icons

**Icons without text:**
- Always provide accessibility label
- Describe action, not icon appearance
- Use hint if action needs clarification

```swift
// ✅ Icon button labels
closeButton.accessibilityLabel = "Close"
editButton.accessibilityLabel = "Edit"
deleteButton.accessibilityLabel = "Delete"
shareButton.accessibilityLabel = "Share"

// ✅ With hints for clarity
infoButton.accessibilityLabel = "Information"
infoButton.accessibilityHint = "Opens help documentation"
```

### Common Icon Labels

**Standard icon mappings:** ✕/× → "Close", ✓ → "Done"/"Confirm", ⚙ → "Settings", ℹ → "Information", ♥ → "Favorite"/"Like", 📤 → "Share", 🗑 → "Delete", ✏ → "Edit"

## Button Groups

### Segmented Controls

**UISegmentedControl:**
- Accessible by default
- Each segment is announced separately
- Value indicates selected segment

```swift
// ✅ Segmented control (accessible by default)
let segmentedControl = UISegmentedControl(items: ["List", "Grid"])
segmentedControl.selectedSegmentIndex = 0
// VoiceOver reads: "List, Selected, Segmented control"
```

### Button Groups

**Grouped buttons:** Each button is separate accessibility element. Use container with `isAccessibilityElement = false` to group. Consider hint to indicate group context.

## Custom Buttons

### Custom Button Classes

**Custom button implementations:**
- Must set `isAccessibilityElement = true`
- Must set `.button` trait
- Must provide label

```swift
// ✅ Custom button class
class CustomButton: UIView {
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupAccessibility()
    }
    
    private func setupAccessibility() {
        isAccessibilityElement = true
        accessibilityTraits = .button
        accessibilityLabel = "Custom action"
    }
    
    func setTitle(_ title: String) {
        accessibilityLabel = title
    }
}
```

### Action Buttons

**Buttons that perform actions:** Label describes action, hint explains result, update label if action changes.

### Best Practices Summary

**Button Accessibility Checklist:**
- ✅ Button has `.button` trait
- ✅ Label is concise and action-oriented
- ✅ Icon-only buttons have descriptive labels
- ✅ State changes are reflected in traits/value
- ✅ Disabled buttons have `.notEnabled` trait
- ✅ Toggle buttons use `.toggleButton` trait (iOS 17+)
- ✅ Hints provided when action isn't obvious
- ✅ All labels are localized
