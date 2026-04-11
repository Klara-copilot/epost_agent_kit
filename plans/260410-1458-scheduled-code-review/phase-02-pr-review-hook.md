---
phase: 2
title: PR Review Hook
effort: 1.5d
depends: [1]
---

# Phase 2 — PR Review Hook (Layer 1)

## Context

Triggers code review automatically on PR events. Scopes to changed files only. Posts structured comment with findings. Blocks only on HIGH severity + HIGH confidence per Phase 1 gate.

## Overview

- GitHub Actions workflow dispatches to `epost-code-reviewer` agent
- Hook script parses PR diff, detects platforms, invokes `/review --files <list> --pr-mode`
- Output formatted as PR comment with blocking/informational sections
- Exit code: 1 (block) only if blocking findings exist, 0 otherwise

## Requirements

### Trigger Events

- `pull_request.opened`
- `pull_request.synchronize` (new commits pushed)
- `pull_request.reopened`
- NOT on every commit, NOT on draft PRs

### Diff Scoping

- Use `git diff --name-only origin/<base>...HEAD` to list changed files
- Pass file list explicitly to `/review --files <list>` (existing flag per code-review standards)
- Skip files matching `.gitignore`-style exclusions: `**/*.lock`, `**/*.generated.*`, `**/node_modules/**`

### Platform Auto-Detection

Match extensions to platform hint for LLM context scoping:

| Extension | Platform | Skills to suggest |
|-----------|----------|-------------------|
| `.tsx .ts .jsx .js .scss .css` | web | web-frontend, web-nextjs |
| `.swift` | ios | ios-development |
| `.kt .kts` | android | android-development |
| `.java` | backend | backend-javaee |

Mixed PR → pass all detected platforms as `--platforms web,ios`.

### PR Comment Format

```
## Code Review (automated)

**Blocking** (N): <must fix before merge>
- [SEC-001] src/auth.ts:45 — <message> (severity 5, confidence 0.9)

**Informational** (M): <consider addressing>
- [PERF-003] ...

**Stats**: N files reviewed, {blocking}, {informational}, {dropped} low-confidence.
Confidence engine: 2-pass consensus active. Full report: <link>
```

### Blocking Gate

- Read findings from Phase 1 output
- Filter: `confidence >= 0.8 AND severity >= 4 AND confirmed_by >= 2`
- If any match → exit code 1, comment header: "Blocking issues found — human review required"
- If zero → exit code 0, comment header: "No blocking issues — human review recommended"
- Never auto-approve, never auto-merge

### Human-in-Loop Enforcement

- Comment explicitly states: "This is an automated review. A human reviewer must approve before merge."
- Hook never calls GitHub approval API

## Files to Change

- **Create**: `packages/core/hooks/pr-review-trigger.cjs` — Node script: parse env, detect platforms, spawn agent, format comment, post via `gh pr comment`, set exit code
- **Create**: `packages/core/skills/code-review/references/pr-gate.md` — doc of gate logic, comment format, trigger contract
- **Create**: `packages/core/workflows/github/pr-review.yml` — GitHub Actions workflow that runs the hook on PR events
- **Modify**: `packages/core/settings/hooks.json` — register `pr-review-trigger` hook for `PR` event (if harness supports; otherwise document the GHA workflow is the trigger)
- **Modify**: `packages/core/skills/code-review/SKILL.md` — add "PR Mode" section linking to pr-gate.md

## Validation

- [ ] Hook script runs locally against a test PR diff and produces comment text
- [ ] Blocking exit code matches filter logic (unit test with mock findings)
- [ ] Platform detection test: mixed-platform PR lists all platforms
- [ ] GHA workflow syntax validated (`gh workflow view` or `actionlint`)
- [ ] End-to-end dogfood: open a PR in this repo, verify comment appears
- [ ] Verify comment never contains auto-approve language

## Success Criteria

- PR review triggers automatically on open/sync
- Comment includes severity + confidence on every surfaced finding
- Zero false-positive blocks on dogfood sample of 10 PRs
- Human reviewer step still required for merge (GitHub branch protection unchanged)
