---
title: "Skill Discovery Token Optimization — Lazy Loading Strategy"
description: "Replace eager skill loading with discovery-driven lazy loading to cut agent startup tokens by 40-60%"
status: complete
priority: P1
effort: 5h
branch: master
tags: [skill-discovery, token-optimization, lazy-loading, agent-architecture]
created: 2026-02-28
---

# Skill Discovery Token Optimization — Lazy Loading Strategy

## Overview

Agents currently load ALL declared skills at startup (~5-10K tokens each). With `skill-discovery` now available, agents can load a minimal core set upfront and discover+load additional skills on-demand per task. This cuts startup context by 40-60% while maintaining full capability.

## Current State — The Problem

**Every agent eagerly loads all skills regardless of task:**

| Agent | Skills | Payload | ~Tokens |
|-------|--------|---------|---------|
| epost-architect | 6 | 40 KB | 10,000 |
| epost-documenter | 6 | 36 KB | 9,000 |
| epost-kit-designer | 6 | 35 KB | 8,800 |
| epost-debugger | 8 | 28 KB | 7,000 |
| epost-implementer | 6 | 28 KB | 7,000 |
| epost-orchestrator | 5 | 27 KB | 6,700 |
| **Total across agents** | | **~194 KB** | **~48,500** |

**Waste pattern**: epost-debugger loads `docs-seeker` (4.5K) + `knowledge-base` (5.3K) + `sequential-thinking` (2.4K) on every debug task, even for a simple "fix this typo" bug.

## Target State

Split each agent's skills into:
- **Core set** (always loaded): `core` + agent's primary function skill + `skill-discovery`
- **Discoverable set** (loaded on-demand): Everything else, loaded by `skill-discovery` when task context matches

**Projected savings:**

| Agent | Before | After (core) | Savings |
|-------|--------|-------------|---------|
| epost-architect | 40 KB | 12 KB (core, planning, skill-discovery) | **-70%** |
| epost-debugger | 28 KB | 9 KB (core, debugging, skill-discovery) | **-68%** |
| epost-implementer | 28 KB | 10 KB (core, code-review, skill-discovery) | **-64%** |
| epost-orchestrator | 27 KB | 12 KB (core, planning, skill-discovery) | **-56%** |
| epost-reviewer | 19 KB | 10 KB (core, code-review, skill-discovery) | **-47%** |
| epost-tester | 17 KB | 9 KB (core, debugging, skill-discovery) | **-47%** |

**Average: ~58% reduction in startup skill tokens.**

## Platform Scope
- [x] Cross-platform (agent infrastructure)

## Implementation Phases

1. [Phase 01: Enhance skill-discovery with lazy loading protocol](./phase-01-enhance-skill-discovery-lazy-loading.md) ⏳
2. [Phase 02: Classify skills into core vs discoverable tiers](./phase-02-classify-skill-tiers.md) ⏳
3. [Phase 03: Slim agent skills lists](./phase-03-slim-agent-skills.md) ⏳
4. [Phase 04: Validate with scenario tests](./phase-04-validate-scenarios.md) ⏳

## Key Dependencies

- `skill-discovery` skill must work reliably before slimming agent lists
- `skill-index.json` must have accurate `agent-affinity` and `keywords` fields
- Progressive disclosure architecture (references/ dirs) already exists

## Success Criteria

- [ ] 6 generalist agents reduced to ≤3 startup skills each
- [ ] skill-discovery enhanced with lazy-loading protocol + skill tier system
- [ ] skill-index.json updated with `tier` field (core vs discoverable)
- [ ] All agent capabilities preserved (discoverable skills load when needed)
- [ ] Token savings measurable: before/after payload comparison

## Risk Assessment

**Risk**: Discovery fails to load a needed skill → agent produces lower-quality output
**Mitigation**: Phase 04 validates every agent+task combination; `core` skill always loaded as safety net; agents can fall back to generic behavior if discovery misses

**Risk**: Discovery adds latency (reading index + skill files mid-task)
**Mitigation**: skill-index.json is <25KB (fast read); skills are <10KB each; 1-2 extra file reads is negligible vs. the ~5K token savings
