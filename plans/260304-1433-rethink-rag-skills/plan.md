---
title: "Rethink RAG Skills — Dynamic, MCP-Integrated, Hardcode-Free"
description: "Rewrite web-rag and ios-rag skills to be dynamic, derive context from MCP tools at runtime, eliminate hardcoded filter values and project names"
status: pending
priority: P1
effort: 3h
branch: master
tags: [rag, skills, web-rag, ios-rag, mcp, dynamic]
created: 2026-03-04
---

# Rethink RAG Skills — Dynamic, MCP-Integrated, Hardcode-Free

## Overview

Rewrite `web-rag` and `ios-rag` skills to eliminate all hardcoded server details, filter values, project names, and static query patterns. Skills should teach agents HOW to use RAG tools dynamically, not WHAT specific values exist.

## Current State

- Skills hardcode port numbers (2636, 2637), project names (luz_epost_ios, luz_theme_ui), topic enums, file_type values, priority scores, filter combinations
- 440-line `query-patterns.md` files duplicate MCP tool schema info with static examples
- `smart-query.md` is good procedural knowledge but references hardcoded values
- MCP tools already self-describe: `status` returns projects/modules, `filters` (iOS) returns available filter values, `catalog` (web) lists artifacts, `expansions` returns synonym data
- Skills and MCP servers have drifted: skill docs say `generate_sidecar` tool, but web MCP has no such tool; iOS has sidecar route but not as MCP tool

## Target State

- Skills teach the PROTOCOL: how to discover, query, interpret, fallback
- All concrete values (projects, topics, modules, filters) discovered at runtime via `status`, `filters`, `catalog`, `expansions` tools
- Reference files reduced to procedural knowledge only (smart-query HyDE strategy, sidecar workflow)
- Identical structure between web and ios skills — platform differences handled by server responses

## Platform Scope
- [x] Web (epost_web_theme_rag)
- [x] iOS (epost_ios_rag)
- [ ] Android
- [ ] Backend

## Implementation Phases

1. [Phase 01: Rewrite SKILL.md Files](./phase-01-rewrite-skills.md)
2. [Phase 02: Consolidate Reference Files](./phase-02-consolidate-refs.md)

## Key Dependencies

- MCP tools `status`, `expansions` already exist on both servers
- `filters` endpoint exists on iOS but not web — web has `catalog` instead
- `component-mappings.md` and `synonym-groups.md` already point to MCP tools (done in PLAN-0030)

## Success Criteria

- [ ] Zero hardcoded port numbers, project names, topic enums, file_type lists in skill files
- [ ] Skills under 120 lines each (currently ~150 + 440-line query-patterns)
- [ ] Reference files reduced from 5 to 2 per platform (smart-query + sidecar-workflow)
- [ ] Agent can use RAG on a new project without updating skill files
- [ ] query-patterns.md removed or replaced with 3-4 generic examples

## Risk Assessment

- Low: additive changes to skill files, no server-side modifications
- If skill too thin, agent may make suboptimal queries. Mitigate: keep smart-query procedural guide
