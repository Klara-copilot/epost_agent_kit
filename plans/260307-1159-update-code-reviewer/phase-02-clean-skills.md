---
phase: 2
title: "Clean up skill files"
effort: 1h
depends: [1]
---

# Phase 2: Clean Up Skill Files

## Context Links
- [Plan](./plan.md)
- Source: `packages/core/skills/code-review/SKILL.md`
- Source: `packages/core/skills/review/references/code.md`

## Overview
- Priority: P2
- Status: Pending
- Effort: 1h
- Description: Fix stale references in skill files, ensure code-review SKILL.md has all content previously in agent

## Requirements

### Functional
- `code-review/SKILL.md`: ensure OWASP checklist, severity classification, and review cycle content is present (move from agent if missing)
- `review/references/code.md` line 134: replace `epost-git-manager` reference with direct git workflow
- `code-review/SKILL.md` sub-skill routing table (lines 96-107): update `review-code` and `review-improvements` names to match current structure (`review --code`, `review --improvements`)
- Verify `code-review/references/report-template.md` is the single canonical template

### Non-Functional
- No broken cross-references between files
- Consistent naming (no legacy sub-skill names)

## Files to Modify

| File | Action |
|------|--------|
| `packages/core/skills/code-review/SKILL.md` | Update sub-skill routing table, add any missing content from agent |
| `packages/core/skills/review/references/code.md` | Fix `epost-git-manager` reference (line 134) |

## Implementation Steps

1. **Update `code-review/SKILL.md`**:
   - Check that severity classification (Critical/High/Medium/Low) is already present (it is at lines 44-48)
   - Add OWASP security checklist if not present (currently missing — should be added as brief reference or new reference file)
   - Update Sub-Skill Routing table (lines 96-107): change `review-code` to `review --code`, `review-improvements` to `review --improvements`
   - Remove `connections.enhances: [review-code, review-improvements]` from frontmatter — these are reference files, not standalone skills

2. **Fix `review/references/code.md`**:
   - Line 134: Change `use epost-git-manager` to `use git commands directly (git add, git commit)`
   - Verify no other stale agent references

3. **Verify report template**:
   - Confirm `code-review/references/report-template.md` is complete and matches what was inline in agent
   - Current template looks complete — no changes expected

## Todo List
- [ ] Update sub-skill routing table in `code-review/SKILL.md`
- [ ] Fix frontmatter connections in `code-review/SKILL.md`
- [ ] Add brief OWASP reference to `code-review/SKILL.md` (or create `code-review/references/security-checklist.md`)
- [ ] Fix `epost-git-manager` reference in `review/references/code.md`
- [ ] Verify report template completeness
- [ ] Run `epost-kit init` to regenerate `.claude/`

## Success Criteria
- No references to non-existent agents or files
- Sub-skill routing uses current naming convention
- OWASP coverage documented in skill (not only in agent)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| OWASP content too verbose for skill | Low | Keep as brief checklist, detail in reference file |
| Breaking connections in skill-index | Low | Regenerate after changes |
