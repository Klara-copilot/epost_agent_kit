---
phase: 5
title: "Visual Regression Testing skill"
effort: 3h
depends: []
---

# Phase 5: Visual Regression Testing Skill

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/test/SKILL.md` — existing test skill
- Web tech stack: Playwright already listed in CLAUDE.md

## Overview
- Priority: P2
- Status: Pending
- Effort: 3h
- Description: Add a `--visual` flag to the test skill that runs Playwright screenshot comparison tests. Includes skill reference for setting up visual regression, running comparisons, and updating baselines.

## Requirements
### Functional
- `/test --visual` runs Playwright visual comparison tests
- `/test --visual --update` updates baseline screenshots
- Skill reference documents: setup, config, threshold tuning, CI integration
- Auto-detect visual test files: `*.visual.spec.ts`, `*.screenshot.spec.ts`
- Output: pass/fail with diff image paths for failures

### Non-Functional
- No new dependencies beyond Playwright (already in stack)
- Skill reference under 150 lines
- Works with Next.js App Router pages and Storybook components

## Related Code Files
### Files to Modify
- `packages/core/skills/test/SKILL.md` — add `--visual` flag to Step 0 flag table
  - Add: `If $ARGUMENTS starts with --visual: load references/visual-mode.md and execute.`
  - Add to Aspect Files table: `references/visual-mode.md | Visual regression testing with Playwright`

### Files to Create
- `packages/core/skills/test/references/visual-mode.md` — Visual regression testing reference
  - Playwright config for screenshots (`playwright.config.ts` `expect.toHaveScreenshot` settings)
  - Test file pattern detection
  - Running visual tests: `npx playwright test --grep @visual` or file pattern
  - Baseline management: `--update-snapshots` flag
  - Threshold tuning: `maxDiffPixels`, `maxDiffPixelRatio`
  - CI integration notes (consistent viewport, font rendering)
  - Storybook integration: `@storybook/test-runner` + screenshot mode

### Files to Delete
- None

## Implementation Steps
1. **Create `visual-mode.md`** reference file:
   - Section 1: Detection — find `*.visual.spec.ts` or `*.screenshot.spec.ts` files
   - Section 2: Configuration — expected `playwright.config.ts` settings for screenshots
   - Section 3: Execution — run visual tests, capture output
   - Section 4: Baseline Management — update baselines with `--update`
   - Section 5: Failure Analysis — read diff images, suggest fixes
   - Section 6: CI Notes — Docker, consistent fonts, viewport
2. **Update `test/SKILL.md`**:
   - Add `--visual` to flag override section
   - Add to Aspect Files table
   - Add visual test detection to auto-detection logic
3. **Add to skill-index.json** (if visual-mode is a new keyword entry)

## Todo List
- [ ] Create visual-mode.md reference
- [ ] Update test/SKILL.md with --visual flag
- [ ] Document Playwright screenshot config
- [ ] Document baseline update workflow
- [ ] Document CI integration

## Success Criteria
- `/test --visual` runs Playwright screenshot tests
- `/test --visual --update` updates baseline screenshots
- Visual test failures include diff image paths
- Reference covers both page-level and component-level (Storybook) screenshots

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Project may not have Playwright configured | Med | Skill detects missing config and suggests setup steps |
| Screenshot flakiness in CI | Med | Document threshold tuning and Docker config |
| Storybook not in every project | Low | Storybook section is optional; core is page-level |

## Security Considerations
- None identified

## Next Steps
- Consider adding visual regression to audit workflow (e.g., `/audit --ui` includes visual regression check)
