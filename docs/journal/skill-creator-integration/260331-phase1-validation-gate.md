# Skill-Creator Validation Gate — Phase 1

**Date**: 2026-03-31
**Agent**: epost-fullstack-developer
**Epic**: skill-creator-integration
**Plan**: plans/260331-1232-skill-creator-integration/

## What was implemented

Hook that auto-runs `quick_validate.py` on every SKILL.md write/edit. Soft gate — never blocks, emits `additionalContext` only. Two new files:
- `packages/core/hooks/lib/skill-validate.cjs` — Python bridge with graceful fallbacks
- `packages/core/hooks/skill-validation-gate.cjs` — PostToolUse hook entry point

## Key decisions and why

- **Decision**: Classify "Unexpected key(s)" as INFO when all flagged keys are epost-standard
  **Why**: epost adds ~10 extra frontmatter fields (user-invocable, tier, context, agent, etc.) that the Anthropic spec doesn't recognize. Without this, every SKILL.md edit would produce a wall of "WARN" messages that devs would learn to ignore.

- **Decision**: Separate `Write|Edit` PostToolUse entry in settings.json rather than merging into existing `Edit|Write|MultiEdit` entry
  **Why**: Keeps skill validation isolated. The existing entry drives post-index and simplify reminders; mixing concerns makes future tuning harder.

## What almost went wrong

- `quick_validate.py` exits with code 1 for all failures — the exit code alone doesn't distinguish "missing required field" from "unexpected key". Had to parse stdout message text to classify level. [skill-creator SKILL.md] does not document this contract explicitly; it's an implementation detail of the Python script.
