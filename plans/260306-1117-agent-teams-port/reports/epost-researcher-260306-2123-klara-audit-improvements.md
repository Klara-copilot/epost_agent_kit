---
date: 2026-03-06
agent: epost-researcher
scope: UI Component Audit Skill Enhancement
status: complete
---

# Research: Klara-Theme Audit Skill Improvements

## Executive Summary

The reference plan in `luz_next/plans/260306-1944-muji-audit-ui-enhanced/` defines a comprehensive enhancement to the UI component audit workflow, adding **27 new rules across 6 sections** (PLACE, REUSE, TW, DRY, REACT, POC) specifically designed for **consumer code audits**. The current `epost_agent_kit` audit skill is optimized for **library component audits** only.

**Key Gap**: Consumer feature code has different priorities: placement/structure first, then reuse enforcement, Tailwind compliance, established patterns, React best practices, production maturity — not the library-centric STRUCT → TOKEN → BIZ → A11Y → TEST order.

**Actionable Recommendation**: Implement in 4 phases across 4 files, adding mode detection, 27 new rules, per-section ratings, and POC detection.

---

## Comparison: Current vs Enhanced

### Current State (35 rules)
- File: `packages/design-system/skills/ui-lib-dev/references/audit-standards.md`
- Sections: STRUCT (6), PROPS (8), TOKEN (7), BIZ (5), A11Y (5), TEST (4)
- Coverage: Library components only
- Report: Flat findings, single score (X/35), verdict: pass | fix-and-reaudit | redesign

### Enhanced State (62 rules total)
- New sections: PLACE (7), REUSE (8), TW (5), DRY (3), REACT (8), POC (7)
- Existing sections: STRUCT, PROPS, TOKEN, BIZ, A11Y, TEST (renumbered)
- Coverage: Consumer + Library with mode detection
- Report: v2.0 with per-section ratings, insight narratives, POC indicators, reuse opportunities, pattern observations

---

## Gap Analysis

### 1. No Mode Detection
- **Current**: All code treated as library component
- **Needed**: Step 0 detects consumer vs library from path + imports
- **Impact**: Consumer code flagged for domain types (false positives)

### 2. No PLACE Audit (7 new rules)
- Missing: Path validation, coupling mismatch, structure checks, file size limits
- Impact: Consumer code in wrong location undetected

### 3. No REUSE Audit (8 new rules)
- Missing: Button, input, dialog, select, icons, text, spinner, toast adoption from klara
- Impact: Teams duplicate library work

### 4. No TW Audit (5 new rules)
- Missing: Tailwind config compliance check; enforce project tokens over raw Tailwind
- Impact: Styling bypasses project tokens

### 5. No DRY Gating (3 new rules)
- Missing: Accept patterns in 2+ sibling files as conventions; suppress violations
- Impact: False positives on project-wide conventions

### 6. No REACT Audit (8 new rules)
- Missing: useEffect deps, memoization, prop drilling, keys, DOM access, error boundaries
- Impact: Performance bugs missed

### 7. No POC Detection (7 new rules)
- Missing: console.log, TODOs, hardcoded mocks, as any, unguarded dev URLs
- Impact: Prototype code shipped

### 8. No Per-Section Ratings
- Current: Single score (28/35)
- Needed: PLACE: 7.0, REUSE: 7.0, TW: 6.5, REACT: 8.0, POC: 6.0, A11Y: 8.5 (per-section)
- Impact: No learning narrative; unclear priorities

---

## Implementation Changes

### Phase 1: audit-standards.md (~550 lines added)

**Changes**:
- ADD Sections 1–6: PLACE, REUSE, TW, DRY, REACT, POC (27 new rules)
- RENUMBER existing: STRUCT → 7, PROPS → 8, TOKEN → 9, BIZ → 10, A11Y → 11, TEST → 12
- ADD Mode Applicability table
- ADD Scoring formulas:
  - placementScore = (passed_place_rules / 7) * 10
  - reuseRate = (klara_components_used / total_reusable_ui_elements) * 10
  - twComplianceRate = (classes_using_project_tokens / total_tw_classes) * 10
  - reactScore = (passed_react_rules / 8) * 10
  - pocScore = (7 - pocIndicators) / 7 * 10

### Phase 2: ui.md (~550 lines added)

**Changes**:
- ADD Step 0: Mode detection (consumer vs library)
- ADD Step 1a: PLACE audit
- ADD Step 1b: Read tailwind.config.ts
- ADD Step 2a: Scan klara-theme components
- ADD Step 2b: Scan siblings (DRY baseline)
- ADD Step 3: REUSE audit
- ADD Step 4: TW compliance audit
- ADD Step 5: Apply DRY filter
- ADD Step 6: REACT audit
- ADD Step 7: POC detection
- ADD Step 8: Library audits (STRUCT, PROPS, TOKEN, A11Y, TEST)
- ADD Step 9: Generate report with section ratings + arrays

### Phase 3: audit-report-schema.md (~80 lines added)

**Changes**:
- ADD auditMode, placementVerdict
- ADD sectionRatings[], pocIndicators[], reuseOpportunities[], patternObservations[]
- ENHANCE findings: add insight + reuseOpportunity
- ADD mentoringPoints[]
- UPDATE version to "2.0"

### Phase 4: epost-muji.md (~30 lines added)

**Changes**:
- UPDATE "Consumer Audit" section with priority order: PLACE → REUSE → TW → DRY → REACT → POC

---

## Mode Applicability Table

| Section | Library | Consumer | Notes |
|---------|---------|----------|-------|
| PLACE | ✓ | ✓ | Different criteria |
| REUSE | ✗ | ✓ | Consumer-only |
| TW | ✓ | ✓ | Both read config |
| DRY | ✗ | ✓ | Consumer-only; gates |
| REACT | ✗ | ✓ | Consumer-only |
| POC | ✗ | ✓ | Consumer-only |
| STRUCT–TEST | ✓ | ✗ | Library-only (except A11Y, TEST both) |

---

## Rules Summary

| ID | Count | Section | New? |
|----|-------|---------|------|
| PLACE-001–007 | 7 | Placement | NEW |
| REUSE-001–008 | 8 | Reuse | NEW |
| TW-001–005 | 5 | Tailwind | NEW |
| DRY-001–003 | 3 | DRY | NEW |
| REACT-001–008 | 8 | React | NEW |
| POC-001–007 | 7 | POC | NEW |
| STRUCT–TEST | 35 | Library | RENUMBERED |
| **TOTAL** | **73** | — | — |

---

## Impact

### What Gets Better
- Consumer audits avoid false positives on domain types
- Reuse enforcement guides klara adoption
- Tailwind compliance prevents token bypass
- Pattern acceptance reduces noise
- POC detection catches unfinished code
- Per-section ratings show priorities
- Mentoring narratives enable learning

### Implementation Effort
- Tailwind config parsing
- Klara component index scanning
- Sibling pattern scanning
- DRY gating logic
- Report v2.0 generation
- Mentoring narratives

---

## Files to Modify

| Phase | File | Lines | Type |
|-------|------|-------|------|
| 1 | packages/design-system/skills/ui-lib-dev/references/audit-standards.md | +550 | Expand + renumber |
| 2 | packages/core/skills/audit/references/ui.md | +550 | Expand workflow |
| 3 | packages/core/skills/audit/references/audit-report-schema.md | +80 | Add v2.0 |
| 4 | packages/design-system/agents/epost-muji.md | +30 | Update priorities |

**Total**: 4 files, ~1,210 lines added. Then mirror to luz_next `.claude/` paths.

---

## Key Design Decisions

1. **Mode Detection in Step 0**: Consumer vs library determines rule sets
2. **Priority Order Shift**: PLACE first (is this in the right folder?)
3. **DRY as Gating**: Patterns in 2+ files suppress violations
4. **POC as Indicators**: Signals (0–7 indicators) converted to verdict
5. **Per-Section Narratives**: Each section gets 0–10 rating + insight
6. **Mentoring Mode**: Findings include "why this matters" context

---

## Unresolved Questions

1. Tailwind config: Hard-parse TS or just read + reference?
2. Klara index: Cache or fresh build per audit?
3. DRY scope: Entire feature or immediate siblings?
4. POC severity: Different weights for different indicators?
5. TEST in consumer: Should TEST be optional?
6. REUSE absence: Flag as violation or "contribution opportunity"?

---

## Summary

This research synthesizes the enhanced audit plan from luz_next into 4 actionable implementation phases. The enhancement adds consumer-code-specific auditing (27 new rules), mode detection, per-section ratings, and production-maturity detection. Existing library audit rules remain functional after renumbering. Implementation requires expanding 4 files by ~1,210 lines total, then syncing to luz_next.

---

**Status**: Complete  
**Author**: epost-researcher  
**Date**: 2026-03-06  
**Reference**: luz_next/plans/260306-1944-muji-audit-ui-enhanced/plan.md
