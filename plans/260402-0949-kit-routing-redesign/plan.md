---
title: "Kit Routing Redesign — 8 Principles for Claude-Native Simplicity"
status: done
created: 2026-04-02
updated: 2026-04-02
effort: 6h
phases: 4
platforms: [all]
breaking: false
---

# Kit Routing Redesign

## Scope Rationale

Replace the kit's intent-routing model with weight-based execution, simplify skill-discovery to a catalogue, and embed core law-layer in CLAUDE.md. Based on 8 design principles from ARCH-0002 research.

**Core insight**: Claude already classifies intent natively. The routing table duplicates this reasoning. Replace prescriptive rules with declarative capability descriptions.

## Principles-to-Phase Mapping

| Principle | Description | Phase |
|-----------|-------------|-------|
| P1 | Weight-based execution (not intent labels) | 1 |
| P8 | Core law-layer embedded in CLAUDE.md | 1 |
| P6 | skill-index.json = tooling only | 2 |
| P7 | skill-discovery simplified to catalogue | 2 |
| P2 | Skill output contract (inline = agent) | 3 |
| P5 | Agents own defaults; orchestrator injects extras | 3 |
| P3 | Platform skills by surface signal, not pre-wired | 4 |
| P4 | Code-modifying ops require confirmation gate | 4 |

## Phases

| # | Phase | Effort | Depends | Status | File |
|---|-------|--------|---------|--------|------|
| 1 | CLAUDE.md: weight-based routing + law-layer | 2h | none | pending | [phase-1](./phase-1-claude-md-rewrite.md) |
| 2 | Skill-discovery simplification | 1.5h | none | pending | [phase-2](./phase-2-skill-discovery.md) |
| 3 | Orchestration + output contract docs | 1h | 1 | pending | [phase-3](./phase-3-orchestration-docs.md) |
| 4 | Agent frontmatter + confirmation gates | 1.5h | none | pending | [phase-4](./phase-4-agents-confirmation.md) |

## Dependency Graph

```
Phase 1 ──────┐
              ├──▶ Phase 3
Phase 2       │
Phase 4       │
```

**Batch 1** (parallel): Phase 1, Phase 2, Phase 4
**Batch 2** (after Phase 1): Phase 3

## File Ownership Matrix

| File Path | Owner | Op | Notes |
|-----------|-------|----|-------|
| `packages/core/CLAUDE.snippet.md` | Phase 1 | Modify | Replace routing table, add law-layer |
| `packages/core/skills/skill-discovery/SKILL.md` | Phase 2 | Modify | Simplify to catalogue |
| `.claude/rules/orchestration-protocol.md` | Phase 3 | Modify | Add P5 injection pattern |
| `docs/architecture/ARCH-0002*.md` | Phase 3 | Modify | Add P2, P5 sections |
| `packages/core/agents/epost-fullstack-developer.md` | Phase 4 | Modify | Remove skill-discovery |
| `packages/core/agents/epost-debugger.md` | Phase 4 | Modify | Remove skill-discovery |
| `packages/core/agents/epost-tester.md` | Phase 4 | Modify | Remove skill-discovery |
| `packages/core/agents/epost-researcher.md` | Phase 4 | Modify | Remove skill-discovery |
| `packages/core/agents/epost-planner.md` | Phase 4 | Modify | Remove skill-discovery |
| `packages/core/agents/epost-docs-manager.md` | Phase 4 | Modify | Remove skill-discovery |
| `packages/core/agents/epost-git-manager.md` | Phase 4 | Modify | Remove skill-discovery |
| `packages/core/agents/epost-brainstormer.md` | Phase 4 | Modify | Remove skill-discovery |
| `packages/core/agents/epost-code-reviewer.md` | Phase 4 | Modify | Remove skill-discovery, add confirmation gate |
| `packages/core/skills/code-review/SKILL.md` | Phase 4 | Modify | Add confirmation gate |
| `packages/core/skills/clean-code/SKILL.md` | Phase 4 | Modify | Add confirmation gate |
| `packages/core/skills/core/SKILL.md` | Phase 3 | Modify | Add P2 output contract rule |

## Success Criteria

1. CLAUDE.md has no intent routing table — replaced by weight-based execution rule
2. skill-discovery SKILL.md < 60 lines (from 174) — catalogue only, no 4-step protocol
3. All 9 core agents have `skill-discovery` removed from `skills:` frontmatter
4. ARCH-0002 documents P2 output contract and P5 injection pattern
5. code-review and clean-code skills include confirmation gate before modifying code
6. Core law-layer (~30 lines) embedded directly in CLAUDE.snippet.md
7. `epost-kit init` regenerates successfully after all changes

## Constraints

- Edit `packages/` only — never `.claude/` directly
- Run `epost-kit init` after all phases to regenerate `.claude/`
- Keep CLAUDE.md total under 150 lines after rewrite
- No new abstractions — simplify, don't add
