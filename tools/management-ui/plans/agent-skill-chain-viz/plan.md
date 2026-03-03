---
title: "Agent Skill Chain Visualization"
description: "Show per-agent skill loading behavior (core vs dynamic), extension chains, and hub context in canvas focus mode"
status: pending
priority: P1
effort: 3h
branch: master
tags: [management-ui, visualization, canvas]
created: 2026-03-03
---

# Agent Skill Chain Visualization

## Overview

Enhance the canvas focus mode to differentiate how each agent loads skills. When focusing on an agent, show:
- Core skills (always loaded, from `skills:` frontmatter) vs discoverable skills (lazy-loaded at runtime)
- Skill extension chains (e.g., `a11y` -> `ios-a11y` -> `audit-a11y`)
- Hub context routing visualization for the orchestrator

## Current State

- Agent focus mode shows depth-1 connections; all skill edges look identical
- SkillNode has tier badge (core=solid green, discoverable=dashed amber) but edges don't differentiate
- `skill-extends` edge type exists in GraphBuilder but no skills currently populate `extends`
- Hub context skill wired to orchestrator but not visually represented

## Target State

- Agent focus mode renders two edge categories: **static** (core, from frontmatter `skills:[]`) and **dynamic** (discoverable, from `skill-discovery` protocol)
- Discoverable skills show as dashed/lighter edges with "lazy" indicator
- Platform skill chains visible: when focusing an agent, show which platform skills it CAN dynamically load based on platform-detection rules
- Hub context node renders as special skill type showing routing protocol
- Clicking a skill in focus mode optionally expands its extension chain

## Platform Scope
- [x] Web (Next.js/React)

## Implementation Phases

1. [Phase 01: Data Model & Edge Enrichment](./phase-01-data-enrichment.md)
2. [Phase 02: Agent Focus Chain Rendering](./phase-02-focus-chain.md)
3. [Phase 03: Hub Context Visualization](./phase-03-hub-context.md)

## Key Dependencies

- `skill-index.json` data (tier, connections, platforms, agent-affinity)
- Agent frontmatter `skills:[]` list (static assignments)
- `skill-discovery` protocol rules (dynamic loading heuristics)

## Success Criteria

- [ ] Focusing agent shows core skills with solid edges, discoverable with dashed
- [ ] Platform-specific discoverable skills grouped visually by platform
- [ ] Skill extension chains expandable on click
- [ ] Hub context rendered for orchestrator agent
- [ ] Legend/tooltip explains the visual encoding

## Risk Assessment

- Discoverable skill mapping is heuristic (agent-affinity + platform match) -- may not be 100% accurate
- `extends` fields currently empty in skill-index -- must infer from naming conventions or populate data
