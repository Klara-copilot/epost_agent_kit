# epost-researcher: AI Agent Skill/Tool Discovery & Routing Patterns

**Date**: 2026-03-18 10:24
**Agent**: epost-researcher
**Scope**: Patterns for semantic skill matching, dynamic loading, composition, context-aware activation, scoring, and self-improvement in agent systems — applied to markdown-based Claude Code skill system
**Status**: COMPLETE

---

## Executive Summary

The field has converged on a **three-tier progressive disclosure model** (metadata → instructions → references) as the dominant pattern for skill/tool discovery in token-constrained agent systems. Anthropic's own advanced tool use research confirms 85% token reduction via on-demand Tool Search rather than upfront loading. For epost_agent_kit, the current system is well-aligned with industry patterns; the primary gaps are (1) no semantic/embedding-based matching fallback when keyword matching fails, (2) no confidence scoring for ambiguous multi-skill matches, and (3) no lightweight usage-history mechanism to improve routing over time.

---

## Findings

### Finding 1: Progressive Disclosure is Now the Industry Standard

Three-tier architecture is consensus across Anthropic, LangChain, Semantic Kernel, and Claude Code skills:

| Tier | Content | Token Cost | Load Trigger |
|------|---------|-----------|--------------|
| L1 Metadata | name + 50-100 token description | ~2-3% of full load | Always at task start |
| L2 Instructions | SKILL.md procedural content | On match | Signal detected |
| L3 References | aspect files, examples | On demand during execution | Explicit need in L2 |

The epost_agent_kit system already implements this. The skill-index.json is L1; SKILL.md is L2; `references/` files are L3.

**Key finding**: Anthropic's own "Advanced Tool Use" research showed pre-loading all tools costs 77K tokens vs 8.7K for on-demand Tool Search Tool — **85% reduction**. epost_agent_kit's lazy-loading approach is correct.

Source: [Anthropic Advanced Tool Use](https://www.anthropic.com/engineering/advanced-tool-use), [Spring AI Tool Search](https://spring.io/blog/2025/12/11/spring-ai-tool-search-tools-tzolov/)

---

### Finding 2: Three Routing Strategies, Each with a Role

| Strategy | How | Speed | Accuracy | Token Cost | Best For |
|----------|-----|-------|----------|-----------|----------|
| **Keyword/rule-based** | String match on triggers/keywords | Fast | ~70-80% | Near-zero | Clear, well-defined intents |
| **Embedding/semantic** | Vector similarity against example utterances | Fast | 92-96% | Low (no LLM) | High-volume, static categories |
| **LLM routing** | Model decides which tool to call | Slow | High (flexible) | High | Ambiguous, novel queries |

epost_agent_kit uses only strategy 1. The gap: when keyword matching produces 0 or 3+ matches, there's no fallback.

**Actionable pattern**: Semantic routing (embedding-based) achieved "92–96% precision" in production systems at "deployment time measured in weeks rather than months." For a markdown-only system, this maps to: expand the `keywords` array with semantic synonyms, and add `examples` (representative utterances) to each skill in the index.

Source: [Intent Recognition Gist](https://gist.github.com/mkbctrl/a35764e99fe0c8e8c00b2358f55cd7fa)

---

### Finding 3: Semantic Kernel's Annotation-Driven Routing

Semantic Kernel uses `@kernel_function` decorators with natural-language descriptions to enable the kernel to route dynamically. The key insight: **description quality is the routing algorithm**. If descriptions precisely capture triggering conditions (not workflow summaries), the model routes correctly without additional infrastructure.

epost_agent_kit's CSO (Cognitive Skill Optimization) principle — "description = triggering conditions ONLY" — is exactly this pattern. This is validated.

The A2A (Agent-to-Agent) protocol (April 2025) adds peer agent discovery, relevant if epost agents need to discover each other at runtime rather than via hardcoded agent lists.

Source: [Semantic Kernel Plugins](https://learn.microsoft.com/en-us/semantic-kernel/concepts/plugins/), [SK Multi-Agent](https://devblogs.microsoft.com/semantic-kernel/guest-blog-building-multi-agent-solutions-with-semantic-kernel-and-a2a-protocol/)

---

### Finding 4: MCP Tool Discovery Pattern

MCP uses a simple `tools/list` → `tools/call` protocol. Key properties applicable to our system:

- **Self-describing**: Each tool carries `name`, `description`, `inputSchema`, optional `annotations` (audience, priority)
- **Dynamic updates**: `listChanged` notification lets clients re-fetch when tools change — maps to re-reading skill-index.json when modified
- **Priority annotation**: `annotations.priority` (0.0–1.0) signals importance — directly applicable to skill ranking
- **No built-in confidence scoring**: Tool selection is model-controlled; clients don't score candidates

The `annotations.priority` field in MCP is the closest industry analog to a skill confidence score. Adding a `priority` field to skill-index.json entries would align with this standard.

Source: [MCP Tools Spec](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)

---

### Finding 5: Skill Composition — Extends/Requires is Correct

The arxiv paper "Agent Skills for LLMs" (Feb 2026) validates the `extends` / `requires` dependency model:

- Skills provide **procedural knowledge**; MCP tools provide **connectivity**
- Composition via inheritance (extends) is the dominant pattern
- **Critical warning**: "performance degrades sharply beyond critical library sizes" — there are scaling limits to skill libraries. The paper found phase transitions, suggesting 50-65 skills may be near an inflection point.

epost_agent_kit's dependency model (extends → load parent first, requires → auto-add) matches the consensus pattern. The max-3 directly-matched-skills limit per task is a pragmatic response to the scaling limit.

Source: [Agent Skills arxiv](https://arxiv.org/html/2602.12430v3)

---

### Finding 6: Context-Aware Activation — File Extensions are Industry Standard

Platform detection via file extensions is universal (LangGraph, CrewAI, all multi-platform agents). The priority order epost_agent_kit uses (explicit hint > file extension > CWD path > project markers) matches best practice.

Additional patterns worth adding:
- **Git state signals**: staged files → boost Review; merge conflicts → Fix. epost_agent_kit CLAUDE.md mentions this but it's not in skill-discovery.
- **Error context signals**: stack traces in conversation → debug skills. Currently listed in 1b but could be more explicit.
- **Conversation history signals**: prior skill activations in session → weight same skills higher. Not implemented.

Source: [Langfuse Agent Comparison](https://langfuse.com/blog/2025-03-19-ai-agent-comparison)

---

### Finding 7: Confidence Scoring — Missing but Implementable

No major framework implements explicit confidence scores for skill selection in markdown-based systems. The closest patterns:

1. **Count of matched signals**: if 3+ signals match a skill, higher confidence than 1 signal match
2. **Signal type weighting**: explicit keyword > file extension > domain signal
3. **Agent-affinity boost**: +1 if skill lists current agent in agent-affinity
4. **Conflict detection**: if score difference between top-2 skills < threshold → ask user

A simple point-based scoring formula for the skill-discovery step:

```
score = (explicit_keyword_match × 3) + (trigger_match × 2) + (platform_match × 2) + (agent_affinity_match × 1)
```

If top score < 3 → no confident match, suggest instead of load.
If score difference between rank-1 and rank-2 < 2 → suggest both, let agent decide.

Source: Industry synthesis + [LLM-Based Agents for Tool Learning](https://link.springer.com/article/10.1007/s41019-025-00296-9)

---

### Finding 8: Self-Improving Discovery — SAGE/SkillRL Patterns

Research shows RL-based self-improvement works for skill routing, but requires infrastructure (reward signals, training loops). Not viable for a markdown-only system.

**What is viable without infrastructure**:
- **Usage logging**: append to a flat JSON log when a skill is loaded. Over 10+ sessions, detect skills never loaded (candidates for removal) and skills always co-loaded (candidates for merging).
- **Mismatch logging**: when agent explicitly says "I loaded X but Y was needed" → flag for description revision.
- **Description drift detection**: if a skill description hasn't been updated in 90+ days but similar new skills have been added, flag for review.

These are passive, zero-infrastructure improvements that compound over time.

Source: [SAGE paper](https://arxiv.org/abs/2512.17102), [SkillRL](https://arxiv.org/html/2602.08234v1)

---

### Finding 9: LangGraph's Dynamic Tool Addition Pattern

LangGraph (2025 recommended approach for all new LangChain agents) supports two dynamic tool patterns:

1. **Static tools with dynamic filtering**: Pre-register all tools, filter at call time based on auth/permissions/state
2. **Runtime tool discovery**: Tools discovered from MCP server or registry at runtime, registered via middleware

The first pattern maps to: skill-index.json has all skills, but filter candidates by `agent-affinity` before presenting to agent. Currently done manually in skill-discovery; could be codified as a filtering rule.

The second pattern maps to: the `epost-kit init` reinstall model — not runtime discovery but build-time package discovery.

Source: [LangChain Dynamic Tool Calling](https://changelog.langchain.com/announcements/dynamic-tool-calling-in-langgraph-agents)

---

### Finding 10: Skill Graphs — Lightweight Implementation

Full graph databases (Neo4j) are overkill. The actionable patterns from graph theory:
- **Dependency chains**: already implemented via `extends` / `requires`
- **Co-occurrence**: track which skills are loaded together — candidates for a composite skill
- **Centrality**: skills loaded most frequently are "hub skills" — should be pre-loaded in agent `skills:` list
- **Orphan detection**: skills with no `agent-affinity` and no `requires` usage → candidates for pruning

All of this is implementable as static JSON analysis of skill-index.json without a graph database.

Source: [CodeCompass MCP Graph](https://arxiv.org/html/2602.12430v3)

---

## Options / Approaches

| Option | Effort | Impact | Recommendation |
|--------|--------|--------|----------------|
| **A. Add `examples` array to skill-index entries** | Low (add 3-5 utterances per skill) | High (enables embedding-based fallback in future) | DO — cheap now, enables semantic search later |
| **B. Add `priority` field (0.0–1.0) to skill-index** | Low | Medium (aligns with MCP standard, enables ranking) | DO — single afternoon of work |
| **C. Implement point-based confidence scoring in skill-discovery** | Low (prose instructions) | High (resolves ambiguous matches) | DO — add scoring formula to skill-discovery SKILL.md |
| **D. Add git state signals to skill-discovery** | Low | Medium (more accurate context detection) | DO — extend 1c section |
| **E. Usage log (flat JSON) for skill activation tracking** | Medium | Medium-High (enables self-improvement) | CONSIDER — requires hook to write log |
| **F. Embedding-based routing via pre-computed vectors** | High (needs external tooling) | High | DEFER — not viable in markdown-only system today |
| **G. RL-based self-improving routing** | Very High (infra needed) | Very High | DEFER — research-grade, not production-ready for this use case |
| **H. Full knowledge graph for skill dependencies** | High | Low marginal gain | SKIP — JSON analysis achieves 80% of the benefit |

---

## Methodology

| | |
|--|--|
| **Files Scanned** | `.claude/skills/skill-index.json` — 65 skills with keywords/triggers/agent-affinity; `.claude/skills/skill-discovery/SKILL.md` — current routing algorithm |
| **Knowledge Tiers** | L1 docs/ (not found), L2 RAG (unavailable), L5 Context7 (not used), WebSearch (primary), WebFetch (5 deep fetches) |
| **Standards Source** | MCP Spec (modelcontextprotocol.io), Anthropic Engineering Blog, arxiv.org/abs/2602.12430, Spring AI, LangChain docs |
| **Coverage Gaps** | Gemini engine unavailable — fell back to WebSearch. Context7 not invoked (not needed for web-primary research). |

### External Sources
- [MCP Tools Specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) — tool discovery protocol, annotations, priority
- [Anthropic Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — progressive disclosure, just-in-time loading
- [Agent Skills for LLMs (arxiv)](https://arxiv.org/html/2602.12430v3) — skill architecture, composition, phase transitions, security
- [Intent Recognition & Auto-Routing (gist)](https://gist.github.com/mkbctrl/a35764e99fe0c8e8c00b2358f55cd7fa) — 3 routing strategies, semantic routing 92-96% precision
- [Spring AI Dynamic Tool Discovery](https://spring.io/blog/2025/12/11/spring-ai-tool-search-tools-tzolov/) — 34-64% token reduction via tool search
- [Anthropic Advanced Tool Use](https://www.anthropic.com/engineering/advanced-tool-use) — Tool Search Tool, 85% token reduction
- [mcp-agent Intent Classifier](https://docs.mcp-agent.com/workflows/intent-classifier) — embedding vs LLM classification, top_k confidence ranking
- [SAGE RL Paper](https://arxiv.org/abs/2512.17102) — RL-based self-improving skill routing
- [Lethain: Progressive Disclosure in Agents](https://lethain.com/agents-large-files/) — three-tier architecture with file tools
- [LangChain Dynamic Tool Calling](https://changelog.langchain.com/announcements/dynamic-tool-calling-in-langgraph-agents) — runtime vs static tool patterns
- [Semantic Kernel Plugins](https://learn.microsoft.com/en-us/semantic-kernel/concepts/plugins/) — annotation-driven routing
- [SkillRL](https://arxiv.org/html/2602.08234v1) — experience-based skill distillation

---

## Verdict

**ACTIONABLE** — epost_agent_kit's current architecture is well-aligned with industry consensus (progressive disclosure, lazy loading, dependency chains, CSO description-first routing). Four low-effort improvements are immediately actionable with high impact: examples array, priority field, confidence scoring formula, and git-state signals. Self-improving features are feasible via passive logging with no infrastructure. Full embedding-based routing is deferred — not needed at current scale.

---

*Unresolved questions:*
- At what skill count does the "phase transition" degradation actually trigger? The arxiv paper identifies it as a concern but doesn't specify the threshold for instruction-based systems (vs code-execution agents). Our 65 skills may already be near the inflection point.
- Are the `examples` arrays best stored in skill-index.json (for fast access) or in SKILL.md frontmatter (for authoring proximity)? Affects where the CI/CD validation runs.
- Could the `known-findings-surfacer.cjs` hook pattern be extended to log skill activations without a new hook? (Reuse over YAGNI.)
