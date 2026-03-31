---
date: 2026-03-30
agent: epost-planner
plan: plans/260330-1614-skill-consolidation/
status: READY
---

# Core Skills Consolidation: 31 to 24

## Executive Summary

Plan to consolidate `packages/core/skills/` from 31 to 24 skills by merging 8 standalone skills into parent skills as flags/references and creating 1 new combined knowledge skill.

## Plan Details

| Phase | What | Effort | Risk |
|-------|------|--------|------|
| 1 | Merge 5 flag-based skills (security-scan, predict, scenario, retro, llms) into parents | 1.5h | Low — each merge is independent |
| 2 | Absorb clean-code into code-review (3 reference files to relocate) | 0.5h | Low — additive to code-review |
| 3 | Create unified knowledge skill from knowledge-retrieval + knowledge-capture | 1h | Medium — net-new skill, cross-refs to update |
| 4 | Update package.yaml, CATEGORY_MAP, CONNECTION_MAP, regenerate skill-index.json | 1h | Medium — shared config files, must be last |

## Verdict

**READY** — All consolidation decisions pre-approved. No blocking dependencies. No cross-plan file conflicts detected.

## Unresolved Questions

None — all merge targets and content disposition decided upfront.
