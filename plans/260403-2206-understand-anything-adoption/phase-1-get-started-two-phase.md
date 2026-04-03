---
phase: 1
title: "Two-Phase Extraction for get-started"
effort: 2h
depends: [0]
---

# Phase 1: Two-Phase Extraction for get-started

## Context

- Plan: [plan.md](./plan.md)
- Pattern ref: `understand-patterns/references/two-phase-extraction.md` (from Phase 0)

## Overview

Upgrade `/get-started` onboarding to use UA's two-phase analysis: (1) deterministic structural scan — file types, entry points, import graph, framework detection; (2) semantic LLM annotation — purpose per module, dependency explanations. Also add fan-in-based pedagogical ordering so onboarding teaches foundational modules first.

## Files to Create

| File | Purpose |
|------|---------|
| `packages/core/skills/get-started/references/structural-scan-protocol.md` | Step-by-step structural scan instructions (deterministic phase) |
| `packages/core/skills/get-started/references/semantic-annotation-protocol.md` | LLM annotation guidelines (semantic phase) |
| `packages/core/skills/get-started/references/fan-in-tour-construction.md` | How to build dependency-ordered learning paths |

## Files to Modify

| File | Change |
|------|--------|
| `packages/core/skills/get-started/SKILL.md` | Add two-phase extraction steps + fan-in tour section |

## Requirements

1. **Structural scan** (Phase 1a): agent runs deterministic commands — `git ls-files`, parse `package.json`/`Cargo.toml`/`pom.xml`, count lines, detect frameworks, build import map from file headers
2. **Semantic annotation** (Phase 1b): agent uses structural output to annotate — module purposes, complexity ratings, dependency explanations
3. **Fan-in ordering**: count inbound references per module, order onboarding tour from most-depended-on (foundations) to leaf nodes (features)
4. **Output**: structured onboarding report with ordered module tour, not alphabetical file listing
5. Cross-reference `understand-patterns/references/two-phase-extraction.md` and `fan-in-ordering.md`

## Acceptance Criteria

- [ ] `/get-started` SKILL.md includes two-phase extraction steps
- [ ] Structural scan protocol produces deterministic, reproducible output
- [ ] Fan-in tour orders modules by dependency depth (foundations first)
- [ ] References cross-link to Phase 0 pattern docs
- [ ] `epost-kit verify` passes
