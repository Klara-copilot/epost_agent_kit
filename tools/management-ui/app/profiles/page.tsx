'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Profile, Package } from '@/lib/types/entities';
import PageLayout from '@/app/_components/PageLayout';
import YamlExport from '@/app/_components/YamlExport';
import { profilesToYaml } from '@/lib/utils/yaml-export';
import ProfileSidebar from './_components/ProfileSidebar';
import ProfileEditor from './_components/ProfileEditor';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        if (json.success && json.data) {
          setProfiles(json.data.profiles);
          setPackages(json.data.packages);
        } else {
          setError(json.error || 'Failed to load data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedProfile = profiles.find((p) => p.name === selectedProfileName) || null;

  const handleProfileChange = useCallback(
    (updated: Profile) => {
      setProfiles((prev) =>
        prev.map((p) => (p.name === updated.name ? updated : p))
      );
    },
    []
  );

  const yamlContent = profiles.length > 0 ? profilesToYaml(profiles) : '';

  if (loading) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-secondary)' }}
      >
        Loading profiles...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-main)', color: '#ef4444' }}
      >
        Error: {error}
      </div>
    );
  }

  const mainContent = selectedProfile ? (
    <ProfileEditor
      profile={selectedProfile}
      allPackages={packages}
      onProfileChange={handleProfileChange}
    />
  ) : (
    <div
      className="h-full flex items-center justify-center"
      style={{ color: 'var(--text-secondary)' }}
    >
      <div className="text-center space-y-2">
        <div className="text-lg">Select a profile</div>
        <div className="text-sm">Choose a profile from the sidebar to view its configuration</div>
      </div>
    </div>
  );

  return (
    <PageLayout
      title="Profile Composer"
      backHref="/"
      sidebar={
        <ProfileSidebar
          profiles={profiles}
          selectedName={selectedProfileName}
          onSelect={setSelectedProfileName}
        />
      }
      main={mainContent}
      inspector={
        profiles.length > 0 ? (
          <div className="p-4">
            <YamlExport yamlContent={yamlContent} filename="profiles.yaml" />
          </div>
        ) : undefined
      }
    />
  );
}
