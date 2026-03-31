---
phase: 4
title: "Git Manager consistent routing"
effort: 1h
depends: [1]
---

# Phase 4: Git Manager Consistent Routing

## Context Links
- [Plan](./plan.md)
- `packages/core/CLAUDE.snippet.md:33` — Git row in Intent Map
- `packages/core/agents/epost-git-manager.md` — agent definition
- `packages/core/skills/git/SKILL.md` — git skill (context: fork, agent: epost-git-manager)

## Overview
- Priority: P2
- Status: Pending
- Effort: 1h
- Description: Ensure "commit", "push", "commit and push", "ship it", "done", "create a PR" ALWAYS route to epost-git-manager via Agent tool. Currently main context sometimes handles git operations inline.

## Requirements
### Functional
- Add explicit "never inline" rule for git operations in CLAUDE.snippet.md
- Add "done" and "ship it" as top-level git signal words (currently only in table example)
- Add compound git intent: "commit and push" -> single git dispatch with `--push` flag

### Non-Functional
- Changes are < 10 lines in CLAUDE.snippet.md

## Related Code Files
### Files to Modify
- `packages/core/CLAUDE.snippet.md` — routing rules section
  - Add to Routing Rules: "Git operations (commit, push, PR) → ALWAYS delegate to epost-git-manager. Never handle inline."
  - Add to Fuzzy matching: "Completion verbs (done, ship, deploy, merge) → Git"
  - Add compound intent example: "commit and push" → dispatch git with --push

### Files to Create
- None

### Files to Delete
- None

## Implementation Steps
1. **Add to Routing Rules section** (after rule 6):
   ```
   7. Git operations (commit, push, PR, done, ship) → ALWAYS delegate to epost-git-manager via Agent tool. Never handle inline.
   ```
2. **Add to Fuzzy matching**:
   ```
   - Completion verbs (done, ship, finished, ready, merge) → Git
   ```
3. **Add compound intent note**:
   ```
   - "commit and push" → dispatch epost-git-manager with --push (single agent call, not two)
   ```

## Todo List
- [ ] Add mandatory git delegation rule
- [ ] Add completion verbs to fuzzy matching
- [ ] Add compound git intent handling
- [ ] Verify no duplicate rules with Phase 1 changes

## Success Criteria
- "commit and push" dispatches to epost-git-manager (not handled inline)
- "done" and "ship it" route to git manager
- No git operation ever runs in main context

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Overlaps with Phase 1 routing changes | Low | Phase 1 dep ensures coordination |

## Security Considerations
- None identified

## Next Steps
- None (standalone improvement)
