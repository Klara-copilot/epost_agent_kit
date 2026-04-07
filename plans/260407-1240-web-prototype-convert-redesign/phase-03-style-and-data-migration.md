---
phase: 3
title: Author style-migration and data-migration reference files
effort: M
depends: [1]
---

## Context

Phase C (IMPLEMENT) uses these files to generate the actual luz_next output. style-migration covers file structure and style-system translation; data-migration covers the data layer (FetchBuilder, RTK dual-store, service pattern).

Can run in parallel with Phase 2 (no file overlap).

## Files to Create

- `packages/platform-web/skills/web-prototype-convert/references/style-migration.md`
- `packages/platform-web/skills/web-prototype-convert/references/data-migration.md`

## style-migration.md Requirements

≤ 200 lines. Teaches code-generation patterns for migrating the prototype's style system and file layout into luz_next.

### Required sections

**1. luz_next module file structure**

When `--target module`, place converted files as:
```
apps/luz-epost/src/app/[locale]/(app)/{module}/
  page.tsx                  — Next.js route entry
  layout.tsx                — optional layout
  _components/              — UI components (leading underscore = private to module)
    {ComponentName}.tsx
  _hooks/                   — custom React hooks
    use{Name}.ts
  _actions/                 — Next.js server actions
    {verb}{Entity}.ts
  _services/                — API callers (FetchBuilder)
    {entity}Service.ts
  _ui-models/               — view models / DTOs used by UI
    {Entity}UiModel.ts
```

When `--target component`, place in:
```
libs/klara-theme/src/lib/components/{name}/
  {Name}.tsx
  {Name}.stories.tsx
  {Name}.spec.tsx
  index.ts
```

**2. Import conventions**

- `import { Button, TextField } from '@luz-next/klara-theme'`
- Never import klara sub-paths directly
- Use path aliases, not relative `../../..`

**3. Component props translation**

klara prop vocabulary replaces common external vocabularies:

| External prop | klara prop | Notes |
|---|---|---|
| `variant="primary"` | `styling="primary"` | klara uses `styling` not `variant` |
| `size="lg"` | `size="lg"` | same |
| `color="danger"` | `mode="destructive"` | klara uses `mode` for semantic color |
| `rounded` / `rounded-full` | `radius="full"` | klara prop |
| `disabled` | `disabled` | same |

**4. CVA patterns → klara props**

If prototype uses `class-variance-authority`:
- Extract variant dimensions (e.g. `intent`, `size`, `radius`)
- Map to klara's native props (`styling`, `size`, `radius`, `mode`)
- DELETE the CVA file — klara handles variants internally

**5. CSS modules → Tailwind + klara**

- `styles.button` in `.module.css` → inline `className` with klara tokens
- Keep only layout-specific utilities inline
- Visual concerns (colors, spacing, radius) → klara props, not utility classes

**6. Inline styles**

- `style={{...}}` → Tailwind classes with klara semantic tokens
- Never copy hex values — route through token-mapping.md intent flow

**7. Framework restructuring**

**Vite+React → Next.js App Router**:
- `main.tsx` / `App.tsx` → `app/[locale]/(app)/{module}/page.tsx`
- React Router `<Route>` → Next.js folder routing
- `useNavigate()` → `useRouter()` from `next/navigation`
- `<BrowserRouter>` → delete; Next.js provides routing

**Next.js Pages Router → App Router**:
- `pages/*.tsx` → `app/*/page.tsx`
- `getServerSideProps` → async server component or `loading.tsx`
- `_app.tsx` → `layout.tsx`

**Plain HTML+JS → Next.js component**:
- Extract DOM sections as React components
- jQuery handlers → React event handlers + state
- Bootstrap classes → klara components (via component-mapping.md)

**8. What NOT to carry over**
- Third-party CSS resets (Next.js + klara handle base styles)
- Global font imports if fonts match klara theme
- Custom theme providers — klara provides its own
- Dark/light mode toggles — klara theming handles this

## data-migration.md Requirements

≤ 200 lines. Teaches luz_next's data architecture and how to migrate mock/local data to real API integration.

### Required sections

**1. luz_next data flow**

Every data operation follows: `Component → Hook → Action → Service → API`

- **Component** — renders UI, calls hook
- **Hook** — wraps action/service, exposes React state
- **Action** — Next.js server action (when mutation needs server)
- **Service** — FetchBuilder caller, returns typed data
- **API** — luz backend endpoint

**2. FetchBuilder pattern**

Canonical caller:
```ts
// _services/letterService.ts
import { FetchBuilder } from '@luz-next/shared/http';
import { URLS } from '@luz-next/shared/constants';
import type { LetterDto } from '../_ui-models/LetterUiModel';

export async function getLetters(token: string): Promise<LetterDto[]> {
  return new FetchBuilder<LetterDto[]>()
    .withUrl(URLS.letters.list)
    .withBearerToken(token)
    .execute();
}
```

Rules:
- One service file per entity
- Service returns typed DTO — never `any`
- URL constants live in shared constants module
- Never call `fetch` directly in components or hooks

**3. Hook pattern**

```ts
// _hooks/useLetters.ts
export function useLetters() {
  const [data, setData] = useState<LetterDto[]>([]);
  const token = useAuthToken();
  useEffect(() => {
    getLetters(token).then(setData);
  }, [token]);
  return { data };
}
```

**4. Server action pattern**

```ts
// _actions/sendLetter.ts
'use server';
export async function sendLetter(payload: SendLetterPayload) {
  // auth, validation, service call
}
```

**5. Zustand → RTK dual-store migration**

luz_next uses Redux Toolkit with a **dual-store pattern** (persisted + ephemeral). Migrate Zustand stores as follows:

| Zustand | RTK equivalent |
|---|---|
| `create((set) => ({...}))` | `createSlice({...})` |
| `useStore((s) => s.field)` | `useSelector((s) => s.slice.field)` |
| `useStore.getState().action()` | `dispatch(slice.actions.action())` |
| Persisted state | persisted store slice |
| Ephemeral UI state | ephemeral store slice |

Decision rule:
- Survives page reload (auth, user prefs, draft) → **persisted store**
- Ephemeral (modals, hover, transient form state) → **ephemeral store**

**6. Local data → API migration**

| Prototype | luz_next |
|---|---|
| Hardcoded array in component | Service + hook; remove hardcoded data |
| `localStorage.getItem()` | Persisted RTK slice |
| `fetch('/api/...')` | FetchBuilder service |
| Mock JSON file | Service with TODO comment + real URL when available |
| SQLite / IndexedDB | Backend API via FetchBuilder |

**7. TypeScript contract rule**

Every API response MUST have a typed UI model in `_ui-models/`. No `any`. No inline types. DTOs are named `{Entity}Dto` and UI models are `{Entity}UiModel`.

**8. Auth**

- Token acquisition: `useAuthToken()` (NextAuth session)
- Pass via `FetchBuilder.withBearerToken(token)` — never hardcode

## Success Criteria

- [ ] Both files exist, each ≤ 200 lines
- [ ] style-migration.md covers: luz_next structure, prop translation, CSS-module/inline/CVA patterns, framework restructuring (Vite, Pages Router, plain HTML)
- [ ] data-migration.md covers: 5-layer data flow, FetchBuilder, hook/action patterns, Zustand→RTK dual-store, local→API migration
- [ ] All code examples use klara imports and semantic tokens
- [ ] No file references hex values or Tailwind primitives
- [ ] TypeScript contract rule stated explicitly in data-migration.md

## Validation

```bash
wc -l packages/platform-web/skills/web-prototype-convert/references/style-migration.md
wc -l packages/platform-web/skills/web-prototype-convert/references/data-migration.md
```
Both ≤ 200 lines. Cross-check against Letter-Wizard and The-Experiment prototype profiles — every pattern they use must be addressed in one of the two files.
