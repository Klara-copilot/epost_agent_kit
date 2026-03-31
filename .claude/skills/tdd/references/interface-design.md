# Interface Design

Three principles for designing interfaces that are easy to test and easy to use.

---

## Principle 1: Accept Dependencies, Don't Create Them

A function or class that instantiates its own dependencies is hard to test and hard to reuse.

```typescript
// Bad — creates its own dependency
class ReportGenerator {
  generate(userId: string) {
    const db = new Database(); // ← coupled to specific implementation
    return db.query(`SELECT * FROM reports WHERE user_id = $1`, [userId]);
  }
}

// Good — accepts dependency
class ReportGenerator {
  constructor(private readonly db: Database) {}

  generate(userId: string) {
    return this.db.query(`SELECT * FROM reports WHERE user_id = $1`, [userId]);
  }
}
```

In tests, pass a fake. In production, pass the real implementation. The class does not care which.

---

## Principle 2: Return Results, Don't Produce Side Effects

Functions that return values are easy to test: call with input, assert on output. Functions that produce side effects require setup and inspection of external state.

```typescript
// Hard to test — side effect
function processOrder(order: Order) {
  emailService.send(order.userEmail, 'Your order is confirmed'); // ← side effect
  inventoryDb.decrement(order.itemId);                           // ← side effect
}

// Easy to test — returns result
function processOrder(order: Order): OrderResult {
  return {
    confirmation: buildConfirmation(order),
    inventoryUpdate: { itemId: order.itemId, delta: -1 },
    notification: { to: order.userEmail, template: 'order-confirmed' },
  };
}

// Side effects executed by caller (easy to verify or substitute)
const result = processOrder(order);
await emailService.send(result.notification);
await inventoryDb.apply(result.inventoryUpdate);
```

This pattern is especially useful in Redux (thunks that return actions), React (components that call handlers with data), and service layers.

---

## Principle 3: Small Surface Area

The fewer methods an interface exposes, the fewer ways it can be used incorrectly, and the fewer methods a fake needs to implement.

```typescript
// Too wide — caller has too many options
interface UserService {
  createUser(data: NewUserData): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  findUser(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  listUsers(filters: UserFilters): Promise<User[]>;
  countUsers(filters: UserFilters): Promise<number>;
  activateUser(id: string): Promise<void>;
  deactivateUser(id: string): Promise<void>;
}

// Smaller — scoped to what callers actually need
interface UserLookup {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}

interface UserWriter {
  create(data: NewUserData): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
}
```

Pass the narrow interface to callers that only need read access. This makes intent clear and fakes trivial to build.

---

## Combining the Principles

A function designed with all three principles:

```typescript
// Accepts dependency (principle 1)
// Returns result (principle 2)
// Small surface area (principle 3)
async function registerUser(
  data: RegistrationData,
  users: Pick<UserWriter, 'create'>,  // narrow type
): Promise<RegistrationResult> {
  const user = await users.create(data);
  return { userId: user.id, status: 'registered' };
}
```

Test:

```typescript
it('returns userId on successful registration', async () => {
  const users = { create: async (d) => ({ id: 'user-1', ...d }) };
  const result = await registerUser({ name: 'Alice', email: 'a@b.com' }, users);
  expect(result.userId).toBe('user-1');
});
```

No setup. No cleanup. No assertions on call counts. Just input and output.
