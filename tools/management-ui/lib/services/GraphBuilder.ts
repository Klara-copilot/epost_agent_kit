/**
 * Graph Builder - Constructs graph structure from loaded entities
 *
 * Node keys are namespaced by type to prevent collisions:
 *   agent:epost-debugger, skill:core, command:android/cook, package:core
 */

import { LoadedData } from '../types/entities';
import {
  Graph,
  GraphNode,
  AgentNode,
  SkillNode,
  CommandNode,
  PackageNode,
  Edge,
} from '../types/graph';
import { logger } from '../utils/logger';

function nodeKey(type: string, id: string): string {
  return `${type}:${id}`;
}

export class GraphBuilder {
  /**
   * Build a complete graph from loaded data
   * @param data - Loaded agent system data
   * @returns Graph structure with nodes and edges
   */
  build(data: LoadedData): Graph {
    logger.info('graph', 'Building graph from loaded data');
    logger.debug('graph', 'Input data counts', {
      agents: data.agents.length,
      skills: data.skills.length,
      commands: data.commands.length,
      packages: data.packages.length,
      profiles: data.profiles.length,
    });

    const nodes = new Map<string, GraphNode>();
    const edges: Edge[] = [];

    // Create agent nodes
    logger.debug('graph', `Creating ${data.agents.length} agent nodes`);
    data.agents.forEach(agent => {
      const node: AgentNode = {
        type: 'agent',
        data: agent,
        position: { x: 0, y: 0 }, // Will be set by layout algorithm
        connections: {
          skills: agent.skills || [],
          invokedByCommands: [],
        },
      };
      nodes.set(nodeKey('agent', agent.id), node);
      logger.debug('graph', `Created agent node: ${agent.id}`, {
        skillCount: agent.skills?.length || 0,
      });
    });

    // Create skill nodes + build alias lookup for short-name resolution
    logger.debug('graph', `Creating ${data.skills.length} skill nodes`);
    const skillAliases = new Map<string, string>(); // basename -> full skill id
    data.skills.forEach(skill => {
      const node: SkillNode = {
        type: 'skill',
        data: skill,
        position: { x: 0, y: 0 },
        connections: {
          usedByAgents: [],
          references: skill.references?.map(ref => ref.path) || [],
        },
      };
      nodes.set(nodeKey('skill', skill.id), node);

      // Register aliases: if skill id has a path separator, register the basename as alias
      // e.g., "muji/figma-variables" registers alias "figma-variables" -> "muji/figma-variables"
      if (skill.id.includes('/')) {
        const parts = skill.id.split('/');
        const basename = parts[parts.length - 1];
        // Only register if no conflict (first match wins)
        if (!skillAliases.has(basename)) {
          skillAliases.set(basename, skill.id);
        }
      }

      logger.debug('graph', `Created skill node: ${skill.id}`, {
        referenceCount: skill.references?.length || 0,
      });
    });
    logger.info('graph', `Added ${data.skills.length} skills to nodes Map, Map size: ${nodes.size}`);

    // Create command nodes
    data.commands.forEach(command => {
      const node: CommandNode = {
        type: 'command',
        data: command,
        position: { x: 0, y: 0 },
        connections: {
          targetAgent: command.agent,
        },
      };
      nodes.set(nodeKey('command', command.id), node);
    });

    // Create package nodes
    data.packages.forEach(pkg => {
      const node: PackageNode = {
        type: 'package',
        data: pkg,
        position: { x: 0, y: 0 },
        connections: {
          dependencies: pkg.dependencies,
          provides: {
            agents: pkg.provides.agents,
            skills: pkg.provides.skills,
            commands: pkg.provides.commands,
          },
          usedByProfiles: [],
        },
      };
      nodes.set(nodeKey('package', pkg.name), node);
    });

    // Build edges: agent → skill
    logger.debug('graph', 'Building agent → skill edges');
    let missingSkills = 0;
    let aliasResolved = 0;
    data.agents.forEach(agent => {
      const agentKey = nodeKey('agent', agent.id);
      agent.skills?.forEach(skillName => {
        // Try direct match first, then alias lookup
        let resolvedSkillId = skillName;
        let skillKey = nodeKey('skill', skillName);
        let skillNode = nodes.get(skillKey) as SkillNode | undefined;

        if (!skillNode && skillAliases.has(skillName)) {
          resolvedSkillId = skillAliases.get(skillName)!;
          skillKey = nodeKey('skill', resolvedSkillId);
          skillNode = nodes.get(skillKey) as SkillNode | undefined;
          if (skillNode) {
            aliasResolved++;
            logger.debug('graph', `Resolved skill alias: ${skillName} -> ${resolvedSkillId}`, {
              agentId: agent.id,
            });
          }
        }

        edges.push({
          id: `${agentKey}→${skillKey}`,
          source: agentKey,
          target: skillKey,
          type: 'skill-dependency',
        });

        if (skillNode && skillNode.connections && Array.isArray(skillNode.connections.usedByAgents)) {
          skillNode.connections.usedByAgents.push(agent.id);
        } else {
          logger.warn('graph', `Skill ${skillName} referenced by agent ${agent.id} not found in nodes`, {
            agentId: agent.id,
            skillName,
          });
          missingSkills++;
        }
      });
    });
    if (aliasResolved > 0) {
      logger.info('graph', `Resolved ${aliasResolved} skill references via alias lookup`);
    }
    if (missingSkills > 0) {
      logger.warn('graph', `Found ${missingSkills} missing skill references`);
    }

    // Build edges: command → agent
    logger.debug('graph', 'Building command → agent edges');
    let missingAgents = 0;
    data.commands.forEach(command => {
      if (command.agent) {
        const commandKey = nodeKey('command', command.id);
        const agentKey = nodeKey('agent', command.agent);

        edges.push({
          id: `${commandKey}→${agentKey}`,
          source: commandKey,
          target: agentKey,
          type: 'command-invocation',
        });

        const agentNode = nodes.get(agentKey) as AgentNode | undefined;
        if (agentNode && agentNode.connections && Array.isArray(agentNode.connections.invokedByCommands)) {
          agentNode.connections.invokedByCommands.push(command.id);
        } else {
          logger.warn('graph', `Agent ${command.agent} referenced by command ${command.id} not found in nodes`, {
            commandId: command.id,
            agentName: command.agent,
          });
          missingAgents++;
        }
      }
    });
    if (missingAgents > 0) {
      logger.warn('graph', `Found ${missingAgents} missing agent references from commands`);
    }

    // Build edges: package → provided entities
    data.packages.forEach(pkg => {
      const pkgKey = nodeKey('package', pkg.name);

      // Package → agents
      pkg.provides.agents.forEach(agentName => {
        const targetKey = nodeKey('agent', agentName);
        edges.push({
          id: `${pkgKey}→${targetKey}`,
          source: pkgKey,
          target: targetKey,
          type: 'package-provides',
        });
      });

      // Package → skills
      pkg.provides.skills.forEach(skillName => {
        const targetKey = nodeKey('skill', skillName);
        edges.push({
          id: `${pkgKey}→${targetKey}`,
          source: pkgKey,
          target: targetKey,
          type: 'package-provides',
        });
      });

      // Package → commands
      pkg.provides.commands.forEach(commandName => {
        const targetKey = nodeKey('command', commandName);
        edges.push({
          id: `${pkgKey}→${targetKey}`,
          source: pkgKey,
          target: targetKey,
          type: 'package-provides',
        });
      });

      // Package → package dependencies
      pkg.dependencies.forEach(depName => {
        const targetKey = nodeKey('package', depName);
        edges.push({
          id: `${pkgKey}→dep:${targetKey}`,
          source: pkgKey,
          target: targetKey,
          type: 'package-provides',
        });
      });
    });

    // Build edges: profile → packages
    logger.debug('graph', 'Building profile → package edges');
    let missingPackages = 0;
    data.profiles.forEach(profile => {
      profile.packages?.forEach(pkgName => {
        const pkgKey = nodeKey('package', pkgName);
        edges.push({
          id: `${profile.name}→${pkgKey}`,
          source: profile.name,
          target: pkgKey,
          type: 'profile-includes',
        });

        const pkgNode = nodes.get(pkgKey) as PackageNode | undefined;
        if (pkgNode && pkgNode.connections && Array.isArray(pkgNode.connections.usedByProfiles)) {
          pkgNode.connections.usedByProfiles.push(profile.name);
        } else {
          logger.warn('graph', `Package ${pkgName} referenced by profile ${profile.name} not found in nodes`, {
            profileName: profile.name,
            packageName: pkgName,
          });
          missingPackages++;
        }
      });
    });
    if (missingPackages > 0) {
      logger.warn('graph', `Found ${missingPackages} missing package references from profiles`);
    }

    // Build edges: same-type hierarchy (parent → child by ID prefix)
    // A node is a child of another same-type node if its ID starts with parentId + '/'
    // e.g., skill "agents" → skill "agents/claude/agent-development"
    logger.debug('graph', 'Building same-type hierarchy edges');
    let hierarchyEdges = 0;
    for (const type of ['agent', 'skill', 'command', 'package'] as const) {
      const typeNodes = Array.from(nodes.entries())
        .filter(([, n]) => n.type === type)
        .map(([key, n]) => ({ key, id: 'id' in n.data ? n.data.id : n.data.name }));

      for (const parent of typeNodes) {
        for (const child of typeNodes) {
          if (child.id.startsWith(parent.id + '/')) {
            // Only connect direct children — skip if an intermediate node exists
            const intermediateExists = typeNodes.some(
              n => n.id !== parent.id && n.id !== child.id
                && child.id.startsWith(n.id + '/')
                && n.id.startsWith(parent.id + '/')
            );
            if (!intermediateExists) {
              edges.push({
                id: `${parent.key}→child:${child.key}`,
                source: parent.key,
                target: child.key,
                type: 'same-type-hierarchy',
              });
              hierarchyEdges++;
            }
          }
        }
      }
    }
    if (hierarchyEdges > 0) {
      logger.info('graph', `Added ${hierarchyEdges} same-type hierarchy edges`);
    }

    // Build edges: skill → skill connections (extends, requires, enhances, conflicts)
    logger.debug('graph', 'Building skill-to-skill connection edges');
    let skillConnectionEdges = 0;
    data.skills.forEach(skill => {
      if (!skill.connections) return;
      const sourceKey = nodeKey('skill', skill.id);

      const connectionTypes = [
        { field: 'extends' as const, edgeType: 'skill-extends' as const },
        { field: 'requires' as const, edgeType: 'skill-requires' as const },
        { field: 'enhances' as const, edgeType: 'skill-enhances' as const },
        { field: 'conflicts' as const, edgeType: 'skill-conflicts' as const },
      ];

      for (const { field, edgeType } of connectionTypes) {
        const targets = skill.connections![field];
        if (!targets?.length) continue;

        for (const targetName of targets) {
          // Resolve target: try direct match, then alias
          let targetKey = nodeKey('skill', targetName);
          if (!nodes.has(targetKey) && skillAliases.has(targetName)) {
            targetKey = nodeKey('skill', skillAliases.get(targetName)!);
          }

          edges.push({
            id: `${sourceKey}→${edgeType}:${targetKey}`,
            source: sourceKey,
            target: targetKey,
            type: edgeType,
          });
          skillConnectionEdges++;
        }
      }
    });
    if (skillConnectionEdges > 0) {
      logger.info('graph', `Added ${skillConnectionEdges} skill-to-skill connection edges`);
    }

    logger.info('graph', `Graph built successfully: ${nodes.size} nodes, ${edges.length} edges`);
    logger.debug('graph', 'Graph build complete', {
      nodeCount: nodes.size,
      edgeCount: edges.length,
      nodeTypes: {
        agent: Array.from(nodes.values()).filter(n => n.type === 'agent').length,
        skill: Array.from(nodes.values()).filter(n => n.type === 'skill').length,
        command: Array.from(nodes.values()).filter(n => n.type === 'command').length,
        package: Array.from(nodes.values()).filter(n => n.type === 'package').length,
      },
    });

    return { nodes, edges };
  }

  /**
   * Get statistics about the graph
   */
  getStats(graph: Graph) {
    const stats = {
      totalNodes: graph.nodes.size,
      totalEdges: graph.edges.length,
      nodesByType: {
        agent: 0,
        skill: 0,
        command: 0,
        package: 0,
      },
      edgesByType: {
        'skill-dependency': 0,
        'command-invocation': 0,
        'package-provides': 0,
        'profile-includes': 0,
        'same-type-hierarchy': 0,
        'skill-extends': 0,
        'skill-requires': 0,
        'skill-enhances': 0,
        'skill-conflicts': 0,
      },
    };

    graph.nodes.forEach(node => {
      stats.nodesByType[node.type]++;
    });

    graph.edges.forEach(edge => {
      stats.edgesByType[edge.type]++;
    });

    return stats;
  }
}

export const graphBuilder = new GraphBuilder();
