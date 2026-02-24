import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useFocusContext } from '../FocusContext';

function SkillNode({ id, data, selected }: NodeProps) {
  const pkg = data.packageName || '';
  const { visibleNodeIds } = useFocusContext();
  const isFaded = visibleNodeIds !== null && !visibleNodeIds.has(id);

  return (
    <div
      style={{
        background: selected ? 'var(--accent-blue-select)' : '#2d2d2d',
        borderTop: `1px solid ${selected ? 'var(--accent-blue)' : '#3e3e42'}`,
        borderRight: `1px solid ${selected ? 'var(--accent-blue)' : '#3e3e42'}`,
        borderBottom: `1px solid ${selected ? 'var(--accent-blue)' : '#3e3e42'}`,
        borderLeft: '4px solid #10b981',
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
        style={{ background: '#10b981', width: 6, height: 6 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '12px' }}>⚡</span>
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
      {pkg && (
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
          {pkg}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#10b981', width: 6, height: 6 }}
      />
    </div>
  );
}

export default memo(SkillNode);
