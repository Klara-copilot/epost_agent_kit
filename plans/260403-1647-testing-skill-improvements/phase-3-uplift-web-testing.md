---
phase: 3
title: "Uplift web-testing/SKILL.md"
effort: 30 min
depends: []
---

## Context

- Plan: [plan.md](./plan.md)
- File: `packages/platform-web/skills/web-testing/SKILL.md`

## Tasks

### Add Testing Strategy section

Insert after `## Purpose`:

```markdown
## Testing Strategy

For Next.js SPAs, use the **Testing Trophy** model:

```
       E2E (10–20%)        ← critical user journeys only
    ──────────────────
      Integration (50%)    ← components + hooks + store wired (RTL)
    ──────────────────
       Unit (30%)          ← pure functions, hooks, mappers
    ──────────────────
    Static Analysis        ← TypeScript, ESLint (always)
```

**Coverage targets:** critical paths 100% · core features 80–90% · overall 75–85%

See `references/testing-strategy.md` for full model comparison and priority matrix.
```

### Add CI/CD Gate Ordering section

```markdown
## CI/CD Gate Order

Run fastest gates first — fail early:

```bash
npm run lint               # Gate 0: static (seconds)
tsc --noEmit               # Gate 1: type check (seconds)
npm test                   # Gate 2: unit + integration (minutes)
TEST_ENV=dev npx playwright test  # Gate 3: E2E (slowest — after unit pass)
```
```

### Add References section at the bottom

```markdown
## References

- `references/testing-strategy.md` — strategy models (Pyramid/Trophy/Honeycomb), ratios, priority matrix
- `references/test-flakiness-mitigation.md` — explicit waits, retry strategies, isolation patterns
- `references/test-data-management.md` — Faker, factory pattern (Fishery), worker-isolated test data
```

## File Ownership

| File | Action |
|---|---|
| `packages/platform-web/skills/web-testing/SKILL.md` | UPDATE — add strategy section, CI/CD gates, coverage targets, reference links |
