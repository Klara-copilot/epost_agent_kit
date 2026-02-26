---
name: a11y-focus
description: Focus management — FocusRequester, LaunchedEffect, liveRegion, paneTitle on dialogs, announcements
---

# Focus Management Rules

## Purpose

Accessibility rules for managing focus, announcements, and TalkBack navigation in Jetpack Compose, ensuring users can effectively navigate and understand focus changes.

## Table of Contents

- [Focus Basics](#focus-basics)
- [Programmatic Focus](#programmatic-focus)
- [Live Regions and Announcements](#live-regions-and-announcements)
- [Focus Order](#focus-order)
- [Screen Changes and Dialogs](#screen-changes-and-dialogs)
- [Dynamic Content](#dynamic-content)

## Related Documents

- [a11y-core](./a11y-core.md) - Core accessibility principles
- [a11y-headings](./a11y-headings.md) - Heading navigation
- [a11y-forms](./a11y-forms.md) - Form focus

## Focus Basics

### Default Focus Order

**Compose follows layout order:**
- Focus naturally follows the composition order (top-to-bottom, left-to-right)
- LazyColumn/LazyRow items are focusable in order
- Use logical composition order to ensure correct focus traversal

```kotlin
// ✅ Logical focus order — composition order matches navigation order
Column {
    Text("Welcome", modifier = Modifier.semantics { heading() }) // 1
    OutlinedTextField(value = email, onValueChange = {}, label = { Text("Email") }) // 2
    OutlinedTextField(value = password, onValueChange = {}, label = { Text("Password") }) // 3
    Button(onClick = { }) { Text("Sign in") } // 4
}
```

### Focus Indicators

**Visual focus indicators:**
- Material 3 components have built-in focus indicators
- Custom composables should show focus state

```kotlin
// ✅ Custom focus indicator
val interactionSource = remember { MutableInteractionSource() }
val isFocused by interactionSource.collectIsFocusedAsState()

Box(
    modifier = Modifier
        .focusable(interactionSource = interactionSource)
        .border(
            width = if (isFocused) 2.dp else 0.dp,
            color = if (isFocused) MaterialTheme.colorScheme.primary else Color.Transparent
        )
)
```

## Programmatic Focus

### FocusRequester

**Move focus programmatically:**

```kotlin
// ✅ Request focus on screen load
@Composable
fun SearchScreen() {
    val focusRequester = remember { FocusRequester() }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }

    OutlinedTextField(
        value = query,
        onValueChange = { query = it },
        label = { Text("Search") },
        modifier = Modifier.focusRequester(focusRequester)
    )
}
```

### Focus After Actions

**Return focus after user actions:**

```kotlin
// ✅ Focus management after dialog dismissal
@Composable
fun DeleteConfirmationButton(onDelete: () -> Unit) {
    val focusRequester = remember { FocusRequester() }
    var showDialog by remember { mutableStateOf(false) }

    Button(
        onClick = { showDialog = true },
        modifier = Modifier.focusRequester(focusRequester)
    ) {
        Text("Delete")
    }

    if (showDialog) {
        AlertDialog(
            onDismissRequest = {
                showDialog = false
                focusRequester.requestFocus() // Return focus to trigger
            },
            confirmButton = {
                TextButton(onClick = {
                    showDialog = false
                    onDelete()
                }) { Text("Confirm") }
            },
            dismissButton = {
                TextButton(onClick = {
                    showDialog = false
                    focusRequester.requestFocus() // Return focus on cancel
                }) { Text("Cancel") }
            },
            title = { Text("Delete item?") }
        )
    }
}
```

### Focus Order Override

**Custom focus traversal:**

```kotlin
// ✅ Custom focus order with FocusRequester
val (first, second, third) = remember { FocusRequester.createRefs() }

Column {
    Button(
        onClick = { },
        modifier = Modifier
            .focusRequester(first)
            .focusProperties { next = second }
    ) { Text("First") }

    Button(
        onClick = { },
        modifier = Modifier
            .focusRequester(second)
            .focusProperties { next = third; previous = first }
    ) { Text("Second") }

    Button(
        onClick = { },
        modifier = Modifier
            .focusRequester(third)
            .focusProperties { previous = second }
    ) { Text("Third") }
}
```

## Live Regions and Announcements

### LiveRegion

**Announce dynamic content updates:**

```kotlin
// ✅ Live region — polite announcement (doesn't interrupt current speech)
Text(
    text = "Items in cart: $cartCount",
    modifier = Modifier.semantics {
        liveRegion = LiveRegionMode.Polite
    }
)

// ✅ Assertive — interrupts current speech for urgent messages
Text(
    text = errorMessage,
    color = MaterialTheme.colorScheme.error,
    modifier = Modifier.semantics {
        liveRegion = LiveRegionMode.Assertive
    }
)
```

### announceForAccessibility

**Imperative announcements via View:**

```kotlin
// ✅ Announce after action
@Composable
fun SaveButton(onSave: () -> Unit) {
    val view = LocalView.current

    Button(onClick = {
        onSave()
        view.announceForAccessibility("Document saved")
    }) {
        Text("Save")
    }
}

// ✅ Announce loading completion
LaunchedEffect(isLoading) {
    if (!isLoading) {
        view.announceForAccessibility("Content loaded")
    }
}
```

### Announcement Timing

**When to announce:**
- ✅ After user actions complete ("Saved", "Deleted", "Sent")
- ✅ When errors occur ("Invalid email address")
- ✅ When content loads ("Results loaded, 5 items")
- ✅ When state changes significantly
- ❌ Don't announce on every keystroke
- ❌ Don't interrupt user input

## Focus Order

### Logical Focus Order

**Ensure logical navigation order:**

```kotlin
// ✅ Form with logical focus order
@Composable
fun RegistrationForm() {
    val focusManager = LocalFocusManager.current

    Column {
        OutlinedTextField(
            value = firstName, onValueChange = { firstName = it },
            label = { Text("First name") },
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
            keyboardActions = KeyboardActions(onNext = { focusManager.moveFocus(FocusDirection.Down) })
        )
        OutlinedTextField(
            value = lastName, onValueChange = { lastName = it },
            label = { Text("Last name") },
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
            keyboardActions = KeyboardActions(onNext = { focusManager.moveFocus(FocusDirection.Down) })
        )
        Button(onClick = { submitForm() }) { Text("Register") }
    }
}
```

## Screen Changes and Dialogs

### paneTitle for Dialogs

**Dialogs should have a pane title:**

```kotlin
// ✅ AlertDialog — paneTitle announced when dialog opens
AlertDialog(
    onDismissRequest = { showDialog = false },
    modifier = Modifier.semantics {
        paneTitle = "Confirm deletion"
    },
    title = { Text("Delete item?") },
    text = { Text("This action cannot be undone.") },
    confirmButton = {
        TextButton(onClick = { delete(); showDialog = false }) { Text("Delete") }
    },
    dismissButton = {
        TextButton(onClick = { showDialog = false }) { Text("Cancel") }
    }
)
```

### Navigation Screen Changes

**Announce screen changes in Navigation:**

```kotlin
// ✅ Screen title announced on navigation
@Composable
fun SettingsScreen() {
    val view = LocalView.current
    LaunchedEffect(Unit) {
        view.announceForAccessibility("Settings")
    }

    // Screen content...
}
```

## Dynamic Content

### Content Updates

**Handle dynamic content accessibly:**

```kotlin
// ✅ Loading state
@Composable
fun LoadingContent(isLoading: Boolean, content: @Composable () -> Unit) {
    val view = LocalView.current

    LaunchedEffect(isLoading) {
        if (isLoading) {
            view.announceForAccessibility("Loading")
        } else {
            view.announceForAccessibility("Content loaded")
        }
    }

    if (isLoading) {
        CircularProgressIndicator(
            modifier = Modifier.semantics {
                contentDescription = "Loading, please wait"
            }
        )
    } else {
        content()
    }
}
```

### Error States

**Handle errors accessibly:**

```kotlin
// ✅ Error with focus and announcement
@Composable
fun ErrorMessage(message: String) {
    val focusRequester = remember { FocusRequester() }

    LaunchedEffect(message) {
        focusRequester.requestFocus()
    }

    Text(
        text = message,
        color = MaterialTheme.colorScheme.error,
        modifier = Modifier
            .focusRequester(focusRequester)
            .focusable()
            .semantics {
                liveRegion = LiveRegionMode.Assertive
            }
    )
}
```

### Best Practices Summary

**Focus Management Checklist:**
- ✅ Logical focus order maintained (composition order)
- ✅ Focus indicators visible on custom elements
- ✅ Important announcements via liveRegion or announceForAccessibility
- ✅ Screen changes announced via announceForAccessibility
- ✅ Dynamic content updates announced (liveRegion = Polite)
- ✅ Errors announced assertively (liveRegion = Assertive)
- ✅ No focus traps in custom dialogs
- ✅ Focus returns to trigger after dialog dismissal
- ✅ Loading states are announced
- ✅ Dialogs have `paneTitle` in semantics
- ✅ All announcements are localized
