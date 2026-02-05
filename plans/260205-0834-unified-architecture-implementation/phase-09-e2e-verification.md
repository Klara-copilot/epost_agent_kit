# Phase 9: E2E Verification

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: All previous phases

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 3h
- **Description**: End-to-end verification of the entire restructured system: parent-child delegation, all platform agents, CLI functionality, and cross-platform generated output. Final gate before marking the plan complete.

## Key Insights
- This is the integration test phase; all individual phase verifications must already pass
- Must test the full delegation chain, not just individual components
- Cross-platform output validation requires manual testing in Cursor/Copilot (if available)
- CLI must work as both local (`node bin/cli.js`) and npx (`npx epost-kit`)

## Requirements

### Functional

**Agent System Verification**:
- All 9 global agents load and respond to matching descriptions
- All 8 platform agents (3 web + 3 ios + 2 android) load
- Delegation chain: orchestrator -> global agent -> platform agent works
- Commands route to correct agents at both levels

**CLI Verification**:
- `epost-kit list` shows all components
- `epost-kit install` works for all 3 targets
- `epost-kit create` scaffolds correctly
- `epost-kit validate` catches real issues
- `npx` execution works (local package)

**Cross-Platform Verification**:
- Claude Code: agents, skills, commands, rules all functional
- Cursor: AGENTS.md readable, rules applied, commands available
- Copilot: agents valid, instructions applied, prompts available

### Non-Functional
- All verification results documented in final report
- Zero critical issues allowed for pass
- Non-critical issues documented with tracking

## Architecture

Verification matrix:
```
              | Claude Code | Cursor | Copilot |
Agents        |    [x]      |  [x]   |   [x]   |
Skills/Cmds   |    [x]      |  [x]   |   [x]   |
Rules         |    [x]      |  [x]   |   [x]   |
Delegation    |    [x]      |  N/A   |   [x]   |
CLI Install   |    [x]      |  [x]   |   [x]   |
```

## Related Code Files

### Create
- `plans/260205-0834-unified-architecture-implementation/reports/e2e-verification.md`

### Verify (all)
- All agent files (global + platform)
- All skill files
- All command files
- All rule files
- All generated platform files (AGENTS.md, .cursor/*, .github/*)
- CLI source and build
- External skills
- CLAUDE.md

## Implementation Steps

### Step 1: Full Inventory Check
Verify file counts match expectations:
- 9 global agents
- 3 web agents, 3 iOS agents, 2 Android agents (14 total agents)
- Skills: global (planning, research, debugging, databases, docker) + web (5) + ios (1) + android (1) + external (2) = 14
- Commands: core (6) + design (1) + docs (2) + fix (5) + git (5) + web (2) + ios (4) + android (2) = 27
- Rules: 4 files
- Generated: AGENTS.md + cursor files + copilot files

### Step 2: Agent Frontmatter Validation
For each agent file:
1. Valid YAML frontmatter (parseable)
2. `name` field: lowercase, hyphens, no emojis
3. `description` field: present, descriptive
4. `tools` field: valid tool names (if present)
5. `model` field: valid value (if present)
6. Body: non-empty prompt

### Step 3: Delegation Chain Test
Trace 3 scenarios through the delegation chain:

**Scenario A**: Web feature request
```
"build a login page with Next.js"
-> orchestrator detects "Next.js" -> web context
-> routes to implementer
-> implementer detects web -> delegates to web/implementer
-> web/implementer uses skills/web/nextjs
```

**Scenario B**: iOS bug fix
```
"fix crash in AppDelegate.swift"
-> orchestrator detects ".swift" -> ios context
-> routes to debugger
-> debugger detects ios -> delegates to ios/implementer (for fix)
```

**Scenario C**: Global task (no platform)
```
"update the README"
-> orchestrator detects docs task
-> routes to documenter (executes directly, no platform delegation)
```

Verify each agent's prompt contains routing logic for these scenarios.

### Step 4: Command Routing Validation
For each command:
1. Read frontmatter `agent:` field
2. Verify that agent file exists at expected path
3. Verify agent name matches

### Step 5: CLI Functional Tests
```bash
cd cli

# Build
npm run build

# List all components
node bin/cli.js list

# Install to Claude Code
node bin/cli.js install --target claude --dry-run

# Install to Cursor
node bin/cli.js install --target cursor --dry-run

# Install to Copilot
node bin/cli.js install --target copilot --dry-run

# Create new skill
node bin/cli.js create skill web test-skill --dry-run

# Validate all
node bin/cli.js validate
```

### Step 6: Cross-Platform Output Validation

**Claude Code**:
- Run `claude` and verify `/agents` shows all agents
- Verify skill activation via slash commands
- Verify rules applied in conversations

**Cursor** (if available):
- Open project in Cursor
- Check AGENTS.md is parsed
- Check `.cursor/rules/` are loaded
- Check `.cursor/commands/` are available

**Copilot** (if available):
- Check `.github/agents/*.agent.md` in VS Code Copilot
- Check instructions auto-apply
- Check prompts available via `/`

### Step 7: Regression Check
1. Grep for old agent names across entire repo (excluding plans/):
   - planner, fullstack-developer, code-reviewer, docs-manager, project-manager, performance-analyst, ui-designer
2. Verify zero matches
3. Grep for broken references (agent names that don't match any agent file)

### Step 8: Generate Final Report
Create `reports/e2e-verification.md`:

```markdown
# E2E Verification Report

## Date: YYYY-MM-DD

## Summary
- Total agents: X (expected: 14)
- Total skills: X (expected: 14)
- Total commands: X (expected: 27)
- Old name references: X (expected: 0)
- CLI commands tested: X/4
- Platform outputs generated: X/3

## Agent Inventory
| Agent | File | Frontmatter | Delegation | Status |
|-------|------|-------------|------------|--------|

## Command Routing
| Command | Agent Target | Agent Exists | Status |

## CLI Tests
| Command | Result | Notes |

## Cross-Platform
| Platform | Generated | Validated | Status |

## Issues Found
| # | Severity | Description | Resolution |

## Verdict: PASS / FAIL
```

## Todo List

- [ ] Full inventory check (file counts)
- [ ] Validate all agent YAML frontmatter
- [ ] Trace delegation chain: web scenario
- [ ] Trace delegation chain: iOS scenario
- [ ] Trace delegation chain: global scenario
- [ ] Validate all command agent: fields
- [ ] CLI: build compiles
- [ ] CLI: list works
- [ ] CLI: install --target claude
- [ ] CLI: install --target cursor
- [ ] CLI: install --target copilot
- [ ] CLI: create scaffolds correctly
- [ ] CLI: validate reports compliance
- [ ] Grep for old agent names (zero expected)
- [ ] Grep for broken references
- [ ] Test in Claude Code (if possible)
- [ ] Test in Cursor (if available)
- [ ] Test in Copilot (if available)
- [ ] Generate final E2E report
- [ ] Fix any issues found
- [ ] Re-verify after fixes

## Success Criteria

- Final report shows all agents, commands, skills: OK
- Zero old agent name references (excluding plans/)
- CLI all 4 commands functional
- All 3 platform outputs generated and validated
- No critical issues open
- Report verdict: PASS

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cursor/Copilot unavailable for testing | Can't verify generated output | Validate structure/frontmatter only; manual test later |
| Undiscovered edge case in conversion | Platform output invalid | Test with simple agents first, then complex |
| CLI npx distribution not tested | Users can't run it | Test local execution; npx tested after npm publish |

## Security Considerations
- Verify no secrets in any generated output file
- Verify no API keys, credentials, or .env content in committed files
- External skills from trusted repos only

## Next Steps
- If PASS: Mark plan as completed, update project roadmap
- If FAIL: Document issues, create fix plan, re-run verification
- After completion: publish CLI to npm registry
