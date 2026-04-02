---
title: "Core References Consolidation: 14 → 8 Files"
status: active
created: 2026-04-02
updated: 2026-04-01
effort: 1h30m
phases: 6
platforms: [all]
breaking: false
blocks: []
blockedBy: []
---

# Core References Consolidation: 14 → 8 Files

Merge overlapping reference files, trim misplaced content. ~350 line savings (~22%).
All agents load the core skill — every line saved reduces per-invocation token cost.

## Before / After

| New File | Source | Target Lines |
|----------|--------|-------------|
| `workflows.md` | 5 × workflow-*.md | ~180 |
| `agent-rules.md` | decision-boundaries + environment-safety + external-tools (2 lines) | ~120 |
| `documentation-standards.md` | trimmed (2 sections removed) | ~80 |
| `orchestration.md` | stub Report Output removed | ~296 |
| `report-standard.md` | unchanged | 166 |
| `file-organization.md` | unchanged | 101 |
| `index-protocol.md` | unchanged | 132 |
| `verification-checklist.md` | unchanged | 76 |

**Deleted**: workflow-feature-development.md, workflow-bug-fixing.md, workflow-code-review.md, workflow-architecture-review.md, workflow-project-init.md, decision-boundaries.md, environment-safety.md, external-tools-usage.md

## Phases

| # | Phase | Effort | Depends | Status |
|---|-------|--------|---------|--------|
| 1 | Merge 5 workflow files → workflows.md | 30m | — | pending |
| 2 | Merge decision-boundaries + environment-safety → agent-rules.md | 20m | — | pending |
| 3 | Delete external-tools-usage.md (fold 2 lines into agent-rules.md) | 5m | 2 | pending |
| 4 | Trim documentation-standards.md (remove 2 sections) | 10m | — | pending |
| 5 | Minor orchestration.md cleanup | 10m | — | pending |
| 6 | Update all cross-references (SKILL.md + remaining files) | 15m | 1,2,3,4,5 | pending |

## Success Criteria

- `packages/core/skills/core/references/` contains exactly 8 files
- No references to deleted filenames remain in any file under core/
- `epost-journal-writer` removed from all workflow content
- All rules preserved — no information dropped
- SKILL.md updated (Aspect Files table, Team Workflows table)
