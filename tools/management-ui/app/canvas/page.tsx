'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { ReactFlowProvider, type Connection } from 'reactflow';
import { LoadedData } from '@/lib/types/entities';
import { GraphNode, Edge } from '@/lib/types/graph';
import Link from 'next/link';
import FlowCanvas from './_components/FlowCanvas';
import DesignPanel from './_components/DesignPanel';
import { resolveSkillChain, resolveGlobalSkillChain, type SkillChain, type GlobalSkillChain } from '@/lib/services/SkillChainResolver';

export interface DesignEdge {
  id: string;
  source: string; // "agent:epost-web-developer"
  target: string; // "skill:web/figma"
  action: 'add' | 'remove';
}

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
  const [designMode, setDesignMode] = useState(false);
  const [designEdges, setDesignEdges] = useState<DesignEdge[]>([]);
  const [viewMode, setViewMode] = useState<'full' | 'chain' | 'discovery'>('full');
  const [discoveryAgentId, setDiscoveryAgentId] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

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
      // Do NOT clear focusedNodeId — only the Exit button / Escape key should do that
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

  // Discovery mode node select: works with skill names directly
  const handleDiscoveryNodeSelect = useCallback((rfNodeId: string | null) => {
    if (!rfNodeId) {
      setSelectedNode(null);
      return;
    }
    if (!graph) return;
    // Try to find the node by matching the rfNodeId pattern
    const node = graph.nodes.find(
      (n) => `${n.type}:${getNodeId(n)}` === rfNodeId ||
             `${n.type}:${n.data.name}` === rfNodeId
    );
    if (node) setSelectedNode(node);
  }, [graph]);

  const handleDesignModeToggle = useCallback(() => {
    setDesignMode(v => !v);
  }, []);

  const handleConnect = useCallback((params: Connection) => {
    const { source, target } = params;
    if (!source || !target) return;
    // Only allow agent→skill connections
    const [sourceType] = source.split(':');
    const [targetType] = target.split(':');
    if (sourceType !== 'agent' || targetType !== 'skill') return;
    // Don't duplicate existing graph edges
    if (graph?.edges.some(e => e.source === source && e.target === target)) return;
    setDesignEdges(prev => {
      if (prev.some(e => e.source === source && e.target === target && e.action === 'add')) return prev;
      return [...prev, { id: `design-add-${source}-${target}`, source, target, action: 'add' }];
    });
  }, [graph]);

  const handleDesignEdgeRemove = useCallback((edgeId: string, source: string, target: string) => {
    const isCustomAdd = designEdges.some(e => e.id === edgeId && e.action === 'add');
    if (isCustomAdd) {
      setDesignEdges(prev => prev.filter(e => e.id !== edgeId));
    } else {
      // Mark original edge as removed
      setDesignEdges(prev => {
        if (prev.some(e => e.source === source && e.target === target && e.action === 'remove')) return prev;
        return [...prev, { id: `design-remove-${source}-${target}`, source, target, action: 'remove' }];
      });
    }
  }, [designEdges]);

  const handleClearDesign = useCallback(() => {
    setDesignEdges([]);
  }, []);

  const handleExportDesign = useCallback(() => {
    const byAgent: Record<string, { added: string[]; removed: string[] }> = {};
    for (const edge of designEdges) {
      const agentId = edge.source.replace('agent:', '');
      const skillId = edge.target.replace('skill:', '');
      if (!byAgent[agentId]) byAgent[agentId] = { added: [], removed: [] };
      if (edge.action === 'add') byAgent[agentId].added.push(skillId);
      else byAgent[agentId].removed.push(skillId);
    }
    const output = { version: '1.0', generated: new Date().toISOString(), changes: byAgent };
    const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas-design.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [designEdges]);

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

  // Compute skill chain when an agent is focused
  const skillChain = useMemo<SkillChain | null>(() => {
    if (!focusedNodeId?.startsWith('agent:') || !data) return null;
    const agentId = focusedNodeId.replace('agent:', '');
    const agent = data.agents.find(a => a.id === agentId);
    if (!agent) return null;
    return resolveSkillChain(agent, data.skills);
  }, [focusedNodeId, data]);

  // Compute global skill chain for chain view mode
  const globalChain = useMemo<GlobalSkillChain | null>(() => {
    if (viewMode !== 'chain' || !data) return null;
    return resolveGlobalSkillChain(data.agents, data.skills);
  }, [viewMode, data]);

  // Discovery mode: resolve chain for selected agent
  const discoveryAgent = useMemo(() => {
    if (viewMode !== 'discovery' || !data || !discoveryAgentId) return null;
    return data.agents.find(a => a.id === discoveryAgentId) || null;
  }, [viewMode, data, discoveryAgentId]);

  const discoveryChain = useMemo<SkillChain | null>(() => {
    if (!discoveryAgent || !data) return null;
    return resolveSkillChain(discoveryAgent, data.skills);
  }, [discoveryAgent, data]);

  // Auto-select first agent when entering discovery mode
  useEffect(() => {
    if (viewMode === 'discovery' && !discoveryAgentId && data?.agents.length) {
      setDiscoveryAgentId(data.agents[0].id);
    }
  }, [viewMode, discoveryAgentId, data]);

  // Filter graph for chain and discovery view modes
  const filteredGraph = useMemo(() => {
    if (!graph || viewMode === 'full') return graph;

    // Discovery mode: show one agent + its skill chain filtered by platform
    if (viewMode === 'discovery' && discoveryChain && discoveryAgentId) {
      // Collect visible skill names
      const visibleSkills = new Set<string>();

      // Always include declared + affinity
      for (const e of discoveryChain.declared) visibleSkills.add(e.skillName);
      for (const e of discoveryChain.affinity) visibleSkills.add(e.skillName);

      // Platform skills: filter by selected platform or show all
      for (const pc of discoveryChain.platformChains) {
        if (!selectedPlatform || selectedPlatform === pc.platform) {
          for (const e of pc.skills) visibleSkills.add(e.skillName);
        }
      }

      // Enhancers: only those enhancing visible skills
      for (const e of discoveryChain.enhancers) {
        if (visibleSkills.has(e.enhances)) {
          visibleSkills.add(e.skillName);
        }
      }

      // Build filtered nodes: agent + visible skills
      const filteredNodes = graph.nodes.filter((n) => {
        if (n.type === 'agent') return getNodeId(n) === discoveryAgentId;
        if (n.type === 'skill') return visibleSkills.has(n.data.name) || visibleSkills.has(getNodeId(n));
        return false;
      });

      const nodeKeys = new Set(filteredNodes.map((n) => `${n.type}:${getNodeId(n)}`));

      // Build edges from chain data (more precise than graph edges)
      const filteredEdges: Edge[] = [];
      const agentKey = `agent:${discoveryAgentId}`;
      const addedEdges = new Set<string>();

      // Agent → declared skill edges
      for (const e of discoveryChain.declared) {
        const targetKey = `skill:${e.skillName}`;
        if (nodeKeys.has(targetKey)) {
          const edgeKey = `${agentKey}-${targetKey}`;
          if (!addedEdges.has(edgeKey)) {
            addedEdges.add(edgeKey);
            // Check if original graph has this edge
            const existing = graph.edges.find(ge => ge.source === agentKey && ge.target === targetKey);
            filteredEdges.push(existing || {
              id: `declared:${agentKey}→${targetKey}`,
              source: agentKey,
              target: targetKey,
              type: 'skill-dependency',
            });
          }
        }
      }

      // Agent → affinity skill edges
      for (const e of discoveryChain.affinity) {
        const targetKey = `skill:${e.skillName}`;
        if (nodeKeys.has(targetKey)) {
          const edgeKey = `${agentKey}-${targetKey}`;
          if (!addedEdges.has(edgeKey)) {
            addedEdges.add(edgeKey);
            filteredEdges.push({
              id: `affinity:${agentKey}→${targetKey}`,
              source: agentKey,
              target: targetKey,
              type: 'skill-dependency',
              metadata: { isAffinity: true },
            });
          }
        }
      }

      // Agent → platform skill edges (direct ones)
      for (const pc of discoveryChain.platformChains) {
        if (selectedPlatform && selectedPlatform !== pc.platform) continue;
        for (const e of pc.skills) {
          const targetKey = `skill:${e.skillName}`;
          if (!nodeKeys.has(targetKey)) continue;
          if (e.loadedVia) {
            // Skill loaded via extends/requires — add edge from parent
            const sourceKey = `skill:${e.loadedVia.from}`;
            const edgeKey = `${sourceKey}-${targetKey}`;
            if (nodeKeys.has(sourceKey) && !addedEdges.has(edgeKey)) {
              addedEdges.add(edgeKey);
              filteredEdges.push({
                id: `${e.loadedVia.type}:${sourceKey}→${targetKey}`,
                source: sourceKey,
                target: targetKey,
                type: e.loadedVia.type === 'extends' ? 'skill-extends' : 'skill-requires',
              });
            }
            // Also add agent → parent if not already added
            const agentParentKey = `${agentKey}-${sourceKey}`;
            if (nodeKeys.has(sourceKey) && !addedEdges.has(agentParentKey)) {
              addedEdges.add(agentParentKey);
              filteredEdges.push({
                id: `platform:${agentKey}→${sourceKey}`,
                source: agentKey,
                target: sourceKey,
                type: 'skill-dependency',
              });
            }
          } else {
            // Direct platform skill
            const edgeKey = `${agentKey}-${targetKey}`;
            if (!addedEdges.has(edgeKey)) {
              addedEdges.add(edgeKey);
              filteredEdges.push({
                id: `platform:${agentKey}→${targetKey}`,
                source: agentKey,
                target: targetKey,
                type: 'skill-dependency',
              });
            }
          }
        }
      }

      // Enhancer → enhanced skill edges
      for (const e of discoveryChain.enhancers) {
        if (!visibleSkills.has(e.skillName)) continue;
        const sourceKey = `skill:${e.skillName}`;
        const targetKey = `skill:${e.enhances}`;
        if (nodeKeys.has(sourceKey) && nodeKeys.has(targetKey)) {
          const edgeKey = `${sourceKey}-${targetKey}`;
          if (!addedEdges.has(edgeKey)) {
            addedEdges.add(edgeKey);
            filteredEdges.push({
              id: `enhances:${sourceKey}→${targetKey}`,
              source: sourceKey,
              target: targetKey,
              type: 'skill-enhances',
            });
          }
        }
      }

      // Also keep any skill-extends/skill-requires edges from the original graph between visible skills
      for (const edge of graph.edges) {
        if (
          (edge.type === 'skill-extends' || edge.type === 'skill-requires' || edge.type === 'skill-enhances') &&
          nodeKeys.has(edge.source) && nodeKeys.has(edge.target)
        ) {
          const edgeKey = `${edge.source}-${edge.target}`;
          if (!addedEdges.has(edgeKey)) {
            addedEdges.add(edgeKey);
            filteredEdges.push(edge);
          }
        }
      }

      return { nodes: filteredNodes, edges: filteredEdges };
    }

    // Chain mode: only agents + skills
    const filteredNodes = graph.nodes.filter(
      (n) => n.type === 'agent' || n.type === 'skill'
    );
    const nodeKeys = new Set(
      filteredNodes.map((n) => `${n.type}:${getNodeId(n)}`)
    );

    // Keep existing edges between visible nodes
    const filteredEdges = graph.edges.filter(
      (e) => nodeKeys.has(e.source) && nodeKeys.has(e.target)
    );

    // Inject affinity edges from global chain
    if (globalChain) {
      for (const { agentId, skillName } of globalChain.affinityEdges) {
        const sourceKey = `agent:${agentId}`;
        const targetKey = `skill:${skillName}`;
        if (nodeKeys.has(sourceKey) && nodeKeys.has(targetKey)) {
          // Don't duplicate if already exists as skill-dependency
          const exists = filteredEdges.some(
            e => e.source === sourceKey && e.target === targetKey
          );
          if (!exists) {
            filteredEdges.push({
              id: `affinity:${sourceKey}→${targetKey}`,
              source: sourceKey,
              target: targetKey,
              type: 'skill-dependency', // Reuse type for layout compatibility
              metadata: { isAffinity: true },
            });
          }
        }
      }
    }

    return { nodes: filteredNodes, edges: filteredEdges };
  }, [graph, viewMode, globalChain, discoveryChain, discoveryAgentId, selectedPlatform]);

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
      <header className="px-6 py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-darker)', borderBottom: `1px solid var(--border)` }}>
        <div className="flex items-center gap-4">
          <Link href="/" className="transition-colors" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }}>
            ← Home
          </Link>
          <h1 className="text-xl font-bold">System Canvas</h1>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {focusedNodeId && viewMode !== 'discovery' && (
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
          {/* View mode toggles */}
          <ViewModeToggle label="Full" mode="full" current={viewMode} onChange={setViewMode} />
          <ViewModeToggle label="Skill Chain" mode="chain" current={viewMode} onChange={setViewMode} color="#4ec9b0" />
          <ViewModeToggle label="Discovery" mode="discovery" current={viewMode} onChange={setViewMode} color="#8b5cf6" />
          {viewMode !== 'discovery' && (
            <button
              onClick={handleDesignModeToggle}
              className="text-xs font-medium px-3 py-1.5 rounded cursor-pointer transition-colors"
              style={{
                backgroundColor: designMode ? '#16a34a' : 'var(--bg-main)',
                color: designMode ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${designMode ? '#16a34a' : 'var(--border)'}`,
              }}
            >
              {designMode ? 'Design ON' : 'Design'}
            </button>
          )}
          <span className="ml-1">{graph.nodes.length} nodes</span>
          <span>{graph.edges.length} edges</span>
        </div>
      </header>

      {/* Discovery mode: Agent selector bar */}
      {viewMode === 'discovery' && data && (
        <div className="px-6 py-2 flex items-center gap-4" style={{ backgroundColor: 'var(--bg-darker)', borderBottom: `1px solid var(--border)` }}>
          {/* Agent selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Agent:</span>
            <select
              value={discoveryAgentId || ''}
              onChange={(e) => {
                setDiscoveryAgentId(e.target.value);
                setSelectedPlatform(null);
                setSelectedNode(null);
              }}
              className="text-xs px-2 py-1.5 rounded"
              style={{
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            >
              {data.agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Chain stats */}
          {discoveryChain && (
            <div className="flex items-center gap-3 ml-auto text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <span style={{ color: '#10b981' }}>{discoveryChain.declared.length} declared</span>
              <span style={{ color: '#f59e0b' }}>{discoveryChain.affinity.length} affinity</span>
              <span style={{ color: '#f59e0b' }}>
                {discoveryChain.platformChains.reduce((s, p) => s + p.skills.length, 0)} platform
              </span>
              <span style={{ color: '#4ec9b0' }}>{discoveryChain.enhancers.length} enhancers</span>
            </div>
          )}
        </div>
      )}

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Collections Panel (hidden in discovery mode) */}
        {viewMode !== 'discovery' && (
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
        )}

        {/* Center: Canvas */}
        <div className="flex-1 relative" style={{ backgroundColor: 'var(--bg-main)' }}>
          <ReactFlowProvider>
            <FlowCanvas
              graphNodes={filteredGraph!.nodes}
              graphEdges={filteredGraph!.edges}
              selectedNodeId={selectedNode ? `${selectedNode.type}:${getNodeId(selectedNode)}` : null}
              focusedNodeId={viewMode === 'discovery' ? (discoveryAgentId ? `agent:${discoveryAgentId}` : null) : focusedNodeId}
              onNodeSelect={viewMode === 'discovery' ? handleDiscoveryNodeSelect : handleNodeSelect}
              onNodeFocus={handleNodeFocus}
              designMode={designMode}
              designEdges={designEdges}
              onConnect={handleConnect}
              onDesignEdgeRemove={handleDesignEdgeRemove}
              skillChain={viewMode === 'discovery' ? discoveryChain : skillChain}
              globalChain={globalChain}
            />
          </ReactFlowProvider>
          {designMode && (
            <DesignPanel
              designEdges={designEdges}
              onExport={handleExportDesign}
              onClear={handleClearDesign}
            />
          )}
          {viewMode === 'chain' && <ChainLegend />}
          {viewMode === 'discovery' && <DiscoveryLegend />}
        </div>

        {/* Right: Properties / Discovery Protocol Panel */}
        <div className="overflow-y-auto" style={{ width: '300px', backgroundColor: 'var(--bg-panel)', borderLeft: `1px solid var(--border)` }}>
          {viewMode === 'discovery' && discoveryChain ? (
            <DiscoveryProtocolPanel
              chain={discoveryChain}
              selectedPlatform={selectedPlatform}
              onPlatformSelect={setSelectedPlatform}
              selectedNode={selectedNode}
            />
          ) : selectedNode ? (
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
              {selectedNode.type === 'skill' && (
                <SkillMetadataSection node={selectedNode} />
              )}
              {selectedNode.type === 'agent' && skillChain && (
                <SkillChainSummary chain={skillChain} />
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

function ChainLegend() {
  const layers = [
    { label: 'Declared', color: '#10b981', style: 'solid' },
    { label: 'Affinity', color: '#f59e0b', style: 'dashed' },
    { label: 'Platform', color: '#f59e0b', style: 'dashed' },
    { label: 'Enhancer', color: '#4ec9b0', style: 'dotted' },
  ];
  const edges = [
    { label: 'Requires', color: '#ef4444', dash: '' },
    { label: 'Enhances', color: '#4ec9b0', dash: '8 4' },
    { label: 'Conflicts', color: '#ef4444', dash: '3 3' },
    { label: 'Extends', color: '#60a5fa', dash: '' },
    { label: 'Agent affinity', color: '#f59e0b', dash: '6 4' },
  ];

  return (
    <div
      className="absolute bottom-4 left-4 p-3 rounded-lg text-xs space-y-2"
      style={{ backgroundColor: 'rgba(30,30,30,0.92)', border: '1px solid var(--border)', zIndex: 10 }}
    >
      <div className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Skill Chain Legend</div>
      <div className="space-y-1">
        {layers.map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <span
              style={{
                width: 16,
                height: 4,
                display: 'inline-block',
                borderTop: `3px ${l.style} ${l.color}`,
              }}
            />
            <span style={{ color: 'var(--text-tertiary)' }}>{l.label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1" style={{ borderTop: '1px solid var(--border)', paddingTop: '4px' }}>
        {edges.map(e => (
          <div key={e.label} className="flex items-center gap-2">
            <svg width="16" height="4" style={{ flexShrink: 0 }}>
              <line
                x1="0" y1="2" x2="16" y2="2"
                stroke={e.color}
                strokeWidth="2"
                strokeDasharray={e.dash}
              />
            </svg>
            <span style={{ color: 'var(--text-tertiary)' }}>{e.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscoveryLegend() {
  const layers = [
    { label: 'Declared', color: '#10b981', style: 'solid' },
    { label: 'Affinity', color: '#f59e0b', style: 'dashed' },
    { label: 'Platform', color: '#f59e0b', style: 'dashed' },
    { label: 'Enhancer', color: '#4ec9b0', style: 'dotted' },
  ];
  const edges = [
    { label: 'Extends', color: '#60a5fa', dash: '' },
    { label: 'Requires', color: '#ef4444', dash: '' },
    { label: 'Enhances', color: '#4ec9b0', dash: '8 4' },
  ];

  return (
    <div
      className="absolute bottom-4 left-4 p-3 rounded-lg text-xs space-y-2"
      style={{ backgroundColor: 'rgba(30,30,30,0.92)', border: '1px solid var(--border)', zIndex: 10 }}
    >
      <div className="font-semibold" style={{ color: '#8b5cf6' }}>Discovery Layers</div>
      <div className="space-y-1">
        {layers.map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <span
              style={{
                width: 16,
                height: 4,
                display: 'inline-block',
                borderTop: `3px ${l.style} ${l.color}`,
              }}
            />
            <span style={{ color: 'var(--text-tertiary)' }}>{l.label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1" style={{ borderTop: '1px solid var(--border)', paddingTop: '4px' }}>
        {edges.map(e => (
          <div key={e.label} className="flex items-center gap-2">
            <svg width="16" height="4" style={{ flexShrink: 0 }}>
              <line
                x1="0" y1="2" x2="16" y2="2"
                stroke={e.color}
                strokeWidth="2"
                strokeDasharray={e.dash}
              />
            </svg>
            <span style={{ color: 'var(--text-tertiary)' }}>{e.label}</span>
          </div>
        ))}
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
  'skill-extends': { label: 'Extends', color: '#60a5fa', icon: '↑' },
  'skill-requires': { label: 'Requires', color: '#ef4444', icon: '◆' },
  'skill-enhances': { label: 'Enhances', color: '#4ec9b0', icon: '✦' },
  'skill-conflicts': { label: 'Conflicts', color: '#ef4444', icon: '✕' },
};

function SkillChainSummary({ chain }: { chain: SkillChain }) {
  return (
    <div>
      <div className="text-xs uppercase mb-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
        Skill Loading Chain
      </div>
      <div className="space-y-3">
        {/* Declared */}
        <div>
          <div className="text-xs font-medium flex items-center gap-1 mb-1" style={{ color: '#10b981' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span>Declared</span>
            <span style={{ color: 'var(--text-tertiary)' }}>({chain.declared.length})</span>
          </div>
          <div className="space-y-0.5" style={{ paddingLeft: '16px' }}>
            {chain.declared.map(e => (
              <div key={e.skillName} className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                {e.skillName}
              </div>
            ))}
          </div>
        </div>

        {/* Affinity */}
        {chain.affinity.length > 0 && (
          <div>
            <div className="text-xs font-medium flex items-center gap-1 mb-1" style={{ color: '#f59e0b' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'transparent', border: '2px solid #f59e0b', display: 'inline-block' }} />
              <span>Discoverable</span>
              <span style={{ color: 'var(--text-tertiary)' }}>({chain.affinity.length})</span>
            </div>
            <div className="space-y-0.5" style={{ paddingLeft: '16px' }}>
              {chain.affinity.map(e => (
                <div key={e.skillName} className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {e.skillName}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platform Chains */}
        {chain.platformChains.length > 0 && (
          <div>
            <div className="text-xs font-medium flex items-center gap-1 mb-1" style={{ color: '#f59e0b' }}>
              <span>Platform Chains</span>
            </div>
            <div className="space-y-2" style={{ paddingLeft: '8px' }}>
              {chain.platformChains.map(pc => (
                <div key={pc.platform}>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {pc.platform.charAt(0).toUpperCase() + pc.platform.slice(1)}
                  </div>
                  <div className="space-y-0.5" style={{ paddingLeft: '12px' }}>
                    {pc.skills.map(e => (
                      <div key={e.skillName} className="text-xs font-mono flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                        {e.loadedVia ? (
                          <>
                            <span style={{ color: e.loadedVia.type === 'extends' ? '#60a5fa' : '#ef4444', fontSize: '10px' }}>
                              {e.loadedVia.type === 'extends' ? '↑' : '◆'}
                            </span>
                            <span>{e.skillName}</span>
                            <span style={{ fontSize: '9px', color: 'var(--text-tertiary)' }}>
                              ({e.loadedVia.type} {e.loadedVia.from})
                            </span>
                          </>
                        ) : (
                          <span>{e.skillName}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhancers */}
        {chain.enhancers.length > 0 && (
          <div>
            <div className="text-xs font-medium flex items-center gap-1 mb-1" style={{ color: '#4ec9b0' }}>
              <span>Enhancers</span>
              <span style={{ color: 'var(--text-tertiary)' }}>({chain.enhancers.length})</span>
            </div>
            <div className="space-y-0.5" style={{ paddingLeft: '16px' }}>
              {chain.enhancers.map(e => (
                <div key={e.skillName} className="text-xs font-mono flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                  <span style={{ color: '#4ec9b0', fontSize: '10px' }}>✦</span>
                  <span>{e.skillName}</span>
                  <span style={{ fontSize: '9px' }}>enhances {e.enhances}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SkillMetadataSection({ node }: { node: GraphNode }) {
  if (node.type !== 'skill') return null;
  const data = node.data;
  const tier = data.tier;
  const connections = data.connections;

  const hasAnyConnection = connections && (
    connections.extends?.length ||
    connections.requires?.length ||
    connections.enhances?.length ||
    connections.conflicts?.length
  );

  return (
    <div className="space-y-3">
      {/* Tier */}
      {tier && (
        <div>
          <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Tier</div>
          <div className="flex items-center gap-2">
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                display: 'inline-block',
                background: tier === 'core' ? '#10b981' : 'transparent',
                border: tier === 'core' ? '2px solid #10b981' : '2px solid #f59e0b',
              }}
            />
            <span className="text-sm font-medium" style={{ color: tier === 'core' ? '#10b981' : '#f59e0b' }}>
              {tier === 'core' ? 'Core (always loaded)' : 'Discoverable (lazy-loaded)'}
            </span>
          </div>
        </div>
      )}

      {/* Skill Connections */}
      {hasAnyConnection && (
        <div>
          <div className="text-xs uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>Skill Connections</div>
          <div className="space-y-2">
            {connections!.requires?.length ? (
              <SkillConnectionList label="Requires" items={connections!.requires!} color="#ef4444" icon="◆" />
            ) : null}
            {connections!.enhances?.length ? (
              <SkillConnectionList label="Enhances" items={connections!.enhances!} color="#4ec9b0" icon="✦" />
            ) : null}
            {connections!.conflicts?.length ? (
              <SkillConnectionList label="Conflicts" items={connections!.conflicts!} color="#ef4444" icon="✕" />
            ) : null}
            {connections!.extends?.length ? (
              <SkillConnectionList label="Extends" items={connections!.extends!} color="#60a5fa" icon="↑" />
            ) : null}
          </div>
        </div>
      )}

      {/* Agent Affinity */}
      {data.agentAffinity?.length > 0 && (
        <div>
          <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Agent Affinity</div>
          <div className="flex flex-wrap gap-1">
            {data.agentAffinity.map((agent) => (
              <span
                key={agent}
                className="text-xs px-2 py-0.5 rounded font-mono"
                style={{ backgroundColor: 'rgba(0, 122, 204, 0.15)', color: '#60a5fa' }}
              >
                {agent}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SkillConnectionList({
  label,
  items,
  color,
  icon,
}: {
  label: string;
  items: string[];
  color: string;
  icon: string;
}) {
  return (
    <div>
      <div className="text-xs font-medium flex items-center gap-1 mb-1" style={{ color }}>
        <span>{icon}</span>
        <span>{label}</span>
        <span style={{ color: 'var(--text-tertiary)' }}>({items.length})</span>
      </div>
      <div className="space-y-0.5" style={{ paddingLeft: '16px' }}>
        {items.map((name) => (
          <div key={name} className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewModeToggle({
  label,
  mode,
  current,
  onChange,
  color,
}: {
  label: string;
  mode: 'full' | 'chain' | 'discovery';
  current: string;
  onChange: (mode: 'full' | 'chain' | 'discovery') => void;
  color?: string;
}) {
  const active = current === mode;
  const c = color || 'var(--text-secondary)';
  return (
    <button
      onClick={() => onChange(mode)}
      className="text-xs font-medium px-3 py-1.5 rounded cursor-pointer transition-colors"
      style={{
        backgroundColor: active ? c : 'var(--bg-main)',
        color: active ? (color ? '#000' : 'var(--text-primary)') : 'var(--text-secondary)',
        border: `1px solid ${active ? c : 'var(--border)'}`,
      }}
    >
      {label}
    </button>
  );
}

function PlatformButton({
  label,
  platform,
  selected,
  onSelect,
  color,
}: {
  label: string;
  platform: string | null;
  selected: string | null;
  onSelect: (p: string | null) => void;
  color: string;
}) {
  const active = selected === platform;
  return (
    <button
      onClick={() => onSelect(platform)}
      className="text-xs font-medium px-2 py-1 rounded cursor-pointer transition-colors"
      style={{
        backgroundColor: active ? color : 'transparent',
        color: active ? '#000' : color,
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
      }}
    >
      {label}
    </button>
  );
}

/** Platform detection signals for the protocol panel */
const PLATFORM_SIGNALS: Record<string, { extensions: string[]; keywords: string[]; markers: string[] }> = {
  ios: { extensions: ['.swift', '.xcodeproj', '.xib'], keywords: ['iOS', 'Swift', 'SwiftUI', 'UIKit'], markers: ['Package.swift'] },
  android: { extensions: ['.kt', '.kts', '.gradle'], keywords: ['Android', 'Kotlin', 'Compose'], markers: ['build.gradle.kts'] },
  web: { extensions: ['.tsx', '.jsx', '.ts'], keywords: ['React', 'Next.js', 'TypeScript'], markers: ['next.config.js', 'package.json'] },
  backend: { extensions: ['.java'], keywords: ['Jakarta', 'WildFly', 'Maven'], markers: ['pom.xml'] },
  design: { extensions: ['.figma'], keywords: ['Figma', 'design tokens', 'klara'], markers: [] },
};

function DiscoveryProtocolPanel({
  chain,
  selectedPlatform,
  onPlatformSelect,
  selectedNode,
}: {
  chain: SkillChain;
  selectedPlatform: string | null;
  onPlatformSelect: (p: string | null) => void;
  selectedNode: GraphNode | null;
}) {
  const totalSkills = chain.declared.length +
    chain.affinity.length +
    chain.platformChains.reduce((s, p) => s + p.skills.length, 0) +
    chain.enhancers.length;

  const platformColors: Record<string, string> = {
    ios: '#007aff',
    android: '#3ddc84',
    web: '#61dafb',
    backend: '#f59e0b',
    design: '#c586c0',
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="text-sm font-bold mb-1" style={{ color: '#8b5cf6' }}>Discovery Protocol</div>
        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {totalSkills} skills in chain for {chain.agentId}
        </div>
      </div>

      {/* Step 1: Declared */}
      <ProtocolStep
        step={1}
        title="Declared Skills"
        description="Always loaded from agent frontmatter skills: list"
        color="#10b981"
        items={chain.declared.map(e => e.skillName)}
      />

      {/* Step 2: Affinity */}
      <ProtocolStep
        step={2}
        title="Affinity Match"
        description="Skills with agent-affinity matching this agent"
        color="#f59e0b"
        items={chain.affinity.map(e => e.skillName)}
      />

      {/* Step 3: Platform Detection — with toggle */}
      <div
        className="rounded p-3 space-y-2"
        style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f59e0b', color: '#000' }}>3</span>
          <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>Platform Route</span>
        </div>
        <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Select a platform to visualize its skill loading route
        </div>

        {/* Platform toggle buttons */}
        <div className="flex flex-wrap gap-1 pt-1">
          <PlatformButton label="All" platform={null} selected={selectedPlatform} onSelect={onPlatformSelect} color="#858585" />
          {chain.platformChains.map(pc => (
            <PlatformButton
              key={pc.platform}
              label={pc.platform.charAt(0).toUpperCase() + pc.platform.slice(1)}
              platform={pc.platform}
              selected={selectedPlatform}
              onSelect={onPlatformSelect}
              color={platformColors[pc.platform] || '#858585'}
            />
          ))}
        </div>

        {/* Detection signals for selected platform */}
        {selectedPlatform && PLATFORM_SIGNALS[selectedPlatform] && (
          <div className="text-xs space-y-1 mt-1 p-2 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <div className="font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
              Detection Signals
            </div>
            <div className="flex items-start gap-2">
              <span style={{ color: 'var(--text-tertiary)', minWidth: 60 }}>Extensions</span>
              <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                {PLATFORM_SIGNALS[selectedPlatform].extensions.join(', ')}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span style={{ color: 'var(--text-tertiary)', minWidth: 60 }}>Keywords</span>
              <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                {PLATFORM_SIGNALS[selectedPlatform].keywords.join(', ')}
              </span>
            </div>
            {PLATFORM_SIGNALS[selectedPlatform].markers.length > 0 && (
              <div className="flex items-start gap-2">
                <span style={{ color: 'var(--text-tertiary)', minWidth: 60 }}>Markers</span>
                <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {PLATFORM_SIGNALS[selectedPlatform].markers.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Platform skill lists */}
        {chain.platformChains.map(pc => {
          const isActive = !selectedPlatform || selectedPlatform === pc.platform;
          if (!isActive) return null;
          return (
            <div key={pc.platform} className="space-y-0.5">
              <div className="text-xs font-semibold" style={{ color: platformColors[pc.platform] || 'var(--text-secondary)' }}>
                {pc.platform.charAt(0).toUpperCase() + pc.platform.slice(1)} ({pc.skills.length})
              </div>
              <div className="space-y-0.5" style={{ paddingLeft: '12px' }}>
                {pc.skills.map(e => (
                  <div key={e.skillName} className="text-xs font-mono flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                    {e.loadedVia ? (
                      <>
                        <span style={{ color: e.loadedVia.type === 'extends' ? '#60a5fa' : '#ef4444', fontSize: '10px' }}>
                          {e.loadedVia.type === 'extends' ? '↑' : '◆'}
                        </span>
                        <span>{e.skillName}</span>
                        <span style={{ fontSize: '9px' }}>({e.loadedVia.type} {e.loadedVia.from})</span>
                      </>
                    ) : (
                      <span>{e.skillName}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 4: Enhancers */}
      <ProtocolStep
        step={4}
        title="Enhancer Discovery"
        description="Skills that enhance declared/affinity skills"
        color="#4ec9b0"
        items={chain.enhancers.map(e => `${e.skillName} → ${e.enhances}`)}
      />

      {/* Selected skill detail */}
      {selectedNode?.type === 'skill' && (
        <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Selected Skill</div>
          <div className="text-sm font-semibold mb-1">{selectedNode.data.name}</div>
          {selectedNode.data.description && (
            <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
              {selectedNode.data.description}
            </div>
          )}
          <SkillMetadataSection node={selectedNode} />
        </div>
      )}
    </div>
  );
}

function ProtocolStep({
  step,
  title,
  description,
  color,
  items,
}: {
  step: number;
  title: string;
  description: string;
  color: string;
  items: string[];
}) {
  return (
    <div
      className="rounded p-3 space-y-1"
      style={{
        backgroundColor: `${color}08`,
        border: `1px solid ${color}25`,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-bold px-1.5 py-0.5 rounded"
          style={{ backgroundColor: color, color: '#000' }}
        >
          {step}
        </span>
        <span className="text-xs font-semibold" style={{ color }}>{title}</span>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>({items.length})</span>
      </div>
      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{description}</div>
      {items.length > 0 && (
        <div className="space-y-0.5 pt-1" style={{ paddingLeft: '4px' }}>
          {items.map((name) => (
            <div key={name} className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
