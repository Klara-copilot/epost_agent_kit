---
phase: 4
title: "Delegation Template A++ + Report Format"
effort: 1h
depends: [2, 3]
---

# Phase 4: Delegation Template A++ + Report Format

## Overview

Add Template A++ to `delegation-templates.md` for POC organism dispatches. Update `report-template.md` with phased roadmap output format for POC components.

## Tasks

### 4.1 — Template A++ in delegation-templates.md

**File:** `.claude/skills/audit/references/delegation-templates.md`
**Action:** Add new template after Template A+

```markdown
## Template A++: POC Organism Audit (→ epost-muji)

\`\`\`
## Delegated POC Organism Audit

Scope: {file_list}
Component(s): {component_names}
Mode: library
Platform: {web | ios | android | all}
Component Class: organism
Maturity Tier: {poc | beta | stable}
Audit focus: ORGANISM, STATE, MOCK, A11Y, TEST (DIALOG advisory-only)
Out of scope: STRUCT-002, TOKEN-001, BIZ-001/002/003, STRUCT-005, TEST-004 (suppressed per maturity tier)

Expectations:
- Classify component per Step 0.5 (confirm organism classification)
- Apply maturity tier per Step 0.6 — modulate blocking vs advisory
- Load checklist-web-organism.md (NOT checklist-web.md)
- Include mock boundary scan: verify MOCK_* naming, API contract mapping, export isolation
- Produce .md report with phased roadmap verdict (Now / Before Beta / Before Stable)
- Include ## Component Catalog and ## Docs Gaps sections

Boundaries:
- Analyze and report only — do not modify source files
- Do not run SEC, PERF, or architecture checks — caller handles those
- DIALOG-* rules are advisory only — include but do not raise as current findings
- If A11Y findings emerge, collect and note for a11y-specialist delegation

Report back to: {calling_agent}
Output path: {session_folder}/muji-ui-audit.md
\`\`\`
```

### 4.2 — Phased Roadmap in report-template.md

**File:** `.claude/skills/audit/references/report-template.md`
**Action:** Add new section after the existing verdict/scoring section

Add after the Executive Summary template block:

```markdown
### POC Verdict — Phased Roadmap (when maturityTier != stable)

Replace the binary verdict line with this phased roadmap when auditing poc or beta components:

\`\`\`markdown
## Phased Roadmap

### Now (POC → Stable POC)
Blocking findings that must be fixed before POC demo/review.

| ID | Severity | Summary | Fix |
|----|----------|---------|-----|
| ... | critical/high | ... | ... |

### Before Beta
Should-fix findings for production readiness. Currently advisory.

| ID | Severity | Summary | Fix |
|----|----------|---------|-----|
| ... | medium | ... | ... |

### Before Stable
Nice-to-fix and advisory items. Address during hardening phase.

| ID | Severity | Summary | Fix |
|----|----------|---------|-----|
| ... | low | ... | ... |
\`\`\`

**Verdict line for POC:** `**POC Verdict: {N} blocking / {N} before-beta / {N} before-stable**`
(replaces PASS / FIX-AND-REAUDIT / REDESIGN for poc/beta tiers)
```

### 4.3 — Update Template Table in SKILL.md

**File:** `.claude/skills/audit/SKILL.md`
**Action:** Add Template A++ row to the delegation template table

Add row:
```
| A++ — POC Organism Audit | epost-muji | `--ui` + organism classification + `--poc`/`--beta` |
```

## Files Changed

| File | Action |
|------|--------|
| `.claude/skills/audit/references/delegation-templates.md` | Add Template A++ (~30 lines) |
| `.claude/skills/audit/references/report-template.md` | Add Phased Roadmap section (~25 lines) |
| `.claude/skills/audit/SKILL.md` | Add A++ row to template table |

## Validation

- Template A++ is complete with all placeholders documented
- Phased roadmap format has three tiers (Now / Before Beta / Before Stable)
- POC verdict line replaces binary verdict for non-stable tiers
- Template table in SKILL.md includes A++ entry
- Existing templates (A, A+, B, C, D, E) unchanged
