---
phase: 2
title: "Workflow: mode detection + consumer audit steps"
effort: 1.5h
depends: [1]
---

# Phase 2: Audit Workflow Expansion

**File**: `packages/core/skills/audit/references/ui.md`
**Action**: Expand workflow with mode detection and consumer-specific steps

## Tasks

### 2.1 Add Step 0: INTEGRITY Check (before existing Step 1)

Runs always, regardless of mode.
- Scan changed files for paths matching library directories (`libs/klara-theme/`, `libs/ios-theme/`, `libs/android-theme/`)
- If consumer PR modifies library files: FAIL immediately, severity CRITICAL
- Check for copy-pasted library internals (import path analysis)
- Output: `integrityViolations[]` -- if non-empty, stop audit, report violations

### 2.2 Add Step 0b: Mode Detection

Determine audit mode from file paths + import statements:

| Signal | Mode |
|--------|------|
| Files in `libs/klara-theme/`, `libs/ios-theme/`, `libs/android-theme/` | library |
| Files in `apps/`, `modules/`, feature directories | consumer |
| Mixed | report both, run each file set in its mode |

Set `auditMode: "library" | "consumer" | "mixed"` for report.

### 2.3 Add Consumer Audit Steps (Steps 1a-7)

Insert between mode detection and existing library steps:

**Step 1a: PLACE audit** -- validate file placement against module structure
**Step 1b: Read tailwind.config.ts** -- extract project token config for TW audit reference
**Step 2a: Scan klara-theme component index** -- build available component list for REUSE checks
**Step 2b: Scan sibling files** -- build DRY baseline (patterns in 2+ files)
**Step 3: REUSE audit** -- compare consumer UI elements against klara component catalog
**Step 4: TW compliance audit** -- check Tailwind usage against project tokens
**Step 5: Apply DRY filter** -- suppress violations matching established patterns from 2b
**Step 6: REACT audit** -- React best practices check
**Step 7: POC detection** -- production maturity indicators

### 2.4 Restructure Existing Library Steps

Wrap existing Steps 1-6 (Discover, Load Checklist, Audit, Cross-Platform, Report, Summary) as:
**Step 8: Library audits (STRUCT, PROPS, TOKEN, BIZ, A11Y, TEST)** -- runs only in library/mixed mode

For consumer mode: run only A11Y and TEST from library section.

### 2.5 Update Step: Generate Report

Replace current Step 5 (Generate Audit Report) with expanded version:
- Include `auditMode` in output
- Add per-section ratings (0-10) with insight narratives
- Add new arrays: `pocIndicators[]`, `reuseOpportunities[]`, `patternObservations[]`
- Add `integrityViolations[]`
- Consumer verdict uses consumer-specific formula

### 2.6 Update Verdict Logic

Consumer verdict:
```
if (integrityViolations.length > 0) => "blocked"
else if (critical >= 1) => "fix-and-reaudit"
else if (high >= 3 || pocIndicators >= 5) => "fix-and-reaudit"
else if (medium >= 5) => "fix-and-reaudit"
else => "pass"
```

Library verdict: unchanged (existing logic).

## Validation

- Consumer mode skips STRUCT, PROPS, TOKEN, BIZ sections
- Library mode skips REUSE, DRY, REACT, POC sections
- INTEGRITY + PLACE + TW + A11Y + TEST run in both modes
- Mode detection is deterministic from file paths
- Existing library workflow is preserved (just wrapped in conditional)
