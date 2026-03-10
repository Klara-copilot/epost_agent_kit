---
updated: 2026-03-09
id: 260308-1540-rag-direct-hybrid-sequential
title: "Fix RAG direct invocation + reorder hybrid audit to sequential"
status: archived
effort: 1.5h
phases: 2
source-plan: /Users/than/Projects/luz_next/plans/260308-1527-fix-rag-reorder-hybrid-audit
---

# Fix RAG Direct Invocation + Reorder Hybrid Audit

## Context

Translated from luz_next plan `260308-1527-fix-rag-reorder-hybrid-audit`. Two bugs in the audit pipeline — both originate in the kit's agent/skill definitions.

## Bug 1: RAG silently fails (subagent can't spawn subagent)

Muji is spawned as a subagent via Task tool. The current instruction says "delegate RAG search to `epost-mcp-manager`" (Template E). But subagents cannot spawn further subagents — the Task tool call silently fails. Result: RAG is **never queried**; muji always falls through to Glob fallback.

**Fix (Option B)**: Each agent calls RAG MCP tools directly via `ToolSearch`. No mcp-manager hop for RAG. mcp-manager stays for non-RAG MCP tasks only.

```
BEFORE: muji → (Task tool) → epost-mcp-manager → RAG   ← SILENT FAIL
AFTER:  muji → ToolSearch("web-rag") → MCP tools directly
```

## Bug 2: Hybrid audit runs parallel — code-reviewer can't see muji's findings

Hybrid mode currently dispatches muji and code-reviewer at the same time. Code-reviewer has no access to muji's findings, causing:
- Duplicate findings (same file:line flagged twice)
- Code-reviewer can't cross-reference muji's component catalog
- No verdict hierarchy enforcement

**Fix**: Sequential — muji first, code-reviewer reads muji report, then runs SEC/PERF/TS with dedup.

## Touch Points in `packages/`

### Phase 1 — RAG direct invocation

| File | Change |
|------|--------|
| `core/skills/audit/references/ui.md` | Step 1: replace `epost-mcp-manager` delegation with direct `ToolSearch("web-rag")` + MCP call sequence |
| `design-system/agents/epost-muji.md` | Docs & MCP section: restrict mcp-manager to non-RAG; add direct ToolSearch instruction |
| `core/agents/epost-code-reviewer.md` | Add: in hybrid pass, call RAG directly via ToolSearch before running SEC/PERF/TS |
| `core/skills/code-review/SKILL.md` | Add: code-reviewer RAG call step in Dispatch Protocol (hybrid pass) |
| `core/skills/audit/references/delegation-templates.md` | Template E: add "non-RAG only" scope note |

### Phase 2 — Sequential hybrid audit

| File | Change |
|------|--------|
| `core/agents/epost-code-reviewer.md` | Delegation Rules: "in parallel" → sequential with explicit step order |
| `core/skills/code-review/SKILL.md` | Dispatch Protocol: add 8-step sequential hybrid protocol with dedup + verdict hierarchy |
| `core/skills/audit/references/delegation-templates.md` | Template A+: add report path convention + component catalog output requirement |
| `core/skills/core/references/workflow-code-review.md` | Add hybrid mode note for klara-theme feature modules |

## Execution

Sequential. Phase 1 must complete first (code-reviewer RAG call is a prerequisite for Phase 2's sequential flow).

## Phases

| # | Title | Effort | File |
|---|-------|--------|------|
| 1 | RAG direct invocation | 45m | [phase-1](./phase-1-rag-direct.md) |
| 2 | Sequential hybrid audit | 45m | [phase-2](./phase-2-hybrid-sequential.md) |

## Success Criteria

- [x] Muji calls `ToolSearch("web-rag")` directly — no mcp-manager Task tool for RAG
- [x] Code-reviewer calls `ToolSearch("web-rag")` directly in hybrid pass
- [x] Template E explicitly scoped to non-RAG MCP queries only
- [x] Hybrid audit: muji runs first → code-reviewer reads muji report → dedup → merge
- [x] Verdict hierarchy enforced: REDESIGN > FIX-AND-RESUBMIT > APPROVE
- [x] Fallback (Glob/Grep) preserved when RAG server offline
