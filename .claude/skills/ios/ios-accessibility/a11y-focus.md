---
name: a11y-focus
description: Focus management — notifications, indicators, focus order, groups, programmatic focus
---

# Focus Management Rules

## Purpose

Accessibility rules for managing focus, announcements, and VoiceOver navigation, ensuring users can effectively navigate and understand focus changes.

## Table of Contents

- [Focus Basics](#focus-basics)
- [Focus Announcements](#focus-announcements)
- [Focus Order](#focus-order)
- [Programmatic Focus](#programmatic-focus)
- [Screen Changes](#screen-changes)
- [Dynamic Content](#dynamic-content)

## Related Documents

- [a11y-core](./a11y-core.md) - Core accessibility principles
- [a11y-headings](./a11y-headings.md) - Heading navigation
- [a11y-forms](./a11y-forms.md) - Form focus

## Focus Basics

### Focus Notification

**Monitor focus changes:**
- Observe `elementFocusedNotification`
- Respond to focus events appropriately
- Don't interfere with normal focus behavior

```swift
// ✅ Focus notification observer
NotificationCenter.default.addObserver(
    self,
    selector: #selector(elementFocused),
    name: UIAccessibility.elementFocusedNotification,
    object: nil
)

@objc private func elementFocused(_ notification: Notification) {
    guard let element = notification.userInfo?[UIAccessibility.focusedElementUserInfoKey] as? UIView else {
        return
    }
    // Handle focus change
}
```

### Focus Indicators

**Visual focus indicators:**
- Ensure focus is visually apparent
- Don't rely solely on color
- Use borders, outlines, or highlights
- Test with VoiceOver to verify

```swift
// ✅ Visual focus indicator
func updateFocusAppearance(for view: UIView, isFocused: Bool) {
    if isFocused {
        view.layer.borderWidth = 2
        view.layer.borderColor = UIColor.systemBlue.cgColor
    } else {
        view.layer.borderWidth = 0
    }
}
```

## Focus Announcements

### Announcement Notification

**Post accessibility announcements:**
- Use `UIAccessibility.post()` for important updates
- Announce state changes, errors, completions
- Don't overuse announcements

```swift
// ✅ Important announcement
UIAccessibility.post(
    notification: .announcement,
    argument: "File downloaded successfully"
)

// ✅ Error announcement
UIAccessibility.post(
    notification: .announcement,
    argument: "Invalid email address"
)
```

### Announcement Timing

**When to announce:**
- ✅ After user actions complete
- ✅ When errors occur
- ✅ When content loads
- ✅ When state changes significantly
- ❌ Don't announce on every keystroke
- ❌ Don't interrupt user input

```swift
// ✅ Good: Announce after action
func saveDocument() {
    // Save logic...
    UIAccessibility.post(
        notification: .announcement,
        argument: "Document saved"
    )
}

// ❌ Bad: Announce during typing
func textFieldDidChange(_ textField: UITextField) {
    // Don't announce on every character
    // UIAccessibility.post(...) // Wrong!
}
```

### Announcement Completion

**Monitor announcement completion:**
- Observe `announcementDidFinishNotification`
- Chain announcements if needed
- Avoid overlapping announcements

```swift
// ✅ Announcement completion
NotificationCenter.default.addObserver(
    self,
    selector: #selector(announcementFinished),
    name: UIAccessibility.announcementDidFinishNotification,
    object: nil
)

@objc private func announcementFinished() {
    // Next announcement can proceed
}
```

## Focus Order

### Logical Focus Order

**Ensure logical navigation order:**
- Focus follows visual layout (top to bottom, left to right)
- Related elements are grouped
- Important elements come first

```swift
// ✅ Logical focus order
override func viewDidLoad() {
    super.viewDidLoad()
    
    // Add views in logical order
    view.addSubview(headerLabel)      // First
    view.addSubview(nameField)        // Second
    view.addSubview(emailField)       // Third
    view.addSubview(submitButton)     // Last
}
```

### Custom Focus Order

**Override focus order when needed:**
- Use `accessibilityElements` array
- Specify exact navigation order
- Update when content changes

```swift
// ✅ Custom focus order
override var accessibilityElements: [Any]? {
    get {
        return [headerLabel, nameField, emailField, submitButton]
    }
    set {
        super.accessibilityElements = newValue
    }
}
```

### Focus Groups

**Group related elements:**
- Use container views to group
- Set container `isAccessibilityElement = false`
- Let child elements handle focus individually

```swift
// ✅ Focus grouping
let containerView = UIView()
containerView.isAccessibilityElement = false

let label1 = UILabel()
label1.isAccessibilityElement = true
label1.accessibilityLabel = "First item"

let label2 = UILabel()
label2.isAccessibilityElement = true
label2.accessibilityLabel = "Second item"

containerView.addSubview(label1)
containerView.addSubview(label2)
```

## Programmatic Focus

### Setting Focus

**Move focus programmatically:**
- Use `UIAccessibility.post()` with `.screenChanged`
- Focus specific element when screen loads
- Guide users to important content

```swift
// ✅ Set focus on screen load
override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    
    if UIAccessibility.isVoiceOverRunning {
        UIAccessibility.post(
            notification: .screenChanged,
            argument: mainContentLabel
        )
    }
}
```

### Focus After Actions

**Refocus after user actions:** Return focus to logical next element, focus confirmation messages, focus error messages.

### Focus Traps

**Avoid focus traps:** Ensure all screens have exit path, don't trap focus in modals without dismiss option, provide clear navigation options.

## Screen Changes

### Screen Changed Notification

**Announce screen changes:**
- Use `.screenChanged` when navigating
- Focus first element on new screen
- Announce screen title

```swift
// ✅ Screen change
func navigateToSettings() {
    let settingsVC = SettingsViewController()
    navigationController?.pushViewController(settingsVC, animated: true)
    
    // Announce screen change
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
        UIAccessibility.post(
            notification: .screenChanged,
            argument: settingsVC.titleLabel
        )
    }
}
```

### Modal Presentations

**Handle modal focus:** Focus first element in modal, provide clear dismiss option, announce modal purpose.

### Navigation Transitions

**Smooth navigation transitions:** Announce navigation changes, focus appropriate element on destination, maintain context.

## Dynamic Content

### Content Updates

**Handle dynamic content updates:** Announce when content loads, focus new content appropriately, update focus order if needed.

### Loading States

**Handle loading states:** Announce loading start, announce completion, focus content when ready.

### Error States

**Handle errors accessibly:** Focus error message, announce error clearly, provide recovery path.

### Best Practices Summary

**Focus Management Checklist:**
- ✅ Logical focus order maintained
- ✅ Focus indicators are visible
- ✅ Important announcements are posted
- ✅ Screen changes are announced
- ✅ Dynamic content updates are announced
- ✅ Errors focus and announce appropriately
- ✅ No focus traps in modals
- ✅ Focus returns to logical next element after actions
- ✅ Loading states are announced
- ✅ All announcements are localized
