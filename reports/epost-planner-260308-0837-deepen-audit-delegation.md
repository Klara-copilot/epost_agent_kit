# epost-planner: Deepen Audit Flow Delegation

**Date**: 2026-03-08 08:37
**Agent**: epost-planner
**Plan**: `plans/260308-0837-deepen-audit-delegation/plan.md`
**Status**: COMPLETE

---

## Executive Summary

Created a 3-phase plan to add structured delegation handoff templates to the audit flow. Currently agents are told WHEN to delegate (code-reviewer -> muji for UI, -> a11y-specialist for accessibility) but not HOW — no context template, no wait-for-response pattern, no report merging protocol. This plan adds delegation templates, updates the code-reviewer's escalation gate with dispatch instructions, and gives muji + a11y-specialist explicit "receiving delegation" intake protocols.

---

## Plan Details

- **Directory**: `plans/260308-0837-deepen-audit-delegation/`
- **Phases**: 3 phases
- **Effort**: 4h
- **Platforms**: all

## Methodology

| | |
|--|--|
| **Files Scanned** | `audit/SKILL.md`, `audit/references/ui.md`, `code-review/SKILL.md`, `core/references/orchestration.md`, `core/references/workflow-code-review.md`, `ui-lib-dev/references/audit-standards.md`, agent files for muji/code-reviewer/a11y-specialist, 2 prior plans (klara-consumer-audit, methodology-transparency) |
| **Knowledge Tiers** | L1 docs/ (not checked — kit repo, no docs/index.json), L3 Skills (primary source), L4 Grep/Glob (plan discovery) |
| **Standards Source** | `plan/SKILL.md`, `core/references/orchestration.md`, `subagent-driven-development/SKILL.md` |
| **Coverage Gaps** | None — all relevant skill files and agent definitions were available |

## Files to Touch

| File | Action | Phase |
|------|--------|-------|
| `packages/core/skills/audit/SKILL.md` | Modify — add Delegation Protocol section | Phase 1 |
| `packages/core/skills/audit/references/delegation-templates.md` | Create — 3 structured templates | Phase 1 |
| `packages/core/skills/audit/references/ui.md` | Modify — add delegation intake note | Phase 1 |
| `packages/core/skills/code-review/SKILL.md` | Modify — expand Escalation Gate with dispatch protocol | Phase 2 |
| `packages/core/agents/epost-code-reviewer.md` | Modify — add delegation-templates ref | Phase 2 |
| `packages/design-system/agents/epost-muji.md` | Modify — add Delegated Audit Intake section | Phase 3 |
| `packages/a11y/agents/epost-a11y-specialist.md` | Modify — add Delegated Audit Intake section | Phase 3 |

## Key Dependencies

- Phase 2 depends on Phase 1 (code-reviewer references templates from Phase 1)
- Phase 3 can run parallel with Phase 2

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Templates too prescriptive — stifle specialist judgment | Med | Use expectations framing, not step-by-step commands |
| Agents ignore delegation protocol in practice | Med | Intake section prominent in agent files; templates referenced by callers |
| Over-delegation — everything gets escalated | Low | Existing escalation gate thresholds (High+ severity) unchanged |

---

## Verdict

**READY** — All files identified, all phases scoped, no external dependencies or unknowns.

---

*Unresolved questions:*
- None
