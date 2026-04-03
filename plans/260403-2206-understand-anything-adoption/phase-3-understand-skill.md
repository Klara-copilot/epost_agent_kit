---
phase: 3
title: "Understand Skill (Graph Consumer)"
effort: 2h
depends: [0, 2]
---

# Phase 3: Understand Skill (Graph Consumer)

## Context

- Plan: [plan.md](./plan.md)
- Graduation gate: only implement after team has run UA on 2+ repos

## Overview

Create an `understand` skill that wraps external Understand-Anything execution and reads its `knowledge-graph.json` output. This skill does NOT run the UA pipeline — it documents how to install UA, run it, and consume the graph artifact. Other agents query the graph via this skill's references.

## Package

`packages/core` — graph consumption is cross-platform.

## Files to Create

| File | Purpose |
|------|---------|
| `packages/core/skills/understand/SKILL.md` | Skill entry: install UA, run pipeline, consume graph |
| `packages/core/skills/understand/references/install-guide.md` | How to install Understand-Anything externally |
| `packages/core/skills/understand/references/graph-schema.md` | UA schema summary (16 node types, 29 edge types, layers, tours) |
| `packages/core/skills/understand/references/graph-query-patterns.md` | Common queries: find dependencies, trace calls, list layers |
| `packages/core/skills/understand/references/staleness-detection.md` | When graph is stale, how to detect, when to re-run |

## Files to Modify

| File | Change |
|------|--------|
| `packages/core/package.yaml` | Add `understand` to skills list |

## Requirements

1. Skill reads `.understand-anything/knowledge-graph.json` (UA's output location)
2. Graph query patterns: filter nodes by type, traverse edges by relationship, extract subgraphs by layer
3. Staleness detection: compare `fingerprints.json` timestamps to file mtimes
4. No runtime dependencies — skill is pure reference + read instructions
5. Document: "Run `npx understand-anything` in target repo before using this skill"

## Acceptance Criteria

- [ ] Skill registered in `packages/core/package.yaml`
- [ ] Install guide covers UA setup (npm/npx)
- [ ] Graph schema reference covers all 16 node types and key edge types
- [ ] Query patterns include 5+ common agent use cases
- [ ] `epost-kit verify` passes
