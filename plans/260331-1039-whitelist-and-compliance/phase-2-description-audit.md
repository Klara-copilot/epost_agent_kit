---
phase: 2
title: "Audit 25 Skill Descriptions"
effort: 1h
depends: [1]
---

# Phase 2: Audit 25 Skill Descriptions

## Context Links
- [Plan](./plan.md)
- [Phase 1 — Checklist](./phase-1-description-checklist.md)
- `packages/core/skills/*/SKILL.md` — all 25+ core skills

## Overview
- Priority: P1
- Status: Pending
- Effort: 1h
- Description: Audit every core skill description against Phase 1 checklist. Fix non-compliant descriptions in-place. Focus: does description drive correct triggering? Are trigger phrases explicit and third-person?

## Requirements

### Functional
- Audit ALL skills in `packages/core/skills/`
- Fix descriptions that fail any checklist item
- Preserve `(ePost)` prefix convention where present
- Do not change skill body content — description field only

### Non-Functional
- Each description under 1024 chars
- Maintain consistent style across all descriptions

## Related Code Files

### Files to Modify (up to 25)
- `packages/core/skills/audit/SKILL.md` — description field
- `packages/core/skills/clean-code/SKILL.md`
- `packages/core/skills/code-review/SKILL.md`
- `packages/core/skills/cook/SKILL.md`
- `packages/core/skills/core/SKILL.md`
- `packages/core/skills/debug/SKILL.md`
- `packages/core/skills/docs/SKILL.md`
- `packages/core/skills/error-recovery/SKILL.md`
- `packages/core/skills/fix/SKILL.md`
- `packages/core/skills/get-started/SKILL.md`
- `packages/core/skills/git/SKILL.md`
- `packages/core/skills/journal/SKILL.md`
- `packages/core/skills/knowledge/SKILL.md`
- `packages/core/skills/loop/SKILL.md`
- `packages/core/skills/mermaidjs/SKILL.md`
- `packages/core/skills/plan/SKILL.md`
- `packages/core/skills/repomix/SKILL.md`
- `packages/core/skills/review/SKILL.md`
- `packages/core/skills/security/SKILL.md`
- `packages/core/skills/skill-creator/SKILL.md`
- `packages/core/skills/skill-discovery/SKILL.md`
- `packages/core/skills/subagent-driven-development/SKILL.md`
- `packages/core/skills/tdd/SKILL.md`
- `packages/core/skills/test/SKILL.md`
- `packages/core/skills/thinking/SKILL.md`

### Files to Create
- None

### Files to Delete
- None

## Implementation Steps

1. **Read each SKILL.md frontmatter** — extract `description:` field
2. **Check against checklist** from Phase 1:
   - Starts with "Use when..." or trigger phrasing?
   - Has 2+ concrete trigger examples?
   - No workflow summary in description?
   - Under 1024 chars?
   - Explicit user-facing phrases in quotes?
   - Third-person voice?
3. **Fix non-compliant descriptions** — edit description field only
4. **Track pass/fail** in a quick audit table for the report

### Known Issues from Pre-Scan

Skills likely needing fixes (based on current descriptions):
- `skill-creator` — describes capabilities, not trigger conditions
- `knowledge` — mixes workflow ("checks internal sources first") into description
- `loop` — describes behavior, not trigger phrases
- `mermaidjs` — lists diagram types without trigger phrasing
- `repomix` — no "(ePost)" prefix, describes what it does not when to use
- `thinking` — describes behavior not triggers
- `error-recovery` — terse, may lack trigger examples
- `security` — may lack quoted trigger phrases

## Todo List
- [ ] Audit all 25 descriptions
- [ ] Fix non-compliant descriptions
- [ ] Verify all pass checklist
- [ ] Generate audit summary table

## Success Criteria
- All 25 descriptions pass the 7-point checklist
- No description exceeds 1024 chars
- All use third-person trigger phrasing

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Changed description breaks model triggering | Med | Keep trigger phrases from original; only restructure |
| Too many changes in one commit | Low | All changes are description-only, easy to review |

## Security Considerations
- None identified

## Next Steps
- Run `epost-kit init` after to regenerate `.claude/skills/`
