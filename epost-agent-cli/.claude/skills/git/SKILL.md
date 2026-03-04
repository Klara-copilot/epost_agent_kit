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

**DO NOT show a menu. DO NOT ask what the user wants to do. Auto-detect and EXECUTE immediately.**

## Step 0 — Flag Override

If `$ARGUMENTS` starts with `--commit`: execute the git-commit workflow immediately.
If `$ARGUMENTS` starts with `--push`: execute the git-push workflow immediately.
If `$ARGUMENTS` starts with `--pr`: execute the git-pr workflow immediately.
Otherwise: continue to Step 1.

## Step 1 — Auto-Detect and Execute

Run this command:
```bash
git status --short && echo "---AHEAD---" && git log --oneline @{u}..HEAD 2>/dev/null || true && echo "---PR---" && gh pr list --head "$(git branch --show-current)" --json number --jq length 2>/dev/null || echo 0
```

**Based on output, immediately execute the matching workflow — no confirmation, no menu:**

| Git state | Action |
|-----------|--------|
| Any modified or untracked files | Execute git-commit workflow |
| Clean tree + commits ahead of remote | Execute git-push workflow |
| Clean tree + up-to-date + no open PR | Execute git-pr workflow |
| Clean tree + up-to-date + open PR exists | Report: "Branch is clean and PR already open" |
| Not a git repo | Report: "Not a git repository" |

## Step 2 — Execute Workflow

The git-commit, git-push, and git-pr reference docs are embedded in this agent's skills list.
Execute the selected workflow directly using the agent's built-in git instructions.

**If the user asks for help or lists options, only suggest git-related actions:**
- `git --commit` — stage and commit
- `git --push` — commit and push
- `git --pr` — create pull request
- `git diff` — show current changes
