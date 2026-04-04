# React Patterns — Hooks, Stores, Composition

## Redux Store Setup

### Global Store

```typescript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
  selectedItemReducer: itemSlice,
  fileReducer: uploadSlice,
  userPreferencesReducer: userPreferencesSlice,
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Feature Store (RTK Query)

```typescript
export const store = configureStore({
  reducer: {
    listReducer, filterReducer, selectionReducer,
    [featureApi.reducerPath]: featureApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(featureApi.middleware),
});
```

## Slice Template

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = { selectedItem: { id: '', name: '' } };

export const selectedItem = createSlice({
  name: 'selectedItem',
  initialState,
  reducers: {
    removeItem: () => initialState,
    setItem: (state, action: PayloadAction<{ id: string; name: string }>) => ({
      selectedItem: action.payload,
    }),
  },
});

export const { removeItem, setItem } = selectedItem.actions;
export default selectedItem.reducer;
```

## Hook Patterns

### Utility Hook (no React state)

```typescript
export const useSessionData = () => {
  const getSessionFields = (session: ExtendedSession | null) => ({
    isAuthenticated: !!session?.accessToken,
    organizationId: session?.organizationId ?? '',
    roles: session?.roles ?? [],
  });
  return { getSessionFields };
};
```

### Hook with Effect + Cleanup

```typescript
export const useWebSocketMembers = (socket: WebSocket, channelId: string) => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => { /* update members */ };
    socket.addEventListener('message', handleMessage);
    return () => socket.removeEventListener('message', handleMessage);
  }, [socket, channelId]);

  return { members };
};
```

### Context Hook with Guard

```typescript
const SelectedRoom = createContext<Room | null>(null);
export const SelectedRoomProvider = SelectedRoom.Provider;

export function useSelectedRoom(): Room {
  const room = useContext(SelectedRoom);
  if (!room) throw new Error('Room not found!');
  return room;
}
```

## forwardRef + useImperativeHandle

```typescript
'use client';
import { forwardRef, Ref, useImperativeHandle } from 'react';

const SearchField = forwardRef((props: ISearchFieldProps, ref: Ref<ICustomSearchFieldRef>) => {
  useImperativeHandle(ref, () => ({
    setValue: setSearchValue,
    focus: () => inputRef.current?.focus(),
  }));
  return <TextField {...textFieldProps} />;
});
SearchField.displayName = 'SearchField';  // Always set for DevTools
```
