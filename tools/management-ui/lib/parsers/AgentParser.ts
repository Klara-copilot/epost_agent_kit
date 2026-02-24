/**
 * Parser for agent definition files (.claude/agents/*.md)
 */

import { readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { Agent, ModelType, MemoryType, PermissionMode, GitStatus } from '../types/entities';
import { frontmatterParser } from './FrontmatterParser';
import { logger } from '../utils/logger';

interface AgentFrontmatter {
  name: string;
  description?: string;
  model: ModelType;
  color: string;
  tools?: string[];
  skills?: string[];
  memory?: MemoryType;
  permissionMode?: PermissionMode;
  disallowedTools?: string[];
  hooks?: Record<string, unknown>;
}

export class AgentParser {
  /**
   * Parse a single agent file
   * @param filePath - Path to agent .md file
   * @param gitStatus - Git status of the file
   * @returns Parsed Agent object
   */
  parseFile(filePath: string, packageName: string, gitStatus: GitStatus = 'clean'): Agent {
    const parsed = frontmatterParser.parse<AgentFrontmatter>(filePath);
    const { frontmatter, body } = parsed;

    // Generate ID from filename (without .md extension)
    const id = basename(filePath, '.md');

    return {
      id,
      name: frontmatter.name || id,
      description: frontmatter.description || body.trim().split('\n')[0] || '',
      path: filePath,
      lastModified: new Date(statSync(filePath).mtime),
      gitStatus,
      packageName,
      model: frontmatter.model || 'haiku',
      color: frontmatter.color || 'blue',
      tools: frontmatter.tools,
      skills: frontmatter.skills || [],
      memory: frontmatter.memory,
      permissionMode: frontmatter.permissionMode,
      disallowedTools: frontmatter.disallowedTools,
      hooks: frontmatter.hooks,
    };
  }

  /**
   * Parse all agent files in a directory
   * @param directory - Path to agents directory
   * @param gitStatusMap - Map of file paths to git status
   * @returns Array of parsed Agent objects
   */
  parseAll(directory: string, packageName: string, gitStatusMap?: Map<string, GitStatus>): Agent[] {
    try {
      const files = readdirSync(directory).filter(file => file.endsWith('.md'));
      logger.info('parser', `Found ${files.length} agent files in ${directory}`);

      const agents: Agent[] = [];
      let skipped = 0;

      for (const file of files) {
        try {
          const filePath = join(directory, file);
          const gitStatus = gitStatusMap?.get(filePath) || 'clean';
          const agent = this.parseFile(filePath, packageName, gitStatus);
          agents.push(agent);
          logger.debug('parser', `Parsed agent: ${agent.id}`, {
            name: agent.name,
            model: agent.model,
            skillCount: agent.skills?.length || 0,
          });
        } catch (error) {
          skipped++;
          logger.warn('parser', `Skipping invalid agent file: ${file}`, {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      logger.info('parser', `Parsed ${agents.length} agents, skipped ${skipped}`);
      return agents;
    } catch (error) {
      logger.error('parser', `Failed to parse agents from ${directory}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }
}

export const agentParser = new AgentParser();
