---
phase: 3
title: "Pre-audit KB doc load"
effort: 1h
depends: []
---

# Phase 3: Pre-Audit KB Doc Load

## Context

Muji already loads platform component catalog in Step 1 (line 93-110 of ui.md). This phase adds a **component-specific** doc check -- loading the FEAT/CONV entry for the component being audited, not just the catalog.

Code-reviewer has no KB load step at all -- needs one added.

## Tasks

### 3.1 Add Pre-Audit KB Load to code-reviewer agent

**File**: `packages/core/agents/epost-code-reviewer.md`

Insert new section after Delegation Rules table, before Skill References:

```markdown
## Pre-Audit KB Load (Mandatory -- before reading any source file)

1. Check `docs/index.json` for a FEAT-* entry matching the component/module name
2. If found: load the FEAT doc + any linked CONV-* docs -- treat documented patterns as intentional conventions, not violations
3. If not found: note "no KB entry" as a docs gap finding (do not block audit)
4. Compare documented API surface (props, variants, exports) against actual source -- flag divergences as stale-doc findings in report under ## Docs Findings
```

### 3.2 Add Pre-Audit KB Load to muji agent

**File**: `packages/design-system/agents/epost-muji.md`

Insert into "When Acting as Auditor" section (after step 6, line 107), as a new numbered step:

```markdown
7. **Pre-audit component KB load**: Before examining source files, check `docs/index.json` for a FEAT-* entry matching the target component name. If found, load it + linked CONV-* docs; treat documented patterns as conventions (suppress violations for documented choices). If not found, note "no KB entry" as a docs gap finding. Compare documented API surface against actual source; flag divergences as stale-doc findings under ## Docs Findings.
```

Note: This is distinct from step 6 (catalog load for REUSE). Step 6 loads the catalog globally; this step loads the *specific component's* KB entry for convention suppression and staleness detection.

Renumber existing steps 7+ accordingly (current step 7 "A11y delegation" becomes step 8).

## Validation

- [ ] Code-reviewer agent has "Pre-Audit KB Load" section with 4-step protocol
- [ ] Muji agent has step 7 for component-specific KB load, distinct from step 6 catalog load
- [ ] Both agents reference `docs/index.json` FEAT-* entries
- [ ] Both agents flag "no KB entry" as docs gap (not audit blocker)
- [ ] Both agents detect stale docs (API surface mismatch)
- [ ] No edits to `.claude/` directory
