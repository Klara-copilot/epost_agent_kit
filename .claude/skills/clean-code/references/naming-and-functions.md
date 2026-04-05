# Naming and Functions — Detailed Rules

## Naming

### Core Principle
Every name answers: *What is this? What does it do? Why does it exist?* If you need a comment to explain the name, rename it.

### Variable Naming

```typescript
// Bad — no intention revealed
const d = new Date();
const arr = users.filter(u => u.a);

// Good — self-documenting
const passwordExpirationDate = new Date();
const activeUsers = users.filter(u => u.isActive);
```

```java
// Bad
int d;
List<Map<String, Object>> l = new ArrayList<>();

// Good
int elapsedDaysSinceLastLogin;
List<UserSummary> inactiveAccounts = new ArrayList<>();
```

### Naming Rules Table

| Rule | Constraint | Example |
|------|-----------|---------|
| Meaningful distinction | No noise words (`data`, `info`, `the`) | `accountData` → `account` |
| Pronounceable | Can be spoken in code review | `genDtYmdhms` → `generatedTimestamp` |
| Searchable | Avoid single letters except loop counters | `e` → `emailEvent` |
| No encodings | No Hungarian notation, no prefix/suffix type markers | `strName` → `name`, `IUser` → `User` |
| Class = noun | Entity, concept, or thing | `UserRegistrationProcessor` |
| Method = verb | Action | `sendConfirmationEmail()` |
| Boolean = affirmative | Use `is`, `has`, `can`, `should` prefix | `isExpired`, `hasPermission` |
| Consistent vocabulary | One word per concept | Don't mix `fetch`/`get`/`retrieve` for the same operation |
| Domain vocabulary | Use business terms, not implementation terms | `invoice` not `dataRecord` |
| Scope-proportional length | Short name = short scope; long name = wide scope | `i` in 3-line for-loop; `recipientEmailAddresses` in module-level var |

### Naming Anti-patterns

| Anti-pattern | Example | Fix |
|-------------|---------|-----|
| Disinformation | `accountList` when it's a `Set` | `accounts` (or `accountSet`) |
| Mental mapping | `r` for recipient throughout a class | `recipient` |
| Gratuitous context | `MailingAddressAppAddress` in class `App` | `mailingAddress` |
| Abbreviation soup | `hdlrMsgEvt` | `handleMessageEvent` |

---

## Functions

### Core Principles

1. **Do one thing** — A function that does one thing cannot be decomposed into sections. If you can extract a section with a meaningful name, the function does more than one thing.
2. **One level of abstraction** — Don't mix high-level orchestration (`sendWelcomeEmail()`) with low-level I/O (`socket.write(buffer)`) in the same function.
3. **Stepdown rule** — Functions read like a newspaper: higher abstraction above, lower abstraction below.

### Size

```typescript
// Bad — too much happening
async function processOrder(order: Order): Promise<void> {
  // validate
  if (!order.items?.length) throw new Error('Empty order');
  if (!order.customerId) throw new Error('Missing customer');
  // persist
  const saved = await db.orders.create(order);
  // notify
  const customer = await db.customers.findById(order.customerId);
  await emailService.send(customer.email, 'Order confirmed', buildTemplate(saved));
  // audit
  await auditLog.write({ event: 'ORDER_CREATED', orderId: saved.id });
}

// Good — each function does one thing
async function processOrder(order: Order): Promise<void> {
  validateOrder(order);
  const saved = await persistOrder(order);
  await notifyCustomer(saved);
  await auditOrderCreation(saved.id);
}
```

### Parameters

| Count | Guidance |
|-------|---------|
| 0 (niladic) | Ideal |
| 1 (monadic) | Acceptable — asking a question or transforming input |
| 2 (dyadic) | Acceptable when args are naturally ordered (`assertEqual(expected, actual)`) |
| 3 (triadic) | Requires justification — consider a config object |
| 4+ (polyadic) | Extract to a config/options object |

```typescript
// Bad — 4 positional args; callers must remember order
function createUser(name: string, email: string, role: string, orgId: string): User

// Good — named config object
interface CreateUserParams {
  name: string;
  email: string;
  role: UserRole;
  orgId: string;
}
function createUser(params: CreateUserParams): User
```

```java
// Bad
public Invoice createInvoice(String customerId, String currency, int dueDays, boolean draft)

// Good
public Invoice createInvoice(CreateInvoiceRequest request)
```

### Side Effects

A function that has a name implying a query must not silently mutate state.

```typescript
// Bad — name implies a check; body creates a session (hidden side effect)
function isValidUser(username: string, password: string): boolean {
  const user = db.findUser(username, password);
  if (user) {
    Session.create(user); // side effect hidden in a predicate!
    return true;
  }
  return false;
}

// Good — separate concerns
function isValidCredentials(username: string, password: string): boolean { ... }
function createAuthenticatedSession(user: User): Session { ... }
```

### Command/Query Separation

| Type | Rule | Example |
|------|------|---------|
| Command | Changes state, returns `void` | `deleteUser(id)` |
| Query | Returns value, changes nothing | `findUserById(id)` |
| Mixed (bad) | Returns value AND changes state | `saveAndReturnUser(user)` — split it |

### Flag Arguments

Never pass a boolean to select behavior — it's an implicit signal the function does two things.

```typescript
// Bad
renderAlert(message, true);  // What does `true` mean?

// Good
renderSuccessAlert(message);
renderErrorAlert(message);
```

### DRY (Don't Repeat Yourself)

Extract repeated logic immediately. Duplication is the root of most maintenance bugs — one copy gets fixed, others don't.
