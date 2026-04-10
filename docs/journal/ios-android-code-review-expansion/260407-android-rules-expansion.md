# Android Code Review Rules Expansion — Phase 2

**Date**: 2026-04-07
**Agent**: epost-fullstack-developer
**Epic**: ios-android-code-review-expansion
**Plan**: plans/260406-2347-ios-android-code-review-expansion/

## What was implemented

Expanded Android code review rules from 6 to 25 by adding 5 new rules to the existing COMPOSE/HILT file and creating 3 new category files:

- `code-review-rules.md`: +5 COMPOSE rules (004–008) + 2 HILT rules (004–005)
- `code-review-rules-coroutine.md`: 4 COROUTINE rules — scope, dispatcher, cancellation, timeout
- `code-review-rules-flow.md`: 4 FLOW rules — lifecycle-aware collection, StateFlow exposure, result contracts
- `code-review-rules-room.md`: 4 ROOM rules — N+1, transactions, reactive DAOs, query safety

## Key decisions and why

- **Decision**: Split COROUTINE/FLOW/ROOM into separate files rather than appending to main file
  **Why**: Keeps each file focused on one category and under 200 lines per file-organization rules. Enables targeted loading by the code-review skill based on file content (e.g., only load ROOM rules when reviewing DAO files).

- **Decision**: FLOW-004 (repository Result<T> contract) placed in FLOW not COROUTINE
  **Why**: The rule is about the return contract of suspend functions exposed as Flow sources — semantically a Flow architectural pattern, not a coroutines cancellation concern.

## What almost went wrong

- The LW count in the spec said "LW: 8/13" for the main file. Verified by counting: COMPOSE-001, 002, 004, 005, 007 (5) + HILT-001, 004, 005 (3) = 8 LW rules out of 13 total. Math checked out.
- FLOW-004 spec said `high | LW` but FLOW-003 said `high | Escalated` — different severity/tier combos on same severity level. This is intentional: tier assignment is independent of severity; kept as specified.
