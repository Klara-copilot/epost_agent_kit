---
name: cross-platform-consistency
description: Cross-platform parity checks for UI components audited across web, iOS, and Android
---

# Cross-Platform Consistency Checks

Run these checks when auditing `--platform all` or when comparing multiple platforms.

## 1. Naming Parity

| Check | Expected |
|-------|----------|
| Component name | Same on all platforms with `Epost*` prefix: `EpostButton`, `EpostCard`, `EpostInput` |
| Variant names | Same labels: `primary`, `secondary`, `ghost`, `destructive` — not `filled`/`outlined`/`danger` |
| State names | Same: `disabled`, `loading`, `error` — not `inactive`/`busy`/`invalid` |

**Flag**: If web has `variant="primary"` but iOS has `style: .filled` — `CROSS-NAME-001` (medium).

## 2. API Shape Parity

Props/parameters for equivalent concepts must match across platforms:

| Concept | Web (prop) | iOS (param) | Android (param) |
|---------|-----------|-------------|-----------------|
| Visual variant | `variant` | `variant` | `variant` |
| Disabled state | `disabled` | `isDisabled` → align to `disabled` | `enabled = false` → note difference |
| Loading state | `isLoading` | `isLoading` | `isLoading` |
| Icon slot | `leadingIcon` | `leadingIcon` | `leadingIcon` |
| Custom styling | `className` | `modifier` (ViewModifier) | `modifier` (Modifier) |
| Click handler | `onClick` | `action` → align to `onTap` | `onClick` |

**Flag CROSS-API-001** (medium) when a platform uses a substantially different name for the same concept without documented justification.

**Note**: Platform-idiomatic differences are acceptable (e.g., `Modifier` is Android-only) — flag only semantic divergences.

## 3. Token Coverage Parity

Every semantic token used on one platform must have a counterpart on all platforms:

| Token Concept | Web | iOS | Android |
|--------------|-----|-----|---------|
| Primary color | `var(--epost-color-primary)` | `theme.colors.primary` | `EpostTheme.colors.primary` |
| Error color | `var(--epost-color-error)` | `theme.colors.error` | `EpostTheme.colors.error` |
| Surface/card bg | `var(--epost-color-surface)` | `theme.colors.surface` | `EpostTheme.colors.surface` |
| Body text | typography token | `theme.typography.body` | `EpostTheme.typography.body` |
| Spacing md (16) | `spacing-4` / theme spacing | `theme.spacing.md` | `EpostTheme.spacing.md` |

**Flag CROSS-TOKEN-001** (high) if a component on one platform hardcodes a value that's a semantic token on another platform.

## 4. Variant Parity

If one platform implements 4 variants, all platforms should implement the same 4 unless there's a documented platform exception.

| Variant | Web | iOS | Android |
|---------|-----|-----|---------|
| primary | ✓ required | ✓ required | ✓ required |
| secondary | ✓ required | ✓ required | ✓ required |
| ghost/text | ✓ required | ✓ required | ✓ required |
| destructive | ✓ required | ✓ required | ✓ required |

**Flag CROSS-VARIANT-001** (medium) for missing variants on any platform.

## 5. Behavior Parity

| Behavior | Expected Consistency |
|----------|---------------------|
| Disabled appearance | Reduced opacity (≈40%) on all platforms |
| Loading state | Activity indicator replaces/overlays label on all platforms |
| Press/hover feedback | Platform-appropriate (ripple on Android, opacity/scale on iOS, :hover/:active on web) |
| Error display | Same pattern: inline message below field on all platforms |

**Flag CROSS-BEHAV-001** (low-medium) for divergent interaction patterns without justification.

## 6. Accessibility Parity

| A11y concept | Web | iOS | Android |
|-------------|-----|-----|---------|
| Label for screen reader | `aria-label` | `accessibilityLabel` | `contentDescription` |
| Role declaration | `role="button"` | `.accessibilityAddTraits(.isButton)` | `semantics { role = Role.Button }` |
| Disabled state announced | `aria-disabled="true"` | `.accessibilityValue("Disabled")` | `semantics { disabled() }` |

**Flag CROSS-A11Y-001** (high) if a platform is missing an a11y feature that others implement.

## How to Report Cross-Platform Issues

Use the `crossPlatformNotes` array in the audit report (see `audit-report-schema.md`):

```json
{
  "id": "CROSS-API-001",
  "severity": "medium",
  "issue": "iOS uses `isDisabled` but web uses `disabled` for the same prop",
  "platforms": ["web", "ios"],
  "expected": "Align to `disabled` on both platforms",
  "mentoring": "Consistent API naming reduces cognitive load for developers working across platforms. Choose one name and document the decision."
}
```
