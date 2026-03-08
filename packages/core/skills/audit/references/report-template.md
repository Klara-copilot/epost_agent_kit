# UI Audit Report Template

**One report per audit session.** Multiple components or scopes → group by scope in one report, not separate files.

**Human-facing file** — filename: `{agent}-{date}-{slug}-ui-audit.md`
Pair with a machine-readable JSON envelope (`audit-report-schema.md`) if requested.

---

```markdown
# {Component Name} — UI Audit Report

**Date:** YYYY-MM-DD | **Auditor:** {agent} | **Mode:** Library|Consumer | **Branch:** {branch}
**Scope:** `path/to/component/` (all files)

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical | N |
| High | N |
| Medium | N |
| Low | N |
| A11Y (delegated) | N |
| **Total** | **N** |

**Score:** X/Y applicable rules passing — **Verdict: REDESIGN|FIX-AND-REAUDIT|PASS**

One-sentence rationale (trigger condition + root cause).

---

## Findings Index

| ID | Category | Severity | Summary |
|----|----------|----------|---------|
| WEB-STRUCT-001 | STRUCT | **Critical** | One-line summary |
| WEB-TOKEN-001 | TOKEN | **Critical** | One-line summary |
| WEB-PROPS-001 | PROPS | High | One-line summary |
| WEB-POC-001 | POC | Medium | One-line summary |

(All findings, ordered by severity desc then ID asc. Bold for Critical/High severity.)

---

## Findings

### {CATEGORY} — {Category Full Name} ({N} findings)

---

#### {ID} — {One-line descriptive title}  `{Severity}`

**Rule:** {RULE-ID} | **File:** `path/to/file.tsx:line`

Description of what is wrong and why it matters. 2–3 sentences max.

> **Fix:** Concrete action item. Code snippet if it clarifies.

---

(repeat per finding within this category, then repeat category block)

---

## A11Y Delegation

The following N findings must be delegated to **epost-a11y-specialist**. Do not attempt WCAG remediation inline.

**Context:** {Component}, {platform}, {framework}. All findings in `{path}`.

| ID | Severity | File | Issue |
|----|----------|------|-------|
| WEB-A11Y-001 | High | `file.tsx:line` | One-line issue |

(ordered by severity desc)

---

## Top 3 Mentoring Points

**1. {Bold lead sentence — the core lesson.}**
Supporting detail (2–3 sentences). Reference finding IDs.

**2. {Bold lead sentence.}**
Supporting detail.

**3. {Bold lead sentence.}**
Supporting detail.

---

## Methodology

| | |
|--|--|
| **Docs Loaded** | `{path/to/docs/index.json}` — FEAT-{N} ({component}), CONV-{N} ({convention}); or "None found" |
| **KB Layers** | L1 docs/ ({found/not found}), L2 RAG ({available/unavailable}), L3 Skills (audit/ui.md, audit-standards.md), L4 Grep ({used/not needed}) |
| **Tools Used** | {e.g. Glob (catalog discovery), Grep (pattern scan), Read (source analysis), Task (delegation)} |
| **Files Scanned** | {N} files directly read; {N}+ covered by grep |
| **Standards Source** | `audit/references/ui.md`, `ui-lib-dev/references/audit-standards.md` |
| **Coverage Gaps** | {e.g. "RAG unavailable", "iOS checklist not loaded", or "None"} |

## Delegation Log

| Agent | Scope | Template | Verdict | Findings |
|-------|-------|----------|---------|----------|
| epost-a11y-specialist | `{path/}` | Template B | block_pr: true/false | {N} |
| epost-docs-manager | `{component}` | Template D | gap / up-to-date | {N stale fields} |
| epost-mcp-manager | catalog query | Template E | {N} components returned | — |

_(Omit section if no delegation occurred)_
```

---

## Formatting Rules

| Rule | Detail |
|------|--------|
| Finding card heading | `#### {ID} — {Title}  \`{Severity}\`` — severity as inline code at end of heading |
| Fix block | Always `> **Fix:**` blockquote — visually separates fix from issue description |
| Findings Index | Required — one row per finding before any detail section |
| Category headers | Include count — `### STRUCT — Component Structure (4 findings)` |
| Severity in index | **Bold** for Critical and High; plain text for Medium and Low |
| A11Y table columns | ID \| Severity \| File \| Issue — no Rule column (redundant for delegation) |
| Code blocks | Inline examples only — never wrap finding descriptions in code fences |
| Word economy | Issue ≤ 3 sentences; Fix ≤ 2 sentences; Mentoring points ≤ 3 sentences each |
| Omit Rule field | When finding is module-wide (no specific file), omit `**File:**` |
