---
phase: 2
title: "Dated report folders for all report types"
effort: 1.5h
depends: [1]
---

# Phase 2: Dated Report Folders For All Report Types

## Context Links

- [Plan](./plan.md)
- `packages/core/skills/core/references/report-standard.md` -- current report anatomy
- `packages/core/skills/core/references/index-protocol.md` -- reports/index.json schema
- `packages/core/skills/audit/references/output-contract.md` -- audit session folder contract

## Overview

- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Extend the session-folder pattern (currently audit-only) to ALL report types. Every agent report goes into a dated folder. Flat files in `reports/` root are deprecated.

## Requirements

### Functional

- ALL report types use folder pattern: `reports/{YYMMDD-HHMM}-{slug}/`
- Folder contains at minimum: `report.md` (main deliverable)
- Audit folders additionally contain: sub-agent reports, `session.json`
- Plan-scoped reports go into plan's own `reports/` subfolder (already working -- see PLAN-0068)
- `reports/index.json` entries use `path` field pointing to folder, `files.report` pointing to main file

### Non-Functional

- Backward compatibility: existing flat-file entries in `reports/index.json` remain valid
- No migration script needed for existing reports -- just new ones follow the pattern

## Related Code Files

### Files to Modify

- `packages/core/skills/core/references/report-standard.md` -- add "Output Location" section documenting folder pattern
- `packages/core/skills/core/references/index-protocol.md` -- update `reports/index.json` schema to show `path` field, deprecate flat `files.agent`/`files.human` pattern
- `packages/core/skills/plan/references/report-template.md` -- update output path guidance (if exists)
- Agent system prompts that reference flat report paths:
  - `packages/core/agents/epost-code-reviewer.md`
  - `packages/core/agents/epost-researcher.md`
  - `packages/core/agents/epost-planner.md`
  - `packages/core/agents/epost-tester.md`

### Files to Create

- None

### Files to Delete

- None

## Implementation Steps

1. **Define unified folder contract in report-standard.md**
   - Add "Output Location" section:
     ```
     ## Output Location

     All reports go into a dated folder:
     reports/{YYMMDD-HHMM}-{slug}/
       report.md          -- main deliverable
       session.json       -- (audit types only)
       {sub-reports}      -- (hybrid audits only)

     Plan-scoped reports: plans/{plan-dir}/reports/{YYMMDD-HHMM}-{slug}/
     ```
   - Note: audit session folders follow `output-contract.md` which extends this base pattern

2. **Update index-protocol.md reports schema**
   - Change schema example to use `path` + `files.report` instead of `files.agent`/`files.human`
   - Add migration note: "Legacy entries with `files.agent`/`files.human` remain valid"
   - Current `reports/index.json` already has both patterns in use -- formalize `path` as canonical

3. **Update agent system prompts**
   - Search each agent `.md` for hardcoded flat report paths
   - Replace with reference to report-standard.md folder pattern
   - Key agents: planner, researcher, code-reviewer, tester

4. **Update plan report-template.md**
   - If exists, update output path to folder pattern

## Todo List

- [x] Add "Output Location" section to `report-standard.md`
- [x] Update `index-protocol.md` reports schema with `path` field
- [x] Search agent files for flat report path references
- [x] Update planner report template (no flat paths found — agents use hook-injected naming)
- [x] Update researcher report template (no flat paths found)
- [x] Update code-reviewer report template (no flat paths found)
- [x] Update tester report template (no flat paths found)

## Success Criteria

- `report-standard.md` documents folder pattern as the canonical output location
- `index-protocol.md` shows `path` field in schema example
- No agent system prompt references flat `reports/{agent}-{date}-{slug}.md` pattern

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agents may not follow folder pattern without explicit instructions | Med | Add folder-creation step to report-standard.md workflow |
| Existing flat entries break index lookups | Low | Keep backward compat -- old entries still valid |

## Security Considerations

- None

## Next Steps

- Phase 3 updates indexes and cross-references
