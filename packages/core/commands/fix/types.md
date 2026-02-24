---
title: "Fix: Types"
description: (ePost) Fix TypeScript type errors
agent: epost-debugger
argument-hint: [type error description]
---

# Fix TypeScript Type Errors

Direct type fix — skip auto-detection, run typecheck and fix all errors.

<issue>$ARGUMENTS</issue>

## Process

1. **Run typecheck** — execute `bun run typecheck` or `tsc --noEmit`
2. **Fix all type errors** — resolve each error with proper types
3. **Repeat** — re-run typecheck until clean (zero errors)
4. **Verify** — run tests to ensure fixes don't break behavior

## Rules

- **NEVER** use `any` type to bypass typechecks
- Use proper type narrowing, generics, and utility types
- Prefer `unknown` over `any` when type is truly unknown
- Fix root causes — don't suppress errors with `@ts-ignore`
