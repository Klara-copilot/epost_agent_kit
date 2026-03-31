---
date: 2026-03-31
agent: epost-planner
plan: plans/260331-1657-skill-gap-updates/
status: READY
---

# Plan Report: Skill Gap Updates

## Executive Summary

3-phase plan adding missing capabilities to epost_agent_kit skills: git `--watzup` EOD summary, mermaidjs multi-format preview flags, and a new `deploy` skill with auto-platform detection.

## Plan Details

| # | Phase | Effort | Files Created | Files Modified |
|---|-------|--------|--------------|----------------|
| 1 | Git --watzup | 30m | 1 (watzup.md) | 1 (git/SKILL.md) |
| 2 | Preview flags | 1h | 3 (explain/ascii/html.md) | 1 (mermaidjs/SKILL.md) |
| 3 | Deploy skill | 1.5h | 7 (SKILL.md + 6 platforms) | 1 (package.yaml) |

- Total effort: 3h
- All phases independent — committable separately
- No cross-plan conflicts detected

## Verdict

**READY** — all three tasks are well-scoped, follow existing flag patterns, no research needed.

## Unresolved Questions

1. Should mermaidjs be renamed to `preview` or keep `mermaidjs` name with extended flags? (Plan assumes keep `mermaidjs` — rename is optional follow-up)
2. Should `--watzup` default to 24h or since-last-push? (Plan says 24h with note about last-push alternative)
3. Deploy: should production deploys require explicit `--prod` flag or default to prod? (Plan says confirm with user before prod)
