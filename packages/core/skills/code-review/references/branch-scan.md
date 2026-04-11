---
name: branch-scan
description: Protocol for the daily branch health scan — cron config, branch discovery, history format, trend diff algorithm
user-invocable: false
disable-model-invocation: true
---

# Branch Scan Protocol

Daily non-blocking scan of all active branches vs `main`. Surfaces tech debt trends as a Slack digest without blocking CI or creating issues.

## Cron Setup

Register after deploy via the `schedule` skill:

```bash
# Weekdays at 07:00 local time
node packages/core/scripts/branch-scan-digest.cjs
```

Schedule command:
```
/schedule create "branch health scan" --cron "0 7 * * 1-5" --action "node packages/core/scripts/branch-scan-digest.cjs"
```

Configuring the schedule is the user's responsibility — this phase only ships the script.

## Branch Discovery

```bash
git fetch --all --prune
git branch -r --sort=-committerdate --format='%(refname:short) %(committerdate:unix)'
```

Filter: keep branches where `now - committerdate <= 7 days (604800 seconds)`.
Strip `origin/` prefix from remote branch names.

**Hardcoded exclusions** (not configurable — YAGNI):
- `kb`
- `main`
- `HEAD`

Diff base for each branch:

```bash
git diff origin/main...origin/{branch} --name-only  # file list
git diff origin/main...origin/{branch}               # full diff content
```

## Confidence Filter

Apply informational threshold from `confidence-scoring.md`:

```
confidence >= 0.5 AND severity >= 2
```

This is tech debt surfacing — never use the blocking threshold (`confidence >= 0.8 AND severity >= 4`).

## History File

Location: `reports/branch-scan-history.json`

### Schema

```json
{
  "schemaVersion": "1.0.0",
  "runs": [
    {
      "timestamp": "2026-04-10T07:00:00Z",
      "branches": {
        "feature/inbox-v2": {
          "commit": "abc123",
          "findings": [
            {
              "id": "SEC-001",
              "file": "src/auth.ts",
              "line": 45,
              "category": "SEC",
              "severity": 4,
              "confidence": 0.8
            }
          ]
        }
      }
    }
  ]
}
```

### Rotation

Keep last 30 runs. On every write:
1. Append new run to `runs[]`
2. If `runs.length > 30`, drop `runs[0]` (oldest)

This keeps the file under ~1 MB for typical scan volumes.

## Trend Diff Algorithm

Compares current run vs the immediately preceding run for each branch.

### Matching Key

A finding is identified by `(file, line, category)` — NOT by `id` alone (IDs may shift between LLM runs).

```
key = `${finding.file}:${finding.line}:${finding.category}`
```

### Classification

```
previous = set of keys from last run's findings for this branch
current  = set of keys from this run's findings for this branch

new       = current - previous       (appeared this run)
resolved  = previous - current       (gone this run)
unchanged = current ∩ previous       (present in both)
total     = current.size
```

### First Run (no history)

When no previous run exists for a branch: all current findings are classified as `new`. `resolved = 0`, `unchanged = 0`.

### Branch Not in Previous Run

If the branch was not scanned last time (new branch): same as first run — all findings are `new`.

## Slack Digest Template

See `references/slack-digest-template.md` for the mrkdwn format.

Post to `REVIEW_SLACK_CHANNEL` env var. If env var is not set, log a warning and skip posting (non-fatal).

## Non-Blocking Contract

- Always exits with code `0`
- Never posts to PRs
- Never creates GitHub/Linear issues
- Never modifies branch state

## Output Files

| File | Purpose |
|------|---------|
| `reports/branch-scan-history.json` | Rolling 30-run history |
| `reports/branch-scan/{YYYY-MM-DD}.md` | Human-readable per-day report |

### Per-Day Report Format (`reports/branch-scan/YYYY-MM-DD.md`)

```markdown
# Branch Health Scan — YYYY-MM-DD

Scanned: N branches | Skipped: kb

## Summary

| Branch | New | Resolved | Unchanged | Total |
|--------|-----|----------|-----------|-------|
| feature/inbox-v2 | 3 | 1 | 5 | 8 |

## Top New Findings

| Rule | Branch | File:Line | Sev | Conf |
|------|--------|-----------|-----|------|
| PERF-008 | feature/inbox-v2 | web/dashboard.tsx:120 | 4 | 0.9 |
```
