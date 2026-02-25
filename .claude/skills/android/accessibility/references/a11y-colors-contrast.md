---
name: a11y-colors-contrast
description: Color and contrast accessibility — WCAG contrast ratios, Material 3 semantic tokens, dark theme testing
---

# Color and Contrast Accessibility Rules

## Purpose

Accessibility rules for color usage and contrast ratios in Android apps, ensuring content is perceivable by users with color vision deficiencies and low vision, meeting WCAG 2.1 AA standards.

## Table of Contents

- [Contrast Requirements](#contrast-requirements)
- [Color Independence](#color-independence)
- [Material 3 Semantic Colors](#material-3-semantic-colors)
- [Interactive Elements](#interactive-elements)
- [Visual Indicators](#visual-indicators)
- [Testing](#testing)

## Related Documents

- [a11y-core](./a11y-core.md) - Core accessibility principles
- [a11y-buttons](./a11y-buttons.md) - Button accessibility
- [a11y-forms](./a11y-forms.md) - Form accessibility
- [a11y-testing](./a11y-testing.md) - Testing guidelines

## Contrast Requirements

### WCAG 2.1 AA Standards

**Contrast ratio requirements:**
- **Normal text** (under 18sp): 4.5:1 minimum
- **Large text** (18sp+ or 14sp+ bold): 3:1 minimum
- **UI components** (buttons, icons, inputs): 3:1 minimum for visual boundaries
- **Graphics**: 3:1 minimum for essential information

### Text Contrast Examples

```kotlin
// ✅ Good contrast — use Material 3 semantic colors
Text(
    "Body text",
    color = MaterialTheme.colorScheme.onBackground // adapts to light/dark
)

// ✅ On surface variants maintain proper contrast
Text(
    "Secondary text",
    color = MaterialTheme.colorScheme.onSurfaceVariant
)

// ❌ Poor contrast — hardcoded colors
Text(
    "Hard to read",
    color = Color(0xFF888888) // Medium gray on white — may fail 4.5:1
)
```

## Color Independence

### Don't Rely on Color Alone

**WCAG requirement (1.4.1):**
- Color cannot be the only means of conveying information
- Use additional indicators: icons, text, patterns, shapes
- Ensure information is accessible without color perception

```kotlin
// ✅ Good: Color + icon + text
@Composable
fun StatusIndicator(isOnline: Boolean) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            imageVector = if (isOnline) Icons.Default.CheckCircle else Icons.Default.Cancel,
            contentDescription = null, // decorative — text provides info
            tint = if (isOnline) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error
        )
        Spacer(Modifier.width(4.dp))
        Text(if (isOnline) "Online" else "Offline")
    }
}

// ❌ Bad: Color only
@Composable
fun StatusIndicatorBad(isOnline: Boolean) {
    Box(
        modifier = Modifier
            .size(12.dp)
            .background(if (isOnline) Color.Green else Color.Red) // Color only!
    )
}
```

### Error Indicators

**Multiple indicators for errors:**

```kotlin
// ✅ Error with multiple indicators
OutlinedTextField(
    value = email,
    onValueChange = { email = it },
    label = { Text("Email address") },
    isError = hasError,           // Red border + icon (visual)
    supportingText = if (hasError) {
        { Text("Invalid email format") } // Text indicator
    } else null
)

// ✅ Custom error with color + icon + text
if (hasError) {
    Row(
        modifier = Modifier.semantics {
            liveRegion = LiveRegionMode.Assertive
        }
    ) {
        Icon(
            Icons.Default.Error,
            contentDescription = null, // text describes it
            tint = MaterialTheme.colorScheme.error
        )
        Spacer(Modifier.width(4.dp))
        Text(
            "Email is required",
            color = MaterialTheme.colorScheme.error
        )
    }
}
```

## Material 3 Semantic Colors

### Use Semantic Color Tokens

**Material 3 tokens adapt to light/dark and meet contrast requirements:**

| Token | Use Case |
|-------|----------|
| `onBackground` / `onSurface` | Primary text on backgrounds |
| `onSurfaceVariant` | Secondary/hint text (3:1 minimum) |
| `onPrimary` | Text on primary-colored backgrounds |
| `onSecondary` | Text on secondary-colored backgrounds |
| `onError` | Text on error-colored backgrounds |
| `primary` | Interactive elements, links |
| `error` | Error states, destructive actions |

```kotlin
// ✅ Semantic color usage
Text(
    "Primary content",
    color = MaterialTheme.colorScheme.onBackground
)
Text(
    "Helper text",
    color = MaterialTheme.colorScheme.onSurfaceVariant
)
Button(
    onClick = { },
    colors = ButtonDefaults.buttonColors(
        containerColor = MaterialTheme.colorScheme.primary,
        contentColor = MaterialTheme.colorScheme.onPrimary
    )
) { Text("Save") }
```

### Avoid Hardcoded Colors

```kotlin
// ❌ Avoid hardcoded colors — fail in dark mode or with custom themes
Text("Text", color = Color.Black) // Fails in dark mode
Text("Text", color = Color(0xFF212121)) // Hardcoded — may not adapt

// ✅ Use semantic tokens instead
Text("Text", color = MaterialTheme.colorScheme.onBackground)
```

## Interactive Elements

### Button Contrast

**Buttons must be distinguishable:**

```kotlin
// ✅ Primary button — MaterialTheme handles contrast automatically
Button(onClick = { }) {
    Text("Save") // onPrimary on primary — contrast guaranteed
}

// ✅ Outlined button — border provides visual boundary
OutlinedButton(onClick = { }) {
    Text("Cancel")
}

// ✅ Disabled state — clearly distinguishable
Button(onClick = { }, enabled = false) {
    Text("Save")
}
// Material 3 applies opacity to disabled state automatically
```

### Focus States

**Focus must be visually apparent:**

```kotlin
// ✅ Material 3 components have built-in focus indicators
// For custom composables, add visible focus state
val interactionSource = remember { MutableInteractionSource() }
val isFocused by interactionSource.collectIsFocusedAsState()

Box(
    modifier = Modifier
        .focusable(interactionSource = interactionSource)
        .border(
            width = if (isFocused) 2.dp else 0.dp,
            color = if (isFocused) MaterialTheme.colorScheme.primary else Color.Transparent,
            shape = RoundedCornerShape(4.dp)
        )
)
```

## Visual Indicators

### Status Indicators

**Status must be clear without color:**

```kotlin
// ✅ Multi-indicator status
sealed class ConnectionStatus {
    object Connected : ConnectionStatus()
    object Disconnected : ConnectionStatus()
    object Connecting : ConnectionStatus()
}

@Composable
fun StatusChip(status: ConnectionStatus) {
    val (icon, label, tint) = when (status) {
        is ConnectionStatus.Connected -> Triple(Icons.Default.CheckCircle, "Connected", MaterialTheme.colorScheme.primary)
        is ConnectionStatus.Disconnected -> Triple(Icons.Default.Cancel, "Disconnected", MaterialTheme.colorScheme.error)
        is ConnectionStatus.Connecting -> Triple(Icons.Default.Refresh, "Connecting", MaterialTheme.colorScheme.secondary)
    }

    AssistChip(
        onClick = { },
        label = { Text(label) },
        leadingIcon = { Icon(icon, contentDescription = null, tint = tint) }
    )
}
```

## Testing

### Android Accessibility Scanner

**Verify contrast ratios:**
- Use the [Accessibility Scanner](https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.auditor) app
- It checks contrast ratios in running app on-device
- Also checks touch target sizes and content descriptions

### Dark Theme Testing

**Test in both light and dark modes:**

```kotlin
// ✅ Preview both modes
@Preview(name = "Light Mode", uiMode = Configuration.UI_MODE_NIGHT_NO)
@Preview(name = "Dark Mode", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Composable
fun MyComponentPreview() {
    MyTheme {
        MyComponent()
    }
}
```

### Color Blindness Simulation

**Test with Android Developer Options:**
- Settings → Developer Options → Simulate color space
- Test with Deuteranomaly (red-green), Protanomaly, Tritanomaly
- Ensure information is conveyed without color

### Best Practices Summary

**Color and Contrast Checklist:**
- ✅ All text meets contrast requirements (4.5:1 normal, 3:1 large)
- ✅ Use Material 3 semantic color tokens, not hardcoded colors
- ✅ Interactive elements have sufficient contrast for boundaries
- ✅ Color is not the only indicator of information
- ✅ Icons, text, or shapes supplement color cues
- ✅ Error states use color + icon + text
- ✅ Status indicators use multiple visual cues
- ✅ Focus indicators are visible and high contrast
- ✅ Tested in both light and dark themes
- ✅ Tested with color blindness simulation
- ✅ Verified with Android Accessibility Scanner
