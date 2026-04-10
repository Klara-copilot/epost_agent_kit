# Token Mapping — klara Intent-Based Reasoning Guide

> This file teaches **how to reason** from prototype values to klara tokens.
> Never match by value — always match by intent.
> Live token source: `libs/klara-theme/src/tokens/` — read at implement time for exact values.

---

## 1. klara's 3-Layer Token Architecture

```
Primitive  →  Theme  →  Component
color-blue-500  →  color-primary-default  →  button-primary-bg
```

| Layer | Scope | Example |
|-------|-------|---------|
| **Primitive** | Raw values | `color-blue-500`, `spacing-4` |
| **Theme** | Semantic aliases | `color-base-background`, `color-primary-default` |
| **Component** | Scoped to one component | `button-primary-bg`, `input-border` |

**Rule**: Always target the **highest semantic layer** that expresses intent.
- Use component tokens when styling inside a klara component's composition slot.
- Use theme tokens for layout, page-level surfaces, and text.
- Never reach into primitives unless no theme token fits AND you can justify it.

---

## 2. Intent Hierarchy

Ask: **"What does this color/spacing MEAN in context?"** — not "what value is it?"

| Intent | klara token class |
|--------|-------------------|
| Page surface (main background) | `bg-base-background` |
| Elevated surface (card, modal, panel) | `bg-base-surface` |
| Primary text | `text-base-foreground` |
| Muted / secondary text | `text-base-foreground-muted` |
| Disabled text | `text-base-foreground-disabled` |
| Primary action color | `bg-primary-default` / `text-primary-default` |
| Primary action text (on primary bg) | `text-primary-foreground` |
| Destructive action | `bg-destructive-default` / `text-destructive-foreground` |
| Success feedback | `bg-success-default` / `text-success-foreground` |
| Warning feedback | `bg-warning-default` / `text-warning-foreground` |
| Info feedback | `bg-info-default` / `text-info-foreground` |
| Default border | `border-base-border` |
| Subtle border / divider | `border-base-border-subtle` |
| Interactive hover surface | `bg-base-surface-hover` |
| Disabled state modifier | `*-disabled` suffix on whichever token applies |

---

## 3. Intent Mapping Examples

**Pattern**: Prototype value → Ask what IS this → klara token

```
Prototype: style={{ background: '#1a1a2e' }}
WRONG:  bg-neutral-900          ← value match
RIGHT:  Ask: what IS this?      → Page background
        → bg-base-background
```

```
Prototype: className="bg-red-500 text-white"
WRONG:  bg-red-500 text-white   ← copy
RIGHT:  Ask: what IS this?      → Destructive action button
        → bg-destructive-default text-destructive-foreground
```

```
Prototype: className="text-gray-500 text-sm"
WRONG:  text-gray-500 text-sm   ← copy
RIGHT:  Ask: what IS this?      → Secondary/helper text
        → text-base-foreground-muted typo-body-muted
```

```
Prototype: style={{ border: '1px solid #e0e0e0' }}
WRONG:  border border-gray-200  ← value match
RIGHT:  Ask: what IS this?      → Default container border
        → border border-base-border
```

**Unmapped values**: If no theme token expresses the intent, flag as:
`🟡 design decision: nearest = {token-name} — confirm with designer`
Never silently approximate or use arbitrary values.

---

## 4. Spacing Scale

klara uses a numeric scale — NOT Tailwind's 1/2/3/4 system.

| Tailwind | klara | Approximate px | Intent |
|----------|-------|----------------|--------|
| `p-1` | `p-100` | 4px | Tight / icon padding |
| `p-2` | `p-200` | 8px | Compact |
| `p-3` | `p-300` | 12px | Snug |
| `p-4` | `p-400` | 16px | Standard |
| `p-6` | `p-600` | 24px | Comfortable |
| `p-8` | `p-800` | 32px | Spacious |
| `gap-2` | `gap-200` | 8px | — |
| `gap-4` | `gap-400` | 16px | — |
| `m-4` | `m-400` | 16px | — |

**Rule**: Read actual scale values from `libs/klara-theme/src/tokens/` at implement time.
The scale above is illustrative — do not hardcode px assumptions.

**Inline spacing is always wrong** — even if value matches. Use scale classes.

---

## 5. Typography

Match heading level + **semantic role** to klara typography classes.

| Prototype element | Semantic role | klara class |
|-------------------|---------------|-------------|
| `<h1>` / page title | Page-level heading | `typo-heading-xl` |
| `<h2>` / section title | Section heading | `typo-heading-lg` |
| `<h3>` / subsection | Subsection | `typo-heading-md` |
| `<h4>` / card title | Minor heading | `typo-heading-sm` |
| Body text | Default readable text | `typo-body-default` |
| Helper / caption | Secondary copy | `typo-body-muted` |
| Form label | Input label | `typo-label-default` |
| Small label / tag | Compact label | `typo-label-sm` |

**Rule**: Heading level is semantic (document structure), not visual size. If an `<h3>` is used for visual impact only, match by role, not by tag — ask what the text communicates.

---

## 6. Anti-Patterns

| ❌ Wrong | ✅ Right | Why |
|---------|---------|-----|
| `bg-[#1a1a2e]` | `bg-base-background` | Arbitrary values bypass theming |
| `style={{ padding: '16px' }}` | `p-400` | Inline spacing breaks scale |
| `bg-neutral-900` | `bg-base-background` | Tailwind primitives bypass klara theming |
| `text-gray-500` | `text-base-foreground-muted` | Non-semantic, theme-unaware |
| `border-gray-200` | `border-base-border` | Does not respond to theme changes |
| `bg-blue-600 text-white` | `bg-primary-default text-primary-foreground` | Hardcoded color loses semantic |
| Copy `className` from prototype verbatim | Map each class by intent | Direct copy = no klara integration |
| Guess token when unsure | Flag as 🟡 design decision | Silent approximation introduces drift |
