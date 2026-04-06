---
title: "Fix Web Platform Skill Audit Issues (excl. web-prototype-convert)"
status: active
created: 2026-04-06
updated: 2026-04-06
effort: 2h
phases: 3
platforms: [web]
breaking: false
blocks: []
blockedBy: []
---

# Plan: Fix Web Platform Skill Audit Issues

## Scope Rationale

1. Problem: 10 web skills have token bloat, typos, missing frontmatter, and stale metadata identified by self-eval audit.
2. Why this way: mechanical fixes — extract inline content to existing references, fix typos, add missing fields.
3. Why now: skill quality directly affects agent accuracy; audit just completed.
4. Simplest version: all fixes listed below — already minimal.
5. Cut 50%: drop Group C (metadata). Groups A+B deliver the most value.

Excluded: `web-prototype-convert` gets its own dedicated plan.

## Source

Audit: `reports/260406-2255-web-skills-self-eval-epost-code-reviewer.md`

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Token efficiency — extract inline content to references | 1h | pending | [phase-1](./phase-1-token-efficiency.md) |
| 2 | Bug fixes — typo + missing frontmatter | 20m | pending | [phase-2](./phase-2-bug-fixes.md) |
| 3 | Metadata fixes — triggers + staleness warnings | 20m | pending | [phase-3](./phase-3-metadata-fixes.md) |

**Parallel-safe**: all 3 phases have zero file overlap.

## Success Criteria

- [ ] All modified SKILL.md files under 100 lines (target: 80-90)
- [ ] No content deleted — all extracted content lands in reference files
- [ ] `setupFilesAfterSetup` typo fixed in web-testing
- [ ] web-auth has `paths:` frontmatter field
- [ ] web-modules has `domain-b2b` in connections
- [ ] web-ui-lib has staleness warning on entry ID table

## Constraints

- ALL edits in `packages/` — never `.claude/`
- Preserve existing reference file content; append extracted content
- No new reference files — all target files already exist
