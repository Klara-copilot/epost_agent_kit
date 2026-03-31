# Merge review skill into audit

**Date**: 2026-03-31
**Agent**: epost-fullstack-developer
**Epic**: skill-rationalization

## What was implemented

Merged `review` skill into `audit`, then deleted `review`. The two skills were largely redundant — review's `--code`, `--a11y`, and `--ui` flags all dispatched to the same agents as audit's equivalent flags. Only `--improvements` mode was unique to review.

## Key decisions and why

- **Decision**: Move `improvements.md` and a11y guidance mode files to `audit/references/`, skip moving `code.md`/`a11y.md`/`ui-mode.md`
  **Why**: Those three reference files are already superseded by audit's existing references. The guidance modes (ios/android) are useful reference content worth preserving under audit.

- **Decision**: Changed CONNECTION_MAP `audit enhances review` → `audit enhances code-review`
  **Why**: With review deleted, the connection target was a dead reference. `code-review` (the methodology skill) is the correct enhancement target for audit.

- **Decision**: Updated audit description to include all of review's trigger phrases
  **Why**: Ensures skill-discovery routes "review", "check my code", "is this good" to audit without a separate skill entry.

## What almost went wrong

- review's `--improvements` mode ran inline (not dispatched to any agent) — easy to miss. Confirmed it was the only truly unique mode by comparing all four flag paths against audit's existing flags before deleting.
