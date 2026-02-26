---
name: a11y-images
description: Image accessibility — decorative vs informative, clearAndSetSemantics, complex images, image buttons
---

# Image Accessibility Rules

## Purpose

Accessibility rules for images, icons, and visual content in Jetpack Compose, ensuring TalkBack users receive appropriate descriptions of visual information.

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

### Compose Image Accessibility

**The `contentDescription` parameter controls accessibility:**
- Non-null `contentDescription` → element is announced by TalkBack
- `contentDescription = null` → element is decorative and ignored by TalkBack

```kotlin
// ✅ Informative image — provide contentDescription
Image(
    painter = painterResource(R.drawable.profile_photo),
    contentDescription = "User profile photo"
)
// TalkBack reads: "User profile photo, Image"

// ✅ Decorative image — null = skipped by TalkBack
Image(
    painter = painterResource(R.drawable.decorative_banner),
    contentDescription = null
)
```

### Icon Accessibility

**`Icon` composable follows the same pattern:**

```kotlin
// ✅ Informative icon
Icon(
    imageVector = Icons.Default.Warning,
    contentDescription = "Warning: action required"
)

// ✅ Decorative icon (label text nearby)
Row {
    Icon(Icons.Default.Email, contentDescription = null) // decorative — "Email" text follows
    Text("Email")
}
```

## Decorative Images

### Marking Decorative Images

**Decorative images must have `contentDescription = null`:**

```kotlin
// ✅ Decorative image — skipped by TalkBack
Image(
    painter = painterResource(R.drawable.divider),
    contentDescription = null
)

// ✅ Decorative icon in a button that has text
Button(onClick = { save() }) {
    Icon(Icons.Default.Save, contentDescription = null) // decorative
    Spacer(Modifier.width(8.dp))
    Text("Save")
}
// TalkBack reads: "Save, Button"
```

### When to Mark Decorative

**Mark as decorative (`contentDescription = null`) when:**
- Image is purely visual decoration
- Image doesn't convey information
- Image is redundant with nearby text
- Image is a background pattern or border

```kotlin
// ✅ Decorative examples
Image(painter = painterResource(R.drawable.pattern_bg), contentDescription = null)
Icon(Icons.Default.ArrowForward, contentDescription = null) // when text label follows

// ✅ Informative (not decorative)
Image(
    painter = painterResource(R.drawable.sales_chart),
    contentDescription = "Sales chart showing 25% increase this quarter"
)
```

### clearAndSetSemantics for Containers

**Override merged semantics for image-containing groups:**

```kotlin
// ✅ Container with image + text — use clearAndSetSemantics
Row(
    modifier = Modifier.clearAndSetSemantics {
        contentDescription = "Notifications: 5 unread"
    }
) {
    Icon(Icons.Default.Notifications, contentDescription = null)
    Text("Notifications")
    Badge { Text("5") }
}
```

## Informative Images

### Image Labels

**Provide descriptive contentDescription:**
- Describe what image shows
- Be concise but informative
- Don't start with "Image of" or "Picture of"
- Focus on content meaning

```kotlin
// ✅ Good image contentDescriptions
Image(painter = ..., contentDescription = "User profile photo")
Image(painter = ..., contentDescription = "Mountain landscape at sunset")
Image(painter = ..., contentDescription = "Sales chart showing upward trend")
Image(painter = ..., contentDescription = "Company logo")

// ❌ Bad contentDescriptions
Image(painter = ..., contentDescription = "Image") // Too generic
Image(painter = ..., contentDescription = "Picture of mountain") // Redundant prefix
Image(painter = ..., contentDescription = "profile_photo_1234.jpg") // File name
```

### Contextual Labels

**Labels should match context:**

```kotlin
// ✅ Contextual label — if user name is nearby, simplified label is fine
Column {
    Image(
        painter = rememberAsyncImagePainter(user.avatarUrl),
        contentDescription = "Profile photo" // name is shown in Text below
    )
    Text(user.name)
}

// ✅ Without nearby name context, include name
Image(
    painter = rememberAsyncImagePainter(user.avatarUrl),
    contentDescription = "${user.name}'s profile photo"
)
```

## Image Labels

### Dynamic Image Labels

**Update contentDescription when images change:**

```kotlin
// ✅ Dynamic image — update description with state
val user by viewModel.user.collectAsState()

Image(
    painter = rememberAsyncImagePainter(user.avatarUrl),
    contentDescription = "${user.name}'s profile photo",
    modifier = Modifier.semantics {
        // liveRegion if image changes dynamically
        liveRegion = LiveRegionMode.Polite
    }
)
```

## Complex Images

### Charts and Graphs

**Describe data insights, not appearance:**

```kotlin
// ✅ Chart with data description
Image(
    painter = painterResource(R.drawable.sales_chart),
    contentDescription = "Sales chart: increased from $10,000 to $15,000 over 6 months, 50% growth"
)

// ✅ Or provide data as supplementary text
Column {
    Image(
        painter = painterResource(R.drawable.sales_chart),
        contentDescription = "Sales chart"
    )
    Text(
        "Sales increased 50% over 6 months",
        modifier = Modifier.semantics { heading() }
    )
}
```

### Diagrams and Flowcharts

**Describe structure and flow:**

```kotlin
// ✅ Diagram description
Image(
    painter = painterResource(R.drawable.user_flow),
    contentDescription = "User registration flow: enter email → verify email → create password → complete profile"
)
```

## Image Buttons

### Image-Only Buttons

**Buttons with images need action-oriented contentDescription:**
- Describe the action, not the image
- Use `Role.Button` semantics, not image role

```kotlin
// ✅ Image button — describe action
IconButton(onClick = { close() }) {
    Icon(Icons.Default.Close, contentDescription = "Close")
}
// TalkBack reads: "Close, Button"

// ✅ Custom image button
Image(
    painter = painterResource(R.drawable.close_icon),
    contentDescription = "Close",
    modifier = Modifier
        .clickable { close() }
        .semantics { role = Role.Button }
)
```

### Buttons with Image and Text

**When button has text, image is decorative:**

```kotlin
// ✅ Text button with decorative icon
Button(onClick = { save() }) {
    Icon(Icons.Default.Check, contentDescription = null) // decorative
    Spacer(Modifier.width(8.dp))
    Text("Save")
}
// TalkBack reads: "Save, Button" — icon is ignored
```

### Best Practices Summary

**Image Accessibility Checklist:**
- ✅ Informative images have non-null `contentDescription`
- ✅ Decorative images have `contentDescription = null`
- ✅ Icons in buttons with text have `contentDescription = null`
- ✅ Standalone icon buttons have descriptive `contentDescription`
- ✅ Image buttons use `Role.Button` (not image trait)
- ✅ Complex images describe data/content, not appearance
- ✅ Labels are concise but informative (no "Image of" prefix)
- ✅ Dynamic images update `contentDescription` when content changes
- ✅ Containers use `clearAndSetSemantics {}` when needed
- ✅ All contentDescriptions are localized via `stringResource()`
