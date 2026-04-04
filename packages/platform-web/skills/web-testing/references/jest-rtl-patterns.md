# Jest + RTL Patterns

## Mock Setup Patterns

### Mock Function Typing

```typescript
jest.mock('../../caller/feature-caller');
jest.mock('../../app/[locale]/(auth)/feature-a/utils/image-util');

const mockGetLogo = getLogo as jest.MockedFunction<typeof getLogo>;
const mockGetDocumentById = getDocumentById as jest.MockedFunction<typeof getDocumentById>;
```

### Mutable Config Mock (Getter Pattern)

Use when the mock value needs to change between tests:

```typescript
const mockMenuConfig: any[] = [];
jest.mock('../../../app/[locale]/(auth)/config/menu-items.config', () => ({
  get MENU_ITEMS_CONFIG() { return mockMenuConfig; },
}));
```

### Auto-Mock with Inline Defaults

```typescript
jest.mock('@app/service/feature-flag-service', () => ({
  getFeatureFlagStatuses: jest.fn().mockResolvedValue(new Map()),
}));
```

## Test Structure

```typescript
describe('feature-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch logo for given tenant', async () => {
    // Arrange
    mockGetLogo.mockResolvedValue(logoData);

    // Act
    const result = await getLogoForTenant(tenantId);

    // Assert
    expect(mockGetLogo).toHaveBeenCalledWith(tenantId);
    expect(result).toEqual(expectedLogo);
  });
});
```

## RTL Query Priority

1. `getByRole` — preferred (accessible queries)
2. `getByLabelText` — form elements
3. `getByPlaceholderText` — inputs with placeholder
4. `getByText` — visible text content
5. `getByDisplayValue` — current value of form elements
6. `getByAltText` — images
7. `getByTitle` — title attribute
8. `getByTestId` — last resort

## Async Testing

```typescript
// Wait for element to appear
await screen.findByRole('button', { name: /submit/i });

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

// Wait for assertion
await waitFor(() => {
  expect(mockFn).toHaveBeenCalledTimes(1);
});
```

## Custom Render Helper

Wrap with providers to avoid repeating provider setup in every test:

```typescript
// tests/utils/render.tsx
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <Provider store={store}>{ui}</Provider>
  );
}
```

## Coverage Commands

```bash
npm test -- --coverage
npm test -- --coverage --collectCoverageFrom='src/**/*.{ts,tsx}'
```

Coverage reporters: `lcov` (SonarQube), `jest-junit` (CI), `jest-sonar-reporter`.
No enforced thresholds — tracked but not gated.
