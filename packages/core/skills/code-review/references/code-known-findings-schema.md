---
name: code-known-findings-schema
description: "(ePost) Schema for reports/known-findings/code.json — code review findings persistence layer"
user-invocable: false
disable-model-invocation: true
---

# Code Known-Findings Schema

Schema for `reports/known-findings/code.json` — persistence layer for SEC, PERF, TS, LOGIC, DEAD, ARCH, and STATE findings from code review and hybrid audit passes. Mirrors `reports/known-findings/ui-components.json` with code-review-specific categories.

Cross-cutting rule IDs: SEC-001..008, PERF-001..008, TS-001..008, LOGIC-001..006, DEAD-001..003, ARCH-001..005, STATE-001..004, QUALITY-001..007, TEST-001. ePost web-specific: HOOKS-001..008, FETCH-001..006, AUTH-001..006, MOD-001..005, I18N-001..005, REDUX-001..006, FORM-001..005, NEXTJS-001..003. iOS platform: SWIFT-001..008, UIKIT-001..006, MEMORY-001..004, CONCURRENCY-001..004. iOS ePost-specific: REALM-001..006, ALAMOFIRE-001..006. Android platform: COMPOSE-001..008, HILT-001..005, MEMORY-001..004, LOGGING-001. Android ePost-specific: COROUTINE-001..004, FLOW-001..005, ROOM-001..004

## Empty Template (bootstrap)

```json
{
  "schemaVersion": "1.0.0",
  "lastUpdated": "YYYY-MM-DD",
  "findings": []
}
```

## Finding Object

```json
{
  "id": 1,
  "module": "smart-letter-composer",
  "rule_id": "SEC-001",
  "category": "SEC",
  "title": "API key stored in plain-text localStorage",
  "file_pattern": "_hooks/use-ai-settings.ts",
  "code_pattern": "localStorage.setItem('smartletter-ai-settings', JSON.stringify(...))",
  "fix_template": "Use sessionStorage minimum; prefer server-proxy pattern so key never leaves server",
  "priority": 1,
  "severity": "critical",
  "severity_score": 5,
  "confidence": 0.8,
  "confirmed_by": 2,
  "confidence_source": "llm-2pass",
  "source": "hybrid-audit",
  "source_agent": "epost-code-reviewer",
  "source_report": "reports/260308-2249-smart-letter-composer-audit/report.md",
  "first_detected_at": "2026-03-08T22:59",
  "resolved": false,
  "resolved_date": null,
  "fix_applied": false,
  "fix_applied_date": null
}
```

## Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `id` | `integer` | Auto-incrementing unique identifier — never reuse |
| `module` | `string` | Module or component name (e.g. `smart-letter-composer`) |
| `rule_id` | `string` | Rule identifier (e.g. `SEC-001`, `PERF-002`, `TS-003`) |
| `category` | `string` | See Category Enum below |
| `title` | `string` | Short description of the violation |
| `file_pattern` | `string` | File path where the violation was found |
| `code_pattern` | `string` | The problematic code pattern (short snippet) |
| `fix_template` | `string` | How to fix it — template string or prose description |
| `priority` | `integer` | Fix priority: 1 = highest, 5 = lowest |
| `severity` | `string` | See Severity Enum below |
| `severity_score` | `integer` | Numeric severity: 5 = critical, 4 = high, 3 = medium, 2 = low, 1 = informational |
| `confidence` | `float` | 0.0–1.0 — how certain the finding is correct (see `confidence-scoring.md`) |
| `confirmed_by` | `integer` | Number of independent passes that agreed (1–3) |
| `confidence_source` | `string` | `"deterministic"` \| `"llm-1pass"` \| `"llm-2pass"` \| `"llm-2pass-conflict"` \| `"llm-3pass"` |
| `source` | `string` | See Source Enum below |
| `source_agent` | `string` | Agent that detected this finding (e.g. `epost-code-reviewer`) |
| `source_report` | `string \| null` | Relative path to the report file that recorded this finding |
| `first_detected_at` | `string` | ISO 8601 datetime when finding was first recorded (`YYYY-MM-DDTHH:MM`) |
| `resolved` | `boolean` | True when finding is fully resolved and verified |
| `resolved_date` | `string \| null` | ISO date when resolved; null if open |
| `fix_applied` | `boolean` | True when a fix has been applied (not yet verified) |
| `fix_applied_date` | `string \| null` | ISO date when fix was applied; null if not yet fixed |

## Enum Values

### category
- `"SEC"` — security vulnerability (OWASP Top 10, credential exposure, injection, XSS)
- `"PERF"` — performance issue (N+1, unnecessary renders, unguarded expensive ops, async serialization)
- `"TS"` — TypeScript safety (unsafe `any`, unvalidated casts, missing type guards)
- `"LOGIC"` — logic correctness (wrong algorithm, silent failure, incorrect comparison)
- `"DEAD"` — dead code (unreachable code, unused exports, orphaned utilities)
- `"ARCH"` — architecture violation (module boundaries, circular deps, layer violations)
- `"STATE"` — state management issue (incomplete state machines, missing exit states, concurrent mutations)
- `"QUALITY"` — code quality (DRY, single responsibility, magic values, OOP, complexity)
- `"HOOKS"` — React hooks violations (deps arrays, Rules of Hooks, cleanup, hook cascade)
- `"FETCH"` — FetchBuilder usage violations (ePost web — FETCH-001..006)
- `"AUTH"` — authentication/session violations (ePost web — AUTH-001..006)
- `"MOD"` — B2B module structure violations (ePost web — MOD-001..005)
- `"I18N"` — internationalization violations (ePost web — I18N-001..005)
- `"REDUX"` — Redux Toolkit dual-store violations (ePost web — REDUX-001..006)
- `"FORM"` — React Hook Form + Zod form validation violations (ePost web — FORM-001..005)
- `"NEXTJS"` — Next.js App Router pattern violations and migration warnings (ePost web — NEXTJS-001..003)
- `"TEST"` — test coverage violations (changed logic without corresponding test changes)
- `"SWIFT"` — Swift language safety (optionals, closures, concurrency, Codable — SWIFT-001..008)
- `"UIKIT"` — UIKit/SwiftUI lifecycle, accessibility, design tokens (UIKIT-001..006)
- `"MEMORY"` — memory leaks and retain cycles: iOS (delegate cycles, NSTimer, Combine AnyCancellable, addChild lifecycle — MEMORY-001..004); Android (Activity/View in singletons, BroadcastReceiver, custom View listeners, Handler/Runnable — MEMORY-001..004)
- `"CONCURRENCY"` — Swift 6 concurrency safety (actor isolation, @unchecked Sendable, Task capture, async let scope — iOS CONCURRENCY-001..004)
- `"REALM"` — RealmSwift thread safety, write transactions, encryption, migration, live objects (ePost iOS — REALM-001..006)
- `"ALAMOFIRE"` — Alamofire response validation, retry policy, SSL pinning, auth interception (ePost iOS — ALAMOFIRE-001..006)
- `"COMPOSE"` — Jetpack Compose recomposition, state hoisting, side effects (COMPOSE-001..008)
- `"HILT"` — Hilt DI constructor injection, scopes, ViewModel annotation (HILT-001..005)
- `"LOGGING"` — logging convention violations: Timber required, Log.*/println() forbidden (ePost Android — LOGGING-001)
- `"COROUTINE"` — Kotlin coroutine scope, dispatchers, cancellation handling (ePost Android — COROUTINE-001..004)
- `"FLOW"` — Kotlin Flow lifecycle collection, StateFlow exposure, stateIn, Result<T> (ePost Android — FLOW-001..005)
- `"ROOM"` — Room DAO patterns, N+1 queries, transactions, reactive queries (ePost Android — ROOM-001..004)

### severity
- `"critical"` — security risk, data loss, or breaking behaviour
- `"high"` — type safety violation, significant logic error, high performance impact
- `"medium"` — code smell, maintainability concern, minor logic gap
- `"low"` — style inconsistency, minor optimization opportunity

### source
- `"hybrid-audit"` — detected during hybrid code pass (after muji UI pass)
- `"code-review"` — detected by standalone code review
- `"manual"` — manually added by developer

## ID Assignment Rule

- IDs are auto-incrementing integers: `max(existing_ids) + 1`
- Never reuse an ID, even after resolution
- IDs must be unique across the entire `findings` array
- Start at `1` for a new database

## Deduplication Rule

When appending findings, skip if an entry with the same `rule_id` AND `file_pattern` already exists with `resolved: false`. Prevents duplicate open findings for the same issue across audit runs.

## Persistence Rule

The database is **append-only** — never delete finding entries. Resolved findings remain in the array with `resolved: true` for audit trail and regression detection.

## Regression Detection

When starting a new review pass, cross-reference current findings against this database:
- Same `rule_id` + `file_pattern` with `resolved: true` → flag as `regression: true` in the report
- Same `rule_id` + `file_pattern` with `resolved: false` → existing open finding, do not duplicate; reference its `id` in the report
