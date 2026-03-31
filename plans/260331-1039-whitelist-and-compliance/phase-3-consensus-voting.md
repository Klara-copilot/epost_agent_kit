---
phase: 3
title: "Document Consensus-Voting Pattern"
effort: 20m
depends: []
---

# Phase 3: Document Consensus-Voting Pattern

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/subagent-driven-development/SKILL.md`
- `packages/core/skills/subagent-driven-development/references/`

## Overview
- Priority: P2
- Status: Pending
- Effort: 20m
- Description: Create a reference document for the consensus-voting pattern — multiple agents independently analyze a problem, then vote/compare outputs before deciding. For high-stakes decisions (architecture, security, data model changes).

## Requirements

### Functional
- Document the pattern: when to use, how to orchestrate, how to aggregate votes
- Include concrete example (e.g., architecture decision with 2-3 agents)
- Define vote aggregation rules (majority, unanimous, weighted)
- Note limitations (token cost, diminishing returns)

### Non-Functional
- Under 80 lines
- Follows existing reference doc style in SDD references/

## Related Code Files

### Files to Modify
- None

### Files to Create
- `packages/core/skills/subagent-driven-development/references/consensus-voting.md`

### Files to Delete
- None

## Implementation Steps

1. **Create consensus-voting.md** with:
   - When to use (high-stakes: architecture, security, data model)
   - When NOT to use (routine tasks, single-correct-answer problems)
   - Pattern: dispatch N agents with same problem, independent analysis
   - Aggregation: majority vote for binary decisions, weighted merge for nuanced
   - Example: 2 researchers evaluate library choice, orchestrator compares
   - Cost note: ~Nx token cost, only justified for irreversible decisions

## Todo List
- [ ] Create consensus-voting.md
- [ ] Verify it integrates with SDD skill references

## Success Criteria
- File exists at expected path
- Contains: when-to-use, pattern description, aggregation rules, example, cost warning

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Pattern too theoretical without real usage | Low | Include concrete example from kit experience |

## Security Considerations
- None identified

## Next Steps
- Reference from SDD SKILL.md body if desired (optional)
