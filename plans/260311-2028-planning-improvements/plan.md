---
title: "Planning Pipeline Improvements"
status: archived
created: 2026-03-11
updated: 2026-03-11
effort: 10h
phases: 5
platforms: [all]
breaking: false
---

# Planning Pipeline Improvements

## Summary

Adopt 6 targeted patterns from superpower-planning research + SmartLetter status.md pattern to close real gaps in our plan/cook/review pipeline. The centerpiece is a **living status.md** file per plan — single document combining progress, decisions, findings, architecture, and bugs (proven across 56 phases of SmartLetter development).

## Key Dependencies

- PLAN-0044 (Plan Skill Process Overhaul) — overlaps with Phase 1. This plan's Phase 1 should be done AFTER or merged with PLAN-0044.
- `packages/core/skills/plan/` — planning skill + variants
- `packages/core/skills/cook/` — implementation skill + variants
- `packages/core/skills/subagent-driven-development/` — two-stage review
- `packages/core/skills/error-recovery/` — retry/fallback patterns
- `packages/core/skills/core/references/orchestration.md` — delegation rules
- SmartLetter status.md — reference implementation at `luz_next/plans/260307-1416-smartletter-status.md`

## What We Adopt (6 patterns)

| # | Pattern | Source | Solves Gap | Where |
|---|---------|--------|-----------|-------|
| 1 | Living status.md per plan | SmartLetter | No journey tracking during execution | plan skill + cook/fix/debug |
| 2 | Knowledge-retrieval in fast plan mode | superpower-planning | Plans miss existing patterns | plan fast-mode |
| 3 | Batch checkpoints in cook | superpower-planning | Long executions run without feedback | cook fast-mode |
| 4 | Error mutation discipline | superpower-planning | Retries don't force approach change | error-recovery |
| 5 | Enforce two-stage review gates | superpower-planning | Review stages optional in practice | subagent-driven-development |
| 6 | Auto-trigger validate after deep/parallel plans | superpower-planning | --validate rarely used | plan SKILL.md |

## What We Skip

- Per-agent planning directories (.planning/agents/) — status.md replaces this with a single file
- Separate progress.md / findings.md / journal.md — merged into status.md (one file to read)
- 2-Action Dispatch Rule — status.md captures discoveries at natural checkpoints instead
- 5-Question Reboot Test — reading status.md serves the same purpose
- Historical precedent checking — knowledge-retrieval L1 already covers this
- Plan versioning — git history is sufficient

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Living status.md template + auto-generation | 2h | done | [phase-1](./phase-1-status-template.md) |
| 2 | Add knowledge-retrieval step to fast plan mode | 1h | done | [phase-2](./phase-2-plan-fast-knowledge.md) |
| 3 | Add batch checkpoints to cook execution | 2h | done | [phase-3](./phase-3-cook-batch-checkpoints.md) |
| 4 | Add error mutation discipline to error-recovery | 2h | done | [phase-4](./phase-4-error-mutation.md) |
| 5 | Enforce review gates + auto-validate trigger | 3h | done | [phase-5](./phase-5-review-gates-validate.md) |

## Success Criteria

- [ ] Every new plan auto-generates a status.md with Progress, Key Decisions, Known Bugs, Deferred, Architecture sections
- [ ] Cook/fix/debug update status.md after completing work (decisions, bugs, architecture changes)
- [ ] Fast plan mode searches docs/ and prior plans before generating phases
- [ ] Cook pauses after every 3 file changes for self-check
- [ ] Error-recovery forces approach change on 2nd retry
- [ ] Subagent-driven review gates are non-skippable (stage 2 blocked until stage 1 passes)
- [ ] Deep/parallel plans auto-run validation questions before activation
