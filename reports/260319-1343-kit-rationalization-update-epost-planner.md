# Plan Update: Kit Rationalization — Native Delegation Integration

**Date**: 2026-03-19
**Agent**: epost-planner
**Plan**: plans/260319-0538-kit-rationalization/
**Status**: READY

---

## Executive Summary

Updated existing kit rationalization plan to incorporate findings from 3 research reports. Added Phase 5 (Native Delegation Wiring), resolved all 3 open questions, and clarified agent deletion rationale with native primitive mappings.

## Changes Made

### Phase 1 (Delete Redundant Agents) — Updated
- Clarified epost-mcp-manager deletion rationale (native MCP in all 3 platforms)
- Updated epost-journal-writer rationale (superseded by `journal` skill, not just MEMORY.md)
- Updated epost-brainstormer rationale (maps to `general-purpose` + sequential-thinking)

### Phase 5 (Native Delegation Wiring) — NEW
- 4 agents (planner, debugger, code-reviewer, researcher) get Explore subagent instructions
- Documents wrapper pattern: `Custom Agent = Native Primitive + Domain Skills + epost Format`
- Defers Plan/general-purpose subagent usage until Q2-Q3 2026

### Resolved Questions
1. epost-project-manager → **slim** (keep routing, cut tutorial)
2. web-prototype/web-rag → **keep** (consolidate into web-frontend/references/)
3. PLAN-0041 → **no overlap** (folder structure vs content rationalization)

## Plan Details

| # | Phase | Effort | Status |
|---|-------|--------|--------|
| 1 | Delete Redundant Agents | 2h | pending |
| 2 | Consolidate Agent Responsibilities | 4h | pending |
| 3 | Prune Analysis/Reasoning Skills | 4h | pending |
| 4 | Hook Cleanup | 2h | pending |
| 5 | Native Delegation Wiring | 2h | pending |

**Total effort**: 14h (was 12h)
**Total phases**: 5 (was 4)

## Verdict

`READY` — All questions resolved, research integrated. Plan activated.

## Unresolved Questions

None remaining.
