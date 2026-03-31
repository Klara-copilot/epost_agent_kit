---
phase: 3
title: "Review CLI Command"
effort: 2h
depends: [1, 2]
---

# Phase 3: Review CLI Command

## Context Links
- [Plan](./plan.md)
- [Phase 2 — Proposal Generator](./phase-2-proposal-generator.md)
- CLI repo: `/Users/than/Projects/epost-agent-kit-cli/`
- Existing CLI patterns: `src/commands/` (cac framework)

## Overview
- Priority: P2
- Status: Pending
- Effort: 2h
- Description: CLI command `epost-kit proposals` that lists, approves, and rejects skill update proposals.

## Requirements

### Functional
- `epost-kit proposals` — list all pending proposals with summary table
- `epost-kit proposals --show {id}` — show full proposal with diff
- `epost-kit proposals --approve {id}` — apply proposed diff to packages/ source skill, mark approved
- `epost-kit proposals --reject {id}` — mark rejected with optional reason
- `epost-kit proposals --stats` — show signal/proposal counts by skill

### Non-Functional
- Follows existing CLI patterns (cac framework, domain structure)
- Approval writes to `packages/` (source of truth), then reminds to run `epost-kit init`
- Rejection is non-destructive (proposal stays in docs/proposals/ with status: rejected)

## Related Code Files

### Files to Create
- `src/commands/proposals.ts` — CLI command in epost-agent-kit-cli repo
- `src/domains/proposals/list.ts` — List + filter proposals
- `src/domains/proposals/apply.ts` — Apply approved proposal to packages/ skill
- `src/domains/proposals/types.ts` — Proposal schema types

### Files to Modify
- `src/commands/index.ts` — Register proposals command
- `docs/proposals/signals.json` — Updated on approve/reject

### Files to Delete
- None

## Implementation Steps

1. **Create domain structure**
   - `src/domains/proposals/` with list, apply, types modules
   - Types match proposal frontmatter schema from Phase 2

2. **Implement `list` subcommand**
   - Glob `docs/proposals/*.md` (exclude README, signals.json)
   - Parse frontmatter for id, targetSkill, confidence, status
   - Display table: ID | Skill | Confidence | Status | Date

3. **Implement `show` subcommand**
   - Read full proposal file
   - Syntax-highlight the diff block
   - Show signal source + rationale

4. **Implement `approve` flow**
   - Read proposal, extract targetFile and diff
   - Read current skill file from packages/
   - Apply diff (find old_string, replace with new_string)
   - Write updated skill file
   - Update proposal status to `approved` with timestamp
   - Print: "Applied to {targetFile}. Run `epost-kit init` to sync to .claude/"

5. **Implement `reject` flow**
   - Update proposal status to `rejected` with optional reason
   - No file changes to packages/

6. **Register command**
   - Add to `src/commands/index.ts`
   - Add help text describing the evolution workflow

## Todo List
- [ ] Create proposals domain with types
- [ ] Implement list subcommand
- [ ] Implement show subcommand
- [ ] Implement approve flow with diff application
- [ ] Implement reject flow
- [ ] Register command in CLI
- [ ] Test: approve a proposal, verify packages/ skill updated
- [ ] Test: reject a proposal, verify no side effects

## Success Criteria
- `epost-kit proposals` shows table of pending proposals
- `epost-kit proposals --approve prop-skill-discovery-260324` writes change to `packages/core/skills/skill-discovery/SKILL.md`
- `epost-kit proposals --reject prop-X --reason "not needed"` marks proposal rejected
- No writes to `.claude/` (only packages/)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Diff doesn't match current skill (skill was edited since proposal) | Med | Check old_string exists before applying; abort with message if mismatch |
| Proposal targets deleted skill | Low | Verify targetFile exists; reject with warning |
| User approves bad proposal | Low | Phase 1 scope — human is the gate; reversible via git |

## Security Considerations
- Approve writes to packages/ only — never to .claude/ directly
- No auto-apply — requires explicit --approve flag with proposal ID

## Next Steps
- After Phase 3: end-to-end test of full pipeline
- Future Phase 2 (out of scope): auto-generation on session end, auto-apply with rollback
