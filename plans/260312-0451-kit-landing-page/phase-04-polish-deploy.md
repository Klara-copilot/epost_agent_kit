---
phase: 4
title: "Polish & Deploy Config"
effort: 2h
depends: [3]
---

# Phase 4: Polish & Deploy Config

## Context Links
- [Plan](./plan.md)
- Phase 3 output: complete Astro site in `site/`

## Overview
- Priority: P2
- Status: Pending
- Effort: 2h
- Description: Add micro-animations, optimize images, configure GitHub Pages deployment, add SEO meta tags, final QA pass.

## Requirements

### Functional
- Scroll-triggered fade-in animations on sections
- GitHub Pages deployment config (GitHub Actions workflow)
- Open Graph meta tags for social sharing
- Favicon (use kit logo or generate)
- 404 page

### Non-Functional
- Lighthouse score > 90 (performance, accessibility, best practices, SEO)
- All images optimized (WebP, lazy-loaded)
- Build time < 30 seconds

## Files to Create
- `.github/workflows/deploy-site.yml` — GitHub Pages deployment
- `site/public/favicon.svg` — site favicon
- `site/public/og-image.png` — Open Graph preview image
- `site/src/pages/404.astro` — custom 404 page

## Files to Modify
- `site/src/layouts/Base.astro` — add OG tags, favicon link
- `site/src/components/*.astro` — add transition animations
- `site/astro.config.mjs` — add site URL for sitemap

## Implementation Steps

1. **Scroll Animations**
   - CSS-only `@keyframes` fade-in-up on each section
   - Use `IntersectionObserver` via Astro `<script>` for trigger
   - Stagger delay for cards within sections

2. **SEO & Meta**
   - Title: "epost_agent_kit — Multi-Agent Dev Toolkit for Claude Code"
   - Description: punchy 155-char summary
   - OG image: dark card with kit name + agent icons

3. **GitHub Pages Deploy**
   - GitHub Actions workflow: on push to main
   - Build step: `cd site && npm ci && npm run build`
   - Deploy to `gh-pages` branch or use `actions/deploy-pages`

4. **Performance Optimization**
   - Inline critical CSS
   - Preload fonts
   - Compress assets
   - Verify no unnecessary JS shipped

5. **Final QA**
   - Test all section anchors
   - Test mobile hamburger menu
   - Verify all 15 agents render
   - Verify all 46 skills render
   - Check color contrast (WCAG AA)
   - Run Lighthouse audit

## Todo List
- [ ] Add scroll-triggered section animations
- [ ] Add OG meta tags + favicon
- [ ] Create GitHub Actions deploy workflow
- [ ] Create 404 page
- [ ] Run Lighthouse audit, fix issues
- [ ] Final visual QA on mobile + desktop

## Success Criteria
- Lighthouse scores: Performance > 90, Accessibility > 90, SEO > 90
- GitHub Actions workflow builds and deploys successfully
- OG image displays correctly when URL shared
- All animations smooth, no layout shift

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| GitHub Pages config issues | Low | Follow official Astro deploy guide |
| Animations cause jank | Low | Use CSS transforms only (GPU-accelerated) |

## Security Considerations
- GitHub Actions needs Pages write permission
- No secrets in static build

## Next Steps
- Ship it
