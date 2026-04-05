# GitHub Copilot — Agent & Skill Mechanics

Source: VS Code Copilot Customization docs (official, Context7)

## How Instructions Are Loaded

- `.github/copilot-instructions.md` → **auto-loaded** as global context every session
- This is the entry point for `COPILOT.snippet.md` output

## Custom Agents (`.agent.md`)

- Stored in workspace (`.github/agents/*.agent.md`) or user profile
- YAML frontmatter: `name`, `description`, `tools`, `model`
- Users **explicitly select** agents from the Chat view dropdown
- **No auto-routing by description** — Copilot does not pick agents automatically

```markdown
---
name: security-reviewer
description: Security-focused code reviewer for vulnerabilities and auth issues
tools: [read_file, search_files]
---
Instructions for the agent...
```

Create via: Chat view → Configure Chat → Agents tab → New Agent, or Command Palette `Chat: New Custom Agent`.

## Agent Skills (Extension API only)

- Registered via `contributes.chatSkills` in `package.json` — NOT workspace files
- Requires publishing a VS Code extension — not usable in plain workspace repos
- Not relevant for epost_agent_kit snippet generation

```json
{
  "contributes": {
    "chatSkills": [{ "path": "./skills/my-skill/SKILL.md" }]
  }
}
```

## Implication for COPILOT.snippet.md

Since Copilot has no description-based auto-routing and agent skills require an extension:
- **Routing table is the only practical mechanism** — tells Copilot which `@agent` to suggest
- Keep `COPILOT.snippet.md` minimal: routing table + brief starter prompts
- No skills catalogue, no stack details — Copilot can't load these on demand

## What Good COPILOT.snippet.md Looks Like

```markdown
## Agent Routing

| User intent | Suggest |
|-------------|---------|
| Build / implement | @epost-fullstack-developer |
| Fix / debug | @epost-debugger |
| Plan / design | @epost-planner |
...

### Starter Prompts
- `@epost-researcher Explain this project and its structure.`
- `@epost-planner Plan a new [feature] for this project.`
```
