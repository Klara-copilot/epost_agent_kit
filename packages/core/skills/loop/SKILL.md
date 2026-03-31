---
name: loop
description: "(ePost) Use when user wants to improve a metric like \"test coverage\", \"bundle size\", \"lint errors\", or \"Lighthouse score\" over multiple iterations — runs autonomous improvement loop until target is met"
tier: discoverable
metadata:
  agent-affinity: [epost-tester, epost-fullstack-developer]
  keywords: [loop, iterate, optimize, metric, coverage, bundle size, lint, Lighthouse, autonomous, git-memory]
  platforms: [all]
  connections:
    enhances: [test]
---

# Loop Skill

Autonomous metric-improvement loop. Makes one atomic change per iteration, commits it, verifies, and keeps or discards — using git as memory for resumability.

## Invariants (Non-Negotiable)

- **ONE atomic change per iteration** — no "and", no compound edits
- **Commit before verifying** — git is the memory; every attempt is recorded
- **`git revert` on discard** — never `git reset`; history is preserved
- **Resumable** — if interrupted, re-run continues from last commit

## Configuration

Required before starting:

```
Goal: [target value or direction — e.g., "90% branch coverage", "< 200KB bundle"]
Scope: [glob pattern — files allowed to modify, e.g., "src/**/*.ts"]
Verify: [shell command that outputs a single number — e.g., "npm run coverage:json | jq '.total.branches.pct'"]
Guard: [regression check — e.g., "npm test" or "npm run build"]
Iterations: [N, default 10]
Direction: [increase | decrease]
Min-Delta: [minimum improvement per iteration, default 1%]
```

## Per-Iteration Cycle

```
1. Make ONE atomic change within Scope
2. git add -p  →  git commit -m "loop[{n}]: {what changed}"
3. Run Verify command → capture metric as number
4. Run Guard command → check for regressions
5a. If improved ≥ Min-Delta AND guard passes → KEEP (log result, proceed)
5b. If regressed OR guard fails → DISCARD: git revert HEAD --no-edit
```

## Stuck Detection

| Consecutive discards | Action |
|----------------------|--------|
| 5 | Shift strategy — try a different approach to the same goal |
| 10 | STOP — report plateau with current metric and last 10 attempts |

## NOT For

- Subjective goals ("make the code cleaner") — must be a number
- Multi-metric optimization — pick one metric per loop run
- Changes requiring human judgment — loop is for mechanical improvements
- Tasks where reverting is dangerous (migrations, schema changes)

## Aspect Files

| File | Purpose |
|------|---------|
| `references/mechanical-metrics.md` | Verify command library (coverage, bundle, lint, Lighthouse) |
| `references/autonomous-loop-protocol.md` | 8-phase iteration spec |
| `references/git-memory-pattern.md` | Commit discipline and revert vs reset |
| `references/guard-and-noise.md` | Regression guard patterns and noise tolerance |
| `references/results-logging.md` | loop-results.tsv schema and stuck detection logic |
