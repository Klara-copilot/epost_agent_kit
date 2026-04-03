---
phase: 2
title: "Create android-testing skill"
effort: 45 min
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- Target: `packages/platform-android/skills/android-testing/`
- Register in: `packages/platform-android/package.yaml`
- Stack: Kotlin, Jetpack Compose, MVVM, Hilt DI, Room, Retrofit, JUnit 4, Espresso, Compose UI Testing, MockK

## Files to Create

### `SKILL.md`

Frontmatter:
```yaml
---
name: android-testing
description: "Use when writing Android tests — Compose UI tests, Hilt DI test setup, ViewModel + Flow testing with Turbine, Room in-memory, or MockK mocking. Covers JUnit 4 patterns and flakiness fixes."
user-invocable: false
context: inline
metadata:
  keywords: [junit, compose-testing, hilt, turbine, mockk, room, viewmodel, flow]
  platforms: [android]
  connections:
    extends: [android-development]
    related: [test, scenario]
---
```

Body sections:
1. **Purpose** — 1-2 lines
2. **Test Layers** — Unit (JUnit 4 + MockK) / Integration (Compose UI + Room inMemory) / E2E (Espresso end-to-end), coverage targets
3. **Compose UI Testing** — createComposeRule(), semantic matchers (onNodeWithText, onNodeWithTag, onNodeWithContentDescription), actions (performClick, performGesture), assertions (assertIsDisplayed), useUnmergedTree for nested nodes
4. **Hilt DI Testing** — @HiltAndroidTest + @TestInstallIn (preferred), @BindValue for ad-hoc overrides, why NOT @UninstallModules (build perf)
5. **ViewModel + Flow Testing** — runTest, StandardTestDispatcher, Turbine (flow.test { awaitItem() }), TestCoroutineScheduler
6. **Room Testing** — inMemoryDatabaseBuilder, allowMainThreadQueries(), runTest for suspend DAOs
7. **MockK Patterns** — mockk<>, every { }, coEvery { }, verify { }, relaxed mocks
8. **References** section

### `references/compose-ui-testing.md`

Sections:
- createComposeRule() vs createAndroidComposeRule() — when to use each
- Full semantic matcher reference table (text, tag, contentDescription, role, focused, checked)
- Actions: performClick, performTextInput, performScrollTo, performGesture
- Assertions: assertIsDisplayed, assertIsEnabled, assertTextEquals, assertContentDescriptionEquals
- useUnmergedTree = true — when and why
- Compose + Views interop (Espresso for Views, Compose for semantics — same test)
- Flakiness patterns: waitUntil { }, advanceTimeBy, idling resources

### `references/hilt-testing.md`

Sections:
- @TestInstallIn pattern (full example — fake module replaces prod module for all tests in source set)
- @BindValue pattern (ad-hoc per-test double)
- @UninstallModules — why to avoid (Dagger component generation per test = slow builds)
- Custom test application setup (if needed)
- Scoped fakes: when to share vs per-test isolation
- ViewModel injection in tests

## File Ownership

| File | Action |
|---|---|
| `packages/platform-android/skills/android-testing/SKILL.md` | CREATE |
| `packages/platform-android/skills/android-testing/references/compose-ui-testing.md` | CREATE |
| `packages/platform-android/skills/android-testing/references/hilt-testing.md` | CREATE |
| `packages/platform-android/package.yaml` | UPDATE — add `android-testing` to provides.skills |
