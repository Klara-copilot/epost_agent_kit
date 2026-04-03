---
phase: 4
title: "Graph-Aware Planning and Debugging"
effort: 2h
depends: [3]
---

# Phase 4: Graph-Aware Planning and Debugging

## Context

- Plan: [plan.md](./plan.md)
- Depends on: Phase 3 (`understand` skill with graph query patterns)

## Overview

Extend epost-planner and epost-debugger to optionally consume UA's knowledge graph for data-driven phase scoping and error propagation tracing. Both agents check if `.understand-anything/knowledge-graph.json` exists; if yes, use it; if no, fall back to current behavior.

## Files to Create

| File | Purpose |
|------|---------|
| `packages/core/skills/plan/references/graph-aware-scoping.md` | How planner uses graph layers + edges to scope phases |
| `packages/core/skills/debug/references/graph-edge-traversal.md` | How debugger traces error paths via graph edges |

## Files to Modify

| File | Change |
|------|--------|
| `packages/core/skills/plan/SKILL.md` | Add optional graph-aware step in planning flow |
| `packages/core/skills/debug/SKILL.md` | Add optional graph traversal step in diagnosis flow |

## Planner Integration

1. Before phase decomposition, check for `knowledge-graph.json`
2. If present: read architectural layers, extract file-to-layer mapping
3. Use layers to define phase boundaries (one phase per layer or cluster)
4. Use edge data to identify cross-layer dependencies (phase ordering)
5. Populate file ownership matrix from graph nodes

## Debugger Integration

1. When tracing root cause, check for `knowledge-graph.json`
2. If present: find error file's node in graph
3. Traverse `calls`, `imports`, `writes_to` edges to map propagation paths
4. Narrow investigation to connected subgraph instead of grepping entire codebase
5. Output: ranked list of suspect files by edge proximity

## Requirements

1. Both integrations are **optional** — graceful fallback when no graph exists
2. Reference `understand/references/graph-query-patterns.md` for query syntax
3. Graph subgraph extraction: read JSON, filter nodes/edges by relevance, inject summary (not full graph) into agent context
4. Token budget: injected graph context must stay under 2KB (summarize, don't dump)

## Acceptance Criteria

- [ ] Planner SKILL.md has conditional graph-aware scoping step
- [ ] Debugger SKILL.md has conditional graph traversal step
- [ ] Both reference the `understand` skill's query patterns
- [ ] Fallback behavior documented (no graph = current behavior unchanged)
- [ ] Injected graph context stays under 2KB
- [ ] `epost-kit verify` passes
