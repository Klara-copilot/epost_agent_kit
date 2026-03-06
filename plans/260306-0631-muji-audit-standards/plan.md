---
title: "Muji Audit Standards: Component Dev Guide + Enforceable Audit Checklist"
status: draft
created: 2026-03-06
updated: 2026-03-06
effort: 5h
phases: 5
platforms: [web]
breaking: false
---

# Muji Audit Standards

## Goal

Three-layer knowledge split:
1. **Project level** — authoritative component authoring guide in klara-theme `docs/` (human devs building components)
2. **Agent guidance** — thin consumable ref in `web-ui-lib` skill (epost-muji + fullstack-developer helping teams)
3. **Audit machinery** — 35-rule enforcement layer in `ui-lib-dev` + `audit` skills (muji internal scoring)

## Current State

- `packages/core/skills/audit/references/ui.md` — references `checklist-web.md` and `audit-report-schema.md` that DO NOT EXIST
- `packages/design-system/skills/ui-lib-dev/references/audit-ui.md` — Figma-pipeline audit, no component-level checklist
- `packages/platform-web/skills/web-ui-lib/references/contributing.md` — proposal guide only, no authoring conventions
- `luz_next/libs/klara-theme/docs/` — has architecture/technical docs, no component authoring guide

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Component guide in klara-theme docs | 1h | pending | [phase-1-component-standards.md](./phase-1-component-standards.md) |
| 2 | Agent-consumable authoring ref (web-ui-lib) | 0.5h | pending | [phase-2-component-authoring.md](./phase-2-component-authoring.md) |
| 3 | Audit standards reference (ui-lib-dev) | 2h | pending | [phase-3-audit-standards.md](./phase-3-audit-standards.md) |
| 4 | Web checklist + report schema (audit skill) | 1h | pending | [phase-4-checklist-schema.md](./phase-4-checklist-schema.md) |
| 5 | Skill wiring | 0.5h | pending | [phase-5-wiring.md](./phase-5-wiring.md) |

## Success Criteria

- [ ] `klara-theme/docs/component-guide.md` — canonical dev guide (DO/DON'T, no rule IDs)
- [ ] `web-ui-lib/references/component-authoring.md` — agent-consumable key rules + pointer to project doc
- [ ] `ui-lib-dev/references/audit-standards.md` — 35 rules with IDs, severity, pass/fail
- [ ] `audit/references/checklist-web.md` — operational audit checklist
- [ ] `audit/references/audit-report-schema.md` — findings format + verdict logic
- [ ] epost-muji can guide devs (via web-ui-lib) AND audit (via ui-lib-dev + audit)

## Dependencies

- Research report: `plans/reports/epost-researcher-260306-0625-klara-theme-conventions.md` (completed)
- PLAN-0039 audit skill structure (partially implemented)

## Out of Scope

- iOS/Android checklists (future — no research data yet)
- Figma visual comparison (handled by existing `audit-ui.md`)
