/**
 * Column-based layout for React Flow
 * Each entity type gets its own vertical column:
 *   Packages → Agents → Commands → Skills
 * Nodes sorted by connection count (desc) within each column.
 */

import type { GraphNode, Edge as GraphEdge } from '../types/graph';
import type { Node as RFNode, Edge as RFEdge } from 'reactflow';

// Layout constants
const NODE_WIDTH = 200;
const NODE_HEIGHT = 56;
const COLUMN_GAP = 120;
const ROW_GAP = 12;
const MARGIN = 40;

// Column order: left → right
const COLUMN_ORDER: GraphNode['type'][] = [
  'package',
  'agent',
  'command',
  'skill',
];

// Edge style config by type
const EDGE_STYLES: Record<
  string,
  { stroke: string; strokeDasharray?: string; opacity: number }
> = {
  'skill-dependency': { stroke: '#4ec9b0', opacity: 0.5 },
  'command-invocation': {
    stroke: '#f59e0b',
    strokeDasharray: '6 3',
    opacity: 0.5,
  },
  'package-provides': {
    stroke: '#8b5cf6',
    strokeDasharray: '3 3',
    opacity: 0.3,
  },
  'profile-includes': {
    stroke: '#6b7280',
    strokeDasharray: '3 3',
    opacity: 0.2,
  },
  'same-type-hierarchy': {
    stroke: '#60a5fa',
    strokeDasharray: '4 2',
    opacity: 0.6,
  },
};

function getNodeId(node: GraphNode): string {
  if ('id' in node.data) return node.data.id;
  return node.data.name;
}

/** Construct a unique key for a node, matching the namespaced key from GraphBuilder */
function nodeKey(type: string, id: string): string {
  return `${type}:${id}`;
}

export interface LayoutResult {
  nodes: RFNode[];
  edges: RFEdge[];
}

/**
 * Apply column-based layout to graph nodes and edges.
 * Each entity type is placed in its own vertical column.
 * Returns React Flow compatible nodes with positions and styled edges.
 */
export function applyDagreLayout(
  graphNodes: GraphNode[],
  graphEdges: GraphEdge[]
): LayoutResult {
  // Group nodes by type
  const columns = new Map<string, GraphNode[]>();
  for (const type of COLUMN_ORDER) {
    columns.set(type, []);
  }
  for (const node of graphNodes) {
    const col = columns.get(node.type);
    if (col) col.push(node);
  }

  // Count connections per node (edges where node is source or target)
  const connectionCount = new Map<string, number>();
  const nodeKeySet = new Set<string>();
  for (const node of graphNodes) {
    const key = nodeKey(node.type, getNodeId(node));
    nodeKeySet.add(key);
    connectionCount.set(key, 0);
  }
  for (const edge of graphEdges) {
    if (nodeKeySet.has(edge.source)) {
      connectionCount.set(edge.source, (connectionCount.get(edge.source) || 0) + 1);
    }
    if (nodeKeySet.has(edge.target)) {
      connectionCount.set(edge.target, (connectionCount.get(edge.target) || 0) + 1);
    }
  }

  // Sort each column: most connections first, alphabetical tiebreaker
  for (const [, nodes] of columns) {
    nodes.sort((a, b) => {
      const keyA = nodeKey(a.type, getNodeId(a));
      const keyB = nodeKey(b.type, getNodeId(b));
      const countDiff = (connectionCount.get(keyB) || 0) - (connectionCount.get(keyA) || 0);
      if (countDiff !== 0) return countDiff;
      return a.data.name.localeCompare(b.data.name);
    });
  }

  // Position nodes in columns
  const rfNodes: RFNode[] = [];

  for (let colIdx = 0; colIdx < COLUMN_ORDER.length; colIdx++) {
    const type = COLUMN_ORDER[colIdx];
    const colNodes = columns.get(type) || [];
    const x = MARGIN + colIdx * (NODE_WIDTH + COLUMN_GAP);

    for (let rowIdx = 0; rowIdx < colNodes.length; rowIdx++) {
      const node = colNodes[rowIdx];
      const id = nodeKey(node.type, getNodeId(node));
      const y = MARGIN + rowIdx * (NODE_HEIGHT + ROW_GAP);

      rfNodes.push({
        id,
        type: node.type,
        data: {
          ...node.data,
          nodeType: node.type,
          connections: node.connections,
        },
        position: { x, y },
        sourcePosition: 'right',
        targetPosition: 'left',
      } as RFNode);
    }
  }

  // Convert edges with styles (only where both endpoints exist)
  const rfEdges: RFEdge[] = graphEdges
    .filter(
      (edge) => nodeKeySet.has(edge.source) && nodeKeySet.has(edge.target)
    )
    .map((edge) => {
      const styleConfig =
        EDGE_STYLES[edge.type] || EDGE_STYLES['profile-includes'];
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: styleConfig.stroke,
          strokeWidth: 1.5,
          opacity: styleConfig.opacity,
          strokeDasharray: styleConfig.strokeDasharray,
        },
      };
    });

  return { nodes: rfNodes, edges: rfEdges };
}
