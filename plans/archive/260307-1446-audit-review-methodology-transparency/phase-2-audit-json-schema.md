---
phase: 2
title: "Add methodology fields to audit JSON schema"
effort: 0.5h
depends: [1]
---

# Phase 2: Audit JSON Schema

## Overview

Add a `methodology` object to the audit report JSON envelope so machine-readable reports also carry transparency metadata. Update the UI audit workflow to instruct agents to populate these fields.

## Tasks

### 2.1 Update `audit-report-schema.md`

**File**: `packages/core/skills/audit/references/audit-report-schema.md`

Add `methodology` object to Report Envelope:

```json
{
  "methodology": {
    "filesScanned": [
      { "path": "src/components/Button.tsx", "lines": 142, "reason": "primary audit target" }
    ],
    "knowledgeApplied": [
      { "type": "skill", "name": "ui-lib-dev", "reference": "audit-standards.md" },
      { "type": "rag", "source": "web-rag", "queries": 3 },
      { "type": "checklist", "name": "checklist-web.md", "rulesApplied": 35 }
    ],
    "standardsSources": [
      "klara-theme audit-standards.md v2.0",
      "WCAG 2.1 AA (W3C)"
    ],
    "coverageGaps": [
      "No iOS checklist available -- web-only audit"
    ]
  }
}
```

Add to Field Definitions table:

| Field | Type | Description |
|-------|------|-------------|
| `methodology` | `object` | Transparency metadata: what was scanned, what knowledge was used, standards source |
| `methodology.filesScanned` | `{path, lines, reason}[]` | Files actually read during audit |
| `methodology.knowledgeApplied` | `{type, name, reference?, queries?}[]` | Skills, RAG, checklists used |
| `methodology.standardsSources` | `string[]` | Named standards with versions |
| `methodology.coverageGaps` | `string[]` | What was unavailable or skipped |

### 2.2 Update `audit/references/ui.md` workflow

**File**: `packages/core/skills/audit/references/ui.md`

Add to Step 5 (Generate Audit Report):
- Populate `methodology` object with:
  - All files read during Steps 0-4
  - Skills and checklists loaded (Step 2)
  - RAG queries made (Step 1)
  - Platform checklists that were unavailable

### 2.3 Update `audit/SKILL.md` Knowledge Retrieval section

**File**: `packages/core/skills/audit/SKILL.md`

Add instruction after Knowledge Retrieval (Pre-Audit):
- Track all knowledge sources accessed during pre-audit
- Pass source list to the audit agent for inclusion in methodology section

## Validation

- [ ] `audit-report-schema.md` has `methodology` object in envelope
- [ ] Field Definitions table includes all methodology sub-fields
- [ ] `ui.md` workflow instructs agent to populate methodology
- [ ] `audit/SKILL.md` mentions methodology tracking in pre-audit
