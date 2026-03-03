import { createContext, useContext } from 'react';
import type { SkillLayer } from '@/lib/services/SkillChainResolver';

interface FocusContextValue {
  visibleNodeIds: Set<string> | null; // null = no focus mode
  /** Maps skill node ID (e.g. "skill:debugging") → layer for styling */
  skillLayerMap: Map<string, SkillLayer> | null;
  /** Whether the focused node is an agent (enables chain visualization) */
  focusedAgentId: string | null;
}

export const FocusContext = createContext<FocusContextValue>({
  visibleNodeIds: null,
  skillLayerMap: null,
  focusedAgentId: null,
});

export function useFocusContext() {
  return useContext(FocusContext);
}
