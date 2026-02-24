'use client';

import { useState } from 'react';
import SearchInput from '@/app/_components/SearchInput';

interface ItemPickerProps {
  title: string;
  included: string[];
  available: string[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  color: string;
}

export default function ItemPicker({
  title,
  included,
  available,
  onAdd,
  onRemove,
  color,
}: ItemPickerProps) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');

  const filteredAvailable = available.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="rounded"
      style={{
        backgroundColor: 'var(--bg-darker)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Section Header */}
      <div
        className="px-3 py-2 text-xs font-semibold uppercase tracking-wide"
        style={{
          color: color,
          borderLeft: `3px solid ${color}`,
        }}
      >
        {title}
      </div>

      {/* Included Items */}
      <div className="px-3 pb-2">
        {included.length === 0 && (
          <div
            className="text-xs py-1 italic"
            style={{ color: 'var(--text-secondary)' }}
          >
            None
          </div>
        )}
        {included.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between py-1 group"
          >
            <span
              className="text-xs font-mono truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {item}
            </span>
            <button
              onClick={() => onRemove(item)}
              className="text-xs px-1.5 rounded cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-secondary)' }}
            >
              x
            </button>
          </div>
        ))}
      </div>

      {/* Available Items (collapsible) */}
      <div
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left px-3 py-1.5 text-xs cursor-pointer transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          {expanded ? '- Hide' : '+'} Available ({available.length})
        </button>

        {expanded && (
          <div className="px-3 pb-2 space-y-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={`Filter ${title.toLowerCase()}...`}
            />
            <div className="max-h-40 overflow-y-auto mt-1">
              {filteredAvailable.length === 0 && (
                <div
                  className="text-xs py-1 italic"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  No items available
                </div>
              )}
              {filteredAvailable.map((item) => (
                <button
                  key={item}
                  onClick={() => onAdd(item)}
                  className="w-full text-left flex items-center gap-1 py-1 text-xs font-mono cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span style={{ color }}>+</span>
                  <span className="truncate">{item}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
