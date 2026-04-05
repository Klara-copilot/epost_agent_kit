# Test Data Management

## Faker.js (Dynamic Data Generation)

```typescript
import { faker } from '@faker-js/faker';

// Reproducible data (seed for deterministic output)
faker.seed(123);

const user = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  createdAt: faker.date.past(),
};
```

## Factory Pattern (Fishery)

```typescript
import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

// Define factory
const userFactory = Factory.define<User>(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: 'user',
}));

// Usage
const user = userFactory.build();
const admin = userFactory.build({ role: 'admin' });
const users = userFactory.buildList(5);
```

## Factory with Associations

```typescript
const postFactory = Factory.define<Post>(({ associations }) => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  author: associations.author || userFactory.build(),
}));

const post = postFactory.build({
  author: userFactory.build({ role: 'admin' }),
});
```

## Fixtures (Static Baseline Data)

```typescript
// tests/fixtures/users.ts
export const testUsers = {
  admin: {
    id: 'admin-001',
    email: 'admin@test.com',
    role: 'admin',
  },
  member: {
    id: 'member-001',
    email: 'member@test.com',
    role: 'member',
  },
};

// In tests
import { testUsers } from '../fixtures/users';
```

## Combined Pattern (Fixtures + Factories)

```typescript
// Baseline fixtures for known stable states
const baseUser = testUsers.admin;

// Factory for dynamic variations around that baseline
const dynamicUser = userFactory.build({
  ...baseUser,
  email: faker.internet.email(), // Override specific fields
});
```

## Worker-Isolated Test Data (Playwright Parallel)

Prefix all test data with the worker index to prevent cross-worker collisions:

```typescript
// tests/helpers/seed.ts
export async function seedTestData(workerIndex: number) {
  const prefix = `w${workerIndex}`;

  return {
    userId: `${prefix}-user-${faker.string.uuid()}`,
    email: `user-${prefix}-${faker.string.alphanumeric(6)}@test.com`,
  };
}

export async function cleanupTestData(workerIndex: number) {
  const prefix = `w${workerIndex}`;
  // Delete all records matching the worker prefix
  await fetch(`${baseUrl}/api/internal/e2e-test/cleanup?prefix=${prefix}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

## Best Practices

- **Reproducibility** — seed Faker (`faker.seed(N)`) for deterministic CI output
- **Isolation** — prefix data with worker index for parallel Playwright runs
- **Cleanup** — always clean up in `afterEach`/`afterAll`; use the cleanup API pattern if test data is server-side
- **Minimal data** — only create what's needed for the test
- **Type safety** — type your factories (Fishery is generic, use `Factory.define<T>`)

## Anti-Patterns

```typescript
// BAD: Hardcoded values cause collisions in parallel runs
const user = { email: 'test@test.com' };

// GOOD: Dynamic generation
const user = { email: faker.internet.email() };

// BAD: Shared mutable state across tests
let globalUser: User;
beforeAll(() => { globalUser = createUser(); });
test('uses globalUser', () => { /* mutates globalUser */ });

// GOOD: Fresh data per test
let user: User;
beforeEach(() => { user = userFactory.build(); });
```
