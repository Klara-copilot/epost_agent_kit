---
phase: 2
title: "Update all cross-references"
effort: 1h
depends: [1]
---

# Phase 2: Update All Cross-References

## Reference Change Map

| Old Path | New Path |
|----------|----------|
| `references/ui.md` | `references/ui/workflow.md` |
| `references/a11y.md` | `references/a11y/workflow.md` |
| `references/close-ui.md` | `references/ui/close.md` |
| `references/close-a11y.md` | `references/a11y/close.md` |
| `references/checklist-web.md` | `references/ui/checklist-web-atoms.md` |
| `references/checklist-web-organism.md` | `references/ui/checklist-web-organisms.md` |
| `references/ui-known-findings-schema.md` | `references/ui/findings-schema.md` |
| `references/ios-audit-mode.md` | `references/a11y/checklist-ios.md` |
| `references/android-audit-mode.md` | `references/a11y/checklist-android.md` |
| `references/audit-report-schema.md` | `references/finding-schema.md` |
| `audit/references/ui.md` | `audit/references/ui/workflow.md` |
| `audit/references/a11y.md` | `audit/references/a11y/workflow.md` |
| `audit/references/close-ui.md` | `audit/references/ui/close.md` |
| `audit/references/close-a11y.md` | `audit/references/a11y/close.md` |
| `audit/references/ui-known-findings-schema.md` | `audit/references/ui/findings-schema.md` |
| `audit/references/ios-audit-mode.md` | `audit/references/a11y/checklist-ios.md` |
| `audit/references/android-audit-mode.md` | `audit/references/a11y/checklist-android.md` |
| `audit/references/audit-report-schema.md` | `audit/references/finding-schema.md` |
| `audit/references/audit-standards.md` | `audit/references/finding-schema.md` (already wrong ref in audit-report-schema.md) |

## Files to Update (grouped by package)

### packages/core/skills/audit/SKILL.md (25 path references)

Update all paths in:
- Step 0 flag override section (lines 53, 65-68)
- Hybrid orchestration (line 89)
- Single-agent protocol (lines 118, 127-128, 135)
- Aspect Files table (lines 151-158)
- Auto-detection table (lines 166-169)
- Variant summary table (lines 186-189)

### packages/core/skills/audit/references/ (internal cross-refs)

| File (new name) | Refs to update |
|-----------------|---------------|
| `ui/workflow.md` | `audit/references/delegation-templates.md` (OK), `references/checklist-web.md` -> `references/ui/checklist-web-atoms.md`, `references/checklist-web-organism.md` -> `references/ui/checklist-web-organisms.md`, `references/checklist-ios.md` -> `references/a11y/checklist-ios.md` (already new name but verify path), `references/checklist-android.md` -> `references/a11y/checklist-android.md`, `audit/references/output-contract.md` (OK), `audit/references/session-json-schema.md` (OK), `audit/references/ui-known-findings-schema.md` -> `audit/references/ui/findings-schema.md` |
| `a11y/workflow.md` | `references/ios-audit-mode.md` -> `references/a11y/checklist-ios.md`, `references/android-audit-mode.md` -> `references/a11y/checklist-android.md` |
| `a11y/checklist-ios.md` | `audit/references/ios-audit-mode.md` -> `audit/references/a11y/checklist-ios.md` (self-ref in standardsSource) |
| `a11y/checklist-android.md` | `audit/references/android-audit-mode.md` -> `audit/references/a11y/checklist-android.md` (self-ref in standardsSource) |
| `finding-schema.md` | `audit/references/audit-standards.md` -> `audit/references/finding-schema.md` (in standardsSource JSON example) |
| `delegation-templates.md` | `audit/references/ui.md` -> `audit/references/ui/workflow.md`, `audit/references/a11y.md` -> `audit/references/a11y/workflow.md`, `audit/references/report-template.md` (OK) |
| `report-template.md` | `audit/references/ui.md` -> `audit/references/ui/workflow.md` |
| `output-contract.md` | `audit/references/ui-known-findings-schema.md` -> `audit/references/ui/findings-schema.md` |
| `ui/close.md` | `audit/references/ui-known-findings-schema.md` -> `audit/references/ui/findings-schema.md` |

### packages/design-system/agents/epost-muji.md (7 refs)

| Old | New |
|-----|-----|
| `audit/references/ui.md` (lines 52-54, 134, 148) | `audit/references/ui/workflow.md` |
| `audit/references/output-contract.md` (lines 134, 148) | unchanged |
| `audit/references/delegation-templates.md` (lines 168, 189) | unchanged |

### packages/a11y/agents/epost-a11y-specialist.md (7 refs)

| Old | New |
|-----|-----|
| `audit/references/a11y.md` (lines 25, 74, 100) | `audit/references/a11y/workflow.md` |
| `audit/references/close-a11y.md` (line 28) | `audit/references/a11y/close.md` |
| `audit/references/ios-audit-mode.md` (line 76) | `audit/references/a11y/checklist-ios.md` |
| `audit/references/android-audit-mode.md` (line 77) | `audit/references/a11y/checklist-android.md` |
| `audit/references/output-contract.md` (line 82) | unchanged |

### packages/core/agents/epost-code-reviewer.md (2 refs — unchanged)

- `audit/references/output-contract.md` — no change
- `audit/references/delegation-templates.md` — no change

### packages/core/skills/core/references/report-standard.md (2 refs)

| Old | New |
|-----|-----|
| `audit/references/audit-report-schema.md` (lines 120, 120) | `audit/references/finding-schema.md` |

### packages/core/skills/core/references/workflow-code-review.md (0 changes)

- `audit/references/output-contract.md` — no change

### packages/core/skills/code-review/SKILL.md (0 changes)

- `audit/references/session-json-schema.md` — no change
- `audit/references/output-contract.md` — no change

### packages/core/skills/fix/references/ui-mode.md (1 ref)

| Old | New |
|-----|-----|
| `audit/references/ui-known-findings-schema.md` (line 45) | `audit/references/ui/findings-schema.md` |

### packages/core/skills/review/references/ui-mode.md (1 ref)

| Old | New |
|-----|-----|
| `audit/references/ui-known-findings-schema.md` (line 52) | `audit/references/ui/findings-schema.md` |

### packages/core/CLAUDE.snippet.md (0 changes)

- `audit/references/delegation-templates.md` — no change

### packages/a11y/skills/a11y/SKILL.md (0 changes — uses skill-level routing, not direct file refs)

Already uses patterns like "references/a11y.md in audit skill" — natural language, not file paths. No update needed.

### packages/core/skills/audit/references/ui/checklist-web-atoms.md (1 ref)

| Old | New |
|-----|-----|
| `ui-lib-dev/references/audit-standards.md` (line 5) | unchanged (different skill) |

## Validation

```bash
# Search for ALL old path patterns — must return zero matches
grep -r "references/ui\.md" packages/core/skills/audit/ packages/design-system/agents/ packages/a11y/agents/
grep -r "references/a11y\.md" packages/core/skills/audit/ packages/a11y/agents/
grep -r "references/close-ui\.md" packages/
grep -r "references/close-a11y\.md" packages/
grep -r "references/checklist-web\.md" packages/core/skills/audit/
grep -r "references/checklist-web-organism\.md" packages/
grep -r "references/ui-known-findings-schema\.md" packages/
grep -r "references/ios-audit-mode\.md" packages/
grep -r "references/android-audit-mode\.md" packages/
grep -r "references/audit-report-schema\.md" packages/
```
