# Token Mapping Guide

## Color Tokens

### Background

| Hardcoded | klara-theme Token |
|-----------|------------------|
| `bg-white`, `bg-gray-50` | `bg-base-background` |
| `bg-gray-100`, `bg-gray-200` | `bg-base-muted` |
| `bg-blue-500`, `bg-primary` | `bg-base-primary` |
| `bg-red-500`, `bg-danger` | `bg-base-destructive` |
| `bg-green-500` | `bg-base-success` |
| `bg-yellow-500` | `bg-base-warning` |
| `bg-gray-800`, `bg-gray-900` | `bg-base-foreground` (for inverted) |

### Text

| Hardcoded | klara-theme Token |
|-----------|------------------|
| `text-gray-900`, `text-black` | `text-base-foreground` |
| `text-gray-500`, `text-gray-600` | `text-base-muted-foreground` |
| `text-blue-500` | `text-base-primary` |
| `text-red-500` | `text-base-destructive` |
| `text-white` | `text-base-primary-foreground` |

### Border

| Hardcoded | klara-theme Token |
|-----------|------------------|
| `border-gray-200`, `border-gray-300` | `border-base-border` |
| `border-blue-500` | `border-base-primary` |
| `border-red-500` | `border-base-destructive` |

## Spacing Tokens

| Tailwind Default | klara-theme Token |
|-----------------|------------------|
| `p-1` (4px) | `p-50` |
| `p-2` (8px) | `p-100` |
| `p-3` (12px) | `p-150` |
| `p-4` (16px) | `p-200` |
| `p-5` (20px) | `p-250` |
| `p-6` (24px) | `p-300` |
| `p-8` (32px) | `p-400` |
| `p-10` (40px) | `p-500` |
| `p-12` (48px) | `p-600` |
| `p-16` (64px) | `p-800` |

Same scale applies to `m-`, `gap-`, `space-x-`, `space-y-`.

## Border Radius

| Tailwind Default | klara-theme Token |
|-----------------|------------------|
| `rounded-sm` | `rounded-100` |
| `rounded` | `rounded-200` |
| `rounded-md` | `rounded-200` |
| `rounded-lg` | `rounded-300` |
| `rounded-xl` | `rounded-400` |
| `rounded-full` | `rounded-full` |

## Typography

| Tailwind Default | klara-theme Approach |
|-----------------|---------------------|
| `text-xs` | Use component `size="small"` |
| `text-sm` | Use component default size |
| `text-base` | `text-base-foreground` |
| `text-lg` | Typography component or utility |
| `font-bold` | `font-bold` (keep) |
| `font-semibold` | `font-semibold` (keep) |

## Rules

1. **NEVER** use hardcoded color values (#hex, rgb(), hsl())
2. **NEVER** use default Tailwind colors (blue-500, gray-100, etc.)
3. **ALWAYS** use semantic tokens (base-primary, base-background, etc.)
4. **ALWAYS** use numeric spacing scale (100, 200, 300...)
5. Query RAG for token reference: `query({ query: 'design tokens', filters: { topic: 'design-system' } })`
