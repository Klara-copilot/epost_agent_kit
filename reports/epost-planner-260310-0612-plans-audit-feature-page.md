---
date: 2026-03-10
agent: epost-planner
plan: plans/260310-0612-plans-audit-feature-page
status: READY
---

# Plans Audit, Archive Cleanup & Product Feature Page

## Executive Summary

Audited all 60 plan directories against their frontmatter status. Found 37 plans ready for archiving (25 completed + 12 stale drafts), ~23 genuinely active/in-progress plans. Created 3-phase plan to archive, build product feature page, and clean up indexes.

## Plan Details

| Phase | Title | Effort |
|-------|-------|--------|
| 1 | Archive 37 completed/stale plans | 1h |
| 2 | Create product feature page in README.md | 1.5h |
| 3 | Update README board + index.json | 30m |

**Total effort**: 3h

## Key Findings

- `index.json` claims 39 active, 25 completed, 0 archived — significantly out of sync
- 8 plans use non-standard status (`done`, `complete`) instead of `completed`
- 3 plans have no YAML frontmatter at all (260301-1017, 260309-0935, 260309-1030)
- Several index entries reference `../../` paths from old directory structure
- Plans board (README.md) is stale — only shows 2 active, 12 draft, 10 completed

## Verdict

**READY** — all information gathered, archive script exists, plan is actionable.

## Unresolved Questions

1. Should `260305-1024-remove-embedded-cli` be archived? Memory says CLI was removed, plan may be done.
2. Should `260304-1718-audit-ui-lib-component` be archived as superseded by `260306-0631-muji-audit-standards`?
3. `260301-1017-copilot-target-support` has no frontmatter — keep as backlog or archive?
4. Plans referenced in index.json under `../../tools/management-ui/plans/` — these are cross-repo. Remove from index or keep as external references?
