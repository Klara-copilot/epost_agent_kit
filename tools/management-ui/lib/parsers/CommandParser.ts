/**
 * Parser for command definition files
 * Location: .claude/commands/*.md (nested structure)
 */

import { readdirSync, statSync, existsSync } from 'fs';
import { join, basename, relative } from 'path';
import { Command, GitStatus, ParseError } from '../types/entities';
import { frontmatterParser } from './FrontmatterParser';
import { logger } from '../utils/logger';

interface CommandFrontmatter {
  name: string;
  title?: string;
  description?: string;
  slug?: string;
  agent?: string;
  'argument-hint'?: string;
}

export class CommandParser {
  /**
   * Parse a single command file and collect validation warnings
   */
  parseFile(
    filePath: string,
    baseDir: string,
    packageName: string,
    commandPrefix: string = '',
    gitStatus: GitStatus = 'clean'
  ): { command: Command; warnings: ParseError[] } {
    const parsed = frontmatterParser.parse<CommandFrontmatter>(filePath);
    const { frontmatter, body } = parsed;
    const warnings: ParseError[] = [];

    const relPath = relative(baseDir, filePath).replace(/\.md$/, '');
    const id = commandPrefix ? `${commandPrefix}${relPath}` : relPath;

    const command: Command = {
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

    return { command, warnings };
  }

  /**
   * Recursively find all .md command files in directory tree
   */
  private findCommandFiles(baseDir: string): string[] {
    const commandFiles: string[] = [];

    const traverse = (dir: string) => {
      try {
        const entries = readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = join(dir, entry.name);

          if (entry.isDirectory()) {
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
   */
  parseAll(
    baseDir: string,
    packageName: string,
    commandPrefix: string = '',
    gitStatusMap?: Map<string, GitStatus>
  ): { commands: Command[]; errors: ParseError[] } {
    if (!existsSync(baseDir)) {
      logger.warn('parser', `Commands directory not found: ${baseDir}`);
      return { commands: [], errors: [] };
    }

    const commandFiles = this.findCommandFiles(baseDir);
    logger.info('parser', `Found ${commandFiles.length} command files in ${baseDir}`);

    const commands: Command[] = [];
    const errors: ParseError[] = [];
    let skipped = 0;

    for (const filePath of commandFiles) {
      try {
        const gitStatus = gitStatusMap?.get(filePath) || 'clean';
        const { command, warnings } = this.parseFile(filePath, baseDir, packageName, commandPrefix, gitStatus);
        commands.push(command);
        errors.push(...warnings);
        logger.debug('parser', `Parsed command: ${command.id}`, {
          name: command.name,
          agent: command.agent,
          warnings: warnings.length,
        });
      } catch (error) {
        skipped++;
        const message = error instanceof Error ? error.message : String(error);
        logger.warn('parser', `Skipping invalid command file ${filePath}`, { error: message });
        errors.push({
          filePath,
          entityType: 'command',
          level: 'error',
          message: `Failed to parse: ${message}`,
        });
      }
    }

    logger.info('parser', `Parsed ${commands.length} commands, skipped ${skipped}, ${errors.length} issues`);
    return { commands, errors };
  }
}

export const commandParser = new CommandParser();
