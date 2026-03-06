# Report Standard

Common output format for all epost agent reports.

---

## Anatomy

```markdown
# {AgentType}: {Title}

**Date**: YYYY-MM-DD HH:mm
**Agent**: {agent-name}
**Plan**: `plans/{dir}/plan.md`     <- omit if no active plan
**Status**: COMPLETE | PARTIAL | FAILED | IN PROGRESS

---

## Executive Summary

2-3 sentences. What was done, what was found, what the outcome is.
<200 words.

---

{Body — agent-specific sections}

---

## Verdict

**{WORD}** — one-line justification.

---

*Unresolved questions:*
- Question (or "None")
```

---

## Status Values

| Status | Meaning | When |
|--------|---------|------|
| COMPLETE | All work done, no blockers | Default success |
| PARTIAL | Done with caveats or skipped items | Partial execution |
| FAILED | Could not complete, blocker hit | Hard failure |
| IN PROGRESS | Mid-execution report | Phase checkpoints |

---

## Verdict Word — Per Agent Type

| Agent | Valid verdicts |
|-------|---------------|
| epost-planner | `READY` `NEEDS-RESEARCH` `BLOCKED` |
| epost-researcher | `ACTIONABLE` `INCONCLUSIVE` `NEEDS-MORE` |
| epost-code-reviewer | `APPROVE` `FIX-AND-RESUBMIT` `REDESIGN` |
| epost-tester | `PASS` `FAIL` `PARTIAL` |

---

## Per-Agent Templates

| Agent | Template |
|-------|---------|
| epost-planner | `plan/references/report-template.md` |
| epost-researcher | `research/references/report-template.md` |
| epost-code-reviewer | `code-review/references/report-template.md` |
| epost-tester | `test/references/report-template.md` |

---

## Rules

- Header block always comes first (Date, Agent, Plan, Status)
- Executive Summary always the first body section
- Verdict always the last section before unresolved questions
- Unresolved questions footer always present (write "None" if empty)
- No freeform status variants — use the 4 values above only
