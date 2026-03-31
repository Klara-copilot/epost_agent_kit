# Phase 5: Agent Upgrades — Adversarial Review, Scope Challenge, Verification Gate

**Date**: 2026-03-30
**Agent**: epost-fullstack-developer
**Epic**: claudekit-adoption
**Plan**: plans/260329-1414-claudekit-adoption/

## What was implemented

Extended 3 core agents and 2 skills with architectural guardrails sourced from claudekit v2.14 analysis:

- **epost-code-reviewer**: 3-stage review pipeline (Scout → Spec → Quality → Adversarial), scope-gated Stage 3, ACCEPT/REJECT/DEFER verdict system, fix-diff optimization
- **epost-planner**: 5-why scope challenge before any planning work, cross-plan dependency detection with `blocks`/`blockedBy` frontmatter fields
- **epost-fullstack-developer**: Verification-before-completion as a hard rule — anti-patterns named, completion evidence block mandatory
- **cook skill**: Planning pre-flight gate — blocks implementation when no active plan; `--no-gate` and `--plan` flags for escape hatches
- **plan skill**: `blocks`/`blockedBy` frontmatter schema + cross-plan detection steps

## Key decisions and why

- **Decision**: Edge case scout is Stage 0 (not a separate skill or pre-review mode)
  **Why**: Keeps pipeline linear; scout findings feed directly into Stage 1 focus. Separate skill would require orchestration from subagent which is blocked.

- **Decision**: Verdict system is ACCEPT/REJECT/DEFER (not Pass/Fail)
  **Why**: "Fail" implies blocking all issues. DEFER allows real-but-not-blocking issues to proceed with a note, avoiding review gridlock.

- **Decision**: Cook gate auto-skips for "quick fix" / bug-fix keywords, not just `--no-gate`
  **Why**: Hard gates with no escape create friction for legitimate one-liner fixes. Keyword detection preserves guard while staying pragmatic.

- **Decision**: Cross-plan detection is a warning, not a hard block
  **Why**: False conflicts (same file, different non-overlapping sections) are common. User confirmation keeps the human in the loop without automating a blocking decision.

## What almost went wrong

All changes are additive extensions to existing .md files — no test suite, no build step. The only risk was accidentally breaking existing section structure. Mitigated by reading each file before editing and updating section index line numbers in the navigation comment.
