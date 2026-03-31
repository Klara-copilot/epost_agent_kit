---
phase: 3
title: "Known-Findings auto-surfacing in context"
effort: 2h
depends: []
---

# Phase 3: Known-Findings Auto-Surfacing

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/audit/references/ui-findings-schema.md` — findings schema
- `packages/core/skills/audit/references/ui-workflow.md` — audit workflow that writes findings
- `packages/core/skills/fix/references/ui-mode.md` — fix flow that reads findings

## Overview
- Priority: P1
- Status: Pending
- Effort: 2h
- Description: Create a PostToolUse hook that fires after file reads. When a developer opens a file that has known unresolved findings, surface a brief warning with finding count and severity.

## Requirements
### Functional
- PostToolUse hook triggers on `Read` tool calls
- Checks file path against known-findings DBs (`.epost-data/ui/known-findings.json`, `.epost-data/a11y/known-findings.json`)
- If file has unresolved findings: inject warning into tool output
- Warning format: `[Known Issues] {file}: {N} unresolved findings ({critical}C/{high}H/{medium}M) — run /fix --ui {component} or /audit --close --ui`
- No-op if DB files don't exist (graceful degradation)

### Non-Functional
- Hook must be fast (< 50ms) — read JSON once, cache in memory
- No false positives (only warn on exact file path match)
- Warning should be concise (1 line)

## Related Code Files
### Files to Modify
- `packages/core/hooks/package.yaml` — register new hook

### Files to Create
- `packages/core/hooks/known-findings-surfacer.cjs` — PostToolUse hook
  - Trigger: `Read` tool invocations
  - Logic: parse file path from tool input, look up in findings DBs, emit warning if matches found
  - Cache: load JSON on first call, reuse for subsequent calls in same session

### Files to Delete
- None

## Implementation Steps
1. **Define hook in `package.yaml`**:
   ```yaml
   - event: PostToolUse
     tool: Read
     script: hooks/known-findings-surfacer.cjs
   ```
2. **Implement `known-findings-surfacer.cjs`**:
   - Read tool input to extract file path
   - Load findings DBs (lazy, cached):
     - `.epost-data/ui/known-findings.json`
     - `.epost-data/a11y/known-findings.json`
   - Match file path against `file_pattern` or `file` field in findings
   - Filter to unresolved only (`status !== "resolved"`)
   - Count by severity
   - If matches > 0: output warning line
   - If no DBs exist: exit silently (exit 0, no output)
3. **Test scenarios**:
   - File with 3 unresolved findings -> warning shown
   - File with 0 findings -> no output
   - No DB files -> no output
   - File with all resolved findings -> no output

## Todo List
- [ ] Add hook registration to package.yaml
- [ ] Implement known-findings-surfacer.cjs
- [ ] Handle missing DB files gracefully
- [ ] Add severity counting logic
- [ ] Test with sample known-findings.json

## Success Criteria
- Reading a file with known findings shows 1-line warning
- Reading a file without findings shows nothing
- Missing DB files cause no errors
- Hook execution < 50ms

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| DB files don't exist in most projects yet | Med | Graceful no-op; encourage `/audit --ui` adoption |
| Hook fires too often (every Read) | Low | Fast-path exit if no DB files; cache loaded JSON |
| File path matching is brittle | Med | Use both exact match and glob pattern match |

## Security Considerations
- None identified (read-only hook, no file modifications)

## Next Steps
- Phase 6 (auto re-audit) builds on this by triggering re-audit on files with known findings after fix
