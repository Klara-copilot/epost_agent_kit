/**
 * Focus mode utilities for React Flow canvas.
 * Given a focused node, computes which nodes and edges should be visible.
 */

import type { Edge as RFEdge } from 'reactflow';

/**
 * Get all node IDs directly connected to the focused node (depth 1).
 * Traverses edges bidirectionally — includes both sources and targets.
 */
export function getConnectedNodeIds(
  focusedNodeId: string,
  edges: RFEdge[]
): Set<string> {
  const connected = new Set<string>();
  connected.add(focusedNodeId);

  for (const edge of edges) {
    if (edge.source === focusedNodeId) {
      connected.add(edge.target);
    }
    if (edge.target === focusedNodeId) {
      connected.add(edge.source);
    }
  }

  return connected;
}

/**
 * Get edge IDs where both endpoints are in the visible node set.
 */
export function getVisibleEdgeIds(
  edges: RFEdge[],
  visibleNodeIds: Set<string>
): Set<string> {
  const visibleEdges = new Set<string>();

  for (const edge of edges) {
    if (visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)) {
      visibleEdges.add(edge.id);
    }
  }

  return visibleEdges;
}
