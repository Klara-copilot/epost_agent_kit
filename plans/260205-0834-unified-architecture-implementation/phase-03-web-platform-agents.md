# Phase 3: Web Platform Agents

## Context Links
- Parent: [plan.md](plan.md)
- Depends on: [Phase 2](phase-02-global-agents.md)
- Research: [Cross-Platform Formats](research/researcher-01-cross-platform-formats.md)

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 3h
- **Description**: Create web platform agents (`web/implementer`, `web/tester`, `web/designer`), reorganize web-related skills under `skills/web/`, and create web-specific commands.

## Key Insights
- Current `ui-designer.md` content is web-focused (React, Tailwind, CSS); moves to `web/designer.md`
- Current `fullstack-developer.md` has web-specific patterns (TypeScript, lint, bun test); these move to `web/implementer.md`
- Web skills already exist: nextjs, frontend-development, backend-development, shadcn-ui, better-auth
- These skills need to move under `skills/web/` subdirectory

## Requirements

### Functional

**Create agents**:
- `web/implementer.md` - Next.js, React, TypeScript, Tailwind specialist
- `web/tester.md` - Vitest/Playwright/Testing Library specialist
- `web/designer.md` - shadcn/Figma/accessibility specialist (from ui-designer.md)

**Reorganize skills**:
- `skills/nextjs/` -> `skills/web/nextjs/`
- `skills/frontend-development/` -> `skills/web/frontend-development/`
- `skills/backend-development/` -> `skills/web/backend-development/`
- `skills/shadcn-ui/` -> `skills/web/shadcn-ui/`
- `skills/better-auth/` -> `skills/web/better-auth/`
- Shared skills stay at root: `skills/databases/`, `skills/docker/`, `skills/debugging/`, `skills/planning/`, `skills/research/`

**Create commands**:
- `commands/web/cook.md` - Direct web implementation (bypasses global routing)
- `commands/web/test.md` - Direct web testing

### Non-Functional
- Platform agents must be self-contained (no cross-platform assumptions)
- Agent prompts reference platform-specific skills and tools
- Under 200 lines per agent

## Architecture

```
Global implementer (orchestrate)
  |
  +-- Detects web context (.tsx, .ts, Next.js project)
  |     -> Spawns web/implementer
  |
web/implementer (execute)
  |
  +-- Uses skills: web/nextjs, web/frontend-development, web/backend-development
  +-- Uses skills: web/shadcn-ui, web/better-auth
  +-- Uses shared skills: databases, docker
  +-- Tools: Read, Write, Edit, Bash, Grep, Glob
  +-- Build: npm/bun commands
  +-- Test: delegates to web/tester or runs inline
```

## Related Code Files

### Create
- `.claude/agents/web/implementer.md`
- `.claude/agents/web/tester.md`
- `.claude/agents/web/designer.md`
- `.claude/skills/web/` directory
- `.claude/commands/web/cook.md`
- `.claude/commands/web/test.md`

### Move (rename/relocate)
- `.claude/skills/nextjs/` -> `.claude/skills/web/nextjs/`
- `.claude/skills/frontend-development/` -> `.claude/skills/web/frontend-development/`
- `.claude/skills/backend-development/` -> `.claude/skills/web/backend-development/`
- `.claude/skills/shadcn-ui/` -> `.claude/skills/web/shadcn-ui/`
- `.claude/skills/better-auth/` -> `.claude/skills/web/better-auth/`

### Delete
- Original skill locations after moving (above)

## Implementation Steps

### Step 1: Create agents directory
```bash
mkdir -p .claude/agents/web
```

### Step 2: Create web/implementer.md
```yaml
---
name: web-implementer
description: Web platform implementation specialist. Executes Next.js, React, TypeScript, and Tailwind development tasks. Spawned by global implementer for web-specific work.
tools: Read, Write, Edit, Bash, Grep, Glob
model: inherit
color: green
---
```
Body includes:
- Tech stack: Next.js 15+, React 19+, TypeScript 5+, Tailwind CSS 4+
- Skills references: web/nextjs, web/frontend-development, web/backend-development, web/shadcn-ui, web/better-auth
- Build/lint commands: `npm run build`, `npm run lint`
- Implementation workflow (from current fullstack-developer.md web-specific parts)
- Completion report format

### Step 3: Create web/tester.md
```yaml
---
name: web-tester
description: Web platform testing specialist. Runs and writes Vitest, Playwright, and React Testing Library tests. Spawned by global tester for web-specific work.
tools: Read, Write, Edit, Bash, Grep, Glob
model: inherit
color: yellow
---
```
Body includes:
- Test frameworks: Vitest, Playwright, Testing Library
- Commands: `npm run test`, `npx playwright test`
- Coverage goals and reporting format

### Step 4: Create web/designer.md
Migrate from `ui-designer.md`:
```yaml
---
name: web-designer
description: Web UI/UX specialist. Implements shadcn/ui components, Figma designs, responsive layouts, and accessibility. Spawned by global implementer for design-focused web tasks.
tools: Read, Write, Edit, Bash, Grep, Glob
model: inherit
color: purple
---
```
Body: Adapted from current ui-designer.md content

### Step 5: Reorganize skills
```bash
mkdir -p .claude/skills/web
mv .claude/skills/nextjs .claude/skills/web/nextjs
mv .claude/skills/frontend-development .claude/skills/web/frontend-development
mv .claude/skills/backend-development .claude/skills/web/backend-development
mv .claude/skills/shadcn-ui .claude/skills/web/shadcn-ui
mv .claude/skills/better-auth .claude/skills/web/better-auth
```

### Step 6: Create web commands
- `commands/web/cook.md` with `agent: web-implementer`
- `commands/web/test.md` with `agent: web-tester`

### Step 7: Update global agents
- `implementer.md`: Add web/implementer as delegation target
- `tester.md`: Add web/tester as delegation target

### Step 8: Verify
- All 3 web agents have valid YAML frontmatter
- All moved skills retain their SKILL.md files
- Web commands reference valid agent names
- No broken skill references in any agent

## Todo List

- [ ] Create `.claude/agents/web/` directory
- [ ] Create web/implementer.md
- [ ] Create web/tester.md
- [ ] Create web/designer.md (from ui-designer.md)
- [ ] Move nextjs skill to web/nextjs
- [ ] Move frontend-development skill to web/frontend-development
- [ ] Move backend-development skill to web/backend-development
- [ ] Move shadcn-ui skill to web/shadcn-ui
- [ ] Move better-auth skill to web/better-auth
- [ ] Create web/cook.md command
- [ ] Create web/test.md command
- [ ] Update global implementer.md delegation targets
- [ ] Update global tester.md delegation targets
- [ ] Verify all references intact

## Success Criteria

- 3 web agents exist at `.claude/agents/web/{implementer,tester,designer}.md`
- 5 web skills exist at `.claude/skills/web/{nextjs,frontend-development,backend-development,shadcn-ui,better-auth}/`
- Shared skills remain at root: databases, docker, debugging, planning, research
- Web commands route to web-specific agents
- Global implementer/tester reference web agents in delegation section

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Skill path changes break references | Skills not found by agents | Update all skill path references in agent prompts |
| Claude Code nested agent dirs not supported | web/ agents not discovered | Test that `.claude/agents/web/implementer.md` is auto-discovered; fallback: flatten to `web-implementer.md` |

## Security Considerations
- No new tool permissions; web agents inherit parent tool set
- No secrets handling changes

## Next Steps
- Phase 4 verifies the restructured system works end-to-end
- Phase 5 creates iOS platform agents following same pattern
