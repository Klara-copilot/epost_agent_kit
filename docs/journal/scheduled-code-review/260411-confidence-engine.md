# Phase 1 — Confidence Engine

**Date**: 2026-04-11
**Agent**: epost-fullstack-developer
**Epic**: scheduled-code-review
**Plan**: plans/260410-1458-scheduled-code-review/

## What was implemented

Added confidence metadata to the `code-review` skill output layer. Every finding now carries `(severity_score, confidence, confirmed_by, confidence_source)` — the minimum contract Phases 2 and 3 need to distinguish blocking from informational noise.

Files changed:
- Created `packages/core/skills/code-review/references/confidence-scoring.md` — full spec: assignment rules, 2-pass protocol, filter thresholds, backward compat note
- Extended `packages/core/skills/code-review/references/code-known-findings-schema.md` — 4 new fields (`severity_score`, `confidence`, `confirmed_by`, `confidence_source`) in schema + finding object example
- Updated `packages/core/skills/code-review/SKILL.md` — "Confidence Scoring" section summarising thresholds; persist-findings mapping extended
- Updated `packages/core/skills/code-review/references/report-template.md` — findings table now includes Confidence and Confirmed By columns

## Key decisions and why

- **Decision**: `confidence_source` (not `source`) for the new confidence enum field
  **Why**: Schema already has `source: "hybrid-audit" | "code-review" | "manual"` — reusing `source` would have caused ambiguity in the finding object

- **Decision**: `severity_score` integer alongside existing string `severity`
  **Why**: Downstream consumers (Phase 2 PR gate, Phase 3 scan) need numeric comparison (`severity_score >= 4`). The string `severity` is retained for human-readable reports and backward compat

- **Decision**: 2-pass only when `severity >= 4`
  **Why**: R1 mitigation — 2-pass doubles token cost; high-severity findings are the only ones worth the extra spend. Low/medium findings don't gate PRs.

## What almost went wrong

The plan phase file specified `report-template.md` as a target but the actual file had a minimal structure (just a section list). Needed to add the new columns with conditional omission note — otherwise reviewers would add the columns even for deterministic-only reviews and make reports noisy. [code-review skill] did not pre-specify when to omit confidence columns.
