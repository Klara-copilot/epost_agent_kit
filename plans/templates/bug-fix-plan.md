---
title: "Fix: {Bug description}"
status: draft
created: YYYY-MM-DD
updated: YYYY-MM-DD
effort: Xh
phases: N
platforms: [web | ios | android | backend | kit | all]
breaking: false
---

# Fix: {Bug description}

## Problem

{1-2 sentences: what's broken and what impact it has}

## Root Cause Hypothesis

{Best current theory — update after investigation}

## Scope

- **Platform**: {web | ios | android | backend | kit | all}
- **Affected files**: {list or "TBD after investigation"}

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Investigate + reproduce | {Xh} | pending | [phase-1](./phase-1-investigate.md) |
| 2 | Fix + tests | {Xh} | pending | [phase-2](./phase-2-fix.md) |

## Reproduction Steps

1. {Step 1}
2. {Step 2}
3. Observe: {what goes wrong}

## Success Criteria

- [ ] Bug no longer reproducible
- [ ] Root cause documented
- [ ] Regression test added
- [ ] No new failures introduced
