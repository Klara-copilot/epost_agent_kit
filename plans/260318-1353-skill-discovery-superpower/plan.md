---
title: "Skill Discovery Superpower — Fix Gaps + High-Value Improvements"
status: archived
created: 2026-03-18
updated: 2026-03-18
effort: 8h
phases: 4
platforms: [all]
breaking: false
---

# Skill Discovery Superpower

Fix 10 audit gaps and add 4 research-backed improvements to make skill-discovery a reliable, self-healing system.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Quick Fixes: Phantom Refs, Wiring, Validator | 1.5h | done | [phase-1](./phase-1-quick-fixes.md) |
| 2 | Frontmatter-Driven Connections & Categories | 2.5h | pending | [phase-2](./phase-2-frontmatter-connections.md) |
| 3 | Scoring, Priority & Tie-Breaking | 2h | pending | [phase-3](./phase-3-scoring-priority.md) |
| 4 | Staleness Guard & Usage Logging | 2h | pending | [phase-4](./phase-4-staleness-usage-logging.md) |

## Gap-to-Phase Mapping

| Gap | Description | Phase |
|-----|-------------|-------|
| 3 | skill-index.json staleness | 4 |
| 4 | Missing/phantom skills (launchpad) | 1 |
| 5 | 3 agents missing skill-discovery | 1 |
| 6 | Validator outdated agent names | 1 |
| 7 | Two diverging skill-index.json | 2 |
| 8 | No tie-breaking for multi-match | 3 |
| 9 | Phantom `ui-guidance` in Quick Ref | 1 |
| 10 | No git-state signals in Step 1 | 1 |
| 1 | Hardcoded connections/categories | 2 |
| 2 | No enforcement of discovery protocol | 3 |

## Improvement-to-Phase Mapping

| Improvement | Phase |
|-------------|-------|
| `examples` array per skill | 2 |
| `priority` field (0.0-1.0) | 3 |
| Confidence scoring formula | 3 |
| Usage logging hook | 4 |

## Success Criteria

1. `node generate-skill-index.cjs` reads `category` + `connections` from SKILL.md frontmatter (falls back to hardcoded maps)
2. skill-index.json count matches actual SKILL.md count on disk
3. All 15 agents have `skill-discovery` in `skills:` list
4. Validator references only real agents
5. `ui-guidance` phantom removed from all docs
6. Confidence scoring documented in skill-discovery SKILL.md

## Dependencies

- None external. All changes within `packages/` (source of truth)
- Phase 2 should complete before Phase 3 (scoring depends on frontmatter fields)

## Validation Summary

See end of plan for unresolved questions.
