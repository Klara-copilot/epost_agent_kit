---
date: 2026-03-24
agent: epost-planner
plan: plans/260324-0606-skill-evolution-phase1/
status: READY
---

# Plan: Self-Evolving Skill Loop — Phase 1: Detect + Propose

## Executive Summary

3-phase plan to close the feedback loop between task execution and skill improvement. Agents detect improvement signals from journal entries and audit reports, generate human-reviewable proposals, and a CLI command lets users approve changes. Zero auto-apply risk — human is the gate.

## Plan Details

| # | Phase | Effort | Key Deliverables |
|---|-------|--------|-----------------|
| 1 | Signal Infrastructure | 3h | `extract-signals.cjs` script, `docs/proposals/signals.json` schema, journal/report parsers |
| 2 | Proposal Generator | 3h | `evolve-mode.md` reference, agent-driven proposal creation, signal emission hints in journal/cook skills |
| 3 | Review CLI Command | 2h | `epost-kit proposals` with list/show/approve/reject subcommands |

## Key Design Decisions

- **Script over hook** for signal extraction — simpler, no session-end latency
- **Agent-driven** proposal generation — proposals need reasoning about skill gaps, not just regex
- **No new skill** — add signal emission hints to existing journal + cook skills instead of `skill-evolution` skill
- **1:1 signal-to-proposal** mapping for simplicity; grouping deferred

## Verdict: READY

Plan is actionable. 4 unresolved questions for user validation (see plan.md).

## Unresolved Questions

1. Signal extractor: script vs hook? (recommend script first)
2. Confidence thresholds for auto-proposing? (recommend 3+ occurrences)
3. Should proposals group by skill or stay 1:1 with signals?
4. Manual trigger (`/plan --evolve`) vs automatic generation on session end?
