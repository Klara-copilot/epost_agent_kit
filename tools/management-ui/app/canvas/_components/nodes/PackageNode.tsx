import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useFocusContext } from '../FocusContext';

function PackageNode({ id, data, selected }: NodeProps) {
  const layer = data.layer ?? '';
  const agentCount = data.provides?.agents?.length || 0;
  const skillCount = data.provides?.skills?.length || 0;
  const cmdCount = data.provides?.commands?.length || 0;
  const { visibleNodeIds } = useFocusContext();
  const isFaded = visibleNodeIds !== null && !visibleNodeIds.has(id);
  const parts: string[] = [];
  if (layer !== '') parts.push(`layer ${layer}`);
  const counts = [
    agentCount && `${agentCount}a`,
    skillCount && `${skillCount}s`,
    cmdCount && `${cmdCount}c`,
  ].filter(Boolean);
  if (counts.length > 0) parts.push(counts.join('/'));

  return (
    <div
      style={{
        background: selected ? 'var(--accent-blue-select)' : '#2d2d2d',
        borderTop: `1px solid ${selected ? 'var(--accent-blue)' : '#3e3e42'}`,
        borderRight: `1px solid ${selected ? 'var(--accent-blue)' : '#3e3e42'}`,
        borderBottom: `1px solid ${selected ? 'var(--accent-blue)' : '#3e3e42'}`,
        borderLeft: '4px solid #8b5cf6',
        borderRadius: '6px',
        padding: '8px 12px',
        minWidth: '160px',
        cursor: 'pointer',
        opacity: isFaded ? 0.08 : 1,
        pointerEvents: isFaded ? 'none' as const : 'all' as const,
        transition: 'opacity 0.3s ease, background 0.15s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#8b5cf6', width: 6, height: 6 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '12px' }}>📦</span>
        <span
          style={{
            color: '#e4e4e4',
            fontSize: '12px',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {data.name}
        </span>
      </div>
      {parts.length > 0 && (
        <div
          style={{
            fontSize: '10px',
            color: '#858585',
            marginTop: '2px',
            paddingLeft: '18px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {parts.join(' · ')}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#8b5cf6', width: 6, height: 6 }}
      />
    </div>
  );
}

export default memo(PackageNode);
