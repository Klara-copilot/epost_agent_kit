# Mocking Boundaries

Mock at system boundaries only. Never mock your own code.

---

## The Rule

A mock replaces something you do not own or cannot control in tests. If you wrote it, do not mock it — test it.

**Mock these:**
- External HTTP APIs
- Databases (in unit tests — prefer real DB in integration tests)
- Time (`Date.now()`, `new Date()`)
- File system
- Message queues / event buses
- Third-party SDKs you did not write

**Do not mock these:**
- Your own service classes
- Your own repositories
- Your own utility functions
- Internal collaborators you can instantiate directly

---

## Dependency Injection

Make dependencies injectable so tests can substitute real implementations at boundaries.

```typescript
// Bad — hardcoded dependency, untestable
class OrderService {
  async process(order: Order) {
    const db = new PostgresDatabase(); // ← cannot substitute in tests
    await db.save(order);
  }
}

// Good — injectable dependency
class OrderService {
  constructor(private readonly db: Database) {}

  async process(order: Order) {
    await this.db.save(order);
  }
}

// In tests: use InMemoryDatabase or real test DB
// In production: inject PostgresDatabase
```

---

## Prefer Interface-Based Fakes Over Mocks

When you must stub a dependency, prefer a lightweight in-memory implementation over a mock object. Mocks couple tests to call signatures; fakes couple tests to behavior.

```typescript
// Avoid — mock coupled to call signature
const repo = {
  findById: jest.fn().mockResolvedValue(user),
  save: jest.fn(),
};

// Prefer — fake coupled to behavior
class InMemoryUserRepository implements UserRepository {
  private store = new Map<string, User>();

  async findById(id: string) { return this.store.get(id) ?? null; }
  async save(user: User) { this.store.set(user.id, user); }
}
```

---

## Mocking Time

Use a controlled clock for any code that depends on the current time.

```typescript
// Jest fake timers
beforeEach(() => { jest.useFakeTimers(); });
afterEach(() => { jest.useRealTimers(); });

it('expires session after 30 minutes', () => {
  const session = createSession();
  jest.advanceTimersByTime(31 * 60 * 1000);
  expect(session.isExpired()).toBe(true);
});
```

---

## Mocking External HTTP (MSW)

Use Mock Service Worker to intercept HTTP at the network layer, not at the fetch/axios call layer.

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) =>
    res(ctx.json({ id: req.params.id, name: 'Alice' }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

This allows testing the full fetch → parse → render chain without real network calls.

---

## DI Patterns in Our Stack

| Layer | Pattern |
|-------|---------|
| Next.js Server Actions | Pass repository as parameter or use module-level singleton with test injection |
| React components | Pass handlers as props; mock at the `onSubmit` / `onFetch` boundary |
| Redux async thunks | Mock at `createAsyncThunk` extraArgument (injected in store setup) |
| Java EE / CDI | `@Inject` with `@Alternative` or Arquillian for integration tests |
| Node.js services | Constructor injection; use `tsyringe` or plain DI |

---

## SDK-Style Interfaces

When accepting a dependency, prefer an interface that looks like the real SDK — not a dumbed-down abstraction. This reduces the indirection and makes fakes easier to write.

```typescript
// Over-abstracted — too thin, hides intent
interface Storage {
  set(key: string, value: unknown): void;
  get(key: string): unknown;
}

// SDK-style — matches real usage patterns
interface ObjectStore {
  put(bucket: string, key: string, body: Buffer): Promise<void>;
  get(bucket: string, key: string): Promise<Buffer | null>;
  delete(bucket: string, key: string): Promise<void>;
}
```
