---
name: android-code-review-rules
description: "Android-specific code review rules — COMPOSE, HILT categories (8 + 5 rules)"
user-invocable: false
disable-model-invocation: true
---

# Android Code Review Rules

Kotlin / Jetpack Compose / Hilt code review rules. Loaded by code-review skill when reviewing `.kt` files.

**Scope**: Kotlin / Jetpack Compose / Hilt Android apps — recomposition, side effects, dependency injection.

---

## COMPOSE: Jetpack Compose

**Scope**: Composable functions — stability, side effects, derived state, state hoisting, previews.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| COMPOSE-001 | Composable parameters are stable types — primitives, `data class`, or `@Stable` | high | `data class UserItem(val id: String, val name: String)` passed as parameter | Mutable `List<T>` or `Map<K,V>` passed directly; Compose cannot detect changes |
| COMPOSE-002 | Side effects use effect handlers — no coroutine launch in composition body | high | `LaunchedEffect(key) { … }`, `SideEffect { … }`, or `DisposableEffect` | `coroutineScope.launch { … }` or `viewModel.load()` called directly in composable body |
| COMPOSE-003 | Derived state wrapped in `remember` or `derivedStateOf` | medium | `val sorted = remember(list) { list.sortedBy { it.name } }` | `val sorted = list.sortedBy { it.name }` recalculated on every recomposition |
| COMPOSE-004 | `LazyColumn`/`LazyRow` items have `key` parameter for stable identity | high | `LazyColumn { items(list, key = { it.id }) { item -> … } }` | `LazyColumn { items(list) { item -> … } }` without key; causes full list recomposition on change |
| COMPOSE-005 | State hoisted to caller — no `remember { mutableStateOf() }` for state that parent needs | high | `@Composable fun Counter(count: Int, onIncrement: () -> Unit)` with state in parent | `@Composable fun Counter() { var count by remember { mutableStateOf(0) } }` trapping state inside |
| COMPOSE-006 | `@Preview` annotation on every non-trivial Composable — at least one default preview | medium | `@Preview(showBackground = true) @Composable fun LetterCardPreview()` above the composable | Composable exported with no `@Preview` annotation; cannot be visually verified without running app |
| COMPOSE-007 | No direct `ViewModel` construction in Composables — use `hiltViewModel()` or parameter injection | high | `@Composable fun Screen(vm: ScreenViewModel = hiltViewModel())` | `@Composable fun Screen() { val vm = ScreenViewModel(…) }` constructed directly |
| COMPOSE-008 | Composable functions do not return values — return `Unit`, use callbacks for events | medium | `@Composable fun Button(onClick: () -> Unit)` with event passed up via lambda | `@Composable fun getButtonLabel(): String` returning a value instead of rendering UI |

---

## HILT: Dependency Injection

**Scope**: Hilt modules, ViewModel injection, component scopes.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| HILT-001 | All DI-managed classes have `@Inject constructor` | high | `class UserRepository @Inject constructor(val api: UserApi)` | `val repo = UserRepository(api)` manually constructed inside ViewModel or Fragment |
| HILT-002 | Dependency scopes are consistent — larger scope does not depend on smaller | critical | `@Singleton` class only injects other `@Singleton` or unscoped dependencies | `@Singleton` ViewModel depends on `@ActivityScoped` repository |
| HILT-003 | Network/DB clients provided via Hilt `@Module`, not constructed manually | high | `@Provides @Singleton fun provideRetrofit(…): Retrofit` in `@Module` | `Retrofit.Builder().build()` called directly inside ViewModel or Repository |
| HILT-004 | No direct `Context` usage in ViewModel — use `@ApplicationContext context: Context` via constructor injection | high | `class MyViewModel @Inject constructor(@ApplicationContext private val context: Context)` | `class MyViewModel : ViewModel() { val ctx = application.applicationContext }` accessed directly |
| HILT-005 | `@HiltViewModel` annotation required on all ViewModels using injection | critical | `@HiltViewModel class LetterViewModel @Inject constructor(private val repo: LetterRepository) : ViewModel()` | `class LetterViewModel(private val repo: LetterRepository) : ViewModel()` without `@HiltViewModel` |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| COMPOSE-001–002, COMPOSE-004–005, COMPOSE-007 | Yes | — |
| COMPOSE-003, COMPOSE-006, COMPOSE-008 | — | Yes |
| HILT-001, HILT-004–005 | Yes | — |
| HILT-002–003 | — | Yes |

**Lightweight**: Run on all Kotlin file reviews. **Escalated**: Activate on critical findings, large PRs (10+ files), or explicit `--deep` flag.

LW: 8/13 in this file.

## Extending

Add rules following the pattern `{CATEGORY}-{NNN}`. Keep severity consistent with cross-cutting rules in `code-review/references/code-review-standards.md`.

Additional categories in separate files: `code-review-rules-coroutine.md`, `code-review-rules-flow.md`, `code-review-rules-room.md`.
