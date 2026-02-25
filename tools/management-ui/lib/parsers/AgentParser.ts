/**
 * Parser for agent definition files (.claude/agents/*.md)
 */

import { readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { Agent, ModelType, MemoryType, PermissionMode, GitStatus, ParseError } from '../types/entities';
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

const VALID_MODELS: ModelType[] = ['haiku', 'sonnet', 'opus'];
const VALID_PERMISSION_MODES: PermissionMode[] = ['default', 'acceptEdits', 'plan', 'bypassPermissions'];
const VALID_MEMORY_TYPES: MemoryType[] = ['project', 'session'];

export class AgentParser {
  /**
   * Parse a single agent file and collect validation warnings
   */
  parseFile(
    filePath: string,
    packageName: string,
    gitStatus: GitStatus = 'clean'
  ): { agent: Agent; warnings: ParseError[] } {
    const parsed = frontmatterParser.parse<AgentFrontmatter>(filePath);
    const { frontmatter, body } = parsed;
    const id = basename(filePath, '.md');
    const warnings: ParseError[] = [];

    // Validate model
    if (frontmatter.model && !VALID_MODELS.includes(frontmatter.model)) {
      warnings.push({
        filePath,
        entityType: 'agent',
        level: 'warning',
        field: 'model',
        value: frontmatter.model,
        message: `Invalid model '${frontmatter.model}' — must be one of: ${VALID_MODELS.join(', ')}`,
      });
    }

    // Validate permissionMode
    if (frontmatter.permissionMode && !VALID_PERMISSION_MODES.includes(frontmatter.permissionMode)) {
      warnings.push({
        filePath,
        entityType: 'agent',
        level: 'warning',
        field: 'permissionMode',
        value: frontmatter.permissionMode,
        message: `Invalid permissionMode '${frontmatter.permissionMode}' — must be one of: ${VALID_PERMISSION_MODES.join(', ')}`,
      });
    }

    // Validate memory
    if (frontmatter.memory && !VALID_MEMORY_TYPES.includes(frontmatter.memory)) {
      warnings.push({
        filePath,
        entityType: 'agent',
        level: 'warning',
        field: 'memory',
        value: frontmatter.memory,
        message: `Invalid memory '${frontmatter.memory}' — must be one of: ${VALID_MEMORY_TYPES.join(', ')}`,
      });
    }

    const agent: Agent = {
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

    return { agent, warnings };
  }

  /**
   * Parse all agent files in a directory
   */
  parseAll(
    directory: string,
    packageName: string,
    gitStatusMap?: Map<string, GitStatus>
  ): { agents: Agent[]; errors: ParseError[] } {
    const agents: Agent[] = [];
    const errors: ParseError[] = [];

    try {
      const files = readdirSync(directory).filter(file => file.endsWith('.md'));
      logger.info('parser', `Found ${files.length} agent files in ${directory}`);

      let skipped = 0;

      for (const file of files) {
        const filePath = join(directory, file);
        try {
          const gitStatus = gitStatusMap?.get(filePath) || 'clean';
          const { agent, warnings } = this.parseFile(filePath, packageName, gitStatus);
          agents.push(agent);
          errors.push(...warnings);
          logger.debug('parser', `Parsed agent: ${agent.id}`, {
            name: agent.name,
            model: agent.model,
            skillCount: agent.skills?.length || 0,
            warnings: warnings.length,
          });
        } catch (error) {
          skipped++;
          const message = error instanceof Error ? error.message : String(error);
          logger.warn('parser', `Skipping invalid agent file: ${file}`, { error: message });
          errors.push({
            filePath,
            entityType: 'agent',
            level: 'error',
            message: `Failed to parse: ${message}`,
          });
        }
      }

      logger.info('parser', `Parsed ${agents.length} agents, skipped ${skipped}, ${errors.length} issues`);
    } catch (error) {
      logger.error('parser', `Failed to parse agents from ${directory}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return { agents, errors };
  }
}

export const agentParser = new AgentParser();
