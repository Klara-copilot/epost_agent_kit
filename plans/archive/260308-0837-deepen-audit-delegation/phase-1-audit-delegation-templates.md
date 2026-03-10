---
phase: 1
title: "Delegation handoff templates in audit skill"
effort: 1.5h
depends: []
---

# Phase 1: Audit Delegation Templates

## Overview

Add structured delegation templates to `audit/SKILL.md` and `audit/references/ui.md` so that when audit dispatches work to a specialist, the handoff includes concise expectations (not commands).

## Context

Currently `audit/SKILL.md` line 51 says "delegate to epost-muji" but provides no template for what context to pass. The specialist receives a bare request and must guess scope, output format, and boundaries.

## Requirements

### Functional

- Add a `## Delegation Protocol` section to `packages/design-system/skills/ui-lib-dev/references/audit-standards.md` (or a new reference file)
- Define 3 delegation templates: UI audit, A11y audit, Code audit escalation
- Each template specifies: scope (files/components), expectations (what to evaluate), output format (report schema ref), boundaries (what NOT to do)

### Non-Functional

- Templates are concise (under 20 lines each)
- Templates use placeholders (`{component_name}`, `{file_list}`, `{calling_agent}`) so they're reusable

## Files to Modify

- `packages/core/skills/audit/SKILL.md` — add `## Delegation Protocol` section after Step 0 Flag Override
- `packages/core/skills/audit/references/ui.md` — add delegation context block to Step 0 INTEGRITY gate output (when delegating from code-reviewer)

## Files to Create

- `packages/core/skills/audit/references/delegation-templates.md` — standalone reference with all 3 templates

## Implementation Steps

1. **Create `delegation-templates.md`** with 3 structured templates:

   **Template A: UI Component Audit Delegation (to epost-muji)**
   ```
   ## Delegated UI Audit
   Scope: {file_list}
   Component(s): {component_names}
   Mode: {library | consumer}
   Platform: {web | ios | android | all}

   Expectations:
   - Run full audit workflow per audit/references/ui.md
   - Apply audit-standards.md rules for detected mode
   - Produce dual-output report (JSON + Markdown)

   Boundaries:
   - Analyze and report only — do not modify source files
   - If A11Y findings emerge, collect them and note for a11y-specialist delegation

   Report back to: {calling_agent}
   Output path: {reports_path}
   ```

   **Template B: A11y Audit Delegation (to epost-a11y-specialist)**
   ```
   ## Delegated A11y Audit
   Scope: {file_list}
   Platform: {web | ios | android}
   Context: {from_ui_audit | from_code_review | direct}
   Prior findings: {finding_ids if any}

   Expectations:
   - Run audit per audit/references/a11y.md + platform mode file
   - Check against known-findings database for regressions
   - Produce dual-output report (JSON + Markdown)

   Boundaries:
   - Fix ONLY accessibility attributes if in fix mode
   - Do not refactor logic, rename variables, or reorganize code

   Report back to: {calling_agent}
   ```

   **Template C: Code Audit Escalation (deeper review)**
   ```
   ## Escalated Code Audit
   Scope: {file_list}
   Trigger: {critical_finding_summary}
   Original review: {review_report_path}

   Expectations:
   - Activate knowledge-retrieval for deeper context
   - Focus on: {security | performance | architecture} based on trigger
   - Cross-reference with docs/ conventions and prior findings

   Boundaries:
   - Report only — no code modifications
   - Do not re-review areas already covered in original review
   ```

2. **Update `audit/SKILL.md`** — add reference to delegation-templates.md in the Aspect Files table and add a brief `## Delegation Protocol` section:
   ```
   When dispatching to a specialist agent:
   1. Select the matching template from references/delegation-templates.md
   2. Fill in all placeholders from current audit context
   3. Dispatch via Task tool to the specialist agent
   4. Wait for specialist report before continuing
   5. Incorporate specialist findings into your own report output
   ```

3. **Update `audit/references/ui.md`** — in Step 0 INTEGRITY Gate, add note that when this workflow is invoked via delegation (not direct `/audit --ui`), read the delegation context block for scope/expectations.

## Todo List

- [x] Create `packages/core/skills/audit/references/delegation-templates.md` with 3 templates (5 total: A–E)
- [x] Add `## Delegation Protocol` section to `packages/core/skills/audit/SKILL.md`
- [x] Add delegation-templates.md to Aspect Files table in audit SKILL.md
- [x] Add delegation intake note to `packages/core/skills/audit/references/ui.md` Step 0
- [x] Verify all file paths reference `packages/` not `.claude/`

## Success Criteria

- 3 delegation templates exist with clear placeholders
- audit/SKILL.md references the templates and has a delegation protocol section
- Templates are concise (each under 20 lines)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Templates too prescriptive — specialists can't use their own judgment | Med | Use "expectations" framing, not step-by-step commands |
| Template drift from actual agent capabilities | Low | Templates reference skill files, not hardcoded steps |
