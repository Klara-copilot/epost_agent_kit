---
phase: 1
title: "Update epost-muji agent"
effort: 45m
depends: []
---

# Phase 1: Update epost-muji Agent

## Context Links
- [Plan](./plan.md)
- [Research report](../260307-1159-update-code-reviewer/reports/epost-researcher-260307-1227-muji-a11y-agent-gaps.md)
- [Current agent](../../packages/design-system/agents/epost-muji.md) (116 lines)

## Overview
- Priority: P1
- Status: Pending
- Effort: 45m
- Description: Add task-type routing table, Flow 3 (Code Review), knowledge-retrieval integration, a11y delegation rule

## Requirements

### Functional
- Add task-type routing table after line 13 (before Flow 1)
- Add Flow 3: Code Review (UI audit escalated from epost-code-reviewer)
- Add knowledge-retrieval activation step to Consumer Audit section
- Add a11y delegation rule to Consumer Audit section
- Add `knowledge-retrieval` to skills list in frontmatter

### Non-Functional
- Additive only — do not rewrite existing Flows 1-2
- Keep agent under 160 lines total
- Reference skills, don't duplicate content

## Related Code Files

### Files to Modify
- `packages/design-system/agents/epost-muji.md` — All changes in this file

### Files to Create
- None

### Files to Delete
- None

## Implementation Steps

1. **Add `knowledge-retrieval` to skills list**
   - Change line 6: `skills: [core, skill-discovery, knowledge-retrieval, figma, design-tokens, ui-lib-dev, ui-guidance, audit]`

2. **Add Task-Type Routing Table** (insert after line 13, before Flow 1)
   ```markdown
   ## Task-Type Routing

   | Flow | Signals | Skills |
   |------|---------|--------|
   | Library Dev | Working in `libs/*-theme/`, `/docs-component`, component CRUD | `ui-lib-dev`, `figma`, `design-tokens` |
   | Consumer Audit | "audit", "review UI", staged consumer files, escalated from code-reviewer | `audit`, `ui-guidance`, `knowledge-retrieval` |
   | Code Review | Delegated from epost-code-reviewer for UI code issues | `audit`, `ui-guidance`, `knowledge-retrieval` |
   | Consumer Guidance | "how to use", component questions, integration help | Platform `*-ui-lib` via skill-discovery |
   ```

3. **Add knowledge-retrieval step to Consumer Audit** (insert before the numbered checklist, ~line 71)
   ```markdown
   Before auditing, activate knowledge-retrieval:
   - L1: Read `docs/` for conventions and prior findings
   - L2: RAG query for existing component patterns and token values
   - L4 fallback: Grep/Glob if RAG unavailable
   ```

4. **Add a11y delegation rule to Consumer Audit** (insert after item 8, ~line 81)
   ```markdown
   ### A11y Delegation
   If audit finds accessibility violations (missing labels, contrast failures, focus order issues):
   - Do NOT fix inline — delegate to epost-a11y-specialist with specific findings
   - Provide: file paths, violation type, severity estimate
   - Continue audit for remaining non-a11y categories
   ```

5. **Add Flow 3: Code Review** (insert after Flow 2, before Platform Detection)
   ```markdown
   ## Flow 3: Code Review (Escalation)

   Activated when epost-code-reviewer delegates UI code issues to muji.

   ### Process
   1. Receive delegation context (files, specific UI concerns)
   2. Activate knowledge-retrieval (L1 docs/ + L2 RAG)
   3. Run Consumer Audit checklist on flagged files
   4. Return findings to code-reviewer as structured report

   ### Triggers
   - Delegated from epost-code-reviewer for UI-specific code issues
   - Code review finds design system misuse, token violations, component architecture problems

   ### Skills Used
   - `audit` — Audit framework
   - `ui-guidance` — Design system integration consulting
   - `knowledge-retrieval` — Prior patterns and conventions
   ```

## Todo List
- [ ] Add `knowledge-retrieval` to skills frontmatter
- [ ] Insert task-type routing table
- [ ] Insert knowledge-retrieval step in Consumer Audit
- [ ] Insert a11y delegation rule in Consumer Audit
- [ ] Insert Flow 3: Code Review section
- [ ] Verify total line count under 160

## Success Criteria
- Agent has 3 flows + routing table
- `knowledge-retrieval` in skills list
- A11y findings explicitly delegated to epost-a11y-specialist
- No existing content removed or rewritten

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent too long (token budget) | Med | Keep additions concise, reference skills |
| Routing table conflicts with skill-discovery | Low | Routing table is intent-level, skill-discovery handles platform |

## Security Considerations
- None identified

## Next Steps
- Run `epost-kit init` to regenerate `.claude/agents/epost-muji.md`
