---
title: "RAG Query Expansion API — Serve Mappings via MCP"
description: "Add API endpoint + MCP tool to both RAG servers so agents fetch component-mappings & synonym-groups dynamically instead of hardcoded in kit skills"
status: pending
priority: P2
effort: 3h
branch: master
tags: [rag, mcp, web-rag, ios-rag, query-expansion, skills]
created: 2026-03-04
---

# RAG Query Expansion API — Serve Mappings via MCP

## Overview

Move component-mappings and synonym-groups from hardcoded kit skill reference files to a new MCP tool on each RAG server. Agents call `expansions` tool at query-planning time instead of reading static markdown.

## Current State

- `config/query_expansions.yaml` in each RAG project = source of truth
- Kit skill reference files (`packages/platform-{web,ios}/skills/{web,ios}-rag/references/{component-mappings,synonym-groups}.md`) = manually maintained copies
- Skill files say "Source of truth: `epost_{web,ios}_rag/config/query_expansions.yaml`" but data is duplicated
- Agent must have skill loaded to access mappings; no runtime API

## Target State

- Each RAG server exposes `GET /api/rag/expansions` returning `{component_mappings, synonyms}` JSON
- Each MCP server adds `expansions` tool that calls that endpoint
- Kit skill reference files replaced with instructions to call `expansions` MCP tool
- Single source of truth: `config/query_expansions.yaml` in each RAG project

## Platform Scope
- [x] Web (epost_web_theme_rag)
- [x] iOS (epost_ios_rag)
- [ ] Android
- [ ] Backend

## Implementation Phases

1. [Phase 01: RAG API Endpoint](./phase-01-rag-api-endpoint.md)
2. [Phase 02: MCP Tool](./phase-02-mcp-tool.md)
3. [Phase 03: Kit Skill Update](./phase-03-kit-skill-update.md)

## Key Dependencies

- Both RAG servers must be running for MCP tool to work
- `smart-query.md` references component-mappings/synonym-groups — needs update

## Success Criteria

- [ ] `GET /api/rag/expansions` returns correct JSON on both servers
- [ ] MCP `expansions` tool returns component_mappings + synonyms
- [ ] Kit skill reference files point to MCP tool, no hardcoded data
- [ ] Existing query expansion (server-side) still works unchanged

## Risk Assessment

- Low risk: additive API, no breaking changes to existing query pipeline
- Graceful degradation: if RAG server down, agent loses expansion data but skill text provides fallback guidance
