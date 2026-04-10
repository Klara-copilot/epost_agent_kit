---
name: web-analytic
description: "(ePost) GA/GTM two-layer tracking for web apps. Use when: adding a new UI component library component, adding a new feature dialog/sidebar/page, auditing tracking completeness, reviewing a PR with UI changes, implementing analytics tracking in a new web project."
user-invocable: true
paths: ["**/*.tsx", "**/*.jsx"]

metadata:
  agent-affinity: [epost-fullstack-developer, epost-code-reviewer, epost-muji]
  keywords: [ga, gtm, google analytics, tracking, theme-ui-label, ga-data-group, analytics, dataLayer]
  platforms: [web]
  triggers: [
    "ga", "gtm", "google analytics", "tracking", "analytics",
    "theme-ui-label", "ga-data-group", "new component", "new dialog",
    "new sidebar", "new page", "verify tracking", "missing tracking"
  ]
  connections:
    enhances: [audit, code-review]
---

# Web Analytics — GA/GTM Two-Layer Tracking

## Architecture

Two DOM attributes power all GTM tracking. GTM reads them via CSS attribute selectors — no JS event listeners needed.

```
klara-theme components → theme-ui-label  (WHAT component was interacted with)
app feature boundaries → ga-data-group   (WHERE in the app the interaction happened)
                              ↓
                     GTM → GA4 / dataLayer
```

| Layer | Attribute | Who sets it | Purpose |
|-------|-----------|-------------|---------|
| Component | `theme-ui-label` | UI library authors | Identifies the component type |
| Feature | `ga-data-group` | App developers | Identifies the active feature context |

---

## Rule 1 — `theme-ui-label` (UI library components)

**Required on**: root element of every **interactive** component in the shared UI library.  
**Skip**: purely presentational components (loaders, skeletons, layout wrappers).

```tsx
// ✅ CORRECT
<div theme-ui-label="notification-badge" className="...">

// ❌ MISSING — GTM fires but gets blank component name
<div className="...">
```

**Naming**: `kebab-case` matching the component name. `NotificationBadge` → `notification-badge`.

See `references/tracking-rules.md` for full placement rules, skip conditions, and change protection process.  
See `references/naming-examples.md` for the complete component name → value table.

---

## Rule 2 — `ga-data-group` (app feature boundaries)

**Required on**: outermost content container **inside** any boundary (Dialog, Sidebar, Drawer, Modal, route page).  
**Skip**: boundary contains no UI library interactive components (hollow tracking).

```tsx
// ✅ Pattern 1 — wrapper div inside Dialog
<Dialog isOpen={...}>
  <div ga-data-group="my-feature-dialog">
    <Button />
  </div>
</Dialog>

// ✅ Pattern 2 — layout div in sidebar
<RightSidebar isOpen={...}>
  <div className="pt-400 ..." ga-data-group="my-feature-sidebar">...</div>
</RightSidebar>

// ❌ On the boundary component itself
<Dialog ga-data-group="...">
```

**Naming**: `[feature-name]-[ui-type]` in `kebab-case`. Confirm value with Data/Marketing before deploying.

See `references/tracking-rules.md` for full placement patterns, hollow tracking detection, and boundary component list.  
See `references/naming-examples.md` for naming examples by domain and how to derive new values.

---

## Rule 3 — Never Modify Existing Attributes

Both attributes are **live GTM trigger keys**. Rename or delete = silent GA4 data loss.  
Requires: written Data/Marketing approval + coordinated GTM publish + simultaneous deploy.

---

## Rule 4 — Naming Consistency

`kebab-case` only. `upload-dialog` not `uploadDialog` or `upload_dialog`.

See `references/naming-examples.md` for anti-patterns and derivation guide.

---

## GTM Initialization

Initialize GTM **exactly once** in the root layout component.

```tsx
// Next.js 14 — root layout
import { GoogleTagManager } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
        {children}
      </body>
    </html>
  );
}
```

Store the GTM Container ID in environment config — never hardcode in shared library code.

See `references/gtm-setup-patterns.md` for Next.js Pages Router, Vite/SPA, Remix, and manual dataLayer push patterns.

---

## When to Apply

| Situation | Required action |
|-----------|-----------------|
| New UI library component (interactive) | Add `theme-ui-label` to root element |
| New feature Dialog / Sidebar / Drawer / Modal | Add `ga-data-group` to outermost content container inside boundary |
| New route-level page | Add `ga-data-group` to the page's main container |
| PR review with UI changes | Verify no existing attributes were removed or renamed |
| New web project setup | Initialize GTM in root layout; align attribute conventions with Data team |

---

## Dev Interview Flow

When scanning a file, **always run this interview first** — ask each question before drawing conclusions.  
Ask each question as **Yes / No**. Branch based on answer.

---

### Step 1 — Detect scope

> **Q1: Is this file part of the shared UI library (e.g., klara-theme)?**
> - **Yes** → Go to [Rule 1 Interview](#rule-1-interview)
> - **No** → Go to [Rule 2 Interview](#rule-2-interview)

---

### Rule 1 Interview (UI library component)

> **Q2: Is this component interactive?**
> *(has onClick, onChange, user-facing interaction — not a loader, skeleton, or layout wrapper)*
> - **No** → ✅ SKIP — presentational component, no tracking needed. Done.
> - **Yes** → continue

> **Q3: Does the root element have the `theme-ui-label` attribute?**
> - **Yes** → continue
> - **No** → ❌ **MISSING** — add `theme-ui-label="component-name"` to root element. Fix required.

> **Q4: Is the `theme-ui-label` value in `kebab-case` matching the component name?**
> *(e.g. `NotificationBadge` → `notification-badge`)*
> - **Yes** → ✅ Rule 1 PASS
> - **No** → ❌ **WRONG FORMAT** — fix the value. *(Note: if attribute already fires in GTM, treat as Rule 3 — needs approval before renaming.)*

---

### Rule 2 Interview (App feature boundary)

> **Q5: Does this file render a boundary component?**
> *(Dialog, Sidebar, RightSidebar, Drawer, Modal, Sheet, route-level page)*
> - **No** → ✅ SKIP — no boundary = no `ga-data-group` needed at this level. Done.
> - **Yes** → continue

> **Q6: Does the boundary contain any UI library interactive components?**
> *(Button, Input, Select, Checkbox, etc. — not just static text)*
> - **No** → ✅ SKIP — hollow boundary, no tracking needed. Done.
> - **Yes** → continue

> **Q7: Does the outermost content container INSIDE the boundary have `ga-data-group`?**
> *(Must be on the div/section inside `<Dialog>`, not on `<Dialog>` itself)*
> - **Yes** → continue to Q8
> - **No** → ❌ **MISSING** — add `ga-data-group="[feature]-[type]"` to content wrapper inside boundary. Fix required.

> **Q8: Is the `ga-data-group` placed on the boundary component itself (wrong placement)?**
> - **Yes** → ❌ **WRONG PLACEMENT** — move attribute to the first content wrapper inside the boundary.
> - **No** → continue

> **Q9: Is the `ga-data-group` value in `kebab-case`?**
> *(e.g. `upload-dialog`, `settings-sidebar`, `team-members-page`)*
> - **Yes** → ✅ Rule 2 PASS
> - **No** → ❌ **WRONG FORMAT** — fix naming. *(If already live in GTM: Rule 3 applies — needs approval.)*

---

### Step 2 — Change protection check (always run last)

> **Q10: Does this change remove, rename, or move any existing `theme-ui-label` or `ga-data-group` value?**
> - **No** → ✅ PASS. All checks complete.
> - **Yes** → ⚠️ **RULE 3 VIOLATION** — this requires written approval from Data/Marketing + coordinated GTM publish before merging.

---

### Interview Output Format

After running the interview, output a result block:

```
## GA/GTM Tracking Audit — [filename]

| Q  | Question                                              | Answer | Result  |
|----|-------------------------------------------------------|--------|---------|
| Q1 | UI library component?                                 | No     | → Rule 2|
| Q5 | Contains a boundary component?                        | Yes    | continue|
| Q6 | Boundary contains interactive UI components?          | Yes    | continue|
| Q7 | ga-data-group on outermost container inside boundary? | No     | ❌ MISSING|
| Q10| Removes/renames existing tracking attribute?          | No     | ✅ PASS |

### Findings
❌ [Q7] Missing ga-data-group on content wrapper inside <Dialog>
   → Suggested fix: <div ga-data-group="[feature]-dialog"> as first child of Dialog content

### Required Actions
- [ ] Add ga-data-group to [file path] line [N]
- [ ] Confirm value with Data/Marketing before merging
```

---

## Pre-Merge Checklist

- [ ] New UI library component has `theme-ui-label` on root element
- [ ] `theme-ui-label` value is `kebab-case` matching component name
- [ ] New feature boundary (dialog/sidebar/page) has `ga-data-group`  
- [ ] `ga-data-group` value confirmed with Data/Marketing team
- [ ] No existing `theme-ui-label` or `ga-data-group` values deleted or modified
- [ ] Hollow boundaries (no UI library components inside) correctly skipped

---

## Project-Specific Implementation

Each project extends this standard with its own:
- GTM Container ID
- UI library component paths to scan
- App feature boundary detection patterns
- Known legacy exceptions

> **luz_next**: See `.github/skills/verify-ga/` for the full automated scan procedure,
> file classification tiers, path conventions, and legacy exceptions specific to `klara-theme` + `luz-epost`.
