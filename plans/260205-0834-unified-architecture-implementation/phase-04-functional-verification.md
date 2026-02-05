# Phase 4: Functional Verification

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 2](phase-02-global-agents.md), [Phase 3](phase-03-web-platform-agents.md)

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 2h
- **Description**: Verify the restructured global + web agents work correctly before expanding to iOS/Android. Validate delegation chains, command routing, skill discovery, and rule loading.

## Key Insights
- Incremental validation prevents cascading failures across platforms
- Must verify both explicit routing (`/web:cook`) and auto-detection (`/cook` on .tsx file)
- Agent nested directory support in Claude Code needs empirical validation
- Command `agent:` field matching must be exact (case-sensitive)

## Requirements

### Functional
- Every global agent loads without errors
- Every web platform agent loads without errors
- Commands route to correct agents
- Skills resolve from new paths (skills/web/*)
- Rules load and apply
- Delegation chain: global implementer -> web/implementer works

### Non-Functional
- All tests pass manually (no automated test suite yet)
- Results documented in verification report

## Architecture

Verification points in the delegation chain:
```
[1] User -> /cook "build login form"
[2] -> orchestrator detects web context
[3] -> routes to implementer
[4] -> implementer delegates to web/implementer
[5] -> web/implementer uses skills/web/nextjs
[6] -> web/implementer uses shared skills/databases
[7] -> result flows back up

Also verify:
[A] /web:cook -> web/implementer (direct)
[B] /web:test -> web/tester (direct)
[C] /plan -> architect
[D] /debug -> debugger (with delegation awareness)
```

## Related Code Files

### Create
- `plans/260205-0834-unified-architecture-implementation/reports/verification-phase4.md`

### Verify (read + test)
- `.claude/agents/orchestrator.md`
- `.claude/agents/architect.md`
- `.claude/agents/implementer.md`
- `.claude/agents/reviewer.md`
- `.claude/agents/documenter.md`
- `.claude/agents/debugger.md`
- `.claude/agents/tester.md`
- `.claude/agents/researcher.md`
- `.claude/agents/git-manager.md`
- `.claude/agents/web/implementer.md`
- `.claude/agents/web/tester.md`
- `.claude/agents/web/designer.md`
- All commands in `.claude/commands/`
- All skills in `.claude/skills/`
- All rules in `.claude/rules/`

## Implementation Steps

### Step 1: Structural Validation
1. Verify all 9 global agent files exist with valid YAML frontmatter
2. Verify all 3 web agent files exist with valid YAML frontmatter
3. Verify all commands have valid `agent:` fields matching existing agents
4. Verify all skills have valid SKILL.md with `name` and `description`

### Step 2: Reference Integrity
1. Grep all `.claude/` for old agent names:
   - `planner` (should be `architect`)
   - `fullstack-developer` (should be `implementer`)
   - `code-reviewer` (should be `reviewer`)
   - `docs-manager` (should be `documenter`)
   - `project-manager` (should be `orchestrator`)
   - `performance-analyst` (should be `reviewer`)
   - `ui-designer` (should be `web/designer`)
2. Verify zero matches outside `plans/` directory
3. Verify skill path references in agent prompts match actual skill locations

### Step 3: Agent Name Validation
1. For each agent, verify frontmatter `name` field is clean (no emojis, lowercase+hyphens)
2. Verify `description` field provides clear routing hints for auto-delegation

### Step 4: Command Routing Test
For each command, verify `agent:` field maps to an existing agent:
- `core/cook.md` -> `implementer`
- `core/plan.md` -> `architect`
- `core/debug.md` -> `debugger`
- `core/test.md` -> `tester`
- `core/ask.md` -> `researcher`
- `web/cook.md` -> `web-implementer`
- `web/test.md` -> `web-tester`
- `ios/*` -> verify references updated or removed if agents don't exist yet

### Step 5: Nested Agent Discovery Test
- Verify Claude Code discovers agents in `.claude/agents/web/` subdirectory
- If not discovered: document fallback (flatten to `web-implementer.md` at root)

### Step 6: Generate Verification Report
Create `reports/verification-phase4.md` with:
- Table of all agents: name, file, status (OK/FAIL)
- Table of all commands: command, agent, status (OK/FAIL)
- Table of all skills: name, path, status (OK/FAIL)
- List of any old name references found
- Nested agent discovery result
- Pass/fail summary

## Todo List

- [ ] Validate 9 global agent YAML frontmatter
- [ ] Validate 3 web agent YAML frontmatter
- [ ] Validate all command agent: fields
- [ ] Validate all SKILL.md files
- [ ] Grep for old agent names (zero matches expected)
- [ ] Validate skill path references in agent prompts
- [ ] Test nested agent directory discovery
- [ ] Generate verification report
- [ ] Fix any issues found
- [ ] Re-verify after fixes

## Success Criteria

- Verification report shows all agents, commands, skills: OK
- Zero old agent name references in `.claude/` (excluding plans/)
- Nested agent discovery confirmed working (or documented fallback applied)
- All command `agent:` fields resolve to existing agents

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Nested agents not discovered | web/* agents unreachable | Flatten to root with prefixed names (web-implementer.md) |
| Missed old name reference | Command silently fails | Comprehensive grep across all .md files |
| iOS commands reference non-existent agents | ios/ commands break | Temporarily disable ios/ commands or point to global agents |

## Security Considerations
- Verification is read-only + manual testing
- No new permissions or tool access needed

## Next Steps
- If verification passes: proceed to Phase 5 (iOS agents)
- If nested agents fail: apply fallback naming before Phase 5
- Verification report informs adjustments for remaining phases
