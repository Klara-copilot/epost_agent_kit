---
title: "Build-success gate for git commit and audit workflows"
status: archived
created: 2026-03-09
updated: 2026-03-09
effort: 3h
phases: 3
platforms: [all]
breaking: false
---

# Build-Success Gate

## Summary

Add automatic build verification before git commits and after audit completions. A shared utility detects the project platform and runs the correct build command, failing the workflow if the build breaks.

## Key Dependencies

- `packages/core/hooks/lib/project-detector.cjs` -- already detects project type (package.json, pom.xml, etc.)
- `packages/core/skills/git/references/commit.md` -- commit workflow to gate
- `packages/core/skills/git/references/push.md` -- push workflow to gate
- `packages/core/skills/audit/SKILL.md` -- audit orchestration to gate

## Approach Decision

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| A. Shared utility in hooks/lib + skill instructions | Reuses project-detector; skill text tells agent to call it | Agent must remember to invoke | **Selected** |
| B. PreToolUse hook on Bash(git commit) | Automatic, zero agent involvement | Hook can't detect platform context well; slows all commits | Rejected |
| C. Standalone build-check skill | Discoverable | Over-engineered for a utility; YAGNI | Rejected |

Option A: utility + skill instructions. The agent runs `node .claude/hooks/lib/build-gate.cjs` as a step in commit/push/audit workflows. If exit code != 0, workflow stops.

## Execution Strategy

Sequential -- Phase 1 (utility), Phase 2 (git integration), Phase 3 (audit integration).

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Build-gate utility | 1.5h | done | [phase-1](./phase-1-build-gate-utility.md) |
| 2 | Git workflow integration | 1h | done | [phase-2](./phase-2-git-integration.md) |
| 3 | Audit workflow integration | 0.5h | done | [phase-3](./phase-3-audit-integration.md) |

## Critical Constraints

- Must edit `packages/` (source of truth), NOT `.claude/` directly
- Build commands differ per platform -- utility must auto-detect
- Build gate must be skippable (`--skip-build`) for drafts/WIP commits
- Must handle projects where no build command is detected (warn, don't block)
- Utility runs in CWD of target project, NOT epost_agent_kit itself

## Success Criteria

- [x] `node .claude/hooks/lib/build-gate.cjs` exits 0 on successful build, non-zero on failure
- [x] Git commit workflow refuses to commit when build fails
- [x] Audit workflow reports build status after completion
- [x] Agent auto-invokes gate without user prompting
- [x] Projects with no detectable build command get a warning, not a block
