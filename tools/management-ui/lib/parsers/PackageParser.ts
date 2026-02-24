/**
 * Parser for package.yaml files
 * Location: packages/[package-name]/package.yaml
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import * as yaml from 'js-yaml';
import { Package, GitStatus } from '../types/entities';

interface PackageYAML {
  name: string;
  version: string;
  description: string;
  layer: number;
  platforms?: string[];
  dependencies?: string[];
  recommends?: string[];
  provides?: {
    agents?: string[];
    skills?: string[];
    commands?: string[];
  };
  files?: Record<string, string>;
  'settings-strategy'?: 'base' | 'merge' | 'overlay';
}

export class PackageParser {
  /**
   * Parse a single package.yaml file
   * @param filePath - Path to package.yaml file
   * @param gitStatus - Git status of the file
   * @returns Parsed Package object
   */
  parseFile(filePath: string, gitStatus: GitStatus = 'clean'): Package {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const data = yaml.load(fileContent) as PackageYAML;

      return {
        name: data.name,
        version: data.version || '0.0.0',
        description: data.description || '',
        layer: data.layer || 0,
        platforms: data.platforms || [],
        dependencies: data.dependencies || [],
        recommends: data.recommends,
        provides: {
          agents: data.provides?.agents || [],
          skills: data.provides?.skills || [],
          commands: data.provides?.commands || [],
        },
        files: data.files || {},
        settingsStrategy: data['settings-strategy'],
        path: filePath,
        gitStatus,
      };
    } catch (error) {
      throw new Error(`Failed to parse package from ${filePath}: ${error}`);
    }
  }

  /**
   * Find all package.yaml files in packages directory
   * @param packagesDir - Base packages directory
   * @returns Array of package.yaml file paths
   */
  private findPackageFiles(packagesDir: string): string[] {
    const packageFiles: string[] = [];

    try {
      const entries = readdirSync(packagesDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const packageYaml = join(packagesDir, entry.name, 'package.yaml');
          if (existsSync(packageYaml)) {
            packageFiles.push(packageYaml);
          }
        }
      }
    } catch (error) {
      console.error(`Failed to find package files in ${packagesDir}:`, error);
    }

    return packageFiles;
  }

  /**
   * Parse all package.yaml files in packages directory
   * @param packagesDir - Path to packages directory
   * @param gitStatusMap - Map of file paths to git status
   * @returns Array of parsed Package objects
   */
  parseAll(packagesDir: string, gitStatusMap?: Map<string, GitStatus>): Package[] {
    if (!existsSync(packagesDir)) {
      console.warn(`Packages directory not found: ${packagesDir}`);
      return [];
    }

    const packageFiles = this.findPackageFiles(packagesDir);

    return packageFiles.map(filePath => {
      const gitStatus = gitStatusMap?.get(filePath) || 'clean';
      return this.parseFile(filePath, gitStatus);
    });
  }
}

export const packageParser = new PackageParser();
