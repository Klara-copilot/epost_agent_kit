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

## Target State

- **Agent View**: Left panel = agent tree (clickable, grouped by package). Click agent = canvas shows its skill chain. No dropdown.
- **Skill View**: Left panel = skill tree. Click skill = canvas shows all agents using it + packages providing it. Right panel = required vs optional breakdown.
- Both views reuse existing FlowCanvas, SkillChainResolver, graph data

## Implementation Phases

### Phase 01: Agent-Centric View (~2h)
- Create `AgentTree.tsx` — agents grouped by package, clickable
- Replace discovery `<select>` dropdown with agent tree in left panel
- Rename viewMode `'discovery'` -> `'agent'`
- Keep existing filteredGraph + DiscoveryProtocolPanel logic as-is
- Files: CREATE `app/canvas/_components/AgentTree.tsx`, MODIFY `app/canvas/page.tsx`

### Phase 02: Skill-Centric View (~3h)
- Create `SkillTree.tsx` — skills grouped by package, collapsible
- Create `SkillImpactPanel.tsx` — shows required/optional agents, providing packages, skill connections
- Add `'skill'` viewMode with new filteredGraph logic (reverse-traverse edges from selected skill)
- Required = agent has skill in `skills:` frontmatter; Optional = reachable via affinity/platform/enhancer
- Files: CREATE `SkillTree.tsx`, `SkillImpactPanel.tsx`, MODIFY `app/canvas/page.tsx`

### Phase 03: Navigation + Polish (~1h)
- Cross-view links: click agent in skill view -> switch to agent view, and vice versa
- URL query param sync (`?view=agent&id=X`)
- Cleanup deprecated dropdown code, extract shared TreePanel
- Update homepage nav cards
- Files: MODIFY `app/canvas/page.tsx`, `app/page.tsx`

## Key Dependencies
- Existing `SkillChainResolver` for agent skill chains
- Existing `GraphBuilder` edges for skill-agent/skill-package relationships
- ReactFlow + dagre layout

## Success Criteria
- [ ] Agent view: click agent in tree, canvas shows skill chain — no dropdown
- [ ] Skill view: click skill, see affected agents + packages with required/optional
- [ ] Smooth switching between Agent and Skill views
- [ ] Existing Full and Chain views remain functional

## Risks
Low — additive change, existing data layer covers both views. Main risk: canvas density for skills with many agent connections.

---

Full plan with detailed implementation steps at:
`tools/management-ui/plans/dual-view-redesign/plan.md`
