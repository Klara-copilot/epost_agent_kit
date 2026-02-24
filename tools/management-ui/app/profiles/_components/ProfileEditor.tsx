'use client';

import type { Profile, Package } from '@/lib/types/entities';
import PackagePicker from './PackagePicker';
import DependencyTree from './DependencyTree';

interface ProfileEditorProps {
  profile: Profile;
  allPackages: Package[];
  onProfileChange: (profile: Profile) => void;
}

const labelStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};

const inputStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-darker)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  padding: '6px 10px',
  borderRadius: '4px',
  fontSize: '13px',
  width: '100%',
};

export default function ProfileEditor({
  profile,
  allPackages,
  onProfileChange,
}: ProfileEditorProps) {
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
            color: 'var(--text-secondary)',
          }}
        >
          {profile.name}
        </div>
      </div>

      {/* Display Name */}
      <div className="space-y-1">
        <label style={labelStyle}>Display Name</label>
        <input
          type="text"
          value={profile.displayName}
          onChange={(e) =>
            onProfileChange({ ...profile, displayName: e.target.value })
          }
          style={inputStyle}
        />
      </div>

      {/* Teams */}
      <div className="space-y-1">
        <label style={labelStyle}>Teams</label>
        <input
          type="text"
          value={(profile.teams || []).join(', ')}
          onChange={(e) => {
            const teams = e.target.value
              .split(',')
              .map((t) => t.trim())
              .filter((t) => t.length > 0);
            onProfileChange({ ...profile, teams: teams.length > 0 ? teams : undefined });
          }}
          placeholder="e.g. ios, android, web"
          style={inputStyle}
        />
      </div>

      {/* Required Packages */}
      <PackagePicker
        title="Required Packages"
        selectedPackageNames={profile.packages}
        allPackages={allPackages}
        onAdd={(name) =>
          onProfileChange({ ...profile, packages: [...profile.packages, name] })
        }
        onRemove={(name) =>
          onProfileChange({
            ...profile,
            packages: profile.packages.filter((n) => n !== name),
          })
        }
      />

      {/* Optional Packages */}
      <PackagePicker
        title="Optional Packages"
        selectedPackageNames={profile.optional || []}
        allPackages={allPackages}
        onAdd={(name) =>
          onProfileChange({
            ...profile,
            optional: [...(profile.optional || []), name],
          })
        }
        onRemove={(name) =>
          onProfileChange({
            ...profile,
            optional: (profile.optional || []).filter((n) => n !== name),
          })
        }
      />

      {/* Dependency Tree */}
      <DependencyTree profile={profile} allPackages={allPackages} />
    </div>
  );
}
