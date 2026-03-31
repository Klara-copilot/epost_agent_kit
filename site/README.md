# epost-agent-kit-site

Landing page for [epost-agent-kit-cli](https://github.com/Klara-copilot/epost-agent-kit-cli) — a multi-agent development toolkit.

## Stack

- **Framework**: [Astro 4](https://astro.build)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com)
- **Fonts**: Space Grotesk, Inter, JetBrains Mono
- **Theme**: Dark (slate-950 base, emerald-400 accent)

## Sections

| Component | Section |
|-----------|---------|
| `Hero` | Headline, stats, CTAs |
| `ProblemSolution` | Before/after pain points |
| `HowItWorks` | 3-step workflow |
| `AgentGallery` | 15 agent cards |
| `PlatformSupport` | Web, iOS, Android, Backend |
| `CLI` | epost-kit CLI commands, profiles, packages |
| `Terminal` | Live interaction mockups |
| `ManagerROI` | Velocity, quality, consistency |
| `WorkflowsTeaser` | 6 automation workflow cards linking to subpages |
| `SkillMap` | 65+ skills by category |
| `KnowledgeRetrieval` | 5-level retrieval chain, knowledge tiers, decision matrix |
| `GettingStarted` | Install steps + GitHub CTA |

## Workflow Subpages

| Route | Title | Status |
|-------|-------|--------|
| `/workflows` | Workflow index — all 6 automation scenarios | - |
| `/workflows/automated-code-audit` | Automated Code Audit — security, quality, a11y, performance | Available |
| `/workflows/po-to-prototype` | PO-to-Prototype Pipeline — feature description to PR | Available |
| `/workflows/brainstorming` | Brainstorming Flow — ideate, evaluate, design, spike, validate | Available |
| `/workflows/cross-branch-fixes` | Cross-Branch Fix Propagation — smart patch across branches | Planned |
| `/workflows/continuous-quality` | Continuous Quality Loop — metrics monitoring + auto-fix | Planned |
| `/workflows/development-dashboard` | Development Dashboard — automatic progress tracking | Planned |

## Development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # Static output → dist/
npm run preview    # Preview production build
```

## Project Structure

```
site/
├── src/
│   ├── components/    # Astro components (one per section)
│   ├── data/          # Typed data files (agents, skills, platforms)
│   ├── layouts/       # Base + Workflow layouts
│   ├── pages/         # index.astro + workflows/ subpages
│   └── styles/        # global.css (Tailwind + custom)
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```
