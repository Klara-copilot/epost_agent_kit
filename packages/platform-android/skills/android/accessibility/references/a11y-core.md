---
name: a11y-core
description: Core accessibility principles for Android — WCAG 2.1 AA, TalkBack, Jetpack Compose semantics patterns
---

# Accessibility Core Rules

## Purpose

Foundational accessibility rules for Android TalkBack support, ensuring all UI elements are accessible and follow WCAG 2.1 AA standards using Jetpack Compose semantics.

## Table of Contents

- [Core Principles](#core-principles)
- [Making Elements Accessible](#making-elements-accessible)
- [Semantics Block](#semantics-block)
- [TalkBack Detection](#talkback-detection)
- [Required Properties](#required-properties)
- [Best Practices](#best-practices)

## Related Documents

- [a11y-buttons](./a11y-buttons.md) - Button-specific accessibility
- [a11y-forms](./a11y-forms.md) - Form input accessibility
- [a11y-headings](./a11y-headings.md) - Heading structure
- [a11y-focus](./a11y-focus.md) - Focus management
- [a11y-images](./a11y-images.md) - Image accessibility
- [a11y-colors-contrast](./a11y-colors-contrast.md) - Color and contrast
- [a11y-testing](./a11y-testing.md) - Testing guidelines

## Core Principles

**WCAG 2.1 AA Requirements:**
- **Perceivable**: UI elements must be detectable by assistive technologies
- **Operable**: All interactive elements must be keyboard/TalkBack navigable
- **Understandable**: Labels, hints, and values must be clear
- **Robust**: Accessibility properties must be correctly set

**Android-Specific:**
- All interactive elements must be TalkBack accessible
- Use `Modifier.semantics {}` block for Compose elements
- `contentDescription` must be concise and descriptive
- Use `clearAndSetSemantics {}` to override default semantics for containers

## Making Elements Accessible

### Standard Compose Components

**Built-in accessibility:**
- `Button`, `IconButton`, `TextField`, `Text` are accessible by default when used correctly
- `Image` with `contentDescription = null` marks it as decorative
- Interactive elements require non-null `contentDescription` or semantics role

```kotlin
// ✅ Standard button — accessible by default when contentDescription set
Button(onClick = { /* action */ }) {
    Text("Save")
}
// TalkBack reads: "Save, Button"

// ✅ Icon button — MUST provide contentDescription
IconButton(onClick = { /* close */ }) {
    Icon(Icons.Default.Close, contentDescription = "Close")
}
```

### Custom Composables

**Custom elements need explicit semantics:**

```kotlin
// ✅ Correct: Custom clickable with semantics
Box(
    modifier = Modifier
        .clickable { onAction() }
        .semantics {
            contentDescription = "Custom action"
            role = Role.Button
        }
) {
    // content
}

// ❌ Wrong: Clickable without semantics
Box(modifier = Modifier.clickable { onAction() }) {
    // TalkBack won't know this is interactive
}
```

### Container Views

**Containers with multiple elements:**

```kotlin
// ✅ Container merges children semantics by default in Compose
// Use mergeDescendants to combine child descriptions
Row(
    modifier = Modifier.semantics(mergeDescendants = true) {}
) {
    Icon(Icons.Default.Star, contentDescription = null) // decorative within group
    Text("Favorite item")
}
// TalkBack reads: "Favorite item"

// ✅ clearAndSetSemantics overrides all child semantics
Row(
    modifier = Modifier.clearAndSetSemantics {
        contentDescription = "Favorite item"
        role = Role.Button
    }
) {
    Icon(Icons.Default.Star, contentDescription = null)
    Text("Favorite item")
}
```

## Semantics Block

### Common Semantics Properties

**Purpose:** Define accessibility properties for Compose elements

```kotlin
// Full semantics example
Modifier.semantics {
    contentDescription = "User profile photo"  // Labels the element
    role = Role.Button                          // Describes element type
    stateDescription = "Selected"              // Current state
    heading()                                  // Marks as heading
    disabled()                                 // Marks as disabled
    onClick(label = "Open profile") { true }   // Custom action label
}
```

### clearAndSetSemantics

**Replaces all child semantics — use for complex containers:**

```kotlin
// ✅ Override merged semantics for a row
Row(
    modifier = Modifier.clearAndSetSemantics {
        contentDescription = "Send message button"
        role = Role.Button
    }
) {
    Icon(Icons.Default.Send, contentDescription = null)
    Text("Send")
}
```

## TalkBack Detection

### Check TalkBack Status

**Detect if TalkBack is running:**

```kotlin
import android.view.accessibility.AccessibilityManager

val accessibilityManager = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
val isTalkBackEnabled = accessibilityManager.isEnabled && accessibilityManager.isTouchExplorationEnabled

if (isTalkBackEnabled) {
    // Adjust UI behavior for TalkBack users
}
```

### Compose: Detect Accessibility

```kotlin
@Composable
fun rememberIsTalkBackEnabled(): Boolean {
    val context = LocalContext.current
    val accessibilityManager = remember {
        context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
    }
    return remember {
        accessibilityManager.isEnabled && accessibilityManager.isTouchExplorationEnabled
    }
}
```

## Required Properties

### Minimum Requirements

**Every accessible element must have:**
1. Non-null `contentDescription` (or `Role` set via semantics)
2. Correct `Role` when not a standard component
3. `stateDescription` for dynamic/toggleable elements

**Optional but recommended:**
- `onClick(label = "...")` for custom action descriptions
- `liveRegion` for auto-updating content

### Property Order

**Set semantics in this order:**

```kotlin
Modifier.semantics {
    contentDescription = "Element name"   // 1. Identity
    role = Role.Button                    // 2. Type
    stateDescription = "Current value"   // 3. State (if dynamic)
    disabled()                            // 4. Disabled state (if applicable)
}
```

## Best Practices

### ContentDescription Writing

**Guidelines:**
- Use nouns for static elements ("Profile photo")
- Keep concise (1–3 words when possible)
- Match visible text when applicable
- Avoid redundant words ("button" already implied by Role.Button)

```kotlin
// ✅ Good: Concise, clear
Icon(Icons.Default.Close, contentDescription = "Close")

// ✅ Good: Matches visible text
Button(onClick = { }) { Text("Delete") }
// No need for explicit contentDescription — Text is read

// ❌ Bad: Redundant
Icon(Icons.Default.Close, contentDescription = "Close button") // "button" redundant with role
```

### Dynamic ContentDescription

**Update descriptions when content changes:**

```kotlin
val isFavorite by viewModel.isFavorite.collectAsState()

IconButton(onClick = viewModel::toggleFavorite) {
    Icon(
        if (isFavorite) Icons.Filled.Favorite else Icons.Default.FavoriteBorder,
        contentDescription = if (isFavorite) "Remove from favorites" else "Add to favorites"
    )
}
```

### Localization

**All accessibility strings must be localized:**

```kotlin
Icon(
    Icons.Default.Close,
    contentDescription = stringResource(R.string.close_button_description)
)
```
