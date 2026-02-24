# API Binding Pattern

## The luz_next Data Flow

```
Component (UI layer)
  -> Custom Hook (state + effects)
    -> Redux Action (async thunk)
      -> Service (API abstraction)
        -> Caller (HTTP client)
          -> Backend API (JAX-RS)
```

## Layer 1: Component

```tsx
'use client';
import { useLetters } from '../_hooks/useLetters';

export function LetterList() {
  const { letters, loading, error, refresh } = useLetters();
  // Render UI using data from hook
}
```

**Rules**: Components ONLY call hooks. Never call services or dispatch actions directly.

## Layer 2: Custom Hook

```typescript
import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLetters, deleteLetter } from '../_actions/letterActions';

export function useLetters() {
  const dispatch = useAppDispatch();
  const { letters, loading, error } = useAppSelector(s => s.smartLetter);

  useEffect(() => {
    dispatch(fetchLetters());
  }, [dispatch]);

  const refresh = useCallback(() => {
    dispatch(fetchLetters());
  }, [dispatch]);

  const remove = useCallback((id: string) => {
    dispatch(deleteLetter(id));
  }, [dispatch]);

  return { letters, loading, error, refresh, remove };
}
```

**Rules**: Hooks dispatch actions and select from store. Never call services directly.

## Layer 3: Redux Action (Async Thunk)

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { letterService } from '../_services/letterService';
import { Letter } from '../_ui-models/letter';

export const fetchLetters = createAsyncThunk<Letter[]>(
  'smartLetter/fetchLetters',
  async (_, { rejectWithValue }) => {
    try {
      return await letterService.getAll();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
```

**Rules**: Actions call services and handle errors. Return typed payloads.

## Layer 4: Service

```typescript
import { Letter } from '../_ui-models/letter';

const BASE = '/api/smart-letter';

export const letterService = {
  getAll: async (): Promise<Letter[]> => {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    return res.json();
  },

  getById: async (id: string): Promise<Letter> => {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    return res.json();
  },

  create: async (data: Partial<Letter>): Promise<Letter> => {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    return res.json();
  },
};
```

**Rules**: Services shape requests and parse responses. Handle HTTP errors. Return typed data.

## Anti-Patterns

- Component calling `fetch()` directly
- Hook calling service without going through action
- Action containing business logic
- Service containing UI logic
- Mixing layers (component dispatching AND calling service)
