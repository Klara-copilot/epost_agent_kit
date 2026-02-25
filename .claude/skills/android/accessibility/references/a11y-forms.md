---
name: a11y-forms
description: Form input accessibility — labels, validation, error states, keyboard options, OutlinedTextField
---

# Form Accessibility Rules

## Purpose

Accessibility rules for form inputs and interactive form elements in Jetpack Compose, ensuring TalkBack users can complete forms successfully.

## Table of Contents

- [Text Fields](#text-fields)
- [Labels and Placeholders](#labels-and-placeholders)
- [Form Validation](#form-validation)
- [Keyboard Options](#keyboard-options)
- [Form Structure](#form-structure)
- [Error Messages](#error-messages)

## Related Documents

- [a11y-core](./a11y-core.md) - Core accessibility principles
- [a11y-buttons](./a11y-buttons.md) - Button accessibility
- [a11y-headings](./a11y-headings.md) - Heading structure

## Text Fields

### OutlinedTextField Accessibility

**Default Behavior:**
- `OutlinedTextField` and `TextField` expose label text to TalkBack automatically
- Use `label` parameter — it is read as the field's accessible name
- Avoid relying solely on `placeholder` as it disappears on input

```kotlin
// ✅ Text field with label — label is accessible by default
OutlinedTextField(
    value = email,
    onValueChange = { email = it },
    label = { Text("Email address") }
)
// TalkBack reads: "Email address, Edit text"

// ✅ With supporting text
OutlinedTextField(
    value = password,
    onValueChange = { password = it },
    label = { Text("Password") },
    supportingText = { Text("Must be at least 8 characters") }
)
```

### Required Fields

**Indicate required fields:**

```kotlin
// ✅ Required field — indicate in label or supporting text
OutlinedTextField(
    value = name,
    onValueChange = { name = it },
    label = { Text("Name *") },
    modifier = Modifier.semantics {
        contentDescription = "Name, required"
    }
)

// ✅ With explicit semantics
OutlinedTextField(
    value = email,
    onValueChange = { email = it },
    label = { Text("Email address") },
    supportingText = { Text("Required") }
)
```

### ContentDescription Override

**When label alone isn't sufficient:**

```kotlin
// ✅ Override when default label isn't descriptive enough
TextField(
    value = query,
    onValueChange = { query = it },
    modifier = Modifier.semantics {
        contentDescription = "Search messages"
    },
    leadingIcon = {
        Icon(Icons.Default.Search, contentDescription = null) // decorative
    }
)
```

## Labels and Placeholders

### Label vs Placeholder

**Use `label` not `placeholder` for accessibility:**

```kotlin
// ✅ Correct: label is persistent and accessible
OutlinedTextField(
    value = text,
    onValueChange = { text = it },
    label = { Text("Email address") },
    placeholder = { Text("example@email.com") } // supplementary only
)

// ❌ Wrong: Placeholder only — disappears on input
OutlinedTextField(
    value = text,
    onValueChange = { text = it },
    placeholder = { Text("Email") } // Not reliably accessible
)
```

### Hint-Like Guidance

**Supporting text provides additional context:**

```kotlin
// ✅ Supporting text for hints
OutlinedTextField(
    value = phone,
    onValueChange = { phone = it },
    label = { Text("Phone number") },
    supportingText = { Text("Enter 10-digit number") },
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
)
```

## Form Validation

### Error States

**Display and announce errors:**

```kotlin
// ✅ Error state with isError and supportingText
var emailError by remember { mutableStateOf<String?>(null) }

OutlinedTextField(
    value = email,
    onValueChange = { email = it; emailError = null },
    label = { Text("Email address") },
    isError = emailError != null,
    supportingText = emailError?.let { { Text(it) } }
)

// Announce error when validation runs
LaunchedEffect(emailError) {
    emailError?.let { error ->
        // View-level announcement
        view.announceForAccessibility(error)
    }
}
```

### Real-time Validation

**Announce validation results:**

```kotlin
// ✅ Announce validation errors — use liveRegion or announceForAccessibility
@Composable
fun ValidatedTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    errorMessage: String?
) {
    Column {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            label = { Text(label) },
            isError = errorMessage != null,
            supportingText = errorMessage?.let { msg ->
                {
                    Text(
                        msg,
                        modifier = Modifier.semantics {
                            liveRegion = LiveRegionMode.Polite
                        }
                    )
                }
            }
        )
    }
}
```

## Keyboard Options

### Appropriate Keyboard Types

**Match keyboard type to input:**

```kotlin
// ✅ Email field
OutlinedTextField(
    value = email,
    onValueChange = { email = it },
    label = { Text("Email address") },
    keyboardOptions = KeyboardOptions(
        keyboardType = KeyboardType.Email,
        imeAction = ImeAction.Next
    )
)

// ✅ Password field
OutlinedTextField(
    value = password,
    onValueChange = { password = it },
    label = { Text("Password") },
    keyboardOptions = KeyboardOptions(
        keyboardType = KeyboardType.Password
    ),
    visualTransformation = PasswordVisualTransformation()
)
// TalkBack reads: "Password, Password edit text"

// ✅ Phone number
OutlinedTextField(
    value = phone,
    onValueChange = { phone = it },
    label = { Text("Phone number") },
    keyboardOptions = KeyboardOptions(
        keyboardType = KeyboardType.Phone,
        imeAction = ImeAction.Done
    )
)
```

### IME Actions for Navigation

**Help users navigate between fields:**

```kotlin
// ✅ Logical field navigation
val focusManager = LocalFocusManager.current

OutlinedTextField(
    value = firstName,
    onValueChange = { firstName = it },
    label = { Text("First name") },
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
    keyboardActions = KeyboardActions(onNext = { focusManager.moveFocus(FocusDirection.Down) })
)

OutlinedTextField(
    value = lastName,
    onValueChange = { lastName = it },
    label = { Text("Last name") },
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
    keyboardActions = KeyboardActions(onDone = { focusManager.clearFocus() })
)
```

## Form Structure

### Form Sections

**Use headings to organize forms:**

```kotlin
// ✅ Form with sections
Column {
    Text(
        "Personal Information",
        style = MaterialTheme.typography.titleLarge,
        modifier = Modifier.semantics { heading() }
    )
    OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Name") })
    OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Email") })

    Spacer(Modifier.height(16.dp))

    Text(
        "Address",
        style = MaterialTheme.typography.titleLarge,
        modifier = Modifier.semantics { heading() }
    )
    OutlinedTextField(value = street, onValueChange = { street = it }, label = { Text("Street") })
}
```

## Error Messages

### Error Announcements

**Announce errors clearly and specifically:**

```kotlin
// ✅ Form-level error announcement
@Composable
fun FormErrorSummary(errors: List<String>) {
    if (errors.isNotEmpty()) {
        Text(
            "Form has ${errors.size} error(s). Please review.",
            color = MaterialTheme.colorScheme.error,
            modifier = Modifier.semantics {
                liveRegion = LiveRegionMode.Assertive
            }
        )
    }
}
```

### Error Labels

**Use specific, actionable error messages:**
- **Good:** "Email address is required", "Invalid email format"
- **Bad:** "Error", "Wrong value"

### Best Practices Summary

**Form Accessibility Checklist:**
- ✅ All fields use `label` parameter (not placeholder only)
- ✅ Required fields are clearly indicated
- ✅ `isError = true` with `supportingText` for error state
- ✅ Keyboard type matches input (Email, Phone, Password, etc.)
- ✅ IME actions enable field-to-field navigation
- ✅ Validation errors announced via liveRegion or announceForAccessibility
- ✅ Error messages are specific and actionable
- ✅ Form sections use heading semantics
- ✅ Password fields use `PasswordVisualTransformation`
- ✅ All labels and hints are localized via `stringResource()`
