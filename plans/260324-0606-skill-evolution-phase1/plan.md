---
title: "Self-Evolving Skill Loop — Phase 1: Detect + Propose"
description: "Close feedback loop between task execution and skill improvement via signal extraction, proposal generation, and human review CLI"
status: archived
created: 2026-03-24
updated: 2026-03-23
effort: 8h
phases: 3
platforms: [all]
breaking: false
---

# Self-Evolving Skill Loop — Phase 1: Detect + Propose

## Summary

Agents surface improvement signals from journal entries, audit reports, and workarounds. Signals feed a proposal pipeline that writes human-reviewable skill update proposals to `docs/proposals/`. A CLI command lets users approve/reject. Zero auto-apply risk.

## Key Dependencies

- `docs/journal/` — must have entries with "What almost went wrong" sections
- `knowledge-capture` skill — existing capture workflow for structured learnings
- `packages/` source-of-truth convention — proposals never touch packages/ directly
- `lesson-capture.cjs` hook — existing pattern for session-end signal detection

## Execution Strategy

Sequential: infrastructure first (Phase 1), then generation (Phase 2), then review UX (Phase 3).

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Signal Infrastructure | 3h | pending | [phase-1](./phase-1-signal-infrastructure.md) |
| 2 | Proposal Generator | 3h | pending | [phase-2](./phase-2-proposal-generator.md) |
| 3 | Review CLI Command | 2h | pending | [phase-3](./phase-3-review-cli.md) |

## Critical Constraints

- ALL skill source edits stay in `packages/` (source of truth)
- `docs/proposals/` is staging only — nothing auto-applies
- Human must explicitly approve before any skill changes
- Signal emission must not slow normal task execution
- Proposals are minimal diffs, not rewrites (YAGNI)

## Success Criteria

- [ ] Running signal extractor produces `docs/proposals/signals.json` from journal + reports
- [ ] Proposal generator creates reviewable `.md` files in `docs/proposals/`
- [ ] `epost-kit proposals` lists pending proposals with context
- [ ] `epost-kit proposals --approve {id}` copies change to `packages/` source skill
- [ ] End-to-end: journal entry with "almost went wrong" -> signal -> proposal -> approval -> skill updated

## Unresolved Questions

1. **Signal extractor: script vs hook?** — Script (manual trigger) is simpler; hook (auto on stop) catches signals in real-time but adds latency. Recommend: script first, hook later.
2. **Proposal generation: manual or auto?** — Manual trigger (`/evolve` or `epost-kit evolve`) is safer for Phase 1. Auto-generation on session end is Phase 2 territory.
3. **Should `skill-evolution` be a skill or just instructions in existing skills?** — Lean toward instructions in journal skill + cook skill ("after completion, note workarounds") rather than a new skill. Avoids skill bloat.
4. **Confidence thresholds** — At what confidence should a signal become a proposal? Research suggests 3+ occurrences for audit failures, 2+ for journal flags. Need user validation.
