---
phase: 2
title: "Code-reviewer escalation protocol"
effort: 1h
depends: [1]
---

# Phase 2: Code-Reviewer Escalation Protocol

## Overview

Update the `code-review` skill's Escalation Gate to use the delegation templates from Phase 1. Currently the gate lists WHEN to escalate but not HOW — the actual Task tool prompt and wait-for-response pattern are missing.

## Context

`code-review/SKILL.md` lines 51-65 define an Escalation Gate with a table of findings->actions, but:
- No structured prompt for the Task tool dispatch
- No "wait for response" instruction
- No guidance on merging specialist findings into the code review report
- The "delegate to epost-muji immediately" instruction has no associated context block

## Requirements

### Functional

- Replace the prose delegation instructions with structured dispatch blocks using templates from Phase 1
- Add explicit "wait and merge" protocol after each dispatch
- Add a `## Delegation Workflow` subsection to the Escalation Gate

### Non-Functional

- Keep the existing Escalation Gate table (WHEN) intact — only add HOW
- Keep it under 40 lines added

## Files to Modify

- `packages/core/skills/code-review/SKILL.md` — expand Escalation Gate section with dispatch protocol
- `packages/core/agents/epost-code-reviewer.md` — add reference to delegation-templates.md in skill refs

## Implementation Steps

1. **Expand Escalation Gate in `code-review/SKILL.md`**

   After the existing table, add:

   ```markdown
   ### Dispatch Protocol

   When escalation is triggered, use the delegation templates from `audit/references/delegation-templates.md`:

   **UI escalation (to epost-muji):**
   - Fill Template A with: files from git diff, detected component names, platform from file extensions
   - Dispatch via Task tool to epost-muji
   - Wait for dual-output report (JSON + Markdown)
   - Merge UI findings into your code review report under a "## UI Audit (delegated to epost-muji)" section
   - Do NOT duplicate or re-analyze the UI findings — reference the specialist report

   **A11y escalation (to epost-a11y-specialist):**
   - Fill Template B with: files, platform, any a11y findings already noted
   - Dispatch via Task tool to epost-a11y-specialist
   - Wait for report
   - Merge under "## A11y Audit (delegated to epost-a11y-specialist)" section

   **Critical escalation (deeper code audit):**
   - Fill Template C with: files, trigger finding, original review path
   - This is self-dispatch (same agent, deeper pass with knowledge-retrieval)
   - No Task tool needed — activate knowledge-retrieval inline and re-examine

   ### Post-Delegation Report Merging

   After specialist reports arrive:
   1. Read the specialist's Markdown report
   2. Add a delegation section to your report: agent name, report path, verdict, finding count
   3. Adjust your overall verdict: if specialist found Critical → your verdict cannot be APPROVE
   4. List specialist report paths in the report's Related Documents section
   ```

2. **Update `epost-code-reviewer.md`** agent — add `audit/references/delegation-templates.md` to Skill References section

## Todo List

- [x] Add `### Dispatch Protocol` subsection after Escalation Gate table in `packages/core/skills/code-review/SKILL.md`
- [x] Add `### Post-Delegation Report Merging` subsection
- [x] Add delegation-templates.md reference to `packages/core/agents/epost-code-reviewer.md`
- [x] Verify verdict escalation rule is clear (specialist Critical -> reviewer cannot APPROVE)

## Success Criteria

- Code-reviewer knows exactly how to dispatch to muji and a11y-specialist
- Dispatch uses structured templates, not freeform prompts
- Post-delegation merging protocol prevents duplicate analysis
- Overall verdict reflects specialist findings

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Code-reviewer dispatches too eagerly (every UI file -> muji) | Med | Gate table already defines thresholds; dispatch only on High+ |
| Specialist report format doesn't match expected structure | Low | Templates specify output format; specialists follow their own report schemas |
