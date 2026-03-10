---
phase: 1
title: "Classification Gate + Maturity Tiers"
effort: 1.5h
depends: []
---

# Phase 1: Classification Gate + Maturity Tiers

## Overview

Add Step 0.5 to `audit/references/ui.md` that classifies a component before applying any rules. Introduce maturity tiers that modulate which rules are blocking vs advisory.

## Tasks

### 1.1 — Component Classification (ui.md)

**File:** `.claude/skills/audit/references/ui.md`
**Action:** Insert new section between Step 0 (INTEGRITY Gate) and Step 1 (Mode Detection)

Add `### Step 0.5: Component Classification` with this logic:

```
Classify target by scanning its file tree:
- atom: single TSX file, pure UI, no subdirectories
- molecule: 2-5 files, minor composition, no subdirs or 1 subdir
- organism: multiple subdirectories, complex internal state, 6+ files
- application: full view-routing, multi-modal, mini-app inside libs/
- consumer: imports from klara, lives in apps/ (existing consumer mode)
```

**Detection heuristics:**
1. Count files in component directory (Glob `{component_path}/**/*.{tsx,ts}`)
2. Count subdirectories (Glob `{component_path}/*/`)
3. Check for internal routing/view patterns (grep for `useState.*view`, route arrays, tab configs)
4. Set `componentClass` in report envelope

**Routing table:**
| Classification | Checklist | Notes |
|---------------|-----------|-------|
| atom, molecule | `checklist-web.md` | Current behavior, unchanged |
| organism, application | `checklist-web-organism.md` | New checklist (Phase 2) |
| consumer | Consumer mode steps (existing) | No change |

### 1.2 — Maturity Tier Definition (ui.md)

**File:** `.claude/skills/audit/references/ui.md`
**Action:** Add `### Step 0.6: Maturity Tier` immediately after Step 0.5

Maturity tier source (in priority order):
1. Explicit `--poc` or `--beta` or `--stable` flag in args
2. Heuristic detection: presence of `MOCK_*` constants, TODO density >5, no test files → `poc`
3. Default: `stable`

**Tier definitions — include inline in ui.md:**

| Rule Category | poc (blocking) | poc (advisory) | beta (blocking) | stable |
|--------------|---------------|----------------|-----------------|--------|
| STRUCT-002 (7-file) | -- | advisory | -- | blocking |
| TOKEN-001 (styles.ts) | -- | advisory | blocking | blocking |
| BIZ-001 (domain types) | -- | advisory | -- | N/A for organisms |
| BIZ-002 (API calls) | -- | advisory | advisory | blocking |
| BIZ-003 (global state) | -- | advisory | advisory | blocking |
| TEST-004 (Figma) | -- | advisory | advisory | blocking |
| STRUCT-005 (displayName) | -- | advisory | advisory | blocking |
| ORGANISM-* (API surface) | blocking | -- | blocking | blocking |
| STATE-* (state boundary) | blocking | -- | blocking | blocking |
| MOCK-* (mock boundaries) | blocking | -- | advisory | N/A |

Set `maturityTier` in report envelope.

### 1.3 — Severity Modulation Function

**File:** `.claude/skills/audit/references/ui.md`
**Action:** Add to Step 0.6 a severity modulation instruction

```
When applying any rule from the checklist:
1. Look up rule ID in the maturity tier table above
2. If tier says "advisory" → cap severity at "low", prefix finding title with "[Advisory]"
3. If tier says "--" → skip rule entirely, do not include in findings or score
4. If tier says "blocking" → apply normal severity from checklist
5. Advisory findings do NOT count toward verdict thresholds
```

## Files Changed

| File | Action |
|------|--------|
| `.claude/skills/audit/references/ui.md` | Add Step 0.5, Step 0.6 (insert ~50 lines after Step 0) |

## Validation

- Read ui.md after edit; confirm Step 0.5 and 0.6 exist between Step 0 and Step 1
- Classification logic covers all 5 types with clear heuristics
- Maturity tier table is complete for all rules that caused false positives
- Severity modulation instruction is unambiguous
