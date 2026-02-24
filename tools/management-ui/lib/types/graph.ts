/**
 * Type definitions for graph visualization
 * Defines the structure for nodes, edges, and the graph itself
 */

import { Agent, Skill, Command, Package } from './entities';

export type NodeType = 'agent' | 'skill' | 'command' | 'package';
export type EdgeType = 'skill-dependency' | 'command-invocation' | 'package-provides' | 'profile-includes' | 'same-type-hierarchy';

/**
 * Position in 2D space
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Base graph node
 */
export interface BaseNode {
  type: NodeType;
  position: Position;
}

/**
 * Agent node - represents an agent in the graph
 */
export interface AgentNode extends BaseNode {
  type: 'agent';
  data: Agent;
  connections: {
    skills: string[];              // skill IDs
    invokedByCommands: string[];   // command IDs
  };
}

/**
 * Skill node - represents a skill in the graph
 */
export interface SkillNode extends BaseNode {
  type: 'skill';
  data: Skill;
  connections: {
    usedByAgents: string[];        // agent IDs
    references: string[];           // reference file paths
  };
}

/**
 * Command node - represents a command in the graph
 */
export interface CommandNode extends BaseNode {
  type: 'command';
  data: Command;
  connections: {
    targetAgent: string;            // agent ID
  };
}

/**
 * Package node - represents a package in the graph
 */
export interface PackageNode extends BaseNode {
  type: 'package';
  data: Package;
  connections: {
    dependencies: string[];         // package names
    provides: {
      agents: string[];
      skills: string[];
      commands: string[];
    };
    usedByProfiles: string[];       // profile names
  };
}

/**
 * Union type for all graph nodes
 */
export type GraphNode = AgentNode | SkillNode | CommandNode | PackageNode;

/**
 * Edge connecting two nodes
 */
export interface Edge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  metadata?: Record<string, unknown>;
}

/**
 * Complete graph structure
 */
export interface Graph {
  nodes: Map<string, GraphNode>;
  edges: Edge[];
}

/**
 * Viewport state for canvas
 */
export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

/**
 * Filter state
 */
export interface FilterState {
  profiles: string[];              // selected profiles (multi-select)
  platforms: string[];             // web, ios, android, backend
  layers: number[];                // package layers
  searchQuery: string;
  gitStatus: GitStatus[];
}

type GitStatus = 'staged' | 'modified' | 'untracked' | 'clean';

/**
 * UI state for the application
 */
export interface UIState {
  viewport: Viewport;
  filters: FilterState;
  selectedNodes: string[];
  hoveredNode?: string;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  rightPanelTab: 'properties' | 'references' | 'git-diff';
  compareMode: 'current' | 'last-commit';
  editMode: boolean;
}
