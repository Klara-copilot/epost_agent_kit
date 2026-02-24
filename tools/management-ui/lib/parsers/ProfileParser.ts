/**
 * Parser for profiles.yaml file (profiles/profiles.yaml)
 */

import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Profile } from '../types/entities';

interface ProfilesYAML {
  config?: {
    multi_select?: boolean;
    dedup?: boolean;
  };
  profiles: Record<string, {
    display_name: string;
    teams?: string[];
    packages: string[];
    optional?: string[];
  }>;
}

export class ProfileParser {
  /**
   * Parse the profiles.yaml file
   * @param filePath - Path to profiles.yaml file
   * @returns Array of parsed Profile objects
   */
  parseFile(filePath: string): Profile[] {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const data = yaml.load(fileContent) as ProfilesYAML;

      if (!data.profiles || typeof data.profiles !== 'object') {
        throw new Error('Invalid profiles.yaml structure: missing or invalid profiles object');
      }

      return Object.entries(data.profiles).map(([name, profile]) => ({
        name,
        displayName: profile.display_name || name,
        teams: profile.teams,
        packages: profile.packages || [],
        optional: profile.optional,
      }));
    } catch (error) {
      throw new Error(`Failed to parse profiles from ${filePath}: ${error}`);
    }
  }
}

export const profileParser = new ProfileParser();
