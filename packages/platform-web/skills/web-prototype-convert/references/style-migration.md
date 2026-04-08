# Style Migration Reference

Patterns for migrating prototype file structure and styling into luz_next conventions.

---

## 1. luz_next Module File Structure

**`--target module`** → place under:
```
apps/luz-epost/src/app/[locale]/(app)/{module}/
  page.tsx               ← Next.js route entry
  layout.tsx             ← optional layout
  _components/           ← private UI components
    {ComponentName}.tsx
  _hooks/                ← custom React hooks
    use{Name}.ts
  _actions/              ← Next.js server actions
    {verb}{Entity}.ts
  _services/             ← API callers (FetchBuilder)
    {entity}Service.ts
  _ui-models/            ← DTOs / view models
    {Entity}UiModel.ts
```

**`--target component`** → place under:
```
libs/klara-theme/src/lib/components/{name}/
  {Name}.tsx
  {Name}.stories.tsx
  {Name}.spec.tsx
  index.ts
```

---

## 2. Import Conventions

```ts
// CORRECT
import { Button, TextField, Card } from '@luz-next/klara-theme';

// WRONG — never import sub-paths
import { Button } from '@luz-next/klara-theme/button';
```

Use path aliases (`@app/`, `@luz-next/`) — never relative `../../..` chains.

---

## 3. Component Props Translation

| External prop | klara prop | Notes |
|---|---|---|
| `variant="primary"` | `styling="primary"` | klara uses `styling` not `variant` |
| `variant="outlined"` | `styling="outlined"` | same key change |
| `color="danger"` | `mode="destructive"` | klara uses `mode` for semantic color |
| `color="success"` | `mode="positive"` | |
| `rounded` / `rounded-full` | `radius="full"` | |
| `size="lg"` | `size="lg"` | unchanged |
| `disabled` | `disabled` | unchanged |

---

## 4. CVA Patterns → klara Props

If prototype uses `class-variance-authority`:

1. Identify variant dimensions in the CVA config (e.g. `intent`, `size`, `radius`)
2. Map to klara native props:
   - `intent` → `styling`
   - `size` → `size`
   - `radius` → `radius`
   - semantic color variants → `mode`
3. Delete the CVA file — klara handles variants internally
4. Remove `cva` import and any `cn(variants(...))` calls

```ts
// BEFORE (CVA)
const button = cva('base', {
  variants: { intent: { primary: 'bg-blue-500', danger: 'bg-red-500' } }
});
<button className={button({ intent: 'primary' })} />

// AFTER (klara)
import { Button } from '@luz-next/klara-theme';
<Button styling="primary" />
```

---

## 5. CSS Modules → Tailwind + klara

- `styles.button` from `.module.css` → inline `className` with klara props + Tailwind layout utilities only
- Delete the `.module.css` file after migration
- Rule: visual concerns (color, spacing, radius) → klara props. Layout only (flex, grid, gap, w-, h-) → Tailwind.

```tsx
// BEFORE
<div className={styles.card}>...</div>

// AFTER
<Card styling="outlined" className="flex flex-col gap-4">...</Card>
```

---

## 6. Inline Styles

- `style={{ color: '#e53e3e' }}` → `mode="destructive"` on klara component (never copy hex values)
- `style={{ borderRadius: '9999px' }}` → `radius="full"`
- `style={{ padding: '16px' }}` → klara `p-400` (never Tailwind `p-4` — klara uses 100/200/400 scale)
- Always route colors through `token-mapping.md` intent flow — never hardcode hex/rgb

---

## 7. Framework Restructuring

### Vite + React → Next.js App Router
| Vite pattern | luz_next equivalent |
|---|---|
| `main.tsx` / `App.tsx` entry | `app/[locale]/(app)/{module}/page.tsx` |
| React Router `<Route path="/x">` | Folder routing (`/x/page.tsx`) |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `<BrowserRouter>` | Delete — Next.js provides routing |
| `import.meta.env.VITE_*` | `process.env.NEXT_PUBLIC_*` |

### Next.js Pages Router → App Router
| Pages Router | App Router |
|---|---|
| `pages/{name}.tsx` | `app/{name}/page.tsx` |
| `getServerSideProps` | Async server component or `loading.tsx` |
| `getStaticProps` | Async server component |
| `_app.tsx` | `layout.tsx` |
| `_document.tsx` | `layout.tsx` head section |

### Plain HTML + JS → Next.js Component
- Extract DOM sections as React components
- jQuery event handlers → React event handlers + `useState`
- Bootstrap classes → klara components (via `component-mapping.md`)
- Script tags → remove; logic moves into hooks or actions

---

## 8. What NOT to Carry Over

- Third-party CSS resets (Next.js + klara provide base styles)
- Global font imports if fonts match klara theme
- Custom `ThemeProvider` wrappers — klara provides its own
- Dark/light mode toggles — klara theming handles this automatically
- `normalize.css` or `reset.css` imports
