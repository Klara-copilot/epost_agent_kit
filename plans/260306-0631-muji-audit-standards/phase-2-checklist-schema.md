---
phase: 2
title: "Web Checklist & Audit Report Schema"
effort: 1.5h
depends: [1]
---

# Phase 2: Web Checklist & Audit Report Schema

## Objective

Create the two missing files referenced by `audit/references/ui.md` Step 2 and Step 5.

## Tasks

### TODO: Create checklist-web.md

**File**: `packages/core/skills/audit/references/checklist-web.md`

This is the operational checklist loaded during audit Step 2. It must reference `audit-standards.md` but present rules as a quick-scan checklist format.

Structure:

```markdown
# Web Component Audit Checklist

Platform: web (klara-theme / React / TypeScript / Tailwind)

## How to Use
1. Read component source + styles + tests + stories
2. Walk through each category below
3. For each rule: mark PASS, FAIL (with finding ID), or N/A
4. Any FAIL creates a finding in the audit report

## Structure Check
- [ ] STRUCT-001: Directory at `src/lib/components/{kebab-name}/`
- [ ] STRUCT-002: All 7 required files present
  - [ ] `{name}.tsx`
  - [ ] `{name}-styles.ts`
  - [ ] `{name}.stories.tsx`
  - [ ] `{name}.test.tsx`
  - [ ] `{name}.figma.json`
  - [ ] `{name}.mapping.json`
  - [ ] `index.ts`
- [ ] STRUCT-003: Barrel exports complete
- [ ] STRUCT-004: `'use client'` first line
- [ ] STRUCT-005: `displayName` set
- [ ] STRUCT-006: Compound sub-components split

## Props & Naming Check
- [ ] PROPS-001: `I{Name}Props` interface name
- [ ] PROPS-002: Standard vocab (styling/mode/size/radius/className/id/disabled/inverse)
- [ ] PROPS-003: `SCREAMING_SNAKE as const` for variant consts
- [ ] PROPS-004: Derived type from const
- [ ] PROPS-005: Boolean flags as `?: true`
- [ ] PROPS-006: Internal props `_` prefixed
- [ ] PROPS-007: JSDoc on all props
- [ ] PROPS-008: `@deprecated` with migration

## Token & Style Check
- [ ] TOKEN-001: All Tailwind in `-styles.ts`
- [ ] TOKEN-002: `clsx()` for conditionals
- [ ] TOKEN-003: Semantic color tokens only
- [ ] TOKEN-004: Design scale size tokens
- [ ] TOKEN-005: `Map<string, string>` variant maps
- [ ] TOKEN-006: Theme-tier CSS vars only
- [ ] TOKEN-007: Shared STATE_LAYER utility

## Business Isolation Check
- [ ] BIZ-001: No domain types
- [ ] BIZ-002: No API calls
- [ ] BIZ-003: No global state management
- [ ] BIZ-004: Theming via wrappers only
- [ ] BIZ-005: No app-layer lifecycle artifacts

## Accessibility Check
- [ ] A11Y-001: `theme-ui-label` on root
- [ ] A11Y-002: `useId()` auto-ID + override
- [ ] A11Y-003: Radix for complex primitives
- [ ] A11Y-004: Standard focus ring
- [ ] A11Y-005: Semantic disabled token

## Testing & Documentation Check
- [ ] TEST-001: Test file exists
- [ ] TEST-002: Stories with autodocs
- [ ] TEST-003: Standard test coverage
- [ ] TEST-004: Figma artifacts present

## Scoring
- Total rules: 35
- PASS count: ___
- FAIL count: ___
- Score: PASS/35 (percentage)

### Verdict Thresholds
- **PASS**: 0 critical FAIL, 0 high FAIL
- **FIX-AND-REAUDIT**: any high FAIL, or 3+ medium FAIL
- **REDESIGN**: 2+ critical FAIL
```

### TODO: Create audit-report-schema.md

**File**: `packages/core/skills/audit/references/audit-report-schema.md`

```markdown
# Audit Report Schema

## Finding Object

{
  "id": "WEB-TOKEN-001",          // {PLATFORM}-{CATEGORY}-{NNN}
  "ruleId": "TOKEN-003",          // References audit-standards.md rule
  "severity": "critical",         // critical | high | medium | low
  "category": "token",            // struct | props | token | biz | a11y | test
  "location": "button.tsx:42",    // file:line
  "issue": "Raw hex color #FF0000 used instead of semantic token",
  "expected": "bg-signal-error or text-signal-on-error",
  "actual": "style={{ color: '#FF0000' }}",
  "fix": "Replace with className='text-signal-error' in button-styles.ts",
  "mentoring": "Semantic tokens auto-adapt to brand and dark mode. Hardcoded colors break theming."
}

## Report Envelope

{
  "component": "ComponentName",
  "platform": "web",
  "auditor": "epost-muji",
  "date": "YYYY-MM-DD",
  "version": "1.0",
  "summary": {
    "total": 5,
    "critical": 1,
    "high": 2,
    "medium": 1,
    "low": 1,
    "score": "28/35",
    "verdict": "fix-and-reaudit"
  },
  "findings": [ /* Finding objects */ ],
  "mentoringPoints": [
    "Top teaching point 1",
    "Top teaching point 2",
    "Top teaching point 3"
  ]
}

## Severity Definitions

| Severity | Meaning | Examples |
|----------|---------|---------|
| critical | Breaks library contract, theming, or isolation | Domain types in component, raw colors, missing styles file |
| high | Convention violation affecting consistency | Wrong prop naming, missing tests, no `use client` |
| medium | Quality gap, maintainability concern | Missing JSDoc, no displayName, custom state layer |
| low | Style preference, minor improvement | Boolean typing, Map vs object for simple cases |

## Verdict Logic

verdict =
  if (critical >= 2) => "redesign"
  else if (high >= 1 || medium >= 3) => "fix-and-reaudit"
  else => "pass"
```

## Validation

- [ ] `checklist-web.md` lists all 35 rules from audit-standards.md
- [ ] `audit-report-schema.md` covers finding format, envelope, severity definitions, verdict logic
- [ ] Schema fields match what `ui.md` Step 5 expects
- [ ] Rule IDs consistent between standards, checklist, and schema
