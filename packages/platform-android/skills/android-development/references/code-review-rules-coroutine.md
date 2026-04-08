---
name: android-code-review-rules-coroutine
description: "Android Kotlin Coroutines code review rules — COROUTINE category"
user-invocable: false
disable-model-invocation: true
---

# Android Coroutine Code Review Rules

Kotlin Coroutines code review rules. Loaded by code-review skill when reviewing `.kt` files with coroutine usage.

**Scope**: Kotlin Coroutines in Android — scope management, dispatcher usage, cancellation, timeouts.

---

## COROUTINE: Kotlin Coroutines

**Scope**: Coroutine scope selection, dispatcher correctness, cancellation safety, timeout handling.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| COROUTINE-001 | `viewModelScope` for ViewModel-tied coroutines — never `GlobalScope` | critical | `viewModelScope.launch { loadLetters() }` inside ViewModel | `GlobalScope.launch { loadLetters() }` — leaks coroutine after ViewModel is cleared |
| COROUTINE-002 | `withContext(Dispatchers.IO)` for blocking ops (DB, network, file) — not on `Dispatchers.Main` | high | `val result = withContext(Dispatchers.IO) { repository.fetchLetters() }` | `val result = repository.fetchLetters()` called on `Dispatchers.Main`; blocks UI thread |
| COROUTINE-003 | `CancellationException` never caught and swallowed — rethrow or use `ensureActive()` | high | `try { … } catch (e: Exception) { if (e is CancellationException) throw e; Timber.e(e) }` | `try { … } catch (e: Exception) { Timber.e(e) }` swallowing `CancellationException`; breaks cooperative cancellation |
| COROUTINE-004 | `withTimeoutOrNull` for network/IO with time bounds — no unbounded suspend calls | medium | `val data = withTimeoutOrNull(5_000) { api.fetchLetters() } ?: emptyList()` | `val data = api.fetchLetters()` with no timeout; hangs indefinitely on network failure |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| COROUTINE-001–002 | Yes | — |
| COROUTINE-003–004 | — | Yes |

**Lightweight**: Run on all Kotlin files with coroutine usage. **Escalated**: Activate on critical findings, large PRs (10+ files), or explicit `--deep` flag.

LW: 2/4 in this file.

## Extending

Add rules following the pattern `COROUTINE-{NNN}`. Keep severity consistent with cross-cutting rules in `code-review/references/code-review-standards.md`.
