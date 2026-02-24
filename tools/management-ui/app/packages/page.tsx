'use client';

import { useEffect, useState } from 'react';
import type { Package, Agent, Skill, Command } from '@/lib/types/entities';
import { packageToYaml } from '@/lib/utils/yaml-export';
import PageLayout from '@/app/_components/PageLayout';
import YamlExport from '@/app/_components/YamlExport';
import PackageSidebar from './_components/PackageSidebar';
import PackageEditor from './_components/PackageEditor';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [selectedPackageName, setSelectedPackageName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        if (json.success && json.data) {
          setPackages(json.data.packages);
          setAgents(json.data.agents);
          setSkills(json.data.skills);
          setCommands(json.data.commands);
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

  const selectedPackage = packages.find((p) => p.name === selectedPackageName) || null;

  const yamlContent = selectedPackage ? packageToYaml(selectedPackage) : '';

  const handlePackageChange = (updated: Package) => {
    setPackages((prev) =>
      prev.map((p) => (p.name === updated.name ? updated : p))
    );
  };

  if (loading) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-secondary)' }}
      >
        Loading packages...
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

  const sidebar = (
    <PackageSidebar
      packages={packages}
      selectedName={selectedPackageName}
      onSelect={setSelectedPackageName}
    />
  );

  const main = selectedPackage ? (
    <PackageEditor
      pkg={selectedPackage}
      allPackageNames={packages.map((p) => p.name)}
      allAgents={agents}
      allSkills={skills}
      allCommands={commands}
      onPackageChange={handlePackageChange}
    />
  ) : (
    <div
      className="h-full flex items-center justify-center"
      style={{ color: 'var(--text-secondary)' }}
    >
      Select a package from the sidebar
    </div>
  );

  const inspector = selectedPackage ? (
    <div className="p-4">
      <YamlExport
        yamlContent={yamlContent}
        filename={`${selectedPackage.name}.yaml`}
      />
    </div>
  ) : undefined;

  return (
    <PageLayout
      title="Package Designer"
      backHref="/"
      sidebar={sidebar}
      main={main}
      inspector={inspector}
    />
  );
}
