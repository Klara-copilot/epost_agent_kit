/**
 * Parser for skill definition files
 * Location: .claude/skills/SKILL.md (nested structure)
 */

import { readdirSync, statSync, existsSync } from 'fs';
import { join, basename, dirname, relative } from 'path';
import { Skill, Reference, ContextType, GitStatus, ParseError } from '../types/entities';
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

const VALID_CONTEXTS: ContextType[] = ['fork', 'inline'];

export class SkillParser {
  /**
   * Parse a single skill file and collect validation warnings
   */
  parseFile(
    filePath: string,
    baseDir: string,
    packageName: string,
    gitStatus: GitStatus = 'clean'
  ): { skill: Skill; warnings: ParseError[] } {
    const parsed = frontmatterParser.parse<SkillFrontmatter>(filePath);
    const { frontmatter, body } = parsed;
    const warnings: ParseError[] = [];

    const skillDir = dirname(filePath);
    const id = relative(baseDir, skillDir);

    // Validate context
    if (frontmatter.context && !VALID_CONTEXTS.includes(frontmatter.context)) {
      warnings.push({
        filePath,
        entityType: 'skill',
        level: 'warning',
        field: 'context',
        value: frontmatter.context,
        message: `Invalid context '${frontmatter.context}' — must be one of: ${VALID_CONTEXTS.join(', ')}`,
      });
    }

    // context: fork requires agent field
    if (frontmatter.context === 'fork' && !frontmatter.agent) {
      warnings.push({
        filePath,
        entityType: 'skill',
        level: 'warning',
        field: 'agent',
        message: `context is 'fork' but 'agent' field is missing — skill won't know which agent to fork`,
      });
    }

    // version is not a valid frontmatter field for skills
    if (frontmatter.version !== undefined) {
      warnings.push({
        filePath,
        entityType: 'skill',
        level: 'warning',
        field: 'version',
        value: frontmatter.version,
        message: `'version' is not a valid frontmatter field for skills`,
      });
    }

    const references = this.extractReferences(skillDir, frontmatter.name || id);

    const skill: Skill = {
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
      userInvocable: frontmatter['user-invocable'] !== false,
      context: frontmatter.context,
      agent: frontmatter.agent,
      disableModelInvocation: frontmatter['disable-model-invocation'],
      version: frontmatter.version,
      references,
    };

    return { skill, warnings };
  }

  /**
   * Extract reference files from skill directory
   */
  private extractReferences(skillDir: string, skillName: string): Reference[] {
    const references: Reference[] = [];

    try {
      const files = readdirSync(skillDir);

      for (const file of files) {
        if (file === 'SKILL.md') continue;

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
   */
  private findSkillFiles(baseDir: string): string[] {
    const skillFiles: string[] = [];

    const traverse = (dir: string) => {
      try {
        const entries = readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = join(dir, entry.name);

          if (entry.isDirectory()) {
            const skillFile = join(fullPath, 'SKILL.md');
            if (existsSync(skillFile)) {
              skillFiles.push(skillFile);
            }
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
   */
  parseAll(
    baseDir: string,
    packageName: string,
    gitStatusMap?: Map<string, GitStatus>
  ): { skills: Skill[]; errors: ParseError[] } {
    const skillFiles = this.findSkillFiles(baseDir);
    logger.info('parser', `Found ${skillFiles.length} skill files in ${baseDir}`);

    const skills: Skill[] = [];
    const errors: ParseError[] = [];
    let skipped = 0;

    for (const filePath of skillFiles) {
      try {
        const gitStatus = gitStatusMap?.get(filePath) || 'clean';
        const { skill, warnings } = this.parseFile(filePath, baseDir, packageName, gitStatus);
        skills.push(skill);
        errors.push(...warnings);
        logger.debug('parser', `Parsed skill: ${skill.id}`, {
          name: skill.name,
          path: filePath,
          warnings: warnings.length,
        });
      } catch (error) {
        skipped++;
        const message = error instanceof Error ? error.message : String(error);
        logger.warn('parser', `Skipping invalid skill file: ${filePath}`, { error: message });
        errors.push({
          filePath,
          entityType: 'skill',
          level: 'error',
          message: `Failed to parse: ${message}`,
        });
      }
    }

    logger.info('parser', `Parsed ${skills.length} skills, skipped ${skipped}, ${errors.length} issues`);
    return { skills, errors };
  }
}

export const skillParser = new SkillParser();
