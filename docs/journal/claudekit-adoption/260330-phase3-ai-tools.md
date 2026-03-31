# Phase 3: AI Tools — predict, scenario, loop

**Date**: 2026-03-30
**Agent**: epost-fullstack-developer
**Epic**: claudekit-adoption
**Plan**: plans/260329-1414-claudekit-adoption/

## What was implemented

Three new workflow skills from the ClaudeKit adoption plan:

- **predict** — 5-persona expert debate (Architect / Security / Performance / UX / Devil's Advocate) producing GO/CAUTION/STOP consensus before major decisions
- **scenario** — 12-dimension edge case generator (user types, input extremes, timing, scale, state transitions, environment, error cascades, authorization, data integrity, integration, compliance, business logic) that feeds output directly into `/test`
- **loop** — autonomous metric-improvement loop using git as memory: ONE atomic change → commit → verify → keep/discard with stuck detection at 5/10 consecutive discards
- 4 loop reference files: mechanical-metrics (verify command library), autonomous-loop-protocol (8-phase spec), git-memory-pattern (commit discipline), guard-and-noise (regression patterns + noise tolerance), results-logging (TSV schema + stuck detection)

## Key decisions and why

- **Decision**: `predict` uses context-weighted voting (not majority rules)
  **Why**: A 3-2 majority GO vote where Security says STOP is dangerous for auth features. Weighting by feature domain makes the output actionable.

- **Decision**: `scenario` output is structured as a test seed list that feeds `/test` directly
  **Why**: Scenario analysis is only useful if it produces actionable test cases. Direct integration closes the loop.

- **Decision**: `loop` enforces `git revert` (not `git reset`) on discard
  **Why**: Preserving history enables resumability after interruption and provides an audit trail of all attempted improvements.

## What almost went wrong

- The `loop` skill's resumability depends on `loop-results.tsv` existing and being append-only. If someone deletes it mid-loop, the only fallback is parsing `git log` for `loop[n/N]:` prefixed commits. This is documented in `references/results-logging.md` but not enforced — [loop] should have a guard step that validates tsv exists before starting an iteration.
