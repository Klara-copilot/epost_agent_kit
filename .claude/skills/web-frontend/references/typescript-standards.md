# TypeScript Standards

Applies to all `.ts` and `.tsx` files in the web platform.

## Strict Mode — Non-Negotiable

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

`strict: true` enables: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`.

## No `any`

```typescript
// ❌ Bad
function process(data: any) { return data.value; }

// ✅ Good — use unknown + type narrowing
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
}
```

When you receive `unknown` from external sources (API responses, event data), narrow before using.

## Typed Errors — Result Pattern

Use the Result pattern for async operations instead of try/catch scattered across callers:

```typescript
type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await api.getUser(id);
    return { success: true, data: user };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

// Usage — always check success before accessing data
const result = await fetchUser(id);
if (!result.success) { showError(result.error); return; }
doSomethingWith(result.data); // TypeScript knows data exists here
```

## Immutability

```typescript
// readonly for props and data structures
interface UserProps {
  readonly id: string;
  readonly name: string;
}

// const assertions for literal types
const STATUS = ['active', 'inactive'] as const;
type Status = typeof STATUS[number]; // 'active' | 'inactive'
```

## Null Safety

```typescript
// ✅ Optional chaining + nullish coalescing
const name = user?.profile?.displayName ?? 'Anonymous';

// ❌ Non-null assertion without guard — avoid
const name = user!.profile!.displayName;
```

Use non-null assertion (`!`) only when you have proof from surrounding code that the value cannot be null/undefined. Add a comment explaining why.

## File Structure

One major export per file:

```typescript
// user-service.ts — one main export
export class UserService { ... }
// Helper exports are fine, but UserService is the file's responsibility
```

This aligns with the 200-line file size limit. If a file needs multiple major exports, split it.
