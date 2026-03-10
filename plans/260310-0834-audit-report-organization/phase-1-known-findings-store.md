---
phase: 1
title: "Known-findings JSON store per topic"
effort: 1h
depends: []
---

# Phase 1: Known-Findings JSON Store Per Topic

## Context Links

- [Plan](./plan.md)
- `packages/a11y/assets/known-findings-schema.json` -- existing a11y schema (v1.3)
- `packages/core/skills/audit/references/ui-known-findings-schema.md` -- existing UI schema
- `packages/core/skills/audit/references/output-contract.md:134-146` -- Known-Findings Persistence section

## Overview

- Priority: P1
- Status: Pending
- Effort: 1h
- Description: Formalize `.epost-data/{topic}/known-findings.json` as the canonical store for all three domains. The a11y and UI schemas exist; code schema needs creation. Unify common fields across all three.

## Requirements

### Functional

- `.epost-data/a11y/known-findings.json` -- already defined, no changes needed
- `.epost-data/ui/known-findings.json` -- schema exists in `ui-known-findings-schema.md`, no changes needed
- `.epost-data/code/known-findings.json` -- NEW schema needed, mirrors UI schema with code-specific fields
- All three share: `id`, `priority`, `severity`, `resolved`, `resolved_date`, `fix_applied`, `fix_applied_date`, `source`, `source_agent`, `source_report`, `first_detected_at`
- Each topic adds domain-specific fields (a11y: `wcag`, `screen`, `fix_template`; ui: `component`, `mode`, `rule_id`; code: `category`, `rule_id`, `file_path`)

### Non-Functional

- Schema files under 120 lines each
- JSON Schema draft-07 format for `.json` schema files
- Markdown format for `.md` schema docs (matching existing `ui-known-findings-schema.md` style)

## Related Code Files

### Files to Modify

- `packages/core/skills/audit/references/output-contract.md:134-146` -- verify Known-Findings Persistence section is accurate and complete
- `packages/core/skills/audit/references/ui-known-findings-schema.md` -- no changes expected, verify consistency

### Files to Create

- `packages/core/skills/code-review/references/code-known-findings-schema.md` -- NEW code findings schema (if not already exists)

### Files to Delete

- None

## Implementation Steps

1. **Verify existing code-known-findings schema**
   - Check if `packages/core/skills/code-review/references/code-known-findings-schema.md` already exists
   - If exists, verify it has: `id`, `category` (SEC/PERF/TS/LOGIC/DEAD/ARCH/STATE), `rule_id`, `file_path`, `code_pattern`, severity/priority/resolution fields, `source_agent`, `source_report`, `first_detected_at`
   - If missing fields, add them

2. **If code-known-findings-schema.md does not exist, create it**
   - Mirror `ui-known-findings-schema.md` structure
   - Replace UI-specific fields (`component`, `mode`, `platform`) with code-specific fields (`category`, `file_path`, `line`)
   - Keep `rule_id` field referencing `code-review-standards.md` IDs
   - Include Resolution State Machine, Deduplication Rule, Persistence Rule sections

3. **Verify output-contract.md Known-Findings Persistence table**
   - Ensure all three topic stores are listed with correct paths and schema references
   - Ensure the rule "Never write to another agent's DB" is present

4. **Create `.epost-data/` directory convention doc**
   - Add brief section to `output-contract.md` documenting `.epost-data/` directory structure:
     ```
     .epost-data/
       a11y/known-findings.json
       ui/known-findings.json
       code/known-findings.json
     ```

## Todo List

- [x] Verify/create `code-known-findings-schema.md`
- [x] Verify common fields across all 3 schemas are consistent
- [x] Update `output-contract.md` Known-Findings section if needed
- [x] Document `.epost-data/` directory layout in `output-contract.md`

## Success Criteria

- All 3 known-findings schemas documented with consistent common fields
- `output-contract.md` references all 3 stores with correct paths
- Code findings schema has category enum matching `code-review-standards.md`

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Code schema may already exist with different shape | Med | Check first, adapt rather than overwrite |
| a11y schema uses `.json` format, others use `.md` format | Low | Accept inconsistency -- a11y is in a different package |

## Security Considerations

- None -- known-findings is project-local data, gitignored

## Next Steps

- Phase 2 depends on this phase for understanding the full `.epost-data/` layout
