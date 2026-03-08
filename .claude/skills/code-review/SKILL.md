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
    enhances: [review, review-improvements]
---

# Code Review Skill

## Purpose
Comprehensive code quality assessment and verification.

## When Active
User uses /review, asks for code review, or before committing code.

## Expertise

### Review Process
1. Read the plan file and understand requirements
2. Scope resolution (before git diff):
   - If user provided file paths, component name, or `--files` list → **explicit scope**: use those directly, skip git diff
   - Otherwise → **implicit scope**: identify changed files via `git diff` or `git log`
3. Systematic review: structure, logic, types, performance, security
4. Categorize findings: Critical > High > Medium > Low
5. Update plan TODO status

### Systematic Review
- **Structure**: File organization, module boundaries
- **Logic**: Algorithm correctness, edge cases
- **State Machines**: For stateful components — all states have exits, error/timeout handled, transitions guarded, no implicit hidden states, concurrent mutations safe
- **Types**: Type safety, missing type checks
- **Performance**: N+1 queries, unnecessary renders, inefficient loops
- **Security**: Input validation, auth checks, data exposure (OWASP Top 10: A01 access control, A02 crypto, A03 injection, A04 insecure design, A05 misconfiguration, A07 auth failures — full list at owasp.org/Top10)

### Verification Before Completion

See `verification-before-completion` skill for the full gate protocol.

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
| Task is about a11y (accessibility, WCAG, VoiceOver, TalkBack, keyboard nav, screen reader) | Delegate to **epost-a11y-specialist** — runs `/audit --a11y` or `/review --a11y` with full WCAG 2.1 AA rules |
| High severity, UI component finding | Escalate to `/audit --ui` → **epost-muji** for full component audit |
| High severity, a11y issue | Escalate to `/audit --a11y` — a11y specialist audits with WCAG rules |
| Medium/Low only | Complete inline, no escalation needed |

**Rule**: Code review is lightweight by default (no `knowledge-retrieval`). Escalate to audit only when findings warrant it. Audit always activates `knowledge-retrieval`.

### Lightweight vs. Escalated Review Scope

| Category | Lightweight (default) | Escalated (knowledge-retrieval active) |
|----------|-----------------------|---------------------------------------|
| Structure | File organization, module boundaries | + architectural pattern compliance |
| Logic | Algorithm correctness, edge cases | + cross-module impact analysis |
| State machines | Transition completeness | + concurrent mutation safety |
| Types | Type safety, missing checks | + generic constraint validation |
| Performance | Obvious N+1, unnecessary renders | + bundle impact, memoization audit |
| Security | OWASP Top 10 surface scan | + deep input validation, auth flow trace |
| Tests | Test file exists, covers changed code | + coverage gap analysis, edge case completeness |
| Standards source | code-review/SKILL.md only | + docs/ conventions, RAG patterns |

**Rule**: Lightweight review does NOT load knowledge-retrieval. Only categories in the "Lightweight" column are checked. If a Critical finding is detected, escalate to the full column.
**UI rule**: Any task involving UI components, design tokens, klara-theme, or consumer code → delegate to epost-muji immediately, do not review inline.
**A11y rule**: Any task involving accessibility, WCAG, assistive technology, or a11y audit → delegate to epost-a11y-specialist immediately, do not review inline.

### Dispatch Protocol

When escalation is triggered, use the delegation templates from `audit/references/delegation-templates.md`:

**Session folder (always create first):**
- Create `$EPOST_REPORTS_PATH/{date}-{slug}-audit/` before dispatching any sub-agent
- All sub-agent reports go inside this folder
- Your final merged report is `{folder}/report.md`
- Sub-agent filenames: `muji-ui-audit.md`, `a11y-audit.md`, `docs-gaps.md`

**UI escalation (simple — to epost-muji):**
- Fill Template A with: files, component names, platform from file extensions
- Dispatch via Task tool to epost-muji; specify `output_path: {session_folder}/muji-ui-audit.md`
- Wait for report (`.md` only — no JSON expected)
- After receiving: check `## A11Y Findings` section → if present, proceed to A11Y escalation
- Merge under `## UI Audit (delegated to epost-muji)` in your `report.md`

**A11y escalation (to epost-a11y-specialist):**
- Trigger: (1) direct a11y task, OR (2) muji report contains `## A11Y Findings` section
- Fill Template B with: files, platform, muji's finding IDs (if from muji report)
- Dispatch via Task tool; specify `output_path: {session_folder}/a11y-audit.md`
- Wait for report
- Merge under `## A11Y Audit (delegated to epost-a11y-specialist)` in your `report.md`

**Hybrid audit — sequential (feature module, klara-theme 20+ files):**
1. Create session folder: `$EPOST_REPORTS_PATH/{date}-{slug}-audit/`
2. Dispatch muji via Template A+ — `output_path: {session_folder}/muji-ui-audit.md`
3. WAIT for muji to complete
4. Read `{session_folder}/muji-ui-audit.md`. Extract:
   - `finding_locations`: Set<"file:line"> of all flagged locations
   - `verdict`: muji's overall verdict
   - `a11y_findings`: contents of `## A11Y Findings` section (if present)
5. If `a11y_findings` non-empty → dispatch a11y-specialist (Template B) — `output_path: {session_folder}/a11y-audit.md` — WAIT
6. Run SEC/PERF/TS/architecture on same files; skip file:line already in muji's set
7. Merge all into `{session_folder}/report.md`:
   - `## UI Audit` section: verdict, finding count, link to `muji-ui-audit.md`
   - `## A11Y Audit` section (if ran): link to `a11y-audit.md`
   - Own SEC/PERF/TS findings inline
8. Verdict: `max(muji, a11y, own)` where REDESIGN > FIX-AND-RESUBMIT > APPROVE

**Critical escalation (deeper code audit):**
- Fill Template C with: files, trigger finding, original review path
- This is self-dispatch (same agent, deeper pass with knowledge-retrieval)
- No Task tool needed — escalate inline:
  1. Load `knowledge-retrieval` skill (already in agent skills list)
  2. Execute search strategy: L1 docs/ (conventions, findings) -> L2 RAG (implementations) -> L4 Grep fallback
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

## Patterns

### Code Review Template
```markdown
# Code Review: [Feature]

## Summary
[Overall assessment]

## Critical Issues
- [Issue] - [Severity]

## Findings by Category
- Structure: [findings]
- Logic: [findings]
- Types: [findings]

## Recommendations
- [Action item]
- [Action item]

## Approval: [Approved/Needs Revision]
```

## Best Practices
- Review for intent first, details second
- Suggest improvements with examples
- Praise good patterns
- Balance strictness with pragmatism
- Check tests alongside code changes

Use `knowledge-capture` skill to persist learnings after this task.

## Sub-Skill Routing

When this skill is active and user intent matches a sub-skill, delegate:

| Intent | Sub-Skill | When |
|--------|-----------|------|
| Review code | `review --code` | `/review --code`, "review my code" |
| Review improvements | `review --improvements` | `/review --improvements`, improvement suggestions |
| Run tests | `test` | `/test`, "run tests", "check coverage" |
| Verify completion | `verification-before-completion` | Before claiming task done |
| Receive review | `receiving-code-review` | Processing feedback from reviewers |

## Output Format

Use `references/report-template.md` for all code review reports.

Key requirements:
- **Session folder structure**: For any audit involving sub-agents, create `$EPOST_REPORTS_PATH/{date}-{slug}-audit/`. Main report = `report.md` inside folder. Sub-agent reports alongside it (`muji-ui-audit.md`, `a11y-audit.md`). For simple (inline-only) code reviews with no sub-agents: flat file `{date}-{slug}-code-review.md` is fine.
- **One main report per session** — `report.md` is the single surface for the user. Sub-agent `.md` files are source material referenced from `report.md`, not separate deliverables.
- Header: Date, Agent, Plan (if applicable), Status
- Executive Summary first
- **Methodology** section (required): docs loaded, KB layers used, tools used, files scanned, coverage gaps
- **Delegation Log** section (required if delegation occurred): agent, scope, template, verdict, finding count
- Findings table with ID, Severity, File:Line, Issue, Fix
- Verdict: `APPROVE` | `FIX-AND-RESUBMIT` | `REDESIGN`
- Unresolved questions footer always present

### Related Skills
- `knowledge-retrieval` — Knowledge storage format
- `knowledge-capture` — Post-task capture workflow
- `auto-improvement` — Convention violations auto-detected across sessions via metrics
