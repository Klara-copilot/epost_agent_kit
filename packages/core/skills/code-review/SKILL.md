---
name: code-review
description: (ePost) Reviews code for quality, style, and correctness before commit. Use when user says "review code", "check quality", "audit this", or "look at changed files" — checks code quality, style, and correctness before commit
tier: core

metadata:
  agent-affinity: [epost-code-reviewer, epost-fullstack-developer]
  keywords: [review, code-quality, security, performance, testing, verification]
  platforms: [all]
  triggers: ["/review", "code review", "review code"]
  connections:
    enhances: [review]
---

# Code Review Skill

## Purpose
Comprehensive code quality assessment and verification.

## When Active
User uses /review, asks for code review, or before committing code.
Use `/review --close <id>` to mark a finding resolved. See `references/close-code-finding.md`.

## Platform Detection

When invoked, detect platform from files in scope:
1. If caller passed explicit `Platform:` context → use it
2. Otherwise, scan file extensions in scope:
   - `.tsx`, `.ts` → web
   - `.scss`, `.css` → web (stylesheet — skip SEC/LOGIC/ARCH/QUALITY; apply PERF-005 import patterns only)
   - `.java` → backend
   - `.swift` → ios
   - `.kt`, `.kts` → android
3. Load platform rule file(s):
   - web: `web-frontend/references/code-review-rules.md`
   - backend: `backend-javaee/references/code-review-rules.md`
   - ios: `ios-development/references/code-review-rules.md`
   - android: `android-development/references/code-review-rules.md`
3b. For web platform, detect ePost-specific patterns and load additional rule files:
   | Signal (file path or import pattern) | Additional rules file |
   |--------------------------------------|-----------------------|
   | Files in `caller/`, `_services/`, or importing `FetchBuilder` | `web-api-routes/references/code-review-rules.md` |
   | Files in `auth`, `session`, or using feature-flag logic | `web-auth/references/code-review-rules.md` |
   | Files in `_ui-models/`, `_services/`, `_hooks/`, `_actions/` (module shell) | `web-modules/references/code-review-rules.md` |
   | Files using `useTranslations`, `getTranslations`, or in `messages/` | `web-i18n/references/code-review-rules.md` |
   | Files in `_stores/`, slice files, or using Redux patterns | REDUX rules already in `web-frontend/references/code-review-rules.md` |
   | Files using `useForm`, `zodResolver`, or containing form submit handlers | `web-forms/references/code-review-rules.md` |
   | Files in `app/` directory, `middleware.ts`, or `next.config.*` | `web-nextjs/references/code-review-rules.md` |
   | Files matching klara-theme path (`libs/klara-theme/`, `libs/common/`) | Note in Unresolved Questions: "Component audit recommended: `/audit --ui {component}` (epost-muji) — KLARA/STRUCT/TOKEN rules not covered by code-review" |

   A file may match multiple signals simultaneously — load ALL matching rule files and apply all detected rules.
3c. For iOS ePost files, detect library-specific imports and load additional rule files:
   | Signal (import pattern in `.swift` files) | Additional rules file |
   |-------------------------------------------|-----------------------|
   | `import RealmSwift` detected | `ios-development/references/code-review-rules-realm.md` |
   | `import Alamofire` or `AF.request` detected | `ios-development/references/code-review-rules-alamofire.md` |
3d. For Android ePost files, detect library-specific imports and load additional rule files:
   | Signal (import pattern in `.kt`/`.kts` files) | Additional rules file |
   |------------------------------------------------|-----------------------|
   | `import kotlinx.coroutines` detected | `android-development/references/code-review-rules-coroutine.md` |
   | `import kotlinx.coroutines.flow` detected | `android-development/references/code-review-rules-flow.md` |
   | `import androidx.room` detected | `android-development/references/code-review-rules-room.md` |
4. Always load: `code-review/references/code-review-standards.md` (cross-cutting)
5. If no platform detected: cross-cutting rules only
6. Multi-platform: if files span platforms, load all matching rule files

## Caller Protocol

When dispatching epost-code-reviewer, include in prompt:
```
Platform: {detected platform(s)}
Platform rules: {path to platform code-review-rules.md}
```

Companion rule file detection (steps 3b/3c/3d) runs inside the code-reviewer based on actual file imports — callers do NOT detect or pass companion paths. This SKILL.md is the single source of detection logic.

## Confirmation Gate

Code-modifying suggestions require explicit user confirmation before applying.

1. **Propose** — present the proposed changes with rationale
2. **Wait** — do not apply until user confirms ("yes", "go ahead", "looks good", or equivalent)
3. **Apply** — only after explicit approval

Never auto-apply refactoring, renaming, or restructuring to working code.

## Rule Authority

**House rules beat country rules.** Project conventions in `docs/conventions/` always take precedence over org-level rule files.

Before applying any rule (cross-cutting, platform, or ePost-specific):
1. Check `docs/conventions/` in the reviewed repo for a `CONV-*` doc covering the same pattern
2. **Match found** → apply the project convention, not the org rule
3. **Match found AND conflicts with org rule** → apply project convention, then add a finding:
   - Severity: low
   - Type: `CONV-DEVIATION`
   - Note: `"Project overrides org rule {RULE-ID}. Intentional deviation or unresolved tech debt?"`
4. **No match** → apply org rule as written

This applies to ALL platforms — web, backend, iOS, Android, cross-cutting.

## Expertise

### Review Process
1. Scope resolution (before git diff):
   - If user provided file paths, component name, or `--files` list → **explicit scope**: use those directly, skip git diff
   - Otherwise → **implicit scope**: run `git diff --name-only HEAD` (unstaged) or `git diff --staged --name-only` (staged). Review ONLY those files — do NOT read the full workspace or unrelated modules.
2. Read the plan file if one exists — understand requirements before reviewing
3. Check `docs/conventions/` for project-level rule overrides (see Rule Authority above) — do this BEFORE loading rule files in Platform Detection
4. **Regression scan** — read `reports/known-findings/code.json` (if exists):
   a. Group open findings (`resolved: false`) by `rule_id`
   b. Count occurrences per rule across all findings
   c. If any `rule_id` appears 3+ times (escalated) or 5+ times (lightweight) → flag as "recurring" for the report
   d. If current review touches a file matching an open finding's `file_pattern` → note "known issue" (don't re-flag as new)
   e. Store scan results for the report's Regression Trends section
5. Systematic review: structure, logic, types, performance, security
6. Categorize findings: Critical > High > Medium > Low
7. Update plan TODO status if plan exists

### Systematic Review

Cross-cutting rules are in `references/code-review-standards.md`. Platform rules are loaded per Platform Detection above.

**Cross-cutting (always loaded):**

| Category | Human Name | Rules | Scope |
|----------|-----------|-------|-------|
| SEC | Security | SEC-001..008 | OWASP Top 10, credentials, injection, auth |
| LOGIC | Logic & Correctness | LOGIC-001..006 | Null handling, edge cases, race conditions |
| DEAD | Dead Code | DEAD-001..003 | Unreachable, unused, orphaned |
| ARCH | Architecture | ARCH-001..005 | File org, boundaries, circular deps, layers |
| QUALITY | Code Quality & OOP | QUALITY-001..007 | DRY, single responsibility, no magic values, composition, complexity |
| TEST | Test Coverage | TEST-001 | Changed logic files must have corresponding test changes |

**Platform-specific (loaded on demand):**

| Platform | Category | Rules | Scope |
|----------|----------|-------|-------|
| Web | PERF | PERF-001..008 | N+1, renders, caching, bundle, async serialization, image optimization |
| Web | TS | TS-001..008 | Unsafe any, casts, guards, generics, use-client directive, token compliance |
| Web | STATE | STATE-001..004 | Completeness, exits, guards, concurrency |
| Web | REDUX | REDUX-001..006 | Dual-store, slices, selectors (in web-frontend rules) |
| Web | HOOKS | HOOKS-001..008 | Deps arrays, Rules of Hooks, cleanup, hook cascade |
| Web (ePost) | FETCH | FETCH-001..006 | FetchBuilder, caller pattern, API constants |
| Web (ePost) | AUTH | AUTH-001..006 | NextAuth, session, feature flags, route protection |
| Web (ePost) | MOD | MOD-001..005 | B2B module structure, layering, store scoping |
| Web (ePost) | I18N | I18N-001..005 | next-intl, locale completeness, navigation |
| Web (ePost) | FORM | FORM-001..005 | React Hook Form + Zod, validation setup, accessible errors |
| Web (Next.js) | NEXTJS | NEXTJS-001..003 | App Router cache, server/client boundary, migration warnings |
| Web (klara) | KLARA | — | klara-theme component standards |
| Backend | JPA | JPA-001..004 | JPA/Hibernate query patterns |
| Backend | CDI | CDI-001..004 | CDI/EJB injection, scope patterns |
| iOS | SWIFT | SWIFT-001..008 | Swift optionals, closures, concurrency, Codable |
| iOS | UIKIT | UIKIT-001..006 | UIKit/SwiftUI lifecycle, a11y, design tokens |
| iOS | MEMORY | MEMORY-001..004 | Retain cycles, delegate weak refs, NSTimer, Combine AnyCancellable, addChild lifecycle |
| iOS | CONCURRENCY | CONCURRENCY-001..004 | Swift 6 actor isolation, @unchecked Sendable, Task capture, async let scope |
| iOS (ePost) | REALM | REALM-001..006 | RealmSwift thread safety, write transactions, encryption, migration, live objects |
| iOS (ePost) | ALAMOFIRE | ALAMOFIRE-001..006 | Alamofire response validation, retry policy, SSL pinning, auth interception |
| Android | COMPOSE | COMPOSE-001..008 | Jetpack Compose recomposition, state hoisting, side effects |
| Android | HILT | HILT-001..005 | Hilt DI correctness, scopes, ViewModel annotation |
| Android | MEMORY | MEMORY-001..004 | Context leaks, singleton Activity refs, BroadcastReceiver symmetry, View listener cleanup |
| Android | LOGGING | LOGGING-001 | Timber required, Log.*/println() forbidden (ePost CONV-0002) |
| Android (ePost) | COROUTINE | COROUTINE-001..004 | Coroutine scope, dispatchers, cancellation handling |
| Android (ePost) | FLOW | FLOW-001..005 | StateFlow collection, lifecycle, stateIn, MutableStateFlow exposure, Result<T> |
| Android (ePost) | ROOM | ROOM-001..004 | Room N+1, transactions, reactive queries, SQL injection |

### Severity Classification
- **Critical**: Security vulnerabilities, data loss, breaking changes
- **High**: Performance issues, type safety violations, missing error handling
- **Medium**: Code smells, maintainability issues, documentation gaps
- **Low**: Style inconsistencies, minor optimizations

### Confidence Scoring

Every finding MUST carry `(severity_score, confidence, confirmed_by, confidence_source)`. See `references/confidence-scoring.md` for full spec.

**Assignment summary:**

| Source | `confidence` | `confirmed_by` |
|--------|-------------|----------------|
| Deterministic / lint / AST | 1.0 | 1 |
| LLM single-pass | 0.5 | 1 |
| LLM 2-pass consensus | 0.8 | 2 |
| LLM 3-pass consensus | 0.95 | 3 |
| LLM 2-pass conflict | 0.3 | 1 |

**2-pass rule**: Run a second pass (independent prompt framing) for any finding with `severity >= 4`. Skip pass 2 for `severity < 4` (token cost). If pass 2 confirms → `confidence: 0.8`; if not → demote to `confidence: 0.3` (informational only).

**Context scope injection** (required): inject `Language`, `Framework`, `Platform` into every LLM review prompt.

**Filter thresholds** (used by PR gate and branch scan):
- **Blocking**: `confidence >= 0.8 AND severity_score >= 4 AND confirmed_by >= 2`
- **Informational**: `confidence >= 0.5 AND severity_score >= 2`
- **Dropped**: below informational

### Escalation Signals (Reviewer Reporting)

Code-reviewer runs as a **subagent** — it cannot dispatch other agents. Signal escalation in the report; the main context (via `audit/SKILL.md`) reads the report and handles dispatch.

| Finding | Signal in report |
|---------|-----------------|
| Critical severity found | Load `knowledge` inline (L1 docs/ → L4 Grep fallback) → re-examine files → update findings; add "Escalation recommended: `/audit --code`" to Unresolved Questions |
| UI code (components, tokens, design system) | Add "UI audit recommended: `/audit --ui` (epost-muji)" to Unresolved Questions |
| A11y issue found | Add "A11y audit recommended: `/audit --a11y`" to Unresolved Questions |
| Medium/Low only | Complete inline, no escalation signal needed |

**Rule**: Code review is lightweight by default (no `knowledge`). On Critical: load `knowledge` inline, deepen analysis, then surface in report. The **main context** escalates to full audit.

### Lightweight vs. Escalated Review Scope (Cross-cutting)

| Category | Lightweight (default) | Escalated (knowledge active) |
|----------|-----------------------|---------------------------------------|
| ARCH | ARCH-001..003 (file org, boundaries, circular deps) | + ARCH-004..005 (layer violations, dependency direction) |
| DEAD | DEAD-001 (unreachable code) | + DEAD-002..003 (unused exports, orphaned files) |
| LOGIC | LOGIC-001..003 (null handling, edge cases, error paths) | + LOGIC-004..006 (race conditions, off-by-one, comparison) |
| SEC | SEC-001..005 (injection, XSS, secrets, auth, route guards) | + SEC-006..008 (input validation, SSRF, data logging) |
| QUALITY | QUALITY-001, QUALITY-003 (DRY, magic values) | + QUALITY-002, QUALITY-004..007 (function size, OOP, composition, guards, complexity) |
| TEST | TEST-001 (changed logic must have test changes) | + edge case coverage, boundary condition completeness |
| Standards source | code-review-standards.md only | + docs/ conventions, RAG patterns |

**Note**: Platform-specific rules (PERF, TS, STATE, JPA, etc.) and ePost-specific rules (FETCH, AUTH, MOD, I18N, REDUX) all follow the same lightweight (first 50%) / escalated (all) pattern defined in their respective rule files.

**Rule**: Lightweight review does NOT load knowledge. Only categories in the "Lightweight" column are checked. If a Critical finding is detected, escalate to the full column.

### Subagent Constraint

Code-reviewer runs as a **subagent** (spawned via Agent tool). Subagents **cannot spawn further subagents**. Therefore:
- Code-reviewer does NOT dispatch muji, a11y-specialist, or any other agent
- Hybrid orchestration (muji + code-reviewer) is handled by the **main context** via `audit/SKILL.md`
- Code-reviewer is a pure reviewer: reads files, applies rules, writes report

### When Invoked with Muji Report (hybrid audit)

1. Read muji report → extract `finding_locations` (file:line already flagged)
2. Run cross-cutting + platform rules on the same files
3. **Dedup**: skip any file:line in muji's finding set
4. Write report to `output_path`; add delegation section (agent, verdict, count)
5. If specialist found Critical → your verdict cannot be APPROVE

### Critical Escalation (no Agent tool needed)

When Critical found: load `knowledge` → L1 docs/ → L2 RAG → L4 Grep fallback → re-examine files → update findings. Document KB layers in Methodology.

### RAG Lookup

`ToolSearch("web-rag")` → call `status` → call `query` (module + "prior findings security"). If unavailable: Grep `reports/` for prior audits. Append "L2-RAG" or "L2-RAG-unavailable" to methodology.

## Close Workflow (`--close <id>`)

When invoked with `--close <id>` or "close finding \<id\>":
- Skip the review flow entirely
- Execute the close protocol in `references/close-code-finding.md`

## Write session.json (always — after writing report.md)

Write `{session_folder}/session.json` per `audit/references/session-json-schema.md`:
- Inline review: `type: "code-review"`, `agents: [{name: "epost-code-reviewer", report: "report.md", verdict, findings}]`
- Hybrid: `type: "hybrid-audit"`, include all participating agents with their verdicts and counts

## Persist Findings (always — after writing report)

Ownership per `audit/references/output-contract.md`: code-reviewer → `.epost-data/code/`, muji → `.epost-data/ui/`, a11y → `.epost-data/a11y/`.

Persist SEC/PERF/TS/LOGIC/DEAD/ARCH/STATE/QUALITY/HOOKS/FETCH/AUTH/MOD/I18N/REDUX/TEST/FORM/NEXTJS/SWIFT/UIKIT/MEMORY/CONCURRENCY/REALM/ALAMOFIRE/COMPOSE/HILT/LOGGING/COROUTINE/FLOW/ROOM findings (critical, high, medium) to `reports/known-findings/code.json`:

1. Check if `reports/known-findings/code.json` exists
   - If not: `mkdir -p .epost-data/code/` then create it with `{ "schemaVersion": "1.0.0", "lastUpdated": "{today}", "findings": [] }`
2. **Pre-scan for regressions**: for each finding in current pass, check if same `rule_id` + `file_pattern` exists with `resolved: true` → flag `regression: true` in report; with `resolved: false` → reference existing `id`, do not duplicate
2b. **Surface recurring rules**: after pre-scan, if any `rule_id` has 3+ open entries in DB (escalated) or 5+ (lightweight), include in report's Regression Trends section with count and file patterns.
3. For each NEW finding (severity critical/high/medium) not already open in DB:
   - Auto-increment `id` from `max(existing_ids) + 1` (start at 1 for empty)
   - Map: `module`, `rule_id`, `category` (SEC/PERF/TS/LOGIC/DEAD/ARCH/STATE/QUALITY/HOOKS/FETCH/AUTH/MOD/I18N/REDUX/TEST/FORM/NEXTJS/SWIFT/UIKIT/MEMORY/CONCURRENCY/REALM/ALAMOFIRE/COMPOSE/HILT/LOGGING/COROUTINE/FLOW/ROOM), `title`, `file_pattern`, `code_pattern`, `fix_template`, `priority`, `severity`, `severity_score` (5=critical, 4=high, 3=medium, 2=low, 1=informational), `confidence`, `confirmed_by`, `confidence_source`, `source` (`hybrid-audit` or `code-review`), `source_agent: "epost-code-reviewer"`, `source_report: "{report_path}"`, `first_detected_at: "{YYYY-MM-DDTHH:MM}"`
   - Append to `findings[]`
4. Save updated JSON
5. Log: "Persisted {N} code findings to `reports/known-findings/code.json`" in Methodology

Schema: `code-review/references/code-known-findings-schema.md`

## Output Format

Use `references/report-template.md` for all code review reports.

Key requirements:
- **Session folder**: All output paths per `audit/references/output-contract.md`. `mkdir -p` before any write.
- **One main report per session** — `report.md` is the single surface for the user. Sub-agent `.md` files are source material.
- Header: Date, Agent, Plan (if applicable), Status
- Executive Summary first
- **Methodology** section (required): docs loaded, KB layers used, tools used, files scanned, coverage gaps
- **Delegation Log** section (required if delegation occurred): agent, scope, template, verdict, finding count
- Findings table with ID, Severity, File:Line, Issue, Fix
- **Regression Trends** section (include when regression scan found recurring rules):
  - Table: Rule ID | Count | Last Seen | Pattern
  - Only rules with 3+ open occurrences (escalated) or 5+ (lightweight)
  - Recommendation: "Consider adding lint rule or architectural fix for {RULE-ID}"
- Verdict: `APPROVE` | `FIX-AND-RESUBMIT` | `REDESIGN`

  > `FIX-AND-RESUBMIT` = fix issues and re-request review. Never use `FIX-AND-REAUDIT` in code-review reports.
- Unresolved questions footer always present

## Branch Scan Mode

Daily non-blocking scan of all active branches vs `main`. Runs automatically via cron — not invoked interactively.

**Script**: `packages/core/scripts/branch-scan-digest.cjs`
**Protocol**: `references/branch-scan.md`
**Digest template**: `references/slack-digest-template.md`

### How it works

1. Discovers all remote branches with activity in the last 7 days
2. Skips `kb` branch (hardcoded — not configurable)
3. Diffs each branch against `main`, runs confidence-filtered review
4. Loads `reports/branch-scan-history.json` to compute trend (new/resolved/unchanged per branch)
5. Posts a Slack digest to `REVIEW_SLACK_CHANNEL`
6. Appends run to history (rolling 30 runs max)

### Filter

Uses informational threshold (not blocking):
```
confidence >= 0.5 AND severity >= 2
```

### Cron setup (after deploy)

```
/schedule create "branch health scan" --cron "0 7 * * 1-5" --action "node packages/core/scripts/branch-scan-digest.cjs"
```

### Dry run

```bash
node packages/core/scripts/branch-scan-digest.cjs --dry-run
```

Prints what would be scanned and previews the Slack digest without posting.

### Related Skills
- `knowledge` — activated on Critical escalation
- `knowledge --capture` — use after task to persist learnings
- `auto-improvement` — session metrics and improvement trends
