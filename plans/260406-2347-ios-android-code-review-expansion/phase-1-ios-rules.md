---
phase: 1
title: "iOS Rule Expansion"
effort: 2.5h
depends: []
---

# Phase 1: iOS Rule Expansion

## Context

- Plan: [plan.md](./plan.md)
- Depends on: none (Phase 2 is independent; Phase 3 depends on 1+2)
- Real stack (luz_epost_ios ✅ 33 KB entries): Swift 5.x, UIKit primary, SwiftUI (Matrix/community), Alamofire 5.8.1, RealmSwift 10.47, AppAuth-iOS, SnapKit 5.7.1, Kingfisher 8.1.4, PSPDFKit 14.0.1, ScanbotSDK 7.1.4, LetsSign xcframework
- Confirmed architecture: MVVM + Coordinator; 3-layer API (ViewController → `{Feature}API.swift` → `{Feature}Services.swift` → Alamofire via `GenericAPIHandler`)
- Confirmed conventions: `{Feature}Structures.swift` for ViewModels; `.ploclize()` extension for all user-facing strings; `ePostEnvironment` enum for all URLs (no hardcoded strings); 4 languages (de, en, fr, it-CH)
- Real stack (ios_epostsdk ✅ 2 KB entries): Swift 5.0+, SPM binary XCFramework, iOS 15+ min, SSL pinning via `.der` certs in bundle

## Overview

Expand iOS code review rules from 6 to 20. Modify existing file + create 2 new reference files.

## Files Owned

- `packages/platform-ios/skills/ios-development/references/code-review-rules.md` — expand SWIFT (3->8) and UIKIT (3->6)
- `packages/platform-ios/skills/ios-development/references/code-review-rules-realm.md` — new file, REALM category (3 rules)
- `packages/platform-ios/skills/ios-development/references/code-review-rules-alamofire.md` — new file, ALAMOFIRE category (3 rules)

## Requirements

### Expand SWIFT (3 -> 8 rules)

Existing: SWIFT-001 (no force unwrap), SWIFT-002 (no retain cycle), SWIFT-003 (UI on main actor)

New rules:
| Rule ID | Rule | Severity | Tier |
|---------|------|----------|------|
| SWIFT-004 | `[weak self]` in closures capturing self in async/escaping contexts — guard-let-self pattern | high | LW |
| SWIFT-005 | `guard let` / `if let` at trust boundaries — never force unwrap API responses or decoded values | high | LW |
| SWIFT-006 | Codable decode wrapped in do-catch — never silent `try?` on API response parsing | high | Escalated |
| SWIFT-007 | Task cancellation checked via `Task.isCancelled` or `try Task.checkCancellation()` in long async work | medium | Escalated |
| SWIFT-008 | No business logic in extensions — extensions are syntactic helpers only (computed props, protocol conformance) | medium | Escalated |

### Expand UIKIT (3 -> 6 rules)

Existing: UIKIT-001 (a11y labels), UIKIT-002 (no hardcoded colors), UIKIT-003 (async @MainActor)

New rules:
| Rule ID | Rule | Severity | Tier |
|---------|------|----------|------|
| UIKIT-004 | Heavy setup in `viewDidLoad` only — `viewWillAppear` for lightweight state refresh only | medium | Escalated |
| UIKIT-005 | `deinit` cleans up observers, timers, and nils delegates to prevent retain cycles | high | LW |
| UIKIT-006 | No force-cast `as!` for dequeued cells or segue destinations — use `guard let as?` | high | LW |

### New REALM category (3 rules)

| Rule ID | Rule | Severity | Tier |
|---------|------|----------|------|
| REALM-001 | Realm objects accessed only on the thread they were created — no cross-thread Realm object passing | critical | LW |
| REALM-002 | Realm mutations inside `realm.write {}` transaction — never mutate managed objects outside write block | critical | LW |
| REALM-003 | Realm `Results` used as live collections — do not `Array(results)` unless explicitly needed for snapshot | medium | Escalated |

### New ALAMOFIRE category (3 rules)

| Rule ID | Rule | Severity | Tier |
|---------|------|----------|------|
| ALAMOFIRE-001 | Response validation before decode — `validate(statusCode: 200..<300)` or equivalent before `responseDecodable` | high | LW |
| ALAMOFIRE-002 | Retry policy configured on `Session`, not per-request — use `Interceptor` with `RetryPolicy` | medium | Escalated |
| ALAMOFIRE-003 | Request references stored and cancelled in `deinit` — prevent orphaned network calls on VC dismissal | high | Escalated |

### Updated LW/Escalated table

After expansion:

| Rule IDs | Lightweight | Escalated only |
|----------|-------------|----------------|
| SWIFT-001..005 | Yes | -- |
| SWIFT-006..008 | -- | Yes |
| UIKIT-001 | -- | Yes |
| UIKIT-002 | -- | Yes |
| UIKIT-003, UIKIT-005, UIKIT-006 | Yes | -- |
| UIKIT-004 | -- | Yes |
| REALM-001..002 | Yes | -- |
| REALM-003 | -- | Yes |
| ALAMOFIRE-001 | Yes | -- |
| ALAMOFIRE-002..003 | -- | Yes |

**LW count**: 10 of 20 (50%). **Escalated**: 10 of 20 (50%).

## Tasks

- [ ] Read existing `code-review-rules.md`, add SWIFT-004 through SWIFT-008 to SWIFT table
- [ ] Add UIKIT-004 through UIKIT-006 to UIKIT table
- [ ] Update LW/Escalated table in existing file (SWIFT-004..005 move to LW, UIKIT-005..006 to LW)
- [ ] Update frontmatter description to reflect new categories
- [ ] Create `code-review-rules-realm.md` with REALM-001..003 + LW/Escalated table
- [ ] Create `code-review-rules-alamofire.md` with ALAMOFIRE-001..003 + LW/Escalated table
- [ ] Each new file: frontmatter with `name`, `description`, `user-invocable: false`, `disable-model-invocation: true`
- [ ] Verify all Pass/Fail examples are concrete code snippets (not prose descriptions)

## Validation

- All rule tables have 5 columns: Rule ID | Rule | Severity | Pass | Fail
- LW/Escalated table sums to total rule count
- No duplicate Rule IDs across files
- New files follow exact frontmatter pattern of `web-api-routes/references/code-review-rules.md`

## Success Criteria

- [ ] 20 iOS rules total across 3 files
- [ ] Every rule has a concrete Pass and Fail code example
- [ ] LW/Escalated split is ~50/50
