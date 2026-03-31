# Deep Modules

From "A Philosophy of Software Design" (John Ousterhout). The best modules have a small interface and a deep implementation.

---

## The Principle

```
┌─────────────────────────────┐
│      Small Interface         │  ← What callers see
├─────────────────────────────┤
│                             │
│    Deep Implementation      │  ← Where complexity lives
│                             │
│                             │
└─────────────────────────────┘
```

A deep module hides complexity behind a narrow API. Callers get power without dealing with detail.

---

## Deep vs Shallow

**Deep module** — small interface, substantial implementation:

```typescript
// Interface: one method
interface FileStore {
  readFile(path: string): Promise<string>;
}

// Implementation handles: path resolution, encoding, buffering,
// error normalization, retry on transient failure — all hidden
```

**Shallow module** — interface mirrors implementation, adds no value:

```typescript
// Thin wrapper — exposes the same complexity it was meant to hide
interface FileStore {
  openFileDescriptor(path: string, flags: number): FileDescriptor;
  readBytes(fd: FileDescriptor, buffer: Buffer, offset: number, length: number): number;
  closeFileDescriptor(fd: FileDescriptor): void;
}
```

Shallow modules increase the number of things callers must know. They are often signs that an abstraction was added for its own sake.

---

## Identifying Shallow Modules

| Signal | Example |
|--------|---------|
| Interface is a one-to-one mapping of implementation steps | `openConnection`, `executeQuery`, `closeConnection` instead of `query(sql)` |
| Caller must call methods in a specific order | The sequence belongs inside the module |
| Module adds a layer but no simplification | `UserServiceWrapper` that delegates every call unchanged |
| Documentation of the interface is longer than the implementation | The interface is the complexity |

---

## Applying This in TDD

When writing a test, if the setup feels complicated, the module's interface may be too shallow.

```typescript
// Too much setup — shallow interface
const conn = db.connect(host, port);
const txn = conn.beginTransaction();
const stmt = txn.prepare('INSERT INTO users VALUES (?, ?)');
stmt.bind([id, name]);
stmt.execute();
txn.commit();
conn.close();

// One method — deep module
await users.create({ id, name });
```

Prefer the interface that makes the test simple. The implementation can be as complex as needed.

---

## Module Depth and Testing

Deep modules produce short tests. Shallow modules produce long tests with lots of setup.

Use test setup complexity as a signal: if more than 3–5 lines are needed before the act, the interface may be too shallow or the wrong abstraction.
