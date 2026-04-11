---
phase: 4
title: Platform Rule Packs
effort: 2d
depends: [1]
---

# Phase 4 — Platform Rule Packs

## Context

Pluggable rule sets per platform (Web, iOS, Android, Backend). Loaded conditionally based on detected file extensions. Keeps core `code-review` skill agnostic — platform-specific checks live in their own reference files.

## Overview

- Each platform gets a rule pack reference file with deterministic rules + LLM prompt additions
- Core skill loads only the packs matching detected platforms for the current review
- Rule packs cross-link to existing platform skills (`web-frontend`, `ios-development`, etc.) — no duplication

## Requirements

### Rule Pack Structure

Each pack file contains:

1. **Deterministic rules** (confidence 1.0) — pattern matches, AST checks, lint-style
2. **LLM focus areas** (prompt additions for the review LLM call — context scoping)
3. **Cross-references** to platform skill for conventions

### Pack: Web (`rules/web.md`)

- Deterministic:
  - `useEffect` with missing deps array
  - `dangerouslySetInnerHTML` without sanitization
  - `any` type usage in TypeScript
  - Missing `alt` on `<img>`
  - `console.log` in prod code
- LLM focus: Next.js App Router patterns, server/client boundary, Redux Toolkit dual-store, hydration risks
- Cross-ref: `web-frontend`, `web-nextjs`, `web-ui-lib`

### Pack: iOS (`rules/ios.md`)

- Deterministic:
  - Force unwrap (`!`) outside tests
  - `print()` in prod code
  - Missing `@MainActor` on UI update paths
  - Retain cycles in closures (`[weak self]` missing in stored closures)
- LLM focus: SwiftUI vs UIKit boundary, Swift 6 concurrency, `@Observable` patterns
- Cross-ref: `ios-development`, `ios-ui-lib`

### Pack: Android (`rules/android.md`)

- Deterministic:
  - `!!` non-null assertion
  - Hardcoded strings (should use resources)
  - Missing `@Composable` annotations
  - Context leak patterns (Activity held in singleton)
- LLM focus: Compose recomposition, Hilt DI scoping, Room transaction boundaries
- Cross-ref: `android-development`, `android-ui-lib`

### Pack: Backend (`rules/backend.md`)

- Deterministic:
  - `System.out.println` in prod
  - Missing `@Transactional` on multi-write service methods
  - Raw SQL string concat (injection risk)
  - Missing `@Inject` or `@EJB` on fields expected to be managed
- LLM focus: Jakarta EE vs Spring confusion, JPA N+1, WildFly deployment constraints
- Cross-ref: `backend-javaee`, `backend-databases`, `backend-rest-standards`

### Auto-Selection Logic

In Phase 1's confidence engine entrypoint, after detecting platforms from file extensions:

```
platforms = detect_from_extensions(files)
for platform in platforms:
  load rules/{platform}.md and merge into review prompt context
```

Mixed PR loads multiple packs. No pack = generic review only (fallback).

### Pluggability

- Adding a new platform = new `rules/{name}.md` + one entry in `rules/README.md`
- Removing a pack = delete file + registry entry; core skill unaffected

## Files to Change

- **Create**: `packages/core/skills/code-review/references/rules/README.md` — registry/index of all packs, auto-selection logic
- **Create**: `packages/core/skills/code-review/references/rules/web.md`
- **Create**: `packages/core/skills/code-review/references/rules/ios.md`
- **Create**: `packages/core/skills/code-review/references/rules/android.md`
- **Create**: `packages/core/skills/code-review/references/rules/backend.md`
- **Modify**: `packages/core/skills/code-review/SKILL.md` — add "Platform Rule Packs" section, document auto-selection

## Validation

- [ ] Each rule pack file lists at least 5 deterministic rules + 3 LLM focus areas
- [ ] Cross-references to platform skills resolve (files exist)
- [ ] Single-platform PR loads only matching pack
- [ ] Mixed-platform PR loads all matching packs
- [ ] Unknown-extension PR falls back to generic review without error
- [ ] Deterministic rules from a pack produce confidence 1.0 findings

## Success Criteria

- All 4 platform packs exist and are discoverable via README.md
- Adding a 5th pack requires zero core skill changes (pluggability test)
- Review output shows which packs were active (traceability)
- Platform-specific rules catch at least 1 issue per platform in dogfood sample
