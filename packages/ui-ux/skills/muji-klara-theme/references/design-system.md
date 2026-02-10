---
name: knowledge/klara-theme/design-system
description: "klara-theme design token system: spacing, colors, typography"
---

# klara-theme Design System

## 3-Layer Token System

1. **Raw tokens** — Absolute values (colors, sizes)
2. **Semantic tokens** — Contextual meaning (--color-primary, --spacing-md)
3. **Component tokens** — Component-specific (--button-padding, --card-radius)

## Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| --color-primary | #0066CC | #4DA3FF | Primary actions, links |
| --color-secondary | #6B7280 | #9CA3AF | Secondary text, borders |
| --color-success | #059669 | #34D399 | Success states |
| --color-warning | #D97706 | #FBBF24 | Warning states |
| --color-error | #DC2626 | #F87171 | Error states |
| --color-bg | #FFFFFF | #1F2937 | Background |
| --color-surface | #F9FAFB | #374151 | Card/panel backgrounds |

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| --space-1 | 4px | Tight spacing (icon gaps) |
| --space-2 | 8px | Element padding |
| --space-3 | 12px | Card padding |
| --space-4 | 16px | Section spacing |
| --space-6 | 24px | Component gaps |
| --space-8 | 32px | Section margins |
| --space-12 | 48px | Page sections |

## Typography

| Token | Value | Usage |
|-------|-------|-------|
| --font-sans | 'Inter', sans-serif | Body text |
| --font-mono | 'JetBrains Mono', monospace | Code |
| --text-xs | 0.75rem / 1rem | Captions |
| --text-sm | 0.875rem / 1.25rem | Small text |
| --text-base | 1rem / 1.5rem | Body |
| --text-lg | 1.125rem / 1.75rem | Subheadings |
| --text-xl | 1.25rem / 1.75rem | Headings |
| --text-2xl | 1.5rem / 2rem | Page titles |

## Border Radius

| Token | Value |
|-------|-------|
| --radius-sm | 4px |
| --radius-md | 8px |
| --radius-lg | 12px |
| --radius-full | 9999px |
