---
phase: 3
title: "POC Flag + Routing Wiring"
effort: 1.5h
depends: [1, 2]
---

# Phase 3: POC Flag + Routing Wiring

## Overview

Wire `--poc` flag through `audit/SKILL.md` and `ui.md` so the classification and maturity tier systems from Phase 1 activate correctly. Update Step 3 (audit categories) in `ui.md` to route to organism checklist when classification warrants it.

## Tasks

### 3.1 — Add --poc Flag to SKILL.md

**File:** `.claude/skills/audit/SKILL.md`
**Action:** Update argument-hint and Step 0

Update frontmatter `argument-hint`:
```yaml
argument-hint: "[--ui <ComponentName> [--platform web|ios|android|all] [--poc|--beta|--stable] | --a11y [platform] | --code]"
```

Update Step 0 — Flag Override:
```
If `$ARGUMENTS` contains `--poc`, `--beta`, or `--stable`: extract and pass as maturity tier to ui.md workflow.
These flags combine with `--ui` — they are not standalone modes.
```

### 3.2 — Update Step 3 Routing in ui.md

**File:** `.claude/skills/audit/references/ui.md`
**Action:** Modify Step 2 (Load Platform Checklist) to branch on `componentClass`

Current Step 2 loads `checklist-web.md` unconditionally. Change to:

```
### Step 2: Load Platform Checklist(s)

Load checklist based on componentClass (from Step 0.5):
- atom, molecule → `references/checklist-web.md`
- organism, application → `references/checklist-web-organism.md`

Load maturity tier modulation (from Step 0.6) — apply severity overrides before scoring.
```

### 3.3 — Update Step 3 Category Table for Organisms

**File:** `.claude/skills/audit/references/ui.md`
**Action:** Add organism-specific category table

After the existing Step 3 category table, add:

```
**Organism/Application mode** — replace the category table above with:

| Category | Rule IDs | What to Check |
|----------|----------|--------------|
| **ORGANISM** | ORGANISM-001–006 | Public API surface, props, callbacks, env isolation, CSS containment |
| **STATE** | STATE-001–005 | State boundaries, external state via props, side effects, mock isolation |
| **MOCK** | MOCK-001–005 | Mock naming, API contract mapping, injection pattern, export isolation |
| **DIALOG** | DIALOG-001–004 | Future: fixed positioning, viewport units, body manipulation, focus (advisory only) |
| **A11Y** | A11Y-001–005 | Same as atom/molecule — always applies |
| **TEST** | TEST-001–003 | Tests + stories (TEST-004 Figma filtered by maturity tier) |
```

### 3.4 — Suppress Atom Rules for Organisms

**File:** `.claude/skills/audit/references/ui.md`
**Action:** Add suppression note to Step 3

```
When componentClass is organism or application, the following atom/molecule rules
from checklist-web.md are NOT applied (they are replaced by organism equivalents):
- STRUCT-002 → replaced by ORGANISM-005 (compound entry point)
- STRUCT-005 → N/A (organisms are view containers, not leaf components)
- TOKEN-001 → N/A (organisms delegate styling to child atoms/molecules)
- BIZ-001/002/003 → replaced by STATE-001 (organisms ARE domain-aware; boundary is at props)

These rules do not appear in findings, score, or verdict for organisms.
```

## Files Changed

| File | Action |
|------|--------|
| `.claude/skills/audit/SKILL.md` | Update argument-hint, add maturity flag extraction to Step 0 |
| `.claude/skills/audit/references/ui.md` | Update Step 2 (checklist routing), Step 3 (category table branch, suppression list) |

## Validation

- `--poc` flag parses correctly alongside `--ui` and `--platform`
- Organism classification routes to organism checklist, not atom checklist
- Atom/molecule classification still routes to existing checklist (no regression)
- Suppressed rules do not appear in organism audit output
- A11Y rules still apply to organisms
