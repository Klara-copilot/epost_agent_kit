---
phase: 2
title: "Git workflow integration"
effort: 1h
depends: [1]
---

# Phase 2: Git Workflow Integration

## Context Links

- [Plan](./plan.md)
- [Phase 1](./phase-1-build-gate-utility.md)
- `packages/core/skills/git/references/commit.md` -- commit workflow
- `packages/core/skills/git/references/push.md` -- push workflow

## Overview

- Priority: P1
- Status: Pending
- Effort: 1h
- Description: Add build verification step to git commit and push skill workflows. Agent runs build-gate before staging files.

## Requirements

### Functional

- Commit workflow: run build-gate AFTER staging, BEFORE `git commit`
- Push workflow: run build-gate BEFORE `git push` (if not already done in commit)
- If build fails: show error, ask user "Build failed. Commit anyway? (not recommended)"
- Support `--skip-build` passthrough from git skill flags
- Add `--skip-build` flag documentation to git skill

### Non-Functional

- Skill text changes only (no hook changes)
- Agent reads build-gate JSON output to format user-friendly message

## Related Code Files

### Files to Modify

- `packages/core/skills/git/references/commit.md` -- add build step between stage and commit
- `packages/core/skills/git/references/push.md` -- add build check reference
- `packages/core/skills/git/SKILL.md` -- document `--skip-build` flag

### Files to Create

- None

## Implementation Steps

1. **Update `commit.md`**
   - Add step 5.5 (between "Stage relevant files" and "Create commit"):
     ```
     5.5. Run build verification:
          node .claude/hooks/lib/build-gate.cjs
          - If exit 0: proceed to commit
          - If exit 1: report failure, ask user to fix or skip
          - If exit 2: warn "No build command detected", proceed
          - If --skip-build was passed: skip this step
     ```
   - Add to Rules section: "Run build verification before committing unless --skip-build is passed"

2. **Update `push.md`**
   - Add note: "Build verification is performed during commit. If pushing without a fresh commit, run `node .claude/hooks/lib/build-gate.cjs` first."

3. **Update `git/SKILL.md`**
   - Add `--skip-build` to the flag documentation table
   - Mention build gate in Step 0 flag override section

4. **Add permission entry**
   - `Bash(node .claude/hooks/lib/build-gate.cjs*)` is already covered by existing `Bash(node .claude/hooks/*)` permission in settings.json

## Todo List

- [ ] Add build-gate step to `commit.md`
- [ ] Add build reference to `push.md`
- [ ] Document `--skip-build` in `git/SKILL.md`
- [ ] Verify permission coverage in `settings.json`

## Success Criteria

- Agent running `/git --commit` automatically runs build-gate before committing
- Build failure shows clear error message with option to proceed
- `--skip-build` flag bypasses the gate

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent forgets to run build gate | Med | Explicit numbered step in workflow; hard to skip |
| Build gate adds latency to commits | Low | Only runs once per commit; user can `--skip-build` |

## Security Considerations

- None beyond Phase 1 considerations

## Next Steps

- Phase 3: audit workflow integration
