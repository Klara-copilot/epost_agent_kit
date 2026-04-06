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

## Platform Detection

When invoked, detect platform from files in scope:
1. If caller passed explicit `Platform:` context → use it
2. Otherwise, scan file extensions in scope:
   - `.tsx`, `.ts`, `.scss`, `.css` → web
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
4. Always load: `code-review/references/code-review-standards.md` (cross-cutting)
5. If no platform detected: cross-cutting rules only
6. Multi-platform: if files span platforms, load all matching rule files

## Caller Protocol

When dispatching epost-code-reviewer, include in prompt:
```
Platform: {detected platform(s)}
Platform rules: {path to platform code-review-rules.md}
ePost rules: {comma-separated paths to ePost-specific rule files detected in step 3b, or "none"}
```

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
   - Otherwise → **implicit scope**: identify changed files via `git diff` or `git log`
2. Read the plan file if one exists — understand requirements before reviewing
3. Check `docs/conventions/` for project-level rule overrides (see Rule Authority above)
4. Systematic review: structure, logic, types, performance, security
5. Categorize findings: Critical > High > Medium > Low
6. Update plan TODO status if plan exists

### Systematic Review

Cross-cutting rules are in `references/code-review-standards.md`. Platform rules are loaded per Platform Detection above.

**Cross-cutting (always loaded):**

| Category | Human Name | Rules | Scope |
|----------|-----------|-------|-------|
| SEC | Security | SEC-001..008 | OWASP Top 10, credentials, injection, auth |
| LOGIC | Logic & Correctness | LOGIC-001..006 | Null handling, edge cases, race conditions |
| DEAD | Dead Code | DEAD-001..003 | Unreachable, unused, orphaned |
| ARCH | Architecture | ARCH-001..005 | File org, boundaries, circular deps, layers |

**Platform-specific (loaded on demand):**

| Platform | Category | Rules | Scope |
|----------|----------|-------|-------|
| Web | PERF | PERF-001..006 | N+1, renders, caching, bundle |
| Web | TS | TS-001..006 | Unsafe any, casts, guards, generics |
| Web | STATE | STATE-001..004 | Completeness, exits, guards, concurrency |
| Web | REDUX | REDUX-001..006 | Dual-store, slices, selectors (in web-frontend rules) |
| Web (ePost) | FETCH | FETCH-001..006 | FetchBuilder, caller pattern, API constants |
| Web (ePost) | AUTH | AUTH-001..006 | NextAuth, session, feature flags, route protection |
| Web (ePost) | MOD | MOD-001..005 | B2B module structure, layering, store scoping |
| Web (ePost) | I18N | I18N-001..005 | next-intl, locale completeness, navigation |
| Web (klara) | KLARA | — | klara-theme component standards |
| Backend | JPA | JPA-001..004 | JPA/Hibernate query patterns |
| Backend | CDI | CDI-001..004 | CDI/EJB injection, scope patterns |
| iOS | SWIFT | SWIFT-001..003 | Swift 6 concurrency, patterns |
| iOS | UIKIT | UIKIT-001..003 | UIKit/SwiftUI lifecycle |
| Android | COMPOSE | COMPOSE-001..003 | Jetpack Compose recomposition |
| Android | HILT | HILT-001..003 | Hilt DI correctness |

### Severity Classification
- **Critical**: Security vulnerabilities, data loss, breaking changes
- **High**: Performance issues, type safety violations, missing error handling
- **Medium**: Code smells, maintainability issues, documentation gaps
- **Low**: Style inconsistencies, minor optimizations

### Escalation Gate (Reviewer Decision)

After initial review, the reviewer decides based on findings:

| Finding | Action |
|---------|--------|
| Critical severity found | Escalate to `/audit --code` — activate `knowledge` for deeper context before reporting |
| Task is UI code review/audit (components, tokens, design system) | Delegate to **epost-muji** — runs `/audit --ui` with klara-theme standards + INTEGRITY gate |
| Task is about a11y (accessibility, WCAG, VoiceOver, TalkBack, keyboard nav, screen reader) | Delegate to **epost-a11y-specialist** — runs `/audit --a11y` with full WCAG 2.1 AA rules |
| High severity, UI component finding | Escalate to `/audit --ui` → **epost-muji** for full component audit |
| High severity, a11y issue | Escalate to `/audit --a11y` — a11y specialist audits with WCAG rules |
| Medium/Low only | Complete inline, no escalation needed |

**Rule**: Code review is lightweight by default (no `knowledge`). Escalate to audit only when findings warrant it. Audit always activates `knowledge`.

### Lightweight vs. Escalated Review Scope (Cross-cutting)

| Category | Lightweight (default) | Escalated (knowledge active) |
|----------|-----------------------|---------------------------------------|
| ARCH | ARCH-001..003 (file org, boundaries, circular deps) | + ARCH-004..005 (layer violations, dependency direction) |
| LOGIC | LOGIC-001..003 (null handling, edge cases, error paths) | + LOGIC-004..006 (race conditions, off-by-one, comparison) |
| SEC | SEC-001..004 (injection, XSS, secrets, auth) | + SEC-005..008 (input validation, SSRF, deserialization, data logging) |
| Tests | Test file exists, covers changed code | + coverage gap analysis, edge case completeness |
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

## Write session.json (always — after writing report.md)

Write `{session_folder}/session.json` per `audit/references/session-json-schema.md`:
- Inline review: `type: "code-review"`, `agents: [{name: "epost-code-reviewer", report: "report.md", verdict, findings}]`
- Hybrid: `type: "hybrid-audit"`, include all participating agents with their verdicts and counts

## Persist Findings (always — after writing report)

Ownership per `audit/references/output-contract.md`: code-reviewer → `.epost-data/code/`, muji → `.epost-data/ui/`, a11y → `.epost-data/a11y/`.

Persist SEC/PERF/TS/LOGIC/DEAD/ARCH/STATE findings (critical, high, medium) to `reports/known-findings/code.json`:

1. Check if `reports/known-findings/code.json` exists
   - If not: `mkdir -p .epost-data/code/` then create it with `{ "schemaVersion": "1.0.0", "lastUpdated": "{today}", "findings": [] }`
2. **Pre-scan for regressions**: for each finding in current pass, check if same `rule_id` + `file_pattern` exists with `resolved: true` → flag `regression: true` in report; with `resolved: false` → reference existing `id`, do not duplicate
3. For each NEW finding (severity critical/high/medium) not already open in DB:
   - Auto-increment `id` from `max(existing_ids) + 1` (start at 1 for empty)
   - Map: `module`, `rule_id`, `category` (SEC/PERF/TS/LOGIC/DEAD/ARCH/STATE), `title`, `file_pattern`, `code_pattern`, `fix_template`, `priority`, `severity`, `source` (`hybrid-audit` or `code-review`), `source_agent: "epost-code-reviewer"`, `source_report: "{report_path}"`, `first_detected_at: "{YYYY-MM-DDTHH:MM}"`
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
- Verdict: `APPROVE` | `FIX-AND-RESUBMIT` | `REDESIGN`
- Unresolved questions footer always present

### Related Skills
- `knowledge` — activated on Critical escalation
- `knowledge --capture` — use after task to persist learnings
- `auto-improvement` — session metrics and improvement trends
