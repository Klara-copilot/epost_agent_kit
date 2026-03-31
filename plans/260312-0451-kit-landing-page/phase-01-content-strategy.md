---
phase: 1
title: "Content Strategy & Copy"
effort: 3h
depends: []
---

# Phase 1: Content Strategy & Copy

## Context Links
- [Plan](./plan.md)
- `CLAUDE.md` — feature overview, routing, orchestration
- `.claude/agents/*.md` — agent definitions (15 files)
- `packages/core/skills/skill-index.json` — all 46 skills

## Overview
- Priority: P1
- Status: Pending
- Effort: 3h
- Description: Write all landing page copy — hero, problem/solution, how-it-works, agent descriptions, platform section, manager ROI, getting started

## Requirements

### Functional
- Hero tagline + subtitle (max 15 words tagline)
- Problem statement (3-4 pain points of unassisted Claude Code)
- Solution framing (how kit solves each pain point)
- "How It Works" 3-step flow copy
- Agent one-liner descriptions (all 15)
- Platform support section copy (web/iOS/Android/backend tech stacks)
- Developer Experience section with 3 terminal examples
- Manager ROI section (velocity, quality, consistency angles)
- Getting Started section (install + first command)
- Skill map category descriptions (6 categories)

### Non-Functional
- Punchy, not corporate — write like a dev tool README
- No buzzwords ("leverage", "synergy", "paradigm")
- Concrete numbers where possible (15 agents, 46 skills, 4 platforms)
- Each section copy < 150 words

## Files to Create
- `site/src/content/copy.json` — all copy in structured JSON
- `site/src/content/terminal-examples.ts` — typed terminal animation data

## Implementation Steps

1. **Hero Copy**
   - Tagline: convey "multi-agent dev toolkit for Claude Code"
   - Subtitle: mention natural language routing + specialized agents
   - CTA: "Get Started" / "See How It Works"

2. **Problem/Solution Copy**
   - Pain: context switching, forgotten conventions, manual routing, inconsistent quality
   - Solution: smart routing, specialized agents, quality gates, platform knowledge

3. **How It Works Flow**
   - Step 1: "You type naturally" — describe intent, not commands
   - Step 2: "Kit routes intelligently" — platform detection, intent classification
   - Step 3: "Agent delivers" — specialized agent with loaded skills executes

4. **Terminal Examples** (real commands)
   - Example 1: `> fix the login page` → routes to debugger → loads web-frontend skill → diagnoses
   - Example 2: `> plan the notification feature` → routes to planner → creates phased plan
   - Example 3: `> done` → routes to git-manager → commit + push + PR

5. **Agent Descriptions**
   - Read each `.claude/agents/*.md` frontmatter for role/description
   - Write punchy one-liner per agent

6. **Manager ROI Section**
   - Velocity: agents handle boilerplate, routing, context loading
   - Quality: two-stage review (spec + code quality), a11y built-in
   - Consistency: same patterns across 4 platforms, shared conventions
   - Knowledge: findings persist across sessions, no tribal knowledge loss

7. **Getting Started Copy**
   - Install command
   - First interaction example
   - Link to docs

## Todo List
- [ ] Write hero tagline + subtitle
- [ ] Write problem/solution pairs (4 pairs)
- [ ] Write 3-step flow descriptions
- [ ] Write 15 agent one-liners
- [ ] Write 3 terminal examples with realistic output
- [ ] Write manager ROI section (3 value props)
- [ ] Write getting started steps
- [ ] Write skill category descriptions (6 categories)
- [ ] Export all copy to structured JSON

## Success Criteria
- All 9 page sections have copy
- Terminal examples use real kit commands
- No section exceeds 150 words
- Manager section has concrete value propositions

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Copy too long/corporate | Med | Review against "dev tool README" standard |
| Inaccurate feature claims | High | Cross-reference every claim against source files |

## Security Considerations
- None identified (static content only)

## Next Steps
- Phase 2 depends on agent/skill data from this phase
