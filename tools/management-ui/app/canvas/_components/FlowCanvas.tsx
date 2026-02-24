'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  ConnectionLineType,
  type NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { AgentNode, SkillNode, CommandNode, PackageNode } from './nodes';
import { FocusContext } from './FocusContext';
import { applyDagreLayout } from '@/lib/layout/dagre';
import { getConnectedNodeIds, getVisibleEdgeIds } from '@/lib/layout/focus';
import type { GraphNode, Edge as GraphEdge } from '@/lib/types/graph';

const nodeTypes = {
  agent: AgentNode,
  skill: SkillNode,
  command: CommandNode,
  package: PackageNode,
};

interface FlowCanvasProps {
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  selectedNodeId: string | null;
  focusedNodeId: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  onNodeFocus: (nodeId: string) => void;
}

export default function FlowCanvas({
  graphNodes,
  graphEdges,
  selectedNodeId,
  focusedNodeId,
  onNodeSelect,
  onNodeFocus,
}: FlowCanvasProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const { fitView } = useReactFlow();

  // Run column layout once when data changes
  const layout = useMemo(
    () => applyDagreLayout(graphNodes, graphEdges),
    [graphNodes, graphEdges]
  );

  const { nodes: layoutNodes, edges: layoutEdges } = layout;

  // Compute focus state: which nodes and edges are visible
  const focusState = useMemo(() => {
    if (!focusedNodeId) return null;
    const visibleNodes = getConnectedNodeIds(focusedNodeId, layoutEdges);
    const visibleEdges = getVisibleEdgeIds(layoutEdges, visibleNodes);
    return { visibleNodes, visibleEdges };
  }, [focusedNodeId, layoutEdges]);

  // Fit view to focused nodes when entering focus mode
  useEffect(() => {
    if (focusedNodeId && focusState) {
      const timer = setTimeout(() => {
        fitView({
          nodes: layoutNodes.filter((n) => focusState.visibleNodes.has(n.id)),
          padding: 0.3,
          duration: 300,
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [focusedNodeId, focusState, fitView, layoutNodes]);

  // Nodes: apply selection only (focus opacity handled by FocusContext inside node components)
  const displayNodes = useMemo(() => {
    return layoutNodes.map((node) => {
      const isSelected = node.id === selectedNodeId;
      return {
        ...node,
        selected: isSelected,
      };
    });
  }, [layoutNodes, selectedNodeId]);

  // Edges: focus filtering + hover highlighting
  const displayEdges = useMemo(() => {
    return layoutEdges.map((edge) => {
      // Focus mode: hide edges not in the chain
      const isVisible = focusState
        ? focusState.visibleEdges.has(edge.id)
        : true;

      if (!isVisible) {
        return {
          ...edge,
          style: { ...edge.style, opacity: 0 },
          animated: false,
        };
      }

      // Hover highlighting on visible edges
      const isHoverConnected =
        hoveredNodeId &&
        (edge.source === hoveredNodeId || edge.target === hoveredNodeId);

      if (isHoverConnected) {
        return {
          ...edge,
          style: {
            ...edge.style,
            opacity: 1,
            strokeWidth: 2.5,
          },
          animated: true,
        };
      }

      // In focus mode, boost base opacity of visible edges
      if (focusState) {
        return {
          ...edge,
          style: {
            ...edge.style,
            opacity: Math.max((edge.style?.opacity as number) || 0.5, 0.6),
          },
        };
      }

      return edge;
    });
  }, [layoutEdges, hoveredNodeId, focusState]);

  // Single click: select (+ re-focus if already in focus mode)
  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      onNodeSelect(node.id);
      if (focusedNodeId) {
        onNodeFocus(node.id);
      }
    },
    [onNodeSelect, onNodeFocus, focusedNodeId]
  );

  // Double click: enter focus mode
  const onNodeDoubleClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      onNodeFocus(node.id);
    },
    [onNodeFocus]
  );

  const onNodeMouseEnter: NodeMouseHandler = useCallback((_event, node) => {
    setHoveredNodeId(node.id);
  }, []);

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  const focusContextValue = useMemo(
    () => ({ visibleNodeIds: focusState?.visibleNodes ?? null }),
    [focusState]
  );

  return (
    <FocusContext.Provider value={focusContextValue}>
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={() => {}}
        onEdgesChange={() => {}}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnDoubleClick={false}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Controls
          showInteractive={false}
          style={{ background: '#2d2d2d', borderColor: '#3e3e42' }}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#3e3e42"
        />
      </ReactFlow>
    </FocusContext.Provider>
  );
}
