---
phase: 2
title: "Add knowledge-retrieval step to fast plan mode"
effort: 1h
depends: []
---

# Phase 2: Add Knowledge-Retrieval Step to Fast Plan Mode

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/plan/references/fast-mode.md`
- `packages/core/skills/knowledge-retrieval/SKILL.md`

## Overview
- Priority: P1
- Status: Done
- Description: Fast plans skip knowledge-retrieval entirely, causing plans to miss existing patterns/conventions. Add a lightweight L1+L4 search step before task analysis.

## Requirements
### Functional
- Insert new Step 2.5 between "Check Codebase Summary" (Step 2) and "Read Context" (Step 3)
- Search `docs/` index (L1) for decisions/conventions matching the task keywords
- Search `plans/` for prior plans with similar tags (Glob `plans/*/plan.md`, grep titles)
- Cap at 3 reads max (keep fast mode fast)
- Inject found context into Step 4 (Analyze Task) as "Prior Art" section

### Non-Functional
- Must not add >30 seconds to fast plan execution
- Max 3 additional file reads (hard limit)
- No external calls (L5 stays excluded in fast mode)

## Files to Modify
- `packages/core/skills/plan/references/fast-mode.md:42-49` — Insert new step between Steps 2 and 3

## Files to Create
- None

## Implementation Steps
1. **Add Step 2.5: Quick Knowledge Check**
   - After Step 2 (codebase summary), add:
   ```
   ### 2.5. Quick Knowledge Check (max 3 reads)
   1. Glob `**/docs/index.json` — if found, search for entries matching task keywords
   2. Grep `plans/*/plan.md` for similar titles/tags (max 5 results)
   3. If matches found: read up to 2 most relevant entries
   4. Inject as "Prior Art" context for Step 4

   Skip if: no docs/ index exists AND no plans/ directory
   ```

2. **Update Step 4 template** — Add "Prior Art" subsection to analysis output

3. **Update Constraints section** — Change "Max 10 file reads" to "Max 13 file reads" (10 + 3 knowledge)

## Todo List
- [x] Insert Step 2.5 in fast-mode.md
- [x] Update Step 4 to consume prior art context
- [x] Update constraints (read count)
- [ ] Test: run /plan --fast on a task with existing prior plans, verify prior art appears

## Success Criteria
- Fast plan for a topic with existing plans/docs references them in output
- Fast plan for a topic with NO existing context still completes normally
- Execution stays under fast-mode time budget

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Knowledge check slows fast mode | Med | Hard cap at 3 reads, skip if no index |
| Glob on large plans/ dir is slow | Low | Only grep titles, not full content |

## Security Considerations
- None identified
