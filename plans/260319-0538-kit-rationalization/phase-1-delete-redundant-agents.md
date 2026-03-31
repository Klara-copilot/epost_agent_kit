---
phase: 1
title: "Delete Redundant Agents"
effort: 2h
depends: []
---

# Phase 1: Delete Redundant Agents

## Context Links
- [Plan](./plan.md)
- `packages/core/agents/` — agent source files
- `CLAUDE.md` — routing table references agents

## Overview
- Priority: P1
- Status: Done
- Effort: 2h
- Description: Remove 5 agents that native Claude Code handles better. No unique domain knowledge, no active plan dependencies. Research report 260319-1225 confirms brainstormer maps to `general-purpose` + skills, mcp-manager replaced by native MCP.

## Requirements

### Functional
- Delete agents: epost-brainstormer, epost-mcp-manager, epost-journal-writer, epost-kit-designer, epost-project-manager
- Update CLAUDE.md routing table to remove references
- Update CLAUDE.md orchestration: replace "Multi-intent → spawn epost-project-manager" with "Multi-intent → orchestrator decomposes inline and spawns agents in sequence"
- Update skill-index.json agent-affinity entries if any reference deleted agents

### Non-Functional
- Zero impact on /plan, /cook, /review, /audit, /fix workflows
- No domain knowledge loss

## Agents to Delete

| Agent | Reason | Replacement |
|-------|--------|-------------|
| epost-brainstormer | Maps to `general-purpose` subagent + sequential-thinking skill. YAGNI. | Native `general-purpose` agent or epost-planner with brainstorm prompt |
| epost-mcp-manager | Native MCP discovery/management in Claude Code, Cursor, Copilot. Zero domain knowledge. | Native MCP tools (all 3 platforms) |
| epost-journal-writer | Superseded by `journal` skill loaded by fullstack-developer/debugger/planner. No standalone agent needed. | `journal` skill (already implemented) |
| epost-kit-designer | Documentation + CLAUDE.md rules sufficient | epost-docs-manager + kit skills |
| epost-project-manager | Routing already in CLAUDE.md intent map + main orchestrator. Orchestration impossible (subagents can't spawn subagents). Progress tracking handled by plan files + plans/index.json. | Main orchestrator (routing) + CLAUDE.md (rules) + plan files (tracking) |

## Related Code Files

### Files to Delete
- `packages/core/agents/epost-brainstormer.md`
- `packages/core/agents/epost-journal-writer.md`
- `packages/core/agents/epost-mcp-manager.md`
- `packages/kit/agents/epost-kit-designer.md`
- `packages/core/agents/epost-project-manager.md`

### Files to Modify
- `CLAUDE.md` — remove brainstormer, mcp-manager, journal-writer, kit-designer, project-manager from routing table; update orchestration section
- `packages/core/CLAUDE.snippet.md` — same routing table + orchestration updates
- `packages/core/agents/` — verify no cross-references to deleted agents
- `.epost-metadata.json` — update agent count

## Implementation Steps

1. **Verify no active plans reference deleted agents**
   - Grep `plans/*/plan.md` for agent names
   - Grep `plans/*/phase-*.md` for agent names
   - If any found: note and skip that agent

2. **Delete agent files from packages/**
   - Remove the 4 agent .md files listed above
   - Check if any package.yaml references them

3. **Update CLAUDE.md routing + orchestration**
   - Remove "brainstormer" from Intent Map
   - Remove "journal" from Less common intents
   - Remove "MCP" from Less common intents
   - Keep kit-designer routing but point to epost-docs-manager
   - Remove "Multi-intent → spawn epost-project-manager" from Orchestration section
   - Replace with: "Multi-intent → orchestrator decomposes inline and spawns agents in sequence"
   - Remove epost-project-manager from Intent Map "Kit question" routing

4. **Update skill-index.json**
   - Remove any agent-affinity entries referencing deleted agents
   - Run count verification

5. **Run epost-kit init**
   - Verify .claude/ regenerates without errors
   - Verify remaining agents load correctly

## Todo List
- [x] Verify no active plan dependencies on brainstormer/mcp-manager/journal-writer/kit-designer/project-manager
- [x] Delete 5 agent files from packages/
- [x] Update CLAUDE.md routing tables + orchestration section (both root and packages/core/)
- [x] Update skill-index.json agent-affinity references
- [x] Sync .claude/agents/ and .claude/skills/skill-index.json (init was interactive, manual sync done)
- [x] Spot-check: 10 agents confirmed in .claude/agents/

## Success Criteria
- 5 agents removed, 10 remaining
- No broken references in CLAUDE.md
- epost-kit init runs cleanly

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Active plan references deleted agent | Low | Pre-check via grep; skip agent if referenced |
| CLAUDE.md routing breaks | Med | Test routing with sample prompts after edit |

## Security Considerations
- None identified — agent deletion is non-destructive to code

## Next Steps
- Phase 2: Consolidate remaining agents with overlapping responsibilities
