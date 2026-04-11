---
name: android-code-review-rules-flow
description: "Android Kotlin Flow code review rules — FLOW category"
user-invocable: false
disable-model-invocation: true
---

# Android Flow Code Review Rules

Kotlin Flow code review rules. Loaded by code-review skill when reviewing `.kt` files with Flow usage.

**Scope**: Kotlin Flow in Android — lifecycle-aware collection, StateFlow exposure, repository contracts.

---

## FLOW: Kotlin Flow

**Scope**: Flow collection in Compose, StateFlow patterns in ViewModel, Flow lifecycle safety, repository result contracts.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| FLOW-001 | `collectAsStateWithLifecycle()` in Compose — never `collectAsState()` or raw `collect()` | critical | `val uiState by viewModel.uiState.collectAsStateWithLifecycle()` in Composable | `val uiState by viewModel.uiState.collectAsState()` — does not respect lifecycle; collects in background |
| FLOW-002 | ViewModel exposes `StateFlow` as `val` with private `_` backing field — never expose `MutableStateFlow` publicly | high | `private val _uiState = MutableStateFlow(LetterUiState()); val uiState: StateFlow<LetterUiState> = _uiState.asStateFlow()` | `val uiState = MutableStateFlow(LetterUiState())` exposed publicly; callers can mutate state directly |
| FLOW-003 | Flow not collected in `init {}` — collect in lifecycle-aware scope (`repeatOnLifecycle` or `collectAsStateWithLifecycle`) | high | `lifecycleScope.launch { repeatOnLifecycle(Lifecycle.State.STARTED) { viewModel.uiState.collect { … } } }` in Fragment | `init { viewModelScope.launch { uiState.collect { … } } }` — active even when UI is in background |
| FLOW-004 | Repository suspend functions return `Result<T>` (sealed Success/Error/Loading) — never throw raw exceptions to caller | high | `return try { Result.Success(api.fetchLetters()) } catch (e: Exception) { Timber.e(e); Result.Error(e) }` | `return api.fetchLetters()` with `throw NetworkException()` propagating unhandled to ViewModel |
| FLOW-005 | ViewModel `StateFlow` converted via `stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), initialValue)` — not held as raw `MutableStateFlow` | medium | `val uiState = repository.lettersFlow.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), LetterUiState())` | `private val _uiState = MutableStateFlow(LetterUiState())` used as the primary source when a repository Flow exists — misses automatic cancellation on subscriber loss |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| FLOW-001–002, FLOW-004–005 | Yes | — |
| FLOW-003 | — | Yes |

**Lightweight**: Run on all Kotlin files with Flow usage. **Escalated**: Activate on critical findings, large PRs (10+ files), or explicit `--deep` flag.

LW: 4/5 in this file.

## Extending

Add rules following the pattern `FLOW-{NNN}`. Keep severity consistent with cross-cutting rules in `code-review/references/code-review-standards.md`.
