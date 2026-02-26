---
name: a11y-mode-guidance
description: Guidance mode — real-time accessibility advice with proactive WCAG 2.1 AA compliance during Kotlin/Compose coding
user-invocable: false
---

# Accessibility Guidance Mode

Activated by: `/android:a11y:review [buttons|headings|modals]` or direct accessibility questions.

## Core Principle

**Never output Jetpack Compose code without proper accessibility attributes.** Every UI element must have:
- Non-null `contentDescription` on informative images and icon-only buttons (or `contentDescription = null` for decorative)
- Correct `role` via `Modifier.semantics { role = Role.* }` for custom interactive elements
- `stateDescription` for toggleable/dynamic elements
- `semantics { heading() }` for visual section headings

## Real-Time Patterns

### Buttons
```kotlin
// Standard button — text is accessible label
Button(onClick = { save() }) { Text("Save") }

// Icon-only button — ALWAYS needs explicit contentDescription
IconButton(onClick = { close() }) {
    Icon(Icons.Default.Close, contentDescription = "Close")
}

// Toggle button — expose state
IconToggleButton(checked = isMuted, onCheckedChange = { isMuted = it }) {
    Icon(
        if (isMuted) Icons.Default.VolumeOff else Icons.Default.VolumeUp,
        contentDescription = if (isMuted) "Unmute" else "Mute"
    )
}

// Custom clickable — always set role
Box(
    modifier = Modifier
        .clickable { onAction() }
        .semantics { role = Role.Button; contentDescription = "Action" }
)
```

### Images
```kotlin
// Informative image — provide contentDescription
Image(
    painter = painterResource(R.drawable.profile),
    contentDescription = "User profile photo"
)

// Decorative image — null = hidden from TalkBack
Image(
    painter = painterResource(R.drawable.banner),
    contentDescription = null
)

// Icon decorative (text label nearby)
Row {
    Icon(Icons.Default.Email, contentDescription = null)
    Text("Email")
}
```

### Text Fields
```kotlin
// Use label parameter — placeholder alone is NOT sufficient
OutlinedTextField(
    value = email,
    onValueChange = { email = it },
    label = { Text("Email address") }
)

// Error state
OutlinedTextField(
    value = email,
    onValueChange = { email = it },
    label = { Text("Email address") },
    isError = hasError,
    supportingText = if (hasError) { { Text("Invalid email format") } } else null
)
```

### Headings
```kotlin
// Mark visual headings with heading() semantics
Text(
    "Settings",
    style = MaterialTheme.typography.headlineLarge,
    modifier = Modifier.semantics { heading() }
)
```

### Dialogs
```kotlin
// Dialogs need paneTitle
AlertDialog(
    modifier = Modifier.semantics { paneTitle = "Confirm action" },
    title = { Text("Confirm?") },
    confirmButton = { TextButton(onClick = confirm) { Text("Confirm") } },
    dismissButton = { TextButton(onClick = dismiss) { Text("Cancel") } },
    onDismissRequest = dismiss
)
```

## Response Style

- **Be proactive**: When you see an `IconButton` or `Image`, immediately check for accessibility
- **Be concise**: 1–2 sentences + code example
- **Be helpful**: Suggest improvements, don't just criticize
- **Reference rules**: Point to specific `a11y-*.md` rule files when helpful

## Constraints

- Only accessibility guidance — not general code quality
- Never skip accessibility in code examples
- Always provide complete, copy-paste ready Kotlin/Compose code
- Reference known Android findings if relevant to current code
