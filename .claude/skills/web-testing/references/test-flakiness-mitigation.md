# Test Flakiness Mitigation

## Root Causes

- Timing mismatches (hard waits)
- Non-isolated tests (shared state)
- Network instability
- Animation timing

## Explicit Waits (Not Hard Waits)

```javascript
// BAD: Hard wait
await new Promise(r => setTimeout(r, 500));

// GOOD: Wait for condition
await page.waitForSelector('.success', { timeout: 10000 });
await expect(page.locator('.count')).toContainText('5');

// BEST: Playwright auto-wait
await page.getByRole('button', { name: /submit/i }).click();
```

## Wait Timeout Guidelines

| Scenario | Timeout |
|----------|---------|
| Page load | 10–15s |
| Element visibility | 5–10s |
| API responses | 30–60s |
| Full E2E test | 120s (`test.setTimeout(120000)`) |

## Retry Strategies

```javascript
// Playwright built-in — configure in playwright.config.ts
test.describe.configure({ retries: 3 });

// Per-test override
test('flaky test', { retries: 3 }, async ({ page }) => { /* */ });

// Exponential backoff for custom async operations
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); }
    catch (e) {
      if (i === maxRetries - 1) throw e;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
}
```

## Test Isolation

```javascript
// BAD: Dependent tests
let userId;
test('create', async () => { userId = await createUser(); });
test('load', async () => { await loadUser(userId); }); // Depends on previous!

// GOOD: Independent (use test.describe.serial only when order matters)
test('create and load', async ({ page }) => {
  const userId = await createUser(page);
  await loadUser(page, userId);
});
```

## Disable Animations

Add to your global CSS or Playwright setup:

```css
*, *::before, *::after {
  animation-duration: 0s !important;
  transition-duration: 0s !important;
}
```

Or inject via Playwright:

```javascript
await page.addStyleTag({
  content: '*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }'
});
```

## Network Stability

Stub external APIs that aren't under test:

```javascript
await page.route('**/external-api/**', route =>
  route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) })
);
```

## Flakiness Detection

Run a test multiple times to confirm flakiness before investing in a fix:

```bash
npx playwright test --repeat-each=5
```

## Jest-Specific: Async Test Patterns

```typescript
// BAD: Missing await causes false positives
it('should resolve', () => {
  expect(asyncFn()).resolves.toBe(true); // Not awaited!
});

// GOOD: Always await async assertions
it('should resolve', async () => {
  await expect(asyncFn()).resolves.toBe(true);
});
```
