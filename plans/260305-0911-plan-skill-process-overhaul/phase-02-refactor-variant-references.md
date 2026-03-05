# Phase 02: Refactor Variant References as Step Modifiers

## Context Links
- [Plan](./plan.md)
- [Phase 01](./phase-01-restructure-skill-md.md)

## Overview
- Priority: P2
- Status: Pending
- Effort: 2h
- Description: Refactor the 4 variant reference files so they only define step modifications, not full independent processes

## Requirements

### Functional
- Each variant reference defines ONLY what it adds/changes/skips relative to SKILL.md process steps
- No variant reference should duplicate the full process
- Research protocol (deep-mode) must remain detailed enough to follow
- Parallel ownership protocol must remain detailed enough to follow
- Validate mode stays mostly independent (it is a different workflow)

### Non-Functional
- Each variant reference under 150 lines (down from current 200-320)
- No content duplication between variants

## Related Code Files

### Files to Modify
- `packages/core/skills/plan/references/fast-mode.md` -- simplify to step skip list
- `packages/core/skills/plan/references/deep-mode.md` -- restructure as step additions
- `packages/core/skills/plan/references/parallel-mode.md` -- restructure as step additions
- `packages/core/skills/plan/references/validate-mode.md` -- minor updates for consistency

### Files to Create
- `packages/core/skills/plan/references/planning-expertise.md` -- moved content from SKILL.md (mental models, state machine, expertise tables)

### Files to Delete
- None

## Implementation Steps

1. **Refactor fast-mode.md**
   - Current: 204 lines, full independent process (steps 1-9)
   - Target: ~40 lines
   - Content: Step modification table showing which steps to skip/simplify
   - Key change: remove duplicated plan.md template, phase template, report template (all now in SKILL.md Output Contract)
   - Keep: constraints (< 5 min, no research, max 10 file reads, max 5 grep)

2. **Refactor deep-mode.md**
   - Current: 320 lines, full process with research protocol
   - Target: ~120 lines
   - Content: Step 4 (Research) detailed protocol -- this IS the unique value
   - Keep: researcher dispatch prompts, aggregation rules, research report structure
   - Remove: duplicated plan.md template, phase template, report template
   - Remove: duplicated error handling (now in SKILL.md per-step Fail)
   - Add: "Output Requirements" section (2+ implementation approaches with trade-offs)

3. **Refactor parallel-mode.md**
   - Current: 214 lines, full process with ownership protocol
   - Target: ~100 lines
   - Content: Step 8 (Parallel Metadata) detailed protocol -- this IS the unique value
   - Keep: file ownership matrix format, dependency graph format, conflict detection algorithm, DAG validation
   - Remove: duplicated plan.md template, phase template, report template
   - Remove: "Same as hard.md PLUS" references (now uses SKILL.md base)

4. **Refactor validate-mode.md**
   - Current: 124 lines
   - Target: ~100 lines (minimal changes needed)
   - This mode is fundamentally different (interview, not plan creation)
   - Keep mostly as-is, just update references from "plan-deep" to "plan --deep"
   - Remove frontmatter fields that duplicate SKILL.md (name, description)

5. **Create planning-expertise.md**
   - Move from SKILL.md: Planning Expertise table, Mental Models table, State Machine Modeling section
   - Add: Planning Framework (6-step), Best Practices list
   - Purpose: reference material for agents who want deeper planning guidance
   - Not required reading for basic plan creation

6. **Update planning-flow.dot**
   - Update labels: `/plan:fast` -> `/plan --fast`, `/plan:deep` -> `/plan --deep`, `/plan:parallel` -> `/plan --parallel`
   - Remove "standard" node (there is no standard -- complexity auto-routes to fast/deep/parallel)

7. **Update epost-architect.md**
   - Update Related Documents section to reference new structure
   - No functional changes needed (architect already references plan skill)

## Proposed Variant Format

Each variant reference follows this structure:

```markdown
# {Mode} Mode

## When Selected
{criteria from complexity auto-detection}

## Step Modifications

| Step | Modification |
|------|-------------|
| Step 4: Research | SKIP (no research in fast mode) |
| Step 6: plan.md | Add Research Summary section |
| Step 8: Parallel | SKIP |

## {Mode}-Specific Protocol
{The unique detailed content for this mode}

## Constraints
{Mode-specific limits}
```

## Todo List
- [ ] Refactor fast-mode.md (204 -> ~40 lines)
- [ ] Refactor deep-mode.md (320 -> ~120 lines)
- [ ] Refactor parallel-mode.md (214 -> ~100 lines)
- [ ] Update validate-mode.md references
- [ ] Create planning-expertise.md from moved SKILL.md content
- [ ] Update planning-flow.dot labels
- [ ] Verify no content lost (diff old vs new)
- [ ] Run `epost-kit init` to regenerate .claude/ from packages/

## Success Criteria
- Variant references define only their unique additions/modifications
- No template duplication across files
- Total line count across all plan skill files reduced by ~30%
- An agent reading SKILL.md + one variant ref has complete process

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Removing templates from variants breaks agent workflow | Med | SKILL.md Output Contract must be complete before variants are trimmed |
| planning-expertise.md never gets read | Low | Cross-reference from SKILL.md; agents doing complex plans will naturally want it |
| Reducing deep-mode.md too aggressively loses research nuance | Med | Keep full researcher prompts; only remove duplicated structural content |

## Security Considerations
- None identified

## Next Steps
- After both phases: run `epost-kit init` to regenerate `.claude/` from `packages/`
- Validate by running `/plan --fast` and `/plan --deep` on a test task
