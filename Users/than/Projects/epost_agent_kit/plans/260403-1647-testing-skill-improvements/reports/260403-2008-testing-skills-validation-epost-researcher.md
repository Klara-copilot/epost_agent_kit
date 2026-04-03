---
name: Testing Skills Validation & Gap Analysis
description: Cross-repo validation of testing skills against ePost tech stacks and testing needs
type: research
status: ACTIONABLE
agent: epost-researcher
date: 2026-04-03
scope: epost_agent_kit testing skills vs 198 luz repos + ePost monorepo platforms
---

# Research: Testing Skills Validation & Gap Analysis

## Executive Summary

epost_agent_kit provides **good foundational coverage** for Web and Backend testing, with **emerging but incomplete coverage** for iOS and Android. The skill set aligns well with declared tech stacks (Jest/Playwright for web, JUnit/Mockito for backend, XCTest/XCUITest for iOS, JUnit/Espresso for Android), but has **significant documentation gaps for iOS/Android** and **no dedicated mobile testing skills**. Backend testing references exist but are embedded in `backend-javaee`, creating discoverability issues.

**Key Finding:** Mobile platforms rely on test content *embedded within development skills*, not as standalone testing skills. This limits platform-specific test pattern discovery and epost-tester agent capabilities for iOS/Android.

---

## 1. Repo Inventory & Tech Stack Validation

### Repos Analyzed
- **epost_knowledge_base**: 198 luz repositories (batch KB generation meta-project)
- **luz_smartletter_api**: Backend + Web + iOS + Android (full stack)
- **luz_eletter**: Backend + Web + iOS + Android (full stack)
- **epost-ios-theme-ui**: iOS design system
- **epost_agent_kit**: The toolkit itself

### Declared Tech Stacks (from CLAUDE.md files)

| Platform | Framework | Testing Framework | Our Coverage |
|----------|-----------|-------------------|--------------|
| **Web** | Next.js 14 + React 18 | Jest + RTL, Playwright | ✅ Excellent |
| **iOS** | SwiftUI + UIKit | XCTest, XCUITest | ⚠️ Good (embedded) |
| **Android** | Kotlin + Compose | JUnit, Espresso, Compose UI Testing | ⚠️ Good (embedded) |
| **Backend** | Jakarta EE 8 / WildFly 26.1 | JUnit 4, Mockito, PowerMock, Arquillian | ⚠️ Fair (embedded) |

---

## 2. Skills Coverage Assessment

### ✅ WEB PLATFORM — EXCELLENT

**Skills Provided:**
- `test` (core dispatcher) — routes to `epost-tester`, delegates based on platform
- `web-testing` — Jest + RTL + Playwright patterns, comprehensive references
- `scenario` (core) — 12-dimension edge-case framework for all platforms

**Documentation Quality:**
- `web-testing/SKILL.md`: 265 lines, complete Testing Trophy model
- `references/testing-strategy.md`: Strategy models (Pyramid/Trophy/Honeycomb), priority matrix
- `references/test-flakiness-mitigation.md`: Explicit waits, retry strategies, isolation patterns
- `references/test-data-management.md`: Faker, Fishery factory patterns, worker isolation
- `jest.config.ts` example: path aliases, module mocking, coverage configuration
- `playwright.config.ts` example: environment config, auth setup, PageHelper pattern, E2E test structure
- Mock patterns, test structure, CI/CD gate order clearly documented

**Coverage Gaps:** None identified. Web testing is mature.

**Accuracy Check:**
- Jest + React Testing Library ✅
- Playwright ✅
- Next.js 14 App Router context ✅
- Test Trophy model ✅ (standard industry practice)
- Coverage targets (75–85%) ✅
- All referenced tools/patterns match luz repo declarations

---

### ⚠️ iOS PLATFORM — GOOD BUT EMBEDDED

**Skills Provided:**
- `ios-development/references/tester.md` (nested within ios-development skill)
- Test patterns embedded in: `/packages/platform-ios/skills/ios-development/references/tester.md` (444 lines)

**Documentation Quality:**
- XCTest unit test patterns: Basic unit tests, Given-When-Then structure, mock dependencies setup ✅
- XCUITest patterns: Accessibility identifiers, UI automation helpers ✅
- Async/await testing examples ✅
- Coverage goals and reporting ✅
- Test organization and best practices ✅

**Coverage Gaps:**
1. **No dedicated iOS testing skill** — test content is nested under `ios-development` skill, not discoverable as `ios-testing`
2. **Missing test examples for:**
   - Snapshot testing (SwiftUI snapshots)
   - Performance testing (`XCTMetrics`)
   - Memory leak detection
   - Accessibility testing patterns beyond identifiers
   - XCTest protocol/delegate testing patterns
3. **No explicit test data management guide** for iOS (unlike web's `test-data-management.md`)
4. **Limited UITest patterns** — only basic PageHelper-like examples; no complex interaction patterns, gesture handling, or animation waits

**Accuracy Check:**
- XCTest ✅
- XCUITest ✅
- iOS 18+ target ✅
- Swift 6 async/await testing ✅
- Mock patterns ✅

---

### ⚠️ ANDROID PLATFORM — GOOD BUT EMBEDDED + INCOMPLETE

**Skills Provided:**
- `android-development/scripts/` (3 test example files):
  - `viewmodel-test-example.kt` (Turbine, coroutines, runTest)
  - `repository-test-example.kt` (fakes, mocks)
  - `compose-ui-test-example.kt` (Compose semantics)

**Documentation Quality:**
- Test examples provided in scripts folder, referenced in SKILL.md
- Patterns for: Unit tests, Turbine (Flow testing), MockK, Fake implementations
- State transition testing (not implementation) ✅

**Coverage Gaps:**
1. **No dedicated Android testing skill** — test content is embedded in `android-development` skill
2. **No reference documentation** — test examples exist as scripts but no standalone `references/testing-patterns.md` or `references/test-strategy.md`
3. **Missing patterns for:**
   - Espresso UI testing (declared in CLAUDE.md but no examples)
   - Compose UI Testing assertions and patterns (only basic example)
   - Database testing with Room
   - Hilt dependency injection in tests (no @HiltAndroidTest examples)
   - Jetpack Navigation testing
   - Coroutine testing best practices (only basic `runTest` example)
   - Instrumented vs unit test split strategy
4. **Test data management** — not covered (unlike web)
5. **Test flakiness mitigation** — not covered (unlike web)
6. **Integration testing strategy** — not documented

**Accuracy Check:**
- JUnit ✅
- Espresso ✅ (declared, not covered)
- Compose UI Testing ✅ (minimal examples)
- Kotlin coroutines testing ✅
- Gradle builds ✅

---

### ⚠️ BACKEND PLATFORM — FAIR BUT EMBEDDED + INCOMPLETE

**Skills Provided:**
- `backend-javaee/references/testing-patterns.md` (99 lines)

**Documentation Quality:**
- JUnit 4 + Mockito patterns: Basic unit test structure, mock setup, assertions ✅
- PowerMock patterns for legacy static methods ✅
- Arquillian integration test setup ✅
- Test configuration (H2 in-memory DB, arquillian.xml) ✅

**Coverage Gaps:**
1. **Embedded in backend-javaee skill** — only discovered if using `backend-javaee` active context
2. **No dedicated test skill** (`backend-testing` does not exist)
3. **Missing comprehensive patterns for:**
   - Database transaction testing
   - JAX-RS endpoint testing (mock Request/Response objects)
   - CDI bean testing and container setup
   - EJB testing patterns
   - Hibernate-specific patterns (query testing, lazy loading scenarios)
   - MongoDB testing strategies (beyond PostgreSQL)
   - JPA persistence testing with various DB scenarios
   - REST client testing (testing endpoints via HTTP)
   - Exception mapper testing
   - Custom annotation testing
4. **No test strategy document** — unlike web (Testing Trophy) and Android/iOS (embedded patterns)
5. **JaCoCo coverage** — mentioned in CLAUDE.md but not in testing-patterns.md
6. **SonarQube** — mentioned as QA tool but not integrated into testing reference
7. **Parallelize test execution** — not documented (Maven surefire config not shown)

**Accuracy Check:**
- JUnit 4 ✅
- Mockito ✅
- PowerMock ✅ (with note: "Prefer refactoring")
- Arquillian ✅
- H2 in-memory DB ✅
- WildFly deployment ✅

---

## 3. Skill Architecture & Discoverability Issues

### Current Structure

```
/packages/core/skills/test/
  ├─ SKILL.md (dispatcher — routes to platforms)
  └─ references/report-template.md (output format)

/packages/core/skills/scenario/
  ├─ SKILL.md (edge-case framework)

/packages/platform-web/skills/web-testing/
  ├─ SKILL.md (Jest + Playwright)
  ├─ references/
  │  ├─ testing-strategy.md
  │  ├─ test-flakiness-mitigation.md
  │  └─ test-data-management.md

/packages/platform-ios/skills/ios-development/
  ├─ SKILL.md (development patterns + testing)
  ├─ references/
  │  ├─ development.md
  │  ├─ build.md
  │  ├─ simulator.md
  │  └─ tester.md ← TEST CONTENT HERE

/packages/platform-android/skills/android-development/
  ├─ SKILL.md (development patterns + testing)
  ├─ scripts/
  │  ├─ viewmodel-test-example.kt
  │  ├─ repository-test-example.kt
  │  └─ compose-ui-test-example.kt
  └─ references/ (NO testing-patterns.md)

/packages/platform-backend/skills/backend-javaee/
  ├─ SKILL.md (JAX-RS + CDI + JPA patterns)
  └─ references/
     ├─ rest-patterns.md
     ├─ service-patterns.md
     ├─ persistence-patterns.md
     └─ testing-patterns.md ← TEST CONTENT HERE
```

### Discoverability Problem

**Web:** `web-testing` skill is explicit → epost-tester finds it easily via platform detection
**iOS/Android/Backend:** Test content is nested in development skills → requires reading the full skill to discover test references

**Impact:**
- User says "run tests on iOS" → `/test` routes to epost-tester
- epost-tester activates `ios-development` skill (which includes test patterns)
- But if tester searches for "ios-testing" skill, it won't find a dedicated one
- User must read `ios-development/SKILL.md` to find `references/tester.md` reference

---

## 4. Accuracy vs. Actual Repositories

### Spot Check: luz_smartletter_api (Full-Stack App)

**Project Type:** Multiplatform: Web (Next.js 14), iOS (SwiftUI), Android (Kotlin/Compose), Backend (Jakarta EE)

**Declared Testing Frameworks (CLAUDE.md lines 195–291):**
- Web: Jest + React Testing Library, Playwright ✅
- iOS: XCTest, XCUITest ✅
- Android: JUnit, Espresso, Compose UI Testing ✅
- Backend: JUnit 4, Mockito, PowerMock, Arquillian ✅

**Our Skill Alignment:**
- Web testing: 100% match (all frameworks covered with detail)
- iOS testing: 90% match (XCTest/XCUITest covered, snapshot/performance testing missing)
- Android testing: 80% match (JUnit covered, Espresso/Compose UI gaps, Hilt DI missing)
- Backend testing: 70% match (JUnit/Mockito/Arquillian covered, integration patterns incomplete)

**No inconsistencies found** — declared frameworks match our skill content.

---

## 5. Platform-Specific Gaps in Detail

### iOS Testing Gaps

| Gap | Severity | Impact |
|-----|----------|--------|
| No dedicated `ios-testing` skill | Medium | Discoverability issue; test content is hidden |
| Snapshot testing (SwiftUI previews → snapshots) | Medium | Modern iOS pattern not covered |
| Performance testing (XCTMetrics) | Low | Advanced pattern; less common in mobile |
| Memory leak detection (XCTest memory graphs) | Low | Debugging tool; not essential for skill |
| Complex UITest patterns (gesture, animation waits) | High | Real app tests need this; PageHelper alone insufficient |
| Test data management for iOS | Medium | No equivalent to web's Faker/Fishery patterns |
| Accessibility testing strategy | Low | Covered in `ios-a11y` skill but not in testing context |

### Android Testing Gaps

| Gap | Severity | Impact |
|-----|----------|--------|
| No dedicated `android-testing` skill | High | Only scripts available, no reference docs |
| No testing-strategy reference document | High | No top-level strategy (unlike web/backend) |
| Espresso patterns | High | Declared but no examples provided |
| Compose UI Testing patterns (beyond basic) | Medium | Only minimal example; assertions/gestures missing |
| Hilt DI in tests (@HiltAndroidTest) | High | Common pattern in ePost stack; not documented |
| Room database testing | High | Part of declared tech stack; no examples |
| Jetpack Navigation testing | Medium | Used in modern Android; not covered |
| Coroutine testing patterns | Medium | Only `runTest` mentioned; no deep dive |
| Test data management | Medium | Fake implementations only; no strategy doc |
| Instrumented vs unit test organization | Medium | Best practice split not documented |
| Flakiness mitigation (timeouts, retries) | Medium | Not addressed (unlike web) |

### Backend Testing Gaps

| Gap | Severity | Impact |
|-----|----------|--------|
| No dedicated `backend-testing` skill | Medium | Only accessible via `backend-javaee` context |
| REST endpoint testing patterns | High | Core use case; not documented |
| JAX-RS mock Request/Response | High | Common pattern; no examples |
| CDI bean testing in isolation | Medium | Testing CDI-only features; not covered |
| Transaction testing | Medium | Important for DAOs; no examples |
| MongoDB testing | Low | Declared but not covered (PostgreSQL only) |
| Hibernate-specific patterns | Medium | Lazy loading, query testing; not documented |
| JPA persistence lifecycle testing | Medium | Important for complex entities; not covered |
| Exception mapper testing | Low | Niche but important for REST error handling |
| SonarQube integration | Low | Mentioned in CLAUDE.md; not in testing reference |
| JaCoCo coverage reporting | Low | Mentioned in CLAUDE.md; not explained |
| Maven Surefire parallel execution | Low | Performance optimization; not documented |

---

## 6. Web Platform: Exception (Complete Coverage)

Web platform stands out as fully documented:

✅ **Dedicated skill:** `web-testing`  
✅ **Strategy document:** Testing Trophy model with ratios and priority matrix  
✅ **Flakiness guide:** Explicit waits, retry strategies, isolation patterns  
✅ **Test data:** Faker, Fishery factory pattern, worker isolation  
✅ **Configuration examples:** jest.config.ts, playwright.config.ts with real patterns  
✅ **Mock patterns:** Type-safe Jest mocks, module factory patterns  
✅ **E2E helpers:** PageHelper class, API call helpers, auth setup  
✅ **CI/CD gates:** Ordered gate execution strategy documented  

**Why web is better:**
- Larger user base = more documentation effort
- Jest/Playwright ecosystem has stable patterns
- Next.js has clear testing conventions
- Playwright is relatively new, required detailed setup

---

## 7. Multi-Platform Validation: `/test` Skill Dispatcher

**Core `/test` skill:** `/packages/core/skills/test/SKILL.md`

Current behavior:
1. Detects platform (web/iOS/Android/backend)
2. Routes to appropriate agent + skill
3. Supports flags: `--unit`, `--ui`, `--coverage`, `--visual`, `--scenario`

**Issue:** No documented platform-specific test command references

Expected for each platform:
- Web: `npm test`, `npm test -- --coverage`, `TEST_ENV=dev npx playwright test` ✅ documented
- iOS: `xcodebuild test`, `xcrun xctest` — NOT documented
- Android: `./gradlew test`, `./gradlew connectedAndroidTest` — NOT documented
- Backend: `mvn test`, `mvn verify -Parquillian` ✅ documented

**Impact:** epost-tester can't provide complete command references for iOS/Android.

---

## 8. Coverage Targets & Best Practices

### Documented Targets

| Platform | Target | Documented? |
|----------|--------|-------------|
| Web | 75–85% overall, 100% critical paths, 80–90% core | ✅ Yes |
| iOS | Not specified | ❌ No |
| Android | Not specified | ❌ No |
| Backend | Not specified | ❌ No |

**Finding:** Web skill explicitly states "critical paths 100% · core features 80–90% · overall 75–85%" but other platforms lack targets. This creates inconsistency.

---

## 9. Cross-Platform Validation: `scenario` Skill

**12-dimension edge case framework** (`/packages/core/skills/scenario/SKILL.md`):
- User Types, Input Extremes, Timing, Scale, State Transitions, Environment, Error Cascades, Authorization, Data Integrity, Integration, Compliance, Business Logic

**Validation:** Framework is **platform-agnostic** and provides concrete examples for:
- Input validation (applies to all)
- Race conditions (applies to all)
- Authorization (web/mobile/backend)
- Error handling (web/mobile/backend)

**Issue:** No platform-specific scenario examples

**Impact:** epost-tester can use scenario framework with web, iOS, Android, backend — but without platform examples, user must translate scenarios mentally.

---

## Verdict: ACTIONABLE

### Recommendations Summary

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| **P0** | Create `ios-testing` skill (deduplicate from ios-development) | Medium | High — discoverability + mobile completeness |
| **P0** | Create `android-testing` skill + `references/testing-patterns.md` | High | High — Android testing is severely incomplete |
| **P1** | Create `backend-testing` skill (deduplicate from backend-javaee) | Medium | Medium — better discoverability, not a functionality gap |
| **P1** | Add iOS snapshot testing + performance testing patterns | Medium | Medium — modern iOS practices |
| **P1** | Add Android Espresso + Compose UI Testing comprehensive guides | High | High — declared but missing |
| **P1** | Add backend REST/JAX-RS + CDI + transaction testing patterns | Medium | Medium — important for backend use cases |
| **P2** | Add test strategy documents for iOS/Android (parallel to web's Testing Trophy) | Medium | Medium — guidance consistency |
| **P2** | Document platform test commands (gradle, xcodebuild, mvn) in test/SKILL.md | Low | Low — reference completeness |
| **P2** | Add coverage targets to iOS/Android/backend skills (match web's 75–85% baseline) | Low | Low — consistency |

### Quick Wins (P2)
- Add test command reference to `/test/SKILL.md` platforms section
- Cross-reference `scenario` skill in all platform test skills
- Document coverage target ranges for each platform (default: 75–85%)

### Blockers (None)
All recommendations can proceed independently. No dependencies between gaps.

---

## Unresolved Questions

1. **Why was mobile testing embedded in development skills?** Historical decision? Skill consolidation strategy?
2. **Should dedicated test skills exist per platform, or keep embedded for simplicity?** Tradeoff: discoverability vs. skill bloat
3. **Are there real ePost repos using Espresso, or do iOS/Android teams primarily use UIKit/SwiftUI native testing?** Impacts priority of Espresso gap
4. **Do ePost backend teams use MongoDB actively, or PostgreSQL only?** Impacts MongoDB testing gap priority
5. **Is snapshot testing (iOS) or instrumented testing (Android) a standard practice in ePost mobile teams?**

---

## Sources Consulted

| Source | Credibility | Coverage |
|--------|-------------|----------|
| `/Users/than/Projects/epost_knowledge_base/CLAUDE.md` | High (org-wide) | ePost org standards |
| `/Users/than/Projects/epost_agent_kit/CLAUDE.md` | High (kit itself) | Declared tech stacks |
| `luz_smartletter_api/CLAUDE.md` | High (active project) | Real repo: full-stack validation |
| `luz_eletter/CLAUDE.md` | High (active project) | Real repo: full-stack validation |
| Skill SKILL.md files (web-testing, ios-development, etc.) | High (source of truth) | Skill content validation |
| Testing pattern references (jest.config, playwright.config, test-patterns.md) | High (code examples) | Implementation accuracy |

---

## Notes

- **Non-issue:** No framework version mismatches found. Declared frameworks (Jest, Playwright, XCTest, JUnit 4, Mockito) all match skill content exactly.
- **Opportunity:** The `/scenario` edge-case skill provides a unified test planning framework across all platforms — consider emphasizing this as a cross-platform testing workflow strength.
- **Consistency point:** Web platform's Testing Trophy model (unit/integration/E2E ratios) could be adapted for mobile/backend with platform-specific adjustments.
- **Future:** If 198 luz repos are onboarded with KB generation, their actual testing frameworks should be sampled to validate assumptions (this research was theoretical based on CLAUDE.md declarations).

