---
type: brainstorm
agent: epost-brainstormer
title: "Understand-Anything Adoption Approaches for epost_agent_kit"
date: 2026-04-03
verdict: OPTIONS_PRESENTED
---

# Understand-Anything Adoption for epost_agent_kit

## Problem Statement

Understand-Anything (UA) provides a 6-agent pipeline that builds interactive knowledge graphs from codebases — 16 node types, 29 edge types, pedagogical tours, and React Flow visualization. epost_agent_kit already has onboarding (`/get-started`), debugging (`/debug`), planning (`/plan`), and domain skills (`domain-b2b`, `domain-b2c`). The question: what adoption depth maximizes value without creating maintenance burden or architectural debt?

## Constraint Analysis

| Constraint | Impact |
|-----------|--------|
| Subagent spawn limit | UA's 6-agent pipeline cannot chain — must be orchestrated from main context |
| `packages/` is source of truth | Any integration must live in `packages/`, not `.claude/` |
| Skill system is passive knowledge | UA agents are active pipeline — architectural mismatch |
| 11 existing agents | Adding 6 more = 17 total. Context budget concern (~15x per agent spawn) |
| Token budget (80% of perf variance) | Graph-aware prompts could bloat context significantly |
| YAGNI/KISS/DRY | Must justify every piece adopted vs. what we already have |

---

## Approach A: Patterns-Only Adoption (Recommended)

**What**: Extract UA's best architectural ideas and apply them to existing epost skills. No new agents. No new dependencies. No knowledge graph runtime.

### Changes to epost_agent_kit

| Change | Where | Effort |
|--------|-------|--------|
| Add AST-aware file analysis to `/get-started` | `packages/core/skills/get-started/` | Medium |
| Add dependency-edge extraction to `/debug` | `packages/core/skills/debug/references/` | Low |
| Add layer detection (presentation/business/data) to `/plan` | `packages/core/skills/plan/references/` | Low |
| Add incremental file fingerprinting to `/audit` | `packages/core/skills/audit/references/` | Medium |
| Extend `domain-b2b`/`domain-b2c` with automated domain boundary detection heuristics | `packages/domains/skills/` | Low |

### Specific patterns worth stealing

1. **Two-phase extraction** (deterministic structure + semantic annotation) — apply to `/get-started` onboarding. Currently `/get-started` does a flat scan (glob for markers, count docs). Instead: Phase 1 = AST parse entry points, extract imports/exports graph. Phase 2 = LLM annotates purpose per module. Result: onboarding that explains "module X depends on Y because Z" not just "module X exists."

2. **Intermediate artifact persistence** — UA agents write JSON to disk, not context. Apply to `/debug` and `/plan`: when epost-debugger traces a call chain, persist the trace graph to `reports/traces/` so epost-planner can consume it without re-tracing. Currently each agent rediscovers independently.

3. **Fan-in pedagogical ordering** — UA builds tours by BFS + fan-in (visit dependencies before dependents). Apply to `/get-started`: instead of listing files alphabetically, order explanation by dependency depth. Teach foundational modules first.

4. **File fingerprinting for incremental work** — UA fingerprints files to skip unchanged analysis. Apply to `/audit` and `/test`: track file hashes in `.epost-cache/fingerprints.json`, skip re-auditing unchanged files.

### Pros/Cons

| Pros | Cons |
|------|------|
| Zero new dependencies | No interactive graph visualization |
| No new agents (stays at 11) | Manual effort to implement each pattern |
| No token cost increase | Lose UA's pre-built pipeline orchestration |
| KISS-compliant | Piecemeal — might miss synergies between patterns |
| Can adopt incrementally | No unified "knowledge graph" artifact |
| Maintains `packages/` architecture | Less impressive demo |

### Token cost delta: ~0% (patterns are reference docs, not runtime)

---

## Approach B: Graph-as-Artifact Integration

**What**: Run UA's pipeline externally (separate install), consume its `.understand-anything/knowledge-graph.json` as a read-only artifact in epost agents. UA runs independently; epost reads the output.

### Changes to epost_agent_kit

| Change | Where | Effort |
|--------|-------|--------|
| New `knowledge-graph` skill (read/query graph JSON) | `packages/core/skills/knowledge-graph/` | Medium |
| Graph-aware context injection for epost-planner | `packages/core/skills/plan/references/graph-context.md` | Medium |
| Graph-aware edge traversal for epost-debugger | `packages/core/skills/debug/references/graph-traversal.md` | Medium |
| `/understand-chat` equivalent as epost skill | `packages/core/skills/graph-chat/` | High |
| Hook: pre-commit triggers UA incremental update | `packages/core/hooks/` | Medium |
| Update `/get-started` to consume tours from graph | `packages/core/skills/get-started/` | Low |

### How agents use the graph

| Agent | Graph usage | Value |
|-------|------------|-------|
| epost-planner | Read architectural layers to scope phases; detect which modules a change touches | High — phase scoping becomes data-driven instead of LLM-guessed |
| epost-debugger | Traverse edges to find call chains, data flows, error propagation paths | High — "what depends on this?" answered from graph, not grep |
| epost-code-reviewer | Check if changed files have graph edges to security-sensitive nodes | Medium — automated blast radius assessment |
| epost-fullstack-developer | Query graph for existing patterns before implementing new code | Medium — reduces "reinventing the wheel" |
| epost-docs-manager | Use domain clusters to organize documentation | Low — domain-b2b/b2c already cover this |

### Graph vs. existing domain skills

`domain-b2b` and `domain-b2c` are **manually authored** skill files listing module names, API patterns, and domain terminology. UA's `/understand-domain` **auto-extracts** domain boundaries from code structure. They complement each other:

- Manual skills = business intent, product context, team vocabulary (cannot be auto-extracted)
- UA domains = structural boundaries, dependency clusters, coupling metrics (tedious to maintain manually)

Recommendation: keep manual domain skills for business context, use graph for structural boundaries. Do NOT merge them.

### Tour vs. /get-started

UA tours are **topologically ordered** code walkthroughs generated from graph BFS. `/get-started` is a **documentation audit + project state discovery** tool. They solve different problems:

- `/get-started` answers: "what state is this project in? what docs exist? what's the tech stack?"
- UA tours answer: "how do these modules relate? what should I understand first?"

Recommendation: `/get-started` Step 2a (has KB) could consume UA tours as an optional enhancement. Not a replacement.

### Pros/Cons

| Pros | Cons |
|------|------|
| Full graph power without forking UA codebase | External dependency — UA must be installed + maintained separately |
| Agents get data-driven context | Graph JSON can be large (MBs for big repos) — token cost of injecting subgraphs |
| Incremental updates via fingerprinting | Pre-commit hook adds latency |
| Clear separation of concerns (UA builds, epost consumes) | Graph schema coupling — UA schema changes break epost skills |
| Can start with 1-2 agents, expand | Two systems to keep in sync |

### Token cost delta: +10-25% per agent invocation (subgraph injection)

### Risk: graph staleness

If UA isn't re-run after changes, graph diverges from code. Mitigation: fingerprint-based hook, but this means every commit triggers UA pipeline (expensive). Alternative: nightly cron + on-demand `/understand` before planning sessions.

---

## Approach C: Full Native Integration

**What**: Port UA's 6 agents and 7 skills into epost_agent_kit as a new `understand` package. Run the pipeline natively within the kit.

### Changes to epost_agent_kit

| Change | Where | Effort |
|--------|-------|--------|
| New `packages/understand/` package | `packages/understand/` | Very High |
| 6 new agents (project-scanner, file-analyzer, architecture-analyzer, tour-builder, graph-reviewer, domain-analyzer) | `packages/understand/agents/` | Very High |
| 7 new skills | `packages/understand/skills/` | High |
| web-tree-sitter + Fuse.js dependencies | `packages/understand/` | Medium |
| React Flow dashboard skill | `packages/understand/skills/dashboard/` | High |
| Update orchestration protocol for 17 agents | `packages/core/rules/orchestration-protocol.md` | Medium |
| New package.yaml + init integration | `packages/understand/package.yaml` | Medium |

### Architecture problems

1. **Subagent spawn constraint**: UA's 6-agent pipeline is sequential (scanner → analyzer → ... → domain). In epost, subagents cannot spawn subagents. The main context must orchestrate all 6 — that's 6 sequential Agent tool calls for a single `/understand` invocation. Each at ~15x token cost = ~90x token baseline for one graph build.

2. **Agent count bloat**: 11 → 17 agents. More agents = more routing ambiguity, more skill-index entries, more maintenance surface. Every agent needs evals, frontmatter, skill bindings.

3. **Dependency introduction**: web-tree-sitter (WASM binary), Fuse.js (JS library), React 19 + @xyflow/react (for dashboard). epost_agent_kit currently has ZERO runtime JS dependencies — it's pure markdown/YAML config. Adding a JS runtime changes the project's nature fundamentally.

4. **Dashboard scope creep**: React Flow visualization is a separate web app. Hosting, building, serving — none of this exists in epost_agent_kit today. This alone is a project.

### Pros/Cons

| Pros | Cons |
|------|------|
| Full control over pipeline | 6 new agents, 7 new skills — massive maintenance surface |
| No external dependency | 90x token cost per full graph build |
| Can customize graph schema for ePost domains | web-tree-sitter + React deps change project nature |
| Dashboard integrated | Dashboard = separate web app to maintain |
| Single `epost-kit init` installs everything | YAGNI violation — building what we might not need |
| Impressive capability story | 2-4 weeks of implementation effort |

### Token cost delta: +90x per full graph build, +10-25% per graph-aware agent query

---

## Comparison Matrix

| Dimension | A: Patterns-Only | B: Graph-as-Artifact | C: Full Native |
|-----------|------------------|---------------------|----------------|
| **Implementation effort** | 1-2 days | 1-2 weeks | 2-4 weeks |
| **New agents** | 0 | 0 | 6 |
| **New skills** | 0 (enhance existing) | 2-3 | 7 |
| **New dependencies** | 0 | UA external install | web-tree-sitter, Fuse.js, React, xyflow |
| **Token cost increase** | ~0% | +10-25% per query | +90x build, +10-25% query |
| **Maintenance burden** | Low (reference docs) | Medium (schema coupling) | Very High (6 agents + deps) |
| **Graph visualization** | No | No (unless UA dashboard used separately) | Yes |
| **Incremental value** | High (each pattern standalone) | Medium (need graph built first) | Low (all-or-nothing) |
| **Reversibility** | Trivially reversible | Remove skill + hook | Major rip-out |
| **KISS compliance** | High | Medium | Low |
| **YAGNI compliance** | High | Medium | Low |

---

## Recommendation: Approach A (Patterns-Only) with Option to Graduate to B

**Start with A**. Extract the four highest-value patterns:
1. Two-phase extraction for `/get-started`
2. Intermediate artifact persistence for cross-agent context sharing
3. Fan-in ordering for onboarding tours
4. File fingerprinting for incremental audit/test

**Graduate to B if**: (a) team finds themselves manually running UA anyway, AND (b) 3+ agents would benefit from graph queries in daily use. At that point, formalize the consumption path.

**Never do C unless**: epost_agent_kit pivots to being a codebase-understanding product rather than a dev toolkit. The maintenance cost of 6 agents + JS runtime dependencies is not justified for internal tooling.

### Second-order effects

- **A → better onboarding without new infra**. Risk: patterns implemented superficially (just reference docs nobody reads). Mitigation: implement as actual logic in skill steps, not just "guidelines."
- **B → graph dependency creates coupling**. If UA project dies or pivots, epost skills break. Mitigation: graph schema adapter layer.
- **C → team splits focus**. Maintaining UA pipeline inside epost_agent_kit diverts from actual development work (web/iOS/Android/backend features). The kit is a means, not an end.

### Simplest viable option

Approach A. Zero new dependencies, zero new agents, zero token cost increase. Pure knowledge transfer.

---

## Unresolved Questions

1. **Has anyone on the team actually used Understand-Anything?** If not, patterns adoption (A) should start with a trial run of UA on one epost repo to validate which patterns actually produce useful output.

2. **How large is the knowledge graph for a typical epost repo?** If graph JSON is <100KB, injecting subgraphs (Approach B) is cheap. If MBs, need a query layer.

3. **Is web-tree-sitter needed for ePost repos?** ePost is Java backend + TypeScript frontend. Tree-sitter parsing adds value for complex ASTs, but `grep` + `Glob` may be sufficient for the structural extraction patterns in Approach A.

4. **Dashboard audience**: Who would use the React Flow visualization? Developers? PMs? If only devs, terminal-based graph queries (Approach B) may suffice. If PMs need it, dashboard becomes higher priority.

5. **UA's multi-platform deployment (Cursor, Copilot, Gemini)**: Does ePost team use these IDEs? If yes, UA's cross-IDE support is a differentiator that Approach A cannot replicate.

6. **Automated domain extraction accuracy**: How well does UA's `/understand-domain` identify ePost's B2B modules (Inbox, Monitoring, Smart Send) from code structure alone? Worth a spike before committing to any domain integration.
