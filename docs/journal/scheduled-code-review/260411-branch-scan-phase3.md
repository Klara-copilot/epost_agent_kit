# Branch Health Scan — Phase 3 Implementation

**Date**: 2026-04-11
**Agent**: epost-fullstack-developer
**Epic**: scheduled-code-review
**Plan**: plans/260410-1458-scheduled-code-review/

## What was implemented

Daily cron-triggered branch health scan (`branch-scan-digest.cjs`). The script:
- Discovers remote branches active in the last 7 days (skips `kb`, `main`, `master`, `origin` bare entry)
- Diffs each branch vs `main`, applies confidence filter (`conf >= 0.5, sev >= 2`)
- Computes trend diff (new/resolved/unchanged) via stable `file:line:category` key matching
- Writes `reports/branch-scan/{date}.md` daily report
- Updates `reports/branch-scan-history.json` (rolling 30 runs)
- Posts Slack mrkdwn digest to `REVIEW_SLACK_CHANNEL`

Reference docs created:
- `packages/core/skills/code-review/references/branch-scan.md` — protocol doc
- `packages/core/skills/code-review/references/slack-digest-template.md` — digest format spec
- `packages/core/skills/code-review/SKILL.md` — added Branch Scan Mode section

## Key decisions and why

- **Stable matching key = `file:line:category`** (not finding `id`)
  **Why**: LLM-generated IDs shift between runs; file+line+category is stable across independent review passes. Prevents false "resolved" classifications.

- **`master` added to hardcoded exclusions alongside `main`**
  **Why**: This repo uses `master` as its default branch. The exclusion set needs both to work across repos. YAGNI — not made configurable.

- **`origin` bare entry excluded**
  **Why**: `git branch -r --format='%(refname:short)'` emits a bare `origin` entry (the remote itself, not a branch). Without excluding it, `origin` appeared as a scannable branch.

- **LLM review stubbed via known-findings cross-reference**
  **Why**: The Phase 3 spec focuses on the orchestration layer (discovery, trend, Slack). Full LLM invocation per branch is Phase 2 territory. Script is structured so `reviewBranchDiff()` can be replaced with a real LLM call later.

- **Always exits 0**
  **Why**: Non-blocking by spec. A Slack failure or empty scan should never fail CI.

## What almost went wrong

- `git branch -r --format` emits a bare `origin` line (not `origin/{branch}`) — had to add it to exclusions after seeing it appear in dry-run output.
- `main` vs `master` as default branch — only `main` was in the initial exclusion set; `master` was missing until dry-run surfaced it.
