---
name: git
description: (ePost) Use when user says "commit", "push", "create a PR", "ship it", "done", "merge", "open a pull request", or "ship this feature" — runs the appropriate git workflow (commit, push, PR creation, or full ship pipeline)
user-invocable: true
context: fork
agent: epost-git-manager
metadata:
  argument-hint: "[--commit | --push | --pr | --ship [official|beta] [--dry-run] [--skip-tests] [--skip-review]]"
  connections:
    enhances: []
---

## Delegation — REQUIRED

This skill MUST run via `epost-git-manager`, not inline.
When dispatching, include in the Agent tool prompt:
- **Skill**: `/git`
- **Arguments**: `$ARGUMENTS` (full argument string from Skill invocation)
- If no arguments: state "no arguments — use auto-detection"

# Git — Unified Git Workflow Command

**NEVER suggest `/git-commit`, `/git-push`, `/git-pr` as commands — use `/git --commit`, `/git --push`, `/git --pr` instead.**

## Aspect Files

| File | Purpose |
|------|---------|
| `references/commit.md` | Stage and commit with conventional commits |
| `references/push.md` | Commit changes and push to remote |
| `references/pr.md` | Create GitHub pull request from current branch |
| `references/retro.md` | Data-driven retrospective (commit metrics, churn, completion) |

## Step 0 — Flag / Intent Override

If `$ARGUMENTS` contains `--commit` or user said "commit": execute commit workflow immediately.
If `$ARGUMENTS` contains `--push` or user said "push": execute commit+push workflow immediately.
If `$ARGUMENTS` contains `--pr` or user said "pr" / "pull request": execute PR workflow immediately.
If `$ARGUMENTS` contains `--ship`: execute ship pipeline (see `## Ship Pipeline` below).
If `$ARGUMENTS` contains `--retro`: load `references/retro.md` and generate retrospective report.
If `$ARGUMENTS` contains `--skip-build`: pass through to commit/push workflow — skips build verification gate (for WIP/draft commits).
Otherwise: continue to Step 1.

## Step 1 — Detect State

Run:
```bash
git status --short && echo "---AHEAD---" && git log --oneline @{u}..HEAD 2>/dev/null | wc -l | tr -d ' ' && echo "---PR---" && gh pr list --head "$(git branch --show-current)" --json number --jq length 2>/dev/null || echo 0
```

## Step 2 — Ask (Contextual, Natural Language)

Use `AskUserQuestion` with options based on git state. Examples:

**Changes detected (e.g., 26 modified + 14 untracked):**
- "Commit (26 modified, 14 new files)"
- "Commit and push"
- "Show changes (git diff)"
- "Describe what you want..."

**Clean tree, N commits ahead:**
- "Push (N commits to remote)"
- "Create pull request"
- "Show commits"
- "Describe what you want..."

**Clean and up-to-date:**
- "Create pull request"
- "Show recent commits"
- "Describe what you want..."

## Step 3 — Execute

Based on the user's answer, load and execute the matching workflow:
- Commit → `references/commit.md`
- Push → `references/push.md`
- PR → `references/pr.md`

## Ship Pipeline

`--ship` orchestrates a full release pipeline via native agents. Token-efficient: delegates tests + review to subagents, runs journal/docs in background.

### Usage

```
/git --ship              # auto-detect mode from branch name
/git --ship official     # target main/master, full pipeline + docs
/git --ship beta         # target dev/beta, skip docs update
/git --ship --dry-run    # show plan, do nothing
/git --ship --skip-tests
/git --ship --skip-review
```

### Mode Detection

| Branch name | Mode | Merge target |
|------------|------|-------------|
| `main`, `master` | already on target → STOP |  |
| `feature/*`, `feat/*`, other | official | `main` / `master` |
| `dev`, `develop`, `beta/*` | beta | `dev` / `develop` |

Auto-detect: if arg `official` → main/master. If arg `beta` → dev/develop. Otherwise: use branch heuristic above.

### Pipeline Steps

**Run in order. STOP on any blocking condition.**

| Step | Action | Blocking condition |
|------|--------|--------------------|
| 1 | Pre-flight check | Already on target branch → STOP |
| 2 | `git fetch && git merge origin/<target>` | Merge conflicts that can't be auto-resolved → STOP |
| 3 | Delegate tests to `epost-tester` (subagent) | Test failures → STOP |
| 4 | Delegate review to `epost-code-reviewer` (subagent) | Critical review issues → STOP |
| 5 | Version bump (detect file, auto-bump patch) | Major/minor bump needed → ask user |
| 6 | Generate changelog from `git log --since=<last-tag>` | No tags → skip silently |
| 7 | Commit + Push + PR (hand back to git-manager flow) | — |
| 8 (background) | Delegate journal + docs to `epost-docs-manager` | — (non-blocking) |

**Step 8 runs with `run_in_background: true` — do not wait for completion.**

### Non-blocking Conditions (auto-proceed)

- Uncommitted changes → include in commit
- No version file (package.json, pyproject.toml, pom.xml) → skip version step silently
- No git tags → skip changelog silently
- Patch version → auto-bump (no user input needed)
- `--skip-tests` flag → skip step 3
- `--skip-review` flag → skip step 4
- `--dry-run` flag → print planned actions, exit without executing

### Token Efficiency Rules

- Steps 3 + 4 (tests, review) = subagent calls — keep context out of ship pipeline
- Step 8 (journal, docs) = background call — never block on it
- Skip steps early when flags say so

---

## Build Gate

Build verification runs at two layers:

| Layer | Mechanism | When |
|-------|-----------|------|
| Skill instructions | `references/commit.md` tells agent to run build-gate | Agent follows skill |
| PreToolUse hook | `build-gate-hook.cjs` intercepts any `git commit` Bash call | Automatic enforcement |

The hook layer is automatic — it intercepts `git commit` regardless of whether the agent followed skill instructions. If the build fails, the commit is blocked with a clear error message.

**Bypasses** (for WIP/draft commits):
- Pass `--skip-build` flag: `git commit -m "wip" --skip-build`
- Set env: `EPOST_SKIP_BUILD=1 git commit -m "wip"`
- Disable via config: `{ "hooks": { "build-gate": { "enabled": false } } }` in `.epost-kit.json`
