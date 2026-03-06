# epost-researcher: Klara-Theme UI Conventions & Muji Developer Patterns

**Date**: 2026-03-06 06:25
**Agent**: epost-researcher
**Scope**: Conventions, patterns, and habits of a muji UI developer in klara-theme
**Status**: COMPLETE

---

## Executive Summary

klara-theme is a white-label React UI component library (~76 components) built on React 18 + TypeScript + Tailwind CSS + Radix UI primitives. Components follow a strict atomic module structure with co-located files, semantic token CSS variables threaded through Tailwind, and a design-driven `styling / mode / size / radius` prop vocabulary. The library is brand-agnostic: theme tokens inject at runtime via CSS custom properties; business logic is kept out via `ThemedBox`/`BrandedWrapper` wrappers. Smart Letter Composer (`src/lib/smart-letter-composer/`) is intentionally excluded — it is an AI-generated app-layer organism that does not represent library conventions.

---

## Findings

### 1. Component File Structure (Canonical Module Pattern)

Every component lives in its own directory under `src/lib/components/{component-name}/` and must contain:

```
component-name/
├── component-name.tsx          # Component logic (always 'use client')
├── component-name-styles.ts    # Style Maps/objects — NO inline Tailwind in component
├── component-name.stories.tsx  # Storybook stories
├── component-name.test.tsx     # Jest + RTL tests
├── component-name.figma.json   # Figma component metadata (MCP sync)
├── component-name.mapping.json # Figma-prop → React-prop mapping
├── index.ts                    # Barrel: export default + all named types
└── types.ts                    # (optional) separate type file for large APIs
```

Evidence: `button/`, `chip/`, `badge/`, `accordion/`, `tabs/`, `tooltip/` — all follow this exact structure. The `_example-component/` template canonicalizes it (missing `*-styles.ts` and `*.test.tsx` but has `.tsx`, `.stories.tsx`, `index.ts`).

**Compound components** split further: `accordion/` has `accordion.tsx` + `accordion-panel.tsx` + `accordion-panel-style.ts`, each independently exported.

### 2. Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Directory | kebab-case | `button/`, `text-field/`, `avatar-group/` |
| Component file | `{kebab}.tsx` | `button.tsx`, `text-field.tsx` |
| Styles file | `{kebab}-styles.ts` OR `{kebab}-style.ts` | `button-styles.ts`, `accordion-panel-style.ts` |
| Component function | PascalCase | `Button`, `TextField`, `AccordionPanel` |
| Props interface | `I{Name}Props` | `IButtonProps`, `IChipProps`, `IAccordionPanel` |
| Type alias | PascalCase | `ButtonStyling`, `ChipSize`, `TabsMode` |
| Const objects (variant maps) | `{COMPONENT}_{DIMENSION}` SCREAMING_SNAKE | `BUTTON_STYLES`, `CHIP_SIZES`, `BADGE_STYLING` |
| Export constant | `{COMPONENT}_{DIMENSION}` + `as const` | `BUTTON_STYLING`, `TABS_MODE`, `BADGE_STYLING` |
| displayName | Must be set | `Button.displayName = 'Button'` |

### 3. Props Interface Patterns

**Standard vocabulary** — every interactive component uses this specific prop set:

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `styling` | union type | `'primary'` or `'default'` | Visual variant (semantic) |
| `mode` | union type | `'solid'` or component-specific | Structural variant (solid/outline/ghost) |
| `size` | `'l' \| 'm' \| 's'` (sometimes xs/xxs) | `'m'` | Sizing |
| `radius` | `'primary' \| 'secondary'` | `'primary'` | Border radius variant |
| `className` | `string` | — | Consumer override (always accepted) |
| `id` | `string` | auto via `useId()` | Override auto-id |
| `disabled` | `boolean` | — | Disabled state |
| `inverse` | `true` | — | Inverse theme mode (boolean flag, not value) |

**Type export pattern**: Every interface AND derived types are exported from `index.ts`:
```ts
export { default as Button, BUTTON_STYLING } from './button';
export type { ButtonMode, ButtonSize, ButtonStyling, IButtonProps } from './button';
```

**JSDoc on every prop**: All props have `/** JSDoc */` with `@default`, `@param`, deprecated warnings inline. Deprecated props use `@deprecated` annotation AND warn in the JSDoc body what to use instead.

**`as const` pattern for variant enums**:
```ts
export const BUTTON_STYLING = {
  primary: 'primary',
  branded: 'branded',
  // ...
} as const;
export type ButtonStyling = (typeof BUTTON_STYLING)[keyof typeof BUTTON_STYLING];
```
This is used universally — no plain TypeScript `enum` in component code.

**Boolean flags vs value props**: Boolean feature flags use `prop?: true` (not `prop?: boolean`) unless the prop can be false meaningfully. e.g., `isBold?: true`, `inverse?: true`, `isFluidContent?: true`.

**Private/internal props**: Props intended for internal compound-component communication are prefixed with `_`: `_size`, `_expandedIcon`, `_mode`, `_themeUILabel`.

### 4. Composition Patterns

**Parent-passes-to-children via `React.cloneElement`** (Accordion):
```ts
const childrenWithProps = React.Children.map(props.children, child => {
  if (React.isValidElement(child)) {
    return React.cloneElement(child as React.ReactElement<IAccordionPanel>, {
      _size: size,
      _expandedIcon: expandedIcon,
      _mode: accordionMode,
    });
  }
});
```
Internal props (`_size`, `_expandedIcon`) signal they are set by parent, not consumer.

**Slot/render-prop pattern** (Dialog, Tooltip):
- Composed via named slot props: `dialogTrigger`, `dialogHeaderTitle`, `dialogFooter`, `dialogHeaderGraphic`
- `targetElement` prop for tooltip trigger

**Radix UI wrapping** (Accordion, Tabs, Avatar, Dialog, Tooltip): Radix primitives are wrapped with `asChild` and the component adds the `theme-ui-label` attribute + custom class logic. Radix ARIA/keyboard behavior is NOT overridden.

**`forwardRef` + `memo`** — used on performance-sensitive and input components (`Button` uses `forwardRef`, `TextField` uses `memo`, `Select` uses both):
```ts
const Select = memo(forwardRef(<T extends object | string>(props: ISelectProps<T>, ref: ForwardedRef<HTMLDivElement>) => { ... }));
```

### 5. Token & Variable Usage

**Two-tier CSS variable system**:
1. **Base tokens** — `--color-base-{semantic}` (defined globally, brand-agnostic fallback)
2. **Theme tokens** — `--color-theme-base-{semantic}` (overridden at runtime by ThemeProvider/BrandedWrapper)

Components ALWAYS use theme tokens (`--color-theme-base-*`), never base tokens directly.

**Tailwind maps CSS vars to utilities** in `tailwind-workspace-preset.js`:
```js
base: {
  background: { DEFAULT: 'var(--color-theme-base-background)', ... },
  foreground: { DEFAULT: 'var(--color-theme-base-foreground)', ... },
  'highlight-background': { DEFAULT: 'var(--color-theme-base-highlight-background)', ... },
}
```

**Semantic Tailwind classes in components**:
```ts
// button-styles.ts
['primary', 'bg-base-background-inverse text-base-foreground-inverse'],
['branded', 'bg-base-highlight-background text-base-highlight-foreground'],
['error', 'text-signal-on-error bg-signal-error'],
```
NO hex values or raw color references in component code.

**Size tokens**: NOT px values — theme-sized classes:
```ts
SIZE_STYLES = Map([['m', 'size-theme-m'], ['s', 'size-theme-s'], ...])
```
Component spacing: `px-size-padding`, `gap-size-spacing`, `p-200`, `px-300` (design token scale).

**Signal colors**: `signal-error`, `signal-success`, `signal-info`, `signal-warning` — semantic intent, not raw colors.

**Alternate alpha scale**: `alternate-30`, `alternate-100`, ..., `alternate-950` — opacity layer over theme colors.

### 6. Style File Architecture

Styles are co-located in `*-styles.ts`, always exported as named `const` objects:

**Pattern**: `Map<string, string>` for variant lookups; plain objects for structural styles:
```ts
// Variant map (mode × styling)
const BUTTON_MODE_SOLID = new Map<string, string>([
  ['primary', 'bg-base-background-inverse text-base-foreground-inverse'],
  ...
]);
const BUTTON_STYLES_MODE_MAP = new Map<string, Map<string, string>>([
  ['solid', BUTTON_MODE_SOLID],
  ['outline', BUTTON_MODE_OUTLINE],
  ['ghost', BUTTON_MODE_GHOST],
]);

// Structural styles (object)
const BUTTON_STYLES = {
  default: 'max-w-full ring-3 leading-normal h-size-container px-size-padding',
  primary: 'rounded',
  secondary: 'rounded-max',
};
```

`clsx()` is used everywhere for conditional class assembly. Never string concatenation.

**State layer** is shared utility, not per-component: `STATE_LAYER.default`, `STATE_LAYER_DEFAULT_MAP.get(compState)` — standardized hover/focus/pressed/disabled states across ALL components.

### 7. Business Isolation

**`BrandedWrapper`** — wraps a single React element to apply brand-specific CSS vars. Throws if children is Fragment or multiple elements. Consumer provides `brandName` + `themeMode`.

**`InverseWrapper`** — flips theme (light↔dark) for a subtree. Same single-child constraint.

**`ThemedBox`** — internal primitive both wrappers delegate to. Injects CSS vars directly on child element's style attribute via `ref`.

**`useThemeCssVariables(styling?)`** — hook used inside components (Tabs, Notification, Tooltip, Chip) that need to apply brand/inverse CSS vars inline when `styling='branded'` or `styling='inverse'`. Returns `CSSProperties` to spread on style prop.

**`setCSSVariablesInverse()`** utility — for Button's `inverse` prop, remaps CSS vars inline.

**Rule**: No business-specific state, API calls, or domain logic in klara-theme components. Components accept only UI-level props (labels, values, callbacks). Zero redux, zero fetchers.

### 8. `theme-ui-label` Attribute

Every component root element has `theme-ui-label="component-name"` as a custom HTML attribute. Used for:
- CSS targeting without polluting `className`
- Storybook inspection
- Accessibility/QA tooling hooks
- Compound component child identification

Internal/private elements use `_themeUILabel` prop override pattern.

### 9. Auto-ID Pattern

All components auto-generate an accessible `id` using `useId()` from React, with consumer override:
```tsx
const buttonId = useId();
// ...
<button id={rest.id || buttonId} ...>
```

### 10. Accessibility Patterns

- Radix UI handles ARIA + keyboard for complex primitives (Accordion, Tabs, Dialog, Avatar, Tooltip, DropdownMenu)
- `aria-label` derived from `label` prop or explicit `aria-label`: `const defaultAriaLabel = label ? label : props['aria-label']`
- `aria-invalid` passed to AccordionPrimitive for error state
- `aria-disabled` vs `disabled` used intentionally (Accordion uses `aria-disabled` to keep focusable)
- Focus ring standardized via `STATE_LAYER_DEFAULT_MAP`: `focus-visible:outline focus-visible:outline-focus focus-visible:outline-offset-4`
- Disabled state: `opacity-disabled pointer-events-none` (CSS token, not raw opacity)

### 11. `'use client'` Directive

ALL component files begin with `'use client'`. This is Next.js App Router compatibility — no component is assumed server-renderable since they use hooks, event handlers, and DOM APIs.

### 12. i18n / Locale

Built-in `useTranslations(type, customLocale?)` hook reads `document.documentElement.lang`. Default locale is `'de'` (German). Used in validation messages via `FieldValidator`.

### 13. Storybook Story Patterns

**Standard story structure**:
```ts
const meta: Meta<typeof Component> = {
  title: 'ComponentName',          // Flat or 'Category/Name'
  component: Component,
  tags: ['autodocs'],              // enables auto-generated docs
  parameters: { docs: { description: { component: '...' } } },
  decorators: [Story => <div className="p-200"><Story /></div>],
};
export const Base: Story = {
  argTypes: { /* full argType spec per prop */ },
  args: { /* all props set to undefined by default */ },
  parameters: { controls: { expanded: true } },
  render: (props) => <div className="p-300 bg-base-background"><Component {...props} /></div>,
};
```

- `argTypes` always specify `options`, `control`, `description`, `table.type.summary`, `table.defaultValue.summary`
- Inverse/branded stories wrap with themed background classes
- Internal props use `table.disable: true` in argTypes

### 14. Test Patterns

**Framework**: Jest + `@testing-library/react`. Files: `*.test.tsx`.

**Coverage exclusions** (per jest.config.ts): `*.test.tsx`, `*.stories.tsx`, `index.ts`, `*-styles.ts`, `showcase/**` — only component + hook logic is measured.

**Standard test coverage**:
- renders without crashing
- renders with each major prop combination
- disabled state
- click/interaction handlers
- custom className passes through
- accessibility attributes

```ts
describe('Button', () => {
  const defaultProps: IButtonProps = { size: 'm', label: 'Test Button' };
  it('renders without crashing', ...) 
  it('renders with leadingIcon', ...)
  it('calls onClick when clicked', ...)
  it('does not call onClick when disabled', ...)
  it('renders with custom className', ...)
});
```

### 15. Figma-to-Code Pipeline Artifacts

Every component (76 total) has:
- `*.figma.json` — component set node ID, Figma description, documentation links, variant axes with normalization rules
- `*.mapping.json` — Figma prop → React prop mapping with type, default, normalization notes

These are source-of-truth for the Figma MCP sync workflow. Updated via MCP tool, not manually.

### 16. What Smart Letter Composer Does Differently (Anti-Patterns to Exclude)

`src/lib/smart-letter-composer/` is an app-level organism, NOT a library component. Differences:
- No `*-styles.ts` co-location — inline styles/classes mixed in TSX
- Has `_constants/`, `_hooks/`, `_types/`, `_utils/` subdirectories (internal app structure)
- Has domain types (`ElementType`, `ScreenMode`, `ElementOption`) = business logic in component
- Has `CHANGELOG.md` and `SMART-LETTER-DEVELOPMENT.md` = separate lifecycle from library
- `smart-letter-app.tsx` = standalone app, not a reusable component
- No `*.figma.json` / `*.mapping.json` — not Figma-managed

**Rule**: Library components have NO domain types. If a type references a business entity (letter, email, survey), it belongs in the app, not the library.

---

## Patterns Summary Table

| Pattern | Convention | Violation Signal |
|---------|-----------|-----------------|
| File structure | 6-file module (tsx, styles, stories, test, figma.json, mapping.json, index.ts) | Missing files; test or stories absent |
| Naming | `I{Name}Props`, `{NAME}_STYLING as const` | `enum`, `type Props = {}`, missing `I` prefix |
| displayName | Always set | Missing `.displayName = 'Name'` |
| Props vocab | `styling / mode / size / radius / className / id / disabled / inverse` | Custom variant prop names not following this vocabulary |
| Color tokens | `bg-base-*`, `text-base-*`, `signal-*`, `alternate-*` | Raw hex, raw Tailwind color names (`bg-blue-500`) |
| Size tokens | `size-theme-{xs/s/m/l}`, `px-size-padding`, `gap-size-spacing` | Raw px values (`px-4`) for theme-managed dimensions |
| Style organization | All Tailwind in `*-styles.ts` via Maps + objects | Inline Tailwind strings in component body |
| `clsx` | Always used for conditional classes | Template literals, string concatenation |
| Accessibility | `theme-ui-label`, `useId()` auto-id, Radix primitives for a11y | Missing `theme-ui-label`, no id, rolling own keyboard handling |
| 'use client' | First line of every component | Missing directive |
| Business isolation | No domain types, no API calls, no state management | Redux imports, API calls, domain model types |
| Deprecated props | Kept with `@deprecated` + migration guidance in JSDoc | Silently removed, breaking changes without notice |

---

## Sources Analyzed

### Local Files

- `libs/klara-theme/docs/README.md` — documentation index, component catalog overview
- `libs/klara-theme/docs/architecture.md` — design system architecture, component structure, styling approach
- `libs/klara-theme/docs/technical.md` — tech stack, testing setup, build config
- `libs/klara-theme/docs/functions.md` — 76-component catalog with capabilities
- `libs/klara-theme/src/lib/components/_example-component/` — canonical template
- `libs/klara-theme/src/lib/components/button/` — full 7-file module reference implementation
- `libs/klara-theme/src/lib/components/chip/chip.tsx` — comprehensive variant/state handling
- `libs/klara-theme/src/lib/components/accordion/` — compound component + Radix wrapping
- `libs/klara-theme/src/lib/components/badge/badge.tsx` — simple display component pattern
- `libs/klara-theme/src/lib/components/dialog/dialog.tsx` — slot-based composition pattern
- `libs/klara-theme/src/lib/components/tooltip/tooltip.tsx` — Radix + floating-ui wrapping
- `libs/klara-theme/src/lib/components/tabs/tabs.tsx` — Radix tabs + size/styling/layout
- `libs/klara-theme/src/lib/components/select/select.tsx` — memo+forwardRef+generics
- `libs/klara-theme/src/lib/components/text-field/` — form input pattern + RHF integration
- `libs/klara-theme/src/lib/components/form/field-validator/` — RHF Controller wrapper
- `libs/klara-theme/src/lib/components/_utils/common-styles/` — shared SIZE_STYLES, inverse, theme-css-vars
- `libs/klara-theme/src/lib/components/_utils/state-layer/state-layer-styles.ts` — standardized interaction states
- `libs/klara-theme/src/lib/contexts/theme-provider/theme-provider.tsx` — runtime CSS var injection
- `libs/klara-theme/src/lib/components/branded-wrapper/` — brand isolation wrapper
- `libs/klara-theme/src/lib/components/inverse-wrapper/` — theme flip wrapper
- `libs/klara-theme/src/lib/components/_utils/themed-box/themed-box.tsx` — CSS var injection primitive
- `libs/klara-theme/src/lib/_constants/theme-constants.ts` — CSS variable prefix constants, THEME_MODE enum
- `libs/klara-theme/tailwind-workspace-preset.js` — Tailwind ↔ CSS variable mapping
- `libs/klara-theme/src/lib/components/button/button.figma.json` — Figma metadata schema
- `libs/klara-theme/src/lib/components/button/button.mapping.json` — Figma-to-React mapping schema
- `libs/klara-theme/src/lib/smart-letter-composer/` — excluded anti-pattern reference

### Internal Knowledge

- `/Users/than/Projects/epost_agent_kit/.claude/skills/web-ui-lib/references/` — prior documented component conventions

---

## Verdict

**ACTIONABLE** — Evidence base is strong and specific. All findings are verified against actual source code. The patterns are consistent across 10+ components examined.

---

*Unresolved questions:*
- `community-composer` is exported from `src/lib/index.ts` but not present in `src/lib/` directory — unclear if it follows library conventions or is app-layer like smart-letter-composer
- `date-picker-new/` exists alongside `date-picker/` — whether this is a migration in progress or permanent duplication is unclear
- No explicit TypeScript strict mode settings observed in examined files — strictness level not confirmed beyond "strict enabled" in docs
- `project-data.json` at library root — contents unknown; may contain component registry or Figma project IDs useful for audit tooling
