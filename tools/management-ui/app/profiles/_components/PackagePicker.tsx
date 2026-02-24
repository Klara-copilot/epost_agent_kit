'use client';

import { useState } from 'react';
import type { Package } from '@/lib/types/entities';
import SearchInput from '@/app/_components/SearchInput';

interface PackagePickerProps {
  title: string;
  selectedPackageNames: string[];
  allPackages: Package[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}

function summarizePackage(pkg: Package): string {
  const parts: string[] = [];
  const agentCount = pkg.provides.agents.length;
  const skillCount = pkg.provides.skills.length;
  const commandCount = pkg.provides.commands.length;
  if (agentCount > 0) parts.push(`${agentCount} agent${agentCount !== 1 ? 's' : ''}`);
  if (skillCount > 0) parts.push(`${skillCount} skill${skillCount !== 1 ? 's' : ''}`);
  if (commandCount > 0) parts.push(`${commandCount} command${commandCount !== 1 ? 's' : ''}`);
  return parts.length > 0 ? parts.join(', ') : 'empty';
}

export default function PackagePicker({
  title,
  selectedPackageNames,
  allPackages,
  onAdd,
  onRemove,
}: PackagePickerProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedPackages = selectedPackageNames
    .map((name) => allPackages.find((p) => p.name === name))
    .filter((p): p is Package => p !== undefined);

  const unselected = allPackages.filter(
    (p) => !selectedPackageNames.includes(p.name)
  );

  const filteredUnselected = unselected.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div
        className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: 'var(--text-secondary)', letterSpacing: '0.05em' }}
      >
        {title}
      </div>

      {/* Selected package cards */}
      <div className="space-y-1.5">
        {selectedPackages.map((pkg) => (
          <div
            key={pkg.name}
            className="flex items-center justify-between rounded px-3 py-2"
            style={{
              backgroundColor: 'var(--bg-darker)',
              border: '1px solid var(--border)',
            }}
          >
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {pkg.name}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                v{pkg.version} — {summarizePackage(pkg)}
              </div>
            </div>
            <button
              onClick={() => onRemove(pkg.name)}
              className="text-xs px-1.5 py-0.5 rounded cursor-pointer transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              title="Remove package"
            >
              x
            </button>
          </div>
        ))}
        {selectedPackages.length === 0 && (
          <div className="text-xs py-2" style={{ color: 'var(--text-secondary)' }}>
            No packages selected
          </div>
        )}
      </div>

      {/* Add Package section */}
      <div className="mt-2">
        <button
          onClick={() => {
            setAddOpen(!addOpen);
            if (!addOpen) setSearch('');
          }}
          className="text-xs cursor-pointer transition-colors"
          style={{ color: 'var(--accent-blue)' }}
        >
          {addOpen ? '- Hide' : '+ Add Package'}
        </button>

        {addOpen && (
          <div className="mt-2 space-y-1.5">
            <SearchInput value={search} onChange={setSearch} placeholder="Search packages..." />
            <div className="max-h-40 overflow-y-auto space-y-0.5">
              {filteredUnselected.map((pkg) => (
                <button
                  key={pkg.name}
                  onClick={() => onAdd(pkg.name)}
                  className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded text-sm cursor-pointer transition-colors"
                  style={{
                    color: 'var(--text-primary)',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <span style={{ color: 'var(--accent-green)' }}>+</span>
                  <span>{pkg.name}</span>
                  <span className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>
                    v{pkg.version}
                  </span>
                </button>
              ))}
              {filteredUnselected.length === 0 && (
                <div className="text-xs py-2 text-center" style={{ color: 'var(--text-secondary)' }}>
                  No packages available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
