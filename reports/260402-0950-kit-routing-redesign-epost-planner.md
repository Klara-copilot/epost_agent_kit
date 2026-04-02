---
date: 2026-04-02
agent: epost-planner
plan: plans/260402-0949-kit-routing-redesign/
status: READY
---

# Kit Routing Redesign — Plan Report

## Executive Summary

Created 4-phase plan to implement 8 design principles from ARCH-0002, replacing the kit's prescriptive intent-routing model with weight-based execution and declarative capability descriptions.

## Plan Details

- **Directory**: `plans/260402-0949-kit-routing-redesign/`
- **Phases**: 4 (3 parallelizable in Batch 1, 1 dependent)
- **Effort**: 6h total
- **Files**: 16 files across 4 phases, no ownership conflicts

### Phases

| # | Phase | Effort | Parallel? |
|---|-------|--------|-----------|
| 1 | CLAUDE.md rewrite (P1 + P8) | 2h | Batch 1 |
| 2 | Skill-discovery simplification (P6 + P7) | 1.5h | Batch 1 |
| 3 | Orchestration + output contract (P2 + P5) | 1h | Batch 2 (after P1) |
| 4 | Agent frontmatter + confirmation gates (P3 + P4) | 1.5h | Batch 1 |

### Key Changes

- CLAUDE.md: intent routing table (70 lines) → weight-based rule (15 lines) + capability catalogue
- skill-discovery: 174-line protocol → ~50-line catalogue
- 9 agents: remove `skill-discovery` from `skills:` frontmatter
- code-review + clean-code: add confirmation gates
- ARCH-0002 + orchestration-protocol: document output contract + injection pattern

## Verdict

**READY** — all file paths confirmed, no cross-plan conflicts (3 related plans already archived), no external dependencies.

## Unresolved Questions

1. Should `skill-discovery` skill be fully deprecated (deleted) or kept as passive catalogue? Plan assumes kept-but-simplified.
2. After removing skill-discovery from agents, should the skill's frontmatter `agent-affinity` list be cleared? (Low priority, cosmetic.)
