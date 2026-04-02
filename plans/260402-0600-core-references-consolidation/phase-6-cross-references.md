---
phase: 6
title: "Update all cross-references"
effort: 15m
depends: [1,2,3,4,5]
---

# Phase 6: Update All Cross-References

Must run last — all new filenames must be settled before updating references.

## Files to Modify

- EDIT: `packages/core/skills/core/SKILL.md`
- VERIFY: all remaining 8 files in `packages/core/skills/core/references/`

## Reference Map

| Old | New |
|-----|-----|
| `decision-boundaries.md` | `agent-rules.md` |
| `environment-safety.md` | `agent-rules.md` |
| `external-tools-usage.md` | `agent-rules.md` |
| `workflow-feature-development.md` | `workflows.md` |
| `workflow-bug-fixing.md` | `workflows.md` |
| `workflow-code-review.md` | `workflows.md` |
| `workflow-architecture-review.md` | `workflows.md` |
| `workflow-project-init.md` | `workflows.md` |

## SKILL.md Changes

### Aspect Files table
- Row for `decision-boundaries.md` → update to `agent-rules.md` with description "Decision boundaries, environment safety, pre-execution rules, external tools"
- Delete row for `environment-safety.md`
- Delete row for `external-tools-usage.md`

### Team Workflows table (if present)
- Replace all 5 individual workflow rows with single row:
  `| All Workflows | references/workflows.md | Feature dev, bug fix, code review, architecture, project init |`

### Quick Reference / "Never Do" section
- Any reference to `decision-boundaries.md` → `agent-rules.md`

## Verification Scan

After all edits, grep all 8 remaining reference files for any occurrence of:
`decision-boundaries|environment-safety|external-tools-usage|workflow-feature|workflow-bug|workflow-code|workflow-arch|workflow-project`

Any found → fix before marking phase done.

## Todo

- [ ] Read SKILL.md
- [ ] Update Aspect Files table
- [ ] Update Team Workflows table
- [ ] Update any Quick Reference links
- [ ] Grep all 8 remaining files for stale refs
- [ ] Fix any found

## Success Criteria

- SKILL.md Aspect Files table references only files that exist
- No stale filename references in any remaining file
- `grep` for all 8 old filenames returns 0 results
