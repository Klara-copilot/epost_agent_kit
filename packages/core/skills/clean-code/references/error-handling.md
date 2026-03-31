# Error Handling — Detailed Rules

## Core Principle

Error handling is not an afterthought — it is part of the logic. Write the try-catch-finally block first to establish contracts before filling in the implementation.

---

## Rules Table

| Rule | Rationale |
|------|-----------|
| Throw exceptions, not return codes | Return codes force callers to check; unchecked exceptions propagate naturally |
| Write try-catch-finally first | Forces you to think about what the caller can expect |
| Include context in every error | Operation, reason, and input context; not just a type name |
| Don't return null | Creates `null` propagation; use empty collections or throw |
| Don't pass null | Treat null arguments as programming errors; validate at boundaries |
| Wrap third-party APIs | One place to translate external exceptions into domain exceptions |

---

## Exceptions Over Return Codes

```typescript
// Bad — callers must remember to check the return value
function deleteUser(id: string): boolean {
  if (!db.exists(id)) return false;
  db.delete(id);
  return true;
}

// Good — failure cannot be silently ignored
function deleteUser(id: string): void {
  if (!db.exists(id)) throw new UserNotFoundError(id);
  db.delete(id);
}
```

```java
// Bad
public int createAccount(String ownerId) {
  if (owner == null) return -1; // callers must check for -1
  // ...
  return newAccountId;
}

// Good
public int createAccount(String ownerId) {
  if (owner == null) throw new IllegalArgumentException("ownerId must not be null");
  // ...
  return newAccountId;
}
```

---

## Try-Catch-Finally First

```typescript
// Start with the error boundary, then fill in logic
async function loadUserSettings(userId: string): Promise<UserSettings> {
  try {
    const raw = await settingsRepo.findByUserId(userId);
    return parseSettings(raw);
  } catch (error) {
    if (error instanceof RecordNotFoundError) {
      return UserSettings.defaults();
    }
    throw new SettingsLoadError(`Failed to load settings for user ${userId}`, { cause: error });
  } finally {
    metrics.increment('settings.load.attempt');
  }
}
```

---

## Informative Error Messages

Every thrown error must answer: *What were we trying to do? What went wrong? What input caused it?*

```typescript
// Bad — tells nothing useful
throw new Error('Failed');

// Good — includes operation + reason + context
throw new Error(`Failed to send invoice email: SMTP timeout after 30s (invoiceId=${invoice.id}, recipientEmail=${recipient})`);
```

```java
// Bad
throw new RuntimeException("Error processing request");

// Good
throw new PaymentProcessingException(
  String.format("Payment failed for orderId=%s: gateway returned code %s", orderId, gatewayCode)
);
```

---

## Don't Return Null

```typescript
// Bad — callers must null-check at every call site
function findActiveUser(id: string): User | null {
  return db.users.find(u => u.id === id && u.isActive) ?? null;
}
// Caller: const user = findActiveUser(id); if (user) { ... } — forgotten null-check = runtime error

// Good — either return a meaningful empty result or throw
function findActiveUser(id: string): User {
  const user = db.users.find(u => u.id === id && u.isActive);
  if (!user) throw new UserNotFoundError(id);
  return user;
}

// Also good — for collections, return empty rather than null
function getActiveUsers(): User[] {
  return db.users.filter(u => u.isActive); // never null
}
```

```java
// Bad
public List<Invoice> getInvoices(String customerId) {
  if (!customerExists(customerId)) return null; // callers must null-check

// Good
public List<Invoice> getInvoices(String customerId) {
  if (!customerExists(customerId)) return Collections.emptyList();
```

---

## Don't Pass Null

```typescript
// Bad — caller passes null "to skip"; function must null-check internally
function createNotification(userId: string, message: string | null): void {
  if (!message) return; // defensive null guard
  // ...
}

// Good — validate at system boundaries (API layer, service entry points)
function createNotification(userId: string, message: string): void {
  // message is guaranteed non-null by the type and boundary validation
}

// Boundary validation (API layer)
function handleCreateNotificationRequest(body: unknown): void {
  const { userId, message } = parseAndValidate(body); // throws on null/missing
  createNotification(userId, message);
}
```

---

## Wrapping Third-Party APIs

Wrap third-party library exceptions into domain exceptions. This: (a) reduces coupling to the library, (b) gives you one place to add logging/metrics, (c) lets you swap the library without changing callers.

```typescript
// Thin wrapper around Stripe SDK
class PaymentGateway {
  async charge(amount: Money, source: PaymentSource): Promise<ChargeResult> {
    try {
      return await stripe.charges.create({ amount: amount.cents, source: source.token });
    } catch (error) {
      if (error instanceof Stripe.errors.StripeCardError) {
        throw new CardDeclinedError(error.message, { cause: error });
      }
      throw new PaymentGatewayError('Unexpected Stripe error', { cause: error });
    }
  }
}
```

```java
// Wrap JPA exceptions at the repository boundary
@Repository
public class UserRepository {
  public User findById(String id) {
    try {
      return entityManager.find(User.class, id);
    } catch (PersistenceException e) {
      throw new DataAccessException("Failed to load user: " + id, e);
    }
  }
}
```

---

## Checked vs Unchecked Exceptions (Java)

| Use | When |
|-----|------|
| Unchecked (`RuntimeException`) | Programming errors, unrecoverable conditions, or when every layer would just re-throw |
| Checked (`Exception`) | Recoverable, caller-predictable failures (file not found when path is user-provided) |

**Default to unchecked.** Checked exceptions break the Open/Closed Principle — adding a checked exception to a method forces every caller in the call stack to change.
