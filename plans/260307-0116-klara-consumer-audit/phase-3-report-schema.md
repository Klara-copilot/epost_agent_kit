---
phase: 3
title: "Report schema v2.0"
effort: 1h
depends: [2]
---

# Phase 3: Report Schema v2.0

**File**: `packages/core/skills/audit/references/audit-report-schema.md`
**Action**: Expand schema, bump version to 2.0

## Tasks

### 3.1 Add New Fields to Report Envelope

```json
{
  "version": "2.0",
  "auditMode": "consumer | library | mixed",
  "component": "ComponentName | null",
  "target": "path/to/audited/files",
  "sectionRatings": [
    { "section": "PLACE", "score": 7.0, "insight": "..." },
    { "section": "REUSE", "score": 8.5, "insight": "..." }
  ],
  "pocIndicators": [
    { "ruleId": "POC-001", "location": "file:line", "indicator": "console.log in render" }
  ],
  "reuseOpportunities": [
    { "element": "custom modal", "suggestedComponent": "EpostDialog", "location": "file:line" }
  ],
  "patternObservations": [
    { "pattern": "inline flex wrapper", "occurrences": 3, "verdict": "convention (DRY-gated)" }
  ],
  "integrityViolations": [
    { "ruleId": "INTEGRITY-001", "location": "file:line", "detail": "Direct edit to klara-theme file" }
  ]
}
```

### 3.2 Enhance Finding Object

Add optional fields to existing finding schema:
- `insight`: string -- mentoring narrative ("why this matters")
- `reuseOpportunity`: string | null -- suggested klara component if applicable

### 3.3 Update Finding ID Format

Extend platform prefix for consumer audits:
- Library: `{PLATFORM}-{CATEGORY}-{NNN}` (unchanged)
- Consumer: `{PLATFORM}-{CATEGORY}-{NNN}` (same format, new categories: INTEGRITY, PLACE, REUSE, TW, DRY, REACT, POC)

### 3.4 Update Score Calculation

Library mode: unchanged (`{PASS}/35` adjusted for N/A)
Consumer mode: weighted section average
```
consumerScore = weighted average of section scores
  weights: INTEGRITY=blocking, PLACE=1, REUSE=2, TW=1.5, REACT=1.5, POC=1, A11Y=1.5, TEST=1
```

### 3.5 Update Verdict Definitions

| Verdict | Consumer Criteria | Library Criteria |
|---------|-------------------|------------------|
| blocked | Any INTEGRITY violation | Any INTEGRITY violation |
| redesign | N/A (consumer) | 2+ critical |
| fix-and-reaudit | 1+ critical, or 3+ high, or 5+ POC indicators | 1+ high, or 3+ medium |
| pass | Everything else | 0 critical, 0 high |

### 3.6 Add Severity for New Categories

Add to severity definitions table:
- INTEGRITY violations: always `critical`
- POC indicators: per-rule severity (medium-critical range)
- DRY gates: `gate` severity (suppresses, not flags)

## Validation

- v1.0 reports still valid (new fields optional)
- Consumer reports include `auditMode: "consumer"` and `sectionRatings[]`
- Library reports include `auditMode: "library"` with flat score (backward compat)
- `integrityViolations[]` present in both modes (empty if clean)
