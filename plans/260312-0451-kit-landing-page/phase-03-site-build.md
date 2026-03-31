---
phase: 3
title: "Site Build & Components"
effort: 5h
depends: [1, 2]
---

# Phase 3: Site Build & Components

## Context Links
- [Plan](./plan.md)
- Phase 1 copy output: `site/src/content/copy.json`
- Phase 2 data output: `site/src/data/agents.ts`, `site/src/data/skills.ts`

## Overview
- Priority: P1
- Status: Pending
- Effort: 5h
- Description: Scaffold Astro project, build all page sections as components, implement dark theme with Tailwind, wire up copy and data.

## Requirements

### Functional
- Single-page layout with smooth scroll navigation
- 9 sections: Hero, Problem/Solution, How It Works, Agent Gallery, Platform Support, Developer Experience (terminal), Manager ROI, Skill Map, Getting Started
- Responsive: mobile + desktop
- Dark theme default (slate-900/950 background, cyan/green accents)
- Sticky header with section links
- Terminal component with syntax highlighting

### Non-Functional
- Zero client-side JS where possible (Astro islands only for interactive bits)
- Lighthouse performance > 90
- Semantic HTML for accessibility
- Total bundle < 100KB (excluding fonts)

## Files to Create

### Project Setup
- `site/package.json` — Astro + Tailwind deps
- `site/astro.config.mjs` — static output config
- `site/tailwind.config.mjs` — dark theme, custom colors
- `site/tsconfig.json` — TypeScript config

### Layout
- `site/src/layouts/Base.astro` — HTML shell, meta, fonts
- `site/src/pages/index.astro` — main page, section composition

### Components (one per section)
- `site/src/components/Header.astro` — sticky nav
- `site/src/components/Hero.astro` — tagline, subtitle, CTAs
- `site/src/components/ProblemSolution.astro` — before/after grid
- `site/src/components/HowItWorks.astro` — 3-step flow with icons
- `site/src/components/AgentGallery.astro` — card grid, 15 agents
- `site/src/components/PlatformSupport.astro` — 4 platform cards with badges
- `site/src/components/DevExperience.astro` — terminal mockup with examples
- `site/src/components/ManagerROI.astro` — value prop cards
- `site/src/components/SkillMap.astro` — categorized skill grid with counts
- `site/src/components/GetStarted.astro` — install + first command
- `site/src/components/Footer.astro` — links, credits

### Shared
- `site/src/components/TerminalWindow.astro` — reusable terminal chrome
- `site/src/components/SectionHeading.astro` — consistent h2 + subtitle
- `site/src/components/Badge.astro` — tech stack badges
- `site/src/components/Card.astro` — reusable card component

## Implementation Steps

1. **Project Scaffold**
   - `npm create astro@latest site` (or manual setup)
   - Add Tailwind integration
   - Configure static output mode
   - Set up dark theme colors in tailwind config

2. **Base Layout**
   - HTML with meta tags (title, description, OG tags)
   - Inter font from Google Fonts (or JetBrains Mono for code)
   - Global styles: dark background, light text

3. **Header Component**
   - Sticky, semi-transparent blur backdrop
   - Logo/name + section links
   - Mobile hamburger menu

4. **Hero Section**
   - Large tagline, muted subtitle
   - Two CTAs: primary (Get Started) + secondary (How It Works)
   - Optional: subtle animated dots/constellation background

5. **Problem/Solution Section**
   - Two-column grid: "Without Kit" (pain) vs "With Kit" (solution)
   - Red/green accent colors for contrast
   - 4 pain/solution pairs

6. **How It Works Section**
   - Horizontal 3-step flow with connecting lines
   - Step 1: chat bubble icon, Step 2: routing diagram, Step 3: agent icon
   - Brief description under each

7. **Agent Gallery**
   - Responsive card grid (3 cols desktop, 2 tablet, 1 mobile)
   - Each card: agent name, emoji, role one-liner
   - Hover effect: expand with skills list

8. **Platform Support**
   - 4 cards side by side
   - Each: platform icon, name, tech stack badges
   - Accent color per platform

9. **Developer Experience (Terminal)**
   - TerminalWindow component with macOS-style chrome
   - 3 tabbed examples showing real commands
   - Syntax-highlighted command + response

10. **Manager ROI Section**
    - 3 value prop cards with icons
    - Stats/numbers where possible
    - Light background accent to differentiate

11. **Skill Map**
    - 6 category groups
    - Skills as small pills/badges within each group
    - Category count badges
    - Connection lines optional (may add visual noise)

12. **Getting Started**
    - Code block: install command
    - Code block: first interaction
    - Link to full docs

13. **Footer**
    - "Built with epost_agent_kit" badge
    - GitHub link
    - Version info

## Todo List
- [ ] Scaffold Astro project with Tailwind
- [ ] Create base layout with dark theme
- [ ] Build Header with sticky nav
- [ ] Build Hero section
- [ ] Build Problem/Solution grid
- [ ] Build How It Works flow
- [ ] Build Agent Gallery cards (15 agents)
- [ ] Build Platform Support cards (4 platforms)
- [ ] Build Terminal mockup with 3 examples
- [ ] Build Manager ROI section
- [ ] Build Skill Map visualization
- [ ] Build Getting Started section
- [ ] Build Footer
- [ ] Wire all copy from JSON
- [ ] Wire all data from TS files
- [ ] Test responsive layout (mobile, tablet, desktop)

## Success Criteria
- All 9 sections render correctly
- Dark theme consistent throughout
- Responsive on mobile/tablet/desktop
- No client-side JS except optional terminal tabs
- All agent/skill data renders from Phase 2 data files

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Astro unfamiliar to team | Low | Simple components, well-documented framework |
| Too many sections, page too long | Med | Add section nav with smooth scroll anchors |
| Terminal examples feel fake | Med | Use actual kit output, real commands |

## Security Considerations
- No user input, no forms, no auth — static content only
- OG meta tags should not contain sensitive info

## Next Steps
- Phase 4: polish, animations, deploy config
