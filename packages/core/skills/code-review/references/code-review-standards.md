---
name: code-review-standards
description: "Use when reviewing code for security, logic, architecture, or dead code issues"
user-invocable: false
disable-model-invocation: true
---

> Platform-specific rules (PERF, TS, STATE) are in platform skill references. See code-review/SKILL.md § Platform Rules for loading protocol.

# Code Review Standards

Cross-cutting code review rules applicable to all platforms and languages. Platform-specific rules (PERF, TS, STATE for web; JPA, CDI for backend) live in platform skill references — see code-review/SKILL.md § Platform Rules.

**Scope**: Backend, services, API routes, hooks, utilities. For UI component rules, see `packages/design-system/skills/ui-lib-dev/references/audit-standards.md`.

**Severity**: `critical` data loss/security · `high` logic error/boundary · `medium` code smell · `low` style

## SEC: Security

**Activation gate**: Always check when reviewing API routes, controllers, services, auth, user input, or external data.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| SEC-001 | No SQL/NoSQL injection — user input parameterized or escaped | critical | Parameterized queries (`?` placeholders, ORM queries) | String interpolation in query: `"SELECT * WHERE id = " + userId` |
| SEC-002 | No command injection — shell commands never include unsanitized user input | critical | Shell args escaped; args array form; no template strings to exec | `exec("ls " + userInput)` or `eval(userProvidedCode)` |
| SEC-003 | No XSS — user-generated content sanitized before rendering | critical | HTML sanitization (DOMPurify, sanitize-html) before setting innerHTML | `element.innerHTML = userContent` without sanitization |
| SEC-004 | No secrets or credentials in source code or env variable logs | critical | Credentials via env vars; no wholesale env dumps | API key or token literal in source; `console.log(process.env)` |
| SEC-005 | Auth checks present on protected routes | critical | Every protected handler checks auth before processing | Handler calls data layer without auth guard |
| SEC-006 | Input validation at all external boundaries | high | Schema validation (Zod/Joi) applied to all incoming data | `const { userId } = req.body` with no schema check |
| SEC-007 | SSRF prevention — URL args validated against allowlist before outbound fetch | high | URL hostname checked against allowlist | `fetch(req.query.url)` with no origin check |
| SEC-008 | Sensitive data not logged — PII, credentials, tokens excluded from logs | high | Log statements sanitize or omit sensitive fields | `logger.info("login", { password, token })` |

## LOGIC: Logic & Correctness

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| LOGIC-001 | Null/undefined handled at all call sites | high | `user?.profile?.avatar` or explicit null check before access | `user.profile.avatar` without guard when `user` can be null |
| LOGIC-002 | Edge cases handled — empty array, zero, empty string, missing field | medium | Guarded for empty collections, zero values, absent optionals | `items[0].id` without `items.length > 0` check |
| LOGIC-003 | All error paths return or throw — no silent exception swallowing | high | `catch` rethrows, returns error result, or logs + returns fallback | Empty `catch {}` with no downstream effect |
| LOGIC-004 | Race conditions guarded in async flows — concurrent mutations protected | high | Optimistic locking, atomic DB ops, or mutex for concurrent writes | Two async handlers update same record without transaction |
| LOGIC-005 | No off-by-one errors in array/string index arithmetic | medium | `i < arr.length` not `i <= arr.length`; `slice(0, n)` not `slice(1, n)` | Loop iterates one past end; slice bounds shifted by 1 |
| LOGIC-006 | Equality comparisons use strict `===` — no coercive `==` | medium | All comparisons use `===` and `!==` | `== null` outside intentional null-or-undefined check |

## DEAD: Dead Code

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| DEAD-001 | No unreachable code after unconditional return or throw | medium | All statements after `return`/`throw`/`break` removed | Code block after `return value;` that can never execute |
| DEAD-002 | No unused exports — exported identifiers imported somewhere | medium | Every exported function/class/const used by at least one consumer | `export function helperFoo()` with zero import sites |
| DEAD-003 | No orphaned utility files — all utility modules have active importers | low | Every file in `utils/`, `helpers/`, `lib/` imported by at least one module | Utility file with no imports after a refactor |

## ARCH: Architecture

**Activation gate**: Apply when reviewing multi-file changes or new modules.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| ARCH-001 | Single responsibility per module — each file has one clear purpose | medium | File contains one cohesive concept: one service, one hook | File mixes data fetching + formatting + routing |
| ARCH-002 | Module boundaries respected — internals not imported from outside | high | External code imports only from module's public `index.ts` barrel | `import { helper } from '../auth/internal/token-parser'` |
| ARCH-003 | No circular dependencies between modules | critical | Import graph is a DAG; no cycle between modules | Module A imports Module B which imports Module A |
| ARCH-004 | No layer violations — UI does not import from data/infra layer | high | UI components receive data via props, hooks, or context | React component imports `UserRepository` directly |
| ARCH-005 | Dependency direction: UI → Domain → Data → Infra | high | Higher layers depend on lower; lower never import from higher | Database entity imports from a React component |

## Mode Applicability

| Section | Lightweight | Escalated | Notes |
|---------|-------------|-----------|-------|
| SEC | SEC-001–005 (surface scan) | + auth flow trace, SEC-006–008 | Always check |
| LOGIC | LOGIC-001–003 | + race condition trace, LOGIC-004–006 | Always check |
| DEAD | DEAD-001 | + unused exports, DEAD-002–003 | Escalated pass only for full check |
| ARCH | ARCH-003 | + layer scan, ARCH-001–002, ARCH-004–005 | Multi-file or new module changes |

**Rule**: Escalate to full audit when any Critical finding detected.

## QUALITY: Code Quality, Reuse & OOP

**Activation gate**: Apply when reviewing any implementation file — not config or boilerplate.

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| QUALITY-001 | No duplicate logic — identical or near-identical blocks extracted into a shared function | medium | Shared `formatDate(date)` utility used in 3+ places | Same 5-line date formatting block copy-pasted across 3 files |
| QUALITY-002 | Functions do one thing — no function longer than 30 lines that mixes multiple concerns | medium | `validateUser(data)` only validates; caller handles saving | `saveAndValidateAndNotifyUser()` does all three in sequence |
| QUALITY-003 | No magic numbers or magic strings — constants named and co-located | medium | `const MAX_RETRY = 3` defined once, imported where used | `if (retries > 3)` or `status === 'PENDING_REVIEW'` inline without named constant |
| QUALITY-004 | Classes/objects expose behavior, not raw data — no anemic models | medium | `order.calculateTotal()` on the domain object | `order.items` accessed everywhere, total calculated inline in every caller |
| QUALITY-005 | Prefer composition over inheritance — inheritance only for genuine "is-a" relationships | medium | `EmailNotifier` composes `Mailer` | `AdminUser extends User` when only behavior differs |
| QUALITY-006 | Early return / guard clause pattern — happy path last, not nested | low | Guard returns at top, happy path flows naturally at the bottom | 4-level `if/else` nesting where early returns would flatten the logic |

## Mode Applicability (QUALITY)

| Section | Lightweight | Escalated |
|---------|-------------|-----------|
| QUALITY | QUALITY-001, QUALITY-003 | + QUALITY-002, QUALITY-004–006 |

## Anti-Patterns

| Anti-Pattern | Rule |
|-------------|------|
| `"SELECT * WHERE id = " + userId` — query string interpolation | SEC-001 |
| `console.log(process.env)` — wholesale env dump | SEC-004 |
| Route handler with no auth guard before data access | SEC-005 |
| `try { ... } catch (e) {}` — empty catch | LOGIC-003 |
| `import { x } from '../payments/internal/stripe-utils'` — cross-module internal import | ARCH-002 |
| `utils/string-helpers.ts` with zero importers after refactor | DEAD-003 |
