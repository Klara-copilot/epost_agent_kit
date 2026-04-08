---
phase: 2
title: "Android Rule Expansion"
effort: 2.5h
depends: []
---

# Phase 2: Android Rule Expansion

## Context

- Plan: [plan.md](./plan.md)
- Depends on: none (parallel-safe with Phase 1 — zero file overlap)
- Real stack (android_epostsdk): Kotlin JVM-21, Compose+ViewBinding, Hilt 2.54, Firebase BOM 33.1.2, Min SDK 26
- Real stack (luz_epost_android ✅ CONV-0001+0002): Kotlin 2.1.0, Compose+XML, Hilt 2.54, Retrofit 2.11.0+OkHttp 4.12.0, Room 2.6.1 (SQLCipher), DataStore 1.1.0, Coroutines 1.8.0, Ktor 2.3.3, Glide 5.0-rc01, Timber, AppAuth 0.11.1, Matrix Rust SDK, Checkstyle+SonarQube
- Confirmed conventions: backing fields prefixed `_` (CONV-0001); sealed `Result<T>` in Repository layer, `Timber.e()` not `Log.d`, `Flow.catch()` in streams (CONV-0002)

## Overview

Expand Android code review rules from 6 to 23. Modify existing file + create 3 new reference files.

## Files Owned

- `packages/platform-android/skills/android-development/references/code-review-rules.md` — expand COMPOSE (3->8) and HILT (3->5)
- `packages/platform-android/skills/android-development/references/code-review-rules-coroutine.md` — new, COROUTINE category (4 rules)
- `packages/platform-android/skills/android-development/references/code-review-rules-flow.md` — new, FLOW category (3 rules)
- `packages/platform-android/skills/android-development/references/code-review-rules-room.md` — new, ROOM category (3 rules)

## Requirements

### Expand COMPOSE (3 -> 8 rules)

Existing: COMPOSE-001 (stable types), COMPOSE-002 (side effects), COMPOSE-003 (derived state)

New rules:
| Rule ID | Rule | Severity | Tier |
|---------|------|----------|------|
| COMPOSE-004 | `LazyColumn`/`LazyRow` items have `key` parameter for stable identity | high | LW |
| COMPOSE-005 | State hoisted to caller — no `remember { mutableStateOf() }` for state that parent needs | high | LW |
| COMPOSE-006 | `@Preview` annotation on every non-trivial Composable — at least one default preview | medium | Escalated |
| COMPOSE-007 | No direct `ViewModel` construction in Composables — use `hiltViewModel()` or parameter injection | high | LW |
| COMPOSE-008 | Composable functions do not return values — return `Unit`, use callbacks for events | medium | Escalated |

### Expand HILT (3 -> 5 rules)

Existing: HILT-001 (@Inject constructor), HILT-002 (scope consistency), HILT-003 (Module for network/DB)

New rules:
| Rule ID | Rule | Severity | Tier |
|---------|------|----------|------|
| HILT-004 | No direct `Context` usage in ViewModel — use `@ApplicationContext context: Context` via constructor injection | high | LW |
| HILT-005 | `@HiltViewModel` annotation required on all ViewModels using injection | critical | LW |

**Note on Pass/Fail examples**: Ground in `luz_epost_android` patterns — `EpostSdkInitializer`, `KlaraRepository`, `TokenManager` as reference for correct scope and injection patterns (from ARCH-0001).

### New COROUTINE category (4 rules)

| Rule ID | Rule | Severity | Tier |
|---------|------|----------|------|
| COROUTINE-001 | `viewModelScope` for ViewModel-tied coroutines — never `GlobalScope` | critical | LW |
| COROUTINE-002 | `withContext(Dispatchers.IO)` for blocking ops (DB, network, file) — not on `Dispatchers.Main` | high | LW |
| COROUTINE-003 | `CancellationException` never caught and swallowed — rethrow or use `ensureActive()` | high | Escalated |
| COROUTINE-004 | `withTimeoutOrNull` for network/IO with time bounds — no unbounded suspend calls | medium | Escalated |

**Note on Pass/Fail examples**: Grounded in luz_epost_android Coroutines 1.8.0 patterns. COROUTINE-001/002 Pass examples from viewModelScope.launch + withContext(IO) as documented in CONV-0002 error handling pattern.

### New FLOW category (4 rules)

**Note**: FLOW-002 and FLOW-004 directly grounded in luz_epost_android CONV-0001 (backing field `_` prefix) and CONV-0002 (sealed Result<T> + Timber).

| Rule ID | Rule | Severity | Tier |
|---------|------|----------|------|
| FLOW-001 | `collectAsStateWithLifecycle()` in Compose — never `collectAsState()` or raw `collect()` | critical | LW |
| FLOW-002 | ViewModel exposes `StateFlow` as `val` with private `_` backing field — never expose `MutableStateFlow` publicly | high | LW |
| FLOW-003 | Flow not collected in `init {}` — collect in lifecycle-aware scope (`repeatOnLifecycle` or `collectAsStateWithLifecycle`) | high | Escalated |
| FLOW-004 | Repository suspend functions return `Result<T>` (sealed Success/Error/Loading) — never throw raw exceptions to caller | high | LW |

### New ROOM category (4 rules)

| Rule ID | Rule | Severity | Tier |
|---------|------|----------|------|
| ROOM-001 | No N+1 — use `@Relation` or `@Embedded`, not per-row queries in a loop | high | LW |
| ROOM-002 | Multi-step writes wrapped in `@Transaction` | high | Escalated |
| ROOM-003 | DAO queries return `Flow<T>` for reactive updates — not `suspend fun ... : List<T>` (unless one-shot read) | medium | Escalated |
| ROOM-004 | No raw SQL strings in DAO — use `@Query` with named parameters, not string concatenation | high | LW |

**Note**: ROOM-004 grounded in luz_epost_android Room 2.6.1 + SQLCipher stack — injection risk is real with encrypted DBs.

### Updated LW/Escalated table

After expansion:

| Rule IDs | Lightweight | Escalated only |
|----------|-------------|----------------|
| COMPOSE-001..002, COMPOSE-004..005, COMPOSE-007 | Yes | -- |
| COMPOSE-003, COMPOSE-006, COMPOSE-008 | -- | Yes |
| HILT-001, HILT-004..005 | Yes | -- |
| HILT-002..003 | -- | Yes |
| COROUTINE-001..002 | Yes | -- |
| COROUTINE-003..004 | -- | Yes |
| FLOW-001..002, FLOW-004 | Yes | -- |
| FLOW-003 | -- | Yes |
| ROOM-001, ROOM-004 | Yes | -- |
| ROOM-002..003 | -- | Yes |

**LW count**: 14 of 25 (56%). **Escalated**: 11 of 25 (44%). Total: 25 rules (from 6).

## Tasks

- [ ] Read existing `code-review-rules.md`, add COMPOSE-004 through COMPOSE-008 to COMPOSE table
- [ ] Add HILT-004 and HILT-005 to HILT table
- [ ] Update LW/Escalated table (COMPOSE-004..005,007 + HILT-004..005 to LW)
- [ ] Update frontmatter description to reflect new categories
- [ ] Create `code-review-rules-coroutine.md` with COROUTINE-001..004 + LW/Escalated table
- [ ] Create `code-review-rules-flow.md` with FLOW-001..004 + LW/Escalated table (FLOW-004 Pass: `Result.Success(data)` in repo; Fail: `throw NetworkException()` propagated raw)
- [ ] Create `code-review-rules-room.md` with ROOM-001..004 + LW/Escalated table (ROOM-004 Pass: `@Query("SELECT * FROM t WHERE id = :id")`; Fail: `@Query("SELECT * FROM t WHERE id = $id")`)
- [ ] Each new file: frontmatter with `name`, `description`, `user-invocable: false`, `disable-model-invocation: true`
- [ ] Verify all Pass/Fail examples are concrete Kotlin code snippets

## Validation

- All rule tables have 5 columns: Rule ID | Rule | Severity | Pass | Fail
- LW/Escalated table sums to total rule count
- No duplicate Rule IDs across files
- New files follow exact frontmatter pattern of web ePost-specific rule files

## Success Criteria

- [ ] 25 Android rules total across 4 files (8 COMPOSE + 5 HILT + 4 COROUTINE + 4 FLOW + 4 ROOM)
- [ ] Every rule has a concrete Pass and Fail Kotlin code example
- [ ] LW/Escalated split is ~50/50
