---
name: android-development
description: Android development patterns with Kotlin and Jetpack Compose. Includes templates, patterns, and test examples for building production-ready Android apps.
keywords: [android, kotlin, jetpack-compose, mvvm, hilt, room, retrofit]
platforms: [android]
triggers: [".kt", ".kts", "build.gradle", "AndroidManifest.xml", "android"]
agent-affinity: [epost-android-developer, epost-implementer]
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
- **[build-gradle-app.kts](./templates/build-gradle-app.kts)** - App module with Compose, Hilt, Room, Retrofit
- **[build-gradle-lib.kts](./templates/build-gradle-lib.kts)** - Library module for shared code

### UI Components
- **[compose-screen-template.kt](./templates/compose-screen-template.kt)** - Complete screen with loading/error/success states
- **[navigation-template.kt](./templates/navigation-template.kt)** - Type-safe Navigation with nested graphs

### Architecture
- **[viewmodel-template.kt](./templates/viewmodel-template.kt)** - ViewModel with StateFlow and error handling
- **[hilt-module-template.kt](./templates/hilt-module-template.kt)** - Dependency injection setup

### Data Layer
- **[room-entity-dao-template.kt](./templates/room-entity-dao-template.kt)** - Database with migrations
- **[retrofit-service-template.kt](./templates/retrofit-service-template.kt)** - API service with error handling

## Architecture Patterns

### MVVM Pattern
Reference: [mvvm-architecture.md](./patterns/mvvm-architecture.md)

Layer responsibilities:
- **UI Layer**: Composables collect state, emit user actions
- **ViewModel Layer**: Holds StateFlow, processes actions, calls repositories
- **Domain Layer**: Business logic, use cases, domain models
- **Data Layer**: Repository implementations, Room, Retrofit

```kotlin
// Example Flow
User clicks button
    ↓
Composable calls ViewModel function
    ↓
ViewModel updates StateFlow
    ↓
Composable recomposes with new state
```

### Compose Best Practices
Reference: [compose-best-practices.md](./patterns/compose-best-practices.md)

Key concepts:
- **State Hoisting**: Move state up, pass down callbacks
- **Recomposition**: Use remember, derivedStateOf, keys in lists
- **Side Effects**: LaunchedEffect, DisposableEffect, rememberCoroutineScope
- **Modifiers**: Order matters, always accept Modifier parameter

### Error Handling
Reference: [error-handling.md](./patterns/error-handling.md)

Patterns:
- **Result Wrapper**: Sealed class for Success/Error/Loading
- **Custom Exceptions**: Domain-specific error types
- **User Messages**: Convert exceptions to friendly text
- **Retry Logic**: Exponential backoff for network errors
- **Validation**: Form validation with detailed errors

## Test Examples

### Unit Tests
- **[viewmodel-test-example.kt](./tests/viewmodel-test-example.kt)** - Test ViewModels with Turbine
- **[repository-test-example.kt](./tests/repository-test-example.kt)** - Test repositories with fakes/mocks

### UI Tests
- **[compose-ui-test-example.kt](./tests/compose-ui-test-example.kt)** - Compose testing with semantics

Testing patterns:
- Use `runTest` for coroutine tests
- Use `Turbine` for Flow assertions
- Use `MockK` for mocking
- Use Fake implementations for complex dependencies
- Test state transitions, not implementation

## Tech Stack

### Core (Required)
- **Language**: Kotlin 2.0+
- **Min SDK**: Android 7.0+ (API 24)
- **Target SDK**: Android 14+ (API 34)
- **UI**: Jetpack Compose + Material 3
- **Architecture**: MVVM with ViewModel + StateFlow

### Jetpack Libraries
- **Compose**: UI toolkit (BOM for version management)
- **Navigation**: Type-safe navigation with Compose
- **ViewModel**: Lifecycle-aware state management
- **Room**: Local database with Flow
- **Hilt**: Dependency injection

### Networking & Serialization
- **Retrofit**: HTTP client
- **OkHttp**: Networking layer with interceptors
- **Kotlinx Serialization**: JSON serialization (preferred over Gson)

### Concurrency
- **Coroutines**: Structured concurrency
- **Flow**: Reactive streams

### Testing
- **JUnit**: Unit testing framework
- **MockK**: Kotlin mocking library
- **Turbine**: Flow testing assertions
- **Compose Testing**: UI testing with semantics
- **Espresso**: Android UI testing (if needed)

## Usage Instructions

### 1. Starting New Android Project

Use app module template:
```kotlin
// Copy build-gradle-app.kts
// Configure namespace, applicationId, version
// Add version catalog (libs.versions.toml)
```

### 2. Creating a Feature

Use the template stack:
```kotlin
// 1. Define domain model (data class)
// 2. Create Repository interface (from hilt-module-template.kt)
// 3. Implement ViewModel (from viewmodel-template.kt)
// 4. Build Compose UI (from compose-screen-template.kt)
// 5. Add navigation (from navigation-template.kt)
// 6. Write tests (from test examples)
```

### 3. Setting Up Database

Use Room template:
```kotlin
// Copy room-entity-dao-template.kt
// Define entities with @Entity
// Create DAOs with suspend functions and Flow
// Add migrations for schema changes
// Inject via Hilt module
```

### 4. Setting Up API Client

Use Retrofit template:
```kotlin
// Copy retrofit-service-template.kt
// Define API endpoints
// Add interceptors (auth, logging)
// Use Kotlinx Serialization
// Wrap responses in Result type
```

### 5. Implementing Error Handling

Follow error-handling.md:
```kotlin
// Use Result<T> wrapper
// Define domain exceptions
// Convert to user messages
// Add retry logic for network calls
// Validate input early
```

### 6. Writing Tests

Use test templates:
```kotlin
// ViewModels: Test state transitions with Turbine
// Repositories: Use fakes or MockK
// UI: Test semantics, interactions, accessibility
// Aim for 80% overall coverage, 90% for ViewModels
```

## Version Compatibility

**Tested with:**
- Kotlin 2.0.21+
- Compose BOM 2024.12.01
- Android Gradle Plugin 8.7.3
- Hilt 2.51
- Room 2.6.1
- Retrofit 2.9.0

**Minimum Requirements:**
- Android Studio Ladybug | 2024.2.1+
- Gradle 8.9+
- JDK 17+

## Best Practices

1. **Keep files under 200 lines** - Split large files into smaller modules
2. **Use sealed interfaces for state** - Type-safe state representation
3. **Hoist state appropriately** - Balance reusability and simplicity
4. **Provide keys in lazy lists** - Optimize recomposition
5. **Use Flow for reactive data** - Observe database changes efficiently
6. **Map DTOs to domain models** - Keep layers isolated
7. **Handle errors gracefully** - Always provide user-friendly messages
8. **Test each layer independently** - Mock dependencies appropriately
9. **Use Material 3 design** - Follow system theme and dynamic colors
10. **Optimize for performance** - Profile with Instruments, minimize recomposition

## Common Patterns

### ViewModel with Flow
```kotlin
@HiltViewModel
class MyViewModel @Inject constructor(
    private val repository: MyRepository
) : ViewModel() {
    val uiState: StateFlow<UiState> = repository.observeData()
        .map { data -> UiState.Success(data) }
        .catch { emit(UiState.Error(it.message ?: "Error")) }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = UiState.Loading
        )
}
```

### Compose with State Collection
```kotlin
@Composable
fun MyScreen(viewModel: MyViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    when (val state = uiState) {
        is UiState.Loading -> LoadingView()
        is UiState.Success -> SuccessView(state.data)
        is UiState.Error -> ErrorView(state.message)
    }
}
```

### Repository with Caching
```kotlin
class MyRepository @Inject constructor(
    private val api: ApiService,
    private val dao: MyDao
) {
    fun observeData(): Flow<List<Item>> = dao.observeAll()

    suspend fun refresh() {
        val items = api.fetchItems()
        dao.insertAll(items)
    }
}
```

## References

- [Android Developer Docs](https://developer.android.com)
- [Kotlin Coroutines Guide](https://kotlinlang.org/docs/coroutines-guide.html)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Material 3 Design](https://m3.material.io)
- [Now in Android Sample](https://github.com/android/nowinandroid)

---

**Status**: Production-ready with comprehensive templates and patterns
