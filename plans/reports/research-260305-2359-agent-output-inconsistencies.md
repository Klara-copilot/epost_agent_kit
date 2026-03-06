# Research: Agent Output Inconsistencies

**Date**: 2026-03-05
**Status**: ✅ Complete — feeds PLAN-0055

---

## What Agents Currently Output

52 reports in `plans/reports/` across 11 agent types. 4 templates in `../claudekit/plans/templates/` (plan-type only).

---

## Observed Inconsistencies (with evidence)

### 1. Header block — no standard field set

| Agent | Fields present | Example |
|---|---|---|
| epost-architect | Plan path, Status (✅), Execution Time, Commits | `**Status**: ✅ COMPLETE` |
| tester | Date, Agent, Status, CWD | `**Status**: VALIDATION COMPLETE` |
| planner | YAML frontmatter (title, created, effort, status) | `status: ready-for-implementation` |
| developer | Phase, Plan path, Status — as body bullets | `- Status: completed` |

**Problem:** 4 different header patterns; none share the same field set.

### 2. Status — 5 different formats

```
✅ COMPLETE          (architect)
VALIDATION COMPLETE  (tester)
⚠️ INCOMPLETE        (tester)
completed            (developer, lowercase, no emoji)
ready-for-implementation  (planner YAML)
95% Complete         (verification)
```

### 3. Verdict — inconsistent placement and format

- Code reviewer: numeric score `9.2/10` + `APPROVE` — present
- Tester: `Overall Result: ⚠️ INCOMPLETE` — buried mid-report
- Planner: no explicit verdict — just status in YAML
- Developer: no verdict at all — ends with files list

### 4. Unresolved questions — sometimes missing

Some reports include `*Unresolved questions:*` at end; others just stop. The rule exists in agent instructions but isn't enforced structurally.

### 5. Executive Summary — present in ~60% of reports

Present in: code-reviewer, tester. Absent in: developer (phase reports), planner.

### 6. Date/time format: 3 variants

- `2026-02-10 10:35 UTC`
- `created: 2026-02-11` (YAML date)
- Absent entirely

---

## ClaudeKit Inspiration (../claudekit/plans/templates/)

ClaudeKit has 3 plan templates + usage guide:
- `feature-implementation-template.md` — feature plan structure
- `bug-fix-template.md` — bug fix plan structure
- `refactor-template.md` — refactor plan structure
- `template-usage-guide.md` — when to use each, context budget tips

**Key patterns to borrow:**
1. Context token budget awareness (`<200 words` target for summaries)
2. `Context Links` section — reference files, don't copy content
3. TODO checklist at end — explicit completion verification
4. Template selection guide (when to use which template)

**What ClaudeKit does NOT have:** report templates (agent output after work completes). epost_agent_kit needs both.

---

## 4 Report Types Needing Templates

| Type | Agent | Current problems |
|---|---|---|
| Planner summary | epost-planner | YAML frontmatter vs markdown, no verdict, inconsistent fields |
| Researcher report | epost-researcher | Varies by session; no fixed source structure |
| Code review | epost-code-reviewer | Score format varies; verdict not always present |
| Test/validation | epost-tester | PASS/FAIL not always top-level; CWD leaks in header |

---

*Unresolved questions:* None — feeds PLAN-0055 directly.
