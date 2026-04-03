---
phase: 1
title: "Uplift core/skills/test/SKILL.md"
effort: 20 min
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- File: `packages/core/skills/test/SKILL.md`

## Overview

Add quality principles, working process, and make `--scenario` flag more prominent. No new references needed — just enriching the orchestrator skill body.

## Tasks

### Add quality principles

Insert after the delegation block:

```markdown
## Quality Principles

- **Never ignore failing tests** — fix root causes, not symptoms. Never mock/skip to pass a build.
- **Typecheck first** — run `tsc --noEmit` before the test suite to catch syntax errors fast.
- **Test isolation** — tests must not share state or depend on execution order.
- **Deterministic** — tests must produce the same result every run. No timing-dependent logic.
- **Clean up** — E2E tests must clean up test data in afterEach/afterAll.
```

### Promote `--scenario` flag

The `--scenario` flag is our strongest differentiator. It generates edge cases across 12 dimensions before implementation. Make it the first flag in the table and add a one-liner calling it out.

Current flag table order: `--visual`, `--visual --update`, `--unit`, `--ui`, `--coverage`, `--scenario`

New order: `--scenario` first, then the rest.

Add above the flag table:
```
**`--scenario` first**: When starting a new feature, run `--scenario` before writing tests.
It generates edge cases across 12 dimensions (auth, timing, scale, data integrity, etc.)
that feed directly into the test suite.
```

### Add working process

```markdown
## Working Process

1. Run `tsc --noEmit` — catch type errors before running tests
2. Detect platform (from file extensions or active plan)
3. Route to platform test command
4. Run tests, capture output
5. For failures: identify root cause — never mock to pass
6. Report with pass/fail counts and coverage if requested
```

## File Ownership

| File | Action |
|---|---|
| `packages/core/skills/test/SKILL.md` | UPDATE — add quality principles, working process, reorder flag table |
