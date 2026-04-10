---
phase: 2
title: Author component-mapping and token-mapping reference files
effort: M
depends: [1]
---

## Context

Phase B (DECIDE) and Phase C (IMPLEMENT) lean on these two files as semantic vocabulary guides. Neither is a lookup table — both teach the LLM how to reason about klara-theme's vocabulary so it can map freely at conversion time.

Can run in parallel with Phase 3 (no file overlap).

## Files to Create

- `packages/platform-web/skills/web-prototype-convert/references/component-mapping.md`
- `packages/platform-web/skills/web-prototype-convert/references/token-mapping.md`

## component-mapping.md Requirements

≤ 200 lines. Teaches klara-theme's component vocabulary by **behavioral/visual role**, not by name-to-name lookup.

### Required sections

**1. Overview**
- klara-theme has 67+ components across 6 categories: Form Controls, Layout, Navigation, Feedback, Data Display, Advanced
- Source of truth: `libs/klara-theme/src/lib/components/{name}/{name}.tsx` (read at implement time)
- This file teaches vocabulary; live source is API truth.

**2. Components by semantic role**

For each klara component listed, describe its **role** (what user need it serves), not just its name:

| Role | klara component | When to use |
|------|-----------------|-------------|
| Primary action trigger | `Button` | User commits to an action |
| Single-line text entry | `TextField` | Short user input |
| Option selection from list | `Select` | Choose 1 of N known options |
| Grouped content surface | `Card` | Visually contained content block |
| Modal confirmation | `Dialog` | Blocking user decision |
| Multi-view container | `Tabs` | Switch between related views |
| Tabular data display | `DataTable` | Dense structured records |
| Collapsible content | `Accordion` | Reveal on demand |
| Status label | `Badge` | Short state indicator |
| User identity | `Avatar` | Represent a person or entity |
| Ephemeral feedback | `Notification` | Transient system feedback |
| Async state | `Loader` | Work in progress |

(Extend this list to cover the 67+ components at least by category — **not** one row per component. Group by role where components are variants of the same concept.)

**3. External → klara semantic bridges**

Common external vocabularies mapped by role, not name:

| External | Role | klara equivalent |
|---|---|---|
| Bootstrap `btn-primary` | Primary action | `Button styling="primary"` |
| Radix `Dialog` | Blocking modal | `Dialog` |
| Shadcn `Alert` | Inline status | `Notification` (inline mode) |
| MUI `TextField` | Text entry | `TextField` |
| MUI `Select` | Option picker | `Select` |
| Tailwind UI `Card` | Content surface | `Card` |
| HTML `<table>` | Tabular data | `DataTable` |

**4. No-match list**

Explicitly list patterns klara does NOT have native primitives for. When the agent hits these, it should escalate as 🔴 in Phase B:
- Drag-and-drop primitives (react-dnd, dnd-kit)
- Rich text editors
- Charts and graphs
- Date/time pickers beyond basic input
- Code editors (Monaco, CodeMirror)
- Calendar grids
- Kanban boards

**5. Reasoning rules**
- If multiple klara components could fit → pick the one whose description matches user intent, not visual similarity
- If external uses a variant name (`variant="danger"`) → translate to klara's prop vocabulary (`mode="destructive"`)
- Never copy an external component's API shape into a klara wrapper — use klara's own props directly

## token-mapping.md Requirements

≤ 200 lines. Teaches **intent-based** token reasoning, not hex-to-token lookup.

### Required sections

**1. klara's 3-layer token architecture**
- Primitive tokens — raw values (`color-blue-500`)
- Theme tokens — semantic aliases (`color-base-background`)
- Component tokens — component-scoped (`button-primary-bg`)

**Rule**: Always target the highest semantic layer that expresses intent. Never reach into primitives unless no theme token fits.

**2. Intent hierarchy**

Teach the agent to ask "what does this color MEAN?" before matching values:

| Intent | klara token class |
|--------|-------------------|
| Page surface background | `bg-base-background` |
| Elevated surface (card, modal) | `bg-base-surface` |
| Primary text | `text-base-foreground` |
| Muted / secondary text | `text-base-foreground-muted` |
| Primary action color | `bg-primary-default` / `text-primary-default` |
| Destructive action | `bg-destructive-default` / `text-destructive-default` |
| Success feedback | `bg-success-default` / `text-success-default` |
| Warning feedback | `bg-warning-default` / `text-warning-default` |
| Border, default | `border-base-border` |
| Border, subtle | `border-base-border-subtle` |
| Disabled state | `*-disabled` modifier |

**3. Intent mapping examples**

Show how to reason from prototype → intent → klara token (NOT from value → value):

```
Prototype: style={{ background: '#1a1a2e' }}
Wrong:  bg-neutral-900  (value match)
Right:  Ask: what IS this? → Page surface
        → bg-base-background
```

```
Prototype: className="bg-red-500 text-white"
Wrong:  bg-red-500 text-white (copy)
Right:  Ask: what IS this? → Destructive action button
        → bg-destructive-default text-destructive-foreground
```

**4. Spacing**

klara uses numeric scale: `100`, `200`, `300`, `400`, `600`, `800` (not Tailwind's 1, 2, 3, 4).

| Tailwind | klara | Intent |
|---|---|---|
| `p-1` (4px) | `p-100` | Tight |
| `p-2` (8px) | `p-200` | Compact |
| `p-4` (16px) | `p-400` | Standard |
| `p-6` (24px) | `p-600` | Comfortable |
| `p-8` (32px) | `p-800` | Spacious |
| `gap-2` | `gap-200` | — |
| `m-4` | `m-400` | — |

(Table intentionally compact — read actual scale from `libs/klara-theme/src/tokens/` at implement time for exact values.)

**5. Typography**

Match heading level + semantic role to klara typography classes:
- Page title → `typo-heading-xl`
- Section heading → `typo-heading-lg`
- Subsection → `typo-heading-md`
- Body → `typo-body-default`
- Muted body → `typo-body-muted`
- Label → `typo-label-default`

**6. Anti-patterns**
- ❌ `bg-[#1a1a2e]` — never use arbitrary values
- ❌ `style={{ padding: '16px' }}` — never inline spacing
- ❌ `bg-neutral-900` — Tailwind primitives bypass klara theming
- ✅ `bg-base-background p-400` — semantic + scale

## Success Criteria

- [ ] Both files exist, each ≤ 200 lines
- [ ] component-mapping.md organizes by **role**, not by name
- [ ] component-mapping.md has no-match list for unsupported patterns
- [ ] token-mapping.md teaches intent-based reasoning (examples show WRONG vs RIGHT)
- [ ] Neither file is a static lookup table; both include reasoning rules
- [ ] Spacing/typography sections show scale without hard-coding every value
- [ ] Both files explicitly reference live klara source as source of truth

## Validation

```bash
wc -l packages/platform-web/skills/web-prototype-convert/references/component-mapping.md
wc -l packages/platform-web/skills/web-prototype-convert/references/token-mapping.md
```
Both ≤ 200 lines. Spot-check: pick a random external component (e.g. Bootstrap modal) and verify the file teaches how to reason about it, not just a lookup row.
