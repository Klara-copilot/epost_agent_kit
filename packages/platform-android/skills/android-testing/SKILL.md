---
name: android-testing
description: "Use when writing Android tests — Compose UI tests, Hilt DI test setup, ViewModel + Flow testing with Turbine, Room in-memory, or MockK mocking. Covers JUnit 4 patterns and flakiness fixes."
user-invocable: false
context: inline
paths: ["**/*.kt", "**/*Test.kt", "**/*Tests.kt", "**/*Spec.kt", "**/*androidTest/**"]
metadata:
  keywords: [junit, compose-testing, hilt, turbine, mockk, room, viewmodel, flow]
  platforms: [android]
  connections:
    extends: [android-development]
    related: [test, scenario]
---

## Purpose

Patterns and conventions for Android testing across unit, integration, and E2E layers. Covers Compose UI semantics, Hilt DI test setup, coroutine/Flow testing with Turbine, Room in-memory databases, and MockK mocking.

## Test Layers

| Layer | Tools | Emulator | Target Coverage |
|-------|-------|----------|-----------------|
| Unit | JUnit 4 + MockK | No | 70%+ |
| Integration | Compose UI Testing + Room inMemory | Yes | 50–60% of UI flows |
| E2E | Espresso | Yes | Critical happy paths |

**Unit tests** run on JVM — fastest, no device needed. Test ViewModels, use cases, mappers, and repositories in isolation.

**Integration tests** run on emulator/device. Use `createComposeRule()` to test Compose screens with real composable tree. Use `Room.inMemoryDatabaseBuilder()` to test DAO interactions.

**E2E tests** use Espresso for full flow automation across multiple screens.

## Compose UI Testing

Tests interact with the **semantics tree**, not the visual tree. Add `Modifier.testTag("my_tag")` to components that have no unique text or content description.

```kotlin
@get:Rule
val composeTestRule = createComposeRule()

@Test
fun loginButton_click_showsLoading() {
    composeTestRule.setContent {
        LoginScreen(onLogin = {})
    }

    composeTestRule.onNodeWithText("Sign In").performClick()
    composeTestRule.onNodeWithTag("loading_indicator").assertIsDisplayed()
}
```

**Common matchers:**

| Matcher | Use |
|---------|-----|
| `onNodeWithText("...")` | Visible text content |
| `onNodeWithTag("...")` | `Modifier.testTag(...)` |
| `onNodeWithContentDescription("...")` | Accessibility label |
| `onNodeWithRole(Role.Button)` | Semantic role |

**Actions:** `performClick()`, `performTextInput("text")`, `performScrollTo()`, `performGesture { swipeLeft() }`

**Assertions:** `assertIsDisplayed()`, `assertIsNotDisplayed()`, `assertIsEnabled()`, `assertIsNotEnabled()`, `assertTextEquals("...")`, `assertContentDescriptionEquals("...")`

**Nested nodes:** By default, semantics of child nodes merge into parent. Use `useUnmergedTree = true` to access individual children:

```kotlin
composeTestRule.onNodeWithTag("list_item", useUnmergedTree = true)
    .onChildAt(0)
    .assertTextEquals("Expected")
```

See `references/compose-ui-testing.md` for full matcher table and flakiness patterns.

## Hilt DI Critical Rules

- `@HiltAndroidTest` + `HiltAndroidRule` + `hiltRule.inject()` in `@Before`
- **Prefer `@TestInstallIn`** — one Dagger component compiled once, shared across all tests
- **Ad-hoc override**: `@BindValue` for single test class
- **Avoid `@UninstallModules`** — generates a custom component per test class, slows builds

## ViewModel + Flow Critical Rules

- Use `runTest` from `kotlinx-coroutines-test`
- Replace `Dispatchers.Main` with `StandardTestDispatcher` via `MainDispatcherRule()`
- Use `advanceUntilIdle()` to let coroutines complete
- Use **Turbine** `.test {}` for Flow assertions: `awaitItem()`, `cancelAndIgnoreRemainingEvents()`

## Room Critical Rules

- `Room.inMemoryDatabaseBuilder()` — no persistent state between tests
- `allowMainThreadQueries()` safe in tests only
- Use `runTest` for all `suspend` DAO functions

## MockK Quick Reference

- `mockk<T>()` — strict mock, must stub all called methods
- `mockk<T>(relaxed = true)` — auto-stubs with defaults, use when only subset of methods are under test
- `every { }` / `coEvery { }` for stubbing; `verify { }` / `coVerify { }` for assertion

## References

- `references/compose-ui-testing.md` — Full matcher table, actions, flakiness patterns, Compose+Views interop
- `references/hilt-testing.md` — @TestInstallIn, @BindValue, scoped fakes, full examples
