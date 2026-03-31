---
title: "Fix 11 Skill Descriptions That Failed Trigger Evals"
status: active
created: 2026-03-31
updated: 2026-03-31
effort: 1h
phases: 1
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

# Fix 11 Skill Descriptions That Failed Trigger Evals

## Summary

39/50 skill trigger evals passed. 11 failed due to descriptions using file extensions instead of natural language, quoted literals that don't match fuzzy queries, overly broad categories causing false positives, or missing key trigger terms. Fix all 11 descriptions following CSO principles.

## Key Dependencies

- Skill files in `packages/` (source of truth)
- `.claude/` mirror via `epost-kit init` or manual copy
- `skill-index.json` description field must also be updated

## Execution Strategy

Single phase — update all 11 SKILL.md `description` fields in their `packages/` locations, update `skill-index.json`, then regenerate `.claude/` mirror.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Update 11 skill descriptions | 1h | done | [phase-1](./phase-1-update-descriptions.md) |

## Success Criteria

- [ ] All 11 SKILL.md files updated in `packages/`
- [ ] `skill-index.json` updated with matching descriptions
- [ ] Re-run trigger evals: 50/50 pass (or at minimum 47+/50)
