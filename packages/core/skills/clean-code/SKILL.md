---
name: clean-code
user-invocable: true
description: "(ePost) Enforces Clean Code principles for naming, functions, formatting, and error handling. Use when writing new code, reviewing PRs, refactoring legacy code, or when code smells are detected — loads Clean Code principles for naming, functions, formatting, and error handling"
tier: core
metadata:
  agent-affinity: [epost-fullstack-developer, epost-code-reviewer]
  keywords: [clean-code, naming, functions, formatting, code-smells, refactoring]
  platforms: [all]
  connections:
    enhances: [code-review]
---

# Clean Code Skill

## Confirmation Gate

Code-modifying suggestions require explicit user confirmation before applying.

1. **Propose** — present the proposed changes with rationale
2. **Wait** — do not apply until user confirms ("yes", "go ahead", "looks good", or equivalent)
3. **Apply** — only after explicit approval

Never auto-apply refactoring, renaming, or restructuring to working code.

Robert C. Martin's Clean Code principles adapted for our TypeScript/Java stack.

## Naming

| Context | Rule | Bad | Good |
|---------|------|-----|------|
| Variables | Reveal intention | `const d = 7` | `const expirationDays = 7` |
| Classes | Use nouns | `class ProcessData` | `class DataProcessor` |
| Methods | Use verbs | `function active()` | `function isActive()` |
| Booleans | Affirmative, verb-prefixed | `const flag = true` | `const isLoading = true` |
| Length | Proportional to scope | `i` in 3-line loop | `recipientEmailAddress` in 50-line block |
| Ambiguity | Pronounceable, searchable | `genDtYmdhms` | `generatedTimestamp` |

Full naming rules → `references/naming-and-functions.md`

## Functions

| Rule | Limit |
|------|-------|
| Size | Target ≤20 lines |
| Parameters | 0–2 preferred; 3 max before extracting a config object |
| Abstraction level | One level per function — no mixing orchestration with low-level I/O |
| Side effects | None — if unavoidable, name the function to reveal it (`saveUserAndNotify`) |
| Flags as args | Never — split into two functions instead |
| Return type | Pure output — no output arguments |

Full function rules → `references/naming-and-functions.md`

## Comments

### Write these

| Type | Example |
|------|---------|
| Legal | `// © 2026 ePost. Licensed under MIT.` |
| Intent clarification | `// Using regex over split because the delimiter may appear in quoted segments` |
| TODO | `// TODO(than): replace when upstream issue #1234 is resolved` |
| Warning | `// WARNING: non-idempotent — calling twice will duplicate charges` |

### Delete these

| Anti-pattern | Why |
|-------------|-----|
| Redundant comments | `// increments i` above `i++` adds no information |
| Mandated headers | Auto-generated file/author blocks add noise |
| Commented-out code | Use git history; dead code misleads readers |
| Noise comments | `// default constructor` for an empty constructor |

**Principle**: Fix bad code instead of explaining it.

## Formatting

| Rule | Applied |
|------|---------|
| Newspaper metaphor | Public API at top, private helpers below |
| Vertical density | Related lines stay together; blank lines separate concepts |
| Variable proximity | Declare variables where first used |
| Instance variables | Group at top of class |
| Line length | ≤120 characters |
| Team consistency | Agree on formatter config and commit it (Prettier/Checkstyle) |

Full formatting and structure rules → `references/formatting-and-structure.md`

## Objects and Data Structures

| Concept | Rule |
|---------|------|
| Abstraction | Expose operations, hide data — use `getBalance()` not public `balance` |
| Law of Demeter | A method calls methods only on: its own object, its parameters, objects it creates, or its direct fields |
| DTOs | Pure data containers (no behavior) for inter-layer transport; use `interface` in TS |
| Hybrid objects | Avoid — half object, half data structure is the worst of both |

Full rules → `references/formatting-and-structure.md`

## Error Handling

| Rule | Pattern |
|------|---------|
| Exceptions over codes | Throw instead of returning `null` or `-1` |
| try-catch-finally first | Write the try block, then the logic — clarifies contracts |
| Informative messages | Include operation, reason, and context in every thrown error |
| Don't return null | Return empty collection or throw; never force callers to null-check |
| Don't pass null | Validate at system boundaries; treat null args as a programming error |
| Checked vs unchecked | Prefer unchecked (RuntimeException in Java; Error subclass in TS) for unrecoverable states |

Full rules with TypeScript and Java examples → `references/error-handling.md`

## Classes

| Rule | Applied |
|------|---------|
| Small | Measure by responsibilities, not lines — a class should have exactly one reason to change |
| Single Responsibility | Separate concerns (e.g., `UserRepository` vs `UserEmailService`) |
| Open/Closed | Open for extension, closed for modification — prefer composition over inheritance |
| Stepdown rule | Public methods first, private helpers directly beneath the method that calls them |
| Instance variables | Minimize; more instance variables = more coupling |

Full rules → `references/formatting-and-structure.md`

## Implementation Checklist

| Area | Check |
|------|-------|
| Naming | Does every identifier reveal its intent without a comment? |
| Functions | Does each function do exactly one thing? |
| Parameters | ≤2 params, or replaced with a config object? |
| Comments | Are all comments explaining *why*, never *what*? |
| Error handling | No `null` returns or error codes — only exceptions? |
| Tests | Does every public behavior have a test? (see `tdd` skill) |
| Classes | One reason to change per class? |
| Formatting | Newspaper structure — public API at top? |
| Law of Demeter | No method chains reaching through unrelated objects? |

## Cross-References

- **Code smells catalog**: `code-review` skill (formal rule IDs with severity)
- **Test practices**: `tdd` skill
- **Error resilience patterns**: `error-recovery` skill
