# Phase 02: Platform Checklists

## Context Links
- Parent plan: [plan.md](./plan.md)
- Phase 01: [phase-01-core-skill-schema.md](./phase-01-core-skill-schema.md)
- iOS tokens: `packages/platform-ios/skills/ios-ui-lib/references/design-system.md`
- Android tokens: `packages/platform-android/skills/android-ui-lib/references/design-system.md`
- Web audit: `packages/design-system/skills/web-ui-lib-dev/references/audit-ui.md`

## Overview
**Date**: 2026-03-04
**Priority**: P1
**Description**: Create platform-specific audit checklists and cross-platform consistency reference.
**Implementation Status**: Pending

## Parallelization Info
- **Execution Batch**: Batch 2 (3 files can be written in parallel)
- **Can Run Parallel With**: checklist-web, checklist-ios, checklist-android can all run in parallel
- **Blocked By**: Phase 01 (schema must exist first)
- **Blocks**: Phase 03
- **Exclusive Files**:
  - `packages/design-system/skills/audit-ui-component/references/checklist-web.md` (Create)
  - `packages/design-system/skills/audit-ui-component/references/checklist-ios.md` (Create)
  - `packages/design-system/skills/audit-ui-component/references/checklist-android.md` (Create)
  - `packages/design-system/skills/audit-ui-component/references/cross-platform-consistency.md` (Create)

## Key Insights

- Each platform has distinct token access patterns, component conventions, and tooling
- Web: 3-layer token system (primitives > themes > components), forwardRef, CSS vars
- iOS: SwiftUI Environment tokens, View protocol, @Environment property wrapper
- Android: CompositionLocal tokens, @Composable, Material 3 foundation
- Cross-platform: same semantic tokens (primary, secondary, spacing scale), same component names (EpostButton, EpostCard), same variant names (.primary, .secondary, .ghost)

## Requirements

### Functional
- Each checklist: 6 categories (tokens, patterns, performance, security, a11y, testing)
- Each check item: ID, description, severity-if-violated, code example (good vs bad)
- Cross-platform: API shape parity, naming consistency, token coverage parity

### Non-Functional
- Each checklist < 150 lines
- Good/bad code examples must be realistic (use actual token APIs from design-system refs)
- No duplication between checklists -- shared concepts reference cross-platform-consistency.md

## Architecture

Each checklist follows same structure:
```markdown
# Checklist: {Platform}
## Tokens
## Patterns
## Performance
## Security
## Accessibility
## Testing
```

Each check item:
```markdown
### {ID}: {Title}
- **Severity**: high
- **Bad**: `hardcoded value example`
- **Good**: `token-based example`
- **Why**: mentoring explanation
```

## Related Code Files

### Create (EXCLUSIVE)
- `packages/design-system/skills/audit-ui-component/references/checklist-web.md` [OWNED]
- `packages/design-system/skills/audit-ui-component/references/checklist-ios.md` [OWNED]
- `packages/design-system/skills/audit-ui-component/references/checklist-android.md` [OWNED]
- `packages/design-system/skills/audit-ui-component/references/cross-platform-consistency.md` [OWNED]

### Read-Only (shared)
- `packages/platform-ios/skills/ios-ui-lib/references/design-system.md`
- `packages/platform-ios/skills/ios-ui-lib/references/components.md`
- `packages/platform-android/skills/android-ui-lib/references/design-system.md`
- `packages/platform-android/skills/android-ui-lib/references/components.md`
- `packages/design-system/skills/web-ui-lib/references/design-system.md`
- `packages/design-system/skills/web-ui-lib-dev/references/audit-ui.md`

## Implementation Steps

### checklist-web.md
1. Tokens: no hardcoded colors/spacing/typography. Use CSS vars or SCSS tokens from 3-layer system. Check `var(--epost-*)` usage.
2. Patterns: forwardRef + displayName, TypeScript strict, props interface exported, default exports avoided, className via cn() utility
3. Performance: no inline object/function creation in render, memoization where needed, no unnecessary re-renders, bundle size awareness
4. Security: no dangerouslySetInnerHTML without sanitization, no eval, XSS-safe string interpolation
5. A11y: ARIA roles, keyboard navigation, focus management, color contrast via tokens
6. Testing: Jest + RTL tests exist, test user behavior not implementation, stories for all variants

### checklist-ios.md
1. Tokens: all via `@Environment(\.epostTheme)`, no hardcoded Color/Font/CGFloat for themed values
2. Patterns: SwiftUI View struct, body computed property, extract subviews for readability, use ViewModifier for reusable styling, naming matches Epost* prefix
3. Performance: avoid heavy computation in body, use @State/@Binding correctly, lazy stacks for lists, no force unwraps
4. Security: no hardcoded URLs/keys, validate user input, use SecureField for passwords
5. A11y: accessibilityLabel, accessibilityHint, accessibilityValue, dynamic type support, VoiceOver testing
6. Testing: XCTest unit tests, preview providers for visual verification

### checklist-android.md
1. Tokens: all via `EpostTheme.colors/typography/spacing`, no hardcoded dp/sp/Color values
2. Patterns: @Composable function (not class), stateless where possible (state hoisting), Modifier parameter as first default, naming matches Epost* prefix
3. Performance: avoid allocations in composition, use remember/derivedStateOf, stable parameters for skipping recomposition, no side effects in composition
4. Security: no hardcoded secrets, validate input, safe WebView config if applicable
5. A11y: contentDescription, semantics, touch target min 48dp, TalkBack testing
6. Testing: Compose UI test rule, semantics assertions, state-based testing

### cross-platform-consistency.md
1. API shape: same prop/parameter names where possible (style, variant, size, disabled)
2. Naming: Epost* prefix on all platforms, same component names
3. Token coverage: if web has `theme.colors.error`, iOS and Android must too
4. Variant parity: same set of variants across platforms (primary, secondary, ghost)
5. Behavior parity: same interaction patterns (press states, disabled appearance)

## Todo List
- [ ] Create checklist-web.md with 6 categories + good/bad examples
- [ ] Create checklist-ios.md with 6 categories + good/bad examples
- [ ] Create checklist-android.md with 6 categories + good/bad examples
- [ ] Create cross-platform-consistency.md with parity checks

## Success Criteria
- Each checklist has concrete code examples using actual token APIs
- No hardcoded platform paths in checklists (use token API names only)
- Cross-platform doc identifies what must match and what can differ

## Risk Assessment
**Risks**: Checklists become stale as platform conventions evolve
**Mitigation**: Add staleness warning header with last-verified date; audit workflow includes RAG cross-check step

## Security Considerations
- Security checklist items catch common vulnerabilities per platform
- Web: XSS, CSRF. iOS: keychain misuse, ATS. Android: exported components, WebView
