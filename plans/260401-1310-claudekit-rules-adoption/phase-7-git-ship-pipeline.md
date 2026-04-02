---
phase: 7
title: "git — Enhanced --ship pipeline (merge → test → review → commit → push → PR)"
effort: 30m
depends: [5]
---

# Phase 7: Enhanced Git --ship Pipeline

Adapted from claudekit's `ck:ship` pattern. Adds a full structured pipeline to `epost-git-manager` when `--ship` is passed.

## Files to Modify

- `packages/core/skills/git/SKILL.md`
- `packages/core/agents/epost-git-manager.md`

## Changes

### 1. git/SKILL.md — Add `--ship` flag section

Add after the existing flags table:

```markdown
## --ship Pipeline

Full ship sequence. Runs all gates before pushing or opening a PR.

### Usage
```
/git --ship [--skip-merge] [--skip-tests] [--skip-review] [--dry-run] [--pr]
```

### Pipeline Steps

| Step | Action | Skip Flag |
|------|--------|-----------|
| 1 | Merge main into current branch (rebase preferred) | `--skip-merge` |
| 2 | Run test suite (platform-detected) | `--skip-tests` |
| 3 | Run code review agent (epost-code-reviewer) | `--skip-review` |
| 4 | Commit staged changes (if any) | — |
| 5 | Push to remote | — |
| 6 | Open PR (if `--pr` passed) | omit `--pr` |

### Gate Behavior

- Any step fails → STOP, report failure, ask user to fix or pass the skip flag.
- `--dry-run` → print what each step would do, execute nothing.
- Review gate: reviewer must report 0 blockers to continue; warnings are logged but non-blocking.

### Examples

```bash
/git --ship                    # Full pipeline, no PR
/git --ship --pr               # Full pipeline + open PR
/git --ship --skip-tests --pr  # Skip tests (user accepts risk)
/git --ship --dry-run          # Preview all steps
```
```

### 2. epost-git-manager.md — Add --ship handling

In the agent system prompt, add a `--ship` section that:
- Detects `--ship` flag in user prompt
- Runs the pipeline steps in sequence
- Calls `epost-tester` for test gate (via internal note, not sub-spawn)
- Calls `epost-code-reviewer` for review gate (via internal note, not sub-spawn)
- Reports gate results before proceeding

**Note on subagent constraint**: epost-git-manager cannot spawn sub-agents. For test and review gates, it runs the checks inline or reports the gate requirement to the orchestrator to handle.

## Todo

- [ ] Read git/SKILL.md fully before editing
- [ ] Add `--ship` to flags table
- [ ] Add `## --ship Pipeline` section with 6-step table
- [ ] Read epost-git-manager.md fully before editing
- [ ] Add --ship handling note with gate behavior and subagent constraint workaround

## Success Criteria

- SKILL.md has --ship pipeline section with 6 steps
- --dry-run behavior documented
- Gate failure behavior documented
- Agent knows subagent constraint: inline check or escalate to orchestrator

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Test gate adds long wait | Medium | `--skip-tests` always available |
| Review gate requires sub-agent but is blocked | High | Git manager escalates to orchestrator for review, then resumes |
| Merge conflict in step 1 | High | Stop immediately, surface conflict to user |

## Security Considerations

- `--ship` must not force-push — always use normal push.
- PR creation requires explicit `--pr` flag to prevent accidental PR opening.
