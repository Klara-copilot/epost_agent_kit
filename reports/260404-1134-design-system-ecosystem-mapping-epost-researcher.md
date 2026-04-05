---
Date: 2026-04-04
Agent: epost-researcher
Scope: klara-theme / Vien 2.0 / epost design system ecosystem mapping
Status: COMPLETE
---

# Research: Design System Ecosystem Mapping for Planning

## Executive Summary

The epost design system (klara-theme + Vien 2.0 + platform themes) is a **4-layer, multi-brand variable system with 79 components across web, iOS, and Android**. The ecosystem is mature on the web (klara-theme) but fragmented on platform implementations. **7 major planning topics** need structured work: token sync across platforms, incomplete platform coverage, Figma-to-code pipeline gaps, token schema inconsistencies, motion/animation tokens missing, cross-platform parity assessment, and design-code documentation completeness.

---

## Ecosystem Scope

### Layer 1: Figma Design System (Source of Truth)
- **1,059 variables** across **42 collections**
- **4-layer architecture**: Primitives (505 vars) → Semantics (48 vars) → Platform (132 vars) → Components (200+ vars)
- **5 external brand libraries** with 2,064 remote references (28.3% of all refs)
- **200+ distinct modes** across collections (Info, Error, Success, Warning, size scales, component states, responsive, platform)
- **Token depth**: Max 11-hop reference chains from component down to brand settings
- **Multi-brand support**: Brand-agnostic architecture with `brandsettings.post.*` for ePost tenant theming

### Layer 2: Web Platform (klara-theme)
- **79 components** in `libs/klara-theme/src/lib/components/`
- **3-layer token system**: Primitives (SCSS) → Themes (light/dark) → Components (component-specific overrides)
- **Token export to Tailwind**: `tailwind-workspace-preset.js` bridges SCSS tokens to Tailwind CSS variables
- **Figma artifacts per component**: `.figma.json` (node mapping) + `.mapping.json` (prop-to-variant mapping)
- **Storybook coverage**: All 79 components have stories with `tags: ['autodocs']`
- **Test coverage**: Unit tests + integration tests via Jest + RTL
- **Documentation**: 9 KB registry (`docs/index.json`) with CONV/FEAT/ARCH entries

### Layer 3: iOS Platform (ios_theme_ui)
- **Repository**: `/Users/than/Projects/ios_theme_ui/`
- **Structure**: `Classes/` (Swift code) + `Resources/` (assets)
- **Token strategy**: Color system via `ios_theme_ui.h` (header-based constants)
- **Component coverage**: Minimal — some SwiftUI stubs exist but no parity with web
- **Documentation**: Empty `ios-ui-lib` skill (SKILL.md exists but `references/` has no content files)

### Layer 4: Android Platform (android_theme_ui)
- **Repository**: `/Users/than/Projects/android_theme_ui/` (Gradle project)
- **Token strategy**: Theme objects via `theme/` directory (Compose theme configuration)
- **Component coverage**: Minimal — theme structure in place but no component library
- **Documentation**: Empty `android-ui-lib` skill (SKILL.md exists but `references/` has no content files)

---

## Current Capability Assessment

| Area | Web | iOS | Android | Status |
|------|-----|-----|---------|--------|
| **Token system** | 3-layer SCSS ✓ | Color header partial | Theme objects partial | Fragmented |
| **Component library** | 79 components ✓ | ~5 stubs | 0 components | Web-only |
| **Figma integration** | MCP extraction ✓ | Manual only | Manual only | Web-only |
| **Design-code sync** | `.figma.json` + `.mapping.json` ✓ | None | None | Web-only |
| **Storybook** | Full coverage ✓ | None | None | Web-only |
| **Multi-brand support** | Via Figma layers | Not explored | Not explored | Not implemented |
| **Responsive tokens** | Via Tailwind modes ✓ | Static | Static | Web-only |
| **Semantic tokens** | Signal, Inverse, Additional ✓ | Color names hardcoded | Color names hardcoded | Web-only |
| **Animation tokens** | None (hardcoded) | None | None | **MISSING** |
| **Z-index tokens** | Hardcoded values | Not applicable | Not applicable | **MISSING** |
| **Mode support** | Light/dark + responsive | Light only | Light only | Incomplete |

---

## Planning Topics

### Topic 1: Vien 2.0 Platform Token Export & Cross-Platform Sync

**Current State**: Figma variables (1,059 total) are exported to web via 3-layer SCSS system. iOS/Android consume color values hardcoded in code or manually maintained.

**Gap**: No automated token generation pipeline for iOS/Android. Manual maintenance of color names, sizes, typography across platforms is error-prone.

**Scope for Planning**:
1. Audit existing iOS color system (`ios_theme_ui.h`) — map to Figma layers
2. Design Android theme token structure (Material 3 mapping)
3. Choose token export format (JSON, Swift enums, Kotlin data classes)
4. Implement Figma-to-platform token generation (likely separate from web pipeline)
5. Document token consumption patterns per platform
6. Establish sync frequency (manual, CI/CD, on-demand)

**Complexity**: High — requires understanding Figma export API, platform-specific token formats, and reference chain resolution.

**Related Files**: 
- Figma variables export: `packages/design-system/skills/design-tokens/figma-variables.json` (2.3 MB)
- Web token layer: `libs/klara-theme/src/lib/styles/_tokens/`
- Platform gaps: `packages/platform-ios/skills/ios-ui-lib/SKILL.md` (references empty)

---

### Topic 2: iOS Component Library Parity with klara-theme

**Current State**: 79 web components exist in klara-theme. iOS has ~5 component stubs. No design-to-code documentation.

**Gap**: iOS team lacks a reference component library to build against. Each component needs to be designed, tested, and documented independently.

**Scope for Planning**:
1. Prioritize which 79 components to implement on iOS (80/20 rule: core ~20 components cover 80% of use cases)
2. Define component structure (Swift files, SwiftUI preview, tests, documentation)
3. Plan Figma-to-SwiftUI pipeline (extract design from Figma, generate SwiftUI structs)
4. Create component documentation template (props, variants, accessibility notes)
5. Establish Storybook equivalent for iOS (SwiftUI Previews in Xcode)
6. Set up regression testing for visual consistency across updates

**Complexity**: Very High — requires design-to-code infrastructure, SwiftUI expertise, and cross-platform design parity validation.

**Related Files**:
- Web components: `libs/klara-theme/src/lib/components/` (79 dirs)
- iOS skill (empty refs): `packages/platform-ios/skills/ios-ui-lib/SKILL.md`
- Figma extraction: `packages/design-system/skills/figma/SKILL.md`

---

### Topic 3: Android Component Library & Compose Theme Implementation

**Current State**: Android theme structure exists (`android_theme_ui/theme/`). Zero component library.

**Gap**: No Compose component library. Theme tokens not aligned with Vien 2.0. No Material 3 design system mapping.

**Scope for Planning**:
1. Align Android theme with Vien 2.0 layers (map semantic tokens to Material 3 color system)
2. Define Android Material 3 theme structure (ColorScheme, Typography, Shapes)
3. Prioritize Compose components for implementation (same 20-component core as iOS)
4. Plan Figma-to-Compose code generation (Material 3-aware code output)
5. Create Compose Preview documentation (equivalent to Storybook)
6. Establish design-code validation (visual regression testing, layout consistency)

**Complexity**: Very High — requires Material Design 3 expertise, Compose framework knowledge, and Figma-to-Kotlin code generation.

**Related Files**:
- Android theme root: `android_theme_ui/theme/`
- Android skill (empty refs): `packages/platform-android/skills/android-ui-lib/SKILL.md`
- Vien 2.0 documentation: `packages/design-system/skills/design-tokens/`

---

### Topic 4: Figma-to-Code Pipeline Completion (Web, iOS, Android)

**Current State**: Web has partial Figma integration (component mapping via `.figma.json` + `.mapping.json`). iOS/Android have no integration.

**Gap**: 
- No automated component code generation from Figma designs
- No design-to-code validation (detect drifts)
- iOS/Android lack Figma extraction tooling
- Web pipeline limited to component mapping, not full design extraction

**Scope for Planning**:
1. Define end-to-end Figma-to-code pipeline per platform
   - Web: Enhance existing extraction to generate component code (React + Tailwind)
   - iOS: Build Figma extraction + SwiftUI code generation
   - Android: Build Figma extraction + Compose code generation
2. Implement Figma MCP tool suite (get_design_context, get_variable_defs, get_screenshot, get_metadata)
3. Create platform-specific code generation templates (Tailwind/SCSS for web, SwiftUI for iOS, Compose for Android)
4. Set up automated validation (screenshot → generated code visual comparison)
5. Document component extraction procedure per platform
6. Establish governance (who can update Figma, sync cadence, review process)

**Complexity**: Very High — requires Figma API expertise, code generation templating, multi-platform support.

**Related Files**:
- Figma skill: `packages/design-system/skills/figma/SKILL.md`
- Web extraction procedure: `packages/design-system/skills/figma/references/extraction-procedure.md`
- ui-lib-dev pipeline: `packages/design-system/skills/ui-lib-dev/SKILL.md`

---

### Topic 5: Design Token Schema Improvements & Consistency

**Current State**: Vien 2.0 has 8 named inconsistencies and 6 architectural complexities documented.

**Gap**:
- Variable naming mixes dots/dashes inconsistently (460 variables affected)
- 6 single-variable collections create namespace overhead
- "FIeld" typo in 24 variables
- Double-space naming in 4 tree-related collections
- Numbered vs ┈ prefix distinction unclear for 2 system-level collections
- 210 variables have repeated collections in reference chains
- Max chain depth is 11 hops (difficult to debug, costly for tooling)

**Scope for Planning**:
1. Formalize Vien 2.0 naming specification (dots = hierarchy, dashes = compound words)
2. Audit and fix all 8 inconsistencies (typos, spacing, naming)
3. Evaluate architectural improvements (flatten deep chains, split large collections, consolidate single-variable collections)
4. Create tooling to validate schema compliance (linting rules for Figma variables)
5. Document decision rationale (why 11 hops are necessary, why ┈ vs numbered distinction exists)
6. Plan migration path if schema changes (e.g., renaming "FIeld" to "Field")

**Complexity**: Medium — mostly documentation + Figma manual fixes, some potentially risky refactoring if changes are backwards-incompatible.

**Related Files**:
- Full analysis: `packages/design-system/skills/design-tokens/references/inconsistencies-improvements.md`
- Architecture deep-dive: `packages/design-system/skills/design-tokens/references/variables-architecture.md`

---

### Topic 6: Motion & Animation Tokens

**Current State**: No motion tokens exist in Vien 2.0. Web animations are hardcoded (CSS transitions). iOS/Android animations undefined.

**Gap**:
- No semantic animation tokens (duration, easing, delay)
- Animation decisions hardcoded in component styles
- No multi-brand animation variations
- No animation performance tokens (reduced motion support)
- No Figma token representation for motion (Figma has limited animation support)

**Scope for Planning**:
1. Design motion token system (duration, easing curve library, animation composition rules)
2. Add to Vien 2.0 (new collection: `17. Motion`? or `3. Additional / Motion`?)
3. Document animation implementation per platform (CSS animations for web, CABasicAnimation for iOS, ValueAnimator for Android)
4. Create animation design patterns (entrance, exit, state transition, data loading, error states)
5. Establish accessibility requirements (prefers-reduced-motion support)
6. Plan animation token export (CSS custom properties, Swift constants, Kotlin objects)

**Complexity**: Medium-High — requires animation expertise, requires cross-platform animation knowledge, may require Figma workarounds.

**Related Files**: None yet — new topic

---

### Topic 7: Z-Index & Stacking Context Strategy

**Current State**: Z-index values hardcoded in component styles. No system.

**Gap**:
- No semantic z-index tokens
- No stacking context documentation
- Difficult to predict which component overlays what
- No multi-brand z-index variations
- Risk of visual bugs when new components added

**Scope for Planning**:
1. Design z-index token system (layers: base/content/dropdown/modal/tooltip/etc.)
2. Map z-index values to component categories (button=1, input=10, tooltip=100, modal=1000, etc.)
3. Add to Vien 2.0 (new collection or extend existing token set)
4. Document stacking context rules (when to use each layer, how to override)
5. Create tooling to detect z-index conflicts (linting rule: warn if custom z-index used)
6. Plan export to iOS/Android (maybe not directly applicable, but document pattern per platform)

**Complexity**: Low-Medium — mainly organizational work, limited technical risk.

**Related Files**: None yet — new topic

---

### Topic 8: Cross-Platform Component Parity & Design-Code Validation

**Current State**: klara-theme has 79 web components with full Figma mapping. iOS/Android are empty. No validation system exists.

**Gap**:
- No definition of "component parity" (which components must exist, which are optional per platform)
- No design-code validation (screenshot → code comparison)
- No visual regression testing across platforms
- No definition of acceptable visual differences (font rendering, spacing, animation timing)
- Risk of undetected divergence between design and implementation

**Scope for Planning**:
1. Define component parity matrix (79 web components × iOS/Android × core/extended/future)
2. Create visual regression test infrastructure (Figma screenshot → implementation screenshot comparison)
3. Establish acceptance criteria (color tolerance ±5%, spacing ±1px, font rendering per OS)
4. Plan continuous validation (CI/CD check before component approval)
5. Document visual difference exceptions (animations not rendering in screenshots, platform-specific rendering)
6. Create audit report template (component, platform, status, drifts detected, action)

**Complexity**: High — requires multi-platform testing infrastructure, screenshot comparison tooling, visual diff analysis.

**Related Files**:
- klara-theme component list: `libs/klara-theme/src/lib/components/` (79 dirs)
- ui-lib-dev audit framework: `packages/design-system/skills/ui-lib-dev/references/audit-ui.md`

---

### Topic 9: Design System Documentation Completeness

**Current State**: klara-theme has structured docs (CONV/ARCH/FEAT/FINDING entries). iOS/Android skills exist but have no references.

**Gap**:
- iOS `ios-ui-lib/references/` empty (no components.md, no design-system.md)
- Android `android-ui-lib/references/` empty (no components.md, no design-system.md)
- No cross-platform token documentation (how iOS consumes Vien 2.0 tokens)
- No platform-specific design decision records (why iOS uses certain patterns, Android uses others)
- No Figma-to-code procedure for iOS/Android (only web has `extraction-procedure.md`)
- No multi-brand theming documentation for platforms

**Scope for Planning**:
1. Document iOS component library (create `references/components.md` with all 79 component specs adapted for SwiftUI)
2. Document Android component library (create `references/components.md` with all 79 component specs adapted for Compose)
3. Create iOS design system documentation (how colors/typography/spacing map from Vien 2.0 to SwiftUI)
4. Create Android design system documentation (how colors/typography/spacing map from Vien 2.0 to Material 3)
5. Add platform-specific Figma extraction procedures (iOS/Android versions of web extraction-procedure.md)
6. Document multi-brand support (how to switch themes, how to add new brands on each platform)

**Complexity**: Medium — mostly writing documentation, requires understanding both design intent and platform APIs.

**Related Files**:
- Web docs model: `libs/klara-theme/docs/index.json` + convention/architecture entries
- Empty iOS skill: `packages/platform-ios/skills/ios-ui-lib/SKILL.md`
- Empty Android skill: `packages/platform-android/skills/android-ui-lib/SKILL.md`

---

## Interconnection Map

```
Vien 2.0 (Figma Variables)
├── Topic 5: Token Schema ← Topic 6 (Motion) ← Topic 7 (Z-Index)
├── Topic 1: Token Export → iOS/Android platforms
│
├─→ Web Platform (klara-theme)
│   ├── Topic 4: Figma-to-Code (partial)
│   └── Topic 9: Documentation (complete)
│
├─→ iOS Platform
│   ├── Topic 1: Token Export (depends on)
│   ├── Topic 2: Component Library
│   ├── Topic 4: Figma-to-Code
│   ├── Topic 8: Parity Validation
│   └── Topic 9: Documentation
│
├─→ Android Platform
│   ├── Topic 1: Token Export (depends on)
│   ├── Topic 3: Component Library + Theme
│   ├── Topic 4: Figma-to-Code
│   ├── Topic 8: Parity Validation
│   └── Topic 9: Documentation
```

**Dependency Order** (if all topics needed):
1. **Topic 5** (Token Schema fixes) — prerequisite for clean export
2. **Topic 1** (Token Export) — prerequisite for iOS/Android
3. **Topic 6** (Motion Tokens) + **Topic 7** (Z-Index Tokens) — extend Vien 2.0 before export
4. **Topic 2** + **Topic 3** (Component Libraries) — can happen in parallel
5. **Topic 4** (Figma-to-Code) — depends on platforms being ready
6. **Topic 8** (Parity Validation) — post-implementation, validates parity
7. **Topic 9** (Documentation) — can happen in parallel with implementation

---

## Artifact Inventory

### Vien 2.0 (Figma)
- Figma variables export (JSON): `packages/design-system/skills/design-tokens/figma-variables.json` (2.3 MB)
- Architecture analysis: `packages/design-system/skills/design-tokens/references/variables-architecture.md` (11 KB)
- Inconsistencies report: `packages/design-system/skills/design-tokens/references/inconsistencies-improvements.md` (14 KB)
- Platform token mapping: `packages/design-system/skills/design-tokens/references/platform-token-mapping.md`

### Web Platform (klara-theme)
- Component directory: `libs/klara-theme/src/lib/components/` (79 components)
- Token layers: `libs/klara-theme/src/lib/styles/_tokens/` (1_primitives, 2_themes, 3_components)
- Tailwind preset: `libs/klara-theme/tailwind-workspace-preset.js`
- Documentation registry: `libs/klara-theme/docs/index.json` (9 KB)
- Conventions: `libs/klara-theme/docs/conventions/` (CONV-0001 through CONV-0007)
- Figma extraction: `packages/design-system/skills/figma/references/extraction-procedure.md`

### iOS Platform (ios_theme_ui)
- Repository: `/Users/than/Projects/ios_theme_ui/`
- Color system: `ios_theme_ui/Classes/` (Swift header-based)
- Skill references: Empty — `packages/platform-ios/skills/ios-ui-lib/references/`

### Android Platform (android_theme_ui)
- Repository: `/Users/than/Projects/android_theme_ui/`
- Theme structure: `android_theme_ui/theme/` (Compose theme)
- Skill references: Empty — `packages/platform-android/skills/android-ui-lib/references/`

---

## Known Gaps & Risks

| Topic | Gap | Risk | Mitigation |
|-------|-----|------|-----------|
| Token Export | No iOS/Android export pipeline | Manual maintenance, sync drift | Topic 1 planning |
| iOS Components | 79 target, ~5 exist | Incomplete library, slower dev | Topic 2 planning |
| Android Components | 0 exist | Blocked: no theme, no components | Topic 3 planning |
| Figma-to-Code | Web partial, iOS/Android none | Manual code generation, human error | Topic 4 planning |
| Token Schema | 8 inconsistencies, 6 complexities | Tooling failures, developer confusion | Topic 5 planning |
| Motion | No tokens or system | Hardcoded animations, not themeable | Topic 6 planning |
| Z-Index | No tokens or system | Visual z-fighting bugs, unpredictable | Topic 7 planning |
| Parity | No validation system | Undetected design-code divergence | Topic 8 planning |
| Docs | iOS/Android skills empty | Incomplete onboarding, knowledge loss | Topic 9 planning |

---

## Unresolved Questions

1. **Multi-brand scope**: Should iOS/Android support multi-brand theming immediately, or phase it in after single-brand libraries are complete?
2. **Token export format**: Should iOS consume Figma tokens as Swift enums, structs, or protocol implementations? Should Android use Kotlin data classes or Compose Material 3 ColorScheme?
3. **Animation tokens**: Should animations be defined in Figma (despite limited support) or in platform code with design system naming conventions?
4. **Z-index scope**: Is z-index a web-only concern, or should iOS/Android document analogous layer/stacking context patterns?
5. **Component parity**: Is 100% parity required, or can platforms have platform-specific components (e.g., iOS-only floating action buttons)?
6. **Visual validation tolerance**: What are the acceptable pixel/color tolerances for visual regression tests across platforms (font rendering, DPI scaling, color space differences)?
7. **Figma-to-code automation**: Should code generation be fully automated (extract → generate → PR) or semi-automated (extract → generate → human review)?
8. **Storybook equivalent**: Should iOS/Android use Xcode Previews + SwiftUI Preview Library, or a separate UI catalog tool?

---

## Sources

- **Vien 2.0 System**: `packages/design-system/skills/design-tokens/` (SKILL.md + references)
- **klara-theme Components**: `libs/klara-theme/src/lib/components/` (79 dirs) + `docs/index.json`
- **Figma Integration**: `packages/design-system/skills/figma/SKILL.md` + `ui-lib-dev/SKILL.md`
- **iOS Theme**: `/Users/than/Projects/ios_theme_ui/` + `packages/platform-ios/skills/ios-ui-lib/SKILL.md`
- **Android Theme**: `/Users/than/Projects/android_theme_ui/` + `packages/platform-android/skills/android-ui-lib/SKILL.md`
- **Inconsistencies Analysis**: `packages/design-system/skills/design-tokens/references/inconsistencies-improvements.md`
- **Architecture Analysis**: `packages/design-system/skills/design-tokens/references/variables-architecture.md`

---

**Verdict**: `ACTIONABLE` — All 9 topics are well-defined with clear gaps and artifact locations. Ready for planning phases.
