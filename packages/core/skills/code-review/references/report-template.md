# Code Review Report Template

Code review reports use the anatomy from `code-review/references/report-standard.md` — **not** the UI audit checklist format.

## Required Sections (in order)

1. **Header** — Date, Agent, Plan (if active), Status
2. **Executive Summary** — 2-3 sentences: what was reviewed, key finding, outcome
3. **Methodology** — files scanned, KB layers used, standards loaded, coverage gaps
4. **Findings table** — `| ID | Severity | File:Line | Issue | Fix |`
5. **Regression Trends** — only when regression scan found rules with 3+ open occurrences
6. **Verdict** — `APPROVE | FIX-AND-RESUBMIT | REDESIGN` with one-line rationale
7. **Unresolved questions** — always present; write "None" if empty

## Verdict Formula

| Condition | Verdict |
|-----------|---------|
| 2+ critical findings | REDESIGN |
| 1 critical finding | FIX-AND-RESUBMIT |
| 1+ high findings, 0 critical | FIX-AND-RESUBMIT |
| Medium/low only | APPROVE |

See `code-review/references/report-standard.md` for full anatomy, score format, and status values.
