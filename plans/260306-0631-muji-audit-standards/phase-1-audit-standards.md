---
phase: 1
title: "Audit Standards Reference Document"
effort: 2h
depends: []
---

# Phase 1: Audit Standards Reference

## Objective

Create `packages/design-system/skills/ui-lib-dev/references/audit-standards.md` — the authoritative, enforceable rules document for klara-theme component audits.

## Tasks

### TODO: Create audit-standards.md

**File**: `packages/design-system/skills/ui-lib-dev/references/audit-standards.md`

This is the master reference. Structure it with these sections, each containing PASS/FAIL rules:

#### Section 1: Component Structure (6 rules)

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| STRUCT-001 | Component directory exists under `src/lib/components/{kebab-name}/` | critical | Directory exists with kebab-case name | Missing or wrong location |
| STRUCT-002 | Required files present: `.tsx`, `-styles.ts`, `.stories.tsx`, `.test.tsx`, `.figma.json`, `.mapping.json`, `index.ts` | critical | All 7 files present | Any missing (note: `types.ts` optional) |
| STRUCT-003 | `index.ts` barrel exports default + all named types | high | All public types/components exported | Missing exports |
| STRUCT-004 | Component file starts with `'use client'` directive | high | First line is `'use client'` | Missing directive |
| STRUCT-005 | `displayName` set on component | medium | `Component.displayName = 'Name'` present | Missing displayName |
| STRUCT-006 | Compound components split into separate files per sub-component | medium | Each sub-component has own `.tsx` + `-style.ts` | Monolithic file with multiple components |

#### Section 2: Props & Naming (8 rules)

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| PROPS-001 | Props interface named `I{PascalName}Props` | high | `IButtonProps`, `IChipProps` | `ButtonProps`, `Props`, unnamed |
| PROPS-002 | Standard vocab props used: `styling`, `mode`, `size`, `radius`, `className`, `id`, `disabled`, `inverse` | high | Uses standard names for these concepts | Custom names for equivalent concepts (e.g., `variant` instead of `styling`) |
| PROPS-003 | Variant consts use `SCREAMING_SNAKE` + `as const` pattern | medium | `BUTTON_STYLING = {...} as const` | Plain enum, no const assertion |
| PROPS-004 | Type derived from const: `type X = (typeof CONST)[keyof typeof CONST]` | medium | Derived type pattern | Manually duplicated union type |
| PROPS-005 | Boolean feature flags typed as `prop?: true` (not `boolean`) | low | `inverse?: true`, `isBold?: true` | `inverse?: boolean` when only truthy is meaningful |
| PROPS-006 | Internal compound props prefixed with `_` | medium | `_size`, `_mode`, `_themeUILabel` | Unprefixed internal props |
| PROPS-007 | JSDoc on every prop with `@default` annotations | medium | All props have `/** */` docs | Missing JSDoc |
| PROPS-008 | Deprecated props use `@deprecated` annotation with migration guidance | high | `@deprecated Use X instead` in JSDoc | Silently removed prop or undocumented deprecation |

#### Section 3: Token & Style (7 rules)

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| TOKEN-001 | ALL Tailwind classes in `*-styles.ts` file, never inline in component | critical | Styles in dedicated file | Tailwind strings in `.tsx` component body |
| TOKEN-002 | `clsx()` for all conditional class assembly | high | `clsx(base, variant && modifier)` | Template literals or string concatenation |
| TOKEN-003 | Semantic color tokens only: `bg-base-*`, `text-base-*`, `signal-*`, `alternate-*` | critical | Only semantic Tailwind classes | Raw colors (`bg-blue-500`), hex values, `rgb()` |
| TOKEN-004 | Size tokens: `size-theme-*`, `px-size-padding`, `gap-size-spacing` for theme dimensions | high | Design scale values | Raw px values (`px-4`, `w-32`) for theme-managed dimensions |
| TOKEN-005 | Variant maps use `Map<string, string>` pattern | medium | `new Map([['primary', '...'], ...])` | Plain object or switch statement for variant-to-class mapping |
| TOKEN-006 | Components use `--color-theme-base-*` vars, never `--color-base-*` directly | high | Theme-tier CSS vars | Base-tier CSS vars bypassing theme layer |
| TOKEN-007 | State layer via shared utility (`STATE_LAYER`), not per-component | medium | Imports from `_utils/state-layer/` | Custom hover/focus/pressed/disabled classes |

#### Section 4: Business Isolation (5 rules)

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| BIZ-001 | No domain/business types in component | critical | Only UI types (string, number, React types) | Types referencing business entities (Letter, Email, Survey) |
| BIZ-002 | No API calls or data fetching | critical | No fetch, axios, useSWR, useQuery | Any network call in component |
| BIZ-003 | No state management beyond local UI state | critical | Only useState, useRef for local UI | Redux, Zustand, global stores imported |
| BIZ-004 | Theming via BrandedWrapper/InverseWrapper/ThemedBox only | high | Uses provided wrapper components | Custom CSS var injection, manual theme switching |
| BIZ-005 | No app-layer lifecycle (changelog, development docs inside component dir) | medium | Only library files in directory | `CHANGELOG.md`, development guides, app-specific docs |

#### Section 5: Accessibility (5 rules)

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| A11Y-001 | `theme-ui-label` attribute on root element | high | `theme-ui-label="component-name"` present | Missing attribute |
| A11Y-002 | Auto-ID via `useId()` with consumer override | high | `const id = useId(); <el id={props.id \|\| id}>` | Hardcoded or missing IDs |
| A11Y-003 | Radix UI for complex interactive primitives | high | Accordion, Tabs, Dialog, Tooltip use Radix | Rolling own keyboard handling for complex widgets |
| A11Y-004 | Standard focus ring via STATE_LAYER utility | medium | `focus-visible:outline focus-visible:outline-focus` from shared utility | Custom focus styles |
| A11Y-005 | Disabled state uses `opacity-disabled pointer-events-none` token | medium | Semantic disabled token | Raw opacity values or custom disabled styling |

#### Section 6: Testing & Documentation (4 rules)

| Rule ID | Rule | Severity | Pass | Fail |
|---------|------|----------|------|------|
| TEST-001 | Test file exists: `*.test.tsx` | high | File present with at least "renders without crashing" | Missing test file |
| TEST-002 | Stories file exists: `*.stories.tsx` with `tags: ['autodocs']` | high | Story with meta, argTypes, at least Base story | Missing stories |
| TEST-003 | Standard test coverage: render, props, disabled, interaction, className passthrough | medium | Tests for major prop combos + interactions | Only smoke test |
| TEST-004 | `.figma.json` and `.mapping.json` present and non-empty | medium | Valid JSON with nodeId and prop mappings | Missing or empty Figma artifacts |

#### Anti-Patterns Section

List known anti-patterns (from Smart Letter Composer analysis):
- Internal `_constants/`, `_hooks/`, `_types/`, `_utils/` subdirectories = app-layer, not library
- Domain types (`ElementType`, `ScreenMode`) = business logic leak
- Inline styles/classes mixed in TSX = violates style separation
- Separate `CHANGELOG.md` in component dir = separate lifecycle = not library component
- Standalone app files (`*-app.tsx`) = organism, not reusable component

### TODO: Update ui-lib-dev SKILL.md aspects table

**File**: `packages/design-system/skills/ui-lib-dev/SKILL.md`

Add row to Aspect Files table:
```
| `references/audit-standards.md` | Enforceable audit rules with pass/fail criteria per category | Audit checklist, scoring |
```

## Validation

- [ ] All 35 rules have: Rule ID, description, severity, pass criteria, fail criteria
- [ ] Every rule traceable to a finding in the research report
- [ ] No duplicate rules across sections
- [ ] Severity levels consistent (critical = breaks library contract, high = convention violation, medium = quality gap, low = style preference)
