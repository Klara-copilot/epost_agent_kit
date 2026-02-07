---
name: a11y-images
description: Image accessibility — decorative vs informative, complex images, image buttons
---

# Image Accessibility Rules

## Purpose

Accessibility rules for images, icons, and visual content, ensuring VoiceOver users receive appropriate descriptions of visual information.

## Table of Contents

- [Image Basics](#image-basics)
- [Decorative Images](#decorative-images)
- [Informative Images](#informative-images)
- [Image Labels](#image-labels)
- [Complex Images](#complex-images)
- [Image Buttons](#image-buttons)

## Related Documents

- [a11y-core](./a11y-core.md) - Core accessibility principles
- [a11y-buttons](./a11y-buttons.md) - Button accessibility
- [a11y-colors-contrast](./a11y-colors-contrast.md) - Visual accessibility

## Image Basics

### UIImageView Accessibility

**Default behavior:**
- `UIImageView` is accessible by default
- Image name may be read, but shouldn't be relied upon
- Always provide explicit `accessibilityLabel`
- Use `.image` trait for images

```swift
// ✅ Image with label
let imageView = UIImageView(image: UIImage(named: "profile"))
imageView.accessibilityLabel = "User profile photo"
imageView.accessibilityTraits = .image
// VoiceOver reads: "User profile photo, Image"
```

### Image Trait

**Set `.image` trait:**
- Identifies element as image to VoiceOver
- Required for image elements
- Use for all image content

```swift
// ✅ Image trait
let photoView = UIImageView()
photoView.image = UIImage(named: "landscape")
photoView.accessibilityLabel = "Mountain landscape"
photoView.accessibilityTraits = .image
```

## Decorative Images

### Marking Decorative Images

**Decorative images should be ignored:**
- Set `isAccessibilityElement = false`
- Don't provide label for decorative images
- Examples: borders, dividers, background patterns

```swift
// ✅ Decorative image
let decorativeIcon = UIImageView(image: UIImage(systemName: "sparkles"))
decorativeIcon.isAccessibilityElement = false
// VoiceOver will skip this image
```

### When to Mark Decorative

**Mark as decorative when:**
- Image is purely visual decoration
- Image doesn't convey information
- Image is redundant with text nearby
- Image is background pattern

```swift
// ✅ Decorative examples
let dividerImage = UIImageView(image: UIImage(named: "divider"))
dividerImage.isAccessibilityElement = false // Decorative divider

let backgroundPattern = UIImageView(image: UIImage(named: "pattern"))
backgroundPattern.isAccessibilityElement = false // Background only

// ✅ Informative (not decorative)
let chartImage = UIImageView(image: UIImage(named: "sales-chart"))
chartImage.accessibilityLabel = "Sales chart showing 25% increase"
chartImage.accessibilityTraits = .image
```

## Informative Images

### Image Labels

**Provide descriptive labels:**
- Describe what image shows
- Be concise but informative
- Don't start with "Image of" or "Picture of"
- Focus on content, not appearance

```swift
// ✅ Good image labels
imageView.accessibilityLabel = "User profile photo"
imageView.accessibilityLabel = "Mountain landscape at sunset"
imageView.accessibilityLabel = "Sales chart showing upward trend"
imageView.accessibilityLabel = "Company logo"

// ❌ Bad image labels
imageView.accessibilityLabel = "Image" // Too generic
imageView.accessibilityLabel = "Picture of a mountain" // Redundant
imageView.accessibilityLabel = "Beautiful sunset photo with mountains" // Too verbose
imageView.accessibilityLabel = "IMG_1234" // File name
```

### Contextual Labels

**Labels should match context:**
- Consider surrounding content
- Don't repeat information from nearby text
- Provide additional context when needed

```swift
// ✅ Contextual label
let profileImageView = UIImageView()
profileImageView.image = user.profileImage

// If name is nearby
profileImageView.accessibilityLabel = "Profile photo"
// If name is not visible
profileImageView.accessibilityLabel = "\(user.name)'s profile photo"
```

## Image Labels

### Label Guidelines

**Writing image labels:**
- Be specific ("Mountain" not "Landscape")
- Include important details
- Match user's information needs
- Keep under 10 words when possible

```swift
// ✅ Specific labels
chartView.accessibilityLabel = "Sales increased 25% this quarter"
diagramView.accessibilityLabel = "User flow diagram showing login process"
mapView.accessibilityLabel = "Map showing user's current location"

// ❌ Vague labels
chartView.accessibilityLabel = "Chart" // Not specific
diagramView.accessibilityLabel = "Diagram" // Too generic
```

### Dynamic Image Labels

**Update labels when images change:**
- Refresh accessibility properties
- Announce significant changes
- Maintain context

```swift
// ✅ Dynamic image update
func updateProfileImage(_ image: UIImage, for user: User) {
    profileImageView.image = image
    profileImageView.accessibilityLabel = "\(user.name)'s profile photo"
    
    // Announce if significant
    if UIAccessibility.isVoiceOverRunning {
        UIAccessibility.post(
            notification: .announcement,
            argument: "Profile photo updated"
        )
    }
}
```

## Complex Images

### Charts and Graphs

**Describe data, not appearance:**
- Focus on data insights
- Include key numbers/percentages
- Describe trends or patterns
- Consider providing data table alternative

```swift
// ✅ Chart description
let chartView = UIImageView(image: chartImage)
chartView.accessibilityLabel = "Sales chart"
chartView.accessibilityValue = "Sales increased from $10,000 to $15,000 over 6 months, showing 50% growth"

// Or provide detailed description
chartView.accessibilityLabel = "Sales chart showing 50% growth over 6 months, from $10,000 to $15,000"
```

### Diagrams and Flowcharts

**Describe structure and flow:**
- Explain what diagram shows
- Describe relationships
- Include key steps or connections

```swift
// ✅ Diagram description
let flowDiagram = UIImageView(image: diagramImage)
flowDiagram.accessibilityLabel = "User registration flow diagram"
flowDiagram.accessibilityValue = "Shows steps: enter email, verify email, create password, complete profile"
```

### Maps

**Describe location and context:**
- Identify what map shows
- Include location names
- Describe relevant features

```swift
// ✅ Map description
let mapView = UIImageView(image: mapImage)
mapView.accessibilityLabel = "Map of downtown area"
mapView.accessibilityValue = "Shows user's current location at Main Street and 5th Avenue, with nearby restaurants highlighted"
```

## Image Buttons

### Image-Only Buttons

**Buttons with images need labels:**
- Describe action, not image
- Use button label guidelines
- Set `.button` trait, not `.image`

```swift
// ✅ Image button
let closeButton = UIButton(type: .system)
closeButton.setImage(UIImage(systemName: "xmark"), for: .normal)
closeButton.accessibilityLabel = "Close"
closeButton.accessibilityTraits = .button
// VoiceOver reads: "Close, Button"

// ❌ Wrong: Using image trait
closeButton.accessibilityTraits = .image // Wrong! Should be .button
```

### Buttons with Image and Text

**Prefer text as label:**
- Use visible text for accessibility label
- Image is decorative in this case
- Don't mention image in label

```swift
// ✅ Button with image and text
let saveButton = UIButton(type: .system)
saveButton.setTitle("Save", for: .normal)
saveButton.setImage(UIImage(systemName: "checkmark"), for: .normal)
saveButton.accessibilityLabel = "Save"
saveButton.accessibilityTraits = .button
// Image is decorative, text is used for label
```

### Icon Buttons

**Icon buttons require descriptive labels:**
- Describe action, not icon appearance
- Use standard icon labels when possible
- Provide hint if action needs clarification

```swift
// ✅ Icon button labels
let iconButtons: [(UIImage?, String, String?)] = [
    (UIImage(systemName: "xmark"), "Close", nil),
    (UIImage(systemName: "heart"), "Favorite", "Adds to favorites"),
    (UIImage(systemName: "share"), "Share", "Opens share options"),
    (UIImage(systemName: "trash"), "Delete", "Deletes selected item")
]

for (icon, label, hint) in iconButtons {
    let button = UIButton(type: .system)
    button.setImage(icon, for: .normal)
    button.accessibilityLabel = label
    if let hint = hint {
        button.accessibilityHint = hint
    }
    button.accessibilityTraits = .button
}
```

### Best Practices Summary

**Image Accessibility Checklist:** All informative images have `accessibilityLabel`, decorative images have `isAccessibilityElement = false`, images use `.image` trait (not buttons), image buttons use `.button` trait with action labels, labels describe content not appearance, complex images have detailed descriptions, charts/graphs describe data insights, labels are concise but informative, dynamic images update accessibility properties, all labels are localized.
