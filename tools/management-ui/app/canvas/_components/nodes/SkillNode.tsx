import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useFocusContext } from '../FocusContext';

/** Layer-based styling config for agent focus mode */
const LAYER_STYLES = {
  declared: {
    borderLeft: '4px solid #10b981',
    opacity: 1,
    delay: '0ms',
    handleColor: '#10b981',
    label: 'Declared',
    labelColor: '#10b981',
  },
  affinity: {
    borderLeft: '4px dashed #f59e0b',
    opacity: 0.85,
    delay: '200ms',
    handleColor: '#f59e0b',
    label: 'Affinity',
    labelColor: '#f59e0b',
  },
  platform: {
    borderLeft: '4px dashed #f59e0b',
    opacity: 0.7,
    delay: '400ms',
    handleColor: '#f59e0b',
    label: 'Platform',
    labelColor: '#f59e0b',
  },
  enhancer: {
    borderLeft: '4px dotted #4ec9b0',
    opacity: 0.5,
    delay: '600ms',
    handleColor: '#4ec9b0',
    label: 'Enhancer',
    labelColor: '#4ec9b0',
  },
} as const;

function SkillNode({ id, data, selected }: NodeProps) {
  const pkg = data.packageName || '';
  const tier = data.tier as string | undefined;
  const isDiscoverable = tier === 'discoverable';
  const hasConnections = data.connections?.extends?.length ||
    data.connections?.requires?.length ||
    data.connections?.enhances?.length ||
    data.connections?.conflicts?.length;
  const { visibleNodeIds, skillLayerMap, focusedAgentId } = useFocusContext();
  const isFaded = visibleNodeIds !== null && !visibleNodeIds.has(id);

  // In agent focus mode, get the layer for this skill
  const layer = focusedAgentId && skillLayerMap ? skillLayerMap.get(id) : null;
  const layerStyle = layer ? LAYER_STYLES[layer] : null;

  // Determine border and handle color based on layer (if in focus) or tier (default)
  const borderLeft = layerStyle
    ? layerStyle.borderLeft
    : isDiscoverable
      ? '4px dashed #f59e0b'
      : '4px solid #10b981';

  const handleColor = layerStyle
    ? layerStyle.handleColor
    : isDiscoverable ? '#f59e0b' : '#10b981';

  // In agent focus mode, use layer-based opacity with staggered transition
  const nodeOpacity = isFaded
    ? 0.08
    : layerStyle
      ? layerStyle.opacity
      : 1;

  const transitionDelay = layerStyle ? layerStyle.delay : '0ms';

  return (
    <div
      style={{
        background: selected ? 'var(--accent-blue-select)' : '#2d2d2d',
        borderTop: `1px solid ${selected ? 'var(--accent-blue)' : '#3e3e42'}`,
        borderRight: `1px solid ${selected ? 'var(--accent-blue)' : '#3e3e42'}`,
        borderBottom: `1px solid ${selected ? 'var(--accent-blue)' : '#3e3e42'}`,
        borderLeft,
        borderRadius: '6px',
        padding: '8px 12px',
        minWidth: '160px',
        cursor: 'pointer',
        opacity: nodeOpacity,
        pointerEvents: isFaded ? 'none' as const : 'all' as const,
        transition: `opacity 0.3s ease ${transitionDelay}, background 0.15s ease, border-left-color 0.3s ease`,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: handleColor, width: 6, height: 6 }}
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
            flex: 1,
          }}
        >
          {data.name}
        </span>
        {/* Layer badge (in agent focus mode) */}
        {layerStyle && (
          <span
            style={{
              fontSize: '8px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: layerStyle.labelColor,
              flexShrink: 0,
            }}
          >
            {layerStyle.label}
          </span>
        )}
        {/* Tier badge (outside focus mode) */}
        {!layerStyle && tier && (
          <span
            title={isDiscoverable ? 'Lazy-loaded on demand' : 'Always loaded'}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              flexShrink: 0,
              background: isDiscoverable ? 'transparent' : '#10b981',
              border: isDiscoverable ? '2px solid #f59e0b' : '2px solid #10b981',
            }}
          />
        )}
        {/* Connection indicator */}
        {hasConnections && !layerStyle && (
          <span
            title="Has skill connections"
            style={{
              fontSize: '9px',
              color: '#4ec9b0',
              flexShrink: 0,
            }}
          >
            ◆
          </span>
        )}
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
        style={{ background: handleColor, width: 6, height: 6 }}
      />
    </div>
  );
}

export default memo(SkillNode);
