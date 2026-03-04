---
name: checklist-android
description: Android (Kotlin/Jetpack Compose + epost-theme-compose) audit checklist for UI component code review
last-verified: 2026-03-04
---

# Audit Checklist — Android (Kotlin / Jetpack Compose / EpostTheme)

> Staleness warning: Verify token APIs against epost-theme-compose source before citing specific values.

## Tokens

### AND-TOKEN-001: No hardcoded colors
- **Severity**: critical
- **Bad**: `color = Color(0xFF1A73E8)` or `color = Color.Blue`
- **Good**: `val colors = EpostTheme.colors; color = colors.primary`
- **Why**: Hardcoded colors break dark mode, dynamic theming, and brand overrides. CompositionLocal provides automatic context-aware values.

### AND-TOKEN-002: No hardcoded dimensions
- **Severity**: high
- **Bad**: `Modifier.padding(13.dp)` or `Modifier.height(56.dp)` (non-scale value)
- **Good**: `Modifier.padding(EpostTheme.spacing.md)` — use the spacing token scale
- **Why**: Arbitrary dp values break the 4-point grid and can't be updated centrally.

### AND-TOKEN-003: No hardcoded text styles
- **Severity**: high
- **Bad**: `style = TextStyle(fontSize = 14.sp, fontWeight = FontWeight.Medium)`
- **Good**: `style = EpostTheme.typography.body`
- **Why**: Typography tokens support font scaling (sp units are correct, but style composition must come from the theme).

### AND-TOKEN-004: Access tokens inside @Composable scope
- **Severity**: critical
- **Bad**: `private val primaryColor = EpostTheme.colors.primary` — top-level property outside composition
- **Good**: Access inside `@Composable` function: `val colors = EpostTheme.colors`
- **Why**: CompositionLocal values are only valid inside the composition. Accessing outside crashes or returns wrong values.

---

## Patterns

### AND-PAT-001: @Composable functions are stateless (state hoisting)
- **Severity**: high
- **Bad**: `@Composable fun EpostButton() { var isLoading by remember { mutableStateOf(false) } ... }` — internal state that consumers can't control
- **Good**: Hoist state: `@Composable fun EpostButton(isLoading: Boolean, onClick: () -> Unit)`
- **Why**: Stateless composables are easier to test, preview, and reuse. State belongs to the caller.

### AND-PAT-002: Modifier as first parameter with default
- **Severity**: high
- **Bad**: `fun EpostButton(text: String, onClick: () -> Unit)` — no Modifier param
- **Good**: `fun EpostButton(modifier: Modifier = Modifier, text: String, onClick: () -> Unit)`
- **Why**: Compose convention. Modifier must be first so callers can chain layout modifiers naturally.

### AND-PAT-003: Epost* naming prefix
- **Severity**: high
- **Bad**: `@Composable fun PrimaryButton(...)`
- **Good**: `@Composable fun EpostButton(...)`
- **Why**: Consistent prefix avoids naming collisions and clearly identifies library components.

### AND-PAT-004: No side effects in composition
- **Severity**: critical
- **Bad**: Network calls, file I/O, or `Log.d()` directly in composable function body
- **Good**: Use `LaunchedEffect`, `SideEffect`, or `DisposableEffect` for side effects
- **Why**: The composition function can be called many times. Side effects in the body run on every recomposition.

### AND-PAT-005: No direct modification of shared library files
- **Severity**: critical
- **Check**: No edits inside epost-theme-compose package source — extend via wrappers
- **Why**: Shared library modifications break all consumers on next dependency update.

### AND-PAT-006: Stable parameters for skippable recomposition
- **Severity**: medium
- **Bad**: Passing lambda created at call site without `remember`: `onClick = { viewModel.doThing() }`
- **Good**: `val onClick = remember { { viewModel.doThing() } }` or pass stable ViewModel reference
- **Why**: Unstable parameters prevent Compose from skipping recomposition of unchanged subtrees.

---

## Performance

### AND-PERF-001: No allocations in composition
- **Severity**: high
- **Bad**: `val list = items.filter { it.isActive }` directly in composable body
- **Good**: `val list = remember(items) { items.filter { it.isActive } }`
- **Why**: Composables run on every recomposition. Allocations without `remember` create GC pressure.

### AND-PERF-002: Use derivedStateOf for computed state
- **Severity**: medium
- **Bad**: `val isValid = email.isNotEmpty() && email.contains('@')` read directly in composition
- **Good**: `val isValid by remember { derivedStateOf { email.isNotEmpty() && email.contains('@') } }`
- **Why**: `derivedStateOf` prevents recomposition when the derived value doesn't change, even if inputs change.

### AND-PERF-003: Lazy columns for lists
- **Severity**: high
- **Bad**: `Column { items.forEach { Item(it) } }` — renders all items eagerly
- **Good**: `LazyColumn { items(items) { Item(it) } }`
- **Why**: `Column` with many items causes large initial composition time and memory usage.

---

## Security

### AND-SEC-001: No hardcoded credentials or secrets
- **Severity**: critical
- **Bad**: API keys, tokens, or environment URLs in Composable source
- **Good**: Inject via dependency injection, not baked into component code

### AND-SEC-002: Validate user input
- **Severity**: high
- **Check**: TextField values passed to APIs should be validated/sanitized before use

### AND-SEC-003: Safe WebView configuration (if applicable)
- **Severity**: high
- **Check**: If component includes a WebView, verify JavaScript is not enabled unless required, file access disabled, and URL scheme validated
- **Bad**: `webView.settings.javaScriptEnabled = true` without explicit need
- **Why**: Misconfigured WebViews are a common attack surface in Android apps.

### AND-SEC-004: No exported components without intent-filter justification
- **Severity**: high
- **Check**: If component wraps an Activity/BroadcastReceiver, confirm `exported=true` is intentional and protected with permissions

---

## Accessibility

### AND-A11Y-001: contentDescription on image/icon elements
- **Severity**: high
- **Bad**: `Image(painter = painterResource(R.drawable.ic_close), contentDescription = null)` — interactive icon with null description
- **Good**: `contentDescription = "Close"` or `contentDescription = stringResource(R.string.close)`

### AND-A11Y-002: Minimum touch target 48×48dp
- **Severity**: high
- **Bad**: Icon-only button at 24×24dp with no padding modifier
- **Good**: `Modifier.minimumInteractiveComponentSize()` or `.size(48.dp)` for interactive elements

### AND-A11Y-003: Semantics for custom components
- **Severity**: high
- **Bad**: Custom toggle built from `Box` with no semantics
- **Good**: `Modifier.semantics { role = Role.Switch; stateDescription = if (checked) "on" else "off" }`

### AND-A11Y-004: No hardcoded text for localizable strings
- **Severity**: medium
- **Bad**: `Text("Submit")` — hardcoded English
- **Good**: `Text(stringResource(R.string.submit))`

---

## Testing

### AND-TEST-001: Compose UI tests exist
- **Severity**: high
- **Check**: `composeTestRule.onNodeWithTag()` or `onNodeWithText()` tests exist for interactive states

### AND-TEST-002: Tests use semantics, not internals
- **Severity**: medium
- **Bad**: Accessing private ViewModel state from tests
- **Good**: `composeTestRule.onNodeWithContentDescription("Close").performClick()`

### AND-TEST-003: Test all meaningful states
- **Severity**: medium
- **Check**: Tests cover enabled, disabled, loading, error states as applicable
