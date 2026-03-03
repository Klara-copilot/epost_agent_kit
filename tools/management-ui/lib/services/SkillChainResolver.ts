/**
 * Skill Chain Resolver
 *
 * Given an agent, computes the full skill loading chain:
 *   Layer 0: Declared — from agent frontmatter skills: list (always loaded)
 *   Layer 1: Affinity — skills where agent-affinity includes this agent
 *   Layer 2: Platform — platform-specific skills discovered via file signals
 *   Layer 3: Enhancers — skills that enhance any declared/affinity skill
 *
 * Also computes extends/requires chains within each layer.
 */

import { Agent, Skill, SkillConnections } from '../types/entities';

export type SkillLayer = 'declared' | 'affinity' | 'platform' | 'enhancer';

export interface SkillChainEntry {
  skillName: string;
  layer: SkillLayer;
  /** If loaded via extends/requires, the skill that triggered it */
  loadedVia?: { type: 'extends' | 'requires'; from: string };
}

export interface PlatformChain {
  platform: string;
  skills: SkillChainEntry[];
}

export interface SkillChain {
  agentId: string;
  declared: SkillChainEntry[];
  affinity: SkillChainEntry[];
  platformChains: PlatformChain[];
  enhancers: Array<SkillChainEntry & { enhances: string }>;
  /** Flat map: skillName → layer (for node styling) */
  layerMap: Map<string, SkillLayer>;
}

/** Platform prefixes and the skills they trigger */
const PLATFORM_SKILLS: Record<string, string[]> = {
  ios: ['ios-development', 'ios-ui-lib', 'ios-rag', 'simulator'],
  android: ['android-development', 'android-ui-lib'],
  web: ['web-frontend', 'web-nextjs', 'web-api-routes', 'web-auth', 'web-i18n', 'web-testing', 'web-modules', 'web-rag', 'web-prototype'],
  backend: ['backend-javaee', 'backend-databases'],
  design: ['web-figma', 'web-figma-variables', 'web-ui-lib', 'web-ui-lib-dev'],
};

/** A11y extends chains per platform */
const A11Y_EXTENDS: Record<string, string> = {
  ios: 'ios-a11y',
  android: 'android-a11y',
  web: 'web-a11y',
};

export function resolveSkillChain(
  agent: Agent,
  allSkills: Skill[],
): SkillChain {
  const skillByName = new Map<string, Skill>();
  for (const s of allSkills) {
    skillByName.set(s.name, s);
    // Also register by id for path-based names (e.g., "core/debugging" → "debugging")
    if (s.id !== s.name) {
      skillByName.set(s.id, s);
    }
  }

  const layerMap = new Map<string, SkillLayer>();
  const declaredSet = new Set(agent.skills || []);

  // Layer 0: Declared
  const declared: SkillChainEntry[] = [];
  for (const name of declaredSet) {
    declared.push({ skillName: name, layer: 'declared' });
    layerMap.set(name, 'declared');
  }

  // Layer 1: Affinity — skills where agent-affinity includes this agent
  const affinity: SkillChainEntry[] = [];
  for (const skill of allSkills) {
    if (declaredSet.has(skill.name) || declaredSet.has(skill.id)) continue;
    if (skill.agentAffinity?.includes(agent.id) || skill.agentAffinity?.includes(agent.name)) {
      affinity.push({ skillName: skill.name, layer: 'affinity' });
      layerMap.set(skill.name, 'affinity');
    }
  }

  // Layer 2: Platform chains
  const platformChains: PlatformChain[] = [];
  for (const [platform, platformSkillNames] of Object.entries(PLATFORM_SKILLS)) {
    const skills: SkillChainEntry[] = [];

    for (const name of platformSkillNames) {
      if (layerMap.has(name)) continue; // Already in declared or affinity
      const skill = skillByName.get(name);
      if (skill) {
        skills.push({ skillName: name, layer: 'platform' });
        layerMap.set(name, 'platform');
      }
    }

    // Add extends chains: a11y → platform-a11y
    const a11yExtension = A11Y_EXTENDS[platform];
    if (a11yExtension && !layerMap.has(a11yExtension)) {
      const a11ySkill = skillByName.get(a11yExtension);
      if (a11ySkill) {
        // Ensure parent 'a11y' is also in the chain
        if (!layerMap.has('a11y')) {
          skills.push({ skillName: 'a11y', layer: 'platform' });
          layerMap.set('a11y', 'platform');
        }
        skills.push({
          skillName: a11yExtension,
          layer: 'platform',
          loadedVia: { type: 'extends', from: 'a11y' },
        });
        layerMap.set(a11yExtension, 'platform');
      }
    }

    // Add requires chains from platform skills
    for (const entry of [...skills]) {
      const skill = skillByName.get(entry.skillName);
      if (!skill?.connections?.requires) continue;
      for (const req of skill.connections.requires) {
        if (!layerMap.has(req)) {
          skills.push({
            skillName: req,
            layer: 'platform',
            loadedVia: { type: 'requires', from: entry.skillName },
          });
          layerMap.set(req, 'platform');
        }
      }
    }

    if (skills.length > 0) {
      platformChains.push({ platform, skills });
    }
  }

  // Layer 3: Enhancers — skills that enhance any declared or affinity skill
  const enhancers: Array<SkillChainEntry & { enhances: string }> = [];
  const targetSkills = new Set([
    ...declared.map(e => e.skillName),
    ...affinity.map(e => e.skillName),
  ]);

  for (const skill of allSkills) {
    if (layerMap.has(skill.name)) continue;
    const connections = skill.connections;
    if (!connections?.enhances?.length) continue;

    for (const target of connections.enhances) {
      if (targetSkills.has(target)) {
        enhancers.push({
          skillName: skill.name,
          layer: 'enhancer',
          enhances: target,
        });
        layerMap.set(skill.name, 'enhancer');
        break; // Only add once even if enhances multiple
      }
    }
  }

  return {
    agentId: agent.id,
    declared,
    affinity,
    platformChains,
    enhancers,
    layerMap,
  };
}

/** Priority order: declared > affinity > platform > enhancer */
const LAYER_PRIORITY: Record<SkillLayer, number> = {
  declared: 0,
  affinity: 1,
  platform: 2,
  enhancer: 3,
};

export interface GlobalSkillChain {
  /** Merged layer map: skillName → best layer across all agents */
  layerMap: Map<string, SkillLayer>;
  /** All affinity edges: [agentId, skillName][] */
  affinityEdges: Array<{ agentId: string; skillName: string }>;
  /** Per-agent chains for the summary panel */
  perAgent: Map<string, SkillChain>;
  /** All enhancer relationships */
  enhancers: Array<{ skillName: string; enhances: string }>;
}

/**
 * Resolve skill chains for ALL agents simultaneously.
 * Merges layer maps — if a skill is "declared" by one agent
 * but "affinity" for another, it gets the highest layer (declared).
 */
export function resolveGlobalSkillChain(
  agents: Agent[],
  allSkills: Skill[],
): GlobalSkillChain {
  const mergedLayerMap = new Map<string, SkillLayer>();
  const affinityEdges: GlobalSkillChain['affinityEdges'] = [];
  const perAgent = new Map<string, SkillChain>();
  const allEnhancers = new Map<string, { skillName: string; enhances: string }>();

  for (const agent of agents) {
    const chain = resolveSkillChain(agent, allSkills);
    perAgent.set(agent.id, chain);

    // Merge layer map — keep highest priority (lowest number)
    for (const [skillName, layer] of chain.layerMap) {
      const existing = mergedLayerMap.get(skillName);
      if (!existing || LAYER_PRIORITY[layer] < LAYER_PRIORITY[existing]) {
        mergedLayerMap.set(skillName, layer);
      }
    }

    // Collect affinity edges
    for (const entry of chain.affinity) {
      affinityEdges.push({ agentId: agent.id, skillName: entry.skillName });
    }

    // Collect enhancers (deduplicate by skill name)
    for (const e of chain.enhancers) {
      if (!allEnhancers.has(e.skillName)) {
        allEnhancers.set(e.skillName, { skillName: e.skillName, enhances: e.enhances });
      }
    }
  }

  return {
    layerMap: mergedLayerMap,
    affinityEdges,
    perAgent,
    enhancers: Array.from(allEnhancers.values()),
  };
}
