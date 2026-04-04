# Phase 2: Artifact Persistence + File Fingerprinting

**Date**: 2026-04-04
**Agent**: epost-fullstack-developer
**Epic**: understand-anything
**Plan**: plans/260403-2206-understand-anything-adoption/

## What was implemented

Two protocol reference files created in `core/references/`:
- `artifact-persistence-protocol.md` — `.epost-cache/` directory convention, JSON envelope format, cleanup rule (7-day prune), `.gitignore` guidance, recovery behavior
- `file-fingerprinting-protocol.md` — SHA-256 hash format, skip logic, batch hash command, invalidation rules, scope constraints

Five skills modified with minimal targeted additions:
- `audit/SKILL.md` — fingerprint pre-check step (skip unchanged files, exception for security audits)
- `test/SKILL.md` — fingerprint pre-check step (skip unchanged test targets, exception for `--coverage`)
- `debug/SKILL.md` — trace artifact output step after root cause identified
- `cook/SKILL.md` — artifact consumption step (Step 0c) before each phase begins
- `docs/SKILL.md` — fingerprint gate for `--scan`/`--update` + discovery artifact write for `--init`/`--scan`

## Key decisions and why

- **Decision**: Added fingerprint check as a named step before existing audit/test logic rather than inlining in existing steps.
  **Why**: Named steps are scannable — agents can skip to "Fingerprint Pre-Check" without re-reading surrounding content.

- **Decision**: Security audits exempt from fingerprint skip.
  **Why**: Security checks must validate all files every time — stale skips create audit gaps. Explicit exception stated in the skill.

- **Decision**: `--coverage` flag always triggers full test run.
  **Why**: Coverage metrics require all files to be exercised — partial coverage data is misleading.

- **Decision**: Cook artifact consumption placed in new Step 0c between plan resolution and implementation.
  **Why**: Preserves the existing step numbering (Step 0, 0b, 1) — insertion as 0c avoids renumbering downstream steps.

## What almost went wrong

- The `audit/SKILL.md` fingerprint step was initially drafted to apply to all audit modes including security. Added explicit exception to avoid weakening the security posture — `core/rules/verification.md` principle: safety over speed.
- `cook/SKILL.md` had existing Step 0 → 0b flow. Adding a third pre-phase step needed care to not confuse the plan resolution logic. Solution: named it Step 0c and made it clearly post-plan-resolution.
