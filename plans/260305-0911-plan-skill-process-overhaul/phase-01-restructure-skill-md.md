# Phase 01: Restructure SKILL.md as Process Checklist

## Context Links
- [Plan](./plan.md)

## Overview
- Priority: P1
- Status: Pending
- Effort: 2h
- Description: Rewrite SKILL.md so it reads as a sequential process checklist with gates, not a feature description

## Requirements

### Functional
- SKILL.md must define the complete planning process as numbered steps
- Each step must have Gate (precondition), Action (what to do), Output (what must exist after), Fail (error path)
- Steps are the universal process; variants modify individual steps
- Plan output contract (directory layout, file naming, frontmatter schema) defined once

### Non-Functional
- SKILL.md stays under 200 lines
- No duplication with variant references

## Related Code Files

### Files to Modify
- `packages/core/skills/plan/SKILL.md` -- rewrite as process checklist

### Files to Create
- None

### Files to Delete
- None

## Implementation Steps

1. **Define the Universal Plan Process as Steps**
   - Extract the common steps across all 4 variants into a single numbered list
   - Common steps: (1) Parse request, (2) Detect platform, (3) Assess complexity, (4) Check prior knowledge, (5) [VARIANT: Research], (6) Create plan directory, (7) Generate plan.md, (8) Generate phase files, (9) Set active plan, (10) Update plan index, (11) Report completion
   - Each step gets Gate/Action/Output/Fail

2. **Define the Plan Output Contract**
   - Directory layout: `plans/YYMMDD-HHMM-{slug}/`
   - plan.md frontmatter schema (required fields: title, status, created, updated, effort, phases, platforms)
   - plan.md body sections (Summary, Key Dependencies, Execution Strategy, Phases table, Critical Constraints, Success Criteria)
   - Phase file naming: `phase-{XX}-{slug}.md`
   - Phase file sections (12-section standard order already exists -- codify it)

3. **Add Step Modifier Notation**
   - Each step that varies by mode gets a tag: `[FAST: skip]`, `[DEEP: add research]`, `[PARALLEL: add ownership]`
   - This makes SKILL.md the single source of truth for "what happens when"

4. **Move Redundant Content Out of SKILL.md**
   - Mental Models, State Machine Modeling, Planning Expertise tables -- move to `references/planning-expertise.md`
   - Keep only the process steps + output contract + variant routing table in SKILL.md
   - SKILL.md becomes: frontmatter, process steps, output contract, mode reference table

5. **Preserve Existing Frontmatter**
   - Keep all metadata, triggers, keywords, connections unchanged

## Proposed SKILL.md Structure

```
---
(existing frontmatter)
---

# Plan -- Unified Planning Process

## Step 0: Route Mode
(flag detection table -- unchanged)

## Process Steps

### Step 1: Parse Request
Gate: User provided task description
Action: Extract task scope, affected files, platform hints
Output: task_description, detected_platform
Fail: Ask user for clarification (max 1 question)

### Step 2: Check Prior Knowledge
Gate: task_description exists
Action: Query knowledge-retrieval L1 (docs/) for related ADRs, patterns
Output: prior_context (may be empty)
Fail: Skip, proceed

### Step 3: Assess Complexity
Gate: task_description + prior_context
Action: Score using heuristics table
Output: complexity_level (simple|moderate|complex)
Fail: Default to simple

### Step 4: Research [DEEP, PARALLEL only]
Gate: complexity_level >= moderate
Action: Follow references/deep-mode.md research protocol
Output: research reports in plan_dir/research/
Fail: Proceed with warning "partial research"

### Step 5: Create Plan Directory
Gate: complexity assessed (and research done if applicable)
Action: mkdir plans/YYMMDD-HHMM-{slug}/
Output: plan_dir exists
Fail: Error and exit

### Step 6: Generate plan.md
Gate: plan_dir exists
Action: Create plan.md per Output Contract below
Output: plan.md with valid frontmatter + body
Fail: Error and exit

### Step 7: Generate Phase Files
Gate: plan.md exists with Phases table
Action: For each phase, create phase-{XX}-{slug}.md per Phase Template below
Output: N phase files
Fail: Error on specific phase, continue others

### Step 8: Add Parallel Metadata [PARALLEL only]
Gate: phase files exist
Action: Follow references/parallel-mode.md ownership protocol
Output: File Ownership Matrix in plan.md, Parallelization Info in each phase
Fail: Warn, proceed without parallel metadata

### Step 9: Set Active Plan
Gate: plan.md + phase files exist
Action: node .claude/scripts/set-active-plan.cjs {plan_dir}
Output: Session state updated
Fail: Warn with manual command, continue

### Step 10: Activate Plan
Gate: plan created successfully
Action: `node .claude/scripts/set-active-plan.cjs {plan_dir}` — stamps `status: active` in plan.md, updates session, updates `plans/README.md` Active board
Output: Session state set, README.md updated
Fail: Warn with manual command, continue

### Step 11: Report Completion
(report template)

## Output Contract
(plan.md schema, phase file template, directory layout)

## Mode Reference
(existing table)
```

## Todo List
- [ ] Rewrite SKILL.md following proposed structure
- [ ] Move Planning Expertise/Mental Models/State Machine to references/planning-expertise.md
- [ ] Verify all existing content is preserved (moved, not deleted)
- [ ] Test: read SKILL.md alone and confirm an agent can follow it step-by-step

## Success Criteria
- SKILL.md reads as a numbered checklist, not a feature spec
- Each step has Gate/Action/Output/Fail
- Output contract defined exactly once
- Under 200 lines

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| SKILL.md becomes too long with all steps | Med | Move expertise/mental models to references/ to free space |
| Agents depend on current section names | Low | Keep Mode Reference table unchanged; process steps are new content |
| Gate/Action/Output format too rigid | Low | Format is guidance not enforcement; agents can adapt |

## Security Considerations
- None identified

## Next Steps
- Phase 02 depends on this: variant references need updating to match new step numbering
