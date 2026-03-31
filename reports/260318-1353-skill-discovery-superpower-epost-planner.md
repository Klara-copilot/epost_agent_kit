---
date: 2026-03-18
agent: epost-planner
plan: plans/260318-1353-skill-discovery-superpower/plan.md
status: READY
---

# Plan Report: Skill Discovery Superpower

## Executive Summary

4-phase plan to fix 10 audit gaps and add 4 research-backed improvements to skill-discovery. Transforms it from a best-effort LLM instruction into a scored, self-healing system with frontmatter-driven metadata.

## Plan Details

| Phase | Focus | Effort | Key Changes |
|-------|-------|--------|-------------|
| 1 | Quick Fixes | 1.5h | Remove phantom refs, wire 3 agents, fix validator, add git-state signals |
| 2 | Frontmatter Connections | 2.5h | Move category/connections/examples from hardcoded maps to SKILL.md frontmatter |
| 3 | Scoring & Priority | 2h | priority field, confidence formula, tie-breaking, soft enforcement |
| 4 | Staleness & Logging | 2h | SessionStart freshness hook, PostToolUse usage logger, auto-regen on init |

**Total effort**: 8h across 4 phases.

## Verdict

**READY** — all context gathered from audit gaps + research report. No blockers.

## Unresolved Questions

1. **Should we add `examples` to all 65 skills or just high-traffic ones?** Phase 2 targets 20. Full coverage adds ~2h but improves future semantic matching.

2. **Is JSONL the right format for usage logging, or should we use SQLite?** JSONL chosen for KISS — append-only, no dependencies. SQLite adds query power but requires a dep.

3. **Should we add a PreToolUse hook to mechanically enforce discovery?** Current plan uses soft enforcement (self-check in SKILL.md). A hook could block skill reads that weren't preceded by index lookup, but risks false positives and added complexity.

4. **Should the staleness hook auto-regenerate or just warn?** Current plan warns. Auto-regen could silently mask issues with the generator.

5. **Which 3 agents are lowest-risk for removing skill-discovery wiring test?** Need to confirm epost-a11y-specialist, epost-muji, and epost-kit-designer don't have custom discovery flows that conflict.
