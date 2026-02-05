# Phase 0: Dependencies & Audit

## Context Links
- Parent: [plan.md](plan.md)
- Research: [Cross-Platform Formats](research/researcher-01-cross-platform-formats.md)

## Overview
- **Priority**: P1 (blocker for all subsequent phases)
- **Status**: pending
- **Effort**: 1h
- **Description**: Audit current assets, map dependencies between agents/skills/commands, identify dead references and conflicts before restructuring.

## Key Insights
- 11 agents exist but `ios-developer` agent referenced in `ios/cook.md` command does not exist as a file
- `performance-analyst` has overlap with `code-reviewer` (both do performance checks)
- `project-manager` has overlap with `planner` (both handle architecture decisions)
- Commands reference agents by name in frontmatter `agent:` field; renaming agents breaks these references

## Requirements

### Functional
- Complete inventory of all agent-to-command references
- Complete inventory of all agent-to-skill references
- Identify orphaned references (commands pointing to non-existent agents)
- Map which skills each agent currently uses
- List all files to rename/delete/create across all phases

### Non-Functional
- Audit report must be machine-parseable (markdown tables)
- No code changes in this phase, audit only

## Architecture

No architecture changes. This phase produces a dependency map.

```
Dependency Graph:
  command --agent:--> agent --skill:--> skill
  command --allowed-tools:--> MCP tools
  workflow --> agent (references)
```

## Related Code Files

### Analyze (read-only)
- `.claude/agents/*.md` (11 files)
- `.claude/skills/*/SKILL.md` (11 files)
- `.claude/commands/**/*.md` (23 files)
- `.claude/workflows/*.md` (3 files)
- `.claude/settings.json`
- `CLAUDE.md`

### Create
- `plans/260205-0834-unified-architecture-implementation/reports/audit-report.md`

### Delete
- None

## Implementation Steps

1. Read all 11 agent files, extract `name` and `description` fields from frontmatter
2. Read all 23 command files, extract `agent:` field from frontmatter
3. Cross-reference: for each command, verify its `agent:` target exists as an agent file
4. Read all 11 SKILL.md files, extract `name` and `description` fields
5. Scan agent prompts for skill references (e.g., "skills/ios-development")
6. Scan workflow files for agent references
7. Identify orphaned references:
   - `ios/cook.md` references `ios-developer` agent (does not exist)
   - Any other broken references
8. Map agent overlap:
   - `performance-analyst` vs `code-reviewer` performance checks
   - `project-manager` vs `planner` architecture decisions
9. Create audit report with:
   - Agent inventory table (name, file, tool restrictions, model)
   - Command-to-agent mapping table
   - Skill inventory table
   - Orphan/conflict list
   - Rename impact analysis (which commands break per rename)
10. Save report to `reports/audit-report.md`

## Todo List

- [ ] Extract all agent frontmatter fields
- [ ] Extract all command frontmatter fields (especially `agent:`)
- [ ] Cross-reference commands to agents
- [ ] Map skill usage in agents
- [ ] Map agent usage in workflows
- [ ] Identify orphaned references
- [ ] Identify overlap/conflicts
- [ ] Create rename impact table
- [ ] Generate audit report

## Success Criteria

- Audit report exists at `reports/audit-report.md`
- Every command's `agent:` reference is validated (exists or flagged)
- Every agent rename has a list of impacted commands
- Zero unresolved references remain in the report

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing references not caught | Commands break silently after rename | Grep for agent names across all .md files, not just frontmatter |
| Hidden dependencies in CLAUDE.md | Rules reference old agent names | Include CLAUDE.md in scan |

## Security Considerations
- No code changes, read-only audit
- No secrets or credentials involved

## Next Steps
- Phase 1 depends on this audit to know exact rename impact
- Audit report feeds into all subsequent phases
