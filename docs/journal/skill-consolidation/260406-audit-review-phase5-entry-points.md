# Audit/Review Phase 5 — Entry Points + Output Contract

**Date**: 2026-04-06
**Agent**: epost-fullstack-developer
**Epic**: skill-consolidation
**Plan**: plans/260405-1934-audit-review-phase1-consolidation/

## What was implemented

Clarified the `/audit` vs `/review` routing distinction and unified the verdict formula across all specialist agents. Five files changed:

- `audit/SKILL.md` — added decision table, platform detection for code-reviewer dispatch (both `--code` and hybrid step 5), removed "review" from triggers
- `audit/references/output-contract.md` — added Cross-DB Deduplication (6-step check across code/ui/a11y DBs) and Platform Context Passing sections
- `audit/references/report-template.md` — added Verdict Formula (4-condition table, max-verdict rule)
- `code-review/references/report-template.md` — reduced to 6-line reference pointer (was ~85 lines)
- `code-review/references/report-standard.md` — added Verdict Thresholds section pointing to unified formula

## Key decisions and why

- **Decision**: Cross-DB dedup references `reports/known-findings/` paths (not `.epost-data/` from task spec)
  **Why**: The actual known-findings DBs live at `reports/known-findings/{code,ui-components,a11y}.json` per the existing output-contract. The task spec used `.epost-data/` which was inconsistent with the established path pattern — corrected to match reality.

- **Decision**: Kept "review" in `connections.enhances` and `agent-affinity` metadata, removed only from `triggers:` list and description
  **Why**: The metadata connections are routing references (what this skill enhances), not trigger keywords. Removing them would break cross-skill navigation.

## What almost went wrong

- The task spec specified `.epost-data/` paths for the dedup check, but the existing output-contract already established `reports/known-findings/` as the canonical location. Using `.epost-data/` would have created a contradiction. Always read the existing file before implementing additions to it.
