---
name: slack-digest-template
description: Slack mrkdwn template for the branch health scan digest
user-invocable: false
disable-model-invocation: true
---

# Slack Digest Template

Branch health scan posts a single message per run to `REVIEW_SLACK_CHANNEL`.

## Format (Slack mrkdwn)

```
*Branch Health Scan* — {YYYY-MM-DD}
Scanned: {N} active branches (last 7 days) | Skipped: kb

*{branch-name}*   New: {new} | Resolved: {resolved} | Total: {total}
*{branch-name}*   New: {new} | Resolved: {resolved} | Total: {total}

*Top new findings:*
• [{rule-id}] `{branch-name}` — {file}:{line} (sev {severity}, conf {confidence})
• [{rule-id}] `{branch-name}` — {file}:{line} (sev {severity}, conf {confidence})

Full report: `reports/branch-scan/{YYYY-MM-DD}.md`
```

## Rules

- Max 5 top new findings (highest severity first, then highest confidence)
- If no active branches: post `No active branches found in the last 7 days.`
- If no new findings across all branches: omit the "Top new findings" block
- Slack channel from `REVIEW_SLACK_CHANNEL` env var — never hardcoded
- If env var missing: skip posting, log `[branch-scan] REVIEW_SLACK_CHANNEL not set — skipping Slack post`

## Example Output

```
*Branch Health Scan* — 2026-04-10
Scanned: 4 active branches (last 7 days) | Skipped: kb

*feature/inbox-v2*   New: 3 | Resolved: 1 | Total: 8
*feature/auth-fix*   New: 0 | Resolved: 2 | Total: 3
*fix/android-crash*  New: 1 | Resolved: 0 | Total: 5

*Top new findings:*
• [PERF-008] `feature/inbox-v2` — web/dashboard.tsx:120 (sev 4, conf 0.9)
• [TS-004] `fix/android-crash` — AuthVM.kt:88 (sev 3, conf 1.0)

Full report: `reports/branch-scan/2026-04-10.md`
```
