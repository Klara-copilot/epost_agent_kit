---
title: "Audit report organization: dated folders + known-findings JSON per topic"
status: completed
created: 2026-03-10
updated: 2026-03-10
effort: 3h
phases: 3
platforms: [all]
breaking: false
---

# Audit Report Organization

## Summary

Reports currently land flat in `reports/` root. Audit sub-reports use session folders but general agent reports (plans, research, implementation) do not. This plan groups ALL sub-reports into dated folders and establishes a `known-findings/` JSON store per topic (a11y, ui-components, code) inside `.epost-data/`.

## Key Dependencies

- `packages/core/skills/audit/references/output-contract.md` -- session folder contract (already defined for audits)
- `packages/core/skills/core/references/index-protocol.md` -- `reports/index.json` schema
- `packages/core/skills/core/references/report-standard.md` -- report anatomy
- `packages/a11y/assets/known-findings-schema.json` -- existing a11y schema
- `packages/core/skills/audit/references/ui-known-findings-schema.md` -- existing UI schema
- PLAN-0064b `260309-0521-audit-session-folder-pattern` -- overlapping plan for session folders (audit-specific)

## Relationship to Existing Plans

PLAN-0064b (`audit-session-folder-pattern`) is **archived as superseded** by this plan. This plan covers the same session-folder concept plus:
1. Groups non-audit reports into dated folders too
2. Formalizes `.epost-data/{topic}/known-findings.json` as the canonical store
3. Unifies the three known-findings schemas into a common base

Plan-scoped reports (when a plan is active) remain **flat** inside the plan dir (no dated subfolder nesting).

## Execution Strategy

Phase 1 formalizes the `.epost-data/` known-findings store. Phase 2 extends `reports/` to group all report types in folders. Phase 3 updates index-protocol + report-standard. Sequential -- each phase builds on the prior.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Known-findings JSON store per topic | 1h | completed | [phase-1](./phase-1-known-findings-store.md) |
| 2 | Dated report folders for all report types | 1.5h | completed | [phase-2](./phase-2-dated-report-folders.md) |
| 3 | Index protocol + report standard updates | 30m | completed | [phase-3](./phase-3-index-and-standard-updates.md) |

## Critical Constraints

- All edits in `packages/` -- never `.claude/` directly
- `.epost-data/` is gitignored (project-local data, not kit source)
- known-findings schemas ship as assets in packages (a11y, core) for consumer projects
- Existing `reports/index.json` entries must remain valid (backward compat)

## Success Criteria

- [ ] `.epost-data/a11y/known-findings.json` schema unchanged (already v1.3)
- [ ] `.epost-data/ui/known-findings.json` schema documented in `packages/core/skills/audit/references/`
- [ ] `.epost-data/code/known-findings.json` schema created in `packages/core/skills/code-review/references/`
- [ ] `output-contract.md` references all three topic stores
- [ ] `report-standard.md` documents dated-folder pattern for non-audit reports
- [ ] `index-protocol.md` `reports/index.json` schema uses `path` field pointing to folder
- [ ] Agents instructed to write reports into `reports/{YYMMDD-HHMM}-{slug}/` not flat files
