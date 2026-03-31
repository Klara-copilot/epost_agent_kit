---
phase: 2
title: "Agent & Skill Data Extraction"
effort: 2h
depends: []
---

# Phase 2: Agent & Skill Data Extraction

## Context Links
- [Plan](./plan.md)
- `.claude/agents/*.md` — 15 agent definitions
- `packages/core/skills/skill-index.json` — 46 skills with categories, keywords, connections

## Overview
- Priority: P1
- Status: Pending
- Effort: 2h
- Description: Extract structured data from agent definitions and skill index into site-ready JSON/TS files. Build the data layer for agent gallery and skill map components.

## Requirements

### Functional
- Agent data: name, emoji/icon, role, description, platforms, key skills
- Skill data: name, category, platform, connections (extends/enhances), keywords
- Category grouping for skill map visualization
- Platform-to-agent mapping for platform section
- Connection graph data for skill relationships (optional: for visual)

### Non-Functional
- TypeScript types for all data structures
- Data files importable by Astro components
- No runtime API calls — all data baked at build time

## Files to Create
- `site/src/data/agents.ts` — typed agent array with gallery data
- `site/src/data/skills.ts` — typed skill array with category grouping
- `site/src/data/platforms.ts` — platform cards with tech stacks
- `site/src/types.ts` — shared TypeScript types

## Implementation Steps

1. **Parse Agent Frontmatter**
   - Read all 15 `.claude/agents/*.md` files
   - Extract: name, description, model, skills list
   - Map to display-friendly format (icon, title, subtitle)

2. **Transform Skill Index**
   - Read `skill-index.json`
   - Group by category (6 groups: accessibility, development-tools, analysis-reasoning, design-system, infrastructure, kit-authoring)
   - Count per category for badges
   - Extract connection graph for skill map arrows

3. **Build Platform Data**
   - 4 platforms: Web, iOS, Android, Backend
   - For each: framework, language, UI lib, testing, build tool
   - Source from CLAUDE.md tech stack sections

4. **Type Definitions**
   - `Agent { id, name, icon, role, description, platforms, skills }`
   - `Skill { name, category, tier, platforms, connections }`
   - `Platform { name, icon, stack: Record<string, string> }`

## Todo List
- [ ] Extract 15 agent definitions to typed array
- [ ] Transform 46 skills into categorized structure
- [ ] Build 4 platform data objects with tech stacks
- [ ] Create TypeScript type definitions
- [ ] Verify all data matches source files

## Success Criteria
- Agent array has exactly 15 entries
- Skill array has 46 entries across 6 categories
- Platform data matches CLAUDE.md tech stacks
- All files pass TypeScript type checking

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent frontmatter format varies | Low | Handle optional fields gracefully |
| Skill data changes after extraction | Low | Note: data is snapshot, add "last updated" date |

## Security Considerations
- None identified

## Next Steps
- Phase 3 consumes these data files for components
