# epost_agent_kit Landing Page

**Agent**: epost-muji
**Date**: 2026-03-12
**Output**: `/Users/than/Projects/epost_agent_kit/site/`

---

## Deliverable

A complete, buildable Astro + Tailwind landing page at `site/`. Dev server confirmed running at `http://127.0.0.1:4322/` in 228ms.

---

## Files Created

```
site/
  package.json              Astro 4.x + React + Tailwind deps
  astro.config.mjs          Integrations: tailwind, react
  tailwind.config.mjs       Space Grotesk + Inter fonts, emerald accent
  tsconfig.json             Strict mode
  src/
    layouts/Base.astro      HTML shell, Google Fonts, meta
    pages/index.astro       Composes all 9 sections
    styles/global.css       Tailwind base + constellation animation keyframes
    data/
      agents.ts             15 agents with name, slug, icon, role, color
      platforms.ts          4 platforms with stack arrays
      skills.ts             8 categories, 50+ skill names
    components/
      Nav.astro             Fixed navbar, logo, GitHub link
      Hero.astro            SVG constellation, headline, stats row, CTAs
      ProblemSolution.astro 4 before/after pairs
      HowItWorks.astro      3-step horizontal flow
      AgentGallery.astro    15-card grid from agents.ts
      PlatformSupport.astro 4-card grid from platforms.ts
      Terminal.astro        3 macOS terminal mockups, real examples
      ManagerROI.astro      Velocity / Quality / Consistency cards
      SkillMap.astro        8 categories, pill grid layout
      GettingStarted.astro  3-step install + terminal demo + GitHub CTA
      Footer.astro          Minimal
```

---

## Design Decisions

- **Dark theme**: slate-950 base, zinc-900 cards, emerald-400 accent
- **Constellation**: Pure SVG in Hero — animated dashed lines, 8 satellite nodes orbiting a glowing hub. No Three.js, no canvas.
- **Font stack**: Space Grotesk (display/headings) + Inter (body) + JetBrains Mono (code/terminal). Loaded via Google Fonts.
- **Section rhythm**: alternates between slate-950 and zinc-900/50 backgrounds with zinc-800 borders — creates depth without color noise
- **Terminal mockups**: macOS window chrome (red/yellow/green dots), real routing output, no lorem ipsum

---

## Content Accuracy

All content extracted directly from source files:
- Agent names + descriptions: `.claude/agents/*.md` frontmatter
- Skill categories: `packages/core/skills/skill-index.json`
- Platform stacks: `CLAUDE.md` tech stack sections
- Routing examples: CLAUDE.md intent table

---

## To Run

```bash
cd site
npm run dev     # http://localhost:4321
npm run build   # generates dist/
npm run preview # preview built output
```

---

## Unresolved Questions

- GitHub URL: used `github.com/than/epost_agent_kit` as placeholder — update before deploying
- `npm install -g epost-kit` install command assumes package is published — confirm package name on npm registry
- No custom domain configured in `astro.config.mjs` yet (`site` field set to placeholder)
