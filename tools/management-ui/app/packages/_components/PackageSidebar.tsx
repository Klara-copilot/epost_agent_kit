'use client';

import { useState } from 'react';
import type { Package } from '@/lib/types/entities';
import SearchInput from '@/app/_components/SearchInput';
import SidebarItem from '@/app/_components/SidebarItem';

interface PackageSidebarProps {
  packages: Package[];
  selectedName: string | null;
  onSelect: (name: string) => void;
}

const PURPLE_COLOR = {
  bg: 'transparent',
  text: 'var(--accent-purple)',
  border: 'transparent',
};

export default function PackageSidebar({
  packages,
  selectedName,
  onSelect,
}: PackageSidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3 space-y-2">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search packages..."
      />
      {filtered.map((pkg) => (
        <SidebarItem
          key={pkg.name}
          label={pkg.name}
          subtitle={`v${pkg.version} \u00b7 layer ${pkg.layer}`}
          selected={pkg.name === selectedName}
          onClick={() => onSelect(pkg.name)}
          color={PURPLE_COLOR}
        />
      ))}
    </div>
  );
}
