---
phase: 3
title: "Specialist receiving protocol (muji + a11y)"
effort: 1.5h
depends: [1]
---

# Phase 3: Specialist Receiving Protocol

## Overview

Add a "delegated audit intake" section to epost-muji and epost-a11y-specialist agents so they know how to receive delegated work, parse the expectations block, and report back properly.

## Context

Currently both agents have full audit workflows but no protocol for when they're invoked as delegates (vs. direct user invocation). Key differences when delegated:
- Scope is pre-defined by the calling agent (don't discover scope yourself)
- Output format may have specific requirements from the delegation template
- Report-back is to another agent, not the user
- The specialist should focus on its domain expertise and trust the caller's scoping

## Requirements

### Functional

- Add `## Delegated Audit Intake` section to epost-muji agent
- Add `## Delegated Audit Intake` section to epost-a11y-specialist agent
- Define how to parse the delegation context block from templates
- Define report-back format (what the calling agent expects)
- Add cross-delegation rules: muji collects a11y findings -> notes for a11y-specialist; a11y finds structural issues -> notes for muji

### Non-Functional

- Intake protocol under 25 lines per agent
- Does not change existing direct-invocation behavior
- Expectations-based: specialist decides HOW to execute, delegation only says WHAT to evaluate

## Files to Modify

- `packages/design-system/agents/epost-muji.md` — add Delegated Audit Intake section
- `packages/a11y/agents/epost-a11y-specialist.md` — add Delegated Audit Intake section

## Implementation Steps

1. **Add to epost-muji.md** — after the "When Acting as Auditor" section:

   ```markdown
   ## Delegated Audit Intake

   When invoked via Task tool from another agent (code-reviewer, project-manager):

   1. **Parse delegation block** — extract: Scope (files), Component(s), Mode, Platform, Expectations, Boundaries
   2. **Respect scope** — audit ONLY the files/components listed, do not expand scope
   3. **Follow your workflow** — use audit/references/ui.md as normal, but scoped to delegation
   4. **Collect cross-domain findings** — if A11Y issues found, list them in report under "## A11Y Findings (for epost-a11y-specialist)" with finding IDs, file:line, issue summary. Do not attempt WCAG remediation.
   5. **Report format** — produce your standard dual-output (JSON + Markdown) at the reports path specified in delegation
   6. **No code changes** — when delegated, always analyze-and-report. Never modify source files unless the delegation explicitly requests fixes.

   The calling agent will merge your findings into its own report. Your verdict (pass/fix-and-reaudit/redesign) feeds into the caller's overall verdict.
   ```

2. **Add to epost-a11y-specialist.md** — after the "Cross-Delegation" section:

   ```markdown
   ## Delegated Audit Intake

   When invoked via Task tool from another agent (code-reviewer, muji):

   1. **Parse delegation block** — extract: Scope (files), Platform, Context (from_ui_audit/from_code_review), Prior findings
   2. **Respect scope** — audit ONLY the files listed
   3. **Follow your workflow** — use audit/references/a11y.md + platform mode file as normal
   4. **Leverage prior findings** — if delegation includes finding_ids from a previous audit, check for regressions and avoid re-flagging known-acknowledged issues
   5. **Collect cross-domain findings** — if structural/component issues found (not a11y), list under "## Structural Findings (for epost-muji or epost-code-reviewer)" with file:line and issue summary
   6. **Report format** — standard dual-output at reports path from delegation
   7. **Scope boundary** — fix ONLY accessibility attributes. Never refactor logic, rename variables, or reorganize code.

   The calling agent incorporates your findings. Your block_pr recommendation feeds into the caller's verdict.
   ```

3. **Add bidirectional delegation awareness** — in both agents, add a note in the Task-Type Routing table:

   For muji:
   ```
   | Delegated audit | Task tool invocation with delegation context block | Parse intake → run scoped audit → report back |
   ```

   For a11y-specialist:
   ```
   | Delegated audit | Task tool invocation with delegation context block | Parse intake → run scoped audit → report back |
   ```

## Todo List

- [x] Add `## Delegated Audit Intake` to `packages/design-system/agents/epost-muji.md`
- [x] Add `## Delegated Audit Intake` to `packages/a11y/agents/epost-a11y-specialist.md`
- [x] Add delegated audit row to Task-Type Routing table in both agents
- [x] Verify cross-delegation notes (muji -> a11y, a11y -> muji/code-reviewer)
- [x] Verify all edits in `packages/` not `.claude/`

## Success Criteria

- Both specialists have explicit intake protocol for delegated work
- Scope is respected (no scope expansion during delegated audits)
- Cross-domain findings are collected and noted, not fixed inline
- Report-back format is clear so calling agent can merge findings
- Existing direct-invocation behavior unchanged

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Specialists ignore intake protocol in practice | Med | Intake section is prominent; delegation template references it |
| Scope too restrictive — specialist misses adjacent issues | Low | Specialists can note "adjacent concern" in report without auditing it |
| Report format mismatch between specialist and caller | Low | Both use standard dual-output format; merger reads Markdown |
