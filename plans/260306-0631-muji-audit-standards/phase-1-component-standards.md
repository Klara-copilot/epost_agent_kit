---
phase: 1
title: "Component Authoring Guide in klara-theme docs/"
effort: 1h
depends: []
---

# Phase 1: Component Authoring Guide (Project Level)

## Objective

Create `luz_next/libs/klara-theme/docs/component-guide.md` — the canonical, human-readable guide for anyone building a klara-theme component. Written as prescriptive guidance (DO / DON'T), no rule IDs or severity scores.

## Tasks

### TODO: Create component-guide.md in klara-theme

**File**: `/Users/than/Projects/luz_next/libs/klara-theme/docs/component-guide.md`

Structure:

```markdown
# klara-theme Component Authoring Guide

Reference for anyone building a component in this library. Covers structure, props, tokens, business isolation, accessibility, and testing.

---

## 1. Component Structure

Every component lives in its own directory under `src/lib/components/{kebab-name}/`.

**Required files (all 7 mandatory):**
- `{name}.tsx` — component implementation
- `{name}-styles.ts` — all Tailwind class strings
- `{name}.stories.tsx` — Storybook stories with `tags: ['autodocs']`
- `{name}.test.tsx` — unit tests
- `{name}.figma.json` — Figma node mapping
- `{name}.mapping.json` — prop-to-Figma mapping
- `index.ts` — barrel export

**DO:** `src/lib/components/button/button.tsx`
**DON'T:** `src/lib/Button.tsx` (wrong location, wrong casing)

Compound components: split each sub-component into its own `.tsx` + `-styles.ts` pair.

## 2. Props & Naming

**Interface naming:** `I{PascalName}Props`
```ts
// DO
interface IButtonProps { ... }
// DON'T
interface ButtonProps { ... }
```

**Standard vocabulary** — always use these names for these concepts:
| Concept | Prop name |
|---------|-----------|
| visual style/variant | `styling` |
| fill mode | `mode` (solid/outline/ghost) |
| size | `size` (s/m/l) |
| corner radius | `radius` (primary/secondary) |
| custom class | `className` |
| element id | `id` |
| disabled state | `disabled` |
| inverted theme | `inverse` |

**DON'T** use `variant`, `type`, `kind` for the above — they break library consistency.

**Variant constants:**
```ts
// DO
export const BUTTON_STYLING = { primary: 'primary', secondary: 'secondary' } as const
export type ButtonStyling = (typeof BUTTON_STYLING)[keyof typeof BUTTON_STYLING]
// DON'T
enum ButtonStyling { primary, secondary }
```

**Boolean flags** — use `?: true` not `?: boolean` when only the truthy case is meaningful:
```ts
inverse?: true   // DO
inverse?: boolean  // DON'T
```

**Internal props** — prefix with `_`:
```ts
_themeUILabel?: string  // internal, not part of public API
```

**JSDoc every prop:**
```ts
/** Visual style of the button. @default 'primary' */
styling?: ButtonStyling
```

## 3. Tokens & Styling

**The golden rule: ALL Tailwind class strings go in `{name}-styles.ts`, never in the component body.**

```ts
// {name}-styles.ts — DO
export const buttonStyles = {
  base: 'inline-flex items-center font-medium',
  size: new Map([
    ['s', 'px-size-padding-xs text-sm'],
    ['m', 'px-size-padding-sm text-base'],
    ['l', 'px-size-padding-md text-lg'],
  ]),
  styling: new Map([
    ['primary', 'bg-base-background-brand text-base-content-on-brand'],
    ['secondary', 'bg-base-background-inverse text-base-content-inverse'],
  ]),
}
```

```tsx
// {name}.tsx — DO
import { buttonStyles } from './button-styles'
const classes = clsx(buttonStyles.base, buttonStyles.size.get(size), ...)
// DON'T
const classes = clsx('inline-flex items-center', size === 's' && 'px-2 text-sm')
```

**Color tokens** — semantic only, never raw:
```
// DO
bg-base-background-inverse, text-signal-error, border-alternate-border
// DON'T
bg-blue-500, text-red-600, #FF0000, rgb(...)
```

**Size tokens** — use design scale, not raw px for theme-managed dimensions:
```
// DO
px-size-padding-sm, gap-size-spacing-md
// DON'T (for theme dimensions)
px-4, gap-2
```

**State layer** — use the shared `STATE_LAYER` utility from `_utils/state-layer/`, never write custom hover/focus/pressed/disabled classes per component.

**CSS vars** — consume `--color-theme-base-*` (runtime-overridable), never `--color-base-*` directly.

## 4. Business Isolation

A klara-theme component has NO knowledge of the business domain.

**DO:**
- Accept primitive props (strings, numbers, booleans, React nodes)
- Use `BrandedWrapper`, `InverseWrapper`, `ThemedBox` for brand theming
- Keep local UI state only (`useState`, `useRef`, `useId`)

**DON'T:**
```tsx
// DON'T — business type leak
import { Letter } from '@/types/letter'
interface ICardProps { letter: Letter }

// DON'T — data fetching
const { data } = useSWR('/api/letters')

// DON'T — global state
const dispatch = useDispatch()
```

**No app-layer artifacts in the component directory:**
- No `CHANGELOG.md`, `_hooks/`, `_types/`, `_constants/` subdirectories
- No `*-app.tsx` files (organisms belong outside the library)

## 5. Accessibility

- Root element: `theme-ui-label="component-name"` attribute
- IDs: use `useId()` with consumer override
  ```tsx
  const autoId = useId()
  const resolvedId = props.id ?? autoId
  ```
- Complex interactive widgets (Accordion, Tabs, Dialog, Tooltip, Popover): use Radix UI — do not roll your own keyboard handling
- Focus ring: use shared `focus-visible:outline focus-visible:outline-focus` from STATE_LAYER
- Disabled: use `opacity-disabled pointer-events-none` token, not raw opacity

## 6. Testing & Documentation

**Tests** (`{name}.test.tsx`):
- Renders without crashing
- Renders all major `styling` variants
- Disabled state (no interaction, correct classes)
- Key interactions (click, keyboard where relevant)
- `className` passthrough

**Stories** (`{name}.stories.tsx`):
```ts
export default {
  title: 'Components/{Name}',
  component: ComponentName,
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentName>
```
At minimum: Base story, Disabled story, all `styling` variants.

**Figma artifacts:**
- `{name}.figma.json` — node ID mapping
- `{name}.mapping.json` — prop-to-Figma-variant mapping
Both must be non-empty.
```

## Validation

- [ ] File created at correct path in luz_next repo
- [ ] Covers all 6 sections (structure, props, tokens, biz isolation, a11y, testing)
- [ ] DO/DON'T code examples for every major rule
- [ ] No rule IDs or severity scores (those live in audit-standards.md)
