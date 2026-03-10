---
phase: 5
title: "UI known-findings DB schema"
effort: 30m
depends: []
---

# Phase 5: UI Known-Findings DB Schema

## Overview

Create the schema and empty template for `.epost-data/ui/known-findings.json` — the persistence layer that enables `/fix --ui`, `/review --ui`, and `/audit --close --ui` to work across sessions. Mirrors a11y's `.epost-data/a11y/known-findings.json` (v1.3 schema).

## Context

A11y has a unified known-findings DB with these fields per finding: `id`, `platform`, `wcag`, `title`, `file_pattern`, `code_pattern`, `fix_template`, `priority`, `resolved`, `resolved_date`, `fix_applied`, `source`, `first_detected_date`.

UI needs the same, with UI-specific field substitutions:
- `wcag` → `rule_id` (e.g. STRUCT-001, TOKEN-003)
- `platform` stays (web | ios | android)
- Add: `component` (component name), `severity` (critical|high|medium|low), `mode` (library|consumer)

## Files to Create

### `packages/core/skills/audit/references/ui-known-findings-schema.md`

Define the schema spec and empty template:

```json
{
  "schemaVersion": "1.0.0",
  "lastUpdated": "YYYY-MM-DD",
  "findings": [
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
  ]
}
```

Also document:
- Field definitions (what each field means)
- Allowed values (enums: mode, platform, severity, source)
- ID assignment rule: auto-increment, never reuse
- Resolution states: open → fix_applied → resolved

## Files to Modify

### `packages/core/skills/audit/SKILL.md`

Add to Aspect Files table:
```
| `references/ui-known-findings-schema.md` | Schema for `.epost-data/ui/known-findings.json` |
```

## Todo List

- [ ] Create `packages/core/skills/audit/references/ui-known-findings-schema.md`
- [ ] Add schema reference to `packages/core/skills/audit/SKILL.md` Aspect Files table

## Success Criteria

- Schema has all required fields with type annotations
- Enum values documented for mode, platform, severity, source
- Empty template JSON provided for bootstrapping
- ID assignment rule is unambiguous
