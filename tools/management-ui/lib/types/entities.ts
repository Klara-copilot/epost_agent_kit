/**
 * Type definitions for ePost Agent Kit entities
 * These types represent the structure of agents, skills, commands, packages, and profiles
 */

export type GitStatus = 'staged' | 'modified' | 'untracked' | 'clean';
export type ModelType = 'haiku' | 'sonnet' | 'opus';
export type MemoryType = 'project' | 'session';
export type PermissionMode = 'plan' | 'execute';
export type ContextType = 'fork' | 'inline';

/**
 * Base entity with common properties
 */
export interface Entity {
  id: string;
  name: string;
  description: string;
  path: string;
  lastModified: Date;
  gitStatus: GitStatus;
  packageName: string; // Which package this entity belongs to
}

/**
 * Agent entity - represents a Claude Code agent
 */
export interface Agent extends Entity {
  model: ModelType;
  color: string;
  tools?: string[];
  skills: string[];
  memory?: MemoryType;
  permissionMode?: PermissionMode;
  disallowedTools?: string[];
  hooks?: Record<string, unknown>;
}

/**
 * Reference/knowledge file associated with a skill
 */
export interface Reference {
  name: string;
  path: string;
  skillName: string;
  content?: string;
}

/**
 * Skill entity - represents reusable agent capabilities
 */
export interface Skill extends Entity {
  keywords: string[];
  platforms: string[];
  triggers: string[];
  agentAffinity: string[];
  userInvocable: boolean;
  context?: ContextType;
  agent?: string;
  disableModelInvocation?: boolean;
  version?: string;
  references: Reference[];
}

/**
 * Command entity - represents slash commands
 */
export interface Command extends Entity {
  title: string;
  slug: string;
  agent: string;
  argumentHint?: string;
}

/**
 * Package entity - represents a collection of agents, skills, and commands
 */
export interface Package {
  name: string;
  version: string;
  description: string;
  layer: number;
  platforms: string[];
  dependencies: string[];
  recommends?: string[];
  provides: {
    agents: string[];
    skills: string[];
    commands: string[];
  };
  files: Record<string, string>;
  settingsStrategy?: 'base' | 'merge' | 'overlay';
  path?: string;
  gitStatus?: GitStatus;
}

/**
 * Profile entity - represents a team configuration
 */
export interface Profile {
  name: string;
  displayName: string;
  teams?: string[];
  packages: string[];
  optional?: string[];
}

/**
 * Loaded data structure containing all entities
 */
export interface LoadedData {
  agents: Agent[];
  skills: Skill[];
  commands: Command[];
  packages: Package[];
  profiles: Profile[];
}

/**
 * System diff showing changes between current and last commit
 */
export interface SystemDiff {
  agents: { added: string[]; modified: string[]; deleted: string[] };
  skills: { added: string[]; modified: string[]; deleted: string[] };
  commands: { added: string[]; modified: string[]; deleted: string[] };
  packages: { added: string[]; modified: string[]; deleted: string[] };
  profiles: { added: string[]; modified: string[]; deleted: string[] };
}
