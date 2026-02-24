/**
 * Data Loader - Orchestrates loading all agent system data
 *
 * Loads entities per-package from packages/[pkg]/agents|skills|commands/
 * instead of the assembled .claude/ directory (which contains duplicates).
 */

import { PATHS } from '../config';
import { LoadedData, Agent, Skill, Command, Package, ParseError } from '../types/entities';
import { agentParser } from '../parsers/AgentParser';
import { skillParser } from '../parsers/SkillParser';
import { commandParser } from '../parsers/CommandParser';
import { packageParser } from '../parsers/PackageParser';
import { profileParser } from '../parsers/ProfileParser';
import { logger } from '../utils/logger';
import { existsSync } from 'fs';
import { join, dirname } from 'path';

export class DataLoader {
  /**
   * Load all agent system data from the epost_agent_kit repository
   * Iterates each package and collects agents, skills, commands from within.
   * @returns Complete loaded data with all entities
   */
  async loadAll(): Promise<LoadedData> {
    logger.info('loader', 'Starting data load from epost_agent_kit repository');
    logger.debug('loader', 'Paths configuration', PATHS);
    const startTime = Date.now();

    // Verify base paths exist
    const pathChecks = {
      packages: existsSync(PATHS.packages),
      profiles: existsSync(PATHS.profiles),
    };

    logger.debug('loader', 'Path existence check', pathChecks);

    const missingPaths = Object.entries(pathChecks)
      .filter(([, exists]) => !exists)
      .map(([name]) => name);

    if (missingPaths.length > 0) {
      const error = new Error(
        `Missing required paths: ${missingPaths.join(', ')}. ` +
        `Make sure the epost_agent_kit repository exists at the configured location.`
      );
      logger.error('loader', 'Path validation failed', {
        missingPaths,
        paths: PATHS,
      });
      throw error;
    }

    try {
      // Load packages and profiles first
      logger.info('loader', 'Loading packages and profiles');
      const [packages, profiles] = await Promise.all([
        Promise.resolve(packageParser.parseAll(PATHS.packages)),
        Promise.resolve(profileParser.parseFile(PATHS.profiles)),
      ]);

      logger.info('loader', `Found ${packages.length} packages, loading entities per-package`);

      // Collect entities from each package
      const allAgents: Agent[] = [];
      const allSkills: Skill[] = [];
      const allCommands: Command[] = [];
      const allParseErrors: ParseError[] = [];

      for (const pkg of packages) {
        const pkgDir = pkg.path ? dirname(pkg.path) : join(PATHS.packages, pkg.name);
        const pkgName = pkg.name;

        const agentsDir = join(pkgDir, 'agents');
        const skillsDir = join(pkgDir, 'skills');
        const commandsDir = join(pkgDir, 'commands');

        // Parse agents from this package
        if (existsSync(agentsDir)) {
          const { agents, errors } = agentParser.parseAll(agentsDir, pkgName);
          allAgents.push(...agents);
          allParseErrors.push(...errors);
          logger.debug('loader', `Package ${pkgName}: ${agents.length} agents, ${errors.length} issues`);
        }

        // Parse skills from this package
        if (existsSync(skillsDir)) {
          const { skills, errors } = skillParser.parseAll(skillsDir, pkgName);
          allSkills.push(...skills);
          allParseErrors.push(...errors);
          logger.debug('loader', `Package ${pkgName}: ${skills.length} skills, ${errors.length} issues`);
        }

        // Parse commands from this package
        // Derive command ID prefix from package files mapping:
        //   files["commands/"] = "commands/android/" → prefix = "android/"
        // This ensures command IDs match the provides.commands entries in package.yaml
        if (existsSync(commandsDir)) {
          const filesMapping = pkg.files?.['commands/'] || 'commands/';
          const commandPrefix = filesMapping.replace(/^commands\//, '');
          const { commands, errors } = commandParser.parseAll(commandsDir, pkgName, commandPrefix);
          allCommands.push(...commands);
          allParseErrors.push(...errors);
          logger.debug('loader', `Package ${pkgName}: ${commands.length} commands (prefix: "${commandPrefix}"), ${errors.length} issues`);
        }
      }

      const elapsed = Date.now() - startTime;

      logger.info('loader', `Data loaded successfully in ${elapsed}ms`, {
        agents: allAgents.length,
        skills: allSkills.length,
        commands: allCommands.length,
        packages: packages.length,
        profiles: profiles.length,
        parseErrors: allParseErrors.length,
      });

      // Log details about loaded entities
      logger.debug('loader', 'Agent details', {
        agents: allAgents.map(a => ({ id: a.id, name: a.name, package: a.packageName, skillCount: a.skills?.length || 0 })),
      });

      logger.debug('loader', 'Skill details', {
        skills: allSkills.map(s => ({ id: s.id, name: s.name, package: s.packageName })),
      });

      return {
        agents: allAgents,
        skills: allSkills,
        commands: allCommands,
        packages,
        profiles,
        parseErrors: allParseErrors,
      };
    } catch (error) {
      logger.error('loader', 'Failed to load agent system data', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Load packages only
   */
  async loadPackages() {
    return packageParser.parseAll(PATHS.packages);
  }

  /**
   * Load profiles only
   */
  async loadProfiles() {
    return profileParser.parseFile(PATHS.profiles);
  }
}

export const dataLoader = new DataLoader();
