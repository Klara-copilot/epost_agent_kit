import { createContext, useContext } from 'react';

interface FocusContextValue {
  visibleNodeIds: Set<string> | null; // null = no focus mode
}

export const FocusContext = createContext<FocusContextValue>({
  visibleNodeIds: null,
});

export function useFocusContext() {
  return useContext(FocusContext);
}
