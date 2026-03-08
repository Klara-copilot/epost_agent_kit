# epost-planner: Klara-Theme Consumer Code Audit Expansion

**Date**: 2026-03-07 01:16
**Agent**: epost-planner
**Plan**: `plans/260307-0116-klara-consumer-audit/plan.md`
**Status**: COMPLETE

---

## Executive Summary

Expand the UI component audit skill to cover consumer code (feature teams using klara-theme). Adds INTEGRITY gate (3 rules), 6 new audit sections (38 rules), mode detection (consumer vs library), per-section ratings, and report schema v2.0. Existing library audit (35 rules) preserved unchanged after renumbering.

---

## Plan Details

- **Directory**: `plans/260307-0116-klara-consumer-audit/`
- **Phases**: 4 phases
- **Effort**: 6h
- **Platforms**: web

## Sources Analyzed

- `packages/core/skills/audit/SKILL.md` -- current audit skill structure
- `packages/core/skills/audit/references/ui.md` -- current library-only workflow (6 steps)
- `packages/core/skills/audit/references/audit-report-schema.md` -- v1.0 schema (flat findings, single score)
- `packages/design-system/skills/ui-lib-dev/SKILL.md` -- klara-theme pipeline overview
- `packages/design-system/skills/ui-lib-dev/references/audit-standards.md` -- 35 existing rules, 6 sections
- `packages/design-system/agents/epost-muji.md` -- muji agent with consumer audit section
- `plans/260306-1117-agent-teams-port/reports/epost-researcher-260306-2123-klara-audit-improvements.md` -- research report

## Files to Touch

| File | Action | Phase |
|------|--------|-------|
| `packages/design-system/skills/ui-lib-dev/references/audit-standards.md` | Expand: INTEGRITY + 6 new sections + renumber | Phase 1 |
| `packages/core/skills/audit/references/ui.md` | Expand: mode detection + consumer workflow steps | Phase 2 |
| `packages/core/skills/audit/references/audit-report-schema.md` | Expand: v2.0 schema with section ratings + new arrays | Phase 3 |
| `packages/design-system/agents/epost-muji.md` | Modify: consumer audit priorities | Phase 4 |

## Key Dependencies

- Phase 2 depends on phase 1 (workflow references rule IDs)
- Phase 3 depends on phase 2 (schema reflects workflow output)
- Phase 4 is independent (can parallel with phase 3)
- No external dependencies; all changes are skill/agent content

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Token budget bloat from 78 rules in audit-standards.md | Med | Progressive disclosure: mode table at top, full rules in sections |
| Library audit regression | High | Existing rules renumbered but unchanged; validation step confirms |
| DRY gating false negatives | Low | Conservative: only suppress if pattern in 2+ sibling files |

---

## Verdict

**READY** -- All source files read, research complete, 4 files to modify in packages/ (source of truth).

---

*Unresolved questions:*
- Tailwind config: hard-parse TS or just read + reference as context? (recommend: read as context, not parse)
- DRY scope: entire feature directory or immediate siblings only? (recommend: immediate siblings)
- REUSE absence: flag as violation or "contribution opportunity"? (recommend: high-severity violation with mentoring narrative)
- TEST in consumer mode: optional or required? (recommend: partial -- require test existence, skip coverage depth)
