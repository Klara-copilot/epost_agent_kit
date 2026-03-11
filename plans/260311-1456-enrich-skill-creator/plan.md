---
title: "Enrich kit-skill-development with Anthropic patterns + audit all descriptions"
status: active
created: 2026-03-11
updated: 2026-03-11
effort: 4h
phases: 3
platforms: [all]
breaking: false
---

# Enrich kit-skill-development with Anthropic Patterns

## Context

Research report (`reports/epost-researcher-260311-1435-external-skills-analysis.md`) identified gaps in our skill authoring guidance vs Anthropic's official docs. Our kit is architecturally sound but lacks: description validation checklist, string substitution docs, `ultrathink` guidance, and formal consensus-voting orchestration pattern. Additionally, 65 existing skill descriptions need auditing.

Separate from PLAN-0043 (eval/benchmark scripts) -- no overlap.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Enrich kit-skill-development references | 1.5h | pending | [phase-1](./phase-1-enrich-references.md) |
| 2 | Add consensus pattern + ultrathink to orchestration | 1h | pending | [phase-2](./phase-2-orchestration-additions.md) |
| 3 | Audit all 65 skill descriptions | 1.5h | pending | [phase-3](./phase-3-description-audit.md) |

## Success Criteria

- [ ] Description validation checklist exists as reference file
- [ ] String substitution reference documented
- [ ] SKILL.md body limit clarified with line count
- [ ] `ultrathink` guidance added
- [ ] Consensus-voting pattern in orchestration.md
- [ ] All 65 skill descriptions pass validation checklist

## Dependencies

- None -- all changes are additive to existing files in `packages/`

## Risks

- Phase 3 (audit) touches 65 files across many packages; high volume but low complexity per file
- Some descriptions may need significant rewriting if they summarize workflow instead of listing triggers
