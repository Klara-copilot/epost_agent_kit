---
title: "epost_agent_kit Landing Page & Presentation Content"
description: "Static landing page showcasing the kit to developers and engineering managers"
status: archived
priority: P1
effort: 12h
tags: [landing-page, marketing, static-site, content, presentation]
created: 2026-03-12
updated: 2026-03-11
platforms: [web]
breaking: false
phases: 4
---

# epost_agent_kit Landing Page

## Summary

Build a polished static landing page (Astro + Tailwind) that sells epost_agent_kit to developers and engineering managers. Dark theme, punchy copy, real terminal examples, agent gallery, skill map.

## Key Dependencies

- Astro (static site generator — zero JS by default, fast)
- Tailwind CSS (dark theme styling)
- Content derived from existing CLAUDE.md, skill-index.json, agent definitions

## Why Astro over Next.js

- No backend needed (static constraint)
- Ships zero JS by default (faster than Next.js static export)
- Markdown/MDX native (content-heavy page)
- Deploys anywhere (GitHub Pages, Vercel, Netlify)
- Doesn't couple landing page to the kit's own Next.js stack

## Execution Strategy

Sequential: content first (phases 1-2), then build (phase 3), then polish (phase 4).

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Content Strategy & Copy | 3h | pending | [phase-01](./phase-01-content-strategy.md) |
| 2 | Agent & Skill Data Extraction | 2h | pending | [phase-02](./phase-02-data-extraction.md) |
| 3 | Site Build & Components | 5h | pending | [phase-03](./phase-03-site-build.md) |
| 4 | Polish & Deploy Config | 2h | pending | [phase-04](./phase-04-polish-deploy.md) |

## Critical Constraints

- Must be static (no backend)
- Content in English
- Dark theme primary (dev audience)
- All content sourced from actual kit files (no fabrication)
- Site lives at `site/` in repo root (not inside packages/)

## Success Criteria

- [ ] Landing page renders with all 9 sections
- [ ] Agent gallery shows all 15 agents with descriptions
- [ ] Skill map displays 46+ skills organized by category
- [ ] Terminal examples use real kit commands and outputs
- [ ] Page scores 90+ on Lighthouse (performance)
- [ ] Deploys to GitHub Pages via static build
- [ ] Manager ROI section present with concrete value props
