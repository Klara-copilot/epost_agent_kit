---
name: web-analytic-tracking-rules
description: "Detailed GA/GTM tracking rules — theme-ui-label and ga-data-group"
user-invocable: false
disable-model-invocation: true
---

# GA/GTM Tracking Rules — Full Reference

## Rule 1 — `theme-ui-label` (UI library components)

### When required
Every **interactive** component in the shared UI library must have `theme-ui-label` on its **root element**.

**Interactive** = produces user events (click, focus, change, submit).  
**Skip** = purely presentational (loaders, skeletons, layout wrappers, portals, animation boxes).

### Placement
```tsx
// ✅ Root element — correct
export const NotificationBadge = ({ count }: Props) => {
  return (
    <span theme-ui-label="notification-badge" className="...">
      {count}
    </span>
  );
};

// ❌ Missing — GTM fires but gets blank component name
export const NotificationBadge = ({ count }: Props) => {
  return <span className="...">{count}</span>;
};

// ❌ Wrong format — camelCase not allowed
<div theme-ui-label="notificationBadge">

// ✓ Skip — Fragment root, not a GTM target
export const Wrapper = ({ children }) => <>{children}</>;
```

### Naming format
`kebab-case` matching the component name exactly.

| Component | ✅ Value | ❌ Wrong |
|-----------|---------|---------|
| `Button` | `button` | `Button`, `btn` |
| `ButtonIcon` | `button-icon` | `buttonIcon`, `button_icon` |
| `NotificationBadge` | `notification-badge` | `notificationBadge` |
| `DataTable` | `data-table` | `datatable`, `DataTable` |
| `DatePicker` | `date-picker` | `datepicker` |

### Change protection
Existing values are **live GTM trigger keys**. Never rename or delete without:
1. Written approval from Data/Marketing team
2. GTM container update coordinated with the code change
3. Simultaneous deploy of both

---

## Rule 2 — `ga-data-group` (app feature boundaries)

### When required
Any file that renders a **boundary component** from the UI library AND contains at least one interactive UI library component inside.

**Boundary components** (triggers the requirement):
| Component | Boundary type |
|-----------|--------------|
| `<Dialog` | Modal boundary |
| `<RightSidebar` | Right sidebar boundary |
| `<MenuSidebar` | Left/menu sidebar boundary |
| `<BottomBar` | Bottom panel boundary |
| Route-level `page.tsx` | Full-page boundary |

### Placement
On the **outermost content container inside** the boundary — not on the boundary component itself.

```tsx
// ✅ Pattern 1 — simple div wrapper inside Dialog (most common ~70%)
<Dialog isOpen={isOpen} onClose={onClose}>
  <div ga-data-group="my-feature-dialog">
    <TextField label="Name" />
    <Button>Submit</Button>
  </div>
</Dialog>

// ✅ Pattern 2 — on layout div with className (sidebar ~25%)
<RightSidebar isOpen={isOpen}>
  <div className="pt-400 w-[...] h-full flex flex-col" ga-data-group="my-feature-sidebar">
    <Button>Action</Button>
  </div>
</RightSidebar>

// ✅ Pattern 3 — layout.tsx children wrapper (full-page ~5%)
<div className="flex flex-1 w-full h-full overflow-hidden" ga-data-group="feature-section-content">
  {children}
</div>

// ❌ On the boundary component itself
<Dialog ga-data-group="...">

// ❌ Buried too deep — GTM misses outer interactions
<Dialog>
  <div>
    <div>
      <div ga-data-group="...">  ← too deep
```

### Hollow tracking — skip condition
If the boundary contains **no UI library interactive components** (only native HTML or custom elements), skip `ga-data-group`. GTM has nothing to group.

```tsx
// ℹ️ HOLLOW — skip ga-data-group
<Dialog isOpen={isOpen}>
  <div>
    <input type="text" />         {/* native — no GTM event */}
    <button>Submit</button>       {/* native — no GTM event */}
  </div>
</Dialog>

// ✅ MEANINGFUL — add ga-data-group
<Dialog isOpen={isOpen}>
  <div ga-data-group="my-feature-dialog">
    <TextField label="Name" />   {/* UI library → GTM event */}
    <Button>Submit</Button>      {/* UI library → GTM event */}
  </div>
</Dialog>
```

**UI library interactive components** (non-exhaustive):
`Button`, `ButtonIcon`, `TextField`, `Textarea`, `Checkbox`, `Toggle`, `Radio`,
`Select`, `Autocomplete`, `DatePicker`, `FilterButton`, `SegmentedControl`,
`Tabs`, `ActionMenu`, `ContextMenu`, `ChatTool`

### Change protection
Same as Rule 1 — never rename or delete without Data/Marketing approval + coordinated GTM update.

---

## Rule 3 — Never Modify Existing Attributes

Both `theme-ui-label` and `ga-data-group` are **live GTM trigger keys**. A rename or deletion silently breaks GA4 data collection — no runtime error, no warning, data just stops flowing.

**Required process to change:**
1. Written request from Data/Marketing team
2. GTM container trigger updated to match new value
3. Code change + GTM publish deployed simultaneously

---

## Rule 4 — Naming Consistency

### `ga-data-group` format
`[feature-name]-[ui-type]` in `kebab-case`

| ❌ Wrong | ✅ Correct | Reason |
|---------|-----------|--------|
| `uploadDialog` | `upload-dialog` | camelCase not allowed |
| `confirm_delete_dialog` | `confirm-delete-dialog` | underscore not allowed |
| `forwardedMessageDialog` | `forwarded-message-dialog` | camelCase not allowed |
| `upload` | `upload-dialog` | missing ui-type suffix |

### Legacy exceptions (do not copy, do not fix)
Some projects may have pre-existing values that violate the standard. These are frozen because GTM actively references them. Document them in the project-specific skill but never use them as templates for new values.
