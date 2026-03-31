---
phase: 1
title: "Validation Gate — quick_validate in build-gate hook"
effort: 1.5h
depends: []
---

# Phase 1: Validation Gate

## Context Links
- [Plan](./plan.md)
- `packages/core/hooks/lib/build-gate.cjs` — existing hook pattern
- `packages/core/skills/skill-creator/scripts/quick_validate.py` — Python validator

## Overview
- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Create a new hook script that runs `quick_validate.py` whenever a SKILL.md file is written or edited. Report results as warnings, never block.

## Requirements

### Functional
- Detect SKILL.md writes/edits via PostToolUse event (Write or Edit tool, file path matches `**/SKILL.md`)
- Spawn `python3 quick_validate.py <skill-dir>` with 10s timeout
- Parse exit code: 0 = valid, 1 = issues found
- Classify output: missing name/description = ERROR, unexpected keys = INFO (epost fields are expected)
- Output JSON to stdout following hook output contract
- If python3 not found, emit single warning and skip (never error)

### Non-Functional
- Script under 120 LOC
- Timeout: 10 seconds max
- No new npm dependencies

## Related Code Files

### Files to Create
- `packages/core/hooks/lib/skill-validate.cjs` — Python bridge + result parser
- `packages/core/hooks/skill-validation-gate.cjs` — Hook entry point (reads stdin event, calls lib)

### Files to Modify
- `packages/core/settings.json` — Register new hook under `hooks.PostToolUse` array
- `packages/core/package.yaml` — Add hook to `files:` mapping if needed

### Files to Delete
- None

## Implementation Steps

1. **Create `skill-validate.cjs` library**
   - Function `validateSkill(skillDir)` that spawns python3
   - Uses `child_process.execSync` with `{ timeout: 10000, encoding: 'utf8' }`
   - Catches spawn errors (python3 missing, timeout) gracefully
   - Returns `{ valid: boolean, message: string, level: 'error'|'info'|'warning' }`
   - Classifies "Unexpected key(s)" message as `info` (not error)

2. **Create `skill-validation-gate.cjs` hook**
   - Reads JSON from stdin (PostToolUse event)
   - Checks: `tool_name in ['Write', 'Edit']` AND `file_path.endsWith('SKILL.md')`
   - Derives skill directory from file path (`path.dirname(filePath)`)
   - Calls `validateSkill(skillDir)`
   - Outputs JSON: `{ "decision": "allow", "reason": "..." }` (always allow, attach validation message)
   - On validation issues: include `"message"` field with formatted results

3. **Register hook in settings.json**
   - Add entry to `hooks` array:
     ```json
     {
       "event": "PostToolUse",
       "command": "node .claude/hooks/skill-validation-gate.cjs",
       "match_tool": "Write|Edit",
       "match_file": "**/SKILL.md"
     }
     ```

4. **Python path resolution**
   - Try `python3` first, fall back to `python`, then skip
   - Resolve `quick_validate.py` path relative to project root: `.claude/skills/skill-creator/scripts/quick_validate.py`

## Todo List
- [ ] Create `packages/core/hooks/lib/skill-validate.cjs`
- [ ] Create `packages/core/hooks/skill-validation-gate.cjs`
- [ ] Register hook in `packages/core/settings.json`
- [ ] Test: write valid SKILL.md — expect "valid" message
- [ ] Test: write SKILL.md missing name — expect error warning
- [ ] Test: write epost SKILL.md with extra fields — expect info (not error)
- [ ] Test: python3 not available — expect graceful skip

## Success Criteria
- Writing a SKILL.md triggers validation automatically
- Validation never blocks the write operation
- epost-specific fields produce info-level messages, not errors
- Missing python3 produces single warning, no crash

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| PyYAML not installed | Med | Catch ImportError in output, suggest `pip install pyyaml` |
| python3 not on PATH | Low | Graceful fallback, skip with warning |
| Hook slows down writes | Low | 10s timeout, async if needed |

## Security Considerations
- Python subprocess is read-only (validates, doesn't modify)
- No user input passed to shell (args are file paths from Claude Code events)
