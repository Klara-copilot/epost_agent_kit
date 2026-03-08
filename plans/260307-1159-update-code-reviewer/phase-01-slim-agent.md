---
phase: 1
title: "Slim agent, fix stale references"
effort: 1h
depends: []
---

# Phase 1: Slim Agent, Fix Stale References

## Context Links
- [Plan](./plan.md)
- Source: `packages/core/agents/epost-code-reviewer.md`

## Overview
- Priority: P1
- Status: Pending
- Effort: 1h
- Description: Rewrite agent to thin pattern — describe role + capabilities, delegate detail to skills

## Requirements

### Functional
- Agent prompt < 80 lines
- Keep frontmatter unchanged (skills, permissionMode, disallowedTools)
- Remove all inline OWASP details, severity tables, report templates
- Remove stale references: `Explore agent`, `.claude/rules/development-rules.md`
- Keep: role description, review process outline (steps only, not detail), rules section
- Reference skills for detail: `code-review` for methodology, `code-review/references/report-template.md` for output format

### Non-Functional
- Follow thin agent pattern: "what you are" + "what skills to use" + "rules"
- No duplicated content between agent and skill

## Files to Modify

| File | Action |
|------|--------|
| `packages/core/agents/epost-code-reviewer.md` | Rewrite — slim to ~60-80 lines |

## Implementation Steps

1. **Rewrite agent prompt** keeping:
   - Frontmatter (unchanged)
   - Role sentence: "Senior code reviewer for quality, security, performance"
   - Skill activation instruction
   - Brief review process (5 numbered steps, 1 line each)
   - Rules section (4-5 bullets)
   - Reference to `code-review` skill and `core/references/workflow-code-review.md`
   - Report format: single line pointing to `code-review/references/report-template.md`

2. **Remove**:
   - Full "Initial Analysis" section (lines 39-53) — covered by `code-review` SKILL.md
   - Full "Code Quality Assessment" section (lines 55-75) — covered by skill
   - Full "Security Audit" section (lines 77-98) — OWASP detail in skill
   - Full "Performance Analysis" section (lines 99-116) — in skill
   - Full "Task Completeness Verification" section — in skill
   - Full "Build/Deploy Validation" section — in skill
   - Full "Review Cycle" section — in skill
   - Full "Severity Prioritization" section — in skill
   - Inline "Review Report Output" template (lines 214-263) — use reference file
   - Stale `.claude/rules/development-rules.md` reference
   - Stale `Explore agent (via Task tool)` reference

## Todo List
- [ ] Rewrite `packages/core/agents/epost-code-reviewer.md` to thin pattern
- [ ] Verify no stale references remain
- [ ] Run `epost-kit init` or equivalent to regenerate `.claude/agents/`

## Success Criteria
- Agent file < 80 lines
- No references to non-existent files
- All detail delegated to skills

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent loses critical context | Med | Verify all removed content exists in `code-review` SKILL.md |
| Skill not loaded at runtime | Low | Agent frontmatter `skills: [core, skill-discovery, code-review]` ensures loading |
