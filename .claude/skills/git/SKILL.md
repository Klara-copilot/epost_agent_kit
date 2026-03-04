---
name: git
description: "(ePost) Git workflow — auto-detects commit, push, or PR"
user-invocable: true
context: fork
agent: epost-git-manager
metadata:
  argument-hint: "[--commit | --push | --pr]"
  connections:
    enhances: [git-commit, git-push, git-pr]
---

# Git — Unified Git Workflow Command

Auto-detect and execute the appropriate git workflow.

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--commit`: dispatch `git-commit` directly.
If `$ARGUMENTS` starts with `--push`: dispatch `git-push` directly.
If `$ARGUMENTS` starts with `--pr`: dispatch `git-pr` directly.
Otherwise: continue to Auto-Detection.

## Auto-Detection

1. Run `git status` and `git log --oneline @{u}..HEAD 2>/dev/null`
2. Check `gh pr list --head $(git branch --show-current) --json number 2>/dev/null`

### Decision Matrix

| Condition | Dispatch |
|-----------|----------|
| Staged or unstaged changes exist | `git-commit` |
| Clean working tree, commits ahead of remote | `git-push` |
| Feature branch, no open PR, pushed to remote | `git-pr` |
| Feature branch, unpushed commits, no PR | `git-push` (then suggest `--pr`) |
| Nothing to do (clean, up to date) | Report "nothing to commit or push" |

## Execution

Load the reference documentation for the dispatched variant and execute its workflow.
