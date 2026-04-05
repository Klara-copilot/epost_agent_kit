# Test Quality Reference

Good tests verify behavior through public interfaces. Bad tests couple to implementation.

---

## Good Test Characteristics

- Tests one behavior per test case
- Uses only the public API of the unit under test
- Survives internal refactors (renaming methods, restructuring classes)
- Reads as a sentence: "it does X when Y"
- Sets up minimal state — only what the behavior requires
- Integration-style: exercises real collaborators where possible

## Bad Test Characteristics

- Tests private methods or internal state
- Breaks when you rename a variable or restructure internals
- Mocks your own classes (not external systems)
- Asserts on implementation details (call count, internal order)
- Requires understanding the implementation to understand the test

---

## Examples (TypeScript)

### Bad — Tests implementation detail

```typescript
it('calls _formatName before returning', () => {
  const spy = jest.spyOn(user, '_formatName');
  user.getDisplayName();
  expect(spy).toHaveBeenCalled(); // ← testing HOW, not WHAT
});
```

### Good — Tests behavior

```typescript
it('returns formatted display name', () => {
  const user = new User({ firstName: 'Jane', lastName: 'Doe' });
  expect(user.getDisplayName()).toBe('Jane Doe');
});
```

---

### Bad — Mocks own collaborator

```typescript
it('processes order', () => {
  const mockInventory = { check: jest.fn().mockReturnValue(true) };
  const service = new OrderService(mockInventory); // ← mocking own class
  service.process(order);
  expect(mockInventory.check).toHaveBeenCalledWith(order.itemId);
});
```

### Good — Integration test with real collaborator

```typescript
it('rejects order when item is out of stock', async () => {
  const inventory = new Inventory(testDb);
  await inventory.setStock('item-1', 0);
  const service = new OrderService(inventory);

  await expect(service.process({ itemId: 'item-1' }))
    .rejects.toThrow('Out of stock');
});
```

---

### Bad — Overly isolated unit test

```typescript
it('calls save on repository', () => {
  const repo = { save: jest.fn() };
  const service = new UserService(repo);
  service.createUser({ name: 'Alice' });
  expect(repo.save).toHaveBeenCalledTimes(1); // ← tests wiring not behavior
});
```

### Good — Behavior at the boundary

```typescript
it('persists new user and returns with id', async () => {
  const service = new UserService(new InMemoryUserRepository());
  const user = await service.createUser({ name: 'Alice' });

  expect(user.id).toBeDefined();
  expect(await service.getUser(user.id)).toMatchObject({ name: 'Alice' });
});
```

---

## Jest / RTL Patterns

### Component behavior (RTL)

```typescript
// Bad — tests implementation
expect(wrapper.find('Button').props().onClick).toBeDefined();

// Good — tests user behavior
render(<LoginForm onSubmit={mockSubmit} />);
await userEvent.type(screen.getByLabelText('Email'), 'user@example.com');
await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
expect(mockSubmit).toHaveBeenCalledWith({ email: 'user@example.com' });
```

### Async behavior

```typescript
it('shows error message when login fails', async () => {
  server.use(rest.post('/api/login', (req, res, ctx) => res(ctx.status(401))));
  render(<LoginForm />);
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
});
```

---

## Naming Convention

Test names should read as sentences:

```
"it returns an empty list when no items match the filter"
"it throws when the user is not authenticated"
"it sends a confirmation email after successful registration"
```

Use `describe` to group by subject, `it` to state the expected behavior.
