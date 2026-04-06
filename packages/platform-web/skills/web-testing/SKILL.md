---
name: web-testing
description: (ePost) Configures and writes Jest + RTL unit tests and Playwright E2E tests. Use when writing tests, configuring Jest/Playwright, checking coverage, or working with test patterns
user-invocable: false
paths: ["**/*.test.tsx", "**/*.test.ts", "**/*.spec.ts", "**/*.spec.tsx", "**/__tests__/**"]

metadata:
  agent-affinity: [epost-tester, epost-fullstack-developer]
  keywords: [test, jest, playwright, coverage, e2e, unit-test, rtl, testing-library]
  platforms: [web]
  triggers: ["test", "jest", "playwright", "coverage", "e2e", "unit test", "spec"]
---

# Testing — Jest + Playwright Patterns

## Testing Strategy

**Testing Trophy** for Next.js SPAs:
- E2E (10–20%) — critical user journeys only
- Integration (50%) — components + hooks + store wired via RTL
- Unit (30%) — pure functions, hooks, mappers
- Static Analysis — TypeScript + ESLint (always)

**Coverage targets:** critical paths 100% · core features 80–90% · overall 75–85%

See `references/testing-strategy.md` for full model comparison and priority matrix.

## CI/CD Gate Order

Run fastest gates first:

```bash
npm run lint               # Gate 0: static (seconds)
tsc --noEmit               # Gate 1: type check (seconds)
npm test                   # Gate 2: unit + integration (minutes)
TEST_ENV=dev npx playwright test  # Gate 3: E2E (slowest)
```

## Test Structure

Mirror app route structure in `tests/`:
```
app/[locale]/(auth)/feature-a/utils/mapping.ts
tests/[locale]/feature-a/utils/mapping.test.ts
```

## Jest Configuration

- Uses `next/jest` + `ts-jest`, `testEnvironment: 'jsdom'`
- `pathsToModuleNameMapper` from `tsconfig.base.json`
- `@testing-library/jest-dom` via `setupFilesAfterFramework`
- Global mocks: `IntersectionObserver`, `TextEncoder`, `TextDecoder`, `fetch`
- Coverage: `lcov` + `jest-junit` + `jest-sonar-reporter` (no enforced thresholds)

## Key Jest Patterns

```typescript
// Type-safe mocks
const mockGetLogo = getLogo as jest.MockedFunction<typeof getLogo>;

// Mutable config getter pattern
jest.mock('../config/menu-items.config', () => ({
  get MENU_ITEMS_CONFIG() { return mockMenuConfig; },
}));

// Auto-mock with defaults
jest.mock('@app/service/feature-flag-service', () => ({
  getFeatureFlagStatuses: jest.fn().mockResolvedValue(new Map()),
}));
```

**Critical rules:**
- Always `jest.clearAllMocks()` in `beforeEach`
- Use `jest.MockedFunction<typeof fn>` for type safety
- `jest.mock()` calls are hoisted — place at top level
- One behavior per `it()` — clear arrange/act/assert

See `references/jest-rtl-patterns.md` for detailed RTL query patterns, async testing, and custom render helpers.

## Playwright E2E

- Config at `playwright.config.ts` — `fullyParallel: true`, `workers: CI ? 2 : 3`, `maxFailures: 1`
- Environment via `TEST_ENV` env var (local/dev/staging/test)
- Use `PageHelper` class for navigation helpers
- Use `storageState` for authenticated tests (avoid re-login per test)
- Use `test.describe.serial` for order-dependent tests
- `test.setTimeout(120000)` — default is too short for E2E

See `references/playwright-patterns.md` for full config, PageHelper, environment setup, and API call helpers.

## References

| File | Purpose |
|------|---------|
| `references/jest-rtl-patterns.md` | RTL queries, mock strategies, async testing, custom render |
| `references/playwright-patterns.md` | Page object model, fixtures, CI config, API helpers |
| `references/testing-strategy.md` | Strategy models (Pyramid/Trophy/Honeycomb), ratios, priority matrix |
| `references/test-flakiness-mitigation.md` | Explicit waits, retry strategies, isolation patterns |
| `references/test-data-management.md` | Faker, factory pattern (Fishery), worker-isolated test data |
