# Component Mapping — klara-theme Vocabulary Guide

> This file teaches **how to reason** about klara components by semantic role.
> Live API truth: `libs/klara-theme/src/lib/components/{name}/{name}.tsx` — read at implement time.

## 1. Overview

klara-theme has 67+ components across 6 categories. Never match by name — match by **what the element does for the user**.

**Signal priority** (evaluate in order):
1. DOM semantics — role/aria attributes → highest confidence
2. Interaction — state (hover/focus/disabled), events (onClick/onChange) → medium
3. Visual — class names, color, size → lowest; style is a hint, not identity

**Categories**: Form Controls · Layout · Navigation · Feedback · Data Display · Advanced

---

## 2. Components by Semantic Role

### Form Controls

| Role | klara component | When to use |
|------|-----------------|-------------|
| Primary / secondary action trigger | `Button` | User commits to an action; use `mode` prop for destructive |
| Single-line text entry | `TextField` | Short user input, also password/email via `type` prop |
| Multi-line text entry | `Textarea` | Long-form input |
| Option from closed list | `Select` | Choose 1 of N known options |
| Boolean toggle (on/off) | `Toggle` / `Switch` | Enable/disable a setting |
| One-of-N radio choice | `RadioGroup` | Mutually exclusive options |
| Zero-or-more checkbox | `Checkbox` | Independent true/false per item |
| Range / continuous value | `Slider` | Numeric range input |
| File upload trigger | `FileUpload` | Upload files from disk |
| Search entry | `SearchField` | Input with search semantics (magnifier icon) |

### Layout

| Role | klara component | When to use |
|------|-----------------|-------------|
| Grouped content surface | `Card` | Visually contained block; use for any lifted/bordered container |
| Full-screen overlay frame | `Modal` / `Dialog` | Blocking user decision or task |
| Side panel overlay | `Drawer` | Non-blocking contextual panel |
| Collapsible content | `Accordion` | Reveal-on-demand sections |
| Horizontal/vertical divider | `Divider` | Visual separator |
| Page-level skeleton | `PageLayout` | Top-level page shell |

### Navigation

| Role | klara component | When to use |
|------|-----------------|-------------|
| Multi-view container | `Tabs` | Switch between related peer views |
| Hierarchical location | `Breadcrumb` | Show page position in a tree |
| Overflow actions | `DropdownMenu` | Hidden action list behind a trigger |
| App-level nav | `Sidebar` / `NavBar` | Primary navigation structure |
| Anchor pagination | `Pagination` | Navigate between pages of results |
| Step flow indicator | `Stepper` | Show progress through a multi-step flow |

### Feedback

| Role | klara component | When to use |
|------|-----------------|-------------|
| Ephemeral system feedback | `Notification` / `Toast` | Transient success/error/info message |
| Inline status message | `Alert` | Persistent contextual message in page flow |
| Short state indicator | `Badge` | Compact label for count, status, category |
| Async work in progress | `Loader` / `Spinner` | Content loading, async action pending |
| Skeleton placeholder | `Skeleton` | Anticipatory layout while loading |
| Confirmation dialog | `Dialog` | "Are you sure?" blocking decision |
| Hover/focus tooltip | `Tooltip` | Short helper text on interaction |

### Data Display

| Role | klara component | When to use |
|------|-----------------|-------------|
| Tabular structured records | `DataTable` | Dense row/column data with sort/filter |
| Key-value pairs | `DescriptionList` | Label + value display |
| User identity | `Avatar` | Represent a person or entity (image or initials) |
| Short info chip | `Tag` / `Chip` | Removable or decorative label |
| Progress indicator | `ProgressBar` | Show completion percentage |
| Empty state | `EmptyState` | No-data placeholder with optional CTA |

### Advanced

| Role | klara component | When to use |
|------|-----------------|-------------|
| Floating popover | `Popover` | Anchored overlay for complex content |
| Command palette | `CommandMenu` | Keyboard-driven search + action trigger |
| Date input (basic) | `DatePicker` | Calendar-backed date entry (limited — see no-match list) |

---

## 3. External → klara Semantic Bridges

| External | Role | klara equivalent |
|---|---|---|
| Bootstrap `btn btn-primary` | Primary action | `Button mode="primary"` |
| Bootstrap `btn btn-danger` | Destructive action | `Button mode="destructive"` |
| Bootstrap `modal` | Blocking overlay | `Dialog` |
| Bootstrap `alert alert-success` | Inline status | `Alert severity="success"` |
| Radix `Dialog` | Blocking modal | `Dialog` |
| Radix `DropdownMenu` | Overflow actions | `DropdownMenu` |
| Shadcn `Alert` | Inline status | `Alert` |
| Shadcn `Badge` | State label | `Badge` |
| Shadcn `Command` | Command palette | `CommandMenu` |
| MUI `TextField` | Text entry | `TextField` |
| MUI `Select` | Option picker | `Select` |
| MUI `Snackbar` | Ephemeral feedback | `Notification` |
| MUI `Chip` | Tag/label | `Tag` |
| Tailwind UI `Card` | Content surface | `Card` |
| HTML `<table>` | Tabular data | `DataTable` |
| HTML `<details>/<summary>` | Collapsible | `Accordion` |

---

## 4. No-Match List

klara has NO native primitives for these. When encountered, escalate as 🔴 in Phase B and collect as `TODO[klara-gap]`:

- **Drag-and-drop** (react-dnd, dnd-kit, @dnd-kit/core)
- **Rich text editors** (TipTap, Quill, Slate, Draft.js)
- **Charts and graphs** (Recharts, Chart.js, Victory, Nivo)
- **Advanced date/time pickers** (react-datepicker, react-day-picker with range selection)
- **Code editors** (Monaco, CodeMirror, Prism)
- **Calendar grids** (FullCalendar, react-big-calendar)
- **Kanban boards** (any drag-reorderable column layout)

These require external libraries or custom components — flag during Phase B, do not attempt klara approximation.

---

## 5. Reasoning Rules

**Multiple candidates?** Pick by intent, not visual similarity.
- A blue box with text is not always a `Card` — if it shows feedback after an action, it's `Alert` or `Notification`.
- A clickable item in a list is not always `Button` — if it navigates, it's a link inside `NavBar` or `Tabs`.

**Variant name translation:** External `variant="danger"` → klara `mode="destructive"`. External `variant="ghost"` → klara `mode="ghost"`. Never infer klara prop names from external API shapes.

**Never wrap:** Do not create klara wrappers that replicate an external component's API. Use klara's own props directly.

**Confidence tiers** (used in Phase C live read):
- HIGH (role unambiguous) → reference this file only; skip live read
- MEDIUM (1–2 candidates) → read `.stories.tsx` only for prop examples
- LOW (uncertain match) → read both `.tsx` + `.stories.tsx` before implementing
