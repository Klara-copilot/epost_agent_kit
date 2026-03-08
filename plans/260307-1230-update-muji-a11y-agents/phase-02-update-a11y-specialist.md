---
phase: 2
title: "Update epost-a11y-specialist agent"
effort: 45m
depends: []
---

# Phase 2: Update epost-a11y-specialist Agent

## Context Links
- [Plan](./plan.md)
- [Research report](../260307-1159-update-code-reviewer/reports/epost-researcher-260307-1227-muji-a11y-agent-gaps.md)
- [Current agent](../../packages/a11y/agents/epost-a11y-specialist.md) (71 lines)

## Overview
- Priority: P1
- Status: Pending
- Effort: 45m
- Description: Add task-type routing table with intent signals, knowledge-retrieval integration, cross-delegation rules

## Requirements

### Functional
- Add task-type routing table with intent-to-mode mapping
- Add knowledge-retrieval activation step before audit mode
- Add cross-delegation rules (to code-reviewer for non-a11y, to muji for component defects)
- Add `knowledge-retrieval` to skills list in frontmatter
- Document skill-discovery lazy-loading for platform skills

### Non-Functional
- Additive only — preserve existing content
- Keep agent under 120 lines total
- Reference skills, don't duplicate content

## Related Code Files

### Files to Modify
- `packages/a11y/agents/epost-a11y-specialist.md` — All changes in this file

### Files to Create
- None

### Files to Delete
- None

## Implementation Steps

1. **Add `knowledge-retrieval` to skills list**
   - Change line 6: `skills: [core, skill-discovery, knowledge-retrieval, a11y]`

2. **Add Task-Type Routing Table** (insert after Platform Detection, before "When to Invoke")
   ```markdown
   ## Task-Type Routing

   Detect mode from user intent:

   | Mode | Signals | Skill Chain |
   |------|---------|-------------|
   | Guidance | "how to", "best practice", "should I", `review` command | `a11y` + platform skill via skill-discovery |
   | Audit | "audit", "check", "scan", staged files, `/audit --a11y` | `knowledge-retrieval` → `a11y` + platform skill |
   | Fix | "fix", "resolve", finding ID, `/fix --a11y` | `a11y` + platform skill |
   | Close | "close", "resolved", "#ID", `/audit --close` | `a11y` (findings DB only) |

   For Audit and Fix modes: activate knowledge-retrieval first to load prior findings and conventions.
   ```

3. **Add Knowledge-Retrieval Step** (insert before Operating Modes table or after routing table)
   ```markdown
   ## Pre-Audit Knowledge Load

   Before audit or fix mode, activate knowledge-retrieval:
   - L1: Read `.epost-data/a11y/known-findings.json` for prior findings
   - L1: Read `docs/` for a11y conventions and decisions
   - L2: RAG query for existing accessibility patterns in codebase
   - L4 fallback: Grep/Glob if RAG unavailable
   ```

4. **Add Cross-Delegation Rules** (insert after Shared Constraints)
   ```markdown
   ## Cross-Delegation

   ### Escalate to epost-code-reviewer
   When a11y audit finds critical non-a11y issues (security vulnerabilities, data loss risks, performance problems):
   - Flag the finding with category and severity
   - Do NOT attempt to fix — outside a11y scope
   - Continue a11y audit for remaining files

   ### Escalate to epost-muji
   When a11y violation is caused by a design system component defect (missing aria-label in shared component, contrast failure in theme token):
   - Identify the component and library path (`libs/*-theme/`)
   - Delegate to epost-muji with component name + violation details
   - Consumer code fix will follow after component is patched

   ### Scope Boundary
   This agent handles accessibility only. General code quality, architecture, and UI design issues are out of scope — route them to the appropriate specialist.
   ```

5. **Add Skill Activation Note** (insert in Knowledge Base section, after platform skills)
   ```markdown
   Platform skills (ios-a11y, android-a11y, web-a11y) are lazy-loaded via skill-discovery based on detected platform. Only ONE platform skill loads per task.
   ```

## Todo List
- [ ] Add `knowledge-retrieval` to skills frontmatter
- [ ] Insert task-type routing table
- [ ] Insert pre-audit knowledge load section
- [ ] Insert cross-delegation rules section
- [ ] Add skill activation note to Knowledge Base
- [ ] Verify total line count under 120

## Success Criteria
- Agent has 4-mode routing table with intent signals
- `knowledge-retrieval` in skills list
- Non-a11y findings explicitly escalated to code-reviewer
- Component defects explicitly delegated to muji
- Skill-discovery lazy-loading documented

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-delegation (a11y specialist delegates too aggressively) | Med | "Critical only" threshold for cross-delegation |
| Agent too long | Low | Current 71 lines + ~45 lines additions = ~116 lines, under limit |

## Security Considerations
- None identified

## Next Steps
- Run `epost-kit init` to regenerate `.claude/agents/epost-a11y-specialist.md`
