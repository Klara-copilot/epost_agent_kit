'use client';

import yaml from 'js-yaml';
import type { Package, Agent, Skill, Command } from '@/lib/types/entities';
import ProvidesEditor from './ProvidesEditor';

interface PackageEditorProps {
  pkg: Package;
  allPackageNames: string[];
  allAgents: Agent[];
  allSkills: Skill[];
  allCommands: Command[];
  onPackageChange: (pkg: Package) => void;
}

const inputStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-darker)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  padding: '6px 10px',
  borderRadius: '4px',
  fontSize: '13px',
  width: '100%',
};

const labelStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

export default function PackageEditor({
  pkg,
  allPackageNames,
  allAgents,
  allSkills,
  allCommands,
  onPackageChange,
}: PackageEditorProps) {
  const handleChange = (field: keyof Package, value: unknown) => {
    onPackageChange({ ...pkg, [field]: value });
  };

  const handleProvidesChange = (provides: Package['provides']) => {
    onPackageChange({ ...pkg, provides });
  };

  const filesYaml = pkg.files && Object.keys(pkg.files).length > 0
    ? yaml.dump(pkg.files, { lineWidth: -1, sortKeys: false })
    : '';

  // Suppress unused variable warning — allPackageNames is reserved for future dependency editing
  void allPackageNames;

  return (
    <div className="p-6 space-y-5">
      {/* Name (read-only) */}
      <div className="space-y-1">
        <label style={labelStyle}>Name</label>
        <div
          className="text-sm font-mono px-2.5 py-1.5 rounded"
          style={{
            backgroundColor: 'var(--bg-darker)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          {pkg.name}
        </div>
      </div>

      {/* Version */}
      <div className="space-y-1">
        <label style={labelStyle}>Version</label>
        <input
          type="text"
          value={pkg.version}
          onChange={(e) => handleChange('version', e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label style={labelStyle}>Description</label>
        <textarea
          rows={3}
          value={pkg.description}
          onChange={(e) => handleChange('description', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' as const }}
        />
      </div>

      {/* Layer */}
      <div className="space-y-1">
        <label style={labelStyle}>Layer</label>
        <input
          type="number"
          value={pkg.layer}
          onChange={(e) => handleChange('layer', parseInt(e.target.value, 10) || 0)}
          style={{ ...inputStyle, width: '100px' }}
        />
      </div>

      {/* Platforms */}
      <div className="space-y-1">
        <label style={labelStyle}>Platforms</label>
        <div className="flex flex-wrap gap-1.5">
          {pkg.platforms.map((platform) => (
            <span
              key={platform}
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--bg-darker)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              {platform}
            </span>
          ))}
        </div>
      </div>

      {/* Dependencies */}
      <div className="space-y-1">
        <label style={labelStyle}>Dependencies</label>
        <div className="flex flex-wrap gap-1.5">
          {pkg.dependencies.length === 0 && (
            <span
              className="text-xs italic"
              style={{ color: 'var(--text-secondary)' }}
            >
              None
            </span>
          )}
          {pkg.dependencies.map((dep) => (
            <span
              key={dep}
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--bg-darker)',
                border: '1px solid var(--border)',
                color: 'var(--accent-purple)',
              }}
            >
              {dep}
            </span>
          ))}
        </div>
      </div>

      {/* Settings Strategy (only shown if exists) */}
      {pkg.settingsStrategy && (
        <div className="space-y-1">
          <label style={labelStyle}>Settings Strategy</label>
          <div className="flex gap-4">
            {(['base', 'merge', 'overlay'] as const).map((strategy) => (
              <label
                key={strategy}
                className="flex items-center gap-1.5 text-xs cursor-pointer"
                style={{ color: 'var(--text-primary)' }}
              >
                <input
                  type="radio"
                  name="settingsStrategy"
                  value={strategy}
                  checked={pkg.settingsStrategy === strategy}
                  onChange={() => handleChange('settingsStrategy', strategy)}
                />
                {strategy}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Files (read-only code block) */}
      {filesYaml && (
        <div className="space-y-1">
          <label style={labelStyle}>Files</label>
          <pre
            className="text-xs font-mono p-3 rounded overflow-x-auto"
            style={{
              backgroundColor: 'var(--bg-darker)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            {filesYaml}
          </pre>
        </div>
      )}

      {/* Provides Editor */}
      <ProvidesEditor
        provides={pkg.provides}
        allAgents={allAgents}
        allSkills={allSkills}
        allCommands={allCommands}
        onProvidesChange={handleProvidesChange}
      />
    </div>
  );
}
