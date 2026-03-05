# Phase 02: Add New Agents

## Context Links
- [Plan](./plan.md)
- `packages/core/agents/` — core agent definitions
- claudekit reference: `../claudekit/.claude/agents/`

## Overview
- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Add 4 new agents from claudekit: code-simplifier, journal-writer, mcp-manager, ui-ux-designer

## Requirements

### Functional
- Create 4 new agent .md files in `packages/core/agents/`
- Register in `packages/core/package.yaml`
- Adapt claudekit prompts for epost context (add ePost prefix, skill activation)

### Non-Functional
- Follow existing frontmatter conventions (name, description, model, color, skills, memory)
- Keep prompts lean — reference skills instead of inlining instructions
- Agent names must have `epost-` prefix

## Related Code Files

### Files to Create
- `packages/core/agents/epost-code-simplifier.md` — code clarity/consistency agent (opus model)
- `packages/core/agents/epost-journal-writer.md` — technical failure journal (haiku model)
- `packages/core/agents/epost-mcp-manager.md` — MCP server integration (haiku model)
- `packages/core/agents/epost-ui-ux-designer.md` — UI/UX design work (sonnet model)

### Files to Modify
- `packages/core/package.yaml` — add 4 new agents to provides.agents list

## Implementation Steps

1. **epost-code-simplifier.md**
   - Model: opus (matches claudekit — needs high reasoning for refactoring)
   - Role: simplify/refine code for clarity, consistency, maintainability
   - Skills: [core, skill-discovery]
   - Key: preserve functionality, apply project standards, enhance clarity
   - Tools: include Edit, Write (needs to modify code)

2. **epost-journal-writer.md**
   - Model: haiku (documentation task, lightweight)
   - Role: document technical failures with emotional honesty
   - Skills: [core]
   - Trigger: repeated test failures, production bugs, failed approaches
   - Output: journal entries in `docs/journals/`

3. **epost-mcp-manager.md**
   - Model: haiku (tool coordination, lightweight)
   - Role: MCP server discovery, tool filtering, execution
   - Skills: [core]
   - Key: keeps main context clean by handling MCP in subagent
   - Tools: Read, Bash, Glob, Grep (no Write — discovery only)

4. **epost-ui-ux-designer.md**
   - Model: sonnet (creative + technical balance)
   - Role: UI/UX design, wireframes, design systems, responsive layouts
   - Skills: [core, skill-discovery] (will discover web-figma, web-ui-lib dynamically)
   - Tools: include Edit, Write, WebSearch (design research)

5. **Update package.yaml**
   - Add all 4 to `provides.agents` list in `packages/core/package.yaml`

## Todo List
- [ ] Create epost-code-simplifier.md
- [ ] Create epost-journal-writer.md
- [ ] Create epost-mcp-manager.md
- [ ] Create epost-ui-ux-designer.md
- [ ] Add 4 agents to packages/core/package.yaml
- [ ] Verify frontmatter follows conventions

## Success Criteria
- 4 new agent files created in packages/core/agents/
- Each has valid frontmatter with name, description, model, color, skills
- package.yaml lists all 14 core agents

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| ui-ux-designer references missing skills (ui-ux-pro-max) | Med | Remove claudekit-specific skill refs, use skill-discovery |
| mcp-manager references gemini CLI | Med | Remove gemini refs, keep MCP tool focus |
| New agents not routed to | Low | Update routing in phase 03 |

## Security Considerations
- mcp-manager should NOT have Write/Edit tools (read-only discovery)
- journal-writer writes only to docs/journals/ directory

## Next Steps
- Phase 03: Update CLAUDE.md routing, settings, CLAUDE.snippet.md
