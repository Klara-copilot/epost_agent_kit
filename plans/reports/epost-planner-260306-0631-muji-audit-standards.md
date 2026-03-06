# epost-planner: Muji Audit Standards

**Date**: 2026-03-06 06:31
**Agent**: epost-planner
**Plan**: `plans/260306-0631-muji-audit-standards/plan.md`
**Status**: COMPLETE

---

## Executive Summary

Codify the 16 verified klara-theme convention categories (from PLAN-0056 research) into 35 enforceable audit rules across 6 categories. Create the missing `checklist-web.md` and `audit-report-schema.md` files that `audit/references/ui.md` already references but never had created. Wire everything through existing skill connections.

## Plan Details
- **Directory**: `plans/260306-0631-muji-audit-standards/`
- **Phases**: 3 phases
- **Effort**: 4h total (2h + 1.5h + 0.5h)
- **Platforms**: web (klara-theme)

## Sources Analyzed
- `plans/reports/epost-researcher-260306-0625-klara-theme-conventions.md` -- research input, 16 convention categories
- `packages/core/skills/audit/references/ui.md` -- existing audit workflow with broken references
- `packages/core/skills/audit/SKILL.md` -- audit skill routing and flags
- `packages/design-system/skills/ui-lib-dev/SKILL.md` -- pipeline skill, no audit standards yet
- `packages/design-system/skills/ui-lib-dev/references/audit-ui.md` -- Figma-pipeline audit (different scope)
- `packages/design-system/skills/ui-guidance/SKILL.md` -- consumer guidance review checklist
- `packages/design-system/agents/epost-muji.md` -- agent definition, skills list
- `plans/260304-1718-audit-ui-lib-component/plan.md` -- prior PLAN-0039, partially implemented

## Files to Touch
| File | Action | Phase |
|------|--------|-------|
| `packages/design-system/skills/ui-lib-dev/references/audit-standards.md` | Create | Phase 1 |
| `packages/design-system/skills/ui-lib-dev/SKILL.md` | Modify (add aspects row) | Phase 1 |
| `packages/core/skills/audit/references/checklist-web.md` | Create | Phase 2 |
| `packages/core/skills/audit/references/audit-report-schema.md` | Create | Phase 2 |
| `packages/core/skills/audit/references/ui.md` | Modify (fix Step 2 refs) | Phase 3 |
| `packages/core/skills/audit/SKILL.md` | Modify (add enhances) | Phase 3 |

## Key Dependencies
- PLAN-0056 research report -- completed, provides all convention data
- PLAN-0039 audit skill structure -- partially implemented, this plan fills gaps
- epost-muji agent already has `audit` in skills list -- no agent change needed

## Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Rules too strict for edge cases | Developers overwhelmed with false failures | Severity tiers (low/medium allow flexibility); N/A option in checklist |
| Standards drift from actual codebase | Audit produces false positives | All rules verified against 10+ components in research phase |
| iOS/Android checklists missing | Cross-platform audit incomplete | Scoped to web only; future plan for other platforms |

---

## Verdict
**READY** -- All research data available, file locations identified, no blockers.

---

*Unresolved questions:*
- Should `community-composer` follow library conventions or be excluded like smart-letter-composer?
- `date-picker-new/` alongside `date-picker/` -- migration in progress may affect audit expectations for that component
