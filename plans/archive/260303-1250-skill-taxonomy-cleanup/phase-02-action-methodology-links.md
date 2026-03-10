# Phase 02: Link Action/Methodology Pairs

## Context Links
- [Plan](./plan.md)
- [Phase 01](./phase-01-parent-backlinks.md)

## Overview
- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Establish explicit connections between action commands and their methodology skills; link convert to web-prototype

## Key Insights

### Audit Findings (6 pairs analyzed)

| Action Skill | Methodology Skill | Relationship | Status |
|---|---|---|---|
| `plan` | `planning` | `plan` is the entry router, `planning` is loaded knowledge | **NOT linked** |
| `debug` | `debugging` | `debug` is the entry router, `debugging` is loaded knowledge | **NOT linked** |
| `review-code` | `code-review` | `review-code` is the action, `code-review` is methodology | **NOT linked** |
| `test` | (none) | No separate testing methodology skill | OK (no action needed) |
| `cook` | (none) | No separate "cooking" methodology skill | OK (no action needed) |
| `convert` | `web-prototype` | `convert` references web-prototype in body text | **NOT linked** |

### Why These Pairs Are NOT Duplicates

These pairs serve **different roles** and should BOTH exist:

- **Action skill** (`plan`, `debug`, `review-code`, `convert`): User-invocable, `context: fork`, has `agent:` field, acts as entry point/router. Thin.
- **Methodology skill** (`planning`, `debugging`, `code-review`, `web-prototype`): `user-invocable: false`, loaded into agent's `skills:` list, provides deep knowledge/patterns. Thick.

The action skill delegates to the methodology skill at runtime via agent's loaded skills. The fix is NOT to merge them but to declare the `requires` relationship.

### a11y Agent Platform Bundling (Issue #6 -- VALIDATED AS NON-ISSUE)

The a11y agent definition at `packages/a11y/agents/epost-a11y-specialist.md` has:
```yaml
skills: [core, a11y, audit-a11y, fix-a11y, review-a11y, audit-close-a11y]
```

This is **correct** -- it does NOT statically bundle `ios-a11y`, `android-a11y`, or `web-a11y`. The agent body says "Activate ONLY the skills needed for the detected platform." Platform-specific a11y skills are loaded dynamically via `skill-discovery`.

The hub-context skill also does not statically bundle platform skills -- it delegates platform detection to `skill-discovery`. No fix needed for this issue.

## Requirements
### Functional
- Action skills must declare `requires: [methodology-skill]` in their connections
- Methodology skills must declare `enhances: [action-skill]` in their connections
- `convert` must declare `requires: [web-prototype]`

### Non-Functional
- Only edit `packages/` files
- Preserve existing frontmatter structure

## Related Code Files
### Modify (EXCLUSIVE)

**Action skills (add `requires`):**
- `packages/core/skills/plan/SKILL.md` -- add `requires: [planning]`
- `packages/core/skills/debug/SKILL.md` -- add `requires: [debugging]`
- `packages/core/skills/review-code/SKILL.md` -- add `requires: [code-review]`
- `packages/core/skills/convert/SKILL.md` -- add `requires: [web-prototype]`

**Methodology skills (add `enhances`):**
- `packages/core/skills/planning/SKILL.md` -- add `connections.enhances: [plan, plan-fast, plan-deep, plan-parallel, plan-validate]`
- `packages/core/skills/debugging/SKILL.md` -- add `connections.enhances: [debug, fix, fix-deep, fix-ci, fix-ui]`
- `packages/core/skills/code-review/SKILL.md` -- add `connections.enhances: [review-code, review-improvements]`
- `packages/platform-web/skills/web-prototype/SKILL.md` -- add `connections.enhances: [convert]`

### Read-Only
- `.claude/skills/skill-index.json` -- verify changes after regen

## Implementation Steps

1. **Add `metadata.connections` to action skills**
   - `plan/SKILL.md`: add `connections.requires: [planning]` under existing metadata
   - `debug/SKILL.md`: add `connections.requires: [debugging]`
   - `review-code/SKILL.md`: add `connections.requires: [code-review]`
   - `convert/SKILL.md`: add `connections.requires: [web-prototype]`

2. **Add `connections.enhances` to methodology skills**
   - `planning/SKILL.md`: already has metadata block, add `connections.enhances` list
   - `debugging/SKILL.md`: already has metadata block, add `connections.enhances` list
   - `code-review/SKILL.md`: already has metadata block, add `connections.enhances` list
   - `web-prototype/SKILL.md`: already has metadata block, add `connections.enhances` list

3. **Verify `debugging` sub-skill routing table**
   - `debugging` already has a "Sub-Skill Routing" section that maps to `debug`, `fix`, `fix-deep`, `fix-ci`, `fix-ui`
   - The `enhances` list should match this table

4. **Verify `code-review` sub-skill routing table**
   - Already maps to `review-code`, `review-improvements`, `test`, `verification-before-completion`, `receiving-code-review`
   - `enhances` should only include direct action variants: `review-code`, `review-improvements`

5. **Verify `planning` sub-skill routing table**
   - Already maps to `plan`, `plan-fast`, `plan-deep`, `plan-parallel`, `plan-validate`
   - `enhances` should match

## Todo List
- [ ] Add requires to plan
- [ ] Add requires to debug
- [ ] Add requires to review-code
- [ ] Add requires to convert
- [ ] Add enhances to planning
- [ ] Add enhances to debugging
- [ ] Add enhances to code-review
- [ ] Add enhances to web-prototype
- [ ] Verify all sub-skill routing tables match enhances lists

## Success Criteria
- `skill-index.json` shows `requires` on action skills and `enhances` on methodology skills
- `skill-discovery` resolution chain works: loading `plan` auto-loads `planning` via `requires`

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| `requires` chain too deep | Med | Max 3 hops enforced by skill-discovery |
| Circular dependency | Low | No methodology skill requires an action skill |

## Security Considerations
None

## Next Steps
- Proceed to Phase 03 (regenerate skill-index.json)
