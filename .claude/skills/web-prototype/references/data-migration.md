# Data Migration Guide

## Replace Mock Data with API Integration

### Data Flow Pattern

See `web-modules/references/api-binding.md` for the canonical data flow diagram.

### Step 1: Identify Mock Data

Common mock data patterns to find:
- `const data = [...]` in component files
- `mockData.json` / `fixtures.json` files
- `faker` or `@faker-js/faker` usage
- Hardcoded arrays/objects in state initialization
- `setTimeout` simulating API delays

### Step 2: Create UI Model

```typescript
// _ui-models/letter.ts
export interface Letter {
  id: string;
  title: string;
  content: string;
  recipientId: string;
  status: LetterStatus;
  createdAt: string;
  updatedAt: string;
}

export enum LetterStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
}
```

### Step 3: Create Caller (FetchBuilder)

```typescript
// _callers/letter-caller.ts
'use server';
import { fetchBuilder } from '@/service/fetch-builder';
import { LETTER_API } from '@/constants/api-urls';
import { Letter } from '../_ui-models/letter';

export async function getLetters(): Promise<Letter[]> {
  return fetchBuilder(LETTER_API.LIST)
    .fetch<Letter[]>();
}

export async function getLetterById(id: string): Promise<Letter> {
  return fetchBuilder(LETTER_API.DETAIL(id))
    .fetch<Letter>();
}

export async function createLetter(letter: Partial<Letter>): Promise<Letter> {
  return fetchBuilder(LETTER_API.LIST)
    .withMethod('POST')
    .withBody(letter)
    .fetch<Letter>();
}
```

### Step 4: Create Redux Action

```typescript
// _actions/letterActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getLetters, createLetter as createLetterCaller } from '../_callers/letter-caller';

export const fetchLetters = createAsyncThunk(
  'smartLetter/fetchLetters',
  async () => getLetters()
);

export const createLetter = createAsyncThunk(
  'smartLetter/createLetter',
  async (letter: Partial<Letter>) => createLetterCaller(letter)
);
```

### Step 5: Create Redux Slice

```typescript
// _stores/letterSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { fetchLetters, createLetter } from '../_actions/letterActions';
import { Letter } from '../_ui-models/letter';

interface LetterState {
  letters: Letter[];
  loading: boolean;
  error: string | null;
}

const initialState: LetterState = {
  letters: [],
  loading: false,
  error: null,
};

export const letterSlice = createSlice({
  name: 'smartLetter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLetters.pending, (state) => { state.loading = true; })
      .addCase(fetchLetters.fulfilled, (state, action) => {
        state.loading = false;
        state.letters = action.payload;
      })
      .addCase(fetchLetters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch';
      });
  },
});
```

### Step 6: Create Custom Hook

```typescript
// _hooks/useLetters.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLetters } from '../_actions/letterActions';

export function useLetters() {
  const dispatch = useAppDispatch();
  const { letters, loading, error } = useAppSelector((state) => state.smartLetter);

  useEffect(() => {
    dispatch(fetchLetters());
  }, [dispatch]);

  return { letters, loading, error };
}
```

### Step 7: Use in Component

```tsx
// _components/LetterList.tsx
'use client';

import { useLetters } from '../_hooks/useLetters';
import { Spinner } from 'your-design-system';

export function LetterList() {
  const { letters, loading, error } = useLetters();

  if (loading) return <Spinner />;
  if (error) return <div className="text-base-destructive">{error}</div>;

  return (
    <div className="flex flex-col gap-100">
      {letters.map((letter) => (
        <div key={letter.id} className="p-200 border border-base-border rounded-200">
          {letter.title}
        </div>
      ))}
    </div>
  );
}
```
