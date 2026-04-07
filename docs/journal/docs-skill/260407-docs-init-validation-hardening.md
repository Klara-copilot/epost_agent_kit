# Harden docs --init Pre-Write Validation

**Date**: 2026-04-07
**Agent**: epost-fullstack-developer
**Epic**: docs-skill
**Plan**: plans/260407-0857-docs-init-fixes/

## What was implemented / fixed

Strengthened `packages/core/skills/docs/references/init.md` to fix 4 categories of `index.json` blocker observed across 10 repos:

1. Replaced all three soft §5.5 Pre-Write Validation tables (Smart Init, Generation Mode, Migration Mode) with an 8-row blocking checklist prefaced with "STOP — DO NOT WRITE". Each row explicitly covers: `business.domain`, all three `dependencies.*` nested arrays, `entries`, `entries[].id` format, `entries[].path`, and `entries[].category`.

2. Added §4.9 "Entry Schema & ID Format" with derivation rule, Correct examples, and anti-pattern tables covering `"auth-token-refresh"` (slug-as-id), missing zero-padding, lowercase prefix, slug-in-id, and missing path.

3. Collapsed Migration Mode §5.5 to a single-line reference (DRY).

4. Annotated `id` and `path` in the §5 template with REQUIRED comments.

5. Synced packages/ → .claude/ directly (epost-kit init requires interactive prompt).

## Key decisions and why

- **Decision**: Put §4.9 inside Generation Mode (before §5) rather than at top-level.
  **Why**: Smart Init references "Generation Mode step 5" — placing §4.9 before §5 ensures it's discovered by all modes without duplicating it.

- **Decision**: Collapse Migration Mode §5.5 rather than copy the 8-row table.
  **Why**: Three copies of the same table means three places to update. Reference keeps one source of truth.

## What almost went wrong

- [docs] The `epost-kit init` interactive prompt would have blocked sync. Plan said "run epost-kit init" but the CLI exits on non-interactive stdin. Direct file copy was the right workaround — but [docs/cook] skill should mention this edge case for single-file syncs.
