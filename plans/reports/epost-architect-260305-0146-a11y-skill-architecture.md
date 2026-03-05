# A11y Skill Architecture Analysis

**Agent**: epost-architect | **Date**: 2026-03-05

## Question

Should `ios-a11y`, `android-a11y`, `web-a11y` be references under `a11y-wcag`, or separate skills? Should they live in their respective platform packages?

## Current State

```
packages/a11y/                          # Standalone package (layer 1)
  skills/
    a11y/SKILL.md                       # Unified /a11y command (router)
    a11y-wcag/SKILL.md                  # WCAG foundation (POUR, scoring, severity)
    ios-a11y/SKILL.md + 7 references    # iOS VoiceOver, UIKit, SwiftUI
    android-a11y/SKILL.md + 6 references # Android TalkBack, Compose, Views/XML
    web-a11y/SKILL.md + 6 references    # Web ARIA, keyboard, screen readers
    audit-a11y/SKILL.md + 2 references  # Audit workflow
    fix-a11y/SKILL.md + 2 references    # Fix workflow
    review-a11y/SKILL.md + 2 references # Review workflow
    audit-close-a11y/SKILL.md           # Close workflow
  agents/epost-a11y-specialist.md
```

Total: 9 skills, 1 agent, ~25 reference files.

## Analysis: Three Options

### Option A: Platform skills as references of a11y-wcag

```
a11y-wcag/
  SKILL.md
  references/
    ios-voiceover.md, ios-buttons.md, ...     # merge ios-a11y into references
    android-talkback.md, android-compose.md, ...
    web-aria.md, web-keyboard.md, ...
```

**Pros**: Single skill, simpler discovery
**Cons**: Massive references/ folder (~19 files). Agent loads ALL platform references even when only 1 platform needed. Violates KISS -- too much content per skill.

**Verdict: Bad.** Claude Code loads all references when a skill is activated. Loading 19 files when you only need iOS is wasteful and confusing.

### Option B: Separate skills in a11y package (CURRENT)

```
packages/a11y/
  skills/
    a11y-wcag/    # foundation
    ios-a11y/     # extends a11y-wcag
    android-a11y/ # extends a11y-wcag
    web-a11y/     # extends a11y-wcag
    audit-a11y/   # workflow
    fix-a11y/     # workflow
    review-a11y/  # workflow
```

**Pros**: Clean separation. `skill-discovery` loads only the needed platform skill. `extends: [a11y]` in frontmatter correctly chains foundation. Single package = single dependency to install.
**Cons**: Platform knowledge lives outside its platform package (ios-a11y in a11y/, not platform-ios/).

**Verdict: Good. This is correct for your architecture.**

### Option C: Platform a11y skills move to platform packages

```
packages/platform-ios/skills/ios-a11y/       # iOS a11y in iOS package
packages/platform-android/skills/android-a11y/ # Android a11y in Android package
packages/platform-web/skills/web-a11y/        # Web a11y in Web package
packages/a11y/skills/                         # Only a11y-wcag, audit, fix, review
```

**Pros**: Platform knowledge collocated with platform code.
**Cons**:
- Breaks the `a11y` package as a single installable unit
- Creates circular dependency: `a11y` depends on `core`, platform packages depend on `core`, but now `a11y` needs platform packages (or vice versa)
- `audit-a11y` and `fix-a11y` have platform-specific references (e.g. `references/ios-audit-mode.md`, `references/android-fix-mode.md`) -- where do THOSE go?
- Complicates install: user must install a11y + all platform packages to get full a11y

**Verdict: Bad. Creates dependency tangles and splits a cohesive domain.**

## Recommendation: Keep Option B (current architecture)

The current design is correct. Here is why:

1. **A11y is a cross-cutting concern, not a platform feature.** It spans iOS, Android, and Web with shared WCAG rules, shared scoring, shared data store. This justifies a dedicated package.

2. **`extends` chains work perfectly.** `ios-a11y extends a11y-wcag` means skill-discovery loads foundation first, then platform-specific. Only the needed platform is loaded.

3. **Workflow skills (audit/fix/review) need all platforms.** They dynamically dispatch to the correct platform skill based on file extensions. Splitting platform skills across packages would make this dispatch fragile.

4. **Single install = complete capability.** `dependencies: [core]` + installing the `a11y` package gives you everything. No need to coordinate 4 packages.

5. **Precedent**: `design-system` package also bundles cross-cutting skills (`web-figma`, `web-ui-lib`, `web-figma-variables`) rather than putting them in `platform-web`.

## One Improvement Suggestion

The `a11y` skill (router) and `a11y-wcag` skill (foundation) could be merged. Currently:
- `a11y` = command router (47 lines, just dispatches to audit/fix/review/close)
- `a11y-wcag` = WCAG foundation (109 lines, POUR framework, scoring, data store)

They are always co-loaded. Merging `a11y-wcag` content INTO `a11y` (as the main a11y skill with both routing and foundation) would reduce skill count by 1 without losing anything. The `extends: [a11y]` on platform skills already points to `a11y`, not `a11y-wcag`.

However, this is minor. The architecture is sound as-is.

## Summary

| Question | Answer |
|----------|--------|
| References of a11y-wcag? | No -- too many files, loads all platforms |
| Separate skills? | Yes (current) -- clean, selective loading |
| Move to platform packages? | No -- breaks single-install, creates dependency tangles |
| Current architecture correct? | Yes |
