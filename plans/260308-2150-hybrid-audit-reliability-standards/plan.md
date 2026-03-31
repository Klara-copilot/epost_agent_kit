---
title: "Hybrid audit reliability + audit standards overhaul"
status: archived
created: 2026-03-08
updated: 2026-03-08
effort: 3.5h
phases: 4
platforms: [all]
breaking: false
---

# Hybrid Audit Reliability & Standards Overhaul

## Summary

Mirrors `luz_next/plans/260308-1933-kit-hybrid-audit-reliability` but targets kit source files (`packages/`). Adds defensive guardrails so muji self-corrects even when caller sends free-form prompts, and code-reviewer always creates session folder + uses Template A+ before hybrid dispatch.

Also overhauled `audit-standards.md` per user requirements: live KB load gate (Section 0), A11Y delegation, SEC/PERF/LDRY standalone-component gates, new Section 10 (embedded components + RAG token lookup), and `ui-guidance` merged into `ui-lib-dev/references/`.

## Key Dependencies

- `packages/design-system/agents/epost-muji.md` — muji agent instructions
- `packages/core/agents/epost-code-reviewer.md` — code-reviewer instructions
- `packages/core/skills/code-review/SKILL.md` — hybrid audit sequential protocol
- `packages/core/skills/audit/references/ui.md` — muji audit workflow (Step 0–6)
- `packages/core/skills/audit/references/delegation-templates.md` — Template A/A+
- `packages/design-system/skills/ui-lib-dev/references/audit-standards.md` — 9-section checklist
- `packages/design-system/skills/ui-guidance/SKILL.md` — to be merged into ui-lib-dev
- `packages/core/CLAUDE.snippet.md` — kit routing rules

## Execution Strategy

Phases 1 and 2 are independent (parallel). Phase 3 (standards) is independent. Phase 4 (KB verification gate) is independent. All can run in parallel; INDEX.md updated after all done.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Muji defensive fallback on missing delegation block | 45m | pending | [phase-1](./phase-1-muji-defensive-fallback.md) |
| 2 | Code-reviewer hybrid pre-flight checklist | 45m | pending | [phase-2](./phase-2-code-reviewer-preflight.md) |
| 3 | Audit standards overhaul + ui-guidance merge | 60m | pending | [phase-3](./phase-3-audit-standards-overhaul.md) |
| 4 | Muji KB load verification gate | 30m | pending | [phase-4](./phase-4-muji-kb-verification.md) |

## Critical Constraints

- All changes in `packages/` — never edit `.claude/` directly
- Run `epost-kit init` after all phases to sync `.claude/`
- Must not break existing working audit flows (single-component, consumer mode)
- Defensive fallbacks must log warnings in Methodology section, not silently proceed

## Success Criteria

- [ ] Muji auto-detects Library/Consumer Mode from file paths when no delegation block
- [ ] Muji loads full rule checklist regardless of prompt format
- [ ] Muji warns when structured delegation block missing (in Methodology)
- [ ] Code-reviewer verifies session folder + output_path + Template A+ before muji dispatch
- [ ] Code-reviewer CLAUDE.snippet.md has explicit hybrid audit routing rule
- [ ] Muji confirms `libs/klara-theme/docs/index.json` loaded before TOKEN/STRUCT/PROPS
- [ ] audit-standards.md Section 0 (live KB load) present
- [ ] audit-standards.md Section 5 (A11Y) includes delegation guidance
- [ ] audit-standards.md Section 10 (embedded components) present with RAG lookup
- [ ] ui-guidance merged into ui-lib-dev/references/ as `guidance.md`
