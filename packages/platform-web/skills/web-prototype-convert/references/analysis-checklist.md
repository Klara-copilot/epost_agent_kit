# Analysis Checklist — Phase A (UNDERSTAND)

Answer every section explicitly. Unanswered items become 🔴 blockers in Phase B.

## Section 1 — Framework Detection

Does a `package.json` exist?

- **Yes** → parse `dependencies`/`devDependencies`:
  | Signal | Detected framework |
  |--------|--------------------|
  | `next` | Next.js — check `appDir` in `next.config.*` for App vs Pages Router |
  | `react` (no `next`) + `vite` | Vite + React |
  | `react` (no `next`, no `vite`) | CRA or custom webpack |
  | `vue` | Vue 3 |
  | `@sveltejs/kit` | SvelteKit |

- **No** → plain HTML + JS. Scan `<script src>` and `<link href>` tags:
  | CDN pattern | Library |
  |-------------|---------|
  | `jquery` | jQuery |
  | `bootstrap` | Bootstrap |
  | `bulma` | Bulma |
  | `cdn.tailwindcss` | Tailwind CDN |

**Record:**
```
framework: <detected>
buildTool: <next|vite|webpack|none>
language: <TypeScript|JavaScript>
stylingEngine: <Tailwind|CSS Modules|SCSS|inline|Bootstrap|none>
```

## Section 2 — Component Inventory

Walk the file tree.
- `.tsx`/`.jsx` files → each exported component = one unit
- `.vue` files → each SFC = one unit
- Plain HTML → infer boundaries from semantic regions: `<section>`, `<nav>`, `<header>`, `<aside>`, `<main>`, `<dialog>`

Count UI element types per component/region:

| Element | Count |
|---------|-------|
| Buttons (`<button>`, `onClick` handlers) | — |
| Inputs (`<input>`, `<textarea>`, `<select>`) | — |
| Cards (grouped content blocks) | — |
| Modals / dialogs | — |
| Tabs / segmented controls | — |
| Lists (`<ul>/<ol>` or repeated items) | — |
| Tables (`<table>` or grid data) | — |

Output structured inventory:
```json
{
  "totalFiles": 0,
  "components": [
    { "name": "", "role": "page|layout|feature|primitive", "file": "" }
  ]
}
```

## Section 3 — Interaction Patterns

**State classification:**
- Which components hold state (`useState`, `useReducer`, reactive refs)?
- Which are purely presentational (props-in, render-out, no side effects)?

**Trigger map:**
| Trigger | Effect |
|---------|--------|
| click | state change / navigation / form submit |
| input | validation / search filter / controlled field |
| hover | tooltip / reveal / animation |
| scroll | lazy load / infinite scroll / sticky header |

**Form handling:**
- Controlled inputs (`value` + `onChange`)? → note which fields
- Uncontrolled inputs (`ref` / `defaultValue`)? → note which fields
- `react-hook-form` detected (`useForm`, `register`, `Controller`)? → record schema if present
- `formik` detected (`Formik`, `useFormik`, `Field`)? → record validation schema

**Side effects:**
- `setTimeout` / `setInterval` present? → note purpose and duration
- `IntersectionObserver` present? → note what it triggers
- `ResizeObserver` / `window.addEventListener('resize')` present? → note what it affects

## Section 4 — Data Inventory

**Hardcoded data:**
- Locate all inline arrays, object literals, and JSON imports
- Record: variable name, file, line range, data shape

**Browser storage:**
- `localStorage.getItem/setItem` → list all keys
- `sessionStorage.getItem/setItem` → list all keys
- `indexedDB.open` → note database name and stores

**API calls:**
Record each fetch/axios/http call:
```
method: GET|POST|PUT|PATCH|DELETE
url: <full URL or path pattern>
requestShape: <key fields>
responseShape: <key fields>
```

**External state libraries:**
| Signal | Library |
|--------|---------|
| `useStore`, `create` from `zustand` | Zustand |
| `useSelector`, `useDispatch`, `configureStore` | Redux Toolkit |
| `atom`, `useAtom` from `jotai` | Jotai |
| `atom`, `useRecoilState` from `recoil` | Recoil |
| `createContext`, `useContext` | React Context |

## Section 5 — Visual Inventory

**Fonts:**
- `@font-face` declarations → record family name and src
- Google Fonts `<link>` or `@import` → record family names
- CSS `font-family` stack → record all named families

**Colors:**
- Scan all CSS/SCSS/style props for hex, `rgb()`, `hsl()`, CSS custom properties
- Group by frequency: primary (used >5x), accent (2–5x), one-off (<2x)
- Note: dark/light mode variants if present

**Spacing scale:**
- Tailwind config → extract `spacing` key values
- CSS custom properties → collect `--spacing-*` or `--gap-*` variables
- Inline `padding`/`margin` values → list unique values, infer scale

**Typography hierarchy:**
Record sizes and weights:
```
h1: <size/weight>
h2: <size/weight>
h3: <size/weight>
body: <size/weight>
label: <size/weight>
caption: <size/weight>
```

## Section 6 — Target Classification

| Criteria | Target |
|----------|--------|
| Full feature, screen, or user flow with routing | **luz_next module** |
| Reusable primitive with no routing or domain logic | **klara-theme component** |

**luz_next module path:**
```
apps/luz-epost/src/app/[locale]/(app)/{module}/
  page.tsx           — entry point
  _components/       — UI components
  _hooks/            — custom hooks
  _actions/          — server actions
  _services/         — API callers
  _ui-models/        — view models
```

**klara-theme component path:**
```
libs/klara-theme/src/lib/components/{name}/
  {name}.tsx
  {name}.stories.tsx
  {name}.spec.tsx
  index.ts
```

**Record:**
```
target: luz_next-module | klara-theme-component
targetPath: <full path>
rationale: <one sentence>
```

## Section 7 — Unknowns Log

List everything COULD NOT be determined from static analysis. Format:
```
UNKNOWN: <what is unclear>
WHY: <why static analysis was insufficient>
IMPACT: <what decision this blocks>
```

These become 🔴 blockers in the Phase B conversion spec. If this list is empty, explicitly state:
```
UNKNOWNS: none — all sections answered with confidence.
```
