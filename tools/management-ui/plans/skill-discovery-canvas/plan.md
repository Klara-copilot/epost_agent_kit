---
title: "Skill Discovery Chain Canvas"
description: "Interactive canvas showing how one agent discovers and loads skills through the 4-layer chain"
status: pending
priority: P1
effort: 6h
branch: master
tags: [management-ui, visualization, canvas, skill-discovery]
created: 2026-03-03
---

# Skill Discovery Chain Canvas

## Overview

New dedicated canvas view that visualizes how a single agent's skill discovery protocol works -- showing the full chain from declared skills through affinity, platform detection, dependency resolution (extends/requires), and enhancers. The kit designer sees the "smart loading" flow as an interactive graph on a canvas, not just a sidebar summary.

## Current State

- `SkillChainResolver.ts` computes 4 layers (declared, affinity, platform, enhancer) per agent
- `SkillChainSummary` in right panel renders flat text list when agent focused
- Canvas "chain view" mode shows agents+skills globally but no per-agent discovery flow
- No visualization of the *discovery protocol* itself -- the decision tree that routes signals to skills
- No visualization of extends/requires dependency chains as sub-graphs
- No interactive platform selector to simulate "what would load if working on iOS?"

## Target State

- New route `/canvas/discovery` or toggle within existing canvas
- Select an agent from dropdown -- canvas renders that agent's complete skill discovery graph
- Graph layout: agent node at center-left, skills radiate outward in concentric layers
- Layer 0 (Declared): solid edges, closest ring -- always loaded from `skills:[]` frontmatter
- Layer 1 (Affinity): dashed amber edges, second ring -- `agent-affinity` matches
- Layer 2 (Platform): grouped by platform (ios/android/web/backend/design), third ring
  - Platform selector toggles which platform group is "active" (highlighted vs dimmed)
  - Shows extends/requires sub-chains within platform group
- Layer 3 (Enhancers): dotted teal edges, outermost ring -- skills that enhance declared/affinity skills
- Clicking any skill node shows its own connection graph (extends, requires, enhances, conflicts)
- Right panel shows the discovery protocol steps as a checklist/flowchart

## Platform Scope
- [x] Web (Next.js/React)

## Implementation Phases

1. [Phase 01: Radial Layout Engine](./phase-01-radial-layout.md) ~2h
2. [Phase 02: Discovery Canvas Page](./phase-02-discovery-page.md) ~2h
3. [Phase 03: Platform Selector & Interaction](./phase-03-platform-interaction.md) ~1.5h
4. [Phase 04: Skill Sub-Chain Expansion](./phase-04-skill-subchain.md) ~30min

## Key Dependencies

- `SkillChainResolver.ts` -- existing chain resolution (core data source)
- `skill-index.json` -- skill metadata (connections, platforms, agent-affinity)
- Agent frontmatter parser -- `skills:[]` list
- React Flow (already installed) -- canvas rendering
- `dagre.ts` layout -- may extend or create new radial layout

## Success Criteria

- [ ] Agent selector dropdown renders all 13 agents
- [ ] Selecting agent shows radial skill graph with 4 concentric layers
- [ ] Layer colors match existing convention (green/amber/amber/teal)
- [ ] Platform selector highlights one platform group at a time
- [ ] Extends/requires chains visible as sub-edges within platform groups
- [ ] Clicking skill node expands its connection sub-graph
- [ ] Right panel shows discovery protocol steps with which step loaded which skill
- [ ] Responsive -- works at different zoom levels

## Risk Assessment

- Radial layout with React Flow requires custom positioning (RF normally uses dagre/tree). Mitigated: compute positions manually, RF only renders.
- Large agent (orchestrator) may have many discoverable skills -- test with most-connected agent.
- Platform skill mapping is heuristic -- surface this in UI as "potential" skills.
