---
phase: 1
title: "Token efficiency — extract inline content to references"
effort: 1h
depends: []
---

# Phase 1: Token Efficiency — Extract Inline Content to References

## Context

- Plan: [plan.md](./plan.md)
- Depends on: none
- All 5 tasks are independent (different files)

## Files Owned

| File | Action |
|------|--------|
| `packages/a11y/skills/web-a11y/SKILL.md` | Remove inline Quick Reference code blocks |
| `packages/a11y/skills/web-a11y/references/web-aria.md` | Append ARIA quick ref content |
| `packages/a11y/skills/web-a11y/references/web-keyboard-focus.md` | Append keyboard/focus content |
| `packages/platform-web/skills/web-nextjs/SKILL.md` | Remove route structure ASCII tree |
| `packages/platform-web/skills/web-nextjs/references/routing.md` | Prepend route tree |
| `packages/platform-web/skills/web-forms/SKILL.md` | Extract all code blocks |
| `packages/platform-web/skills/web-forms/references/form-patterns.md` | Append extracted code blocks |
| `packages/platform-web/skills/web-i18n/SKILL.md` | Remove next-intl Quick Reference section |
| `packages/platform-web/skills/web-i18n/references/i18n-patterns.md` | Append quick reference content |
| `packages/platform-web/skills/web-frontend/SKILL.md` | Remove build commands section |

## Tasks

### A1 — web-a11y (136 -> ~90 lines)

- [ ] In `SKILL.md`: find the "Quick Reference" sections containing inline code blocks for ARIA labels, keyboard navigation, and React patterns
- [ ] Copy those code blocks to the appropriate reference files:
  - ARIA label patterns -> append to `references/web-aria.md` under a new `## Quick Reference` heading
  - Keyboard/focus patterns -> append to `references/web-keyboard-focus.md` under a new `## Quick Reference` heading
- [ ] In `SKILL.md`: replace the removed sections with one-line pointers: `See references/web-aria.md` and `See references/web-keyboard-focus.md`

### A2 — web-nextjs (115 -> ~90 lines)

- [ ] In `SKILL.md`: find the ASCII route structure tree (~20 lines starting with `app/`)
- [ ] Copy the full tree to `references/routing.md` — prepend under a `## Route Structure` heading (before existing content)
- [ ] In `SKILL.md`: replace with 2-line summary:
  ```
  Route structure follows `app/(locale)/(auth|public)/` pattern.
  See `references/routing.md` for full tree.
  ```

### A3 — web-forms (122 -> ~45 lines)

- [ ] In `SKILL.md`: identify all inline code blocks (Zod schema, form setup, API error mapping, ARIA error states, validation timing)
- [ ] Append each block to `references/form-patterns.md` under appropriate headings (check if heading exists first — append under existing or create new)
- [ ] In `SKILL.md`: keep ONLY the 4 Rules as inline text + a pointer to `references/form-patterns.md` for code examples
- [ ] Retain the frontmatter, description section, and rules section

### A4 — web-i18n (115 -> ~85 lines)

- [ ] In `SKILL.md`: find the `## next-intl Quick Reference` section (or similarly named)
- [ ] Append its content to `references/i18n-patterns.md` under a `## Quick Reference` heading
- [ ] In `SKILL.md`: replace with one-line pointer: `See references/i18n-patterns.md for next-intl API patterns.`

### A5 — web-frontend (97 -> ~85 lines)

- [ ] In `SKILL.md`: find the build commands section (~8 lines, contains `npm run dev`, `npm run build`, etc.)
- [ ] Remove it entirely — this content belongs in a dev guide, not a skill
- [ ] No need to move content elsewhere (noise removal, not extraction)

## Validation

After all edits:
```bash
wc -l packages/a11y/skills/web-a11y/SKILL.md  # target: < 100
wc -l packages/platform-web/skills/web-nextjs/SKILL.md  # target: < 100
wc -l packages/platform-web/skills/web-forms/SKILL.md  # target: < 55
wc -l packages/platform-web/skills/web-i18n/SKILL.md  # target: < 100
wc -l packages/platform-web/skills/web-frontend/SKILL.md  # target: < 90
```

## Success Criteria

- [ ] All 5 SKILL.md files reduced to target line counts
- [ ] Zero content lost — all extracted content exists in reference files
- [ ] Each SKILL.md has a pointer to the reference file where content moved
