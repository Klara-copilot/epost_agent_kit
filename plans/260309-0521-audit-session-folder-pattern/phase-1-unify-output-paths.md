---
phase: 1
title: "Unify output path templates across audit kit files"
effort: 1h
depends: []
status: pending
---

# Phase 1: Unify Output Path Templates

## Files

1. `packages/core/skills/audit/references/report-template.md` — remove flat filename, add folder structure
2. `packages/core/skills/audit/references/delegation-templates.md` — all templates → `{session_folder}/`
3. `packages/core/skills/audit/references/audit-report-schema.md` — remove flat filename references
4. `packages/core/skills/audit/references/ui.md` — fix fallback path (line 72: `muji-ui-audit.md` → `report.md`)
5. `packages/core/skills/audit/SKILL.md` — add path clarification to consolidation note
6. `packages/core/skills/code-review/SKILL.md` — inline review → session folder (not flat file)
7. `packages/core/agents/epost-code-reviewer.md` — update inline review path in Report Path Resolution
