---
name: a11y-buttons
description: Button accessibility rules — contentDescription, Role.Button, states, icon buttons, toggle buttons, custom clickables
---

# Button Accessibility Rules

## Purpose

Accessibility rules specific to buttons and interactive elements in Jetpack Compose, ensuring TalkBack users can identify and interact with all buttons.

## Table of Contents

- [Button Basics](#button-basics)
- [Button Labels](#button-labels)
- [Button States](#button-states)
- [Toggle Buttons](#toggle-buttons)
- [Icon Buttons](#icon-buttons)
- [Custom Clickable Elements](#custom-clickable-elements)

## Related Documents

- [a11y-core](./a11y-core.md) - Core accessibility principles
- [a11y-forms](./a11y-forms.md) - Form accessibility
- [a11y-focus](./a11y-focus.md) - Focus management

## Button Basics

### Standard Button

**Default Behavior:**
- `Button` with `Text` child is accessible by default
- Text content is read as the label automatically
- `Role.Button` is applied automatically
- No additional setup needed for text-only buttons

```kotlin
// ✅ Standard button — automatically accessible
Button(onClick = { saveDocument() }) {
    Text("Save")
}
// TalkBack reads: "Save, Button"
```

### Role.Button

**Always ensure Role.Button for interactive elements:**

```kotlin
// ✅ Custom clickable with explicit button role
Box(
    modifier = Modifier
        .clickable { onAction() }
        .semantics {
            role = Role.Button
            contentDescription = "Custom action"
        }
)

// ✅ Multiple semantics
Box(
    modifier = Modifier.semantics {
        role = Role.Button
        contentDescription = "Favorite"
        stateDescription = if (isFavorite) "Selected" else "Not selected"
    }
)
```

## Button Labels

### Label Guidelines

**Rules:**
- Use action words ("Save", "Delete", "Cancel")
- Match visible button text when possible
- Keep concise (1–2 words preferred)
- No trailing punctuation

```kotlin
// ✅ Good: Text buttons use Text content as label
Button(onClick = { }) { Text("Save") }
Button(onClick = { }) { Text("Delete item") }
Button(onClick = { }) { Text("Cancel") }

// ✅ Good: Icon button with explicit description
IconButton(onClick = { }) {
    Icon(Icons.Default.Close, contentDescription = "Close")
}

// ❌ Bad: Missing contentDescription on icon button
IconButton(onClick = { }) {
    Icon(Icons.Default.Close, contentDescription = null) // TalkBack reads nothing
}
```

### Buttons with Icons and Text

**Prefer text content as the semantic label:**

```kotlin
// ✅ Button with icon and text — text is used as label
Button(onClick = { }) {
    Icon(Icons.Default.Check, contentDescription = null) // decorative
    Spacer(Modifier.width(8.dp))
    Text("Save")
}
// TalkBack reads: "Save, Button"

// ✅ Explicit override if needed
Button(
    onClick = { },
    modifier = Modifier.semantics { contentDescription = "Save document" }
) {
    Icon(Icons.Default.Check, contentDescription = null)
    Spacer(Modifier.width(8.dp))
    Text("Save")
}
```

## Button States

### Enabled/Disabled

**Disabled buttons:**
- Pass `enabled = false` to Button — TalkBack announces "dimmed" automatically
- For custom clickables, use `semantics { disabled() }`

```kotlin
// ✅ Disabled standard button
Button(
    onClick = { },
    enabled = false
) {
    Text("Save")
}
// TalkBack reads: "Save, Button, Dimmed"

// ✅ Custom disabled element
Box(
    modifier = Modifier.semantics {
        role = Role.Button
        contentDescription = "Save"
        disabled()
    }
)
```

### Selected State

**Selected buttons:**
- Use `stateDescription` to indicate selection

```kotlin
// ✅ Filter chip with selected state
FilterChip(
    selected = isSelected,
    onClick = { },
    label = { Text("Inbox") }
)
// TalkBack reads: "Inbox, Checkbox, Checked/Unchecked"

// ✅ Custom selected button
Box(
    modifier = Modifier.semantics {
        role = Role.Button
        contentDescription = "Dark mode"
        stateDescription = if (isEnabled) "On" else "Off"
    }
)
```

### Loading State

**Buttons in loading state:**

```kotlin
// ✅ Loading button
@Composable
fun LoadingButton(isLoading: Boolean, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        enabled = !isLoading,
        modifier = Modifier.semantics {
            contentDescription = if (isLoading) "Loading, please wait" else "Submit"
        }
    ) {
        if (isLoading) {
            CircularProgressIndicator(Modifier.size(16.dp))
        } else {
            Text("Submit")
        }
    }
}
```

## Toggle Buttons

### Toggle Button Pattern

**Expose toggle state via stateDescription:**

```kotlin
// ✅ Toggle button with state
var isMuted by remember { mutableStateOf(false) }

IconToggleButton(
    checked = isMuted,
    onCheckedChange = { isMuted = it }
) {
    Icon(
        if (isMuted) Icons.Default.VolumeOff else Icons.Default.VolumeUp,
        contentDescription = if (isMuted) "Unmute" else "Mute"
    )
}
// TalkBack reads: "Mute, Toggle button, Not pressed" / "Unmute, Toggle button, Pressed"

// ✅ Custom toggle with explicit state
Box(
    modifier = Modifier
        .clickable { isDarkMode = !isDarkMode }
        .semantics {
            role = Role.Switch
            contentDescription = "Dark mode"
            stateDescription = if (isDarkMode) "On" else "Off"
        }
)
```

### Switch Component

**Switch is accessible by default:**

```kotlin
// ✅ Switch with label
Row(verticalAlignment = Alignment.CenterVertically) {
    Text("Notifications")
    Switch(
        checked = notificationsEnabled,
        onCheckedChange = { notificationsEnabled = it },
        modifier = Modifier.semantics {
            contentDescription = "Notifications"
            stateDescription = if (notificationsEnabled) "Enabled" else "Disabled"
        }
    )
}
```

## Icon Buttons

### Icon-Only Buttons

**Icons without text MUST have contentDescription:**

```kotlin
// ✅ Icon button labels — describe action, not icon appearance
IconButton(onClick = { dismiss() }) {
    Icon(Icons.Default.Close, contentDescription = "Close")
}

IconButton(onClick = { openSettings() }) {
    Icon(Icons.Default.Settings, contentDescription = "Settings")
}

IconButton(onClick = { share() }) {
    Icon(Icons.Default.Share, contentDescription = "Share")
}

// ✅ With hint via semantics
IconButton(
    onClick = { openHelp() },
    modifier = Modifier.semantics {
        onClick(label = "Opens help documentation") { true }
    }
) {
    Icon(Icons.Default.Info, contentDescription = "Help")
}
```

### Common Icon ContentDescriptions

**Standard icon mappings:** Close/✕ → "Close", Check/✓ → "Done" or "Confirm", Settings/⚙ → "Settings", Info/ℹ → "Information", Favorite/♥ → "Add to favorites" or "Remove from favorites", Share/📤 → "Share", Delete/🗑 → "Delete", Edit/✏ → "Edit"

## Custom Clickable Elements

### Custom Button Classes

**Custom interactive composables:**

```kotlin
// ✅ Custom card button
@Composable
fun ClickableCard(
    title: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .clickable(onClick = onClick)
            .semantics {
                role = Role.Button
                contentDescription = title
            }
    ) {
        Text(title, modifier = Modifier.padding(16.dp))
    }
}
```

### Best Practices Summary

**Button Accessibility Checklist:**
- ✅ Text buttons use visible text as TalkBack label
- ✅ Icon-only buttons have non-null contentDescription
- ✅ Custom clickables use `semantics { role = Role.Button }`
- ✅ Toggle state exposed via `stateDescription`
- ✅ Disabled state set via `enabled = false` or `semantics { disabled() }`
- ✅ Switch uses `Role.Switch` with stateDescription
- ✅ Hints provided via `onClick(label = "...")` when action isn't obvious
- ✅ All contentDescriptions are localized via `stringResource()`
