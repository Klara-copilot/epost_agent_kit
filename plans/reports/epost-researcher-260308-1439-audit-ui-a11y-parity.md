# Research: A11y vs UI Component Command Parity

**Date:** 2026-03-08
**Agent:** epost-researcher
**Scope:** Command structure and workflow parity between a11y and UI audit/fix/review/close patterns
**Status:** ACTIONABLE

---

## Executive Summary

A11y has a **full 4-command workflow** (audit, fix, review, close) with unified data persistence in `.epost-data/a11y/known-findings.json`. UI component auditing is **fragmented**: audit exists (via `/audit --ui`), fix exists in the library pipeline (`fix-findings` in ui-lib-dev), but **no `fix --ui`, `review --ui`, or `close --ui` commands exist**. A11y's model provides a proven pattern. To achieve parity, UI needs:

1. **Unified command structure** — `/fix --ui <component> [--finding-id]`, `/review --ui <component>`, `/audit --close --ui <id>`
2. **Known-findings database** — `.epost-data/ui/known-findings.json` mirroring a11y's schema
3. **Delegation templates** — for fix + review (exist for audit as Template A)
4. **Aspect reference files** — in both fix and review skills

This report identifies the **exact gaps, recommended file structure, and phase plan** to close parity in 3–4 weeks.

---

## Section 1: A11y Command Matrix (Existing)

| Command | Flag | Agent | Skill/Reference | What It Does | Persistence |
|---------|------|-------|-----------------|--------------|-------------|
| **Audit a11y** | `/audit --a11y [platform]` | epost-a11y-specialist | audit/references/a11y.md | Scan changed files for WCAG violations; platform auto-detect (iOS/Android/Web) | Appends to `.epost-data/a11y/known-findings.json`; writes JSON + markdown reports |
| **Fix a11y** | `/fix --a11y [#<id>\|<n>]` | epost-a11y-specialist | fix/references/a11y-mode.md | Fix single finding by ID or top N by priority; surgical changes only | Updates known-findings.json; writes patches to `.epost-data/a11y/fixes/patches/`; reports to reports/ |
| **Review a11y** | `/review --a11y [platform] [focus]` | epost-a11y-specialist | review/references/a11y.md | Lightweight guidance review by focus area (buttons, headings, modals, forms, all) | Appends to known-findings.json; writes JSON to `.epost-data/a11y/fixes/reviews/` |
| **Close a11y** | `/audit --close <id>` | epost-a11y-specialist | audit/references/close-a11y.md | Mark a finding as resolved in known-findings.json | Updates known-findings.json (sets `resolved: true`, `resolved_date`) |

### Key A11y Patterns

**Data Store:** `.epost-data/a11y/` (versioned schema v1.3)
- `known-findings.json` — master DB; each finding has: `id`, `platform`, `wcag`, `title`, `file_pattern`, `code_pattern`, `fix_template`, `priority`, `resolved`, `resolved_date`, `fix_applied`, `source`, `first_detected_date`
- `fixes/patches/` — unified diffs (finding-{id}-YYMMDD.diff)
- `fixes/reviews/` — review reports (review-YYMMDD-HHMM.json)

**Routing Principle:** Flag override in each parent skill (`audit`, `fix`, `review`) delegates to specialist (`epost-a11y-specialist`)

**Argument Parsing:**
- `/fix --a11y #3` → single finding by ID
- `/fix --a11y 5` → top 5 by priority
- `/audit --close 3` → mark #3 resolved

---

## Section 2: UI Component Command Matrix (Current State)

| Command | Flag | Agent | Skill/Reference | What It Does | Persistence | Gap vs A11y |
|---------|------|-------|-----------------|--------------|-------------|------------|
| **Audit UI** | `/audit --ui <ComponentName> [--platform web\|ios\|android\|all]` | epost-muji | audit/references/ui.md | Audit component against 78 rules (STRUCT, PROPS, TOKEN, BIZ, A11Y, TEST, SEC, PERF, DRY); mode detection (library vs consumer); 5-section rating system | Writes `.md` report + embedded JSON to reports/; **NO known-findings DB** | Full workflow exists, but isolated |
| **Fix UI** | _(does not exist as `/fix --ui`)_ | N/A | N/A | N/A | N/A | **MISSING** |
| **Review UI** | _(does not exist as `/review --ui`)_ | N/A | N/A | N/A | N/A | **MISSING** |
| **Close UI** | _(does not exist as `/audit --close --ui`)_ | N/A | N/A | N/A | N/A | **MISSING** |
| **Library Pipeline** | Internal aspect chain | epost-muji | ui-lib-dev/references/ | plan-feature → implement-component → **audit-ui** → **fix-findings** → document-component | `.ai-agents/ui/<feature>/audit-report.json` + PATCH.diff | Pipeline-specific; not exposed as user-facing commands |

### Current UI Architecture

**Audit scope:** 78 rules across 9 categories (STRUCT, PROPS, TOKEN, BIZ, A11Y, TEST, SEC, PERF, DRY)

**Audit output:** Single `.md` report (executive summary + findings table + verdict) with embedded JSON envelope

**No persistence layer:** Each audit is standalone. No deduplication, no known-findings database, no regression detection.

**Fix mechanism exists only in library pipeline:**
- Part of ui-lib-dev skill (not exposed as `/fix --ui` command)
- Operates on `audit-report.json` from pipeline
- Writes `PATCH.diff` or `fix-notes.json` to `.ai-agents/ui/<feature>/`
- No parallel to `/fix --a11y` user command

**Review:** No guidance mode exists. (A11y has `/review --a11y [platform] [focus]` for lightweight checks.)

---

## Section 3: Gap Analysis

### Gap 1: No `/fix --ui` Command

**Current state:** Fix only exists in library pipeline (ui-lib-dev aspect), not as user-facing command.

**A11y equivalent:** `/fix --a11y #3` or `/fix --a11y 5` — single ID or batch by priority.

**What it should do:**
- Accept component name + optional finding ID: `/fix --ui EpostButton [--finding-id <id>]`
- Load audit findings from known-findings.json (to be created)
- Apply surgical fixes (minimal, scoped changes)
- Generate unified diffs to `.epost-data/ui/fixes/patches/`
- Update known-findings.json (set `fix_applied: true`, `fix_applied_date`)
- Suggest: "Run `/audit --close --ui <id>` to mark as resolved"

**Which agent:** epost-muji (owns UI expertise)

**Complexity:** **Medium** — reference architecture exists in `/fix --a11y` and ui-lib-dev's `fix-findings.md`

---

### Gap 2: No `/review --ui` Command

**Current state:** No lightweight review mode for UI. Only audit (heavy, 78 rules) or inline guidance.

**A11y equivalent:** `/review --a11y [platform] [focus]` — quick compliance check without full audit.

**What it should do:**
- Accept component name + optional focus area: `/review --ui EpostButton [--focus structure|reuse|tokens|react|a11y|all]`
- Scan for violations in **selected category** (not all 78 rules)
- Output quick findings with fix suggestions (no full audit report)
- Optionally persist lightweight findings to known-findings.json
- Faster than full audit, better than inline help

**Which agent:** epost-muji

**Complexity:** **Medium** — subset of audit logic; follows a11y review pattern

---

### Gap 3: No `/audit --close --ui` Command

**Current state:** No way to mark UI findings as resolved.

**A11y equivalent:** `/audit --close #3` — updates known-findings.json, sets `resolved: true`.

**What it should do:**
- Accept finding ID: `/audit --close <id> --ui`
- Load `.epost-data/ui/known-findings.json`
- Find the finding by ID
- Set `resolved: true`, `resolved_date: today`
- Return JSON confirmation

**Which agent:** epost-muji

**Complexity:** **Low** — identical pattern to a11y's `close-a11y.md`

---

### Gap 4: No Known-Findings Database for UI

**Current state:** Each audit produces a report. No centralized DB of findings.

**A11y equivalent:** `.epost-data/a11y/known-findings.json` (v1.3 schema)

**What's needed:**
- `.epost-data/ui/known-findings.json` — UI equivalent
- Schema: same as a11y but with UI-specific fields
  - Core fields: `id`, `component`, `rule_id` (instead of `wcag`), `title`, `file_pattern`, `code_pattern`, `fix_template`, `platform` (web|ios|android)
  - Audit fields: `priority` (1–3), `severity` (critical|high|medium|low)
  - Status fields: `resolved`, `resolved_date`, `fix_applied`, `fix_applied_date`, `source` (audit|review), `first_detected_date`

**Complexity:** **Low** — data structure design only

---

## Section 4: Design Sketch — How UI Commands Would Work

### Example Flow: Fix a UI Finding

```
User: /fix --ui EpostButton --finding-id 5

↓

epost-debugger (fix skill) detects --ui flag
↓
Loads fix/references/ui-mode.md (new reference file, parallel to a11y-mode.md)
↓
Delegates to epost-muji via Task tool

epost-muji receives:
- Component: EpostButton
- Finding ID: 5
- Mode: single-fix

Steps:
1. Load .epost-data/ui/known-findings.json
2. Find finding object { id: 5, component: "EpostButton", ... }
3. Check if already resolved → report if so
4. Read file_pattern + code_pattern to locate source
5. Apply fix_template (surgical change)
6. Generate unified diff
7. Save to .epost-data/ui/fixes/patches/finding-5-260308.diff
8. Update known-findings.json: set fix_applied: true, fix_applied_date: 2026-03-08
9. Output JSON confirmation

Output:
{
  "finding_id": 5,
  "component": "EpostButton",
  "status": "FIXED",
  "diff_summary": "Removed hardcoded color; used design token",
  "lines_changed": 2,
  "confidence": "high"
}

Suggest: Run `/audit --close --ui 5` to mark as resolved
```

### Example Flow: Review UI Component

```
User: /review --ui EpostInput --focus tokens

↓

epost-code-reviewer (review skill) detects --ui flag
↓
Loads review/references/ui.md (new reference file, parallel to a11y.md)
↓
Delegates to epost-muji via Task tool

epost-muji receives:
- Component: EpostInput
- Focus: tokens (audit TOKEN rules only)
- Mode: lightweight-review

Steps:
1. Load web-ui-lib skill (get component catalog)
2. Read EpostInput implementation
3. Run TOKEN audit rules only (6 rules: no hardcoded colors, semantic tokens, styles file, etc.)
4. Collect violations
5. Output JSON (not full audit, just findings)
6. Optionally persist to known-findings.json if issues found

Output:
{
  "component": "EpostInput",
  "platform": "web",
  "focus": "tokens",
  "total_violations": 1,
  "violations": [
    {
      "rule_id": "TOKEN-003",
      "severity": "high",
      "file": "libs/klara-theme/src/lib/EpostInput.tsx:45",
      "issue": "Hardcoded color #FF5733",
      "fix": "Use semantic token `colors.error` or `colors.warning`",
      "component_pattern": "EpostInput"
    }
  ]
}
```

### Example Flow: Close a UI Finding

```
User: /audit --close 5 --ui

↓

epost-code-reviewer (audit skill) detects --close --ui flag
↓
Loads audit/references/close-ui.md (new reference file, parallel to close-a11y.md)
↓
Delegates to epost-muji via Task tool

epost-muji receives:
- Finding ID: 5
- Mode: close

Steps:
1. Load .epost-data/ui/known-findings.json
2. Find finding with id: 5
3. If resolved: true → report already resolved
4. Else: set resolved: true, resolved_date: 2026-03-08
5. Update last_reviewed_date: 2026-03-08
6. Save file

Output:
{
  "finding_id": 5,
  "component": "EpostButton",
  "rule_id": "TOKEN-001",
  "status": "RESOLVED",
  "resolved_date": "2026-03-08"
}
```

---

## Section 5: Recommended File Structure & Implementation Plan

### Phase 1: Data Layer (Week 1)

**Goal:** Stand up known-findings database and schema.

**New files:**
1. `packages/core/skills/core/references/known-findings-schema.json`
   - Define UI schema (parallel to a11y v1.3)
   - Core fields: `id`, `component`, `rule_id`, `title`, `file_pattern`, `code_pattern`, `fix_template`, `platform`, `priority`, `severity`
   - Status fields: `resolved`, `resolved_date`, `fix_applied`, `fix_applied_date`, `source`, `first_detected_date`

2. `.epost-data/ui/known-findings.json` (template)
   - Empty DB file with schema header

3. `.epost-data/ui/.gitignore`
   - Ignore fixes/ and reviews/ directories (parallel to a11y)

**Effort:** ~0.5 days (data design + schema doc)

---

### Phase 2: Command Infrastructure (Week 1–2)

**Goal:** Wire `/fix --ui` and `/review --ui` flags into parent skills; create delegation references.

**New files:**

1. **fix/references/ui-mode.md** (mirror of a11y-mode.md)
   - Argument parsing: `#<id>` vs `<n>` vs empty
   - Instructions: single vs batch mode
   - Platform detection from finding.platform field
   - Output schema (JSON)
   - Constraints (surgical changes only)
   - ~120 lines

2. **review/references/ui.md** (mirror of a11y.md in review/)
   - Focus areas: structure, reuse, tokens, react, a11y, all
   - Quick scan rules for each focus area
   - Platform detection
   - Output JSON schema
   - ~100 lines

3. **audit/references/close-ui.md** (mirror of close-a11y.md)
   - Mark finding resolved in known-findings.json
   - Constraints (only modify target finding + last_reviewed_date)
   - Output JSON confirmation
   - ~40 lines

**Modified files:**

1. **fix/SKILL.md**
   - Add `--ui` flag override to Step 0 (parallel to `--a11y`)
   - Update aspect files table to include `references/ui-mode.md`
   - Update examples section

2. **review/SKILL.md**
   - Add `--ui` flag override to Step 0
   - Update aspect files table to include `references/ui.md`

3. **audit/SKILL.md**
   - Clarify `--close` flag supports both `--a11y` and `--ui` (already mentions it, needs example)

**Effort:** ~1 day (reference files + skill updates)

---

### Phase 3: Epost-Muji Integration (Week 2–3)

**Goal:** Implement fix + review + close workflows in epost-muji.

**Modified files:**

1. **packages/design-system/agents/epost-muji.md**
   - Add task-type routing entries for fix, review, close commands
   - Update "When Acting as Auditor" section with close delegation handling
   - ~20 lines added

2. **packages/design-system/skills/ui-lib-dev/SKILL.md**
   - Cross-reference new `/fix --ui`, `/review --ui` commands
   - Note that library pipeline's `fix-findings` is different from `/fix --ui` user command
   - ~10 lines

**Implementation (in epost-muji workflow):**

1. **For `/fix --ui`:**
   - Load fix/references/ui-mode.md logic
   - Platform-specific handling (load web-ui-lib, ios-ui-lib, or android-ui-lib as needed)
   - Reuse logic from ui-lib-dev's `fix-findings.md` (already proven pattern)
   - Generate diffs to `.epost-data/ui/fixes/patches/`
   - Update known-findings.json

2. **For `/review --ui`:**
   - Load review/references/ui.md logic
   - Implement focus-area filtering (STRUCT, PROPS, TOKEN, BIZ, A11Y, TEST rules subsets)
   - Reuse rule definitions from audit-standards.md
   - Lighter output than full audit

3. **For `/audit --close --ui`:**
   - Load audit/references/close-ui.md logic
   - Update known-findings.json

**Effort:** ~3–4 days (epost-muji implementation + testing)

---

### Phase 4: Audit Report Persistence (Week 3)

**Goal:** Connect audit output to known-findings database.

**Modified files:**

1. **audit/references/ui.md**
   - Add Step 5b: "Persist findings to `.epost-data/ui/known-findings.json`"
   - Deduplication logic (match by component + rule_id + file_pattern + code_pattern)
   - Auto-assign IDs if new
   - Set source: "audit", first_detected_date: today
   - Regression detection (if resolved finding reappears, flag `regression: true`)

2. **packages/design-system/agents/epost-muji.md**
   - Add "After audit" section: when audit produces findings, auto-persist to known-findings.json

**Effort:** ~1–2 days (dedup logic + persistence)

---

### Phase 5: Testing & Documentation (Week 4)

**Goal:** E2E test workflows; document parity achievement.

**Tests:**
- `/fix --ui EpostButton --finding-id 5` → produces diff, updates DB
- `/fix --ui EpostButton 3` → fixes top 3, updates DB
- `/review --ui EpostCard --focus tokens` → quick scan, no full audit
- `/audit --close 5 --ui` → marks resolved
- Regression detection: audit finds old finding → flag it

**Docs:**
- Update CLAUDE.md: mention `/fix --ui`, `/review --ui`, `/audit --close --ui`
- Add examples to skill aspect files

**Effort:** ~1–2 days (test cases + doc)

---

### Summary Timeline

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| 1. Data Layer | 0.5 days | Schema, empty DB template, gitignore |
| 2. Command Infrastructure | 1 day | 3 new reference files, 3 skill updates |
| 3. Epost-Muji Implementation | 3–4 days | Fix, review, close workflows in agent |
| 4. Audit Persistence | 1–2 days | DB integration in audit workflow |
| 5. Testing & Docs | 1–2 days | E2E tests, documentation |
| **TOTAL** | **~7–10 days** | **Full parity achieved** |

---

## Section 6: Delegation Templates for UI

Three new templates should be added to `audit/references/delegation-templates.md`:

### Template F: UI Fix (→ epost-muji)

```
## Delegated UI Fix

Finding ID: {id}
Component: {component_name}
Platform: {web | ios | android}
Audit reference: {path_to_audit_report}

Expectations:
- Load finding from .epost-data/ui/known-findings.json
- Apply minimal surgical fix per fix_template
- Generate unified diff to .epost-data/ui/fixes/patches/finding-{id}-YYMMDD.diff
- Update known-findings.json: set fix_applied: true, fix_applied_date: today
- Produce JSON status output

Boundaries:
- Surgical changes only — no refactoring
- Do not modify variable names or reorganize code
- Do not change component API or break backwards compatibility

Report back to: {calling_agent}
Output path: {reports_path}
```

### Template G: UI Review (→ epost-muji)

```
## Delegated UI Review

Component: {component_name}
Focus: {structure | reuse | tokens | react | a11y | all}
Platform: {web | ios | android | all}
Mode: lightweight | deep

Expectations:
- Run focus-area rules only (subset of full audit)
- Produce JSON findings (not full audit report)
- Optionally persist findings to .epost-data/ui/known-findings.json if new issues
- If mode=deep, run full audit; else run quick scan

Boundaries:
- Analyze and report only — do not modify source files
- If A11Y findings emerge, note for a11y-specialist delegation

Report back to: {calling_agent}
Output path: {reports_path}
```

### Template H: UI Close (→ epost-muji)

```
## Delegated UI Close

Finding ID: {id}
Component: {component_name}

Expectations:
- Mark finding as resolved in .epost-data/ui/known-findings.json
- Set resolved: true, resolved_date: today
- Update last_reviewed_date: today
- Produce JSON confirmation

Boundaries:
- Only modify target finding and last_reviewed_date
- Do not create new entries if ID doesn't exist

Report back to: {calling_agent}
```

---

## Section 7: Known Differences (A11y vs UI)

| Aspect | A11y | UI |
|--------|------|-----|
| **Spec Authority** | WCAG 2.1 AA (external standard) | Internal audit-standards.md (78 rules) |
| **Finding ID Naming** | By WCAG code (2.1.1, 4.1.2, etc.) | By rule ID (TOKEN-001, STRUCT-002, etc.) |
| **Platform Complexity** | 3 platforms (iOS/Android/Web) — equal priority | 3 platforms — UI library reuse check platform-agnostic |
| **Known Findings Schema** | `wcag` field (string) | `rule_id` field + `ruleCategory` (STRUCT|PROPS|TOKEN|BIZ|A11Y|TEST|SEC|PERF|DRY) |
| **Review Mode** | Lightweight (by focus area: buttons, headings, forms) | Lightweight (by focus area: structure, reuse, tokens, react, a11y) |
| **Fix Scope** | Accessibility attributes only | Depends on rule (code, tokens, structure, patterns) |

---

## Section 8: Verdict & Recommendations

### What Exists ✓

1. **A11y full workflow** — audit, fix, review, close all implemented with unified data persistence
2. **UI audit** — comprehensive (78 rules), but isolated
3. **UI fix in library pipeline** — proven pattern in ui-lib-dev skill
4. **Audit skill infrastructure** — already has flag override pattern (`--a11y`, `--ui`, `--code`)

### What's Missing ✗

1. `/fix --ui` command (only library pipeline exists)
2. `/review --ui` command (no guidance mode)
3. `/audit --close --ui` command
4. `.epost-data/ui/known-findings.json` database
5. Reference files in fix/review skills

### Why This Matters

- **Developer experience:** Unified interface (a11y has 4 commands, UI has 1.5)
- **Regression detection:** Without known-findings DB, same bug can be re-flagged
- **Batch operations:** `/fix --ui 5` (fix top 5) impossible without DB
- **Cross-domain collaboration:** a11y can detect and delegate to UI (`Template F`); currently only one-way

### Implementation Path

**High confidence, low risk.** Reference architectures exist in:
- `/fix --a11y` → use for `/fix --ui`
- `/review --a11y` → use for `/review --ui`
- `/audit --close` → use for `/audit --close --ui`
- ui-lib-dev's `fix-findings.md` → proven fix patterns for UI

**Effort estimate:** 7–10 days for full parity (all phases).

### Recommended Next Step

1. **Validate schema** — confirm `.epost-data/ui/known-findings.json` field list with epost-muji
2. **Prototype `/fix --ui`** — implement in epost-muji as a proof-of-concept
3. **Iterate** — add `/review --ui` and `/audit --close --ui` once fix is stable
4. **Document** — update CLAUDE.md and examples

---

## Section 9: Unresolved Questions

1. **UI finding ID scheme:** Should IDs be sequential (1, 2, 3...) like a11y, or scoped per component (EpostButton-001, EpostInput-001)?
   - **Recommendation:** Sequential + component lookup (like a11y + wcag). Schema has `component` field.

2. **UI review focus areas:** Should there be 6 focus areas (structure, reuse, tokens, react, a11y, test) or more granular (e.g., separate reuse-missing vs reuse-wrong)?
   - **Recommendation:** Start with 6 matching audit categories; can sub-divide later.

3. **Persistence trigger:** Should every `/audit --ui` automatically persist findings, or only on explicit flag?
   - **Recommendation:** Auto-persist (like a11y). Dedup by component + rule_id + file_pattern + code_pattern.

4. **Cross-domain A11y findings in UI audit:** Currently, epost-muji flags A11Y findings but doesn't delegate. Should it auto-delegate to epost-a11y-specialist?
   - **Recommendation:** Yes, add Template A+ delegation (already exists for code-reviewer; do same for a11y-specialist).

5. **Review report persistence:** Should `/review --ui` persist findings to known-findings.json automatically, or only when marked as "real issue"?
   - **Recommendation:** Only persist if severity >= medium (filter out low-confidence suggestions).

---

## Sources

| Document | Path | Key Content |
|----------|------|-------------|
| A11y Skill (Core) | packages/a11y/skills/a11y/SKILL.md | POUR framework, severity scoring, PR blocking rules, operating modes |
| A11y Agent | packages/a11y/agents/epost-a11y-specialist.md | Task routing, platform detection, cross-delegation, known-findings DB schema |
| A11y Audit | packages/core/skills/audit/references/a11y.md | Audit workflow, methodology tracking, platform modes |
| A11y Fix | packages/core/skills/fix/references/a11y-mode.md | Argument parsing, single vs batch mode, patch generation, known-findings update |
| A11y Review | packages/core/skills/review/references/a11y.md | Focus areas, lightweight checks, platform-specific guidance |
| A11y Close | packages/core/skills/audit/references/close-a11y.md | Mark finding resolved, known-findings update |
| UI Audit (Core) | packages/core/skills/audit/references/ui.md | Audit workflow, 78 rules, mode detection (library vs consumer), INTEGRITY gate |
| UI Agent | packages/design-system/agents/epost-muji.md | Task routing, consumer audit vs library dev, audit standards reference |
| UI Lib-Dev | packages/design-system/skills/ui-lib-dev/SKILL.md | Figma-to-code pipeline, audit-ui aspect, fix-findings aspect |
| UI Lib-Dev Fix | packages/design-system/skills/ui-lib-dev/references/fix-findings.md | Resolve audit findings, patch generation, validation |
| Audit Skill | packages/core/skills/audit/SKILL.md | Unified audit command, flag override (--ui, --a11y, --code), delegation templates A–E |
| Fix Skill | packages/core/skills/fix/SKILL.md | Unified fix command, flag override (--a11y, --ui, --deep, --ci) |
| Review Skill | packages/core/skills/review/SKILL.md | Unified review command, flag override (--code, --a11y, --improvements) |
| Delegation Templates | packages/core/skills/audit/references/delegation-templates.md | 5 existing templates (A–E); 3 new ones needed (F–H) |

---

## Conclusion

UI audit/fix/review/close commands **can achieve full parity with a11y in 7–10 days** using proven patterns from a11y as a template. The infrastructure is ~80% there (audit exists, fix pattern proven in library pipeline, command routing already in place). The main work is **extracting library pipeline fixes into a user-facing command, adding lightweight review mode, and building the known-findings DB**.

**Verdict:** `ACTIONABLE` — ready to move to implementation phase with phase plan above.
