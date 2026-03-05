# Phase 02: Merge UI-Lib Skills + Expand UI-Lib-Dev

## Context Links
- [Plan](./plan.md)
- [Phase 01](./phase-01-figma-and-tokens.md)
- `packages/design-system/skills/web-ui-lib/SKILL.md`
- `packages/design-system/skills/web-ui-lib-dev/SKILL.md`

## Overview
- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Merge web-ui-lib into cross-platform ui-lib with platform references. Expand web-ui-lib-dev into cross-platform ui-lib-dev pipeline.
- Dependencies: Phase 01 (design-tokens must exist)

## Requirements

### Functional
- `ui-lib` skill: cross-platform component catalog with per-platform reference files
- `ui-lib-dev` skill: component development pipeline applicable to web, iOS, Android
- Platform-specific conventions (forwardRef for web, ViewModifier for iOS, @Composable for Android) in references

### Non-Functional
- Parent SKILL.md platform-neutral, references hold platform detail
- Preserve existing web content (move to references/web.md)

## Related Code Files

### Files to Modify
- `packages/design-system/skills/web-ui-lib/SKILL.md` -> rename dir to `ui-lib/`, generalize
- `packages/design-system/skills/web-ui-lib-dev/SKILL.md` -> rename dir to `ui-lib-dev/`, generalize
- `packages/design-system/package.yaml:provides.skills`

### Files to Create
- `packages/design-system/skills/ui-lib/references/web.md` — React/Next.js component catalog (from current web-ui-lib refs)
- `packages/design-system/skills/ui-lib/references/ios.md` — SwiftUI/UIKit component catalog
- `packages/design-system/skills/ui-lib/references/android.md` — Compose component catalog
- `packages/design-system/skills/ui-lib/references/integration.md` — Cross-platform integration patterns (from current web-ui-lib)
- `packages/design-system/skills/ui-lib-dev/references/web-pipeline.md` — Web-specific pipeline (from current refs)
- `packages/design-system/skills/ui-lib-dev/references/ios-pipeline.md` — iOS component dev pipeline
- `packages/design-system/skills/ui-lib-dev/references/android-pipeline.md` — Android component dev pipeline

### Files to Delete
- None (rename + restructure)

## Implementation Steps

1. **Rename web-ui-lib -> ui-lib**
   - Move dir, update frontmatter: name `ui-lib`, platforms `[all]`
   - Move existing web-specific content to `references/web.md`
   - Make SKILL.md a platform-neutral entry point with aspect file table
   - Keep existing `references/components.md`, `references/design-system.md` as shared cross-platform docs
   - Move `references/integration.md` and `references/contributing.md` as-is

2. **Create iOS and Android component references**
   - `references/ios.md`: SwiftUI View patterns, UIKit bridging, EpostTheme usage, preview conventions
   - `references/android.md`: @Composable patterns, state hoisting, EpostTheme via CompositionLocal, preview annotations

3. **Rename web-ui-lib-dev -> ui-lib-dev**
   - Move dir, update frontmatter: name `ui-lib-dev`, platforms `[all]`
   - Generalize pipeline overview (plan -> implement -> audit -> fix -> doc)
   - Move web-specific steps to `references/web-pipeline.md`
   - Update `connections.requires` from `[web-ui-lib, web-figma]` to `[ui-lib, figma]`

4. **Create platform pipeline references**
   - `references/ios-pipeline.md`: Xcode, SwiftUI previews, XCTest, Swift Package conventions
   - `references/android-pipeline.md`: Compose preview, @Composable testing, Detekt, Gradle conventions

5. **Update package.yaml and cross-references**

## Todo List
- [ ] Rename web-ui-lib dir to ui-lib
- [ ] Generalize ui-lib SKILL.md
- [ ] Move web content to references/web.md
- [ ] Create references/ios.md
- [ ] Create references/android.md
- [ ] Rename web-ui-lib-dev dir to ui-lib-dev
- [ ] Generalize ui-lib-dev SKILL.md
- [ ] Move web pipeline to references/web-pipeline.md
- [ ] Create references/ios-pipeline.md
- [ ] Create references/android-pipeline.md
- [ ] Update package.yaml
- [ ] Fix cross-references

## Success Criteria
- ui-lib SKILL.md is platform-neutral, loads platform detail from references
- ui-lib-dev pipeline works conceptually for all three platforms
- No references to old `web-ui-lib` or `web-ui-lib-dev` names

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| iOS/Android catalogs are sparse initially | Med | Mark as "seed" content, expand as team contributes |
| Existing web workflows break | High | Preserve all web content in references/web*.md |

## Security Considerations
- None identified

## Next Steps
- Phase 03 builds on this (ui-guidance references ui-lib)
