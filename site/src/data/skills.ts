export interface SkillCategory {
  name: string;
  label: string;
  color: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'core',
    label: 'Core',
    color: 'text-slate-400 border-slate-700',
    skills: ['core', 'skill-discovery', 'knowledge-retrieval', 'knowledge-capture', 'data-store', 'sequential-thinking', 'problem-solving', 'error-recovery', 'repomix'],
  },
  {
    name: 'web',
    label: 'Web',
    color: 'text-blue-400 border-blue-800',
    skills: ['web-frontend', 'web-nextjs', 'web-api-routes', 'web-auth', 'web-i18n', 'web-testing', 'web-modules', 'web-prototype', 'web-rag', 'web-ui-lib', 'web-a11y'],
  },
  {
    name: 'ios',
    label: 'iOS',
    color: 'text-orange-400 border-orange-800',
    skills: ['ios-development', 'ios-ui-lib', 'ios-rag', 'ios-a11y'],
  },
  {
    name: 'android',
    label: 'Android',
    color: 'text-green-400 border-green-800',
    skills: ['android-development', 'android-ui-lib', 'android-a11y'],
  },
  {
    name: 'backend',
    label: 'Backend',
    color: 'text-purple-400 border-purple-800',
    skills: ['backend-javaee', 'backend-databases', 'infra-docker', 'infra-cloud'],
  },
  {
    name: 'design-system',
    label: 'Design System',
    color: 'text-pink-400 border-pink-800',
    skills: ['figma', 'design-tokens', 'ui-lib-dev'],
  },
  {
    name: 'a11y',
    label: 'Accessibility',
    color: 'text-red-400 border-red-800',
    skills: ['a11y', 'web-a11y', 'ios-a11y', 'android-a11y'],
  },
  {
    name: 'kit',
    label: 'Kit Authoring',
    color: 'text-violet-400 border-violet-800',
    skills: ['kit', 'kit-agents', 'kit-agent-development', 'kit-skill-development', 'kit-hooks', 'kit-cli', 'kit-verify'],
  },
];
