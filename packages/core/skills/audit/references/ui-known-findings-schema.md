---
name: audit-ui-known-findings-schema
description: "(ePost) Schema for .epost-data/ui/known-findings.json — UI component findings persistence layer"
user-invocable: false
disable-model-invocation: true
---

# UI Known-Findings Schema

Schema for `.epost-data/ui/known-findings.json` — the persistence layer for `/fix --ui`, `/review --ui`, and `/audit --close --ui` workflows. Mirrors `.epost-data/a11y/known-findings.json` (v1.3 schema) with UI-specific field substitutions.

## Empty Template (bootstrap)

```json
{
  "schemaVersion": "1.0.0",
  "lastUpdated": "YYYY-MM-DD",
  "findings": []
}
```

## Finding Object

```json
{
  "id": 1,
  "component": "EpostButton",
  "mode": "library",
  "platform": "web",
  "rule_id": "TOKEN-001",
  "title": "Hardcoded color value — use semantic token",
  "file_pattern": "libs/klara-theme/src/lib/button/button.tsx",
  "code_pattern": "color: #FF0000",
  "fix_template": "Replace with `var(--color-{semantic-name})`",
  "priority": 2,
  "severity": "high",
  "resolved": false,
  "resolved_date": null,
  "fix_applied": false,
  "fix_applied_date": null,
  "source": "audit",
  "first_detected_date": "YYYY-MM-DD"
}
```

## Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `id` | `integer` | Auto-incrementing unique identifier — never reuse |
| `component` | `string` | Component name (e.g. `EpostButton`) |
| `mode` | `"library" \| "consumer"` | Audit mode that detected the finding |
| `platform` | `"web" \| "ios" \| "android"` | Target platform |
| `rule_id` | `string` | Rule identifier from audit-standards.md (e.g. `TOKEN-001`, `STRUCT-003`) |
| `title` | `string` | Short description of the violation |
| `file_pattern` | `string` | File path where the violation was found |
| `code_pattern` | `string` | The problematic code pattern (short snippet) |
| `fix_template` | `string` | How to fix it — template string or prose description |
| `priority` | `integer` | Fix priority: 1 = highest, 5 = lowest |
| `severity` | `string` | See Severity Enum below |
| `resolved` | `boolean` | True when finding is fully resolved and verified |
| `resolved_date` | `string \| null` | ISO date when resolved; null if open |
| `fix_applied` | `boolean` | True when a fix has been applied (but not yet verified/resolved) |
| `fix_applied_date` | `string \| null` | ISO date when fix was applied; null if not yet fixed |
| `source` | `string` | See Source Enum below |
| `first_detected_date` | `string` | ISO date when finding was first recorded |

## Enum Values

### mode
- `"library"` — finding in klara-theme library code
- `"consumer"` — finding in consumer/feature code that uses klara-theme

### platform
- `"web"` — web (React/Next.js)
- `"ios"` — iOS (SwiftUI/UIKit)
- `"android"` — Android (Jetpack Compose)

### severity
- `"critical"` — blocks library contract, theming, or isolation
- `"high"` — convention violation affecting consistency
- `"medium"` — quality gap, maintainability concern
- `"low"` — style preference, minor improvement

### source
- `"audit"` — detected by `/audit --ui` workflow
- `"review"` — detected by `/review --ui` workflow
- `"manual"` — manually added by developer

## ID Assignment Rule

- IDs are auto-incrementing integers: `max(existing_ids) + 1`
- Never reuse an ID, even after resolution
- IDs must be unique across the entire `findings` array
- Start at `1` for a new database

## Resolution State Machine

```
open (resolved: false, fix_applied: false)
  → fix_applied (resolved: false, fix_applied: true)  [after /fix --ui]
  → resolved (resolved: true, fix_applied: true)      [after /audit --close --ui]
```

- `open` → `fix_applied`: set `fix_applied: true`, `fix_applied_date: today` (done by `/fix --ui`)
- `fix_applied` → `resolved`: set `resolved: true`, `resolved_date: today` (done by `/audit --close --ui`)
- Cannot skip `fix_applied` → warn user if trying to close without fix applied

## Deduplication Rule

When appending findings during audit (Step 5b), skip a finding if an entry with the same `rule_id` AND `file_pattern` already exists with `resolved: false`. This prevents duplicate open findings for the same issue.

## Persistence Rule

The database is **append-only** — never delete finding entries. Resolved findings remain in the array with `resolved: true` for audit trail purposes.
