---
phase: 3
title: "Orchestration + output contract docs"
effort: 1h
depends: [1]
---

## Context Links

- Plan: [plan.md](./plan.md)
- Files: `.claude/rules/orchestration-protocol.md`, `docs/architecture/ARCH-0002*.md`, `packages/core/skills/core/SKILL.md`

## Overview

Document P2 (output contract) and P5 (orchestrator injection pattern) in the appropriate reference files. Depends on Phase 1 because orchestration-protocol.md must align with the new CLAUDE.md execution model.

## Requirements

### Functional
1. **P2 — Output contract** (core SKILL.md): Add behavioral rule that skill output format is identical whether executed inline or via agent spawn
2. **P5 — Injection pattern** (orchestration-protocol.md): Document that orchestrator injects platform + domain skills into agent spawn prompts at dispatch time
3. **ARCH-0002 updates**: Add P2 and P5 as new sections in the design principles document

### Non-Functional
- Each addition < 15 lines
- No redundancy between the three files (each owns its concern)

## Files to Change

- `packages/core/skills/core/SKILL.md` — **Modify**: add output contract rule
- `.claude/rules/orchestration-protocol.md` — **Modify**: add injection pattern
- `docs/architecture/ARCH-0002-claude-native-mechanics-and-routing-design.md` — **Modify**: add P2, P5

## Implementation Steps

1. Add to core SKILL.md under "Behavioral Rules" or "Quick Reference":
   ```
   ### Output Contract
   Skill output format must be identical whether executed inline or via agent spawn.
   Never vary report structure, status block format, or file naming based on execution mode.
   ```
2. Add to orchestration-protocol.md under "Context Passing":
   ```
   ### Skill Injection at Spawn
   Orchestrator detects platform from surface signals (file extensions, CWD, user hint).
   When spawning an agent, inject relevant platform/domain skills in the prompt:
   - "Platform: web. Load web-frontend, web-nextjs skills."
   Agents own their default skills (skills: frontmatter). Orchestrator adds extras.
   ```
3. Add to ARCH-0002 under "Design Principles":
   - Principle 6: Output contract invariance
   - Principle 7: Spawn-time skill injection

## Todo List

- [ ] Add output contract to core SKILL.md
- [ ] Add injection pattern to orchestration-protocol.md
- [ ] Add P2, P5 to ARCH-0002

## Success Criteria

- core SKILL.md has output contract rule
- orchestration-protocol.md has injection pattern
- ARCH-0002 has both new principles documented
