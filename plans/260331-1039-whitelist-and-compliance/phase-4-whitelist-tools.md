---
phase: 4
title: "Whitelist Tool Model"
effort: 1h 30m
depends: []
---

# Phase 4: Whitelist Tool Model

## Context Links
- [Plan](./plan.md)
- `packages/kit/skills/kit/references/agent-development.md`
- `packages/kit/skills/kit/references/add-agent.md`
- `packages/kit/skills/kit/references/agents.md`

## Overview
- Priority: P1
- Status: Pending
- Effort: 1h 30m
- Description: Replace blacklist (`disallowedTools`) with whitelist (`allowedTools`) across all 11 agents. Update kit documentation to make whitelist the standard. Principle of least privilege.

## Requirements

### Functional
- Every agent gets `allowedTools:` in frontmatter
- Remove any existing `disallowedTools:` references
- `epost-git-manager` already has `tools:` — migrate to `allowedTools:` pattern
- Kit docs updated to recommend `allowedTools` as default, deprecate `disallowedTools`

### Non-Functional
- `allowedTools` is ecosystem field (same status as `disallowedTools`) — note in docs

## Related Code Files

### Files to Modify

**Core agents** (9 files):
- `packages/core/agents/epost-researcher.md` — add `allowedTools: Read, Glob, Grep, WebSearch, WebFetch, Write`
- `packages/core/agents/epost-code-reviewer.md` — add `allowedTools: Read, Glob, Grep, Write`
- `packages/core/agents/epost-brainstormer.md` — add `allowedTools: Read, Glob, Grep, Write`
- `packages/core/agents/epost-planner.md` — add `allowedTools: Read, Glob, Grep, Write, Edit`
- `packages/core/agents/epost-docs-manager.md` — add `allowedTools: Read, Glob, Grep, Write, Edit, Bash`
- `packages/core/agents/epost-tester.md` — add `allowedTools: Read, Glob, Grep, Write, Edit, Bash`
- `packages/core/agents/epost-debugger.md` — add `allowedTools: Read, Glob, Grep, Write, Edit, Bash`
- `packages/core/agents/epost-fullstack-developer.md` — add `allowedTools: Read, Glob, Grep, Write, Edit, Bash`
- `packages/core/agents/epost-git-manager.md` — replace `tools:` with `allowedTools: Read, Bash`

**Other package agents** (2 files):
- `packages/design-system/agents/epost-muji.md` — add `allowedTools: Read, Glob, Grep, Write, Edit`
- `packages/a11y/agents/epost-a11y-specialist.md` — add `allowedTools: Read, Glob, Grep, Write, Edit, Bash`

**Kit documentation** (3 files):
- `packages/kit/skills/kit/references/agent-development.md` — replace `disallowedTools` guidance with `allowedTools` as recommended standard
- `packages/kit/skills/kit/references/add-agent.md` — replace `disallowedTools` mention with `allowedTools`
- `packages/kit/skills/kit/references/agents.md` — update frontmatter table: mark `allowedTools` as recommended, `disallowedTools` as deprecated

### Files to Create
- None

### Files to Delete
- None

## Implementation Steps

1. **Update each agent frontmatter** — add `allowedTools:` line after `permissionMode:` (or after `color:` / `model:` if no permissionMode)
   - For `epost-git-manager`: replace existing `tools:` with `allowedTools:`
   - Remove any `disallowedTools:` if present

2. **Update agent-development.md** (~line 149):
   - Change `disallowedTools` entry to note it's **deprecated**
   - Add `allowedTools` as the **recommended** approach with example
   - Add a "Principle of Least Privilege" note: prefer allowedTools whitelist over disallowedTools blacklist

3. **Update add-agent.md** (~line 41):
   - Change `disallowedTools as needed` to `allowedTools (whitelist) per role`

4. **Update agents.md** (~line 42-43):
   - Mark `disallowedTools` row as `(deprecated)` in Description
   - Mark `allowedTools` row as `(recommended)` in Description

### Whitelist Reference Table

| Agent | allowedTools | Rationale |
|-------|-------------|-----------|
| epost-researcher | Read, Glob, Grep, WebSearch, WebFetch, Write | Research + write reports, no code edits |
| epost-code-reviewer | Read, Glob, Grep, Write | Read code + write review, no edits |
| epost-brainstormer | Read, Glob, Grep, Write | Read context + write report |
| epost-planner | Read, Glob, Grep, Write, Edit | Read + write/edit plan files |
| epost-docs-manager | Read, Glob, Grep, Write, Edit, Bash | Read + write docs + run scripts |
| epost-tester | Read, Glob, Grep, Write, Edit, Bash | Read + write tests + run test commands |
| epost-debugger | Read, Glob, Grep, Write, Edit, Bash | Read + write fixes + run debug |
| epost-fullstack-developer | Read, Glob, Grep, Write, Edit, Bash | Full implementation access |
| epost-git-manager | Read, Bash | Read files + git commands only |
| epost-a11y-specialist | Read, Glob, Grep, Write, Edit, Bash | Same as tester |
| epost-muji | Read, Glob, Grep, Write, Edit | Design work, no bash needed |

## Todo List
- [ ] Add `allowedTools:` to epost-researcher
- [ ] Add `allowedTools:` to epost-code-reviewer
- [ ] Add `allowedTools:` to epost-brainstormer
- [ ] Add `allowedTools:` to epost-planner
- [ ] Add `allowedTools:` to epost-docs-manager
- [ ] Add `allowedTools:` to epost-tester
- [ ] Add `allowedTools:` to epost-debugger
- [ ] Add `allowedTools:` to epost-fullstack-developer
- [ ] Replace `tools:` with `allowedTools:` in epost-git-manager
- [ ] Add `allowedTools:` to epost-muji
- [ ] Add `allowedTools:` to epost-a11y-specialist
- [ ] Update agent-development.md (deprecate disallowedTools, recommend allowedTools)
- [ ] Update add-agent.md (replace disallowedTools reference)
- [ ] Update agents.md (mark deprecated/recommended in table)

## Success Criteria
- All 11 agents have `allowedTools:` in frontmatter
- No `disallowedTools:` remains in any agent
- Kit docs recommend whitelist as standard
- `epost-kit init` regenerates `.claude/agents/` correctly

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| `allowedTools` not respected by Claude Code runtime | High | Test with one agent first; `tools:` is confirmed upstream — `allowedTools` is ecosystem |
| Missing a needed tool breaks agent workflow | Med | Conservative list based on actual agent behavior; easy to add tools later |
| `tools:` vs `allowedTools:` field name confusion | Med | Document both in agents.md; `tools:` is upstream, `allowedTools:` is ecosystem alias |

## Security Considerations
- This is a security hardening change — reduces blast radius of compromised/confused agents
- Principle of least privilege applied consistently

## Next Steps
- Run `epost-kit init` to regenerate `.claude/` from `packages/`
- Verify agents work correctly with new tool restrictions (manual spot-check)
