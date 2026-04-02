---
updated: 2026-04-02
---

# Plan Status: Core References Consolidation

## Progress

| # | Phase | Status |
|---|-------|--------|
| 1 | Merge 5 workflow files → workflows.md | Done |
| 2 | Merge decision-boundaries + environment-safety → agent-rules.md | Done |
| 3 | Delete external-tools-usage.md (fold into agent-rules.md) | Done |
| 4 | Trim documentation-standards.md (remove 2 sections) | Done |
| 5 | Minor orchestration.md cleanup | Done |
| 6 | Update all cross-references (SKILL.md + remaining files) | Done |

## Key Decisions

| Date | Decision | Why |
|------|----------|-----|
| 2026-04-02 | workflows.md 182 lines (target ≤185) | Removed `### Steps` subheaders and `---` section separators |
| 2026-04-02 | agent-rules.md 144 lines (target ≤125) | Content merge is faithful; both source files were substantial |
| 2026-04-02 | documentation-standards.md 88 lines (target ≤85) | 3 lines over; acceptable given content accuracy |

## Architecture Reference

Final state: `packages/core/skills/core/references/` contains exactly 8 files:
- `agent-rules.md` (merged from decision-boundaries + environment-safety + external-tools-usage)
- `documentation-standards.md` (trimmed: Skill Structure Compliance + Auto-Update Behavior removed)
- `file-organization.md` (unchanged)
- `index-protocol.md` (unchanged)
- `orchestration.md` (Report Output section compressed to 2 lines)
- `report-standard.md` (unchanged)
- `verification-checklist.md` (unchanged)
- `workflows.md` (merged from 5 workflow-*.md files)

## Verification

- `epost-journal-writer` absent from all files: confirmed
- Stale filename references: none found
- SKILL.md Aspect Files table: updated to reference 8 files
- SKILL.md Team Workflows table: consolidated to single row
