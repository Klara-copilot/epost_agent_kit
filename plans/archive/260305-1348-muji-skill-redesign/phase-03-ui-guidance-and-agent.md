# Phase 03: Create UI-Guidance Skill + Update Agent

## Context Links
- [Plan](./plan.md)
- [Phase 01](./phase-01-figma-and-tokens.md)
- [Phase 02](./phase-02-ui-lib-consolidation.md)
- `packages/design-system/agents/epost-muji.md`

## Overview
- Priority: P1
- Status: Pending
- Effort: 1h
- Description: Create new ui-guidance skill for integration consulting and design-code conflict resolution. Update muji agent definition with new skill set, description, and workflows.
- Dependencies: Phase 01, Phase 02

## Requirements

### Functional
- `ui-guidance` skill covers: integration consulting, design-code conflict resolution, implementation accuracy guidance
- Agent definition reflects cross-platform team identity
- Agent skills list updated to new names
- Two clear flows preserved: Library Development + Consumer Guidance

### Non-Functional
- Skill under 3KB
- Agent definition under 120 lines

## Related Code Files

### Files to Create
- `packages/design-system/skills/ui-guidance/SKILL.md` — Integration consulting and conflict resolution
- `packages/design-system/skills/ui-guidance/references/integration-patterns.md` — How to guide other teams
- `packages/design-system/skills/ui-guidance/references/design-code-conflicts.md` — Common conflicts and resolution strategies

### Files to Modify
- `packages/design-system/agents/epost-muji.md` — New skill list, updated description, updated flows
- `packages/design-system/package.yaml` — Add ui-guidance to provides.skills
- `packages/design-system/CLAUDE.snippet.md` — Update skill names in documentation section

## Implementation Steps

1. **Create ui-guidance skill**
   - SKILL.md frontmatter: name `ui-guidance`, platforms `[all]`, agent-affinity `[epost-muji]`
   - Trigger conditions: "how to use", "integrate component", "design doesn't match", "conflict between design and code"
   - Core content:
     - Integration consulting workflow (detect platform -> find component -> provide API + snippet + tokens)
     - Design-code conflict taxonomy (intentional drift, missing token, platform constraint, deprecated pattern)
     - Resolution decision tree
   - `references/integration-patterns.md`: Per-platform integration steps (ThemeProvider for web, Environment for iOS, CompositionLocal for Android)
   - `references/design-code-conflicts.md`: Common conflict types, root cause analysis, resolution templates

2. **Update muji agent definition**
   - Description: "Cross-platform design system team. Component development, Figma-to-code pipeline, token translation, integration consulting, UI audit."
   - Skills: `[core, skill-discovery, figma, design-tokens, ui-lib, ui-lib-dev, ui-guidance, audit]`
   - Flow 1 (Library Development): Update skill references to new names
   - Flow 2 (Consumer Guidance): Strengthen with ui-guidance skill, emphasize cross-platform
   - Remove references to `web-rag`, `ios-rag` (not Muji's responsibility; use skill-discovery if needed)
   - Platform Detection section: Keep as-is (already correct)

3. **Update package.yaml**
   - provides.skills: `[figma, design-tokens, ui-lib, ui-lib-dev, ui-guidance]`

4. **Update CLAUDE.snippet.md**
   - Design System section: update skill names

5. **Regenerate skill-index.json**
   - Run generate script or manually update entries
   - Verify connections graph: ui-lib-dev requires [ui-lib, figma], design-tokens requires [figma], ui-guidance enhances [ui-lib]

## Todo List
- [ ] Create ui-guidance/SKILL.md
- [ ] Create ui-guidance/references/integration-patterns.md
- [ ] Create ui-guidance/references/design-code-conflicts.md
- [ ] Update epost-muji.md agent definition
- [ ] Update package.yaml
- [ ] Update CLAUDE.snippet.md
- [ ] Regenerate skill-index.json
- [ ] Verify no broken references

## Success Criteria
- Muji agent loads 8 skills: core, skill-discovery, figma, design-tokens, ui-lib, ui-lib-dev, ui-guidance, audit
- ui-guidance skill has clear trigger conditions for integration consulting
- Agent description reflects cross-platform scope
- No references to old web-prefixed skill names anywhere in packages/design-system/
- skill-index.json has correct entries for all 5 design-system skills

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| ui-guidance overlaps with audit --ui | Low | ui-guidance = proactive consulting, audit = reactive review. Different triggers. |
| Too many skills pre-loaded on agent | Med | 8 skills is at the upper limit; ui-guidance is small |

## Security Considerations
- None identified

## Next Steps
- Run `epost-kit init` to regenerate `.claude/` from packages/
- Validate with `epost-kit verify` (if available)
