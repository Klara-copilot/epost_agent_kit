---
title: "Improve /scout with Smart Routing, Skill Integration & RAG"
description: "Upgrade scout from basic file search to intelligent codebase explorer with platform-aware RAG, skill categorization, and smart routing"
status: pending
priority: P1
effort: 3h
branch: master
tags: [scout, rag, skills, routing]
created: 2026-03-04
---

# Improve /scout with Smart Routing, Skill Integration & RAG

## Overview

Upgrade `/scout` from a minimal 33-line "grep wrapper" into a smart codebase explorer. Integrate RAG backends (web-rag, ios-rag, future android-rag), apply skill-discovery protocol, add platform-aware routing, and categorize search results by domain.

## Current State

- `scout/SKILL.md`: 33 lines, forks as `Explore` subagent
- No skills wired (empty keywords, triggers, agent-affinity, connections)
- No RAG integration -- just Glob/Grep/Read
- No platform-specific search strategies
- scout-block hook exists (directory access guard) -- unrelated, keep as-is

## Target State

- Scout loads platform RAG skills (web-rag, ios-rag) when platform detected
- Categorized results: code, components, tokens, patterns, docs, config
- Smart routing: semantic query -> best search tool (RAG vs Grep vs Context7)
- Skill index entry has proper keywords, connections, agent-affinity
- Future-ready for android-rag

## Platform Scope
- [x] Cross-platform (skill infrastructure)

## Implementation Phases

1. [Phase 01: Skill Metadata & Connections](./phase-01-skill-metadata.md) -- 30m
2. [Phase 02: Smart Search Routing](./phase-02-smart-search-routing.md) -- 1h
3. [Phase 03: RAG Integration](./phase-03-rag-integration.md) -- 1h
4. [Phase 04: Result Categorization](./phase-04-result-categorization.md) -- 30m

## Key Dependencies

- `web-rag` skill (exists, port 2636)
- `ios-rag` skill (exists, port 2637)
- `skill-discovery` protocol (exists)
- `knowledge-retrieval` chain (exists)

## Success Criteria

- [ ] `/scout button component` uses RAG when web platform detected
- [ ] `/scout ios: navigation pattern` queries ios-rag
- [ ] Results grouped by category (code, tokens, docs, config)
- [ ] Skill index entry has keywords, connections, agent-affinity
- [ ] Graceful fallback when RAG servers offline

## Risk Assessment

- RAG servers may be offline -- mitigate with fallback to Grep/Glob
- android-rag doesn't exist yet -- design for future addition only
