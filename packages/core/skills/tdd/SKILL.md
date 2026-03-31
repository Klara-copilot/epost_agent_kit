---
name: tdd
user-invocable: true
description: "(ePost) Use when user says 'TDD', 'test-first', 'red-green-refactor', wants to build features test-first, or asks for behavior-driven testing"
tier: core
metadata:
  agent-affinity: [epost-fullstack-developer, epost-tester]
  keywords: [tdd, test-driven, red-green-refactor, behavior-testing, integration-tests]
  platforms: [all]
  connections:
    enhances: [test]
---

# TDD — Test-Driven Development

## Philosophy

Tests verify behavior through public interfaces, not implementation details. A good test survives a complete internal rewrite as long as behavior is preserved. A bad test breaks when you rename a private method.

Write integration-style tests by default. Unit tests are appropriate for pure functions and algorithmic logic; avoid them for classes that collaborate with others. Do not mock your own code — mock only at system boundaries (external APIs, databases, time, file system).

The goal is not coverage numbers. The goal is confidence that the system does what it claims.

See `references/test-quality.md` for examples of good vs bad tests.
See `references/mocking-boundaries.md` for mocking rules.
See `references/interface-design.md` for interface design principles.
See `references/deep-modules.md` for module depth principles.

---

## Anti-Pattern: Horizontal Slices

DO NOT write all tests first, then all implementation. This produces large diffs, hard-to-debug failures, and wasted effort when designs change.

**WRONG — Horizontal Slices:**
```
Test 1 -----> Test 2 -----> Test 3
                                  |
                                  v
                         Impl 1, Impl 2, Impl 3
```

**RIGHT — Vertical Slices:**
```
Test 1 --> Impl 1 --> Test 2 --> Impl 2 --> Test 3 --> Impl 3
```

Each slice: one test, one implementation, working end-to-end. Deliver value incrementally. Catch design issues early.

---

## Workflow

### 1. Tracer Bullet

Before writing the real tests, write one test that proves the path exists end-to-end. This test does not need to be complete — it just needs to run and fail for the right reason.

```
Write tracer test → Run (RED for right reason) → Minimal implementation → Run (GREEN)
```

The tracer bullet verifies your scaffolding works: test runner is configured, imports resolve, the function/class/endpoint exists. Do not skip this step.

### 2. Incremental RED → GREEN Loop

For each behavior:

1. **RED** — Write one test describing a specific behavior. Run it. Confirm it fails for the right reason (not import error, not syntax error — the actual assertion fails).
2. **GREEN** — Write the minimum code to make the test pass. No more. Resist adding logic "for the next test."
3. **Repeat** — Move to the next behavior.

Never write two failing tests at once. Never implement ahead of a test.

### 3. Refactor

Refactor only after GREEN. Never refactor on RED.

| Signal | Refactor Action |
|--------|----------------|
| Duplicated code across tests or implementation | Extract to shared helper or function |
| Method exceeds ~20 lines | Break into smaller private methods |
| Module has thin wrapper over another module | Merge or promote the deeper module |
| Method uses data from another object excessively | Move method closer to the data |
| Multiple primitives represent one concept | Introduce a value object or type |

Run tests after every refactor step. Small steps only.

---

## Checklist Per Cycle

Before committing each RED → GREEN cycle:

- [ ] Test describes a behavior, not an implementation detail
- [ ] Test uses only the public interface of the unit under test
- [ ] Test would survive an internal refactor of the implementation
- [ ] Implementation code is minimal — no speculative features
- [ ] No new mocks added inside the system boundary
- [ ] Test name reads as a sentence describing what the system does

---

## Quick Reference

| Rule | Detail |
|------|--------|
| One test at a time | Never have two failing tests simultaneously |
| Vertical slices | Test then implement, then repeat — not all tests then all impl |
| Public interface only | Never test private methods directly |
| Mock at boundaries | External APIs, DBs, time — not your own classes |
| Refactor after GREEN | Never refactor on RED |
| Minimum implementation | Write only what the current test requires |
