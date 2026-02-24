---
title: "Fix: UI"
description: (ePost) Fix UI/layout issues
agent: epost-debugger
argument-hint: [UI issue description]
---

# Fix UI/Layout Issues

Direct UI fix — skip auto-detection, debug visual/layout problems.

<issue>$ARGUMENTS</issue>

## Process

1. **Reproduce** — identify the UI issue (screenshot, browser DevTools, description)
2. **Identify root cause** — inspect CSS, component structure, state management
3. **Fix** — apply the minimal correct fix (CSS, component logic, or layout)
4. **Check a11y** — verify the fix doesn't break accessibility (contrast, focus, ARIA)
5. **Cross-browser** — verify fix works across target browsers if applicable

## Rules

- Fix root causes, not symptoms
- Check accessibility impact of all UI changes
- Prefer CSS fixes over JavaScript workarounds
- Test responsive behavior if layout is affected
