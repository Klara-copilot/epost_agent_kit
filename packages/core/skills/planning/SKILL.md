---
name: planning
description: Transform requirements into actionable plans with task breakdown and risk assessment
user-invocable: false
context: fork
agent: epost-architect

metadata:
  agent-affinity: "[epost-architect, epost-orchestrator]"
  keywords: "[plan, planning, requirements, tasks, estimation, roadmap]"
  platforms: "[all]"
  triggers: "["/plan", "create plan", "implementation plan"]""
---

# Planning Skill

## Purpose
Transform requirements into actionable plans.

## When Active
User uses /plan, asks for implementation plan.

## Expertise

### Requirements Analysis
- Clarify ambiguous requirements
- Identify edge cases
- Extract functional requirements
- Extract non-functional requirements

### Task Breakdown
- Decompose features into tasks
- Identify subtasks
- Estimate complexity
- Order by dependency

### Dependency Identification
- External dependencies (packages, APIs)
- Internal dependencies (existing code)
- Blocking issues
- Parallel opportunities

### Risk Assessment
- Technical risks
- Timeline risks
- Resource risks
- Mitigation strategies

### Resource Estimation
- Time estimates per task
- Complexity levels (simple, medium, complex)
- Developer hours
- Testing overhead

### Timeline Planning
- Critical path identification
- Milestone definition
- Buffer allocation
- Sprint planning

## Planning Framework

1. **Understand**: Clarify requirements
2. **Decompose**: Break into smaller tasks
3. **Sequence**: Order tasks by dependency
4. **Estimate**: Time/complexity per task
5. **Identify**: Potential blockers
6. **Document**: Create structured plan

## Output Format

```markdown
# Plan: [Feature]

## Overview
[Summary]

## Tasks
1. [Task] - [Estimate]
2. [Task] - [Estimate]

## Dependencies
- [External dependency]
- [Internal dependency]

## Risks
- [Potential risk] - [Mitigation]

## Success Criteria
- [Criteria 1]
- [Criteria 2]
```

## Mental Models

### Decomposition
- Start with user value, work backward to code
- Identify system boundaries
- Use tree structure (parent → child tasks)
- Estimate leaves, sum parents

### 80/20 Principle
- Identify 20% of work that delivers 80% of value
- Sequence high-value tasks first
- Defer "nice to have" to future phases

### Risk Management
- High-risk tasks early (reduce timeline risk)
- External dependencies first (reduce blocking)
- Unknown work before known (reduce surprise)

## Plan File Format

### Naming Convention
Use pattern from hooks: `YYYYMMDD-HHMM-descriptive-name/`

### YAML Frontmatter (plan.md)
Always include YAML frontmatter at the top of plan.md:

```yaml
"
---
title: "Brief title - under 60 chars"
description: "One sentence for card preview"
status: pending          # pending | in-progress | completed | cancelled
priority: P2             # P1 (high) | P2 (medium) | P3 (low)
effort: "8h"            # Sum of all phases (e.g., "8h" or "2d")
branch: "feature/name"  # Git branch from hooks
tags: [tag1, tag2]      # Relevant descriptors
created: YYYY-MM-DD     # Plan creation date
"
---
```

### Phase File Structure (12 Sections)
Each phase file must include all sections:

1. **Context Links**: Related docs, reports, references
2. **Overview**: Priority, status, effort, description
3. **Key Insights**: Research findings, critical considerations
4. **Requirements**: Functional and non-functional
5. **Architecture**: System design, component interactions, data flow
6. **Related Code Files**: Create/Modify/Delete with file ownership
7. **Implementation Steps**: Detailed, numbered instructions
8. **Todo List**: Checkbox tracking
9. **Success Criteria**: Definition of done
10. **Risk Assessment**: Table format (Risk, Impact, Mitigation)
11. **Security Considerations**: Auth, data protection concerns
12. **Next Steps**: Dependencies, follow-up tasks

### File Ownership Tracking
Annotate files in "Related Code Files" section:

```markdown
## Related Code Files
### Files to Create (EXCLUSIVE to this phase)
- `src/auth/login.ts` - Login component [OWNED]
### Files to Modify (EXCLUSIVE to this phase)
- `src/api/routes.ts` - Add auth endpoints [OWNED]
### Files Read-Only (shared, no modifications)
- `docs/system-architecture.md` - Reference only
```

### Parallelization Info (Optional - Parallel Variant Only)
For `/plan:parallel` only, add after Overview:

```markdown
## Parallelization Info
- **Execution Batch**: Batch {N}
- **Can Run Parallel With**: Phase {X}, Phase {Y}
- **Blocked By**: Phase {A} (must complete first)
- **Blocks**: Phase {C} (waiting on this)
- **Exclusive Files**:
  - `path/file.ext` (Create|Modify)
- **Shared Read-Only**:
  - `path/file.ext`
```

## Output Standards
- **plan.md**: Overview file, max 80 lines
- **Phase files**: Comprehensive but focused
- **Research reports**: Max 150 lines
- Use relative links between plan files
- Keep all sections under 200 LOC for context efficiency

## Best Practices
- Be specific about files to create/modify
- Include database migrations if needed
- Note breaking changes
- Consider testing strategy
- Think about documentation updates
- Always create YAML frontmatter with all required fields
- Link phases with dependencies clearly
- Estimate conservatively, track actuals
- Mark file ownership for parallel execution safety
- Use Parallelization Info section only for `/plan:parallel` variant

## Plan Storage & Index Protocol

After creating or completing a plan/report, follow these steps:

### 1. Save to lifecycle directory
Choose directory based on plan status:

| Status | Directory | When |
|--------|-----------|------|
| Draft/Active | `epost-agent-cli/plans/active/` | Plan work in progress |
| Completed | `epost-agent-cli/plans/completed/` | All tasks done, verified |
| Archived | `epost-agent-cli/plans/archived/` | Superseded or obsolete |

Use hooks-injected naming: `{agent}-{YYMMDD}-{HHMM}-{slug}.md`

> **Legacy**: `epost-agent-cli/plans/reports/` contains pre-existing reports (PLAN-0001 through PLAN-0015). Do not add new files there.

### 2. Update INDEX.md
Append a row to `epost-agent-cli/plans/INDEX.md` under the matching status section (Active or Completed):
```markdown
| PLAN-NNNN | Title | agent-name | YYYY-MM-DD | [completed/filename.md](completed/filename.md) |
```

### 3. Update index.json
Append entry to `epost-agent-cli/plans/index.json`:
- Increment the matching count (`counts.active` or `counts.completed`) and `counts.total`
- Add plan object to `plans` array with: id, title, type, status, created, authors, tags, file

### 4. Status transitions
When a plan changes status, move the file and update both index files:
- `active/` → `completed/`: Plan finished successfully
- `active/` → `archived/`: Plan superseded or cancelled
- `completed/` → `archived/`: No longer relevant

See `epost-agent-cli/plans/PLAN_FORMAT.md` for standardized frontmatter template.
See `epost-agent-cli/plans/PLAN_TRACKING_FLOW.md` for visual flow diagrams.

## Knowledge-Informed Planning

Before creating a plan, consult the knowledge base:
1. Search `.knowledge/adrs/` for related architectural decisions
2. Check `.knowledge/patterns/` for established code patterns
3. Review `.knowledge/findings/` for known pitfalls

Use `knowledge-retrieval` skill for the full search protocol.

After completing a significant plan, record architectural decisions as ADRs using the `knowledge-base` skill.

### Related Skills
- `knowledge-retrieval` — Internal-first search protocol
- `knowledge-base` — ADR and decision storage
