---
phase: 0
title: "UA Patterns Reference Skill"
effort: 1h
depends: []
---

# Phase 0: UA Patterns Reference Skill

## Context

- Plan: [plan.md](./plan.md)
- Research: `reports/260403-2036-understand-anything-research-epost-researcher.md`

## Overview

Create a passive reference skill documenting UA's architectural patterns for agent consumption. This gives all agents access to UA concepts (two-phase extraction, fan-in ordering, artifact persistence, fingerprinting) without runtime code.

## Package

`packages/core` — these are cross-platform patterns, not domain-specific.

## Files to Create

| File | Purpose |
|------|---------|
| `packages/core/skills/understand-patterns/SKILL.md` | Pattern catalogue — when to apply each UA pattern |
| `packages/core/skills/understand-patterns/references/two-phase-extraction.md` | Deterministic structure + semantic annotation protocol |
| `packages/core/skills/understand-patterns/references/artifact-persistence.md` | JSON intermediate artifacts for cross-agent sharing |
| `packages/core/skills/understand-patterns/references/fan-in-ordering.md` | BFS + fan-in ranking for pedagogical ordering |
| `packages/core/skills/understand-patterns/references/file-fingerprinting.md` | Content hash comparison for incremental reruns |

## Files to Modify

| File | Change |
|------|--------|
| `packages/core/package.yaml` | Add `understand-patterns` to skills list |

## Requirements

1. SKILL.md frontmatter: `user-invocable: false`, `disable-model-invocation: true` (reference-only)
2. Each reference doc: problem statement, pattern description, epost application examples, when to use/skip
3. Reference UA's schema (16 node types, 29 edge types) but note we consume patterns, not the full schema
4. Keep total skill under 3KB (SKILL.md) + 1.5KB per reference

## Acceptance Criteria

- [ ] Skill registered in `packages/core/package.yaml`
- [ ] `epost-kit verify` passes (or `node .claude/scripts/generate-skill-index.cjs` regenerates clean index)
- [ ] Reference docs are self-contained (no external links required to understand patterns)
- [ ] Other phases reference these docs instead of duplicating pattern descriptions
