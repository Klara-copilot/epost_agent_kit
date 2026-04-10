---
phase: 3
title: "Integration — Wire into SKILL.md + Schema"
effort: 1h
depends: [1, 2]
---

# Phase 3: Integration

## Context

- Plan: [plan.md](./plan.md)
- Depends on: Phase 1 (iOS rules) + Phase 2 (Android rules)
- Blocks: nothing

## Overview

Wire new categories into code-review dispatch, update known-findings schema enum, update platform table with new rule counts.

## Files Owned

- `packages/core/skills/code-review/SKILL.md` — update platform-specific table (lines ~125-144)
- `packages/core/skills/code-review/references/code-known-findings-schema.md` — add category enums

## Requirements

### Update code-review/SKILL.md platform table

Replace iOS and Android rows with expanded counts:

```
| iOS | SWIFT | SWIFT-001..008 | Swift optionals, closures, concurrency, Codable |
| iOS | UIKIT | UIKIT-001..006 | UIKit/SwiftUI lifecycle, a11y, design tokens |
| iOS (ePost) | REALM | REALM-001..003 | RealmSwift thread safety, write transactions |
| iOS (ePost) | ALAMOFIRE | ALAMOFIRE-001..003 | Alamofire response validation, retry, cancellation |
| Android | COMPOSE | COMPOSE-001..008 | Jetpack Compose recomposition, state, keys |
| Android | HILT | HILT-001..005 | Hilt DI correctness, scopes, ViewModel |
| Android (ePost) | COROUTINE | COROUTINE-001..004 | Coroutine scope, dispatchers, cancellation |
| Android (ePost) | FLOW | FLOW-001..003 | StateFlow collection, lifecycle, exposure |
| Android (ePost) | ROOM | ROOM-001..003 | Room N+1, transactions, reactive queries |
```

### Update code-known-findings-schema.md category enum

Add these new categories to the enum list:

- `"SWIFT"` — Swift language safety (optionals, closures, concurrency, Codable)
- `"UIKIT"` — UIKit/SwiftUI lifecycle, accessibility, design tokens
- `"REALM"` — RealmSwift thread safety, write transactions, live objects
- `"ALAMOFIRE"` — Alamofire response validation, retry policy, cancellation
- `"COMPOSE"` — Jetpack Compose recomposition, state hoisting, side effects
- `"HILT"` — Hilt DI constructor injection, scopes, ViewModel annotation
- `"COROUTINE"` — Kotlin coroutine scope, dispatchers, cancellation handling
- `"FLOW"` — Kotlin Flow lifecycle collection, StateFlow exposure
- `"ROOM"` — Room DAO patterns, transactions, reactive queries

Also update the rule ID range comment at top of schema file to include new ranges.

### Update code-review/SKILL.md detection signals

Add ePost-specific detection for iOS and Android:

For iOS ePost files:
- Import `RealmSwift` detected -> load `code-review-rules-realm.md`
- Import `Alamofire` detected -> load `code-review-rules-alamofire.md`

For Android ePost files:
- Import `kotlinx.coroutines` detected -> load `code-review-rules-coroutine.md`
- Import `kotlinx.coroutines.flow` detected -> load `code-review-rules-flow.md`
- Import `androidx.room` detected -> load `code-review-rules-room.md`

## Tasks

- [ ] Update platform-specific table in `code-review/SKILL.md` with new categories and rule counts
- [ ] Add 9 new category enum values to `code-known-findings-schema.md`
- [ ] Update top-of-file rule ID range comment in schema
- [ ] Add ePost-specific import-based detection signals to SKILL.md step 3b
- [ ] Verify all category names match between rule files, SKILL.md, and schema

## Validation

- Category names in schema exactly match Rule ID prefixes in rule files
- Platform table rule count ranges match actual rules written in Phase 1+2
- No duplicate categories in schema enum

## Success Criteria

- [ ] SKILL.md platform table has 9 iOS/Android rows (was 4)
- [ ] Schema has 9 new category enums
- [ ] Import-based detection signals documented for 5 ePost-specific categories
