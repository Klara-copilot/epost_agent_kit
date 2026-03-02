# Phase 04: Agent Roster Revision

## Context Links
- Parent: [plan.md](./plan.md)
- Current agents: `.claude/agents/` (14 agents)
- Category taxonomy: [phase-01-categories.md](./phase-01-categories.md)

## Overview
**Date**: 2026-03-01
**Priority**: P2
**Description**: Evaluate current 14 agents, propose revised roster of 16 agents with clear category ownership and non-overlapping responsibilities.
**Implementation Status**: Pending

## Key Insights

### Current Agent Audit (14 Agents)

| Agent | Model | Role | Issues |
|-------|-------|------|--------|
| epost-orchestrator | haiku | Task router | Good — keep |
| epost-architect | opus | Planning | Good — keep |
| epost-implementer | sonnet | Build everything | Too broad — owns all platforms |
| epost-reviewer | sonnet | Code review | Good — keep |
| epost-debugger | sonnet | Debugging | Good — keep |
| epost-tester | haiku | Testing | Good — keep |
| epost-researcher | sonnet | Research | Good — keep |
| epost-documenter | haiku | Docs | Good — keep |
| epost-git-manager | haiku | Git ops | Good — keep |
| epost-brainstormer | sonnet | Ideation | Good — keep |
| epost-guide | haiku | Concierge | Good — keep |
| epost-scout | haiku | Codebase exploration | Good — keep |
| epost-a11y-specialist | sonnet | Accessibility | Good — keep |
| epost-muji | sonnet | Design system | Good — keep |

### Key Finding: Missing Platform Agents

The CLAUDE.md references agents that DON'T exist in `.claude/agents/`:
- `epost-web-developer` (referenced in CLAUDE.md)
- `epost-ios-developer` (referenced in CLAUDE.md)
- `epost-android-developer` (referenced in CLAUDE.md)
- `epost-backend-developer` (referenced in CLAUDE.md)
- `epost-cli-developer` (referenced in CLAUDE.md)
- `epost-kit-designer` (referenced in CLAUDE.md)

These are phantom agents — mentioned but never created. Currently `epost-implementer` absorbs all platform work.

### Decision: Platform Agents vs Universal Implementer

**Option A**: Keep `epost-implementer` as universal, rely on skill-discovery for platform knowledge
- Pro: Fewer agents, simpler routing
- Con: Large agent prompt, jack-of-all-trades

**Option B**: Create platform-specific agents, deprecate generic implementer
- Pro: Focused prompts, better platform depth
- Con: 4 more agents, routing complexity

**Option C (Recommended)**: Keep `epost-implementer` as dispatcher + create 4 lightweight platform agents
- Implementer handles cross-platform, delegates to platform agent for deep work
- Platform agents are lean (model: haiku) with platform skills pre-loaded
- Kit-designer and CLI-developer are separate concerns, warrant own agents

### Proposed Roster: 16 Agents

| # | Agent | Model | Category Ownership | Status |
|---|-------|-------|--------------------|--------|
| 1 | epost-orchestrator | haiku | Routing | KEEP |
| 2 | epost-architect | opus | Knowledge (planning) | KEEP |
| 3 | epost-implementer | sonnet | Dev-workflow (dispatch) | KEEP (narrow scope) |
| 4 | epost-reviewer | sonnet | Knowledge (code-review) | KEEP |
| 5 | epost-debugger | sonnet | Knowledge (debugging) | KEEP |
| 6 | epost-tester | haiku | Dev-workflow (test) | KEEP |
| 7 | epost-researcher | sonnet | Knowledge (research) | KEEP |
| 8 | epost-documenter | haiku | Dev-workflow (docs) | KEEP |
| 9 | epost-git-manager | haiku | Dev-workflow (git) | KEEP |
| 10 | epost-brainstormer | sonnet | Knowledge (ideation) | KEEP |
| 11 | epost-guide | haiku | Routing (concierge) | KEEP |
| 12 | epost-scout | haiku | Dev-workflow (explore) | KEEP |
| 13 | epost-a11y-specialist | sonnet | Accessibility | KEEP |
| 14 | epost-muji | sonnet | Design-system | KEEP |
| 15 | **epost-kit-designer** | sonnet | Kit-authoring | **NEW** |
| 16 | **epost-infra** | haiku | Dev-workflow (infra) | **NEW** (optional) |

### Why NOT Create Platform Agents

After analysis, platform agents are **not recommended** because:
1. Claude Code's `skill-discovery` already loads platform skills dynamically
2. `epost-implementer` + dynamic skills = equivalent to a platform agent
3. Adding 4 platform agents doubles routing complexity for minimal gain
4. The "phantom agents" in CLAUDE.md should be removed, not created

### Agent-to-Category Ownership Map

| Category | Primary Agent | Secondary |
|----------|--------------|-----------|
| platform-web | epost-implementer | epost-muji (UI) |
| platform-ios | epost-implementer | epost-muji (UI) |
| platform-android | epost-implementer | epost-muji (UI) |
| platform-backend | epost-implementer | — |
| accessibility | epost-a11y-specialist | epost-implementer (fixes) |
| design-system | epost-muji | epost-implementer (code) |
| dev-workflow | epost-orchestrator (routing) | per-workflow agent |
| knowledge | epost-architect (planning) | epost-researcher, epost-debugger |
| kit-authoring | **epost-kit-designer** | — |
| domain | epost-guide (routing) | epost-implementer |

## Requirements
### Functional
- Create `epost-kit-designer` agent file
- Remove phantom agent references from CLAUDE.md
- Optionally create `epost-infra` for Docker/GCP tasks
- Update `settings.json` with new agent
### Non-Functional
- New agents follow frontmatter conventions (skills:, memory:, permissionMode:)
- Agent count stays under 20

## Architecture

### epost-kit-designer
```yaml
name: epost-kit-designer
model: sonnet
color: "#00CED1"
description: (ePost) Kit authoring agent for creating and maintaining agents, skills, commands, hooks
skills: [core, skill-discovery, kit-agents, kit-skill-development, kit-agent-development]
memory: project
permissionMode: default
```

### epost-infra (optional)
```yaml
name: epost-infra
model: haiku
color: "#708090"
description: (ePost) Infrastructure agent for Docker, GCP, Terraform, CI/CD pipelines
skills: [core, skill-discovery, infra-docker, infra-cloud]
memory: project
permissionMode: default
```

## Related Code Files
### Create (EXCLUSIVE)
- `.claude/agents/epost-kit-designer.md` — Kit authoring agent [OWNED]
- `.claude/agents/epost-infra.md` — Infrastructure agent (optional) [OWNED]
### Modify (EXCLUSIVE)
- `CLAUDE.md` — Remove phantom agent references [OWNED]
- `packages/core/package.yaml` — Add new agents to provides list [OWNED]
- `.claude/settings.json` — Register new agents [OWNED]
### Read-Only
- `.claude/agents/*.md` — Existing agent patterns

## Implementation Steps
1. Create `epost-kit-designer.md` with kit-authoring skills
2. (Optional) Create `epost-infra.md` with infrastructure skills
3. Update `packages/core/package.yaml` provides.agents list
4. Update `packages/kit/package.yaml` to reference kit-designer agent
5. Clean CLAUDE.md: remove `epost-web-developer`, `epost-ios-developer`, `epost-android-developer`, `epost-backend-developer`, `epost-cli-developer` phantom references
6. Update settings.json agent list

## Todo List
- [ ] Create epost-kit-designer agent
- [ ] Decide on epost-infra (optional)
- [ ] Remove phantom agent references from CLAUDE.md
- [ ] Update package manifests
- [ ] Update settings.json

## Success Criteria
- No phantom agents referenced in CLAUDE.md
- epost-kit-designer handles all kit authoring tasks
- Agent count: 15-16 (14 existing + 1-2 new)
- Each agent has clear, documented category ownership

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Kit-designer overlaps with implementer | Routing confusion | Clear trigger words in description |
| Phantom removal breaks docs | User confusion | Update all CLAUDE.snippet.md files |

## Security Considerations
New agents inherit `permissionMode` from conventions. Kit-designer uses `default` (needs write access for file creation).

## Next Steps
After all 4 phases: regenerate skill-index, run validators, update documentation.

---

## Unresolved Questions

1. **epost-infra**: Create it or keep infra tasks under implementer? Infrastructure tasks are infrequent but specialized.
2. **Platform agents**: The CLAUDE.md references them extensively. Should we create thin wrappers that delegate to implementer, or fully remove references?
3. **Skill budget increase**: Should the 15KB/3-skill limit increase now that connections auto-load dependencies? The current limit may be too restrictive for chain-loaded skills.
4. **domain-b2c**: Only a placeholder skill. Worth keeping or archive until B2C patterns materialize?
