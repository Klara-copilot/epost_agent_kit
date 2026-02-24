/**
 * Configuration for ePost Agents Management UI
 */

import { join } from 'path';
import { homedir } from 'os';

/**
 * Path to the epost_agent_kit repository
 * This is where the management UI will read agent system data from
 */
export const EPOST_AGENT_KIT_PATH = join(homedir(), 'Projects', 'epost_agent_kit');

/**
 * Paths to specific directories within the agent kit.
 * Entities (agents, skills, commands) are loaded per-package from packages/,
 * NOT from the assembled .claude/ directory which contains duplicates.
 */
export const PATHS = {
  packages: join(EPOST_AGENT_KIT_PATH, 'packages'),
  profiles: join(EPOST_AGENT_KIT_PATH, 'profiles', 'profiles.yaml'),
} as const;

/**
 * Application configuration
 */
export const CONFIG = {
  // Maximum number of nodes to render on canvas
  maxNodes: 200,

  // Default viewport settings
  defaultViewport: {
    x: 0,
    y: 0,
    zoom: 1,
  },

  // Canvas grid settings
  grid: {
    size: 20,
    color: '#2a2a2a',
  },

  // Node colors by type
  nodeColors: {
    agent: '#3b82f6',      // blue
    skill: '#10b981',      // green
    command: '#f59e0b',    // orange
    package: '#8b5cf6',    // purple
  },

  // Git status colors
  gitStatusColors: {
    staged: '#10b981',     // green
    modified: '#f59e0b',   // orange
    untracked: '#6366f1',  // indigo
    clean: '#6b7280',      // gray
  },
} as const;
