---
phase: 1
title: "Shared report schema -- dedup Methodology, Delegation Log, Executive Summary"
effort: 1h
depends: []
---

# Phase 1: Shared Report Schema

## Context (Gap 1)

Three places define overlapping report sections:
- `packages/core/skills/code-review/references/report-template.md` -- Methodology table, Delegation Log, Executive Summary (prose)
- `packages/core/skills/audit/references/audit-report-schema.md` -- methodology JSON object (filesScanned, knowledgeTiersUsed, standardsSource, coverageGaps)
- `packages/core/skills/audit/references/ui.md` Step 0 -- methodology tracking init (same 4 fields, different format)
- `packages/core/skills/core/references/report-standard.md` -- already has Methodology section (lines 26-34) but it's a skeleton

Executive Summary inconsistency: code-review uses "2-3 sentences" prose; audit uses severity count table in JSON `summary` object.
Score: code-review is freeform "X.X/10"; audit has strict formulas.
Delegation Log: code-review says "Finding Count" header; should match.

## Tasks

### 1.1 Expand report-standard.md with authoritative section specs

**File**: `packages/core/skills/core/references/report-standard.md`

Add after the existing Methodology section (line 35):

**Delegation Log specification:**
```markdown
## Delegation Log

Required when audit/review delegates to specialist agents. Omit section if no delegation.

| Agent | Scope | Template | Verdict | Findings |
|-------|-------|----------|---------|----------|
| {agent-name} | `{path/}` | Template {A/B/C/D/E} | {verdict} | {N} |

- Column "Findings" (not "Finding Count") -- use integer count
- One row per delegation, chronological order
- Verdict uses the specialist's own verdict vocabulary (see Verdict Word table above)
```

**Executive Summary specification:**
```markdown
## Executive Summary Specification

All reports: 2-3 sentences, <200 words. Structure:
1. What was reviewed/audited (scope + mode)
2. Key finding or quality signal
3. Outcome (verdict preview)

For audit reports that include JSON: the `summary` object provides machine-readable counts. The Markdown Executive Summary provides the human narrative. Both must be present; they complement, not replace each other.
```

**Score specification:**
```markdown
## Score Specification

| Report Type | Format | Source |
|-------------|--------|--------|
| Code review | `X.X/10` -- breakdown: correctness, security, performance, tests, style | Reviewer judgment |
| UI audit (library) | `{PASS_COUNT}/{TOTAL_RULES}` | `audit-standards.md` rule count |
| UI audit (consumer) | Per-section 0-10 scores | `audit-standards.md` consumer formulas |
| A11y audit | WCAG level: A / AA / AAA conformance | Platform a11y rules |
```

### 1.2 Update code-review report-template.md to reference report-standard.md

**File**: `packages/core/skills/code-review/references/report-template.md`

Changes:
- Line 25-35 (Methodology section): Replace inline definition with: `> Format per core/references/report-standard.md Methodology section`
- Line 37-43 (Delegation Log): Replace inline definition with: `> Format per core/references/report-standard.md Delegation Log section`
- Keep the template structure (it's the fill-in-the-blanks version) but add the reference so agents know the spec source
- Change header "Finding Count" (line 38) to "Findings" for consistency

### 1.3 Update audit-report-schema.md methodology field docs to reference report-standard.md

**File**: `packages/core/skills/audit/references/audit-report-schema.md`

Changes:
- After line 88 (methodology JSON block): Add note: `> JSON methodology fields map to core/references/report-standard.md Methodology table. Use identical field semantics.`
- No structural changes to the JSON schema itself

### 1.4 Update ui.md Step 0 methodology init to reference report-standard.md

**File**: `packages/core/skills/audit/references/ui.md`

Changes:
- Lines 50-59 (Step 0 pre: Track Methodology): Add reference line: `Track these fields per core/references/report-standard.md Methodology section.`
- Keep the init code block (it's useful as a quick-start)

## Validation

- [ ] `report-standard.md` has Delegation Log, Executive Summary, and Score spec sections
- [ ] `code-review/references/report-template.md` references `report-standard.md` for shared sections
- [ ] `audit/references/audit-report-schema.md` references `report-standard.md` for methodology semantics
- [ ] `ui.md` Step 0 references `report-standard.md`
- [ ] No content duplication removed -- only references added (safe, non-breaking)
- [ ] "Findings" column name consistent across all templates
