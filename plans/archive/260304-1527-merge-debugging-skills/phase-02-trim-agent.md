# Phase 02: Trim epost-debugger agent prompt

## Context Links
- Parent plan: [plan.md](./plan.md)
- Depends on: Phase 01 (debug skill must be merged first)

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Trim epost-debugger agent system prompt to ~80 lines, removing content now in merged debug skill
**Implementation Status**: Pending

## Key Insights
- Agent prompt is 220 lines; 80%+ duplicates debugging skill content
- Duplicated sections: Systematic Debugging Framework (lines 75-81), Log Analysis Patterns (92-97), Error Reproduction Steps (99-105), Common Issue Patterns (158-183), Fix Verification Protocol (107-113)
- Keep: agent identity, core competencies list (brief), platform delegation, investigation methodology (unique to agent), output format template, reporting standards
- Skills list: change `debugging` to `debug`

## Requirements
### Functional
- Agent skills list: `[core, skill-discovery, debug, knowledge-retrieval]`
- Remove duplicated sections that now live in `debug` skill
- Keep agent-specific sections: Platform Delegation, Investigation Methodology (2-5), Investigation Tools, Output Format, Reporting Standards, Communication Approach
- Keep brief Core Competencies list but remove "Skills: Activate..." line (redundant with skills: list)

### Non-Functional
- Agent prompt < 100 lines after trim
- Agent still references skill activation for platform-specific tools

## Related Code Files
### Modify (EXCLUSIVE)
- `packages/core/agents/epost-debugger.md` — trim prompt [OWNED]
### Read-Only
- `packages/core/skills/debug/SKILL.md` — verify no content loss

## Implementation Steps

1. **Update frontmatter** skills list: `debugging` -> `debug`
2. **Remove duplicated sections**:
   - Lines 75-81: "Systematic Debugging Framework" (now in debug skill Expertise section)
   - Lines 83-89: "Sequential Thinking Protocol" (covered by sequential-thinking skill reference)
   - Lines 92-97: "Log Analysis Patterns" (now in debug skill)
   - Lines 99-105: "Error Reproduction Steps" (now in debug skill Reproduction Strategies)
   - Lines 107-113: "Fix Verification Protocol" (now in debug skill Fix Validation)
   - Lines 158-183: "Common Issue Patterns" (now in debug skill Common Issues)
3. **Keep sections** (agent-specific, not in skill):
   - Identity paragraph (line 10)
   - Core Competencies bullet list (lines 19-26, remove line 27)
   - Platform Delegation (lines 29-38)
   - Investigation Methodology steps 1-5 (lines 42-74) — unique operational flow
   - Investigation Tools (lines 115-121)
   - Output Format template (lines 123-156)
   - Reporting Standards (lines 194-201)
   - Communication Approach (lines 203-209)
   - YAGNI/KISS/DRY footer
4. **Verify** prompt is < 100 lines, reads coherently

## Todo List
- [ ] Update skills frontmatter
- [ ] Remove duplicated sections
- [ ] Verify remaining sections coherent
- [ ] Count lines (target < 100)

## Success Criteria
- Agent prompt < 100 lines
- skills: list says `debug` not `debugging`
- No content loss (everything is in debug skill OR agent prompt, not both)

## Risk Assessment
**Risks**: Removing too much, agent loses context for good debugging
**Mitigation**: Keep investigation methodology (unique to agent); skill provides the knowledge, agent provides the workflow

## Security Considerations
None.

## Next Steps
After completion: Phase 03 (cleanup index and cross-references)
