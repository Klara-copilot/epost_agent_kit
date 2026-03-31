---
phase: 1
title: "Smart Routing reliability for web workflows"
effort: 2h
depends: []
---

# Phase 1: Smart Routing Reliability for Web Workflows

## Context Links
- [Plan](./plan.md)
- `packages/core/CLAUDE.snippet.md` — routing source of truth
- `plans/260309-1306-claude-md-natural-routing/plan.md` — related active plan

## Overview
- Priority: P1
- Status: Pending
- Effort: 2h
- Description: Harden routing so web-specific natural prompts always reach the right agent. Reduce misrouting edge cases where main context handles tasks instead of delegating.

## Requirements
### Functional
- Add web-specific routing examples to fuzzy matching section
- Add "compound intent" handling (e.g., "fix the styling and add a test" = Fix + Test)
- Add explicit "never handle inline" list for intents that MUST delegate
- Strengthen context boost rules for `.tsx`/`.ts`/`.scss` files

### Non-Functional
- CLAUDE.snippet.md stays under 150 lines
- No breaking changes to existing slash commands

## Related Code Files
### Files to Modify
- `packages/core/CLAUDE.snippet.md` — routing section rewrite
  - Expand fuzzy matching with web examples: "style is wrong" -> Fix, "add a component" -> Build, "slow page load" -> Debug
  - Add mandatory delegation list: Build, Fix, Test, Git MUST always use Agent tool
  - Add "Web Context Boost": `.tsx`/`.ts`/`.scss` in diff -> auto-detect web platform and load web skills

### Files to Create
- None (PLAN-0067 covers structural rewrite; this phase adds web-specific patterns only)

### Files to Delete
- None

## Implementation Steps
1. **Check PLAN-0067 status** — if completed, build on its rewrite. If not, layer web patterns onto current snippet.
2. **Add web-specific fuzzy examples** to Intent Map:
   - "this component doesn't render" -> Fix
   - "add dark mode" -> Build
   - "page is slow" -> Debug
   - "update the API endpoint" -> Build
   - "check the bundle size" -> Review
3. **Add mandatory delegation rule**: "For Build, Fix, Test, and Git intents: ALWAYS dispatch via Agent tool. Never execute inline in main context."
4. **Add web context boost**: "If `git diff --name-only` shows `.tsx`/`.ts`/`.scss`/`.css` files: auto-set platform=web, load web-frontend skill."
5. **Validate**: Test 10 natural web prompts mentally against the updated routing table.

## Todo List
- [ ] Check PLAN-0067 status
- [ ] Add web-specific fuzzy matching examples
- [ ] Add mandatory delegation rule
- [ ] Add web context boost rule
- [ ] Verify snippet stays under 150 lines

## Success Criteria
- 10 natural web prompts ("make login faster", "this page is broken", "add a toast notification", "the CSS is off", "deploy to staging") all route to correct agent without clarification

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Conflict with PLAN-0067 | Med | Check plan status first; coordinate changes |
| Over-specification bloats CLAUDE.md | Med | Keep additions to 10-15 lines max |

## Security Considerations
- None identified

## Next Steps
- Coordinate with PLAN-0067 before implementation
