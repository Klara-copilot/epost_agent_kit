---
plan: plans/260402-0949-kit-routing-redesign
phase: 1
agent: epost-fullstack-developer
status: completed
---

## Phase Implementation Report

- Phase: phase-1-claude-md-rewrite | Plan: plans/260402-0949-kit-routing-redesign | Status: completed

### Files Modified

- `packages/core/CLAUDE.snippet.md` — full rewrite of Routing section; added Execution Model, Available Agents catalogue, Decision Authority table, Never Do list

### Tasks Completed

- Removed Intent Map table (11 rows), Prompt Classification section, fuzzy matching block, web-specific examples, Preview flags line, Less common intents line, all 12 Routing Rules
- Added weight-based execution rule (simple→inline, major→spawn) with heuristic
- Added agent capability catalogue (11 agents, declarative)
- Embedded core law-layer: Decision Authority table + Never Do list
- Kept: project identity, platform detection signals, slash command override, orchestration section

### Tests Status

No automated tests apply — markdown-only change. Verified manually.

### Completion Evidence

- Tests: N/A — no test suite for markdown files
- Build: N/A — no compilation step
- Acceptance criteria:
  - [x] No intent routing table exists
  - [x] Weight-based execution rule present (simple→inline, major→spawn)
  - [x] Agent capability catalogue present (11 agents)
  - [x] Core law-layer embedded (Decision Authority + Never Do)
  - [x] File under 120 lines — **76 lines**
- Files changed: `packages/core/CLAUDE.snippet.md`

### Issues Encountered

None.

### Next Steps

- Phase 2: skill-discovery update
- Note: `epost-kit init` deferred to end of plan (phase 4 or finalize step)

Docs impact: none (CLAUDE.snippet.md IS the doc — no downstream doc update needed)
