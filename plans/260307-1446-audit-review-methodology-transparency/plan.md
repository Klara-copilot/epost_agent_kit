---
title: "Add methodology transparency to audit and review reports"
status: completed
created: 2026-03-07
updated: 2026-03-07
effort: 2h
phases: 2
platforms: [all]
breaking: false
---

# Audit & Review Methodology Transparency

## Problem

Audit and review reports do not disclose HOW the agent performed the review: which files were scanned, what knowledge/skills were loaded, whether reference standards were available, and where those standards come from. Users cannot assess the thoroughness or authority of a report.

## Solution

Add a mandatory **Methodology** section to the report standard and all audit/review report templates. This section answers four questions:

1. **Files Scanned** -- what files were actually read/analyzed
2. **Knowledge Used** -- which skills, references, and knowledge tiers were activated
3. **Standards Source** -- where the rules/checklists come from (skill file paths, WCAG version, OWASP, etc.)
4. **Coverage Gaps** -- what was NOT available (RAG down, missing checklist, no platform-specific rules)

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Add Methodology section to report standard + templates | 1.5h | pending | [phase-1](./phase-1-report-standard-and-templates.md) |
| 2 | Add methodology fields to audit JSON schema | 0.5h | pending | [phase-2](./phase-2-audit-json-schema.md) |

## Success Criteria

- `report-standard.md` defines Methodology as a required section (after Executive Summary, before body)
- All 4 report templates (code-review, plan, research, test) include Methodology section
- `audit-report-schema.md` JSON envelope includes `methodology` object
- `audit/references/ui.md` workflow instructs agent to populate methodology fields
- Existing report fields (Files Reviewed, Sources Analyzed) are consolidated into Methodology

## Out of Scope

- Retroactively updating existing saved reports
- Adding methodology to non-audit/review reports (e.g., journal, brainstormer)
