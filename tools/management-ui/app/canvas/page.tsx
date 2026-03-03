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
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['agents', 'skills', 'commands', 'packages'])
  );
  const [designMode, setDesignMode] = useState(false);
  const [designEdges, setDesignEdges] = useState<DesignEdge[]>([]);

  // New dual-view state
  const [viewMode, setViewMode] = useState<'agent' | 'skill'>('agent');
  const [focusedAgentId, setFocusedAgentId] = useState<string | null>(null);
  const [focusedSkillId, setFocusedSkillId] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  // Escape key exits focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewMode === 'agent' && focusedAgentId) {
          setFocusedAgentId(null);
          setSelectedNode(null);
          setSelectedPlatform(null);
        } else if (viewMode === 'skill' && focusedSkillId) {
          setFocusedSkillId(null);
          setSelectedNode(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, focusedAgentId, focusedSkillId]);

  // Agent View: click agent → toggle focus, click skill → select only
  const handleAgentViewNodeSelect = useCallback((rfNodeId: string | null) => {
    if (!rfNodeId) {
      setSelectedNode(null);
      return;
    }
    if (!graph) return;

    if (rfNodeId.startsWith('agent:')) {
      // Toggle agent focus
      if (focusedAgentId === rfNodeId) {
        setFocusedAgentId(null);
        setSelectedNode(null);
        setSelectedPlatform(null);
      } else {
        setFocusedAgentId(rfNodeId);
        const node = graph.nodes.find(n => `${n.type}:${getNodeId(n)}` === rfNodeId);
        if (node) setSelectedNode(node);
      }
    } else {
      // Click skill/other → just select for panel
      const node = graph.nodes.find(
        (n) => `${n.type}:${getNodeId(n)}` === rfNodeId
      );
      if (node) setSelectedNode(node);
    }
  }, [graph, focusedAgentId]);

  // Skill View: click skill → toggle focus, click agent/package → select only
  const handleSkillViewNodeSelect = useCallback((rfNodeId: string | null) => {
    if (!rfNodeId) {
      setSelectedNode(null);
      return;
    }
    if (!graph) return;

    if (rfNodeId.startsWith('skill:')) {
      // Toggle skill focus
      if (focusedSkillId === rfNodeId) {
        setFocusedSkillId(null);
        setSelectedNode(null);
      } else {
        setFocusedSkillId(rfNodeId);
        const node = graph.nodes.find(
          (n) => `${n.type}:${getNodeId(n)}` === rfNodeId || `${n.type}:${n.data.name}` === rfNodeId
        );
        if (node) setSelectedNode(node);
      }
    } else {
      // Click agent/package → just select for panel
      const node = graph.nodes.find(
        (n) => `${n.type}:${getNodeId(n)}` === rfNodeId
      );
      if (node) setSelectedNode(node);
    }
  }, [graph, focusedSkillId]);

  // Pane click handlers
  const handleAgentViewPaneClick = useCallback(() => {
    setFocusedAgentId(null);
    setSelectedNode(null);
    setSelectedPlatform(null);
  }, []);

  const handleSkillViewPaneClick = useCallback(() => {
    setFocusedSkillId(null);
    setSelectedNode(null);
  }, []);

  // View switch
  const handleViewModeChange = useCallback((mode: 'agent' | 'skill') => {
    setViewMode(mode);
    setFocusedAgentId(null);
    setFocusedSkillId(null);
    setSelectedNode(null);
    setSelectedPlatform(null);
  }, []);

  const handleDesignModeToggle = useCallback(() => {
    setDesignMode(v => !v);
  }, []);

  const handleConnect = useCallback((params: Connection) => {
    const { source, target } = params;
    if (!source || !target) return;
    const [sourceType] = source.split(':');
    const [targetType] = target.split(':');
    if (sourceType !== 'agent' || targetType !== 'skill') return;
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

  // Compute skill chain when an agent is focused (Agent View)
  const focusedAgentChain = useMemo<SkillChain | null>(() => {
    if (!focusedAgentId || !data) return null;
    const agentId = focusedAgentId.replace('agent:', '');
    const agent = data.agents.find(a => a.id === agentId);
    if (!agent) return null;
    return resolveSkillChain(agent, data.skills);
  }, [focusedAgentId, data]);

  // Global skill chain for Agent View (unfocused) — shows all agent-skill layer colors
  const globalChain = useMemo<GlobalSkillChain | null>(() => {
    if (viewMode !== 'agent' || !data) return null;
    if (focusedAgentId) return null; // Use per-agent chain when focused
    return resolveGlobalSkillChain(data.agents, data.skills);
  }, [viewMode, data, focusedAgentId]);

  // filteredGraph: two branches — Agent View and Skill View
  const filteredGraph = useMemo(() => {
    if (!graph) return graph;

    if (viewMode === 'agent') {
      if (focusedAgentId && focusedAgentChain) {
        // Agent View (focused): agent + skill chain, filtered by platform
        const agentId = focusedAgentId.replace('agent:', '');
        const visibleSkills = new Set<string>();

        for (const e of focusedAgentChain.declared) visibleSkills.add(e.skillName);
        for (const e of focusedAgentChain.affinity) visibleSkills.add(e.skillName);

        for (const pc of focusedAgentChain.platformChains) {
          if (!selectedPlatform || selectedPlatform === pc.platform) {
            for (const e of pc.skills) visibleSkills.add(e.skillName);
          }
        }

        for (const e of focusedAgentChain.enhancers) {
          if (visibleSkills.has(e.enhances)) {
            visibleSkills.add(e.skillName);
          }
        }

        const filteredNodes = graph.nodes.filter((n) => {
          if (n.type === 'agent') return getNodeId(n) === agentId;
          if (n.type === 'skill') return visibleSkills.has(n.data.name) || visibleSkills.has(getNodeId(n));
          return false;
        });

        const nodeKeys = new Set(filteredNodes.map((n) => `${n.type}:${getNodeId(n)}`));
        const filteredEdges: Edge[] = [];
        const agentKey = `agent:${agentId}`;
        const addedEdges = new Set<string>();

        // Agent → declared
        for (const e of focusedAgentChain.declared) {
          const targetKey = `skill:${e.skillName}`;
          if (nodeKeys.has(targetKey)) {
            const edgeKey = `${agentKey}-${targetKey}`;
            if (!addedEdges.has(edgeKey)) {
              addedEdges.add(edgeKey);
              const existing = graph.edges.find(ge => ge.source === agentKey && ge.target === targetKey);
              filteredEdges.push(existing || {
                id: `declared:${agentKey}-${targetKey}`,
                source: agentKey,
                target: targetKey,
                type: 'skill-dependency',
              });
            }
          }
        }

        // Agent → affinity
        for (const e of focusedAgentChain.affinity) {
          const targetKey = `skill:${e.skillName}`;
          if (nodeKeys.has(targetKey)) {
            const edgeKey = `${agentKey}-${targetKey}`;
            if (!addedEdges.has(edgeKey)) {
              addedEdges.add(edgeKey);
              filteredEdges.push({
                id: `affinity:${agentKey}-${targetKey}`,
                source: agentKey,
                target: targetKey,
                type: 'skill-dependency',
                metadata: { isAffinity: true },
              });
            }
          }
        }

        // Agent → platform skills
        for (const pc of focusedAgentChain.platformChains) {
          if (selectedPlatform && selectedPlatform !== pc.platform) continue;
          for (const e of pc.skills) {
            const targetKey = `skill:${e.skillName}`;
            if (!nodeKeys.has(targetKey)) continue;
            if (e.loadedVia) {
              const sourceKey = `skill:${e.loadedVia.from}`;
              const edgeKey = `${sourceKey}-${targetKey}`;
              if (nodeKeys.has(sourceKey) && !addedEdges.has(edgeKey)) {
                addedEdges.add(edgeKey);
                filteredEdges.push({
                  id: `${e.loadedVia.type}:${sourceKey}-${targetKey}`,
                  source: sourceKey,
                  target: targetKey,
                  type: e.loadedVia.type === 'extends' ? 'skill-extends' : 'skill-requires',
                });
              }
              const agentParentKey = `${agentKey}-${sourceKey}`;
              if (nodeKeys.has(sourceKey) && !addedEdges.has(agentParentKey)) {
                addedEdges.add(agentParentKey);
                filteredEdges.push({
                  id: `platform:${agentKey}-${sourceKey}`,
                  source: agentKey,
                  target: sourceKey,
                  type: 'skill-dependency',
                });
              }
            } else {
              const edgeKey = `${agentKey}-${targetKey}`;
              if (!addedEdges.has(edgeKey)) {
                addedEdges.add(edgeKey);
                filteredEdges.push({
                  id: `platform:${agentKey}-${targetKey}`,
                  source: agentKey,
                  target: targetKey,
                  type: 'skill-dependency',
                });
              }
            }
          }
        }

        // Enhancer → enhanced skill
        for (const e of focusedAgentChain.enhancers) {
          if (!visibleSkills.has(e.skillName)) continue;
          const sourceKey = `skill:${e.skillName}`;
          const targetKey = `skill:${e.enhances}`;
          if (nodeKeys.has(sourceKey) && nodeKeys.has(targetKey)) {
            const edgeKey = `${sourceKey}-${targetKey}`;
            if (!addedEdges.has(edgeKey)) {
              addedEdges.add(edgeKey);
              filteredEdges.push({
                id: `enhances:${sourceKey}-${targetKey}`,
                source: sourceKey,
                target: targetKey,
                type: 'skill-enhances',
              });
            }
          }
        }

        // Keep skill-extends/requires/enhances from original graph
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

      // Agent View (unfocused): agents + skills
      const filteredNodes = graph.nodes.filter(
        (n) => n.type === 'agent' || n.type === 'skill'
      );
      const nodeKeys = new Set(
        filteredNodes.map((n) => `${n.type}:${getNodeId(n)}`)
      );
      const filteredEdges = graph.edges.filter(
        (e) => nodeKeys.has(e.source) && nodeKeys.has(e.target)
      );

      // Inject affinity edges from global chain
      if (globalChain) {
        for (const { agentId, skillName } of globalChain.affinityEdges) {
          const sourceKey = `agent:${agentId}`;
          const targetKey = `skill:${skillName}`;
          if (nodeKeys.has(sourceKey) && nodeKeys.has(targetKey)) {
            const exists = filteredEdges.some(
              e => e.source === sourceKey && e.target === targetKey
            );
            if (!exists) {
              filteredEdges.push({
                id: `affinity:${sourceKey}-${targetKey}`,
                source: sourceKey,
                target: targetKey,
                type: 'skill-dependency',
                metadata: { isAffinity: true },
              });
            }
          }
        }
      }

      return { nodes: filteredNodes, edges: filteredEdges };
    }

    // Skill View
    if (viewMode === 'skill') {
      if (focusedSkillId) {
        // Skill View (focused): reverse lookup
        return buildSkillFocusGraph(graph, focusedSkillId, data, globalChain);
      }

      // Skill View (unfocused): skills + agents + packages (no commands)
      const filteredNodes = graph.nodes.filter(
        (n) => n.type === 'skill' || n.type === 'agent' || n.type === 'package'
      );
      const nodeKeys = new Set(
        filteredNodes.map((n) => `${n.type}:${getNodeId(n)}`)
      );
      const filteredEdges = graph.edges.filter(
        (e) => e.type !== 'command-invocation' && nodeKeys.has(e.source) && nodeKeys.has(e.target)
      );
      return { nodes: filteredNodes, edges: filteredEdges };
    }

    return graph;
  }, [graph, viewMode, focusedAgentId, focusedAgentChain, focusedSkillId, globalChain, selectedPlatform, data]);

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
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentFocusId = viewMode === 'agent' ? focusedAgentId : focusedSkillId;
  const hasFocus = !!currentFocusId;

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header className="px-6 py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-darker)', borderBottom: `1px solid var(--border)` }}>
        <div className="flex items-center gap-4">
          <Link href="/" className="transition-colors" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }}>
            Home
          </Link>
          <h1 className="text-xl font-bold">System Canvas</h1>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {hasFocus && (
            <button
              onClick={() => {
                if (viewMode === 'agent') { setFocusedAgentId(null); setSelectedPlatform(null); }
                else setFocusedSkillId(null);
                setSelectedNode(null);
              }}
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
          {/* View mode toggles: Agent View + Skill View */}
          <ViewModeToggle label="Agent View" mode="agent" current={viewMode} onChange={handleViewModeChange} color="#4ec9b0" />
          <ViewModeToggle label="Skill View" mode="skill" current={viewMode} onChange={handleViewModeChange} color="#8b5cf6" />
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
          <span className="ml-1">{graph.nodes.length} nodes</span>
          <span>{graph.edges.length} edges</span>
        </div>
      </header>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Collections Panel — always shown */}
        <div className="overflow-y-auto" style={{ width: '250px', backgroundColor: 'var(--bg-panel)', borderRight: `1px solid var(--border)` }}>
          <div className="p-4 space-y-2">
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search..."
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
              icon="A"
              count={data.agents.length}
              items={filterItems(data.agents.map(a => ({ id: a.id, name: a.name, type: 'agent' as const })))}
              expanded={expandedSections.has('agents')}
              onToggle={() => toggleSection('agents')}
              onSelect={(id) => {
                const rfId = `agent:${id}`;
                if (viewMode === 'agent') {
                  // In agent view, clicking agent in sidebar focuses it
                  if (focusedAgentId === rfId) {
                    setFocusedAgentId(null);
                    setSelectedNode(null);
                    setSelectedPlatform(null);
                  } else {
                    setFocusedAgentId(rfId);
                    const node = graph.nodes.find(n => getNodeId(n) === id);
                    if (node) setSelectedNode(node);
                  }
                } else {
                  const node = graph.nodes.find(n => getNodeId(n) === id);
                  if (node) setSelectedNode(node);
                }
              }}
              selectedId={selectedNode ? getNodeId(selectedNode) : null}
              focusedId={viewMode === 'agent' ? focusedAgentId?.replace('agent:', '') ?? null : null}
              colorClass="agent"
            />
            <CollectionSection
              title="Skills"
              icon="S"
              count={data.skills.length}
              items={filterItems(data.skills.map(s => ({ id: s.id, name: s.name, type: 'skill' as const })))}
              expanded={expandedSections.has('skills')}
              onToggle={() => toggleSection('skills')}
              onSelect={(id) => {
                const rfId = `skill:${id}`;
                if (viewMode === 'skill') {
                  // In skill view, clicking skill in sidebar focuses it
                  if (focusedSkillId === rfId) {
                    setFocusedSkillId(null);
                    setSelectedNode(null);
                  } else {
                    setFocusedSkillId(rfId);
                    const node = graph.nodes.find(n => getNodeId(n) === id);
                    if (node) setSelectedNode(node);
                  }
                } else {
                  const node = graph.nodes.find(n => getNodeId(n) === id);
                  if (node) setSelectedNode(node);
                }
              }}
              selectedId={selectedNode ? getNodeId(selectedNode) : null}
              focusedId={viewMode === 'skill' ? focusedSkillId?.replace('skill:', '') ?? null : null}
              colorClass="skill"
            />
            {viewMode === 'agent' && (
              <CollectionSection
                title="Commands"
                icon="C"
                count={data.commands.length}
                items={filterItems(data.commands.map(c => ({ id: c.id, name: c.name, type: 'command' as const })))}
                expanded={expandedSections.has('commands')}
                onToggle={() => toggleSection('commands')}
                onSelect={(id) => {
                  const node = graph.nodes.find(n => getNodeId(n) === id);
                  if (node) setSelectedNode(node);
                }}
                selectedId={selectedNode ? getNodeId(selectedNode) : null}
                focusedId={null}
                colorClass="command"
              />
            )}
            <CollectionSection
              title="Packages"
              icon="P"
              count={data.packages.length}
              items={filterItems(data.packages.map(p => ({ id: p.name, name: p.name, type: 'package' as const })))}
              expanded={expandedSections.has('packages')}
              onToggle={() => toggleSection('packages')}
              onSelect={(id) => {
                const node = graph.nodes.find(n => n.data.name === id);
                if (node) setSelectedNode(node);
              }}
              selectedId={selectedNode ? getNodeId(selectedNode) : null}
              focusedId={null}
              colorClass="package"
            />
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 relative" style={{ backgroundColor: 'var(--bg-main)' }}>
          <ReactFlowProvider>
            <FlowCanvas
              graphNodes={filteredGraph!.nodes}
              graphEdges={filteredGraph!.edges}
              selectedNodeId={selectedNode ? `${selectedNode.type}:${getNodeId(selectedNode)}` : null}
              focusedNodeId={currentFocusId}
              onNodeSelect={viewMode === 'agent' ? handleAgentViewNodeSelect : handleSkillViewNodeSelect}
              onPaneClick={viewMode === 'agent' ? handleAgentViewPaneClick : handleSkillViewPaneClick}
              designMode={designMode}
              designEdges={designEdges}
              onConnect={handleConnect}
              onDesignEdgeRemove={handleDesignEdgeRemove}
              skillChain={focusedAgentChain}
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
          {viewMode === 'agent' && <AgentViewLegend />}
          {viewMode === 'skill' && <SkillViewLegend />}
        </div>

        {/* Right: Properties Panel */}
        <div className="overflow-y-auto" style={{ width: '300px', backgroundColor: 'var(--bg-panel)', borderLeft: `1px solid var(--border)` }}>
          {viewMode === 'agent' && focusedAgentId && focusedAgentChain ? (
            <AgentChainPanel
              chain={focusedAgentChain}
              selectedPlatform={selectedPlatform}
              onPlatformSelect={setSelectedPlatform}
              selectedNode={selectedNode}
            />
          ) : viewMode === 'skill' && focusedSkillId && selectedNode?.type === 'skill' ? (
            <SkillImpactPanel
              skillNode={selectedNode}
              skillId={focusedSkillId}
              data={data}
              graph={graph}
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
              {selectedNode.type === 'agent' && viewMode === 'agent' && (() => {
                const agentId = getNodeId(selectedNode);
                const agent = data.agents.find(a => a.id === agentId);
                if (!agent) return null;
                const chain = resolveSkillChain(agent, data.skills);
                return <SkillChainSummary chain={chain} />;
              })()}
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

// --- Build Skill Focus Graph (Skill View focused) ---

function buildSkillFocusGraph(
  graph: { nodes: GraphNode[]; edges: Edge[] },
  focusedSkillId: string,
  data: LoadedData | null,
  _globalChain: GlobalSkillChain | null,
): { nodes: GraphNode[]; edges: Edge[] } {
  const skillName = focusedSkillId.replace('skill:', '');

  const resultNodes = new Map<string, GraphNode>();
  const resultEdges: Edge[] = [];
  const addedEdges = new Set<string>();

  // 1. Include focused skill node
  const skillNode = graph.nodes.find(
    n => n.type === 'skill' && (getNodeId(n) === skillName || n.data.name === skillName)
  );
  if (skillNode) {
    resultNodes.set(focusedSkillId, skillNode);
  }

  // 2. Find agents directly linked to this skill (not transitively via related skills)
  if (data) {
    // Collect agents with a direct graph edge to this skill
    const directEdgeAgents = new Set<string>();
    for (const edge of graph.edges) {
      if (edge.target === focusedSkillId && edge.source.startsWith('agent:')) {
        directEdgeAgents.add(edge.source.replace('agent:', ''));
      }
    }

    // Also check agent-affinity declared on the skill itself
    const skillData = data.skills.find(s => s.id === skillName || s.name === skillName);
    const affinityAgents = new Set<string>(skillData?.agentAffinity || []);

    for (const agent of data.agents) {
      const agentKey = `agent:${agent.id}`;
      const agentNode = graph.nodes.find(n => n.type === 'agent' && getNodeId(n) === agent.id);
      if (!agentNode) continue;

      // Declared: agent lists this skill in its skills: array
      const isDeclared = agent.skills?.includes(skillName);
      // Direct edge in graph (covers declared + explicit dependencies)
      const hasDirectEdge = directEdgeAgents.has(agent.id);
      // Affinity: skill declares this agent in agent-affinity
      const hasAffinity = affinityAgents.has(agent.id);

      if (isDeclared || hasDirectEdge || hasAffinity) {
        resultNodes.set(agentKey, agentNode);
        const edgeKey = `${agentKey}-${focusedSkillId}`;
        if (!addedEdges.has(edgeKey)) {
          addedEdges.add(edgeKey);
          resultEdges.push({
            id: `${isDeclared ? 'declared' : 'optional'}:${edgeKey}`,
            source: agentKey,
            target: focusedSkillId,
            type: 'skill-dependency',
            metadata: isDeclared ? undefined : { isAffinity: true },
          });
        }
      }
    }
  }

  // 3. Find packages that provide this skill
  for (const node of graph.nodes) {
    if (node.type === 'package') {
      const pkgKey = `package:${node.data.name}`;
      // Check package-provides edges
      const providesEdge = graph.edges.find(
        e => e.source === pkgKey && e.target === focusedSkillId && e.type === 'package-provides'
      );
      if (providesEdge) {
        resultNodes.set(pkgKey, node);
        const edgeKey = `${pkgKey}-${focusedSkillId}`;
        if (!addedEdges.has(edgeKey)) {
          addedEdges.add(edgeKey);
          resultEdges.push(providesEdge);
        }
      }
    }
  }

  // 4. Find skill connections (extends, requires, enhances, conflicts)
  for (const edge of graph.edges) {
    if (
      (edge.type === 'skill-extends' || edge.type === 'skill-requires' || edge.type === 'skill-enhances' || edge.type === 'skill-conflicts') &&
      (edge.source === focusedSkillId || edge.target === focusedSkillId)
    ) {
      const otherKey = edge.source === focusedSkillId ? edge.target : edge.source;
      const otherNode = graph.nodes.find(
        n => `${n.type}:${getNodeId(n)}` === otherKey
      );
      if (otherNode) {
        resultNodes.set(otherKey, otherNode);
        const edgeKey = `${edge.source}-${edge.target}`;
        if (!addedEdges.has(edgeKey)) {
          addedEdges.add(edgeKey);
          resultEdges.push(edge);
        }
      }
    }
  }

  return { nodes: Array.from(resultNodes.values()), edges: resultEdges };
}

// --- Legends ---

function AgentViewLegend() {
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
      <div className="font-semibold" style={{ color: '#4ec9b0' }}>Agent View</div>
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

function SkillViewLegend() {
  const items = [
    { label: 'Required by', color: '#10b981', dash: '' },
    { label: 'Optional for', color: '#f59e0b', dash: '6 4' },
    { label: 'Extends', color: '#60a5fa', dash: '' },
    { label: 'Requires', color: '#ef4444', dash: '' },
    { label: 'Enhances', color: '#4ec9b0', dash: '8 4' },
    { label: 'Conflicts', color: '#ef4444', dash: '3 3' },
    { label: 'Provided by', color: '#8b5cf6', dash: '' },
  ];

  return (
    <div
      className="absolute bottom-4 left-4 p-3 rounded-lg text-xs space-y-2"
      style={{ backgroundColor: 'rgba(30,30,30,0.92)', border: '1px solid var(--border)', zIndex: 10 }}
    >
      <div className="font-semibold" style={{ color: '#8b5cf6' }}>Skill View</div>
      <div className="space-y-1">
        {items.map(e => (
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

// --- Collection Section ---

function CollectionSection({
  title,
  icon,
  count,
  items,
  expanded,
  onToggle,
  onSelect,
  selectedId,
  focusedId,
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
  focusedId: string | null;
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
          <span className="text-xs font-bold px-1 rounded" style={{ backgroundColor: color.bg, color: color.text }}>{icon}</span>
          <span>{title}</span>
          <span style={{ color: 'var(--text-tertiary)' }}>({count})</span>
        </span>
        <span style={{ color: 'var(--text-tertiary)' }}>{expanded ? '▼' : '▶'}</span>
      </button>
      {expanded && (
        <div className="space-y-1" style={{ paddingLeft: 'var(--space-xl)' }}>
          {items.map((item) => {
            const isSelected = selectedId === item.id;
            const isFocused = focusedId === item.id;
            const showId = item.id !== item.name;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="w-full text-left px-3 py-2 rounded text-sm border transition-all"
                style={{
                  backgroundColor: isFocused ? 'var(--accent-blue-select)' : isSelected ? 'rgba(255,255,255,0.05)' : color.bg,
                  color: isFocused ? 'var(--text-primary)' : isSelected ? 'var(--text-primary)' : color.text,
                  borderColor: isFocused ? 'var(--accent-blue)' : isSelected ? 'var(--border)' : color.border,
                  transition: 'var(--transition-fast)',
                }}
              >
                <div className="font-medium truncate flex items-center gap-2">
                  {isFocused && <span style={{ color: 'var(--accent-blue)' }}>*</span>}
                  <span>{item.name}</span>
                </div>
                {showId && (
                  <div className="text-xs opacity-70 truncate font-mono" style={{ paddingLeft: isFocused ? '16px' : '0' }}>{item.id}</div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- View Mode Toggle ---

function ViewModeToggle({
  label,
  mode,
  current,
  onChange,
  color,
}: {
  label: string;
  mode: 'agent' | 'skill';
  current: string;
  onChange: (mode: 'agent' | 'skill') => void;
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

// --- Skill Impact Panel (Skill View focused) ---

function SkillImpactPanel({
  skillNode,
  skillId,
  data,
  graph,
}: {
  skillNode: GraphNode;
  skillId: string;
  data: LoadedData;
  graph: { nodes: GraphNode[]; edges: Edge[] };
}) {
  const skillName = skillId.replace('skill:', '');
  // Cast to Skill data type — we know this is a skill node
  const sd = skillNode.data as { name: string; description?: string; tier?: string; connections?: { extends?: string[]; requires?: string[]; enhances?: string[]; conflicts?: string[] } };

  const { requiredBy, optionalFor, providedBy, connections } = useMemo(() => {
    const required: string[] = [];
    const optional: string[] = [];
    const packages: string[] = [];

    // Direct graph edges from agents to this skill
    const directEdgeAgents = new Set<string>();
    for (const edge of graph.edges) {
      if (edge.target === skillId && edge.source.startsWith('agent:')) {
        directEdgeAgents.add(edge.source.replace('agent:', ''));
      }
    }

    // Agent-affinity declared on the skill
    const skillMeta = data.skills.find(s => s.id === skillName || s.name === skillName);
    const affinityAgents = new Set<string>(skillMeta?.agentAffinity || []);

    for (const agent of data.agents) {
      const isDeclared = agent.skills?.includes(skillName);
      if (isDeclared) {
        required.push(agent.name);
        continue;
      }
      // Only count as optional if there's a direct link (edge or affinity)
      const hasDirectEdge = directEdgeAgents.has(agent.id);
      const hasAffinity = affinityAgents.has(agent.id);
      if (hasDirectEdge || hasAffinity) {
        optional.push(agent.name);
      }
    }

    // Packages
    for (const node of graph.nodes) {
      if (node.type === 'package') {
        const pkgKey = `package:${node.data.name}`;
        const provides = graph.edges.some(
          e => e.source === pkgKey && e.target === skillId && e.type === 'package-provides'
        );
        if (provides) packages.push(node.data.name);
      }
    }

    // Skill connections
    const conns = sd.connections || {};
    return {
      requiredBy: required,
      optionalFor: optional,
      providedBy: packages,
      connections: conns,
    };
  }, [data, graph, skillId, skillName, skillNode]);

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="text-sm font-bold mb-1" style={{ color: '#8b5cf6' }}>Skill Impact</div>
        <div className="text-lg font-semibold">{skillNode.data.name}</div>
        {skillNode.data.description && (
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {skillNode.data.description}
          </div>
        )}
      </div>

      {sd.tier && (
        <div>
          <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Tier</div>
          <span
            className="text-xs px-2 py-0.5 rounded font-medium"
            style={{
              backgroundColor: sd.tier === 'core' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
              color: sd.tier === 'core' ? '#10b981' : '#f59e0b',
            }}
          >
            {sd.tier === 'core' ? 'Core' : 'Discoverable'}
          </span>
        </div>
      )}

      {/* Required by */}
      <ImpactSection
        title="Required by"
        items={requiredBy}
        color="#10b981"
        icon="*"
        emptyText="No agents declare this skill"
      />

      {/* Optional for */}
      <ImpactSection
        title="Optional for"
        items={optionalFor}
        color="#f59e0b"
        icon="~"
        emptyText="No affinity/platform/enhancer matches"
      />

      {/* Provided by */}
      <ImpactSection
        title="Provided by"
        items={providedBy}
        color="#8b5cf6"
        icon="P"
        emptyText="No packages found"
      />

      {/* Skill connections */}
      {(connections.extends?.length || connections.requires?.length || connections.enhances?.length || connections.conflicts?.length) && (
        <div>
          <div className="text-xs uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>Skill Connections</div>
          <div className="space-y-2">
            {connections.extends?.length ? (
              <SkillConnectionList label="Extends" items={connections.extends} color="#60a5fa" icon="^" />
            ) : null}
            {connections.requires?.length ? (
              <SkillConnectionList label="Requires" items={connections.requires} color="#ef4444" icon="*" />
            ) : null}
            {connections.enhances?.length ? (
              <SkillConnectionList label="Enhances" items={connections.enhances} color="#4ec9b0" icon="+" />
            ) : null}
            {connections.conflicts?.length ? (
              <SkillConnectionList label="Conflicts" items={connections.conflicts} color="#ef4444" icon="x" />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function ImpactSection({
  title,
  items,
  color,
  icon,
  emptyText,
}: {
  title: string;
  items: string[];
  color: string;
  icon: string;
  emptyText: string;
}) {
  return (
    <div>
      <div className="text-xs font-medium flex items-center gap-1 mb-1" style={{ color }}>
        <span>{icon}</span>
        <span>{title}</span>
        <span style={{ color: 'var(--text-tertiary)' }}>({items.length})</span>
      </div>
      {items.length > 0 ? (
        <div className="space-y-0.5" style={{ paddingLeft: '16px' }}>
          {items.map((name) => (
            <div key={name} className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              {name}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs" style={{ color: 'var(--text-tertiary)', paddingLeft: '16px' }}>{emptyText}</div>
      )}
    </div>
  );
}

// --- Agent Chain Panel (Agent View focused) ---

const PLATFORM_SIGNALS: Record<string, { extensions: string[]; keywords: string[]; markers: string[] }> = {
  ios: { extensions: ['.swift', '.xcodeproj', '.xib'], keywords: ['iOS', 'Swift', 'SwiftUI', 'UIKit'], markers: ['Package.swift'] },
  android: { extensions: ['.kt', '.kts', '.gradle'], keywords: ['Android', 'Kotlin', 'Compose'], markers: ['build.gradle.kts'] },
  web: { extensions: ['.tsx', '.jsx', '.ts'], keywords: ['React', 'Next.js', 'TypeScript'], markers: ['next.config.js', 'package.json'] },
  backend: { extensions: ['.java'], keywords: ['Jakarta', 'WildFly', 'Maven'], markers: ['pom.xml'] },
  design: { extensions: ['.figma'], keywords: ['Figma', 'design tokens', 'klara'], markers: [] },
};

function AgentChainPanel({
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
        <div className="text-sm font-bold mb-1" style={{ color: '#4ec9b0' }}>Agent Chain</div>
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

      {/* Step 3: Platform Detection */}
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
                          {e.loadedVia.type === 'extends' ? '^' : '*'}
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
          );
        })}
      </div>

      {/* Step 4: Enhancers */}
      <ProtocolStep
        step={4}
        title="Enhancer Discovery"
        description="Skills that enhance declared/affinity skills"
        color="#4ec9b0"
        items={chain.enhancers.map(e => `${e.skillName} -> ${e.enhances}`)}
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

// --- Shared Components ---

const EDGE_TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  'skill-dependency': { label: 'Skills', color: '#4ec9b0', icon: '*' },
  'command-invocation': { label: 'Commands', color: '#f59e0b', icon: '>' },
  'package-provides': { label: 'Packages', color: '#8b5cf6', icon: 'P' },
  'profile-includes': { label: 'Profiles', color: '#6b7280', icon: '=' },
  'same-type-hierarchy': { label: 'Hierarchy', color: '#60a5fa', icon: '-' },
  'skill-extends': { label: 'Extends', color: '#60a5fa', icon: '^' },
  'skill-requires': { label: 'Requires', color: '#ef4444', icon: '*' },
  'skill-enhances': { label: 'Enhances', color: '#4ec9b0', icon: '+' },
  'skill-conflicts': { label: 'Conflicts', color: '#ef4444', icon: 'x' },
};

function SkillChainSummary({ chain }: { chain: SkillChain }) {
  return (
    <div>
      <div className="text-xs uppercase mb-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
        Skill Loading Chain
      </div>
      <div className="space-y-3">
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
                              {e.loadedVia.type === 'extends' ? '^' : '*'}
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

        {chain.enhancers.length > 0 && (
          <div>
            <div className="text-xs font-medium flex items-center gap-1 mb-1" style={{ color: '#4ec9b0' }}>
              <span>Enhancers</span>
              <span style={{ color: 'var(--text-tertiary)' }}>({chain.enhancers.length})</span>
            </div>
            <div className="space-y-0.5" style={{ paddingLeft: '16px' }}>
              {chain.enhancers.map(e => (
                <div key={e.skillName} className="text-xs font-mono flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                  <span style={{ color: '#4ec9b0', fontSize: '10px' }}>+</span>
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

      {hasAnyConnection && (
        <div>
          <div className="text-xs uppercase mb-2" style={{ color: 'var(--text-tertiary)' }}>Skill Connections</div>
          <div className="space-y-2">
            {connections!.requires?.length ? (
              <SkillConnectionList label="Requires" items={connections!.requires!} color="#ef4444" icon="*" />
            ) : null}
            {connections!.enhances?.length ? (
              <SkillConnectionList label="Enhances" items={connections!.enhances!} color="#4ec9b0" icon="+" />
            ) : null}
            {connections!.conflicts?.length ? (
              <SkillConnectionList label="Conflicts" items={connections!.conflicts!} color="#ef4444" icon="x" />
            ) : null}
            {connections!.extends?.length ? (
              <SkillConnectionList label="Extends" items={connections!.extends!} color="#60a5fa" icon="^" />
            ) : null}
          </div>
        </div>
      )}

      {data.agentAffinity?.length > 0 && (
        <div>
          <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Agent Affinity</div>
          <div className="flex flex-wrap gap-1">
            {data.agentAffinity.map((agent: string) => (
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

    const nodeByKey = new Map<string, GraphNode>();
    for (const n of graph.nodes) {
      nodeByKey.set(`${n.type}:${getNodeIdFn(n)}`, n);
    }

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
          const config = EDGE_TYPE_LABELS[edgeType] || { label: edgeType, color: '#858585', icon: '-' };
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
                      {item.direction === 'out' ? '->' : '<-'}
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
