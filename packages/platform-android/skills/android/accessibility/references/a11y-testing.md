---
name: a11y-testing
description: Accessibility testing — composeTestRule, onNodeWithContentDescription, isHeading(), hasRole(), TalkBack manual testing
---

# Accessibility Testing Rules

## Purpose

Testing guidelines and procedures for verifying Android accessibility implementation, ensuring TalkBack compatibility and WCAG 2.1 AA compliance.

## Table of Contents

- [Testing Tools](#testing-tools)
- [TalkBack Testing](#talkback-testing)
- [Automated Testing](#automated-testing)
- [Manual Testing Checklist](#manual-testing-checklist)
- [Testing Scenarios](#testing-scenarios)
- [Reporting Issues](#reporting-issues)

## Related Documents

- [a11y-core](./a11y-core.md) - Core accessibility principles
- [a11y-buttons](./a11y-buttons.md) - Button accessibility
- [a11y-forms](./a11y-forms.md) - Form accessibility
- [a11y-colors-contrast](./a11y-colors-contrast.md) - Color testing

## Testing Tools

### Android Accessibility Scanner

**Google's on-device scanner:**
- Install [Accessibility Scanner](https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.auditor) from Play Store
- Tap the scanner overlay button to analyze current screen
- Reports: missing labels, small touch targets, low contrast
- Use after each new screen or major UI change

### Compose Test Framework

**Use `ComposeContentTestRule` for automated accessibility checks:**

```kotlin
class MyScreenAccessibilityTest {
    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun myScreen_allButtonsHaveLabels() {
        composeTestRule.setContent {
            MyScreen()
        }

        // Check that all buttons have content descriptions
        composeTestRule
            .onAllNodes(hasRole(Role.Button))
            .assertAll(hasContentDescription())
    }
}
```

### TalkBack

**Enable TalkBack:**
- Settings → Accessibility → TalkBack → On
- Or: Volume Up + Volume Down (3 seconds) if shortcut configured
- Test all interactions with TalkBack enabled

## TalkBack Testing

### Basic Navigation

**Test TalkBack navigation:**
- Swipe right: Next element
- Swipe left: Previous element
- Double tap: Activate element
- Swipe up then right: Open local context menu (headings, links, etc.)
- Three-finger scroll: Scroll content

**Test checklist:**
- ✅ All interactive elements are reachable
- ✅ Navigation order is logical
- ✅ Headings are navigable via TalkBack Rotor
- ✅ Forms are completable end-to-end
- ✅ Buttons are activatable with double-tap

### Label Testing

**Verify labels are appropriate:**
- Listen to what TalkBack reads for each element
- Ensure labels are concise and action-oriented
- Verify labels match context
- Check for redundant or missing information

```kotlin
// ✅ Test label quality in Compose tests
@Test
fun closeButton_hasCorrectContentDescription() {
    composeTestRule.setContent { MyScreen() }

    composeTestRule
        .onNodeWithContentDescription("Close")
        .assertExists()
        .assertHasClickAction()
}
```

### Role Testing

**Verify correct roles:**
- Buttons have `Role.Button`
- Headings are marked with `heading()` semantics
- Switches have `Role.Switch`
- Images have role image (or are decorative)

```kotlin
// ✅ Test roles
@Test
fun saveButton_hasButtonRole() {
    composeTestRule.setContent { MyForm() }

    composeTestRule
        .onNodeWithText("Save")
        .assert(hasRole(Role.Button))
}

@Test
fun sectionTitle_isMarkedAsHeading() {
    composeTestRule.setContent { SettingsScreen() }

    composeTestRule
        .onNodeWithText("Account")
        .assert(isHeading())
}
```

## Automated Testing

### Compose Accessibility Matchers

**Semantic matchers for accessibility testing:**

```kotlin
import androidx.compose.ui.test.*

// Content description matchers
onNodeWithContentDescription("Close")           // exact match
onNodeWithContentDescription("close", ignoreCase = true)

// Role matchers
hasRole(Role.Button)
hasRole(Role.Switch)
hasRole(Role.Checkbox)

// State matchers
isHeading()          // has heading() semantics
isEnabled()
isToggleable()
isChecked()
isFocused()

// Assertion helpers
.assertContentDescriptionEquals("Close")
.assertHasClickAction()
.assertIsEnabled()
.assertIsDisplayed()
```

### Unit Tests for Accessibility Properties

```kotlin
class AccessibilityTest {
    @get:Rule
    val composeTestRule = createComposeRule()

    // ✅ Test button has accessible label
    @Test
    fun iconButton_hasContentDescription() {
        composeTestRule.setContent {
            IconButton(onClick = { }) {
                Icon(Icons.Default.Close, contentDescription = "Close")
            }
        }

        composeTestRule
            .onNodeWithContentDescription("Close")
            .assertExists()
            .assert(hasRole(Role.Button))
    }

    // ✅ Test decorative image has null description
    @Test
    fun decorativeImage_isHiddenFromAccessibility() {
        composeTestRule.setContent {
            Image(
                painter = painterResource(R.drawable.banner),
                contentDescription = null
            )
        }

        // Node should not be present in accessibility tree
        composeTestRule
            .onAllNodes(hasAnyChild(hasRole(Role.Image)))
            .assertCountEquals(0)
    }

    // ✅ Test form field has label
    @Test
    fun emailField_hasAccessibleLabel() {
        composeTestRule.setContent {
            OutlinedTextField(
                value = "",
                onValueChange = { },
                label = { Text("Email address") }
            )
        }

        composeTestRule
            .onNodeWithText("Email address")
            .assertExists()
    }

    // ✅ Test heading structure
    @Test
    fun screen_hasHeadings() {
        composeTestRule.setContent { SettingsScreen() }

        // At least one heading should exist
        composeTestRule
            .onAllNodes(isHeading())
            .assertCountEquals(atLeast(1))
    }

    // ✅ Test toggle state description
    @Test
    fun toggleButton_announcesState() {
        var isChecked by mutableStateOf(false)

        composeTestRule.setContent {
            IconToggleButton(
                checked = isChecked,
                onCheckedChange = { isChecked = it }
            ) {
                Icon(
                    if (isChecked) Icons.Filled.Favorite else Icons.Default.FavoriteBorder,
                    contentDescription = if (isChecked) "Remove favorite" else "Add favorite"
                )
            }
        }

        composeTestRule
            .onNodeWithContentDescription("Add favorite")
            .performClick()

        composeTestRule
            .onNodeWithContentDescription("Remove favorite")
            .assertExists()
    }
}
```

## Manual Testing Checklist

### Screen-Level Testing

**For each screen:**
- ✅ Screen has descriptive heading (H1 equivalent)
- ✅ All interactive elements are accessible via TalkBack
- ✅ Focus order is logical (top-to-bottom, left-to-right)
- ✅ Headings enable TalkBack Rotor navigation
- ✅ Forms are completable end-to-end
- ✅ Errors are announced
- ✅ Loading states are announced

### Element-Level Testing

**For each interactive element:**
- ✅ Has appropriate contentDescription (or text content)
- ✅ Has correct role
- ✅ State changes are announced
- ✅ Is focusable and activatable
- ✅ Touch target is at least 48×48dp

### Form Testing

**For each form:**
- ✅ All fields have `label` parameter
- ✅ Required fields are indicated
- ✅ Validation errors are announced
- ✅ Error messages are specific and actionable
- ✅ IME actions enable field-to-field navigation
- ✅ Submit button is accessible

## Testing Scenarios

### Common User Flows

**Test complete user journeys:** Login/signup flow, form submission, navigation between screens, search functionality, content consumption, settings configuration.

### Error Scenarios

**Test error handling:** Invalid input, network errors, validation failures, empty required fields.

### Dynamic Content

**Test content updates:** Loading states, content refreshes, state changes, live region announcements.

## Reporting Issues

### Issue Documentation

**When reporting accessibility issues:**
- Describe the problem clearly
- Include TalkBack output (what is read)
- Specify affected elements and screen
- Provide steps to reproduce
- Include expected vs actual behavior

### Issue Template

```
**Screen:** [Screen name]
**Element:** [Element type and identifier]
**Issue:** [Description of problem]
**TalkBack Output:** [What TalkBack reads]
**Expected:** [What should happen]
**Steps to Reproduce:**
1. Enable TalkBack
2. Navigate to [Screen]
3. Focus [Element]
**Severity:** [Critical/High/Medium/Low]
**WCAG Criterion:** [e.g., 1.1.1, 4.1.2]
```

### Best Practices Summary

**Testing Checklist:**
- ✅ All screens tested with TalkBack enabled
- ✅ All interactive elements reachable and activatable
- ✅ Forms tested end-to-end with TalkBack
- ✅ Error scenarios tested and announced correctly
- ✅ Dynamic content announced via liveRegion
- ✅ Contrast ratios verified with Accessibility Scanner
- ✅ Color independence verified with Developer Options simulator
- ✅ Focus order verified
- ✅ Dark theme tested
- ✅ Automated tests written for accessibility properties
- ✅ Manual testing performed before each release
- ✅ Issues documented with TalkBack output

### Testing Schedule

**Regular testing:**
- Test new screens before PR merge
- Test after UI changes
- Run automated accessibility tests in CI
- Periodic full-app audits with TalkBack
- Test with each major Android version update
