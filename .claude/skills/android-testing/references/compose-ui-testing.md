# Compose UI Testing Reference

## createComposeRule() vs createAndroidComposeRule()

| Rule | When to use |
|------|-------------|
| `createComposeRule()` | Testing composables in isolation — no Activity context needed |
| `createAndroidComposeRule<Activity>()` | Need Activity context: navigation, back stack, intent extras, Activity-scoped ViewModels |

```kotlin
// Isolated composable test
@get:Rule
val composeTestRule = createComposeRule()

// Test with Activity context (e.g., navigation host)
@get:Rule
val composeTestRule = createAndroidComposeRule<MainActivity>()
```

Use `createAndroidComposeRule` when testing a `NavHost` or any composable that reads from `LocalContext` / `LocalLifecycleOwner`.

---

## Semantic Matcher Reference

Tests interact with the **semantics tree** — not the visual layout. Compose merges child semantics into parent by default (see `useUnmergedTree` below).

| Matcher | Code | Notes |
|---------|------|-------|
| Text content | `onNodeWithText("Submit")` | Matches visible text |
| Test tag | `onNodeWithTag("submit_btn")` | Requires `Modifier.testTag(...)` |
| Content description | `onNodeWithContentDescription("Close")` | Matches `semantics { contentDescription = "..." }` |
| Role | `onNodeWithRole(Role.Button)` | Matches semantic role |
| Combined | `onNode(hasText("OK") and hasTestTag("dialog_ok"))` | Combine matchers with `and` / `or` |
| Any child matching | `onNode(hasAnyChild(hasText("Item")))` | Matches parent with child |
| Focused | `onNode(isFocused())` | Currently focused node |

```kotlin
// Combined matcher
composeTestRule.onNode(
    hasText("Confirm") and hasRole(Role.Button)
).assertIsDisplayed()

// Using matcher functions directly
composeTestRule.onNode(hasTestTag("email_field")).performTextInput("user@example.com")
```

---

## Actions

```kotlin
// Click
composeTestRule.onNodeWithText("Sign In").performClick()

// Text input
composeTestRule.onNodeWithTag("email_field").performTextInput("user@example.com")

// Clear and re-input
composeTestRule.onNodeWithTag("email_field")
    .performTextClearance()
composeTestRule.onNodeWithTag("email_field")
    .performTextInput("new@example.com")

// Key press
composeTestRule.onNodeWithTag("search_field")
    .performKeyInput { pressKey(Key.Enter) }

// Scroll to node (lazy list)
composeTestRule.onNodeWithTag("item_42")
    .performScrollTo()

// Gesture
composeTestRule.onNodeWithTag("card")
    .performGesture { swipeLeft() }

// Touch gesture with coordinates
composeTestRule.onNodeWithTag("map")
    .performTouchInput { click(center) }
```

---

## Assertions

```kotlin
// Visibility
composeTestRule.onNodeWithTag("error_banner").assertIsDisplayed()
composeTestRule.onNodeWithTag("loading_spinner").assertIsNotDisplayed()

// Enabled state
composeTestRule.onNodeWithText("Submit").assertIsEnabled()
composeTestRule.onNodeWithText("Submit").assertIsNotEnabled()

// Text content
composeTestRule.onNodeWithTag("title").assertTextEquals("Welcome")

// Content description
composeTestRule.onNodeWithTag("avatar").assertContentDescriptionEquals("User avatar")

// Existence (does not require visibility)
composeTestRule.onNodeWithTag("dialog").assertExists()
composeTestRule.onNodeWithTag("dialog").assertDoesNotExist()

// Check state (Checkbox, Switch)
composeTestRule.onNodeWithTag("remember_me").assertIsOn()
composeTestRule.onNodeWithTag("remember_me").assertIsOff()
```

---

## useUnmergedTree = true

By default, Compose merges child semantics into parent nodes (e.g., a `Row` containing a `Text` and `Icon` merges into one node). `useUnmergedTree = true` accesses the raw semantics tree with all children visible.

**When to use:** Targeting a specific child node within a merged parent — list items, icon buttons with labels, compound components.

```kotlin
// Default (merged) — Row with Text merges into one node
composeTestRule.onNodeWithText("Alice").assertIsDisplayed() // works

// Unmerged — access individual children of a list item
composeTestRule.onNodeWithTag("user_item", useUnmergedTree = true)
    .onChildren()
    .filterToOne(hasText("Alice"))
    .assertIsDisplayed()

// Access child at index
composeTestRule.onNodeWithTag("action_bar", useUnmergedTree = true)
    .onChildAt(1) // second button
    .performClick()
```

---

## Compose + Views Interop

For screens mixing Compose (`AndroidView` embedding Views, or Views embedding `ComposeView`):

- Use **Compose testing** for nodes in the semantics tree (Composable content)
- Use **Espresso** for View-based UI in the same test class

```kotlin
@get:Rule
val composeTestRule = createAndroidComposeRule<MainActivity>()

@Test
fun mixedScreen_interopTest() {
    // Compose assertion
    composeTestRule.onNodeWithTag("compose_header").assertIsDisplayed()

    // Espresso assertion for a legacy View
    onView(withId(R.id.legacy_button)).check(matches(isDisplayed()))
    onView(withId(R.id.legacy_button)).perform(click())

    // Back to Compose
    composeTestRule.onNodeWithTag("result_text").assertTextEquals("Clicked")
}
```

Import both:
```kotlin
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.matcher.ViewMatchers.withId
```

---

## Flakiness Patterns

### Problem: async state updates

By default, Compose testing auto-advances the clock for synchronous state changes. For async operations (network, DB), the semantics tree may not yet reflect the updated state.

**Solution: `waitUntil`**

```kotlin
composeTestRule.waitUntil(timeoutMillis = 5_000) {
    composeTestRule.onAllNodesWithTag("user_item").fetchSemanticsNodes().isNotEmpty()
}
composeTestRule.onAllNodesWithTag("user_item").assertCountEquals(3)
```

### Problem: Compose animations

Animations delay state transitions visible in the semantics tree.

**Solution: `mainClock.advanceTimeBy`**

```kotlin
composeTestRule.mainClock.autoAdvance = false

composeTestRule.onNodeWithText("Show Dialog").performClick()
composeTestRule.mainClock.advanceTimeBy(300) // advance past animation duration

composeTestRule.onNodeWithTag("dialog").assertIsDisplayed()
```

### Problem: coroutine-based loading state

Use `advanceUntilIdle()` from `kotlinx-coroutines-test` combined with a `TestDispatcher` in the ViewModel.

```kotlin
@Test
fun loading_thenContentDisplayed() = runTest {
    viewModel.loadData()
    advanceUntilIdle()

    composeTestRule.onNodeWithTag("content_list").assertIsDisplayed()
}
```

### Problem: idling resources for background work

Register an idling resource when the UI depends on non-coroutine async work (e.g., Handler, background threads):

```kotlin
val idlingResource = CountingIdlingResource("DataLoad")
IdlingRegistry.getInstance().register(idlingResource)

// In production code: increment before, decrement after async op
// In test teardown:
IdlingRegistry.getInstance().unregister(idlingResource)
```

---

## Related

- `SKILL.md` — Test layers, ViewModel testing, MockK patterns
- `hilt-testing.md` — Hilt DI setup for integration tests
