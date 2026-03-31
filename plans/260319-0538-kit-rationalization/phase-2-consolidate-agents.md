---
phase: 2
title: "Consolidate Agent Responsibilities"
effort: 4h
depends: [1]
---

# Phase 2: Consolidate Agent Responsibilities

## Context Links
- [Plan](./plan.md)
- `packages/core/agents/` — agent source files
- `CLAUDE.md` — routing table
- `core/references/orchestration.md` — delegation rules

## Overview
- Priority: P1
- Status: Complete
- Effort: 4h
- Description: Slim remaining agents by merging overlapping responsibilities. Keep specialist agents (domain knowledge holders), reduce process-only agents. Target: 10 agents (post Phase 1 deletion of 5).

## Requirements

### Functional
- Slim epost-debugger: remove generic "debug any code" preamble, focus on platform-specific debug routing
- Slim epost-tester: remove generic "write tests" preamble, focus on platform test framework routing + test strategy
- Slim epost-git-manager: remove git tutorial content, keep only epost-specific conventions (branch naming, PR template, plan-id linkage)

### Non-Functional
- All 7 workflows still functional
- Agent prompts shorter (less token cost per session)
- No change to agent filenames or IDs (routing references stay valid)

## Rationale

The 260318-1940 report identified these as "MIXED" — they have some value but are padded with content that native Claude Code already knows. We keep the agents but slim them to domain-specific content only.

**What we are NOT doing**: Deleting fullstack-developer, debugger, tester, or git-manager. They are entry points for routing and carry platform-specific conventions. We're making them leaner.

## Related Code Files

### Files to Modify
- `packages/core/agents/epost-debugger.md` — remove generic debug tutorial, keep platform routing
- `packages/core/agents/epost-tester.md` — remove generic test tutorial, keep framework routing
- `packages/core/agents/epost-git-manager.md` — remove git tutorial, keep epost conventions
- `packages/core/agents/epost-fullstack-developer.md` — remove generic coding advice, keep orchestration protocol

## Implementation Steps

1. **Audit each agent for generic vs domain-specific content**
   - Read each agent .md
   - Mark sections: [GENERIC - native handles] vs [DOMAIN - keep]
   - Generic = things any Claude Code session already knows (how to use git, how to write tests)
   - Domain = epost-specific patterns (branch naming, plan-id linkage, platform routing)

2. **Slim epost-debugger**
   - Remove: generic debugging advice
   - Keep: platform-specific debug skill routing (ios-development, android-development, web-frontend, backend-javaee)
   - Keep: error-recovery skill integration
   - Keep: "3 consecutive failures -> escalate" rule

3. **Slim epost-tester**
   - Remove: generic test writing advice
   - Keep: platform test framework routing (Jest+RTL, XCTest, JUnit, Espresso)
   - Keep: test strategy skill references
   - Keep: coverage requirements

4. **Slim epost-git-manager**
   - Remove: git tutorial content (commit, push, branch basics)
   - Keep: epost branch naming convention
   - Keep: plan-id linkage in PR descriptions
   - Keep: build-gate hook awareness

5. **Slim epost-fullstack-developer**
   - Remove: generic coding best practices
   - Keep: cook skill integration
   - Keep: subagent-driven-development protocol
   - Keep: platform skill discovery trigger

6. **Run epost-kit init and verify**

## Todo List
- [x] Audit all 4 agents for generic vs domain content
- [x] Slim epost-debugger
- [x] Slim epost-tester
- [x] Slim epost-git-manager
- [x] Slim epost-fullstack-developer
- [ ] Run epost-kit init
- [ ] Test /plan, /cook, /fix, /review workflows

## Success Criteria
- Each agent prompt reduced by 30-50% in token count
- All workflows still function
- No new routing failures

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-slim an agent, losing needed context | Med | Keep domain content, only remove what native handles |
| Agent can't find platform skill after slimming | Med | Verify skill-discovery still triggers correctly |

## Security Considerations
- None — agent prompt editing only

## Next Steps
- Phase 3: Prune analysis/reasoning skills
