---
name: a11y/android
description: WCAG 2.1 AA accessibility rules for Android — Jetpack Compose contentDescription, touch targets, TalkBack, focus semantics, color contrast
user-invocable: false
---

# Android Accessibility Skill

## Purpose

WCAG 2.1 AA accessibility rules for Android development using Jetpack Compose. Covers TalkBack support, content descriptions, touch target sizing, focus semantics, heading structure, and color contrast — all using modern Compose/Material3 APIs.

## Aspect Files

| File | Coverage |
|------|----------|
| `references/android-content-descriptions.md` | contentDescription for images, icons, custom composables — meaningful vs decorative |
| `references/android-touch-targets.md` | 48×48dp minimum, MinimumTouchTargetSize, Box padding patterns |
| `references/android-focus-semantics.md` | mergeDescendants, stateDescription, traversalIndex, clearAndSetSemantics |
| `references/android-headings.md` | heading() semantic, hierarchy, TalkBack heading navigation |
| `references/android-contrast.md` | WCAG contrast ratios, MaterialTheme, dark mode, dynamic color, testing tools |

## Fix Templates

| Template ID | Violation | Fix |
|-------------|-----------|-----|
| `add_content_description` | Image/Icon missing contentDescription | Add `contentDescription = "..."` to Image or Icon |
| `make_decorative` | Decorative image incorrectly announced | Set `contentDescription = null` on Image or Icon |
| `add_touch_target` | Tap target smaller than 48×48dp | Wrap in Box with `Modifier.sizeIn(minWidth = 48.dp, minHeight = 48.dp)` |
| `add_heading_semantic` | Section title not marked as heading | Add `Modifier.semantics { heading() }` |
| `add_state_description` | Custom toggle/state without state announcement | Add `Modifier.semantics { stateDescription = "..." }` |
| `other_manual` | Complex semantic issue requiring human judgment | Flag for manual review — no automated fix |

## Key Compose Accessibility APIs

| API | Purpose | Example |
|-----|---------|---------|
| `contentDescription` | Announce element to TalkBack | `Image(contentDescription = "Profile photo")` |
| `Modifier.semantics { }` | Override or extend semantic properties | `Modifier.semantics { stateDescription = "Selected" }` |
| `mergeDescendants = true` | Group child semantics into single node | Groups icon + label into one TalkBack announcement |
| `stateDescription` | Describe current toggle/checkbox state | `"Checked"` / `"Unchecked"` for custom controls |
| `heading()` | Mark text as section heading | Enables TalkBack heading navigation |
| `clearAndSetSemantics { }` | Replace all child semantics | Full control over composite composable announcements |
| `traversalIndex` | Custom TalkBack focus order | `semantics { traversalIndex = 0f }` — lower = earlier |

## Touch Target Minimum

All interactive composables (buttons, checkboxes, icon buttons, clickable rows) must meet the **48×48dp minimum** touch target. Material3 enforces this by default for standard components. Custom composables require explicit sizing.

## Related Documents

- `a11y/core` — POUR framework, severity scoring, operating modes
- `packages/a11y/skills/ios/accessibility/SKILL.md` — iOS equivalent skill
