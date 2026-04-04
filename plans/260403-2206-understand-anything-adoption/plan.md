---
title: "Adopt Understand-Anything Patterns into epost_agent_kit"
status: active
created: 2026-04-03
updated: 2026-04-03
effort: 10h
phases: 5
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

# Adopt Understand-Anything Patterns

## Scope Rationale

1. **Problem**: epost agents (planner, debugger, get-started) rediscover codebase structure independently each run — no shared structural knowledge, no incremental caching, no topology-aware onboarding.
2. **Why this way**: UA's proven patterns (two-phase extraction, artifact persistence, fan-in ordering, fingerprinting) solve these gaps without new runtime dependencies. Approach A first, graduate to B.
3. **Why now**: onboarding and debugging are the most frequent agent workflows; improving their structural awareness has high daily-use impact.
4. **Simplest version**: Phase 0 (reference skill) + Phase 1 (two-phase get-started) deliver immediate value.
5. **Cut 50%**: Drop Phases 3-4 (graph-as-artifact). Phases 0-2 deliver all Approach A value.

## Research Inputs

- Research: `reports/260403-2036-understand-anything-research-epost-researcher.md`
- Brainstorm: `reports/260403-2203-understand-anything-adoption-epost-brainstormer.md`

## Cross-Plan Dependencies

| Plan | Repo | Relation | File overlap |
|------|------|----------|-------------|
| `frontend-api-discovery` (260403-1430) | `epost_knowledge_base` | Complements Phase 2 — adds discovery algorithm to `docs/references/init.md`; Phase 2 here adds fingerprinting to `docs/SKILL.md` | None — different files, safe to run in any order |

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 0 | UA Patterns Reference Skill | 1h | done | [phase-0](./phase-0-ua-patterns-reference.md) |
| 1 | Two-Phase Extraction for get-started | 2h | done | [phase-1](./phase-1-get-started-two-phase.md) |
| 2 | Intermediate Artifacts + File Fingerprinting | 3h | done | [phase-2](./phase-2-artifacts-and-fingerprinting.md) |
| 3 | Understand Skill (Graph Consumer) | 2h | pending | [phase-3](./phase-3-understand-skill.md) |
| 4 | Graph-Aware Planning and Debugging | 2h | pending | [phase-4](./phase-4-graph-aware-agents.md) |

## Graduation Criteria (A to B)

Phases 0-2 = Approach A (patterns-only). Phases 3-4 = Approach B (graph-as-artifact).
Graduate when: (a) team runs UA on 2+ repos, (b) 3+ agents would benefit from graph queries.

## Constraints

- All changes in `packages/`, never `.claude/` directly
- Zero new runtime dependencies (Phases 0-2)
- Phase 3-4 require external UA install — document, don't bundle
- `epost-kit verify` must pass after each phase
- YAGNI: implement only what existing workflows need

## Success Criteria

- [ ] UA patterns documented as reusable reference skill
- [ ] `/get-started` uses two-phase extraction (structure then semantic)
- [ ] Agents can share intermediate artifacts via `.epost-cache/`
- [ ] `/audit`, `/test`, and `/docs` skip unchanged files via fingerprinting
- [ ] `/docs --init`/`--scan` persists discovery output to `.epost-cache/artifacts/docs-discovery-{slug}.json`
- [ ] (Phase 3+) `understand` skill reads external UA graph
- [ ] (Phase 4+) planner/debugger consume graph for scoping/tracing
