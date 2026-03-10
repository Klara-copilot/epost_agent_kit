---
id: PLAN-0071
title: "Audit Organism/POC Mode — Classification, Maturity Tiers, Organism Checklist"
status: complete
created: 2026-03-09
updated: 2026-03-10
effort: 6h
phases: 4
platforms: [all]
breaking: false
authors: [epost-planner]
tags: [audit, organism, poc, maturity, checklist, muji, classification]
related-plans: [PLAN-0057, PLAN-0059, PLAN-0064, PLAN-0065]
---

# Audit Organism/POC Mode

## Context

The audit checklist (`checklist-web.md`) targets atoms/molecules. Applied to organisms (e.g., SmartLetterComposer — 1,465 LOC, 167 files, 21 subdirs, 4 views), it produces systematic false positives: STRUCT-002 (7-file structure), TOKEN-001 (all Tailwind in -styles.ts), BIZ-001/002/003 (domain types, API calls, global state), TEST-004 (Figma artifacts), STRUCT-005 (displayName). These are structurally correct for organisms in POC phase but flagged as blocking failures.

## Scope

**In scope:** Component classification step, maturity tiers (poc/beta/stable), organism checklist, `--poc` flag, Template A++ delegation, progressive roadmap report format.
**Out of scope:** iOS/Android organism checklists, consumer-mode organism rules, automated classification detection.

## Approach

Add a pre-audit classification gate (Step 0.5 in `ui.md`) that routes to the correct checklist. Introduce maturity tiers that modulate blocking vs advisory severity. Create `checklist-web-organism.md` with ORGANISM-*, STATE-*, MOCK-*, DIALOG-* rule categories. Wire `--poc` flag through `SKILL.md`. Add Template A++ for organism delegation. Update report template with phased roadmap output.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Classification gate + maturity tiers | 1.5h | complete | [phase-1](./phase-1-classification-maturity.md) |
| 2 | Organism checklist | 2h | complete | [phase-2](./phase-2-organism-checklist.md) |
| 3 | POC flag + routing wiring | 1.5h | complete | [phase-3](./phase-3-poc-flag-routing.md) |
| 4 | Delegation template + report format | 1h | complete | [phase-4](./phase-4-delegation-report.md) |

## Success Criteria

- Running `/audit --ui SmartLetterComposer --poc` routes to organism checklist, suppresses atom-specific rules as advisory
- Maturity tier visible in report output; poc tier only blocks on API surface / env coupling / hardcoded data
- Report includes phased roadmap (Now / Before Beta / Before Stable) instead of binary verdict for POC
- Template A++ available in delegation-templates.md for organism dispatches
- Existing atom/molecule audits unaffected (no regressions)
