---
title: "Audit session folder pattern — consolidate output paths across kit"
status: archived
created: 2026-03-09
updated: 2026-03-10
effort: 2h
phases: 3
platforms: [all]
breaking: false
---

# Audit Session Folder Pattern

## Summary

Audit pipeline produces orphaned flat files in `reports/` despite session folder pattern already being defined in `code-review/SKILL.md` and `epost-code-reviewer.md`. Root cause: conflicting path templates across 6+ files. This plan unifies all output path references to a single session folder contract, updates `reports/index.json` schema, and adds `session.json` metadata per audit session.

Mirrored from: `luz_next/plans/260309-0001-audit-session-folder-pattern/`

## Open Questions (resolved)

1. **Inline code reviews** — same session folder structure (no flat files)
2. **Index key inconsistency** — fix `index-protocol.md` to document the actual `plans/index.json` format (`"plans"` key, `"version"`, `"counts"`) instead of specifying a different schema

## Session Folder Contract (single source of truth)

```
reports/{YYMMDD-HHMM}-{slug}-audit/      # hybrid (code-reviewer orchestrates)
  session.json       # metadata: date, scope, agents, verdict, findings summary
  report.md          # main merged report (code-reviewer owns)
  muji-ui-audit.md   # muji pass (epost-muji owns)
  a11y-audit.md      # a11y pass (epost-a11y-specialist owns)

reports/{YYMMDD-HHMM}-{slug}-ui-audit/   # standalone muji
  session.json
  report.md

reports/{YYMMDD-HHMM}-{slug}-code-review/  # inline code review (no sub-agents)
  session.json
  report.md
```

No more flat `.md` files at `reports/` root for any audit type.

## Root Cause

Session folder IS defined in:
- `code-review/SKILL.md:84-89` — `reports/{YYMMDD-HHMM}-{slug}-audit/`
- `epost-code-reviewer.md` — Report Path Resolution section

Contradicted by:
- `audit/references/report-template.md:6` — flat `{agent}-{date}-{slug}-ui-audit.md`
- `audit/references/delegation-templates.md:49` — flat `{reports_path}/{date}-{slug}-muji-ui-audit.md`
- `audit/references/audit-report-schema.md:1` — flat `{date}-{slug}-ui-audit.json`
- `audit/references/ui.md:72` — fallback uses `muji-ui-audit.md` (not `report.md`)
- `code-review/SKILL.md` inline path — currently flat file

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Unify output path templates (7 files) | 1h | pending | [phase-1](./phase-1-unify-output-paths.md) |
| 2 | session.json schema + index protocol update | 45m | pending | [phase-2](./phase-2-session-json-index.md) |
| 3 | epost-kit init sync | 5m | pending | [phase-3](./phase-3-kit-sync.md) |

## Success Criteria

- [ ] All audit skill files use session folder pattern consistently
- [ ] Inline code review also uses session folder (no flat files for any audit type)
- [ ] `delegation-templates.md` all templates use `{session_folder}/` paths
- [ ] `report-template.md` documents folder structure at top
- [ ] `session.json` schema defined and referenced from both ui.md and code-review/SKILL.md
- [ ] `index-protocol.md` corrected to match actual `plans/index.json` key format
- [ ] `reports/index.json` schema updated to use `path` + `files.report` + `files.session`
- [ ] `.claude/` regenerated from packages/
