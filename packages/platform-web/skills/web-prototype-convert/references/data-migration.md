# Data Migration Reference

Patterns for migrating prototype data layers into luz_next's typed, API-driven architecture.

---

## 1. luz_next Data Flow

Every data operation follows this chain — do not skip layers:

```
Component → Hook → Action → Service → API
```

| Layer | File | Responsibility |
|---|---|---|
| Component | `_components/{Name}.tsx` | Renders UI, calls hook |
| Hook | `_hooks/use{Name}.ts` | Wraps action/service, exposes React state |
| Action | `_actions/{verb}{Entity}.ts` | Server-side mutation (Next.js `'use server'`) |
| Service | `_services/{entity}Service.ts` | FetchBuilder caller, returns typed DTO |
| API | luz backend | Data source |

---

## 2. FetchBuilder Pattern

Canonical service file:

```ts
// _services/letterService.ts
'use server';
import { FetchBuilder } from '../service/fetch-builder';
import { retrieveSessionData } from '../service/session-service';
import { MY_SERVICE_API } from '@your-app/utils';
import type { LetterDto } from '../_ui-models/LetterUiModel';

export async function getLetters(): Promise<LetterDto[]> {
  const { tenantId, authToken } = await retrieveSessionData();
  const response = await new FetchBuilder<LetterDto[]>()
    .withUrl(MY_SERVICE_API.LETTERS.LIST)
    .withTenantId(tenantId)
    .withBearerToken(authToken)
    .execute();
  if (response.error || !response.result) return [];
  return response.result;
}
```

Rules:
- Add `'use server'` at top — all service/caller files run server-side
- Import `FetchBuilder` from `'../service/fetch-builder'` (relative, not package import)
- Session via `retrieveSessionData()` — never pass token as parameter
- Always check `response.error` — FetchBuilder never throws, errors are in `response.error`
- URL constants from `@your-app/utils` (app-specific constants module)
- One service file per entity; return type always typed DTO — never `any`. Never call `fetch()` directly.

---

## 3. Hook Pattern

```ts
// _hooks/useLetters.ts
import { useState, useTransition } from 'react';
import { getLetters } from '../_services/letterService';
import type { LetterDto } from '../_ui-models/LetterUiModel';

export function useLetters() {
  const [data, setData] = useState<LetterDto[]>([]);
  const [isPending, startTransition] = useTransition();

  function load() {
    startTransition(async () => {
      const result = await getLetters();
      setData(result);
    });
  }

  return { data, isPending, load };
}
```

Prefer async server components for read-only fetching; use hooks only when client interactivity requires it.

---

## 4. Server Action Pattern

Use for mutations that require server-side auth, validation, or secrets (e.g., AI API keys):

```ts
// _actions/sendLetter.ts
'use server';
import type { SendLetterPayload } from '../_ui-models/LetterUiModel';

export async function sendLetter(payload: SendLetterPayload) {
  // auth, validate, then call service
}
```

AI integrations (e.g., Google Gemini): API key stays server-side in action — never expose to client.

---

## 5. Missing API — Stub Pattern

When the luz backend endpoint does not exist yet:
1. Create the service file with a typed TODO stub
2. Surface as a 🟡 concern in the generated spec

```ts
// _services/wizardService.ts
'use server';
import { FetchBuilder } from '../service/fetch-builder';
import { retrieveSessionData } from '../service/session-service';
import type { WizardDto } from '../_ui-models/WizardUiModel';

// TODO: replace with real endpoint when backend is ready
const TODO_ENDPOINT = 'TODO:/api/wizard';

export async function getWizardData(): Promise<WizardDto | null> {
  const { tenantId, authToken } = await retrieveSessionData();
  const response = await new FetchBuilder<WizardDto>()
    .withUrl(TODO_ENDPOINT)
    .withTenantId(tenantId)
    .withBearerToken(authToken)
    .execute();
  if (response.error || !response.result) return null;
  return response.result;
}
```

This unblocks UI work while the API is in progress.

---

## 6. Zustand → RTK Dual-Store Migration

luz_next uses Redux Toolkit with a **dual-store pattern**: persisted store (survives reload) and ephemeral store (session-only).

**Migration map:**

| Zustand | RTK equivalent |
|---|---|
| `create((set) => ({ field: value }))` | `createSlice({ name, initialState, reducers })` |
| `useStore((s) => s.field)` | `useSelector((s) => s.sliceName.field)` |
| `useStore.getState().setField(v)` | `dispatch(slice.actions.setField(v))` |
| Immer patches via `useAppStore` | RTK includes Immer — use `state.field = value` in reducers |
| Persisted state (`zustand/middleware` persist) | Add slice to persisted store config |
| Ephemeral UI state (modals, hover) | Add slice to ephemeral store config |

Decision rule — analyze structure, no mechanical 1:1 mapping:
- Survives reload (auth, prefs, drafts) → **persisted store**
- Session-only (modals, hover, transient state) → **ephemeral store**
- Group by domain: `letterSlice`, `composerSlice` — not one slice per Zustand store

---

## 7. Local Data → API Migration

| Prototype pattern | luz_next equivalent |
|---|---|
| Hardcoded array in component | Service + hook; delete hardcoded data |
| `localStorage.getItem('key')` | Persisted RTK slice |
| `localStorage.setItem('key', val)` | Dispatch to persisted RTK slice |
| `fetch('/api/...')` directly | FetchBuilder service |
| Mock JSON file (`data.json`) | Service with real URL (or stub if API pending) |
| SQLite / `better-sqlite3` | Backend API via FetchBuilder service |
| IndexedDB | Persisted RTK slice or backend API |
| Google Gemini / AI SDK call in client | Server action (`'use server'`) — key stays server-side |

---

## 8. TypeScript Contract Rule

Every API response MUST have a typed UI model in `_ui-models/`. No exceptions.

- DTOs (wire format): `{Entity}Dto` — e.g. `LetterDto`
- UI Models (mapped for component use): `{Entity}UiModel` — e.g. `LetterUiModel`
- No `any`, no `unknown` without narrowing, no inline types in service signatures

```ts
// _ui-models/LetterUiModel.ts
export interface LetterDto {
  id: string;
  subject: string;
  body: string;
  createdAt: string;
}

export interface LetterUiModel extends LetterDto {
  formattedDate: string; // derived field for display
}
```

---

## 9. Auth

Session via `retrieveSessionData()` in every service file — never pass token as param, never hardcode, never read from `localStorage`. Server actions access session internally.
