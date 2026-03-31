export interface Agent {
  name: string;
  slug: string;
  icon: string;
  role: string;
  color: string;
}

export const agents: Agent[] = [
  { name: 'Fullstack Developer', slug: 'epost-fullstack-developer', icon: '⚙', role: 'Implements features across web, iOS, Android, and backend', color: '#22c55e' },
  { name: 'Planner', slug: 'epost-planner', icon: '◈', role: 'Creates phased implementation plans with dependency tracking', color: '#3b82f6' },
  { name: 'Code Reviewer', slug: 'epost-code-reviewer', icon: '◉', role: 'Security audits, STRIDE threats, OWASP, code quality', color: '#eab308' },
  { name: 'Debugger', slug: 'epost-debugger', icon: '◎', role: 'Root cause analysis and runtime error resolution', color: '#ef4444' },
  { name: 'Tester', slug: 'epost-tester', icon: '◇', role: 'Test suites, coverage analysis, scenario edge cases', color: '#eab308' },
  { name: 'MUJI', slug: 'epost-muji', icon: '◑', role: 'Figma-to-code, design system, UI/UX, landing page craft', color: '#ec4899' },
  { name: 'A11y Specialist', slug: 'epost-a11y-specialist', icon: '◐', role: 'WCAG 2.1 AA compliance across iOS, Android, and Web', color: '#dc2626' },
  { name: 'Docs Manager', slug: 'epost-docs-manager', icon: '◫', role: 'Documentation lifecycle, KB structure, orphan detection', color: '#3b82f6' },
  { name: 'Researcher', slug: 'epost-researcher', icon: '◰', role: 'Technology research, best practices, comparative analysis', color: '#a855f7' },
  { name: 'Git Manager', slug: 'epost-git-manager', icon: '◳', role: 'Commit, push, PR — full ship pipeline with security scan', color: '#a855f7' },
];
