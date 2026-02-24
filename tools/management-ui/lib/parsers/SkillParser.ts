/**
 * Parser for skill definition files
 * Location: .claude/skills/SKILL.md (nested structure)
 */

import { readdirSync, statSync, existsSync } from 'fs';
import { join, basename, dirname, relative } from 'path';
import { Skill, Reference, ContextType, GitStatus } from '../types/entities';
import { frontmatterParser } from './FrontmatterParser';
import { logger } from '../utils/logger';

interface SkillFrontmatter {
  name: string;
  description?: string;
  keywords?: string[];
  platforms?: string[];
  triggers?: string[];
  'agent-affinity'?: string[];
  'user-invocable'?: boolean;
  context?: ContextType;
  agent?: string;
  'disable-model-invocation'?: boolean;
  version?: string;
}

export class SkillParser {
  /**
   * Parse a single skill file
   * @param filePath - Path to SKILL.md file
   * @param baseDir - Base skills directory for calculating relative ID
   * @param gitStatus - Git status of the file
   * @returns Parsed Skill object
   */
  parseFile(filePath: string, baseDir: string, packageName: string, gitStatus: GitStatus = 'clean'): Skill {
    const parsed = frontmatterParser.parse<SkillFrontmatter>(filePath);
    const { frontmatter, body } = parsed;

    // Calculate relative path from baseDir to skill directory as ID
    // Example: /path/to/skills/web/frontend-development/SKILL.md -> web/frontend-development
    const skillDir = dirname(filePath);
    const id = relative(baseDir, skillDir);

    // Extract references from the skill directory
    const references = this.extractReferences(skillDir, frontmatter.name || id);

    return {
      id,
      name: frontmatter.name || id,
      description: frontmatter.description || body.trim().split('\n')[0] || '',
      path: filePath,
      lastModified: new Date(statSync(filePath).mtime),
      gitStatus,
      packageName,
      keywords: frontmatter.keywords || [],
      platforms: frontmatter.platforms || [],
      triggers: frontmatter.triggers || [],
      agentAffinity: frontmatter['agent-affinity'] || [],
      userInvocable: frontmatter['user-invocable'] !== false, // default true
      context: frontmatter.context,
      agent: frontmatter.agent,
      disableModelInvocation: frontmatter['disable-model-invocation'],
      version: frontmatter.version,
      references,
    };
  }

  /**
   * Extract reference files from skill directory
   * @param skillDir - Path to skill directory
   * @param skillName - Name of the skill
   * @returns Array of reference files
   */
  private extractReferences(skillDir: string, skillName: string): Reference[] {
    const references: Reference[] = [];

    try {
      const files = readdirSync(skillDir);

      for (const file of files) {
        // Skip the main SKILL.md file
        if (file === 'SKILL.md') continue;

        // Include .md and .txt files as references
        if (file.endsWith('.md') || file.endsWith('.txt')) {
          const filePath = join(skillDir, file);
          references.push({
            name: file,
            path: filePath,
            skillName,
          });
        }
      }
    } catch (error) {
      console.error(`Failed to extract references from ${skillDir}:`, error);
    }

    return references;
  }

  /**
   * Recursively find all SKILL.md files in directory tree
   * @param baseDir - Base skills directory
   * @returns Array of SKILL.md file paths
   */
  private findSkillFiles(baseDir: string): string[] {
    const skillFiles: string[] = [];

    const traverse = (dir: string) => {
      try {
        const entries = readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = join(dir, entry.name);

          if (entry.isDirectory()) {
            // Check if this directory has a SKILL.md
            const skillFile = join(fullPath, 'SKILL.md');
            if (existsSync(skillFile)) {
              skillFiles.push(skillFile);
            }
            // Recurse into subdirectory
            traverse(fullPath);
          }
        }
      } catch (error) {
        console.error(`Failed to traverse directory ${dir}:`, error);
      }
    };

    traverse(baseDir);
    return skillFiles;
  }

  /**
   * Parse all skill files in a directory tree
   * @param baseDir - Path to base skills directory
   * @param gitStatusMap - Map of file paths to git status
   * @returns Array of parsed Skill objects
   */
  parseAll(baseDir: string, packageName: string, gitStatusMap?: Map<string, GitStatus>): Skill[] {
    const skillFiles = this.findSkillFiles(baseDir);
    logger.info('parser', `Found ${skillFiles.length} skill files in ${baseDir}`);

    const skills: Skill[] = [];
    let skipped = 0;

    for (const filePath of skillFiles) {
      try {
        const gitStatus = gitStatusMap?.get(filePath) || 'clean';
        const skill = this.parseFile(filePath, baseDir, packageName, gitStatus);
        skills.push(skill);
        logger.debug('parser', `Parsed skill: ${skill.id}`, {
          name: skill.name,
          path: filePath,
        });
      } catch (error) {
        skipped++;
        logger.warn('parser', `Skipping invalid skill file: ${filePath}`, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    logger.info('parser', `Parsed ${skills.length} skills, skipped ${skipped}`);
    return skills;
  }
}

export const skillParser = new SkillParser();
