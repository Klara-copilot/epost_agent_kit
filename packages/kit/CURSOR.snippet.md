## Kit Authoring

**Purpose**: Scaffold and manage agents, skills, hooks for epost_agent_kit

This rule auto-applies when editing files under `packages/`.

### Agent Routing

| Intent | Chat command |
|--------|-------------|
| Add new skill / agent / hook | `@epost-fullstack-developer [task]` |
| Verify kit integrity | `@epost-fullstack-developer Run kit-verify` |
| Research skill design patterns | `@epost-researcher [topic]` |

### Conventions

- ALL changes in `packages/` — never edit `.claude/` directly
- `.claude/` is generated output; wiped on `epost-kit init`
- Skills: `packages/{pkg}/skills/{skill-name}/SKILL.md`
- Agents: `packages/{pkg}/agents/{agent-name}.md`
- Hooks: `packages/core/hooks/{hook-name}.cjs`

### Context Rules

- `.cursor/rules/epost-kit.mdc` is always active (base routing rules)
- Cursor's Task tool may not work — delegate via chat, not programmatic dispatch
