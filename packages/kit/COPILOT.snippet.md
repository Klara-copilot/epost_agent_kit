## Kit Authoring

**Purpose**: Scaffold and manage agents, skills, hooks for epost_agent_kit

### Agent Routing

| Task | Agent |
|------|-------|
| Add new skill / agent / hook | `@epost-fullstack-developer` |
| Verify kit integrity before release | `@epost-fullstack-developer` |
| Research best practice for skill design | `@epost-researcher` |

### Conventions

- ALL changes go in `packages/` — never edit `.claude/` directly
- `.claude/` is generated output, wiped on `epost-kit init`
- Skills: `packages/{pkg}/skills/{skill-name}/SKILL.md`
- Agents: `packages/{pkg}/agents/{agent-name}.md`
- Hooks: `packages/core/hooks/{hook-name}.cjs`

### Starter Prompts

- `@epost-fullstack-developer Add a new skill named [skill] to the [package] package.`
- `@epost-fullstack-developer Scaffold a new agent [agent-name].`
- `@epost-fullstack-developer Run kit-verify to check kit integrity.`
