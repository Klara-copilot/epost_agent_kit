---
title: "Smart Skill Ecosystem: Dynamic Loading, Connections, Categories"
description: "Redesign skill organization with categories, inter-skill connections, and smart dynamic loading"
status: draft
priority: P1
effort: "12h"
branch: master
tags: [ecosystem, skills, agents, architecture, categories]
created: 2026-03-01
---

# Smart Skill Ecosystem

## Overview

Redesign epost_agent_kit's 93 skills into a category-based, connection-aware, dynamically-loaded ecosystem. Inspired by ClaudeKit's category separation. Includes agent roster evaluation.

## Current State

- 93 skills, flat namespace with platform prefixes (`web-`, `ios-`, `android-`, `backend-`, `kit-`)
- `skill-discovery` loads max 3 skills per task via signal matching
- No formal skill-to-skill connections (extends/requires/enhances)
- No category metadata in `skill-index.json`
- 14 agents, some with unclear boundaries (implementer does everything)
- Command skills (cook, fix, plan) mixed with knowledge skills (debugging, planning)

## Target State

- Skills organized into 10 categories with `category` field in index
- Formal `connections` graph: extends, requires, enhances, conflicts
- Smart loader that auto-resolves dependency chains (load `web-frontend` -> auto-load `web-nextjs` if Next.js detected)
- Revised agent roster: 16 agents with clear ownership boundaries
- Categories visible in index for filtering and discovery

## Implementation Phases

1. [Phase 01: Category Taxonomy + Index Schema](./phase-01-categories.md)
2. [Phase 02: Skill Connection Graph](./phase-02-connections.md)
3. [Phase 03: Smart Dynamic Loader](./phase-03-loader.md)
4. [Phase 04: Agent Roster Revision](./phase-04-agents.md)

## Key Dependencies

- `skill-index.json` schema change affects `generate-skill-index.cjs`
- Agent changes affect `settings.json` and `package.yaml` manifests
- Connection graph needs validation script

## Success Criteria

- [ ] All 93 skills assigned to exactly 1 category
- [ ] Connection graph covers all inter-skill relationships
- [ ] Loader resolves chains in <3 hops
- [ ] Agent roster has clear, non-overlapping responsibilities
- [ ] `skill-index.json` schema backward-compatible

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Category misassignment | Skills not found | Peer review of mapping |
| Circular dependency in connections | Infinite load loop | Max-depth guard (3 hops) |
| Agent consolidation breaks workflows | User confusion | Document migration path |
