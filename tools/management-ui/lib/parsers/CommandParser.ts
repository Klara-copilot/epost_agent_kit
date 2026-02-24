/**
 * Parser for command definition files
 * Location: .claude/commands/*.md (nested structure)
 */

import { readdirSync, statSync, existsSync } from 'fs';
import { join, basename, relative } from 'path';
import { Command, GitStatus } from '../types/entities';
import { frontmatterParser } from './FrontmatterParser';
import { logger } from '../utils/logger';

interface CommandFrontmatter {
  name: string;
  title?: string;
  description?: string;
  slug?: string;
  agent: string;
  'argument-hint'?: string;
}

export class CommandParser {
  /**
   * Parse a single command file
   * @param filePath - Path to command .md file
   * @param baseDir - Base commands directory for calculating relative ID
   * @param gitStatus - Git status of the file
   * @returns Parsed Command object
   */
  parseFile(filePath: string, baseDir: string, packageName: string, commandPrefix: string = '', gitStatus: GitStatus = 'clean'): Command {
    const parsed = frontmatterParser.parse<CommandFrontmatter>(filePath);
    const { frontmatter, body } = parsed;

    // Generate ID from relative path (without .md extension), prefixed by the
    // package's installation path to avoid collisions across packages.
    // Example: prefix="android/", relPath="cook" → id="android/cook"
    // Example: prefix="" (core), relPath="epost/cook" → id="epost/cook"
    const relPath = relative(baseDir, filePath).replace(/\.md$/, '');
    const id = commandPrefix ? `${commandPrefix}${relPath}` : relPath;

    return {
      id,
      name: frontmatter.name || id,
      title: frontmatter.title || frontmatter.name || id,
      description: frontmatter.description || body.trim().split('\n')[0] || '',
      path: filePath,
      lastModified: new Date(statSync(filePath).mtime),
      gitStatus,
      packageName,
      slug: frontmatter.slug || id,
      agent: frontmatter.agent || '',
      argumentHint: frontmatter['argument-hint'],
    };
  }

  /**
   * Recursively find all .md command files in directory tree
   * @param baseDir - Base commands directory
   * @returns Array of command file paths
   */
  private findCommandFiles(baseDir: string): string[] {
    const commandFiles: string[] = [];

    const traverse = (dir: string) => {
      try {
        const entries = readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = join(dir, entry.name);

          if (entry.isDirectory()) {
            // Recurse into subdirectory
            traverse(fullPath);
          } else if (entry.isFile() && entry.name.endsWith('.md')) {
            commandFiles.push(fullPath);
          }
        }
      } catch (error) {
        console.error(`Failed to traverse directory ${dir}:`, error);
      }
    };

    traverse(baseDir);
    return commandFiles;
  }

  /**
   * Parse all command files in a directory tree
   * @param baseDir - Path to base commands directory
   * @param gitStatusMap - Map of file paths to git status
   * @returns Array of parsed Command objects
   */
  parseAll(baseDir: string, packageName: string, commandPrefix: string = '', gitStatusMap?: Map<string, GitStatus>): Command[] {
    if (!existsSync(baseDir)) {
      logger.warn('parser', `Commands directory not found: ${baseDir}`);
      return [];
    }

    const commandFiles = this.findCommandFiles(baseDir);
    logger.info('parser', `Found ${commandFiles.length} command files in ${baseDir}`);

    const commands: Command[] = [];
    let skipped = 0;
    for (const filePath of commandFiles) {
      try {
        const gitStatus = gitStatusMap?.get(filePath) || 'clean';
        const command = this.parseFile(filePath, baseDir, packageName, commandPrefix, gitStatus);
        commands.push(command);
        logger.debug('parser', `Parsed command: ${command.id}`, {
          name: command.name,
          agent: command.agent,
        });
      } catch (error) {
        skipped++;
        logger.warn('parser', `Skipping invalid command file ${filePath}`, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    logger.info('parser', `Parsed ${commands.length} commands, skipped ${skipped}`);
    return commands;
  }
}

export const commandParser = new CommandParser();
