---
title: Web Test
slug: web:test
description: ⭑.ᐟ Run and write web tests using Jest, Playwright, React Testing Library. Direct web testing.
agent: epost-web-developer
---

Run and analyze web platform tests.

## Your Process
1. Understand what needs testing (components, APIs, E2E flows)
2. Check existing test patterns and framework setup
3. Write tests using appropriate framework:
   - Jest + React Testing Library (components/hooks)
   - Jest (API routes, utilities)
   - Playwright (E2E user flows)
4. Run test suites and analyze results
5. Report coverage and recommendations

## Test Frameworks
- **Unit/Integration**: Jest + React Testing Library
- **E2E**: Playwright
- **API**: Jest + MSW (Mock Service Worker)

## Test Commands
- Unit/Integration: `npm test`
- E2E: `npx playwright test`
- Coverage: `npm test -- --coverage`

## Coverage Goals
- Minimum 80% overall coverage
- 90%+ for critical UI paths
- All error paths tested

Follow testing best practices: test behavior not implementation, use descriptive names, keep tests fast.
