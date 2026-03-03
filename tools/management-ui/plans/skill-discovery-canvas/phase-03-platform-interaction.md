# Phase 03: Platform Selector & Interaction

## Context Links
- Parent plan: [plan.md](./plan.md)
- Depends on: [Phase 02](./phase-02-discovery-page.md)
- Related: `SkillChainResolver.ts` platform chains, `skill-discovery` protocol

## Overview
**Date**: 2026-03-03
**Priority**: P2
**Description**: Add platform selector that simulates "what if this agent works on iOS?" -- highlights the platform skill group and dims others. Shows the discovery decision path.
**Implementation Status**: Pending

## Key Insights
- `SkillChainResolver` already groups platform skills by platform name
- Platform detection in `skill-discovery` follows priority: explicit hint > file extensions > CWD path > project markers
- Selecting a platform should highlight that sector in the radial graph AND show which skills would load
- Multiple platforms could be selected to show overlap (shared skills like `a11y`)

## Requirements
### Functional
- Platform selector bar below header: buttons for [iOS, Android, Web, Backend, Design]
- Single-select: clicking platform highlights its sector, dims other platform sectors
- "All" button shows all platforms at equal opacity (default)
- When platform selected:
  - Platform sector skills at full opacity, bold edges
  - Other platform sectors at 0.2 opacity
  - Declared + Affinity layers unaffected (always visible)
  - Enhancers that enhance platform skills also highlighted
- Right panel updates: "Platform Detection" section shows which signals trigger this platform
  - File extensions, keywords, CWD patterns
  - Lists skills that would load with extends/requires chains
- Edge animation: when platform selected, animate edges from agent to platform skills (brief pulse)

### Non-Functional
- Platform toggle is instant (<50ms re-render)
- Animation uses CSS transitions, not JS timers

## Architecture

```
State: selectedPlatform: string | null

[INITIAL] ──(select "iOS")──▸ [PLATFORM_FOCUSED]
    │                              │
    │                          (select "All")
    │                              ▼
    └──────────────────────▸ [ALL_PLATFORMS]

Platform focus affects:
- Node opacity: focused platform = 1.0, others = 0.2
- Edge opacity: focused platform edges = 1.0, others = 0.15
- Right panel: shows platform-specific discovery path
```

## Related Code Files
### Modify (EXCLUSIVE)
- `app/canvas/discovery/page.tsx` -- Add platform state + selector bar [OWNED]
- `app/canvas/discovery/_components/DiscoveryCanvas.tsx` -- Apply platform focus opacity [OWNED]
- `app/canvas/discovery/_components/DiscoveryProtocolPanel.tsx` -- Platform-specific info [OWNED]

### Read-Only
- `lib/services/SkillChainResolver.ts` -- PlatformChain type, PLATFORM_SKILLS map
- `.claude/skills/skill-discovery/SKILL.md` -- Platform detection rules reference

## Implementation Steps

1. Add platform state to `page.tsx`:
   ```typescript
   const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
   ```

2. Render platform selector bar:
   ```typescript
   const platforms = ['ios', 'android', 'web', 'backend', 'design'];
   // Horizontal button group below header
   // Active platform has colored background, others outlined
   ```

3. Pass `selectedPlatform` to `DiscoveryCanvas`:
   - In `displayNodes` useMemo, set opacity based on platform:
     - If node is in Layer 2 and belongs to non-selected platform: opacity 0.2
     - If node is in Layer 3 and enhances a non-selected platform skill: opacity 0.2
   - In `displayEdges` useMemo, same opacity rules for edges

4. Update `DiscoveryProtocolPanel`:
   - When platform selected, expand "Platform Detection" section automatically
   - Show detection signals table:
     ```
     | Signal Type      | Values                    |
     |-----------------|---------------------------|
     | File extensions | .swift, .xcodeproj        |
     | Keywords        | "iOS", "Swift", "SwiftUI" |
     | CWD paths       | ios/, Sources/            |
     | Project markers | Package.swift             |
     ```
   - Show "Would load" list: platform skills + their extends/requires chain

5. Add brief edge pulse animation on platform change:
   - CSS keyframe: opacity 0.3 -> 1.0 over 300ms
   - Apply class to edges connecting to newly-highlighted platform skills

## Todo List
- [ ] Add selectedPlatform state to page
- [ ] Create platform selector button bar
- [ ] Implement platform focus opacity in canvas
- [ ] Update protocol panel with platform-specific detection info
- [ ] Add edge pulse animation on platform switch
- [ ] Test with each platform to verify correct skill groups

## Success Criteria
- Clicking "iOS" highlights ios-development, ios-ui-lib, ios-rag, ios-a11y
- Other platforms dim to 0.2 opacity
- Right panel shows iOS detection signals
- "All" returns to default equal opacity
- Transitions are smooth (CSS)

## Risk Assessment
**Risks**: Some skills span multiple platforms (e.g., `a11y` base). When highlighting iOS, should `a11y` be highlighted too?
**Mitigation**: If a platform skill has `loadedVia: { type: 'extends', from: 'a11y' }`, also highlight the parent. Trace the full dependency chain upward.

## Security Considerations
None.

## Next Steps
After completion:
1. Phase 04 adds skill sub-chain expansion on click
