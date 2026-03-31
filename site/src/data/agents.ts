export interface Agent {
  name: string;
  slug: string;
  icon: string;
  role: string;
  color: string;
}

export const agents: Agent[] = [
  {
    name: 'Fullstack Developer',
    slug: 'epost-fullstack-developer',
    icon: '⚙',
    role: 'Implements features across web, iOS, Android, and backend',
    color: '#22c55e',
  },
  {
    name: 'Planner',
    slug: 'epost-planner',
    icon: '◈',
    role: 'Creates phased implementation plans with TODO tracking',
    color: '#3b82f6',
  },
  {
    name: 'Code Reviewer',
    slug: 'epost-code-reviewer',
    icon: '◉',
    role: 'Quality assurance, security audits, best practices enforcement',
    color: '#eab308',
  },
  {
    name: 'Debugger',
    slug: 'epost-debugger',
    icon: '◎',
    role: 'Root cause analysis and runtime error resolution',
    color: '#ef4444',
  },
  {
    name: 'Tester',
    slug: 'epost-tester',
    icon: '◇',
    role: 'Comprehensive test suites, coverage analysis, validation',
    color: '#eab308',
  },
  {
    name: 'MUJI',
    slug: 'epost-muji',
    icon: '◑',
    role: 'Design system, Figma-to-code, UI/UX, landing page craft',
    color: '#ec4899',
  },
  {
    name: 'A11y Specialist',
    slug: 'epost-a11y-specialist',
    icon: '◐',
    role: 'WCAG 2.1 AA compliance across iOS, Android, and Web',
    color: '#dc2626',
  },
  {
    name: 'Docs Manager',
    slug: 'epost-docs-manager',
    icon: '◫',
    role: 'Documentation lifecycle, KB structure, orphan detection',
    color: '#3b82f6',
  },
  {
    name: 'Researcher',
    slug: 'epost-researcher',
    icon: '◰',
    role: 'Technology research, best practices, comparative analysis',
    color: '#a855f7',
  },
  {
    name: 'Git Manager',
    slug: 'epost-git-manager',
    icon: '◳',
    role: 'Commit, push, PR automation with security scanning',
    color: '#a855f7',
  },
  {
    name: 'Project Manager',
    slug: 'epost-project-manager',
    icon: '◬',
    role: 'Progress tracking, roadmaps, task routing, milestones',
    color: '#22c55e',
  },
  {
    name: 'Brainstormer',
    slug: 'epost-brainstormer',
    icon: '◭',
    role: 'Creative ideation, problem-solving, architecture decisions',
    color: '#a855f7',
  },
  {
    name: 'Kit Designer',
    slug: 'epost-kit-designer',
    icon: '◮',
    role: 'Creates and maintains agents, skills, commands, hooks',
    color: '#8b5cf6',
  },
  {
    name: 'MCP Manager',
    slug: 'epost-mcp-manager',
    icon: '◯',
    role: 'MCP server integrations, tool discovery, RAG queries',
    color: '#06b6d4',
  },
  {
    name: 'Journal Writer',
    slug: 'epost-journal-writer',
    icon: '◴',
    role: 'Development journals, decision logs, failure post-mortems',
    color: '#f97316',
  },
];
