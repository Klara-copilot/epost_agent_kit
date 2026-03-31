---
phase: 2
title: "Wire routing in CLAUDE.md and snippet"
effort: 0.5h
depends: [1]
---

# Phase 2: Wire Routing in CLAUDE.md and Snippet

## Context Links
- [Plan](./plan.md)
- `packages/core/CLAUDE.snippet.md` — source of truth for routing (Intent Map + Routing Rules)
- `CLAUDE.md` — generated from snippet, also needs updating

## Overview
- Priority: P1
- Status: Pending
- Effort: 0.5h
- Description: Add Ideate/Brainstorm intent to routing tables so orchestrator dispatches brainstormer correctly

## Requirements

### Functional
- New Intent Map row for brainstormer
- Fuzzy matching updated with ideation verbs
- Less common intents updated to reference brainstormer for architecture decisions

### Non-Functional
- Keep existing table alignment
- Minimal diff — add rows, don't reformat

## Related Code Files

### Files to Modify
- `packages/core/CLAUDE.snippet.md` — add Intent Map row + fuzzy matching verbs
- `CLAUDE.md` — mirror same changes (both files contain routing, both are read by agents)

### Files to Read
- `packages/core/agents/epost-planner.md:24` — verify brainstormer is listed as routing source

### Files to Delete
- None

## Implementation Steps

1. **Add Intent Map row to `packages/core/CLAUDE.snippet.md`**
   Insert AFTER the "Plan / Design" row, BEFORE the "Research" row:
   ```markdown
   | Ideate / Brainstorm | "brainstorm", "should we", "help me think", "which approach", "compare options", "architecture decision" | `epost-brainstormer` via Agent tool |
   ```

2. **Update Fuzzy matching in `packages/core/CLAUDE.snippet.md`**
   Add new verb category after "Question verbs" line:
   ```markdown
   - Ideation verbs (brainstorm, debate, explore, weigh, consider, what if) → Ideate/Brainstorm
   ```

3. **Update Less common intents in `packages/core/CLAUDE.snippet.md`**
   Add brainstormer reference:
   ```markdown
   **Less common intents**: scaffold → `/bootstrap`, convert → `/convert`, design/UI → `epost-muji`, architecture debate → `epost-brainstormer`
   ```

4. **Mirror changes to `CLAUDE.md`**
   Apply identical edits to the root `CLAUDE.md` Intent Map, Fuzzy matching, and Less common intents sections

5. **Verify epost-planner nav header**
   Confirm `packages/core/agents/epost-planner.md` line ~24 already has:
   ```
   | Ideation complete | epost-brainstormer | Formalize ideas into plan |
   ```
   (Verified in planning phase — already present, no changes needed)

## Todo List
- [ ] Add Intent Map row to `packages/core/CLAUDE.snippet.md`
- [ ] Add ideation verbs to fuzzy matching in snippet
- [ ] Update "Less common intents" line in snippet
- [ ] Mirror all 3 changes to root `CLAUDE.md`
- [ ] Verify planner nav header (read-only check)

## Success Criteria
- `grep "Ideate" packages/core/CLAUDE.snippet.md` returns the new row
- `grep "Ideate" CLAUDE.md` returns the new row
- `grep "brainstorm" packages/core/CLAUDE.snippet.md` returns fuzzy matching line
- Planner agent already lists brainstormer as routing source (no edit needed)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Editing wrong CLAUDE.md | High | Edit `packages/core/CLAUDE.snippet.md` first (source of truth), then mirror to root |
| Table alignment breaks | Low | Use exact same column widths as existing rows |
| Overlap with Plan/Design intent | Med | Brainstormer = pre-decision exploration; Plan = post-decision implementation plan. Fuzzy matching disambiguates. |

## Security Considerations
- None identified — routing configuration only

## Next Steps
- Run `epost-kit init` to regenerate `.claude/agents/epost-brainstormer.md` from `packages/core/agents/`
- Verify agent appears in skill-index and settings
