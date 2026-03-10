# Phase 01: Rename + Expand Figma and Design-Tokens Skills

## Context Links
- [Plan](./plan.md)
- `packages/design-system/skills/web-figma/SKILL.md`
- `packages/design-system/skills/web-figma-variables/SKILL.md`

## Overview
- Priority: P1
- Status: Pending
- Effort: 1.5h
- Description: Rename web-figma to figma (platform-neutral), expand web-figma-variables into design-tokens with iOS/Android token mapping

## Requirements

### Functional
- `figma` skill: same MCP tool reference, remove "web" prefix, add note that extraction is platform-neutral
- `design-tokens` skill: keep Vien 2.0 architecture, add references for iOS and Android token systems
- Token translation table: Figma variable -> CSS variable, Swift constant, Kotlin theme property

### Non-Functional
- Skills under 3KB each (references hold detail)
- Backward-compatible: update all refs to old skill names

## Related Code Files

### Files to Modify
- `packages/design-system/skills/web-figma/SKILL.md` -> rename dir to `figma/`, update frontmatter name
- `packages/design-system/skills/web-figma-variables/SKILL.md` -> rename dir to `design-tokens/`, expand scope
- `packages/design-system/package.yaml:provides.skills` -> update skill names

### Files to Create
- `packages/design-system/skills/design-tokens/references/web-tokens.md` — CSS var mapping (extract from current)
- `packages/design-system/skills/design-tokens/references/ios-tokens.md` — Swift constant/Environment mapping
- `packages/design-system/skills/design-tokens/references/android-tokens.md` — Compose theme/CompositionLocal mapping
- `packages/design-system/skills/design-tokens/references/translation-matrix.md` — Cross-platform token translation table

### Files to Delete
- None (rename, not delete)

## Implementation Steps

1. **Rename web-figma -> figma**
   - `mv packages/design-system/skills/web-figma/ packages/design-system/skills/figma/`
   - Update SKILL.md frontmatter: name, description, metadata.platforms to [all]
   - Remove web-specific language, keep MCP tool reference
   - Update references in other skills that say `web-figma`

2. **Rename web-figma-variables -> design-tokens**
   - `mv packages/design-system/skills/web-figma-variables/ packages/design-system/skills/design-tokens/`
   - Update SKILL.md: name, description, metadata.platforms to [all]
   - Keep existing Vien 2.0 architecture content
   - Add aspect file table entries for new platform references

3. **Create platform token references**
   - `references/web-tokens.md`: Extract CSS variable mapping from current content
   - `references/ios-tokens.md`: @Environment(\.epostTheme), EpostTheme.colors/typography/spacing in Swift
   - `references/android-tokens.md`: EpostTheme via CompositionLocal, MaterialTheme extension
   - `references/translation-matrix.md`: 3-column table (Figma -> Web -> iOS -> Android) for each token category

4. **Update package.yaml**
   - Replace `web-figma` with `figma`, `web-figma-variables` with `design-tokens`

5. **Update cross-references**
   - Grep for `web-figma` and `web-figma-variables` across all packages/
   - Update each reference to new name

## Todo List
- [ ] Rename web-figma dir to figma
- [ ] Update figma SKILL.md frontmatter and content
- [ ] Rename web-figma-variables dir to design-tokens
- [ ] Update design-tokens SKILL.md frontmatter and content
- [ ] Create references/web-tokens.md
- [ ] Create references/ios-tokens.md
- [ ] Create references/android-tokens.md
- [ ] Create references/translation-matrix.md
- [ ] Update package.yaml
- [ ] Grep + fix all cross-references

## Success Criteria
- `figma` skill loads without web assumption
- `design-tokens` skill has platform references for web, iOS, Android
- Token translation matrix covers colors, spacing, typography, components
- No broken references to old skill names

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Broken references to old names | High | Grep all packages/ before finalizing |
| iOS/Android token patterns inaccurate | Med | Mark as draft, validate with platform teams |

## Security Considerations
- None identified

## Next Steps
- Phase 02 depends on this (ui-lib references design-tokens)
