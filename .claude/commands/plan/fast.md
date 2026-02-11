---
title: "Plan: Fast"
description: (ePost) "Quick plan from codebase analysis only, no research"
agent: epost-planner
argument-hint: [enhanced planning prompt from router]
---

# Plan Fast Variant

Quick planning using only codebase analysis and documentation. No research phase.

## When to Use
- Simple tasks (typos, small fixes, standard patterns)
- Complexity score ≤ 1 (router auto-routes)

## Execution Steps

### 1. Parse Enhanced Prompt
Extract from $ARGUMENTS: original_request, complexity_scores, planning_requirements, codebase_context_paths

### 2. Check Codebase Summary
```
CHECK docs/codebase-summary.md:
- Missing: Warn, ask to run /scout or continue
- Older than 3 days: Warn, ask to refresh or continue
- Fresh: Read and use
```

### 3. Read Context
Read sequentially (skip if missing):
- docs/system-architecture.md
- docs/code-standards.md
- docs/codebase-summary.md

### 4. Analyze Task
Use Grep/Glob (max 5 searches) to find:
- Similar implementations
- Relevant files to modify
- Patterns and dependencies

### 5. Create Plan Directory
```
plan_slug = sanitized original_request (lowercase, hyphens, 40 chars max)
plan_path = plans/YYMMDD-HHMM-{plan_slug}/
CREATE directory
```

### 6. Generate plan.md
```yaml
---
title: "{feature}"
description: "{brief}"
status: pending
priority: P2
effort: {Xh}
tags: [keywords]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# {Feature}

## Summary
{1-2 sentences}

## Key Dependencies
{Critical dependencies}

## Execution Strategy
{Sequential/phased approach}

## Phases
| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | {Name} | {Xh} | pending | [phase-01](./phase-01-{slug}.md) |

## Critical Constraints
{Limitations from codebase}

## Success Criteria
- [ ] {Testable criterion 1}
```
Max 80 lines excluding frontmatter.

### 7. Generate Phase Files
For each phase create phase-{XX}-{name}.md:
```
# Phase {XX}: {Name}

## Context Links
- [Plan](./plan.md)
- {Relevant code files}

## Overview
- Priority: P1/P2/P3
- Status: Pending
- Effort: {Xh}
- Description: {What this accomplishes}

## Requirements
### Functional
- {Requirement 1}

### Non-Functional
- Files under 200 LOC
- {Other constraints}

## Related Code Files
### Files to Modify
- `path/file.ext` - {changes}

### Files to Create
- `path/new.ext` - {purpose}

### Files to Delete
- None

## Implementation Steps
1. **{Step}**
   - {Action 1}
   - {Action 2}

## Todo List
- [ ] {Task 1}
- [ ] {Task 2}

## Success Criteria
- {Verification method}

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| {Risk} | Med | {Prevention} |

## Security Considerations
- {Auth/data concerns or "None identified"}

## Next Steps
- {Dependencies}
```
Max 200 lines per phase file.

### 8. Set Active Plan
```bash
node .claude/scripts/set-active-plan.cjs {plan_path}
```
If fails: warn with manual command.

### 9. Report Completion
```
✓ Fast Plan Created: {plan_path}

Summary:
- Phases: {N}
- Total effort: {Xh}
- Active plan: Set

Generated Files:
- plan.md ({X} lines)
- {N} phase files

Next Steps:
1. Review: cat {plan_path}/plan.md
2. Start: /code {plan_path}

Note: FAST plan (no research). For complex tasks use /plan:hard.
```

## Constraints
- Execution: < 5 minutes
- No research/external calls
- Max 10 file reads
- Max 5 Grep/Glob searches
- Plan.md ≤ 80 lines
- Phase files ≤ 200 lines

## Error Handling
- Missing codebase-summary: Proceed with warning
- Missing docs: Skip, continue
- Cannot create directory: Error and exit
- set-active-plan fails: Warn, continue

## Quality Standards
- Follow .claude/rules/documentation-management.md
- YAML frontmatter on all .md files
- Specific file paths (not generic)
- Testable success criteria
- Security section mandatory
