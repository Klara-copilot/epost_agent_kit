---
title: "Klara-theme consumer code audit expansion"
status: active
created: 2026-03-07
updated: 2026-03-07
effort: 6h
phases: 4
platforms: [web]
breaking: false
---

# Klara Consumer Audit Expansion

Expand the UI component audit skill to cover consumer code (feature teams using klara-theme), not just library component development. Adds INTEGRITY gate, 27 new rules across 6 sections, mode detection, per-section ratings, and POC detection.

## Context

- Research: `plans/260306-1117-agent-teams-port/reports/epost-researcher-260306-2123-klara-audit-improvements.md`
- Current audit covers library components only (35 rules, 6 sections)
- Consumer code has different priorities: placement, reuse, Tailwind, DRY, React, POC

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Audit standards: INTEGRITY + 6 new sections | 2.5h | pending | [phase-1](./phase-1-audit-standards.md) |
| 2 | Workflow: mode detection + consumer steps | 1.5h | pending | [phase-2](./phase-2-audit-workflow.md) |
| 3 | Report schema v2.0 | 1h | pending | [phase-3](./phase-3-report-schema.md) |
| 4 | Muji agent: consumer audit priorities | 0.5h | pending | [phase-4](./phase-4-muji-agent.md) |

## Success Criteria

- `audit --ui` on consumer code triggers consumer mode with INTEGRITY + PLACE + REUSE + TW + DRY + REACT + POC
- `audit --ui` on library code triggers library mode with existing STRUCT-TEST sections (unchanged behavior)
- INTEGRITY violations block regardless of mode
- Report v2.0 includes per-section ratings and new arrays
- All edits in `packages/` (source of truth), NOT `.claude/`

## Dependencies

- None external; all changes are skill/agent content files
- Phase 2 depends on phase 1 (workflow references rule IDs from standards)
- Phase 3 depends on phase 2 (schema reflects workflow output)
- Phase 4 independent (can parallel with phase 3)

## Design Decisions

1. **INTEGRITY as Step 0** -- runs before mode detection, blocks on direct library modification
2. **Mode detection by path + imports** -- `libs/klara-theme/` = library, everything else = consumer
3. **DRY gating** -- patterns in 2+ sibling files treated as conventions, suppresses false positives
4. **Existing rules renumbered** -- STRUCT becomes section 7, etc. to accommodate new consumer-first sections
5. **Additive only** -- no existing rule behavior changes, just new sections + mode routing
