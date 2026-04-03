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

## Hilt DI Testing

Use `@HiltAndroidTest` on any test that requires Hilt injection. Call `hiltRule.inject()` in `@Before`.

```kotlin
@HiltAndroidTest
@RunWith(AndroidJUnit4::class)
class LoginViewModelTest {

    @get:Rule
    var hiltRule = HiltAndroidRule(this)

    @Inject
    lateinit var viewModel: LoginViewModel

    @Before
    fun setUp() {
        hiltRule.inject()
    }
}
```

**Preferred: `@TestInstallIn`** — replaces a production module for the entire test source set. One Dagger component compiled once, shared across all tests:

```kotlin
@Module
@TestInstallIn(
    components = [SingletonComponent::class],
    replaces = [AuthModule::class]
)
abstract class FakeAuthModule {
    @Binds
    abstract fun bindAuthRepo(fake: FakeAuthRepository): AuthRepository
}
```

**Ad-hoc override: `@BindValue`** — replaces a binding for a single test class:

```kotlin
@HiltAndroidTest
class SomeTest {
    @BindValue @JvmField
    val authRepo: AuthRepository = mockk(relaxed = true)
}
```

**Avoid `@UninstallModules`** — it generates a custom Dagger component per test class, significantly slowing build times.

See `references/hilt-testing.md` for full examples and scoping patterns.

## ViewModel + Flow Testing

Use `runTest` from `kotlinx-coroutines-test`. Replace `Dispatchers.Main` with `StandardTestDispatcher`.

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class LoginViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule() // sets Main to TestDispatcher

    private val authRepo = mockk<AuthRepository>()
    private lateinit var viewModel: LoginViewModel

    @Before
    fun setUp() {
        viewModel = LoginViewModel(authRepo)
    }

    @Test
    fun `login success emits LoggedIn state`() = runTest {
        coEvery { authRepo.login(any(), any()) } returns Result.success(fakeUser)

        viewModel.login("user@example.com", "password")
        advanceUntilIdle()

        assertEquals(LoginUiState.LoggedIn, viewModel.uiState.value)
    }
}
```

**Turbine** for Flow assertions:

```kotlin
@Test
fun `user stream emits updates`() = runTest {
    viewModel.users.test {
        val first = awaitItem()
        assertEquals(emptyList<User>(), first)

        viewModel.loadUsers()
        val loaded = awaitItem()
        assertEquals(2, loaded.size)

        cancelAndIgnoreRemainingEvents()
    }
}
```

## Room Testing

```kotlin
private lateinit var db: AppDatabase
private lateinit var dao: UserDao

@Before
fun createDb() {
    db = Room.inMemoryDatabaseBuilder(
        ApplicationProvider.getApplicationContext(),
        AppDatabase::class.java
    )
        .allowMainThreadQueries()
        .build()
    dao = db.userDao()
}

@After
fun closeDb() {
    db.close()
}

@Test
fun insertAndReadUser() = runTest {
    val user = User(id = 1, name = "Alice")
    dao.insert(user)
    val result = dao.getById(1)
    assertEquals(user, result)
}
```

`allowMainThreadQueries()` is safe in tests — removes the Room main-thread guard without performance concerns. Use `runTest` for all `suspend` DAO functions.

## MockK Patterns

```kotlin
// Basic mock
val repo = mockk<UserRepository>()

// Stub return value
every { repo.getUser(1) } returns fakeUser

// Stub suspend function
coEvery { repo.fetchUser(1) } returns Result.success(fakeUser)

// Relaxed mock — auto-stubs all methods with default values
val repo = mockk<UserRepository>(relaxed = true)

// Verify call happened
verify { repo.getUser(1) }

// Verify suspend call
coVerify { repo.fetchUser(1) }

// Capture argument
val slot = slot<Int>()
every { repo.getUser(capture(slot)) } returns fakeUser
repo.getUser(42)
assertEquals(42, slot.captured)
```

Use `mockk(relaxed = true)` when only a subset of methods are under test — avoids boilerplate stubs for unrelated calls.

## References

- `references/compose-ui-testing.md` — Full matcher table, actions, flakiness patterns, Compose+Views interop
- `references/hilt-testing.md` — @TestInstallIn, @BindValue, scoped fakes, custom test application
