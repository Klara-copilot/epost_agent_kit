---
name: android-code-review-rules
description: "Android-specific code review rules — COMPOSE, HILT categories"
user-invocable: false
disable-model-invocation: true
---

# Android Code Review Rules

Kotlin / Jetpack Compose / Hilt code review rules. Loaded by code-review skill when reviewing `.kt` files.

**Scope**: Kotlin / Jetpack Compose / Hilt Android apps — recomposition, side effects, dependency injection.

---

## COMPOSE: Jetpack Compose

**Scope**: Composable functions — stability, side effects, derived state.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| COMPOSE-001 | Composable parameters are stable types — primitives, `data class`, or `@Stable` | high | `data class UserItem(val id: String, val name: String)` passed as parameter | Mutable `List<T>` or `Map<K,V>` passed directly; Compose cannot detect changes |
| COMPOSE-002 | Side effects use effect handlers — no coroutine launch in composition body | high | `LaunchedEffect(key) { … }`, `SideEffect { … }`, or `DisposableEffect` | `coroutineScope.launch { … }` or `viewModel.load()` called directly in composable body |
| COMPOSE-003 | Derived state wrapped in `remember` or `derivedStateOf` | medium | `val sorted = remember(list) { list.sortedBy { it.name } }` | `val sorted = list.sortedBy { it.name }` recalculated on every recomposition |

---

## HILT: Dependency Injection

**Scope**: Hilt modules, ViewModel injection, component scopes.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| HILT-001 | All DI-managed classes have `@Inject constructor` | high | `class UserRepository @Inject constructor(val api: UserApi)` | `val repo = UserRepository(api)` manually constructed inside ViewModel or Fragment |
| HILT-002 | Dependency scopes are consistent — larger scope does not depend on smaller | critical | `@Singleton` class only injects other `@Singleton` or unscoped dependencies | `@Singleton` ViewModel depends on `@ActivityScoped` repository |
| HILT-003 | Network/DB clients provided via Hilt `@Module`, not constructed manually | high | `@Provides @Singleton fun provideRetrofit(…): Retrofit` in `@Module` | `Retrofit.Builder().build()` called directly inside ViewModel or Repository |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| COMPOSE-001–002 | Yes | — |
| HILT-001 | Yes | — |
| COMPOSE-003 | — | Yes |
| HILT-002–003 | — | Yes |

**Lightweight**: Run on all Kotlin file reviews. **Escalated**: Activate on critical findings, large PRs (10+ files), or explicit `--deep` flag.

## Extending

Add rules following the pattern `{CATEGORY}-{NNN}`. Keep severity consistent with cross-cutting rules in `code-review/references/code-review-standards.md`.
