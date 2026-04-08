---
name: android-code-review-rules-room
description: "Android Room database code review rules — ROOM category"
user-invocable: false
disable-model-invocation: true
---

# Android Room Code Review Rules

Room database code review rules. Loaded by code-review skill when reviewing `.kt` files with Room DAO/Entity usage.

**Scope**: Room database layer — N+1 queries, transactions, reactive DAO return types, query parameter safety.

---

## ROOM: Room Database

**Scope**: Room DAO patterns, query safety, transaction correctness, reactive return types.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| ROOM-001 | No N+1 — use `@Relation` or `@Embedded`, not per-row queries in a loop | high | `@Transaction @Query("SELECT * FROM letters") fun getLettersWithRecipients(): List<LetterWithRecipients>` using `@Relation` | `val letters = dao.getLetters(); letters.map { dao.getRecipient(it.recipientId) }` — N+1 query per letter |
| ROOM-002 | Multi-step writes wrapped in `@Transaction` | high | `@Transaction suspend fun moveLetterToArchive(id: String) { updateStatus(id, ARCHIVED); insertAuditLog(id) }` | `dao.updateStatus(id, ARCHIVED); dao.insertAuditLog(id)` called separately — partial writes possible on failure |
| ROOM-003 | DAO queries return `Flow<T>` for reactive updates — not `suspend fun ... : List<T>` (unless one-shot read) | medium | `@Query("SELECT * FROM letters") fun observeLetters(): Flow<List<Letter>>` for UI-bound queries | `@Query("SELECT * FROM letters") suspend fun getLetters(): List<Letter>` for a query that drives UI state |
| ROOM-004 | No raw SQL string concatenation in `@Query` — use named parameters (`:param`), not string interpolation | high | `@Query("SELECT * FROM letters WHERE id = :id") suspend fun getById(id: String): Letter?` | `@Query("SELECT * FROM letters WHERE id = '$id'")` using string interpolation — SQL injection risk |

---

## Lightweight vs Escalated

| Rule IDs | Lightweight (default) | Escalated only |
|----------|-----------------------|----------------|
| ROOM-001, ROOM-004 | Yes | — |
| ROOM-002–003 | — | Yes |

**Lightweight**: Run on all Kotlin files with Room DAO usage. **Escalated**: Activate on critical findings, large PRs (10+ files), or explicit `--deep` flag.

LW: 2/4 in this file.

## Extending

Add rules following the pattern `ROOM-{NNN}`. Keep severity consistent with cross-cutting rules in `code-review/references/code-review-standards.md`.
