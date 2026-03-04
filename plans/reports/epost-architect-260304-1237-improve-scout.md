# Report: Improve /scout with Smart Routing, Skill Integration & RAG

**Agent**: epost-architect
**Date**: 2026-03-04
**Plan**: [plans/260304-1237-improve-scout/plan.md](../260304-1237-improve-scout/plan.md)

## Summary

Created 4-phase plan to upgrade `/scout` from a minimal 33-line Explore subagent into a smart codebase explorer with RAG integration, platform-aware routing, and categorized output.

## Current State Analysis

- Scout skill: 33 lines, zero metadata (empty keywords, triggers, connections, agent-affinity)
- No RAG integration -- only Glob/Grep/Read
- skill-discovery protocol cannot route to scout (no keywords to match)
- web-rag (port 2636) and ios-rag (port 2637) exist but are not wired to scout
- android-rag does not exist yet

## Skill Categorization

Skills relevant to scout improvement:

| Category | Skills | Role in Scout |
|----------|--------|---------------|
| **Search Backends** | web-rag, ios-rag | Semantic search for platform codebases |
| **Routing** | skill-discovery, hub-context | Platform detection, intent routing |
| **Knowledge** | knowledge-retrieval, docs-seeker | Retrieval chain scout should follow |
| **Exploration** | repomix | Complementary -- full repo overview |
| **Domain** | domain-b2b, domain-b2c | Context for module-specific searches |

## Smart Routing Design

Scout should follow knowledge-retrieval's 5-level chain adapted for exploration:

1. **docs/** -- project decisions, architecture docs
2. **RAG** -- semantic search (web-rag/ios-rag when platform detected)
3. **Skills** -- skip (not relevant for code search)
4. **Codebase** -- Grep/Glob (always available, exact matches)
5. **External** -- Context7 (only for external library APIs)

## Phases

| # | Phase | Status | What |
|---|-------|--------|------|
| 1 | Skill Metadata & Variants | ✅ Complete | `scout`, `scout-fast`, `scout-deep` — metadata, triggers, connections wired |
| 2 | Smart Search Routing | ✅ Complete | Decision tree: intent classification, platform detection, RAG vs Grep vs Context7 |
| 3 | RAG Integration | ✅ Complete | Lazy detection, query construction, filter extraction, offline fallback |
| 4 | Result Categorization | ✅ Complete | Group by Components/Logic/Tokens/Config/Tests/Docs |

**Total estimated effort**: 3h | **Actual**: All phases merged into skill implementation (semantic + procedural)

## Key Decisions

- All changes are to `packages/core/skills/scout/SKILL.md` (source of truth)
- No code changes -- all improvements are skill instructions for the Explore subagent
- RAG is additive (Grep always works, RAG adds semantic search when available)
- android-rag: placeholder only, design for future addition

## Decisions (Approved)

1. **RAG availability detection**: Lazy (on first semantic query) — no upfront health check
2. **Sub-variants**: Yes — `scout-fast` (grep-only), `scout-deep` (RAG+grep). Both `user-invocable: true`
3. **android-rag**: Planned for later; design for future plug-in now
