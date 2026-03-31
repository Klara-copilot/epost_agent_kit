---
title: "Fix deps schema confusion in docs init.md"
status: active
created: 2026-03-31
updated: 2026-03-31
effort: 20m
phases: 1
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

## Problem

83% of repos generate wrong `dependencies.internal` entries. Agents put npm/maven packages into `internal` instead of `external`. Root cause: section 4.5 of `init.md` doesn't clearly separate the two concepts.

## Success Criteria

- `internal` section explicitly scoped to `luz_*` repos only, with `.repo` field requirement
- `external` section covers npm/maven packages AND cloud services
- Correct vs Incorrect example table present
- Validation rule block at end of section
- Smart Init mode inherits fix (already references "Same as Generation Mode step 4.5")

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Rewrite section 4.5 | 20m | done | [phase-1](./phase-1-rewrite-deps-section.md) |
