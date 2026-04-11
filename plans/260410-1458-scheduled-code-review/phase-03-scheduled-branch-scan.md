---
phase: 3
title: Scheduled Branch Scan
effort: 1d
depends: [1]
---

# Phase 3 — Scheduled Branch Scan (Layer 2)

## Context

Daily non-blocking scan of branch-vs-main diff. Focus on tech debt accumulation and trend diff (new issues vs resolved since last run). Delivered as Slack digest — not per-finding spam.

## Overview

- Cron trigger via `schedule` skill (once daily, e.g. 07:00 local)
- Runs `/review` on `git diff origin/main...HEAD` for the active branch
- Compares findings against previous run's snapshot
- Emits Slack digest with `new/resolved/unchanged` counts + top 5 new findings

## Requirements

### Cron Schedule

- Daily at 07:00 (configurable)
- Created via `schedule` skill: `/schedule create "branch health scan" --cron "0 7 * * *" --action "run /review --branch-scan"`
- Skip weekends (`0 7 * * 1-5`)

### Scope

- Target: **all branches with at least 1 commit in the last 7 days** (via `git branch -r --sort=-committerdate` + age filter)
- Exclude: `kb` branch — always skipped regardless of activity
- Diff base: each branch diffed against `main` (`git diff origin/main...origin/{branch}`)
- Files: all changed files in that diff, platform auto-detected by extension
- Branch list resolved fresh on each cron run (picks up new branches, drops dead ones automatically)

### Trend Diff

- Store snapshot after each run: `reports/branch-scan-history.json`
- Format:
  ```json
  {
    "runs": [
      {
        "timestamp": "2026-04-10T07:00Z",
        "commit": "abc123",
        "findings": [{"id": "SEC-001", "file": "...", "line": 45, "severity": 4, "confidence": 0.8}]
      }
    ]
  }
  ```
- Keep last 30 runs (rolling). Delete older entries.
- Compare current run vs previous: match by `(file, line, category)` → classify as `new`, `resolved`, `unchanged`

### Non-Blocking

- Never sets exit code 1
- Never posts to PR
- Never creates issues automatically

### Slack Digest Format

```
Branch Health Scan — <date>
Scanned: 4 active branches (last 7 days) | Skipped: kb

feature/inbox-v2   New: 3 | Resolved: 1 | Total: 8
feature/auth-fix   New: 0 | Resolved: 2 | Total: 3
fix/android-crash  New: 1 | Resolved: 0 | Total: 5

Top new findings:
• [PERF-008] feature/inbox-v2 — web/dashboard.tsx:120 (sev 4, conf 0.9)
• [TS-004] fix/android-crash — AuthVM.kt:88 (sev 3, conf 1.0)

Full report: reports/branch-scan/<date>.md
```

Post channel: configurable per repo/cluster — not hardcoded. Config key: `REVIEW_SLACK_CHANNEL`.

### Filter

Use informational threshold from Phase 1: `confidence >= 0.5 AND severity >= 2`. Do NOT use blocking threshold — this is tech debt surfacing, not a gate.

## Files to Change

- **Create**: `packages/core/skills/code-review/references/branch-scan.md` — protocol doc: cron config, scope, history format, trend diff algorithm
- **Create**: `packages/core/scripts/branch-scan-digest.cjs` — Node script: load history, diff, format digest, post to Slack
- **Create**: `packages/core/skills/code-review/references/slack-digest-template.md` — template for digest message
- **Modify**: `packages/core/skills/code-review/SKILL.md` — add "Branch Scan Mode" section

## Validation

- [ ] Script runs locally with mock history file → produces correct new/resolved counts
- [ ] Slack post uses existing `connectors/slack` skill (no new deps)
- [ ] History file rotation works (31st run drops 1st)
- [ ] Trend diff matches manual diff of 2 sample runs
- [ ] Cron registered via `schedule` skill without error
- [ ] Full digest posts successfully in dry-run mode first

## Success Criteria

- Daily digest arrives in Slack channel without failures for 5 consecutive weekdays
- Digest shows trend direction (up/down) accurately
- No false "resolved" classifications from finding-id reshuffling (stable matching by file+line+category)
- History file stays under 1MB
