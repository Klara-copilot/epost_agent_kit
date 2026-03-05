---
title: "Improve /scout with Smart Routing, RAG & Query Expansion"
description: "Upgrade scout, sync RAG query expansion data into kit skills, improve knowledge-retrieval awareness"
status: completed
priority: P1
effort: 5h (2h done + 3h remaining)
branch: master
tags: [scout, rag, skills, routing, query-expansion, knowledge-retrieval]
created: 2026-03-04
---

# Improve /scout with Smart Routing, RAG & Query Expansion

## Overview

Two-part improvement: (1) Upgrade `/scout` from basic grep wrapper to smart codebase explorer with RAG integration, (2) Sync RAG server query expansion configs into kit skills so agents avoid redundant synonym expansion and use correct canonical component names.

## Current State

### Completed (Phases 1-4)
- Scout SKILL.md fully rewritten: keywords, triggers, connections, agent-affinity, platforms
- Smart search routing with decision tree (semantic vs grep vs Context7 vs docs/)
- RAG integration (web-rag/ios-rag with lazy health check, filter extraction, offline fallback)
- Result categorization by domain (Components, Logic/Utils, Tokens/Config, Tests, Docs)
- scout-deep and scout-fast companion skills created

### Remaining Gap
- RAG servers have `config/query_expansions.yaml` with 170+ web component mappings, 90+ iOS mappings, 60+ web synonym groups, 30+ iOS synonym groups
- Kit skills don't reference these expansions -- agents don't know server auto-expands
- `smart-query.md` tells agents to generate 3-5 synonym variant queries -- but server already expands synonyms (double-expansion)
- `knowledge-retrieval/references/search-strategy.md` has manual keyword expansion table without server-side awareness
- iOS `query_expansion.py` lacks multi-word phrase matching and canonical injection (web has both)

## Target State

- RAG skill references summarize available component mappings and synonym groups
- smart-query.md recommends structural variants only (server handles synonyms)
- knowledge-retrieval distinguishes server-side vs agent-side expansion
- iOS query_expansion.py at parity with web (phrase matching, punctuation strip, canonical injection)

## Platform Scope
- [x] Web (web-rag skill)
- [x] iOS (ios-rag skill)
- [x] Cross-platform (knowledge-retrieval, scout)

## Implementation Phases

### Done
1. [Phase 01: Skill Metadata & Connections](./phase-01-skill-metadata.md) -- DONE
2. [Phase 02: Smart Search Routing](./phase-02-smart-search-routing.md) -- DONE
3. [Phase 03: RAG Integration](./phase-03-rag-integration.md) -- DONE
4. [Phase 04: Result Categorization](./phase-04-result-categorization.md) -- DONE

### Remaining
5. [Phase 05: Sync Query Expansion References](./phase-05-sync-expansion-refs.md) -- DONE
6. [Phase 06: Update Smart Query & Retrieval Skills](./phase-06-update-smart-query.md) -- DONE
7. [Phase 07: iOS Query Expansion Parity](./phase-07-ios-expansion-parity.md) -- DONE

## Key Dependencies

- `epost_web_theme_rag/config/query_expansions.yaml` (source of truth for web)
- `epost_ios_rag/config/query_expansions.yaml` (source of truth for iOS)
- `web-rag` skill (port 2636), `ios-rag` skill (port 2637)
- `knowledge-retrieval` skill chain

## Success Criteria

- [x] Scout has keywords, connections, agent-affinity in skill-index
- [x] `/scout button component` uses RAG when web platform detected
- [x] Results grouped by category
- [x] Graceful fallback when RAG servers offline
- [x] RAG skill references list available component canonical names
- [x] smart-query.md notes server-side expansion (skip redundant synonym variants)
- [x] knowledge-retrieval search-strategy has server-side expansion awareness
- [x] iOS query_expansion.py has multi-word phrase matching (parity with web)

## Risk Assessment

- RAG servers may be offline -- mitigate with fallback to Grep/Glob (already handled)
- Query expansion YAMLs may drift -- mitigate with version tracking (.expansions-version)
- Over-documenting mappings bloats skills -- summarize categories, reference server as source of truth
