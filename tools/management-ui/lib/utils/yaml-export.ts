import yaml from 'js-yaml';
import type { Package, Profile } from '../types/entities';

/**
 * Converts a Package object back to package.yaml format.
 * Maps settingsStrategy -> settings_strategy and structures the output
 * to match the expected YAML file format.
 */
export function packageToYaml(pkg: Package): string {
  const doc: Record<string, unknown> = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    layer: pkg.layer,
    platforms: pkg.platforms,
    dependencies: pkg.dependencies,
  };

  if (pkg.recommends && pkg.recommends.length > 0) {
    doc.recommends = pkg.recommends;
  }

  doc.provides = pkg.provides;

  if (pkg.files && Object.keys(pkg.files).length > 0) {
    doc.files = pkg.files;
  }

  if (pkg.settingsStrategy) {
    doc.settings_strategy = pkg.settingsStrategy;
  }

  return yaml.dump(doc, { lineWidth: -1, sortKeys: false });
}

/**
 * Converts a Profile[] array back to profiles.yaml format.
 * Wraps profiles in { config: { multi_select, dedup }, profiles: {...} }
 * and maps displayName -> display_name.
 */
export function profilesToYaml(profiles: Profile[]): string {
  const profilesMap: Record<string, Record<string, unknown>> = {};

  for (const profile of profiles) {
    const entry: Record<string, unknown> = {
      display_name: profile.displayName,
      packages: profile.packages,
    };

    if (profile.teams && profile.teams.length > 0) {
      entry.teams = profile.teams;
    }

    if (profile.optional && profile.optional.length > 0) {
      entry.optional = profile.optional;
    }

    profilesMap[profile.name] = entry;
  }

  const doc = {
    config: {
      multi_select: true,
      dedup: true,
    },
    profiles: profilesMap,
  };

  return yaml.dump(doc, { lineWidth: -1, sortKeys: false });
}
