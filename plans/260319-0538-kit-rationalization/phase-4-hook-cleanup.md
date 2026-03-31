---
phase: 4
title: "Hook Cleanup"
effort: 2h
depends: [1]
---

# Phase 4: Hook Cleanup

## Context Links
- [Plan](./plan.md)
- `packages/core/hooks/` — hook source files
- `.claude/settings.json` — hook registrations

## Overview
- Priority: P2
- Status: Pending
- Effort: 2h
- Description: Remove 5-6 hooks that add friction without proportional value. Keep safety-critical and init hooks. Target: 14 -> 8-9 hooks.

## Requirements

### Functional
- Delete hooks that duplicate CLAUDE.md functionality or add marginal value
- Keep safety-critical hooks (build-gate, privacy-block, scout-block)
- Keep init hooks (session-init, subagent-init, subagent-stop-reminder)
- Keep hooks with active consumers (known-findings-surfacer)
- Update settings.json hook registrations

### Non-Functional
- Faster session startup (fewer hooks = less latency)
- No safety regressions

## Hooks Assessment

### DELETE

| Hook | Reason |
|------|--------|
| context-reminder | CLAUDE.md already provides context. Redundant reminder adds token cost. |
| post-index-reminder | Index management is CLAUDE.md's job. Hook is redundant. |
| session-metrics | Analytics, not dev productivity. Marginal value. |
| lesson-capture | Manual MEMORY.md updates work fine. Over-engineering. |

### KEEP

| Hook | Reason |
|------|--------|
| session-init | Loads memory + project state. Essential. |
| subagent-init | Passes context from main to sub. Essential. |
| subagent-stop-reminder | Cleanup prompt. Valuable. |
| build-gate-hook | Prevents broken builds from shipping. Safety-critical. |
| privacy-block | Blocks sensitive file access. Security-critical. |
| scout-block | Prevents scout during certain states. Workflow safety. |
| known-findings-surfacer | Surfaces known issues on file read. Active consumer. |
| kit-post-edit-reminder | Kit-specific edit guidance. Useful for kit development. |
| kit-session-check | Kit environment validation. Useful. |
| kit-write-guard | Prevents .claude/ direct edits. CRITICAL per memory. |

### EVALUATE (may keep if actively used)

| Hook | Decision criteria |
|------|-------------------|
| kit-post-edit-reminder | Keep if kit development is active workflow |
| kit-session-check | Keep if kit development is active workflow |

## Related Code Files

### Files to Delete
- `packages/core/hooks/context-reminder.cjs`
- `packages/core/hooks/post-index-reminder.cjs`
- `packages/core/hooks/session-metrics.cjs`
- `packages/core/hooks/lesson-capture.cjs`

### Files to Modify
- `packages/core/settings.json` — remove hook registrations for deleted hooks
- `packages/core/hooks/lib/` — check if any shared lib is only used by deleted hooks

## Implementation Steps

1. **Verify no hook has critical consumers**
   - Grep for each hook name in skills, agents, other hooks
   - Check settings.json for hook event registrations

2. **Delete hook files from packages/core/hooks/**
   - Remove the 4 files listed above

3. **Update settings.json**
   - Remove hook entries for deleted hooks
   - Keep all remaining hook entries intact

4. **Check shared lib dependencies**
   - If any file in hooks/lib/ is only imported by deleted hooks, consider removing
   - If shared, keep as-is

5. **Run epost-kit init and verify**
   - Verify .claude/ regeneration
   - Verify remaining hooks fire correctly
   - Test: session start (session-init fires), file read (known-findings fires), git commit (build-gate fires)

## Todo List
- [ ] Verify no critical consumers of hooks to delete
- [ ] Delete 4 hook files from packages/core/hooks/
- [ ] Update packages/core/settings.json
- [ ] Check hooks/lib/ for orphaned dependencies
- [ ] Run epost-kit init
- [ ] Test session-init, build-gate, privacy-block still fire

## Success Criteria
- Hook count: 14 -> 9-10
- build-gate, privacy-block, scout-block still fire correctly
- Session startup time not regressed
- No orphaned hook lib files

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Deleted hook was more useful than assessed | Low | Can re-add from git history |
| settings.json gets malformed | Med | Validate JSON after edit |

## Security Considerations
- privacy-block and scout-block must NOT be deleted (safety-critical)

## Next Steps
- Plan complete after Phase 4
- Run full workflow validation: /plan, /cook, /fix, /review, /audit, /debug, /test
