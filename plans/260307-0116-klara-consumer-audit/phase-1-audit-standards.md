---
phase: 1
title: "Audit standards: INTEGRITY gate + 6 new consumer sections"
effort: 2.5h
depends: []
---

# Phase 1: Audit Standards Expansion

**File**: `packages/design-system/skills/ui-lib-dev/references/audit-standards.md`
**Action**: Expand (prepend new sections, renumber existing)

## Tasks

### 1.1 Add Mode Applicability Table (top of file)

Add table after severity scale showing which sections apply to which mode:

| Section | Library | Consumer | Notes |
|---------|---------|----------|-------|
| INTEGRITY | yes | yes | Critical gate, always runs first |
| PLACE | yes | yes | Different criteria per mode |
| REUSE | no | yes | Consumer-only |
| TW | yes | yes | Both read tailwind.config |
| DRY | no | yes | Consumer-only, gates other sections |
| REACT | no | yes | Consumer-only |
| POC | no | yes | Consumer-only |
| STRUCT-TEST | yes | partial | Library gets all; consumer gets A11Y+TEST only |

### 1.2 Add Section 0: INTEGRITY (new, before all others)

3 rules, all `critical` severity:
- **INTEGRITY-001**: No direct modifications to files inside `libs/klara-theme/` (or platform equivalents)
- **INTEGRITY-002**: No copy-paste of klara-theme component internals into consumer code
- **INTEGRITY-003**: No monkey-patching of library exports (re-exporting with modifications)

Pass/Fail: If ANY INTEGRITY rule fails -> immediate FAIL, block PR. Remediation: revert + use composition/props.

### 1.3 Add Section 1: PLACE (7 rules)

| Rule ID | Summary | Severity |
|---------|---------|----------|
| PLACE-001 | Feature files under correct module directory | high |
| PLACE-002 | No cross-module imports (coupling mismatch) | critical |
| PLACE-003 | Shared components in shared/ not feature/ | high |
| PLACE-004 | Page components in pages/ or app/ routes | medium |
| PLACE-005 | Hooks in hooks/ subdirectory | medium |
| PLACE-006 | File size under 300 lines (split signal) | low |
| PLACE-007 | Index barrel exports match directory contents | medium |

### 1.4 Add Section 2: REUSE (8 rules)

Detect "reinventing the wheel" -- consumer builds UI that klara-theme already provides.

| Rule ID | Summary | Severity |
|---------|---------|----------|
| REUSE-001 | Use EpostButton, not custom `<button>` with styling | high |
| REUSE-002 | Use EpostInput, not custom `<input>` wrapper | high |
| REUSE-003 | Use EpostDialog, not custom modal | high |
| REUSE-004 | Use EpostSelect, not custom dropdown | high |
| REUSE-005 | Use EpostIcon, not inline SVG or custom icon wrapper | medium |
| REUSE-006 | Use EpostTypography/Text, not raw heading/paragraph with token classes | medium |
| REUSE-007 | Use EpostSpinner/Loading, not custom loading indicator | medium |
| REUSE-008 | Use EpostToast/Notification, not custom toast | medium |

Each rule: scan for HTML elements / custom implementations that overlap klara-theme catalog.

### 1.5 Add Section 3: TW (5 rules)

| Rule ID | Summary | Severity |
|---------|---------|----------|
| TW-001 | No arbitrary values (`h-[123px]`) when theme scale exists | high |
| TW-002 | Use project token classes over raw Tailwind (`bg-base-primary` not `bg-blue-500`) | critical |
| TW-003 | Layout uses established flex/grid patterns, no contradicting hacks | medium |
| TW-004 | Responsive breakpoints use project config, not arbitrary `min-[800px]` | medium |
| TW-005 | Dark mode via semantic tokens, not manual `dark:` overrides | high |

### 1.6 Add Section 4: DRY (3 rules)

Gating section -- suppresses false positives on established project conventions.

| Rule ID | Summary | Severity |
|---------|---------|----------|
| DRY-001 | If pattern appears in 2+ sibling files, treat as project convention (suppress) | gate |
| DRY-002 | If utility exists in shared/, do not flag consumer for using it | gate |
| DRY-003 | If wrapper component exists in feature/, accept as local convention | gate |

### 1.7 Add Section 5: REACT (8 rules)

| Rule ID | Summary | Severity |
|---------|---------|----------|
| REACT-001 | useEffect dependency arrays complete and correct | high |
| REACT-002 | Expensive computations wrapped in useMemo | medium |
| REACT-003 | Callback props wrapped in useCallback when passed to children | medium |
| REACT-004 | No prop drilling beyond 2 levels (use context or composition) | medium |
| REACT-005 | List items have stable, unique keys (not index) | high |
| REACT-006 | No direct DOM manipulation (use refs) | high |
| REACT-007 | Error boundaries around async/dynamic content | medium |
| REACT-008 | Component decomposition: no god components (>200 JSX lines) | low |

### 1.8 Add Section 6: POC (7 rules)

Production maturity detection.

| Rule ID | Summary | Severity |
|---------|---------|----------|
| POC-001 | No `console.log`/`console.warn` outside error handlers | medium |
| POC-002 | No TODO/FIXME/HACK comments without linked ticket | medium |
| POC-003 | No hardcoded mock data in production code | high |
| POC-004 | No `as any` type assertions | high |
| POC-005 | No unguarded development/staging URLs | critical |
| POC-006 | No commented-out code blocks (>3 lines) | low |
| POC-007 | No `@ts-ignore`/`@ts-nocheck` without justification comment | medium |

### 1.9 Renumber Existing Sections

Current sections 1-6 become sections 7-12:
- STRUCT (1->7), PROPS (2->8), TOKEN (3->9), BIZ (4->10), A11Y (5->11), TEST (6->12)
- Rule IDs unchanged (STRUCT-001 stays STRUCT-001)
- Add note: "Sections 7-12 apply to library mode. A11Y and TEST also apply to consumer mode."

### 1.10 Add Scoring Formulas

Per-section scoring (0-10 scale):
```
placementScore = (passed_place_rules / applicable_place_rules) * 10
reuseRate = (klara_components_used / total_reusable_elements) * 10
twComplianceRate = (token_classes / total_tw_classes) * 10
reactScore = (passed_react_rules / 8) * 10
pocScore = ((7 - pocIndicatorCount) / 7) * 10
```

### 1.11 Add PROPS Enhancements to Existing Section

Add to PROPS section (now section 8):
- **PROPS-009**: Required props from TypeScript definition must be provided | high
- **PROPS-010**: Props passed to Common Components match expected types | high

## Validation

- Total rules: 3 (INTEGRITY) + 7 + 8 + 5 + 3 + 8 + 7 + 35 + 2 = 78
- Every rule has: ID, description, severity, pass criterion, fail criterion
- Mode applicability table is consistent with section headers
- Existing rule IDs unchanged
