'use client';

import { useState } from 'react';
import type { Profile } from '@/lib/types/entities';
import SearchInput from '@/app/_components/SearchInput';
import SidebarItem from '@/app/_components/SidebarItem';

interface ProfileSidebarProps {
  profiles: Profile[];
  selectedName: string | null;
  onSelect: (name: string) => void;
}

const sidebarColor = { bg: 'transparent', text: 'var(--text-primary)', border: 'transparent' };

export default function ProfileSidebar({ profiles, selectedName, onSelect }: ProfileSidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    return p.displayName.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
  });

  return (
    <div className="p-3 space-y-2">
      <SearchInput value={search} onChange={setSearch} placeholder="Search profiles..." />
      {filtered.map((profile) => (
        <SidebarItem
          key={profile.name}
          label={profile.displayName}
          subtitle={profile.name}
          selected={selectedName === profile.name}
          onClick={() => onSelect(profile.name)}
          color={sidebarColor}
        />
      ))}
      {filtered.length === 0 && (
        <div className="text-xs text-center py-4" style={{ color: 'var(--text-secondary)' }}>
          No profiles found
        </div>
      )}
    </div>
  );
}
