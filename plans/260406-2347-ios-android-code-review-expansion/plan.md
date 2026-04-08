---
title: "iOS & Android Code Review Rule Expansion"
status: done
created: 2026-04-06
updated: 2026-04-07
effort: 6h
phases: 3
platforms: [ios, android]
breaking: false
blocks: []
blockedBy: ["PLAN-0098"]
---

# Plan: iOS & Android Code Review Rule Expansion

## Scope Rationale

1. **Problem**: iOS has 6 rules (SWIFT 3, UIKIT 3). Android has 6 rules (COMPOSE 3, HILT 3). Web has 24 core + 30 ePost-specific. Mobile platforms lack coverage for their real stacks — Realm, Alamofire, Coroutines, Flow, Room.
2. **Why this way**: Same pattern as web — expand core categories in existing `code-review-rules.md`, add stack-specific categories as separate reference files co-located with platform skills. Follows PLAN-0098's architecture.
3. **Why now**: PLAN-0098 created the platform-aware dispatch infrastructure. iOS/Android stubs exist but are thin. Real project codebases (luz_epost_ios uses Alamofire+RealmSwift; luz_epost_android uses Retrofit+Room+Coroutines+Flow) use stack-specific patterns heavily — reviewer misses violations without category-specific rules.
4. **Simplest value**: Expand existing rule files + add 3 new reference files per platform, each 3-4 rules. Wire category enums into schema.
5. **Scope**: Keep ALAMOFIRE (luz_epost_ios entire network layer uses it; SSL pinning + interceptors are misuse-prone). Keep FLOW (luz_epost_android Matrix Rust SDK client and epostSdk module both use Kotlin flows; COROUTINE alone insufficient). Keep: SWIFT expansion, UIKIT expansion, REALM, ALAMOFIRE, COMPOSE expansion, HILT expansion, COROUTINE, FLOW, ROOM.

## Design Decisions

### D1: New categories as separate reference files

Following web's FETCH/AUTH/MOD pattern: stack-specific categories live in the **platform skill** that owns the pattern, not in the core `code-review-rules.md`.

- `ios-development/references/code-review-rules.md` — expanded SWIFT + UIKIT (existing file)
- `ios-development/references/code-review-rules-realm.md` — new REALM category
- `ios-development/references/code-review-rules-alamofire.md` — new ALAMOFIRE category
- `android-development/references/code-review-rules.md` — expanded COMPOSE + HILT (existing file)
- `android-development/references/code-review-rules-coroutine.md` — new COROUTINE category
- `android-development/references/code-review-rules-flow.md` — new FLOW category
- `android-development/references/code-review-rules-room.md` — new ROOM category

### D2: Rules grounded in real project stacks only — all 4 projects

| Project | Type | KB docs | Stack |
|---------|------|---------|-------|
| `luz_epost_ios` | iOS main app | ✅ ARCH-0001 (33 entries) | Swift 5.x, UIKit+SwiftUI, Alamofire 5.8.1, RealmSwift 10.47, MVVM+Coordinator, AppAuth-iOS, SnapKit, Kingfisher, PSPDFKit, Scanbot, LetsSign xcframework |
| `ios_epostsdk` (`epostsdk`) | iOS SDK (binary) | ✅ ARCH-0001 (2 entries) | Swift 5.0+, SPM binary XCFramework, iOS 15+ min, SSL pinning, Scanbot 7.1.4, PSPDFKit 26.0, Zendesk 2.34 |
| `android_epostsdk` | Android SDK demo | ✅ ARCH-0001 (4 entries) | Kotlin JVM-21, Compose+ViewBinding, Hilt 2.54, Firebase BOM 33.1.2, Let's Sign 2025.4.1, SDK target 35 |
| `luz_epost_android` | Android main app | ✅ ARCH-0001+0002 (7 entries) | Kotlin 2.1.0, Compose+XML, Hilt 2.54, Retrofit 2.11.0+OkHttp 4.12.0, Room 2.6.1 (SQLCipher), DataStore 1.1.0, Coroutines 1.8.0, Ktor 2.3.3 (Matrix WS), Glide 5.0-rc01, Timber, AppAuth 0.11.1, Matrix Rust SDK (E2EE/OLMI), Firebase, Checkstyle+SonarQube |

Rules must apply to BOTH the SDK reference apps AND the main consumer apps. Conservative, general-purpose rules preferred over SDK-integration-specific rules.

**Confirmed conventions** (luz_epost_android CONV-0001+0002):
- Naming: PascalCase classes, camelCase functions, `UPPER_SNAKE_CASE` constants, `_` prefix for backing fields (e.g. `_viewState`), `is`/`has` booleans, no abbreviations in public APIs — Checkstyle-enforced
- Error handling: sealed `Result<T>` (Success/Error/Loading) wrapping in Repository, `Timber.e()` for logging (never `Log.d/println`), `Flow.catch()` in streams, custom exception hierarchy (AuthenticationException, NetworkException, DecryptionException), exponential backoff retry

**luz_epost_android unique stack** (not in android_epostsdk): Retrofit (full network layer), Room 2.6.1 + SQLCipher, DataStore, Ktor (WebSocket for Matrix), Matrix Rust SDK (E2EE), Glide, Timber, EventBus 3.3.1, 4 build flavors (ePostDev/ePostTest/ePostDevStaging/ePost), per-flavor google-services.json.

### D3: LW/Escalated split follows web pattern

~50% Lightweight (always checked), ~50% Escalated (deep reviews, 10+ files, `--deep` flag).

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | iOS rule expansion | 2.5h | pending | [phase-1](./phase-1-ios-rules.md) |
| 2 | Android rule expansion | 2.5h | pending | [phase-2](./phase-2-android-rules.md) |
| 3 | Integration — wire into SKILL.md + schema | 1h | pending | [phase-3](./phase-3-integration.md) |

## Success Criteria

- [ ] iOS: 8 SWIFT + 6 UIKIT + 3 REALM + 3 ALAMOFIRE = 20 rules (from 6)
- [ ] Android: 8 COMPOSE + 5 HILT + 4 COROUTINE + 4 FLOW + 4 ROOM = 25 rules (from 6) — FLOW-004 (Result<T>) and ROOM-004 (no raw SQL) added from luz_epost_android CONV-0002
- [ ] Every rule has Pass + Fail examples from real project patterns
- [ ] LW/Escalated table present in every rule file
- [ ] code-review/SKILL.md platform table updated with new categories + rule counts
- [ ] code-known-findings-schema.md category enum includes SWIFT, UIKIT, REALM, ALAMOFIRE, COMPOSE, HILT, COROUTINE, FLOW, ROOM
- [ ] Timber logging rule in COROUTINE or HILT: `Timber.e()` required, no `Log.d/println` (CONV-0002 enforcement)
- [ ] No overlap with PLAN-0098 files (that plan owns code-review-standards.md split; this plan owns platform rule content)

## Constraints

- All edits in `packages/` — never `.claude/` directly
- Follow exact table format: Rule ID | Rule | Severity | Pass | Fail
- New reference files use same frontmatter pattern as web's FETCH/AUTH files
- No new skills or agents — just reference files + SKILL.md updates
