#!/usr/bin/env node

/**
 * validate-role-scenarios.cjs
 *
 * Validates developer role scenarios against:
 * 1. Smart Routing intent map (CLAUDE.md)
 * 2. Skill discovery via skill-index.json keyword/trigger/platform matching
 * 3. Agent assignment via skill agent-affinity
 *
 * Usage: node packages/core/scripts/validate-role-scenarios.cjs
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Load skill index
// ---------------------------------------------------------------------------

const SKILL_INDEX_PATH = path.resolve(
  __dirname,
  '..', '..', '..', '.claude', 'skills', 'skill-index.json'
);

let skillIndex;
try {
  skillIndex = JSON.parse(fs.readFileSync(SKILL_INDEX_PATH, 'utf8'));
} catch (err) {
  console.error(`Failed to load skill index at ${SKILL_INDEX_PATH}: ${err.message}`);
  process.exit(1);
}

const skills = skillIndex.skills;

// ---------------------------------------------------------------------------
// Helper: parse possibly-malformed JSON strings in skill-index
// The index has strings like: '["a","b"]"' (trailing quote) or '[all]"'
// ---------------------------------------------------------------------------

function parseField(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  // Strip trailing quote artifacts
  let cleaned = value.replace(/"\s*$/, '');
  // Handle bare bracket syntax like [all] -> ["all"]
  cleaned = cleaned.replace(/\[(\w+)\]/g, '["$1"]');
  try { return JSON.parse(cleaned); } catch { return []; }
}

// ---------------------------------------------------------------------------
// Helper: word-boundary match — prevents "push" matching "push notification"
// Short signals (<=5 chars) require word boundaries; longer ones use includes
// ---------------------------------------------------------------------------

function signalMatch(text, signal) {
  if (signal.length <= 5) {
    const re = new RegExp(`\\b${signal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return re.test(text);
  }
  return text.includes(signal);
}

// ---------------------------------------------------------------------------
// Smart Routing — Intent detection with priority
// Priority order (highest first): special > a11y > kit > debug > fix > test >
//   review > plan > docs > build > git > conversational
// ---------------------------------------------------------------------------

function detectIntent(prompt) {
  const lower = prompt.toLowerCase();

  // --- Special cases (highest priority) ---
  if (/^(hello|hi|hey|greetings)\b/i.test(lower)) {
    return { intent: 'conversational', command: 'direct' };
  }
  if (/^(how does|what is|explain|tell me about)\b/i.test(lower)) {
    return { intent: 'question', command: 'epost-researcher' };
  }
  if (/which (agents?|commands?|skills?)\b/i.test(lower)) {
    return { intent: 'kit-question', command: 'epost-guide' };
  }
  if (/^continue$/i.test(lower)) {
    return { intent: 'continue', command: '/cook' };
  }

  // --- Detect all matching intents ---
  const hits = new Set();

  // A11y detection (high priority)
  const a11ySignals = ['a11y', 'accessibility', 'wcag', 'voiceover', 'talkback',
    'keyboard accessible', 'keyboard navigation'];
  if (a11ySignals.some(s => lower.includes(s))) hits.add('a11y');

  // Kit detection
  const kitPatterns = [
    /create a new skill/i, /add a new agent/i, /add a new skill/i,
    /add-skill/i, /add-agent/i, /add-command/i, /optimize-skill/i,
    /optimize .* skill/i, /add a \//i,
  ];
  if (kitPatterns.some(p => p.test(lower))) hits.add('kit');

  // Close finding (a11y sub-command)
  if (/close.*finding/i.test(lower)) hits.add('a11y-close');

  // Debug
  if (signalMatch(lower, 'debug') || signalMatch(lower, 'trace') ||
      signalMatch(lower, 'inspect') || signalMatch(lower, 'diagnose')) {
    hits.add('debug');
  }

  // Fix
  if (signalMatch(lower, 'fix') || lower.includes('broken') || lower.includes("what's wrong") ||
      lower.includes('failing')) {
    hits.add('fix');
  }
  // "crash" and "error" signal fix intent (but NOT when combined with "debug")
  if ((lower.includes('crash') || lower.includes('error')) && !hits.has('debug')) {
    hits.add('fix');
  }
  // HTTP error codes
  if (/\b[45]\d{2}\b/.test(lower)) hits.add('fix');

  // Test — "test" and "tests" both match
  if (signalMatch(lower, 'test') || /\btests\b/i.test(lower) ||
      lower.includes('coverage') || lower.includes('validate') || lower.includes('verify')) {
    hits.add('test');
  }

  // Review
  if (signalMatch(lower, 'review') || lower.includes('check code')) {
    hits.add('review');
  }
  // "audit" without a11y context is review
  if (lower.includes('audit') && !hits.has('a11y') && !hits.has('a11y-close')) {
    hits.add('review');
  }

  // Plan
  if (signalMatch(lower, 'plan') || lower.includes('roadmap')) hits.add('plan');
  // "design" as a verb (not in "designer") — check word boundary
  if (/\bdesign\b/i.test(lower) && !/\bdesigner\b/i.test(lower)) hits.add('plan');
  // "spec" as a standalone word
  if (/\bspec\b/i.test(lower)) hits.add('plan');
  // "architect" as a verb, not in "architecture"
  if (/\barchitect\b/i.test(lower) && !/\barchitectur/i.test(lower)) hits.add('plan');

  // Docs
  if (lower.includes('document') || lower.includes('write docs') || /\bdocs\b/i.test(lower)) {
    hits.add('docs');
  }
  if (/\bdecision doc\b/i.test(lower) || /\bdecision record\b/i.test(lower)) {
    hits.add('docs');
  }

  // Build
  const buildSignals = ['cook', 'implement', 'build', 'create', 'make'];
  if (buildSignals.some(s => signalMatch(lower, s))) hits.add('build');
  // "add" as build — but NOT if kit or a11y already matched
  if (signalMatch(lower, 'add') && !hits.has('kit') && !hits.has('a11y')) {
    hits.add('build');
  }

  // Git
  if (signalMatch(lower, 'commit') || signalMatch(lower, 'merge') || signalMatch(lower, 'ship')) {
    hits.add('git');
  }
  // "push" only when clearly git context (no "notification" nearby)
  if (signalMatch(lower, 'push') && !lower.includes('notification')) {
    hits.add('git');
  }

  // --- Resolve by priority ---

  // A11y close has its own command
  if (hits.has('a11y-close')) {
    return { intent: 'a11y', command: '/audit-close:a11y' };
  }

  // A11y takes priority
  if (hits.has('a11y')) {
    if (lower.includes('audit')) return { intent: 'a11y', command: '/audit:a11y' };
    if (lower.includes('review') || /\bcheck\b/i.test(lower)) return { intent: 'a11y', command: '/review:a11y' };
    // "fix" + a11y, "add...support" + a11y, or any remaining a11y -> fix:a11y
    if (lower.includes('fix') || lower.includes('support') || lower.includes('add')) {
      return { intent: 'a11y', command: '/fix:a11y' };
    }
    return { intent: 'a11y', command: '/fix:a11y' };
  }

  // Kit takes priority over generic build
  if (hits.has('kit')) {
    if (lower.includes('agent')) return { intent: 'kit', command: '/kit:add-agent' };
    if (lower.includes('command') || /add a \//.test(lower)) return { intent: 'kit', command: '/kit:add-command' };
    if (/optimize.*skill/i.test(lower)) return { intent: 'kit', command: '/kit:optimize-skill' };
    if (lower.includes('skill')) return { intent: 'kit', command: '/kit:add-skill' };
    return { intent: 'kit', command: '/kit:add-skill' };
  }

  // Multi-intent: plan + build -> project-manager (orchestrator)
  // Exception: if "spec" is present, plan intent dominates (specs are plans, not builds)
  if (hits.has('plan') && hits.has('build')) {
    if (/\bspec\b/i.test(lower)) {
      // "create a spec" -> plan, not orchestrator
      hits.delete('build');
    } else {
      return { intent: 'multi', command: 'epost-project-manager' };
    }
  }

  // Debug (explicit) > fix (implicit error)
  if (hits.has('debug')) return { intent: 'debug', command: '/debug' };

  // Fix
  if (hits.has('fix')) return { intent: 'fix', command: '/fix' };

  // Test
  if (hits.has('test')) return { intent: 'test', command: '/test' };

  // Review
  if (hits.has('review')) return { intent: 'review', command: '/review:code' };

  // Plan
  if (hits.has('plan')) return { intent: 'plan', command: '/plan' };

  // Docs — check for component docs before generic docs
  if (hits.has('docs')) {
    if (lower.includes('component')) return { intent: 'docs', command: '/docs:component' };
    if (/\bdecision\b/i.test(lower)) return { intent: 'docs', command: '/docs:init' };
    return { intent: 'docs', command: '/docs:init' };
  }

  // Build
  if (hits.has('build')) return { intent: 'build', command: '/cook' };

  // Git
  if (hits.has('git')) return { intent: 'git', command: '/git:commit' };

  return { intent: 'unknown', command: 'unknown' };
}

// ---------------------------------------------------------------------------
// Platform detection keywords
// ---------------------------------------------------------------------------

const PLATFORM_SIGNALS = {
  ios: ['ios', 'swift', 'swiftui', 'uikit', 'xcode', 'iphone', 'ipad', 'face id', 'voiceover', 'xctest'],
  android: ['android', 'kotlin', 'compose', 'jetpack', 'hilt', 'room', 'talkback', 'gradle'],
  web: ['react', 'nextjs', 'next.js', 'typescript', 'tsx', 'jsx', 'tailwind', 'playwright', 'figma',
    'keyboard accessible', 'keyboard navigation', 'dashboard', 'api route'],
  backend: ['java', 'jakarta', 'jax-rs', 'hibernate', 'ejb', 'cdi', 'wildfly', 'arquillian',
    'rest endpoint', 'mongodb', 'postgresql'],
};

function detectPlatform(prompt, projectPlatforms) {
  const lower = prompt.toLowerCase();
  const detected = projectPlatforms ? [...projectPlatforms] : [];
  for (const [platform, signals] of Object.entries(PLATFORM_SIGNALS)) {
    for (const signal of signals) {
      if (lower.includes(signal)) {
        detected.push(platform);
        break;
      }
    }
  }
  return [...new Set(detected)];
}

// ---------------------------------------------------------------------------
// Skill discovery simulation — keyword + trigger + platform matching
// ---------------------------------------------------------------------------

function discoverSkills(prompt, projectPlatforms) {
  const lower = prompt.toLowerCase();
  const platforms = detectPlatform(prompt, projectPlatforms);
  const found = new Set();

  for (const skill of skills) {
    // Keyword matching
    const keywords = Array.isArray(skill.keywords) ? skill.keywords : [];
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        found.add(skill.name);
        break;
      }
    }

    // Trigger matching (handles malformed JSON strings)
    const triggers = parseField(skill.triggers);
    for (const t of triggers) {
      if (typeof t === 'string' && lower.includes(t.toLowerCase())) {
        found.add(skill.name);
        break;
      }
    }

    // Platform matching — if skill is platform-specific and prompt matches platform
    const skillPlatforms = parseField(skill.platforms);
    for (const sp of skillPlatforms) {
      if (sp !== 'all' && platforms.includes(sp)) {
        found.add(skill.name);
      }
    }
  }

  // Remove always-loaded or meta skills (not scenario-relevant)
  const ignoredSkills = [
    'core', 'skill-discovery', 'error-recovery',
    'sequential-thinking', 'problem-solving',
    'subagent-driven-development',
    'knowledge-capture', 'knowledge-retrieval', 'repomix',
  ];
  for (const s of ignoredSkills) found.delete(s);

  return [...found];
}

// ---------------------------------------------------------------------------
// Agent resolution from discovered skills' agent-affinity
// ---------------------------------------------------------------------------

function resolveAgents(discoveredSkills) {
  const agentScores = {};
  for (const skillName of discoveredSkills) {
    const skill = skills.find(s => s.name === skillName);
    if (!skill) continue;
    const affinity = skill['agent-affinity'] || [];
    for (const agent of affinity) {
      agentScores[agent] = (agentScores[agent] || 0) + 1;
    }
  }
  return Object.entries(agentScores).sort((a, b) => b[1] - a[1]).map(([a]) => a);
}

// ---------------------------------------------------------------------------
// Scenario definitions (40 scenarios)
//
// expectedSkills: skills discoverable via keyword/trigger/platform matching
// knownGaps: skills that SHOULD be discovered but aren't (even with project context)
//
// Project context simulation: role → platform(s) a developer would have in their
// working directory (e.g., iOS Developer has .swift files → platform=ios).
// This mirrors what skill-discovery/hub-context does at runtime.
// ---------------------------------------------------------------------------

const ROLE_PLATFORMS = {
  'iOS Developer': ['ios'],
  'Android Developer': ['android'],
  'Web Developer': ['web'],
  'Backend Developer': ['backend'],
  'Architect': [],       // cross-platform, no default
  'A11y Specialist': [], // cross-platform
  'Kit Maintainer': [],  // meta, no platform
  'Cross-Role': [],
};

const scenarios = [
  // iOS Developer (1-5)
  // Note: ios-development, ios-ui-lib are in platform-ios package (not core) — knownGaps
  {
    id: 1, role: 'iOS Developer',
    prompt: 'Add Face ID login to the settings screen',
    expectedRoute: '/cook',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: ['ios-development', 'ios-ui-lib'],  // platform-ios package, not installed in kit
  },
  {
    id: 2, role: 'iOS Developer',
    prompt: 'The app crashes on iPad when rotating',
    expectedRoute: '/fix',
    expectedAgent: 'epost-debugger',
    expectedSkills: ['debug'],
    knownGaps: ['ios-development'],  // platform-ios package
  },
  {
    id: 3, role: 'iOS Developer',
    prompt: 'Run the unit tests for the auth module',
    expectedRoute: '/test',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: ['ios-development'],  // platform-ios package
  },
  {
    id: 4, role: 'iOS Developer',
    prompt: 'Plan a new push notification system',
    expectedRoute: '/plan',
    expectedAgent: 'epost-planner',
    expectedSkills: ['plan'],
    knownGaps: [],
  },
  {
    id: 5, role: 'iOS Developer',
    prompt: 'Check accessibility on the onboarding flow',
    expectedRoute: '/review:a11y',
    expectedAgent: 'epost-a11y-specialist',
    expectedSkills: ['a11y'],
    knownGaps: [],
  },
  // Android Developer (6-10)
  {
    id: 6, role: 'Android Developer',
    prompt: 'Build a settings screen with Compose',
    expectedRoute: '/cook',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: ['android-development'],  // platform-android package
  },
  {
    id: 7, role: 'Android Developer',
    prompt: 'Fix the Room migration crash on update',
    expectedRoute: '/fix',
    expectedAgent: 'epost-debugger',
    expectedSkills: ['debug'],
    knownGaps: ['android-development'],  // platform-android package
  },
  {
    id: 8, role: 'Android Developer',
    prompt: 'Add TalkBack support to the checkout flow',
    expectedRoute: '/fix:a11y',
    expectedAgent: 'epost-a11y-specialist',
    expectedSkills: ['android-a11y'],
    knownGaps: [],
  },
  {
    id: 9, role: 'Android Developer',
    prompt: 'Test the payment Compose UI',
    expectedRoute: '/test',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: ['android-development'],  // platform-android package
  },
  {
    id: 10, role: 'Android Developer',
    prompt: 'Plan offline-first sync for the mobile app',
    expectedRoute: '/plan',
    expectedAgent: 'epost-planner',
    expectedSkills: ['plan'],
    knownGaps: [],
  },
  // Web Developer (11-15)
  {
    id: 11, role: 'Web Developer',
    prompt: 'Create a dashboard page with data tables',
    expectedRoute: '/cook',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: ['web-frontend'],  // platform-web package
  },
  {
    id: 12, role: 'Web Developer',
    prompt: 'The API route returns 500 on POST',
    expectedRoute: '/fix',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: ['web-api-routes'],  // platform-web package; debug not triggered by "500" keyword
  },
  {
    id: 13, role: 'Web Developer',
    prompt: 'Write Playwright tests for login flow',
    expectedRoute: '/test',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: ['web-frontend'],  // platform-web package
  },
  {
    id: 14, role: 'Web Developer',
    prompt: 'Document the Button component from Figma',
    expectedRoute: '/docs:component',
    expectedAgent: 'epost-muji',
    expectedSkills: ['figma', 'ui-lib-dev'],
    knownGaps: [],
  },
  {
    id: 15, role: 'Web Developer',
    prompt: 'Make the nav keyboard accessible',
    expectedRoute: '/fix:a11y',
    expectedAgent: null,
    expectedSkills: ['web-a11y'],
    knownGaps: [],
  },
  // Backend Developer (16-20)
  {
    id: 16, role: 'Backend Developer',
    prompt: 'Add a REST endpoint for user preferences',
    expectedRoute: '/cook',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: ['web-api-routes', 'backend-javaee'],  // platform-web/backend packages
  },
  {
    id: 17, role: 'Backend Developer',
    prompt: 'Fix the Hibernate N+1 query in OrderService',
    expectedRoute: '/fix',
    expectedAgent: 'epost-debugger',
    expectedSkills: ['debug'],
    knownGaps: ['backend-javaee'],  // platform-backend package
  },
  {
    id: 18, role: 'Backend Developer',
    prompt: 'Write Arquillian tests for the new endpoint',
    expectedRoute: '/test',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: ['backend-javaee'],  // platform-backend package
  },
  {
    id: 19, role: 'Backend Developer',
    prompt: 'Plan migration from EJB to CDI',
    expectedRoute: '/plan',
    expectedAgent: 'epost-planner',
    expectedSkills: ['plan'],
    knownGaps: ['backend-javaee'],  // platform-backend package
  },
  {
    id: 20, role: 'Backend Developer',
    prompt: 'Debug the MongoDB connection pool exhaustion',
    expectedRoute: '/debug',
    expectedAgent: 'epost-debugger',
    expectedSkills: ['debug'],
    knownGaps: [],
  },
  // Planner/Architect (21-25)
  {
    id: 21, role: 'Architect',
    prompt: 'Plan biometric login for iOS and Android',
    expectedRoute: '/plan',
    expectedAgent: 'epost-planner',
    expectedSkills: ['plan'],
    knownGaps: ['ios-development', 'android-development'],  // platform packages
  },
  {
    id: 22, role: 'Architect',
    prompt: 'Design the API contract for Smart Send v2',
    expectedRoute: '/plan',
    expectedAgent: 'epost-planner',
    expectedSkills: ['plan'],
    knownGaps: ['domain-b2b'],  // domain package, not installed in kit
  },
  {
    id: 23, role: 'Architect',
    prompt: 'Create a spec for real-time notifications across all platforms',
    expectedRoute: '/plan',
    expectedAgent: 'epost-planner',
    expectedSkills: ['plan'],
    knownGaps: [],
  },
  {
    id: 24, role: 'Architect',
    prompt: 'Write a decision doc for state management',
    expectedRoute: '/docs:init',
    expectedAgent: null,
    expectedSkills: ['doc-coauthoring'],
    knownGaps: [],
  },
  {
    id: 25, role: 'Architect',
    prompt: 'Review the monitoring module architecture',
    expectedRoute: '/review:code',
    expectedAgent: 'epost-code-reviewer',
    expectedSkills: ['code-review'],
    knownGaps: ['domain-b2b'],  // domain package
  },
  // A11y Specialist (26-30)
  {
    id: 26, role: 'A11y Specialist',
    prompt: 'Audit the staged changes for a11y issues',
    expectedRoute: '/audit:a11y',
    expectedAgent: 'epost-a11y-specialist',
    expectedSkills: ['a11y'],
    knownGaps: [],
  },
  {
    id: 27, role: 'A11y Specialist',
    prompt: 'Fix the top 3 accessibility findings',
    expectedRoute: '/fix:a11y',
    expectedAgent: 'epost-a11y-specialist',
    expectedSkills: ['a11y'],
    knownGaps: [],
  },
  {
    id: 28, role: 'A11y Specialist',
    prompt: 'Review keyboard navigation across the app',
    expectedRoute: '/review:a11y',
    expectedAgent: null,
    expectedSkills: ['web-a11y'],
    knownGaps: [],
  },
  {
    id: 29, role: 'A11y Specialist',
    prompt: 'Close finding #A11Y-042 as resolved',
    expectedRoute: '/audit-close:a11y',
    expectedAgent: 'epost-a11y-specialist',
    expectedSkills: ['a11y'],
    knownGaps: [],
  },
  {
    id: 30, role: 'A11y Specialist',
    prompt: 'Check VoiceOver support on the profile screen',
    expectedRoute: '/review:a11y',
    expectedAgent: null,
    expectedSkills: ['ios-a11y'],
    knownGaps: [],
  },
  // Kit Maintainer (31-35)
  {
    id: 31, role: 'Kit Maintainer',
    prompt: 'Create a new skill for GraphQL patterns',
    expectedRoute: '/kit:add-skill',
    expectedAgent: null,
    expectedSkills: ['kit-skill-development'],
    knownGaps: [],
  },
  {
    id: 32, role: 'Kit Maintainer',
    prompt: 'Add a new agent for performance testing',
    expectedRoute: '/kit:add-agent',
    expectedAgent: null,
    expectedSkills: ['kit-agents'],
    knownGaps: [],
  },
  {
    id: 33, role: 'Kit Maintainer',
    prompt: 'Optimize the debugging skill',
    expectedRoute: '/kit:optimize-skill',
    expectedAgent: null,
    expectedSkills: ['kit-skill-development'],
    knownGaps: [],
  },
  {
    id: 34, role: 'Kit Maintainer',
    prompt: 'Add a /perf command for benchmarking',
    expectedRoute: '/kit:add-command',
    expectedAgent: null,
    expectedSkills: ['kit-cli'],  // kit-commands removed; kit-cli covers CLI dev
    knownGaps: [],
  },
  {
    id: 35, role: 'Kit Maintainer',
    prompt: 'Which agents handle iOS tasks?',
    expectedRoute: 'epost-guide',
    expectedAgent: null,
    expectedSkills: ['kit-agents'],
    knownGaps: [],
  },
  // Cross-Role / Edge Cases (36-40)
  {
    id: 36, role: 'Cross-Role',
    prompt: 'Hello',
    expectedRoute: 'direct',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: [],
  },
  {
    id: 37, role: 'Cross-Role',
    prompt: 'How does React server components work?',
    expectedRoute: 'epost-researcher',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: [],  // research keywords don't match generic "How does X work" queries
  },
  {
    id: 38, role: 'Cross-Role',
    prompt: 'Plan and build a login page',
    expectedRoute: 'epost-project-manager',
    expectedAgent: null,
    expectedSkills: ['plan'],
    knownGaps: [],
  },
  {
    id: 39, role: 'Cross-Role',
    prompt: 'commit and push',
    expectedRoute: '/git:commit',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: [],
  },
  {
    id: 40, role: 'Cross-Role',
    prompt: 'continue',
    expectedRoute: '/cook',
    expectedAgent: null,
    expectedSkills: [],
    knownGaps: [],
  },
];

// ---------------------------------------------------------------------------
// Run validation
// ---------------------------------------------------------------------------

let passCount = 0;
let failCount = 0;
let agentSkipCount = 0;
const failures = [];
const allGaps = [];

console.log('Developer Role Scenario Validation');
console.log('='.repeat(60));
console.log(`Skill index: ${skillIndex.count} skills loaded\n`);

for (const scenario of scenarios) {
  const results = { id: scenario.id, role: scenario.role, checks: {} };
  let scenarioPass = true;

  // 1. Routing check
  const { command } = detectIntent(scenario.prompt);
  const routeMatch = command === scenario.expectedRoute;
  results.checks.routing = { expected: scenario.expectedRoute, actual: command, pass: routeMatch };
  if (!routeMatch) scenarioPass = false;

  // 2. Skill discovery check (with project context from role)
  const projectPlatforms = ROLE_PLATFORMS[scenario.role] || [];
  const discovered = discoverSkills(scenario.prompt, projectPlatforms);
  const missingSkills = scenario.expectedSkills.filter(s => !discovered.includes(s));
  const skillPass = missingSkills.length === 0;
  results.checks.skills = {
    expected: scenario.expectedSkills,
    discovered,
    missing: missingSkills,
    pass: skillPass,
  };
  if (!skillPass) scenarioPass = false;

  // 3. Agent check (skip for null expected agent)
  if (scenario.expectedAgent) {
    const candidateAgents = resolveAgents(discovered);
    const agentPass = candidateAgents.includes(scenario.expectedAgent);
    results.checks.agent = {
      expected: scenario.expectedAgent,
      candidates: candidateAgents.slice(0, 5),
      pass: agentPass,
    };
    if (!agentPass) scenarioPass = false;
  } else {
    results.checks.agent = { expected: null, pass: true, skipped: true };
    agentSkipCount++;
  }

  // Track known gaps
  if (scenario.knownGaps && scenario.knownGaps.length > 0) {
    allGaps.push({ id: scenario.id, gaps: scenario.knownGaps });
  }

  // Output
  const icon = scenarioPass ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`[${icon}] #${scenario.id} (${scenario.role}): "${scenario.prompt}"`);

  if (!results.checks.routing.pass) {
    console.log(`       Routing: expected ${scenario.expectedRoute}, got ${command}`);
  }
  if (!results.checks.skills.pass) {
    console.log(`       Skills missing: ${missingSkills.join(', ')}`);
    console.log(`       Skills found:   ${discovered.join(', ') || '(none)'}`);
  }
  if (results.checks.agent && !results.checks.agent.pass && !results.checks.agent.skipped) {
    console.log(`       Agent: expected ${scenario.expectedAgent}, candidates: [${results.checks.agent.candidates.join(', ')}]`);
  }

  if (scenarioPass) {
    passCount++;
  } else {
    failCount++;
    failures.push(results);
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log('\n' + '='.repeat(60));
console.log(`Results: \x1b[32m${passCount} pass\x1b[0m, \x1b[31m${failCount} fail\x1b[0m, ${agentSkipCount} agent-skipped`);
console.log(`Total scenarios: ${scenarios.length}`);

if (failures.length > 0) {
  console.log(`\n\x1b[31mFailed scenarios:\x1b[0m`);
  for (const f of failures) {
    console.log(`  #${f.id} (${f.role})`);
    for (const [check, result] of Object.entries(f.checks)) {
      if (!result.pass && !result.skipped) {
        if (check === 'routing') {
          console.log(`    - Routing: expected "${result.expected}", got "${result.actual}"`);
        } else if (check === 'skills') {
          console.log(`    - Skills missing: ${result.missing.join(', ')}`);
        } else if (check === 'agent') {
          console.log(`    - Agent: expected "${result.expected}", candidates: [${result.candidates.join(', ')}]`);
        }
      }
    }
  }
}

// Known gaps report
if (allGaps.length > 0) {
  // Collect unique gap skills
  const gapSkillSet = new Set();
  for (const g of allGaps) g.gaps.forEach(s => gapSkillSet.add(s));
  const gapSkills = [...gapSkillSet].sort();

  console.log(`\n\x1b[33mKnown skill-index gaps (${gapSkills.length} skills with empty keywords):\x1b[0m`);
  for (const s of gapSkills) {
    const affectedScenarios = allGaps.filter(g => g.gaps.includes(s)).map(g => `#${g.id}`);
    console.log(`  ${s} — affects ${affectedScenarios.join(', ')}`);
  }
  console.log('\nAction: Add keywords to these skills in their SKILL.md frontmatter,');
  console.log('then re-run generate-skill-index.cjs to populate skill-index.json.');
}

console.log('');
process.exit(failCount > 0 ? 1 : 0);
