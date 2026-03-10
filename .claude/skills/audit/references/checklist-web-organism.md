# Web Organism/Application Checklist

For use when `componentClass` is `organism` or `application`. Parallel to `checklist-web.md` — covers organism-specific concerns: public API surface, state boundaries, mock data isolation, and dialog compatibility.

**Maturity tier applies:** Severity is modulated per Step 0.6 of `ui.md`. POC components use phased roadmap verdict, not binary PASS/FAIL.

**Atom/molecule rules NOT applied here:** STRUCT-002, STRUCT-005, TOKEN-001, BIZ-001, BIZ-002, BIZ-003 — see suppression note in `ui.md` Step 3.

---

## ORGANISM — Public API Surface

Default severity applies unless maturity tier modulates.

- [ ] **ORGANISM-001** `high` — Props interface exported and documented (`I{Name}Props` with JSDoc for every prop)
- [ ] **ORGANISM-002** `medium` — All callbacks follow `on{Event}` naming, typed with domain-agnostic signatures (no internal domain types in callback params)
- [ ] **ORGANISM-003** `critical` — No environment coupling: no `process.env` reads, no `window.location` reads, no hardcoded URLs in component body
- [ ] **ORGANISM-004** `medium` — CSS containment-safe: no `position: fixed`, no viewport-relative units (`100vh`, `100vw`) in root element, no `z-index > 50`
- [ ] **ORGANISM-005** `high` — Compound entry point: single `index.ts` barrel exports the organism + its public types only
- [ ] **ORGANISM-006** `medium` — Internal views not individually exported: internal views/subcomponents accessible only through parent organism routing, not via barrel

---

## STATE — State Boundary

- [ ] **STATE-001** `critical` — External state received via props only: no direct store reads (`useSelector`, `useAppSelector`), no context reads for domain data
- [ ] **STATE-002** `medium` — Stable callback references: callbacks wrapped in `useCallback` or received as props; no inline arrow functions passed to deeply nested children without memoization
- [ ] **STATE-003** `low` — Internal state machine documented: states, transitions, and terminal states listed in JSDoc or co-located `state-machine.md`
- [ ] **STATE-004** `high` — No side effects on mount: `useEffect` with empty deps array must not call external APIs or mutate external state
- [ ] **STATE-005** `medium` — Mock data isolated in dedicated files: `mock-*.ts` or `__mocks__/` directory; no inline mock objects in component files

---

## MOCK — POC Mock Boundaries

Applies when `maturityTier = poc` or `beta`. MOCK-* rules are N/A for `stable` (mocks should not exist in stable components).

- [ ] **MOCK-001** `medium` — All mock constants use `MOCK_` prefix (SCREAMING_SNAKE_CASE)
- [ ] **MOCK-002** `high` — Every mock maps to a documented future API contract: JSDoc comment or inline comment referencing expected endpoint/shape
- [ ] **MOCK-003** `high` — Recipients, analytics, and external service data injected via props: not imported from mock files at render time
- [ ] **MOCK-004** `medium` — Mock data files export typed constants matching the expected API response shape (no `any`, no untyped objects)
- [ ] **MOCK-005** `critical` — No mock data in production exports: `index.ts` barrel does not re-export mock files or `__mocks__/` contents

---

## DIALOG — Future Compatibility (advisory-only)

**DIALOG-* rules exist for future dialog/modal embedding compatibility. Currently advisory-only — do not raise as current findings unless organism is explicitly scoped for dialog embedding.**

- [ ] **DIALOG-001** `low (advisory)` — No `position: fixed` children: organism must work inside modal/dialog containers
- [ ] **DIALOG-002** `low (advisory)` — Container-relative sizing: uses `%`, `em`, `rem`, flex/grid; no `100vh`/`100vw`
- [ ] **DIALOG-003** `low (advisory)` — No `document.body` manipulation: no scroll locks, no portal appends, no body class toggles
- [ ] **DIALOG-004** `low (advisory)` — Focus management delegated to parent: no `autoFocus`, no programmatic focus on mount

---

## Severity Defaults per Rule

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

---

## Scoring

- ORGANISM rules: 6
- STATE rules: 5
- MOCK rules: 5
- DIALOG rules: 4 (advisory-only, excluded from score)
- **Total scored rules: 16**

```
PASS count: ___
FAIL count: ___
Score: PASS/16 (percentage)
```

### Verdict Thresholds (stable/beta)

- **PASS**: 0 critical FAIL, 0 high FAIL
- **FIX-AND-REAUDIT**: any high FAIL, or 3+ medium FAIL
- **REDESIGN**: 2+ critical FAIL

### POC Verdict (when maturityTier = poc)

Use phased roadmap format instead of binary verdict (see `report-template.md` Phased Roadmap section).
