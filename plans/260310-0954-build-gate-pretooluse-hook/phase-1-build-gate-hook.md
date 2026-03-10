---
phase: 1
title: "Build-gate PreToolUse hook"
effort: 1.5h
depends: []
---

# Phase 1: Build-Gate PreToolUse Hook

## Context Links

- [Plan](./plan.md)
- `packages/core/hooks/lib/build-gate.cjs` -- existing build gate utility
- `packages/core/hooks/scout-block.cjs` -- reference PreToolUse hook pattern
- `packages/core/hooks/privacy-block.cjs` -- reference PreToolUse hook pattern

## Overview

- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Create a PreToolUse hook that intercepts Bash `git commit` commands and runs build-gate.cjs automatically. On failure, block the commit (exit 2). Complements existing skill-level instructions.

## Requirements

### Functional

- Intercept Bash tool calls where `tool_input.command` matches `git commit`
- Run `build-gate.cjs` synchronously before allowing the commit
- On build-gate exit 0: allow (exit 0)
- On build-gate exit 1: block with error message (exit 2)
- On build-gate exit 2 (no build detected): allow with warning (exit 0)
- Bypass when: `--skip-build` in command, `EPOST_SKIP_BUILD=1` env, or config disabled
- Parse stdin JSON: `{ tool_name: "Bash", tool_input: { command: "git commit ..." } }`

### Non-Functional

- Must not slow down non-commit Bash commands (fast regex check, bail early)
- Must handle stdin parse errors gracefully (exit 0, never block on hook errors)
- Follow existing hook patterns: `isHookEnabled()`, try/catch wrapper, JSDoc

## Related Code Files

### Files to Create

- `packages/core/hooks/build-gate-hook.cjs` -- the PreToolUse hook script

### Files to Modify

- `packages/core/hooks/hook-registry.yaml` (if exists) OR `packages/core/package.yaml` -- register hook in settings
- `packages/core/skills/git/SKILL.md` -- add note about automatic build-gate enforcement

## Implementation Steps

1. **Create `packages/core/hooks/build-gate-hook.cjs`**
   - Read stdin, parse JSON
   - Check `tool_name === 'Bash'` -- if not, exit 0
   - Check `tool_input.command` matches `git commit` (regex: `/\bgit\s+commit\b/`)
   - Skip patterns: must NOT match `git commit --amend --no-edit` from hooks themselves
   - Check bypass: `--skip-build` in command OR `EPOST_SKIP_BUILD=1` env OR `!isHookEnabled('build-gate')`
   - Run `build-gate.cjs` via `execSync` from CWD
   - Parse JSON output from stdout
   - Exit 0 if build passed or no build detected
   - Exit 2 with stderr message if build failed

2. **Register in settings.json via package.yaml**
   - Add to `PreToolUse` hooks array with matcher `Bash`:
     ```json
     {
       "type": "command",
       "command": "node .claude/hooks/build-gate-hook.cjs"
     }
     ```
   - Place AFTER scout-block and privacy-block (order matters -- those filter first)

3. **Update git skill note**
   - Add brief note to `packages/core/skills/git/SKILL.md` that build-gate also runs automatically via PreToolUse hook

## Hook Script Structure

```
#!/usr/bin/env node
/**
 * build-gate-hook.cjs - PreToolUse hook
 * Intercepts `git commit` Bash commands and runs build verification.
 * Exit 0 = allow, Exit 2 = block
 */

try {
  // 1. Parse stdin
  // 2. Check tool_name === 'Bash'
  // 3. Check command matches /\bgit\s+commit\b/
  // 4. Check bypasses (--skip-build, env, config)
  // 5. Run build-gate.cjs
  // 6. Exit 0 or 2 based on result
} catch (e) {
  // Never block on hook errors
  process.exit(0);
}
```

## Todo List

- [x] Create `packages/core/hooks/build-gate-hook.cjs`
- [x] Register hook in package.yaml settings
- [x] Add note to `packages/core/skills/git/SKILL.md`
- [x] Test: `git commit -m "test"` triggers build-gate
- [x] Test: non-commit commands pass through instantly
- [x] Test: `--skip-build` bypasses
- [ ] Test: build failure blocks with error message (manual verification needed — would require breaking build)

## Success Criteria

- Any `git commit` Bash command auto-triggers build-gate
- Build failure blocks commit with clear stderr message
- Non-commit Bash commands unaffected (no latency)
- Hook respects config disable

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hook adds latency to all Bash commands | Low | Fast regex check on command string; bail in <1ms for non-matches |
| Build-gate runs twice (hook + skill instruction) | Low | Acceptable -- second run is fast if no code changed; could add dedup env var |
| Hook blocks legitimate commits during dev | Med | `--skip-build` flag and `EPOST_SKIP_BUILD=1` env bypass |
| Regex false positive on `git commit` in echo/string | Low | Only matches actual git commit invocations; edge case is harmless |

## Security Considerations

- Hook runs with same permissions as other hooks
- No new file access beyond existing build-gate utility

## Next Steps

- After implementation, consider dedup mechanism (env var `EPOST_BUILD_GATE_RAN=1`) to avoid double-running when skill also invokes build-gate
