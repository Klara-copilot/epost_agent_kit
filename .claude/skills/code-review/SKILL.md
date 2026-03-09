---
name: code-review
description: (ePost) Use when reviewing code, checking quality before commit, or auditing changed files for issues
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

## Expertise

### Review Process
1. Scope resolution (before git diff):
   - If user provided file paths, component name, or `--files` list → **explicit scope**: use those directly, skip git diff
   - Otherwise → **implicit scope**: identify changed files via `git diff` or `git log`
2. Read the plan file if one exists — understand requirements before reviewing
3. Systematic review: structure, logic, types, performance, security
4. Categorize findings: Critical > High > Medium > Low
5. Update plan TODO status if plan exists

### Systematic Review

All code review rules are defined in `references/code-review-standards.md` with numbered IDs, severity, and pass/fail criteria.

| Category | Human Name | Rules | Scope |
|----------|-----------|-------|-------|
| SEC | Security | SEC-001..008 | OWASP Top 10, credentials, injection, auth |
| PERF | Performance | PERF-001..006 | N+1, renders, caching, bundle |
| TS | Type Safety | TS-001..006 | Unsafe any, casts, guards, generics |
| LOGIC | Logic & Correctness | LOGIC-001..006 | Null handling, edge cases, race conditions |
| DEAD | Dead Code | DEAD-001..003 | Unreachable, unused, orphaned |
| ARCH | Architecture | ARCH-001..005 | File org, boundaries, circular deps, layers |
| STATE | State Management | STATE-001..004 | Completeness, exits, guards, concurrency |

### Severity Classification
- **Critical**: Security vulnerabilities, data loss, breaking changes
- **High**: Performance issues, type safety violations, missing error handling
- **Medium**: Code smells, maintainability issues, documentation gaps
- **Low**: Style inconsistencies, minor optimizations

### Escalation Gate (Reviewer Decision)

After initial review, the reviewer decides based on findings:

| Finding | Action |
|---------|--------|
| Critical severity found | Escalate to `/audit --code` — activate `knowledge-retrieval` for deeper context before reporting |
| Task is UI code review/audit (components, tokens, design system) | Delegate to **epost-muji** — runs `/audit --ui` with klara-theme standards + INTEGRITY gate |
| Task is about a11y (accessibility, WCAG, VoiceOver, TalkBack, keyboard nav, screen reader) | Delegate to **epost-a11y-specialist** — runs `/audit --a11y` with full WCAG 2.1 AA rules |
| High severity, UI component finding | Escalate to `/audit --ui` → **epost-muji** for full component audit |
| High severity, a11y issue | Escalate to `/audit --a11y` — a11y specialist audits with WCAG rules |
| Medium/Low only | Complete inline, no escalation needed |

**Rule**: Code review is lightweight by default (no `knowledge-retrieval`). Escalate to audit only when findings warrant it. Audit always activates `knowledge-retrieval`.

### Lightweight vs. Escalated Review Scope

| Category | Lightweight (default) | Escalated (knowledge-retrieval active) |
|----------|-----------------------|---------------------------------------|
| ARCH | ARCH-001..003 (file org, boundaries, circular deps) | + ARCH-004..005 (layer violations, dependency direction) |
| LOGIC | LOGIC-001..003 (null handling, edge cases, error paths) | + LOGIC-004..006 (race conditions, off-by-one, comparison) |
| STATE | STATE-001..002 (completeness, exit states) | + STATE-003..004 (transition guards, concurrent mutations) |
| TS | TS-001..003 (unsafe any, unvalidated cast, missing guard) | + TS-004..006 (generic constraints, non-null assertions, strict null) |
| PERF | PERF-001..003 (N+1, re-renders, loops) | + PERF-004..006 (caching, bundle, lazy loading) |
| SEC | SEC-001..004 (injection, XSS, secrets, auth) | + SEC-005..008 (input validation, SSRF, deserialization, data logging) |
| Tests | Test file exists, covers changed code | + coverage gap analysis, edge case completeness |
| Standards source | code-review-standards.md only | + docs/ conventions, RAG patterns |

**Rule**: Lightweight review does NOT load knowledge-retrieval. Only categories in the "Lightweight" column are checked. If a Critical finding is detected, escalate to the full column.
**UI rule**: Any task involving UI components, design tokens, klara-theme, or consumer code → delegate to epost-muji immediately, do not review inline.
**A11y rule**: Any task involving accessibility, WCAG, assistive technology, or a11y audit → delegate to epost-a11y-specialist immediately, do not review inline.

### Dispatch Protocol

When escalation is triggered, use the delegation templates from `audit/references/delegation-templates.md`:

**Session folder**: Create per `audit/references/output-contract.md` — `mkdir -p` BEFORE any dispatch.
Pass `output_path: {session_folder}/muji-ui-audit.md` (or `a11y-audit.md`) in each delegation block.

**UI escalation (simple — to epost-muji):**
- Fill Template A with: files, component names, platform from file extensions
- Dispatch via Agent tool to epost-muji; specify `output_path: {session_folder}/muji-ui-audit.md`
- Wait for report (`.md` only — no JSON expected)
- After receiving: check `## A11Y Findings` section → if present, proceed to A11Y escalation
- Merge under `## UI Audit (delegated to epost-muji)` in your `report.md`

**A11y escalation (to epost-a11y-specialist):**
- Trigger: (1) direct a11y task, OR (2) muji report contains `## A11Y Findings` section
- Fill Template B with: files, platform, muji's finding IDs (if from muji report)
- Dispatch via Agent tool; specify `output_path: {session_folder}/a11y-audit.md`
- Wait for report
- Merge under `## A11Y Audit (delegated to epost-a11y-specialist)` in your `report.md`

**Hybrid audit — sequential (feature module, klara-theme 20+ files):**

Session folder and file names per `audit/references/output-contract.md`.

1. Create session folder: `Bash("mkdir -p reports/{YYMMDD-HHMM}-{slug}-audit/")`
   - **Pre-flight (verify ALL before step 2):**
     - [ ] `mkdir -p` executed successfully
     - [ ] `output_path` = `{session_folder}/muji-ui-audit.md`
     - [ ] Template A+ filled (NOT free-form) with all required fields
     - If any missing: fix before proceeding.
2. Dispatch muji via Template A+ — `output_path: {session_folder}/muji-ui-audit.md`
3. WAIT for muji to complete
4. Read muji report. Extract: `finding_locations` (Set of file:line), `verdict`, `a11y_findings` (if `## A11Y Findings` present)
5. If a11y findings → dispatch a11y-specialist (Template B) — `output_path: {session_folder}/a11y-audit.md` — WAIT
6. Run SEC/PERF/TS/architecture; skip file:line already in muji's set
7. Write `{session_folder}/session.json` per `audit/references/session-json-schema.md`
8. Write `{session_folder}/report.md` merging all findings. Verdict = `max(muji, a11y, own)`

**Critical escalation (deeper code audit):**
- Fill Template C with: files, trigger finding, original review path
- Self-dispatch (same agent, deeper pass with knowledge-retrieval) — no Agent tool needed:
  1. Load `knowledge-retrieval` skill (already in agent skills list)
  2. Execute search strategy: L1 docs/ (conventions, findings) → L2 RAG (implementations) → L4 Grep fallback
  3. Document KB layers used in report Methodology section
  4. Re-examine files with retrieved context; update findings

**RAG lookup (hybrid audit pass):**
1. `ToolSearch("web-rag")` → discover `mcp__web-rag-system__*` tools
2. Call `status` → confirm available
3. Call `query` with module name + "prior findings security architecture" → surface known issues
4. Call `query` with "SEC PERF TS {component}" → pull previously indexed findings
5. If RAG unavailable: fallback to Grep on `reports/` for prior audit files
6. Append "L2-RAG" or "L2-RAG-unavailable" to methodology

### Post-Delegation Report Merging

After specialist reports arrive:
1. Read the specialist's Markdown report
2. Add a delegation section to your report: agent name, report path, verdict, finding count
3. Adjust your overall verdict: if specialist found Critical → your verdict cannot be APPROVE
4. List specialist report paths in the report's Related Documents section

**Report consolidation**: After all specialist reports are merged into your report, the final deliverable is YOUR single report file. Sub-agent reports are source material — do not surface them as separate deliverables to the user unless explicitly requested.

## Write session.json (always — after writing report.md)

Write `{session_folder}/session.json` per `audit/references/session-json-schema.md`:
- Inline review: `type: "code-review"`, `agents: [{name: "epost-code-reviewer", report: "report.md", verdict, findings}]`
- Hybrid: `type: "hybrid-audit"`, include all participating agents with their verdicts and counts

## Persist Findings (always — after writing report)

Ownership per `audit/references/output-contract.md`: code-reviewer → `.epost-data/code/`, muji → `.epost-data/ui/`, a11y → `.epost-data/a11y/`.

Persist SEC/PERF/TS/LOGIC/DEAD/ARCH/STATE findings (critical, high, medium) to `.epost-data/code/known-findings.json`:

1. Check if `.epost-data/code/known-findings.json` exists
   - If not: `mkdir -p .epost-data/code/` then create it with `{ "schemaVersion": "1.0.0", "lastUpdated": "{today}", "findings": [] }`
2. **Pre-scan for regressions**: for each finding in current pass, check if same `rule_id` + `file_pattern` exists with `resolved: true` → flag `regression: true` in report; with `resolved: false` → reference existing `id`, do not duplicate
3. For each NEW finding (severity critical/high/medium) not already open in DB:
   - Auto-increment `id` from `max(existing_ids) + 1` (start at 1 for empty)
   - Map: `module`, `rule_id`, `category` (SEC/PERF/TS/LOGIC/DEAD/ARCH/STATE), `title`, `file_pattern`, `code_pattern`, `fix_template`, `priority`, `severity`, `source` (`hybrid-audit` or `code-review`), `source_agent: "epost-code-reviewer"`, `source_report: "{report_path}"`, `first_detected_at: "{YYYY-MM-DDTHH:MM}"`
   - Append to `findings[]`
4. Save updated JSON
5. Log: "Persisted {N} code findings to `.epost-data/code/known-findings.json`" in Methodology

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
- `knowledge-retrieval` — activated on Critical escalation
- `knowledge-capture` — use after task to persist learnings
- `auto-improvement` — session metrics and improvement trends
