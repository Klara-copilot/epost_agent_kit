---
title: "Skill Chain View Mode"
description: "Replace Skills View with Skill Chain view showing full loading chain and enhancers for all agents"
status: pending
priority: P1
effort: 2h
branch: master
tags: [management-ui, visualization, canvas, skill-chain]
created: 2026-03-03
---

# Skill Chain View Mode

## Overview

Replace the current "Skills View" toggle (which just filters to agents+skills) with a "Skill Chain" view that visualizes the complete skill loading chain — declared, affinity, platform, enhancer layers — for all agents simultaneously.

## Current State

- "Skills View" button toggles `viewMode` between `'full'` and `'skills'`
- Skills mode filters graph to only agent + skill nodes, preserving existing edges
- Skill chain resolution (`SkillChainResolver.ts`) only runs when a single agent is focused (double-click)
- `SkillChainSummary` renders in right panel only for focused agent
- `SkillNode` shows layer badges only during agent focus mode via `FocusContext`

## Target State

- Button renamed "Skill Chain" (toggle between `'full'` and `'chain'`)
- When chain view active: resolve chain for ALL agents, compute global layer map
- Canvas shows agents + skills only (like current skills view)
- Every skill node shows its layer badge(s) — color-coded by layer type
- Edges color-coded: solid green (declared), dashed amber (affinity), dashed amber (platform), dotted teal (enhancer)
- Affinity edges injected for all agents (not just focused agent)
- Right panel shows aggregated chain summary when no specific node selected
- Clicking an agent in chain view shows its specific chain in right panel (existing `SkillChainSummary`)

## Platform Scope
- [x] Web (Next.js/React)

## Implementation Phases

1. [Phase 01: Global Chain Resolution + View Mode](./phase-01-global-chain.md) ~1.5h
2. [Phase 02: Chain View Edge Styling + Legend](./phase-02-styling-legend.md) ~30min

## Key Dependencies

- `SkillChainResolver.ts` — existing chain resolution logic
- `FocusContext` — layer map delivery to skill nodes
- `dagre.ts` layout — edge style config

## Success Criteria

- [ ] "Skills View" button replaced with "Skill Chain" toggle
- [ ] Chain view shows all agents' skill chains simultaneously
- [ ] Skill nodes display layer badges (declared/affinity/platform/enhancer)
- [ ] Edges differentiated by color per layer type
- [ ] Affinity edges rendered for all agents
- [ ] Right panel shows aggregated chain info or per-agent chain on selection
- [ ] Existing focus mode (double-click) still works within chain view

## Risk Assessment

- Multiple agents may share skills — need to pick highest-priority layer when skill appears in multiple chains (declared > affinity > platform > enhancer)
- Performance: resolving chains for all agents on every render. Mitigated by `useMemo` with stable dependencies.
