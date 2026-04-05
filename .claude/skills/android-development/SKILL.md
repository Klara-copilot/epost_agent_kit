---
name: android-development
description: (ePost) Builds Kotlin/Compose screens, manages Gradle builds, and debugs Android crashes. Use when working on Android — Kotlin/Compose screens, Gradle builds, Hilt DI, Room DB, or fixing Android crashes and Kotlin coroutine issues
user-invocable: false
paths: ["**/*.kt", "**/*.kts", "**/AndroidManifest.xml"]

metadata:
  agent-affinity: [epost-fullstack-developer, epost-tester, epost-debugger, epost-code-reviewer]
  keywords: [android, kotlin, jetpack-compose, mvvm, hilt, room, retrofit]
  platforms: [android]
  triggers: [".kt", ".kts", "build.gradle", "AndroidManifest.xml", "android"]
---

# Android Development Skill

Production-ready Android development with Kotlin 2.0+, Jetpack Compose, and modern architecture patterns.

## When Active

Use when building Android features, UI components, or platform-specific functionality. Auto-activated for:
- Kotlin files (.kt, .kts)
- Android project structure (build.gradle.kts, AndroidManifest.xml)
- Android commands (`/cook android`, `/test android`)

## Quick Start Templates

### Build Configuration
- **[build-gradle-app.kts](./assets/build-gradle-app.kts)** - App module with Compose, Hilt, Room, Retrofit
- **[build-gradle-lib.kts](./assets/build-gradle-lib.kts)** - Library module for shared code

### UI Components
- **[compose-screen-template.kt](./assets/compose-screen-template.kt)** - Complete screen with loading/error/success states
- **[navigation-template.kt](./assets/navigation-template.kt)** - Type-safe Navigation with nested graphs

### Architecture
- **[viewmodel-template.kt](./assets/viewmodel-template.kt)** - ViewModel with StateFlow and error handling
- **[hilt-module-template.kt](./assets/hilt-module-template.kt)** - Dependency injection setup

### Data Layer
- **[room-entity-dao-template.kt](./assets/room-entity-dao-template.kt)** - Database with migrations
- **[retrofit-service-template.kt](./assets/retrofit-service-template.kt)** - API service with error handling

## Architecture

MVVM: UI (Composables) → ViewModel (StateFlow) → Domain (use cases) → Data (Room, Retrofit)

Key conventions:
- `StateFlow` not `LiveData`; `collectAsStateWithLifecycle()` in Composables
- Sealed `UiState` interface: Loading / Success / Error
- Hoist state up, pass callbacks down; `remember`/`derivedStateOf` for recomposition
- `Kotlinx Serialization` over Gson; OkHttp interceptors for auth/logging

## Tech Stack Summary

| Area | Library |
|------|---------|
| UI | Jetpack Compose + Material 3 |
| DI | Hilt |
| DB | Room + Flow |
| Network | Retrofit + OkHttp |
| Async | Coroutines + StateFlow |
| Testing | JUnit 4, MockK, Turbine, Compose Testing |

Min SDK: API 24 (Android 7.0) | Target: API 34+

## References

- `references/android-patterns.md` — ViewModel+StateFlow, Compose state collection, Repository, Hilt module, coroutine patterns
- `references/mvvm-architecture.md` — Layer responsibilities, data flow diagram
- `references/compose-best-practices.md` — State hoisting, recomposition, side effects
- `references/error-handling.md` — Result wrapper, retry logic, validation
- `references/usage-and-compatibility.md` — Setup guides, version compatibility matrix

## Build Commands

```bash
./gradlew assembleDebug       # Build debug APK
./gradlew installDebug        # Install on device
./gradlew build               # Full build with tests
./gradlew test                # Run unit tests
./gradlew connectedAndroidTest # Run instrumentation tests
./gradlew jacocoTestReport    # Generate coverage report
./gradlew lint                # Run Android linter
./gradlew ktlintCheck         # Run Kotlin linter
```

## Coverage Goals
- **Minimum**: 80% overall coverage
- **ViewModels**: 90%+ (business logic)
- **Utilities**: 95%+ (pure functions)
- **UI**: 70%+ (composables)

## Sub-Skill Routing

When this skill is active and user intent matches a sub-skill, delegate:

| Intent | Sub-Skill | When |
|--------|-----------|------|
| UI components | `android-ui-lib` | Theme Compose components, design tokens |

## Rules
- Use StateFlow, not LiveData for state management
- Coroutines for async operations and Flow for data streams
- Jetpack Compose for all UI (no XML layouts)
- Use MockK for mocking in tests
- Keep composables small and focused
- Use Material 3 design system
- Support both light and dark themes
