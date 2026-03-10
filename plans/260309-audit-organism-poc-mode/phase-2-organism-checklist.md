---
phase: 2
title: "Organism Web Checklist"
effort: 2h
depends: [1]
---

# Phase 2: Organism Web Checklist

## Overview

Create `checklist-web-organism.md` parallel to `checklist-web.md`. Covers organism-specific concerns: public API surface, state boundaries, mock data isolation, and dialog compatibility (future).

## Tasks

### 2.1 — Create checklist-web-organism.md

**File:** `.claude/skills/audit/references/checklist-web-organism.md` (NEW)

Structure mirrors `checklist-web.md` format. Four new rule categories:

#### ORGANISM — Public API Surface

- [ ] ORGANISM-001: Props interface exported and documented (`I{Name}Props` with JSDoc)
- [ ] ORGANISM-002: All callbacks follow `on{Event}` naming, typed with domain-agnostic signatures
- [ ] ORGANISM-003: No environment coupling — no `process.env`, no `window.location` reads, no hardcoded URLs
- [ ] ORGANISM-004: CSS containment-safe — no `position: fixed`, no viewport-relative units in root, no `z-index > 50`
- [ ] ORGANISM-005: Compound entry point — single `index.ts` barrel exports the organism + its types only
- [ ] ORGANISM-006: Internal views not individually exported — only accessible through parent organism routing

#### STATE — State Boundary

- [ ] STATE-001: External state received via props only — no direct store/context reads for domain data
- [ ] STATE-002: Stable callback references — callbacks wrapped in useCallback or received as props, no inline closures in parent
- [ ] STATE-003: Internal state machine documented — states, transitions, and terminal states listed in JSDoc or co-located doc
- [ ] STATE-004: No side effects on mount — useEffect with empty deps must not call external APIs or mutate external state
- [ ] STATE-005: Mock data isolated in dedicated files — `mock-*.ts` or `__mocks__/` directory, not inline in components

#### MOCK — POC Mock Boundaries

- [ ] MOCK-001: All mock constants use `MOCK_` prefix (SCREAMING_SNAKE)
- [ ] MOCK-002: Every mock maps to a documented future API contract — comment or JSDoc linking to expected endpoint/shape
- [ ] MOCK-003: Recipients, analytics, and external service data injected via props — not imported from mock files at render
- [ ] MOCK-004: Mock data files export typed constants matching the expected API response shape
- [ ] MOCK-005: No mock data in production exports — `index.ts` barrel does not re-export mock files

#### DIALOG — Future Compatibility (advisory-only, not raised as current findings)

- [ ] DIALOG-001: No `position: fixed` children — organism must work inside modal/dialog containers
- [ ] DIALOG-002: Container-relative sizing — uses `%`, `em`, `rem`, flex/grid; no `100vh`/`100vw`
- [ ] DIALOG-003: No `document.body` manipulation — no scroll locks, no portal appends, no body class toggles
- [ ] DIALOG-004: Focus management delegated to parent — no `autoFocus`, no programmatic focus on mount

**DIALOG note in checklist:** "DIALOG-* rules exist for future dialog/modal embedding compatibility. Currently advisory-only — do not raise as findings unless organism is explicitly scoped for dialog embedding."

### 2.2 — Scoring Section

Add to checklist bottom:

```
## Scoring
- ORGANISM rules: 6
- STATE rules: 5
- MOCK rules: 5
- DIALOG rules: 4 (advisory-only, excluded from score)
- Total scored rules: 16
- PASS count: ___
- FAIL count: ___
- Score: PASS/16 (percentage)

### Verdict Thresholds
- **PASS**: 0 critical FAIL, 0 high FAIL
- **FIX-AND-REAUDIT**: any high FAIL, or 3+ medium FAIL
- **REDESIGN**: 2+ critical FAIL

### POC Verdict (when maturityTier = poc)
Use phased roadmap format instead of binary verdict (see report-template.md).
```

### 2.3 — Severity Defaults per Rule

Include default severity in checklist:

| Rule | Default Severity |
|------|-----------------|
| ORGANISM-001 | high |
| ORGANISM-002 | medium |
| ORGANISM-003 | critical |
| ORGANISM-004 | medium |
| ORGANISM-005 | high |
| ORGANISM-006 | medium |
| STATE-001 | critical |
| STATE-002 | medium |
| STATE-003 | low |
| STATE-004 | high |
| STATE-005 | medium |
| MOCK-001 | medium |
| MOCK-002 | high |
| MOCK-003 | high |
| MOCK-004 | medium |
| MOCK-005 | critical |
| DIALOG-* | low (advisory) |

## Files Changed

| File | Action |
|------|--------|
| `.claude/skills/audit/references/checklist-web-organism.md` | NEW — ~120 lines |

## Validation

- File exists at expected path
- All 4 rule categories present with correct ID prefixes
- Scoring section matches rule count (16 scored + 4 advisory)
- DIALOG section clearly marked as future/advisory
- No overlap with `checklist-web.md` rule IDs
