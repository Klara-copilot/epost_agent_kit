# Playwright Patterns

## Configuration

**Location**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';
import { getEnvironment } from './tests/config/environments';

const env = getEnvironment(); // reads TEST_ENV env var, defaults to 'dev'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  maxFailures: 1,
  use: {
    baseURL: env.baseUrl,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 60000,
    actionTimeout: 30000,
  },
  projects: [
    { name: 'setup-auth', testMatch: '**/setup/authen.setup.ts' },
    { name: 'setup-cleanup', testMatch: '**/setup/cleanup.setup.ts', dependencies: ['setup-auth'] },
    {
      name: 'feature-navigation',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup-auth', 'setup-cleanup'],
      testMatch: '**/feature-a/feature-navigation.spec.ts',
    },
  ],
});
```

## Environment Config

```typescript
// tests/config/environments.ts
export const environments: Record<string, TestEnvironment> = {
  local:   { baseUrl: 'http://localhost:3000' },
  dev:     { baseUrl: 'https://app-dev.example.com' },
  staging: { baseUrl: 'https://app-staging.example.com' },
  test:    { baseUrl: 'https://app-test.example.com' },
};

export function getEnvironment(): TestEnvironment {
  return environments[process.env.TEST_ENV ?? 'dev'];
}
```

## PageHelper (Navigation Abstraction)

```typescript
// tests/helpers/navigation.helpers.ts
export class PageHelper {
  constructor(private page: Page) {}

  async goToFeatureTab() {
    await this.triggerSelectorAndWaitForNavigation('div[id="feature-a"]', /.*feature-a.*/);
    await expect(this.page).toHaveURL(/.*feature-a.*/);
    return this;
  }

  triggerSelectorAndWaitForNavigation = async (selector: string, urlPattern: RegExp) => {
    const element = await this.page.waitForSelector(selector, { timeout: 5000 });
    await Promise.all([element.click(), this.page.waitForURL(urlPattern, { timeout: 10000 })]);
  };
}
```

## E2E Test Pattern

```typescript
test.describe.serial('Feature Tab - Sequential Tests', () => {
  let pageHelper: PageHelper;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000);  // 120 seconds per test — default is too short
    pageHelper = new PageHelper(page);
    await page.goto(`${env.baseUrl}/en`);
    await page.waitForLoadState('domcontentloaded');
    await pageHelper.goToFeatureTab();
  });

  test('01 - Create Item', async ({ page }) => {
    await createItem({ page, itemName });
  });
});
```

## API Call Helpers (Cleanup)

```typescript
// tests/helpers/api-call.helpers.ts
export const cleanupTestData = async () => {
  const response = await fetch(`${env.baseUrl}/api/internal/e2e-test/cleanup?tenantId=${tenantId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, 'x-api-key': E2E_API_KEY },
  });
};
```

## Key Rules

- Use `storageState` for authenticated tests — auth once, reuse across tests
- Use `test.describe.serial` when tests have order dependencies
- Always `test.setTimeout(120000)` in `beforeEach` for E2E
- Use `PageHelper` for navigation — never inline selectors in tests
- Screenshots and video captured on failure automatically
