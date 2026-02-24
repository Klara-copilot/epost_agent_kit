'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { LoadedData } from '@/lib/types/entities';
import { GraphNode, Edge } from '@/lib/types/graph';
import Link from 'next/link';
import FlowCanvas from './_components/FlowCanvas';

interface ApiResponse {
  success: boolean;
  data?: LoadedData;
  graph?: {
    nodes: GraphNode[];
    edges: Edge[];
  };
  stats?: {
    totalNodes: number;
    totalEdges: number;
  };
  error?: string;
}

function getNodeId(node: GraphNode): string {
  if ('id' in node.data) return node.data.id;
  return node.data.name; // Package uses name
}

function getNodeDescription(node: GraphNode): string | undefined {
  return node.data.description;
}

export default function CanvasPage() {
  const [data, setData] = useState<LoadedData | null>(null);
  const [graph, setGraph] = useState<{ nodes: GraphNode[]; edges: Edge[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['agents', 'skills', 'commands', 'packages'])
  );

  // Escape key exits focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusedNodeId) {
        setFocusedNodeId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedNodeId]);

  const handleNodeSelect = useCallback((rfNodeId: string | null) => {
    if (!rfNodeId) {
      setSelectedNode(null);
      setFocusedNodeId(null);
      return;
    }
    if (!graph) return;
    const node = graph.nodes.find(
      (n) => `${n.type}:${getNodeId(n)}` === rfNodeId
    );
    if (node) setSelectedNode(node);
  }, [graph]);

  const handleNodeFocus = useCallback((rfNodeId: string) => {
    setFocusedNodeId(rfNodeId);
    if (!graph) return;
    const node = graph.nodes.find(
      (n) => `${n.type}:${getNodeId(n)}` === rfNodeId
    );
    if (node) setSelectedNode(node);
  }, [graph]);



  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/data');
        const result: ApiResponse = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to load data');
        }

        setData(result.data || null);
        setGraph(result.graph || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const filterItems = <T extends { id: string; name: string }>(items: T[]): T[] => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto" style={{ borderColor: 'var(--accent-blue)' }}></div>
          <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Loading canvas...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !graph) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#ef4444' }}>Error Loading Canvas</h1>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>{error || 'No data available'}</p>
          <Link href="/" style={{ color: 'var(--accent-blue)' }} className="hover:opacity-80">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-darker)', borderBottom: `1px solid var(--border)` }}>
        <div className="flex items-center gap-4">
          <Link href="/" className="transition-colors" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }}>
            ← Home
          </Link>
          <h1 className="text-xl font-bold">System Canvas</h1>
        </div>
        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {focusedNodeId && (
            <button
              onClick={() => setFocusedNodeId(null)}
              className="text-xs font-medium px-3 py-1.5 rounded cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-blue)',
                color: '#fff',
                border: 'none',
              }}
            >
              Exit Focus (Esc)
            </button>
          )}
          <span>{graph.nodes.length} nodes</span>
          <span>{graph.edges.length} edges</span>
        </div>
      </header>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Collections Panel */}
        <div className="overflow-y-auto" style={{ width: '250px', backgroundColor: 'var(--bg-panel)', borderRight: `1px solid var(--border)` }}>
          <div className="p-4 space-y-2">
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="⌕ Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded transition-colors"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  border: `1px solid var(--border)`,
                  color: 'var(--text-primary)',
                  transition: 'var(--transition-fast)',
                }}
              />
            </div>

            <CollectionSection
              title="Agents"
              icon="📁"
              count={data.agents.length}
              items={filterItems(data.agents.map(a => ({ id: a.id, name: a.name, type: 'agent' as const })))}
              expanded={expandedSections.has('agents')}
              onToggle={() => toggleSection('agents')}
              onSelect={(id) => {
                const node = graph.nodes.find(n => getNodeId(n) === id);
                if (node) setSelectedNode(node);
              }}
              selectedId={selectedNode ? getNodeId(selectedNode) : null}
              colorClass="agent"
            />
            <CollectionSection
              title="Skills"
              icon="📁"
              count={data.skills.length}
              items={filterItems(data.skills.map(s => ({ id: s.id, name: s.name, type: 'skill' as const })))}
              expanded={expandedSections.has('skills')}
              onToggle={() => toggleSection('skills')}
              onSelect={(id) => {
                const node = graph.nodes.find(n => getNodeId(n) === id);
                if (node) setSelectedNode(node);
              }}
              selectedId={selectedNode ? getNodeId(selectedNode) : null}
              colorClass="skill"
            />
            <CollectionSection
              title="Commands"
              icon="📁"
              count={data.commands.length}
              items={filterItems(data.commands.map(c => ({ id: c.id, name: c.name, type: 'command' as const })))}
              expanded={expandedSections.has('commands')}
              onToggle={() => toggleSection('commands')}
              onSelect={(id) => {
                const node = graph.nodes.find(n => getNodeId(n) === id);
                if (node) setSelectedNode(node);
              }}
              selectedId={selectedNode ? getNodeId(selectedNode) : null}
              colorClass="command"
            />
            <CollectionSection
              title="Packages"
              icon="📁"
              count={data.packages.length}
              items={filterItems(data.packages.map(p => ({ id: p.name, name: p.name, type: 'package' as const })))}
              expanded={expandedSections.has('packages')}
              onToggle={() => toggleSection('packages')}
              onSelect={(id) => {
                const node = graph.nodes.find(n => n.data.name === id);
                if (node) setSelectedNode(node);
              }}
              selectedId={selectedNode ? getNodeId(selectedNode) : null}
              colorClass="package"
            />
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 relative" style={{ backgroundColor: 'var(--bg-main)' }}>
          <ReactFlowProvider>
            <FlowCanvas
              graphNodes={graph.nodes}
              graphEdges={graph.edges}
              selectedNodeId={selectedNode ? `${selectedNode.type}:${getNodeId(selectedNode)}` : null}
              focusedNodeId={focusedNodeId}
              onNodeSelect={handleNodeSelect}
              onNodeFocus={handleNodeFocus}
            />
          </ReactFlowProvider>
        </div>

        {/* Right: Properties Panel */}
        <div className="overflow-y-auto" style={{ width: '300px', backgroundColor: 'var(--bg-panel)', borderLeft: `1px solid var(--border)` }}>
          {selectedNode ? (
            <div className="p-4 space-y-4">
              <div>
                <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Type</div>
                <div className="text-lg font-semibold capitalize">{selectedNode.type}</div>
              </div>
              <div>
                <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Name</div>
                <div className="text-lg">{selectedNode.data.name}</div>
              </div>
              <div>
                <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>ID</div>
                <div className="text-sm font-mono" style={{ color: 'var(--accent-teal)' }}>{getNodeId(selectedNode)}</div>
              </div>
              {getNodeDescription(selectedNode) && (
                <div>
                  <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Description</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{getNodeDescription(selectedNode)}</div>
                </div>
              )}
              <ConnectionsSection
                selectedNode={selectedNode}
                graph={graph}
                getNodeId={getNodeId}
              />
              <div>
                <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Details</div>
                <pre className="text-xs p-3 rounded overflow-auto max-h-96 font-mono" style={{ backgroundColor: 'var(--bg-main)' }}>
                  {JSON.stringify(selectedNode.data, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
              <p>Select a node to view properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CollectionSection({
  title,
  icon,
  count,
  items,
  expanded,
  onToggle,
  onSelect,
  selectedId,
  colorClass,
}: {
  title: string;
  icon: string;
  count: number;
  items: Array<{ id: string; name: string; type: string }>;
  expanded: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
  colorClass: 'agent' | 'skill' | 'command' | 'package';
}) {
  const colors = {
    agent: { bg: 'rgba(0, 122, 204, 0.15)', text: '#4ec9b0', border: 'rgba(0, 122, 204, 0.3)' },
    skill: { bg: 'rgba(78, 201, 176, 0.15)', text: '#4ec9b0', border: 'rgba(78, 201, 176, 0.3)' },
    command: { bg: 'rgba(255, 165, 0, 0.15)', text: '#dcdcaa', border: 'rgba(255, 165, 0, 0.3)' },
    package: { bg: 'rgba(197, 134, 192, 0.15)', text: '#c586c0', border: 'rgba(197, 134, 192, 0.3)' },
  };

  const color = colors[colorClass];

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-sm font-semibold mb-2 transition-colors"
        style={{
          color: 'var(--text-secondary)',
          transition: 'var(--transition-fast)',
        }}
      >
        <span className="flex items-center gap-2">
          <span>{icon}</span>
          <span>{title}</span>
          <span style={{ color: 'var(--text-tertiary)' }}>({count})</span>
        </span>
        <span style={{ color: 'var(--text-tertiary)' }}>{expanded ? '▼' : '▶'}</span>
      </button>
      {expanded && (
        <div className="space-y-1" style={{ paddingLeft: 'var(--space-xl)' }}>
          {items.map((item) => {
            const isSelected = selectedId === item.id;
            const showId = item.id !== item.name; // Only show ID if different from name
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="w-full text-left px-3 py-2 rounded text-sm border transition-all"
                style={{
                  backgroundColor: isSelected ? 'var(--accent-blue-select)' : color.bg,
                  color: isSelected ? 'var(--text-primary)' : color.text,
                  borderColor: isSelected ? 'var(--accent-blue)' : color.border,
                  transition: 'var(--transition-fast)',
                }}
              >
                <div className="font-medium truncate flex items-center gap-2">
                  <span>🔹</span>
                  <span>{item.name}</span>
                </div>
                {showId && (
                  <div className="text-xs opacity-70 truncate font-mono" style={{ paddingLeft: '20px' }}>{item.id}</div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const EDGE_TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  'skill-dependency': { label: 'Skills', color: '#4ec9b0', icon: '⚡' },
  'command-invocation': { label: 'Commands', color: '#f59e0b', icon: '▶' },
  'package-provides': { label: 'Packages', color: '#8b5cf6', icon: '📦' },
  'profile-includes': { label: 'Profiles', color: '#6b7280', icon: '📋' },
  'same-type-hierarchy': { label: 'Hierarchy', color: '#60a5fa', icon: '🔗' },
};

function ConnectionsSection({
  selectedNode,
  graph,
  getNodeId: getNodeIdFn,
}: {
  selectedNode: GraphNode;
  graph: { nodes: GraphNode[]; edges: Edge[] };
  getNodeId: (node: GraphNode) => string;
}) {
  const connections = useMemo(() => {
    const nodeKey = `${selectedNode.type}:${getNodeIdFn(selectedNode)}`;

    // Build a lookup from node key to GraphNode
    const nodeByKey = new Map<string, GraphNode>();
    for (const n of graph.nodes) {
      nodeByKey.set(`${n.type}:${getNodeIdFn(n)}`, n);
    }

    // Find all edges connected to this node
    const grouped: Record<string, Array<{ direction: 'in' | 'out'; node: GraphNode; edgeType: string }>> = {};

    for (const edge of graph.edges) {
      let otherKey: string | null = null;
      let direction: 'in' | 'out' = 'out';

      if (edge.source === nodeKey) {
        otherKey = edge.target;
        direction = 'out';
      } else if (edge.target === nodeKey) {
        otherKey = edge.source;
        direction = 'in';
      }

      if (otherKey) {
        const otherNode = nodeByKey.get(otherKey);
        if (otherNode) {
          if (!grouped[edge.type]) grouped[edge.type] = [];
          grouped[edge.type].push({ direction, node: otherNode, edgeType: edge.type });
        }
      }
    }

    return grouped;
  }, [selectedNode, graph, getNodeIdFn]);

  const edgeTypes = Object.keys(connections);

  if (edgeTypes.length === 0) {
    return (
      <div>
        <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Connections</div>
        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No connections</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-xs uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>
        Connections ({edgeTypes.reduce((sum, t) => sum + connections[t].length, 0)})
      </div>
      <div className="space-y-3">
        {edgeTypes.map((edgeType) => {
          const config = EDGE_TYPE_LABELS[edgeType] || { label: edgeType, color: '#858585', icon: '·' };
          const items = connections[edgeType];
          return (
            <div key={edgeType}>
              <div className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: config.color }}>
                <span>{config.icon}</span>
                <span>{config.label}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>({items.length})</span>
              </div>
              <div className="space-y-1" style={{ paddingLeft: '16px' }}>
                {items.map((item, idx) => (
                  <div
                    key={`${edgeType}-${idx}`}
                    className="text-xs flex items-center gap-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
                      {item.direction === 'out' ? '→' : '←'}
                    </span>
                    <span className="capitalize" style={{ color: 'var(--text-tertiary)', minWidth: '48px' }}>
                      {item.node.type}
                    </span>
                    <span className="font-mono truncate">{item.node.data.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
