---
phase: 2
title: "Update skill references to removed scripts"
effort: 1h
depends: [1]
---

# Phase 2: Update Skill References

## Context Links
- [Plan](./plan.md)

## Overview
- Priority: P1
- Status: Pending
- Effort: 1h
- Description: Update all skill files that reference deleted scripts

## Files to Modify

### References to `agent-profiler.cjs`
- `packages/core/skills/error-recovery/SKILL.md` — Remove profiler example code (line ~201). Replace with general timing guidance or remove entirely.

### References to `detect-improvements.cjs`
- `packages/core/skills/review/SKILL.md` — Remove `node .../detect-improvements.cjs` line (~48). The review skill can note improvements without this script.
- `packages/core/skills/review/references/improvements.md` — Remove script references from allowed-tools and execution steps (lines ~6, ~17). Update to describe manual improvement detection instead.
- `packages/core/skills/auto-improvement/SKILL.md` — Remove script references (lines ~80, ~90). Update detection section to describe the pattern without requiring the script.

### References to `check-coverage.cjs`
- `packages/core/skills/cook/references/fast-mode.md` — Remove coverage gate step (line ~36). Coverage is project-specific, not kit-provided.
- `packages/core/skills/cook/references/parallel-mode.md` — Remove coverage gate step (line ~21).

### References to `scan-secrets.cjs`
- `packages/core/skills/cook/references/fast-mode.md` — Remove security scan step (line ~35). Secret scanning is project-specific.
- `packages/core/skills/cook/references/parallel-mode.md` — Remove security scan step (line ~22).

## Implementation Steps

1. **Grep** for each deleted script name across `packages/core/skills/`
2. For each hit, read the file and understand the context
3. Remove or replace the reference:
   - If script was just an example: remove the example
   - If script was a required step: rewrite as general guidance (e.g., "run your project's coverage tool")
   - If script was in allowed-tools: remove from list
4. Verify no remaining references: `grep -r "agent-profiler\|detect-improvements\|check-coverage\|scan-secrets\|test-fixes\|validate-command\|validate-skill-connections\|validate-role" packages/core/skills/`

## Todo List
- [ ] Update error-recovery/SKILL.md (profiler)
- [ ] Update review/SKILL.md (detect-improvements)
- [ ] Update review/references/improvements.md (detect-improvements)
- [ ] Update auto-improvement/SKILL.md (detect-improvements)
- [ ] Update cook/references/fast-mode.md (coverage + secrets)
- [ ] Update cook/references/parallel-mode.md (coverage + secrets)
- [ ] Final grep verification — zero hits

## Success Criteria
- Zero grep hits for any removed script name in `packages/core/skills/`
- All modified skill files remain syntactically valid
- No broken allowed-tools references

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Removing coverage/secrets steps weakens cook quality | Low | These are project-level concerns, not kit concerns. Projects can add their own hooks. |
| auto-improvement skill becomes hollow | Med | Rewrite detection section as pattern description rather than script invocation |
