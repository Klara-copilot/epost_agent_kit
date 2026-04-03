---
phase: 2
title: "Uplift platform-web/skills/web-testing/SKILL.md"
effort: 30 min
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- File: `packages/platform-web/skills/web-testing/SKILL.md`

## Overview

Add testing strategy (Trophy for SPAs), CI/CD gate ordering, coverage targets, and links to the new references created in Phase 3. No rearrangement of existing content — add new sections.

## Tasks

### Add Testing Strategy section

Insert after `## Purpose`:

```markdown
## Testing Strategy

For Next.js SPAs, use the **Testing Trophy** model (Kent C. Dodds):

```
    E2E (minimal)
   ──────────────
    Integration    ← largest portion
   ──────────────
    Unit Tests
   ──────────────
  Static Analysis  ← foundation (TypeScript, ESLint)
```

| Level | Target ratio | What to test |
|---|---|---|
| Static | Always | TypeScript types, ESLint rules |
| Unit | 30% | Pure functions, hooks, utilities, mappers |
| Integration | 50% | Components + hooks + store wired together (RTL) |
| E2E | 10–20% | Critical user journeys only (login, core flows) |

**Coverage targets:**
- Critical paths (auth, payment, core flows): 100%
- Core features: 80–90%
- Overall: 75–85%

See `references/testing-strategy.md` for full model comparison and priority matrix.
```

### Add CI/CD gate ordering

Append to the `## Test Commands` section or add a new section:

```markdown
## CI/CD Gate Order

Run faster, cheaper gates first to fail early:

```bash
npm run lint               # Gate 0: static (fastest)
tsc --noEmit               # Gate 1: type check
npm test                   # Gate 2: unit + integration
TEST_ENV=dev npx playwright test  # Gate 3: E2E (slowest — after unit pass)
```
```

### Add reference links

Add a `## References` section at the bottom:

```markdown
## References

- `references/testing-strategy.md` — strategy models (Pyramid/Trophy/Honeycomb), ratios, priority matrix
- `references/test-flakiness-mitigation.md` — explicit waits, retry strategies, isolation patterns
- `references/test-data-management.md` — Faker, factory pattern, worker-isolated test data
```

## File Ownership

| File | Action |
|---|---|
| `packages/platform-web/skills/web-testing/SKILL.md` | UPDATE — add strategy section, CI/CD gates, coverage targets, reference links |
