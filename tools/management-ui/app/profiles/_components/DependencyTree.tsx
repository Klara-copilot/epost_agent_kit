'use client';

import { useState, useMemo } from 'react';
import type { Profile, Package } from '@/lib/types/entities';

interface DependencyTreeProps {
  profile: Profile;
  allPackages: Package[];
}

interface ResolvedPackage {
  pkg: Package;
  kind: 'required' | 'optional' | 'dependency';
}

function resolveTransitiveDeps(
  packageNames: string[],
  kind: 'required' | 'optional',
  allPackages: Package[],
  visited: Set<string>
): ResolvedPackage[] {
  const result: ResolvedPackage[] = [];

  for (const name of packageNames) {
    if (visited.has(name)) continue;
    visited.add(name);

    const pkg = allPackages.find((p) => p.name === name);
    if (!pkg) continue;

    result.push({ pkg, kind });

    // Resolve transitive dependencies
    for (const depName of pkg.dependencies) {
      if (visited.has(depName)) continue;
      visited.add(depName);

      const depPkg = allPackages.find((p) => p.name === depName);
      if (!depPkg) continue;

      result.push({ pkg: depPkg, kind: 'dependency' });

      // Recurse further
      const deeper = resolveTransitiveDeps(
        depPkg.dependencies,
        'dependency' as 'required',
        allPackages,
        visited
      );
      // Override kind for deeper items
      for (const d of deeper) {
        if (!visited.has(d.pkg.name)) {
          result.push({ ...d, kind: 'dependency' });
        }
      }
    }
  }

  return result;
}

function CollapsibleSection({
  label,
  icon,
  color,
  items,
  depth,
  defaultOpen,
}: {
  label: string;
  icon: string;
  color: string;
  items: string[];
  depth: number;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (items.length === 0) return null;

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs py-0.5 cursor-pointer"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span>{open ? '\u25BC' : '\u25B6'}</span>
        <span>{label} ({items.length})</span>
      </button>
      {open && (
        <div style={{ paddingLeft: 16 }}>
          {items.map((item) => (
            <div
              key={item}
              className="text-xs py-0.5 font-mono"
              style={{ color }}
            >
              {icon} {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PackageNode({
  resolved,
  depth,
  defaultOpen,
}: {
  resolved: ResolvedPackage;
  depth: number;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { pkg, kind } = resolved;

  const kindLabel =
    kind === 'required' ? '(required)' : kind === 'optional' ? '(optional)' : '(dependency)';

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm py-1 cursor-pointer"
        style={{ color: 'var(--accent-purple)' }}
      >
        <span className="text-xs">{open ? '\u25BC' : '\u25B6'}</span>
        <span style={{ color: 'var(--accent-purple)' }}>{'\uD83D\uDCE6'} {pkg.name}</span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {kindLabel}
        </span>
      </button>
      {open && (
        <>
          <CollapsibleSection
            label="Agents"
            icon={'\uD83E\uDD16'}
            color="var(--accent-blue)"
            items={pkg.provides.agents}
            depth={depth + 1}
            defaultOpen={false}
          />
          <CollapsibleSection
            label="Skills"
            icon={'\uD83D\uDD27'}
            color="var(--accent-green)"
            items={pkg.provides.skills}
            depth={depth + 1}
            defaultOpen={false}
          />
          <CollapsibleSection
            label="Commands"
            icon={'\u2318'}
            color="var(--accent-orange)"
            items={pkg.provides.commands}
            depth={depth + 1}
            defaultOpen={false}
          />
        </>
      )}
    </div>
  );
}

export default function DependencyTree({ profile, allPackages }: DependencyTreeProps) {
  const [rootOpen, setRootOpen] = useState(true);

  const resolvedPackages = useMemo(() => {
    const visited = new Set<string>();
    const required = resolveTransitiveDeps(
      profile.packages,
      'required',
      allPackages,
      visited
    );
    const optional = resolveTransitiveDeps(
      profile.optional || [],
      'optional',
      allPackages,
      visited
    );
    return [...required, ...optional];
  }, [profile, allPackages]);

  const directPackageNames = new Set([
    ...profile.packages,
    ...(profile.optional || []),
  ]);

  return (
    <div>
      <div
        className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: 'var(--text-secondary)', letterSpacing: '0.05em' }}
      >
        Dependency Tree
      </div>
      <div
        className="rounded p-3"
        style={{
          backgroundColor: 'var(--bg-darker)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Root node */}
        <button
          onClick={() => setRootOpen(!rootOpen)}
          className="flex items-center gap-1.5 text-sm py-1 cursor-pointer font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          <span className="text-xs">{rootOpen ? '\u25BC' : '\u25B6'}</span>
          <span>Profile: &ldquo;{profile.displayName}&rdquo;</span>
        </button>

        {rootOpen && (
          <div>
            {resolvedPackages.length === 0 && (
              <div className="text-xs py-2 pl-4" style={{ color: 'var(--text-secondary)' }}>
                No packages
              </div>
            )}
            {resolvedPackages.map((resolved) => (
              <PackageNode
                key={resolved.pkg.name}
                resolved={resolved}
                depth={1}
                defaultOpen={directPackageNames.has(resolved.pkg.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
