---
title: "Dual-View Redesign: Agent-Centric + Skill-Centric"
description: "Replace discovery dropdown with agent tree selection; add skill-centric impact analysis view"
status: pending
priority: P1
effort: 6h
branch: master
tags: [management-ui, ux, canvas, views]
created: 2026-03-03
---

# Dual-View Redesign

## Overview

Redesign canvas into two distinct views: (1) Agent-Centric — agent tree on left, clicking agent shows its skills on canvas (no dropdown); (2) Skill-Centric — skill as focal point, showing which agents and packages are affected, with required/optional distinction.

## Current State

- Canvas has 3 view modes: Full, Skill Chain, Discovery
- Discovery uses `<select>` dropdown to pick agent — not discoverable, poor UX
- No skill-centric view exists — skill impact analysis requires manual edge tracing
- Right panel shows properties/protocol but not cross-cutting impact

## Target State

- **Agent View**: Left panel = agent tree (clickable list, no dropdown). Click agent = canvas shows its skill chain (declared/affinity/platform/enhancer). Replaces Discovery mode.
- **Skill View**: Left panel = skill tree (grouped by package). Click skill = canvas shows all agents using it + packages providing it. Right panel = required vs optional breakdown.
- Both views reuse existing FlowCanvas, SkillChainResolver, graph data

## Platform Scope
- [x] Web (Next.js/React)

## Implementation Phases

1. [Phase 01: Agent-Centric View](./phase-01-agent-view.md)
2. [Phase 02: Skill-Centric View](./phase-02-skill-view.md)
3. [Phase 03: Navigation + Polish](./phase-03-navigation.md)

## Key Dependencies

- Existing `SkillChainResolver` for agent skill chains
- Existing `GraphBuilder` edges for skill-agent/skill-package relationships
- ReactFlow + dagre layout engine

## Success Criteria

- [ ] Agent view: click agent in tree, canvas shows skill chain — no dropdown
- [ ] Skill view: click skill, see affected agents + packages with required/optional
- [ ] Smooth tab/route switching between Agent and Skill views
- [ ] Existing Full and Chain views remain functional

## Risk Assessment

Low risk — additive change, existing data layer covers both views. Main risk: canvas layout density for skill view showing many agents.
