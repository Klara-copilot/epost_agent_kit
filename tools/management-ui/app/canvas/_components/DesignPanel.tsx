'use client';

import type { DesignEdge } from '../page';

interface DesignPanelProps {
  designEdges: DesignEdge[];
  onExport: () => void;
  onClear: () => void;
}

export default function DesignPanel({ designEdges, onExport, onClear }: DesignPanelProps) {
  const adds = designEdges.filter(e => e.action === 'add');
  const removes = designEdges.filter(e => e.action === 'remove');
  const total = designEdges.length;

  // Group changes by agent
  const byAgent: Record<string, { added: string[]; removed: string[] }> = {};
  for (const edge of designEdges) {
    const agentId = edge.source.replace('agent:', '');
    const skillId = edge.target.replace('skill:', '');
    if (!byAgent[agentId]) byAgent[agentId] = { added: [], removed: [] };
    if (edge.action === 'add') byAgent[agentId].added.push(skillId);
    else byAgent[agentId].removed.push(skillId);
  }

  return (
    <div
      className="absolute bottom-4 right-4 rounded-lg shadow-xl"
      style={{
        width: '300px',
        maxHeight: '420px',
        backgroundColor: '#1a1a2e',
        border: '1px solid #22c55e',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between rounded-t-lg"
        style={{ backgroundColor: '#15803d', borderBottom: '1px solid #16a34a' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">✏️ Design Mode</span>
          {total > 0 && (
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              {total} change{total !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="px-4 py-2 text-xs" style={{ color: '#86efac', borderBottom: '1px solid #166534' }}>
        <p>Drag agent → skill to add a connection.</p>
        <p>Click a skill edge to remove it.</p>
      </div>

      {/* Changes list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {total === 0 ? (
          <p className="text-xs text-center py-4" style={{ color: '#6b7280' }}>
            No changes yet
          </p>
        ) : (
          Object.entries(byAgent).map(([agentId, changes]) => (
            <div key={agentId}>
              <div className="text-xs font-semibold mb-1.5" style={{ color: '#86efac' }}>
                {agentId}
              </div>
              <div className="space-y-1 pl-2">
                {changes.added.map(skillId => (
                  <div key={`add-${skillId}`} className="flex items-center gap-1.5 text-xs">
                    <span style={{ color: '#22c55e' }}>＋</span>
                    <span style={{ color: '#d1fae5', fontFamily: 'monospace' }}>{skillId}</span>
                  </div>
                ))}
                {changes.removed.map(skillId => (
                  <div key={`rem-${skillId}`} className="flex items-center gap-1.5 text-xs">
                    <span style={{ color: '#ef4444' }}>－</span>
                    <span style={{ color: '#fecaca', fontFamily: 'monospace', textDecoration: 'line-through' }}>
                      {skillId}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary bar */}
      {total > 0 && (
        <div
          className="px-4 py-2 flex items-center gap-2 text-xs"
          style={{ borderTop: '1px solid #166534', color: '#6b7280' }}
        >
          {adds.length > 0 && (
            <span style={{ color: '#22c55e' }}>+{adds.length} added</span>
          )}
          {removes.length > 0 && (
            <span style={{ color: '#ef4444' }}>−{removes.length} removed</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex gap-2" style={{ borderTop: '1px solid #166534' }}>
        <button
          onClick={onExport}
          disabled={total === 0}
          className="flex-1 text-xs font-medium py-2 rounded transition-colors"
          style={{
            backgroundColor: total > 0 ? '#16a34a' : '#166534',
            color: total > 0 ? '#fff' : '#4b7c5e',
            border: 'none',
            cursor: total > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Export JSON
        </button>
        <button
          onClick={onClear}
          disabled={total === 0}
          className="text-xs font-medium px-3 py-2 rounded transition-colors"
          style={{
            backgroundColor: 'transparent',
            color: total > 0 ? '#9ca3af' : '#4b5563',
            border: `1px solid ${total > 0 ? '#374151' : '#1f2937'}`,
            cursor: total > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
