---
name: find-skill
description: (ePost) Discovers and installs external skills from agent-kernel (Bitbucket) or skills.sh community registry. Use when user wants to find, browse, or install skills not bundled in epost_agent_kit.
user-invocable: true

metadata:
  keywords: [find, discover, skill, agent-kernel, community, install, external, skills.sh]
  platforms: [all]
  triggers: ["/find-skill", "find skill", "search skill", "browse skills", "install skill", "agent-kernel"]
---

# Find Skill

Discover and install skills from two external sources:
- **agent-kernel** — org-contributed skills (Bitbucket, SSH, cached locally)
- **skills.sh** — public community registry (`npx skills`)

## Flags

| Invocation | Behavior |
|-----------|----------|
| `/find-skill [query]` | Unified search: kernel (scored) + skills.sh — use this by default |
| `/find-skill --kernel [query]` | Kernel only, scored by quality + project relevance |
| `/find-skill --community [query]` | skills.sh registry only (`npx skills find`) |
| `/find-skill --install <name>` | Install from kernel (priority) or skills.sh fallback |
| `/find-skill --refresh` | Force re-pull kernel cache regardless of 24h TTL |

## Execution

**Detect project root**: directory containing `.epost-metadata.json`. Walk up from `cwd` if not found immediately.

**Script location**: `.claude/skills/find-skill/scripts/find-skill.cjs`

Always pass `--cwd <project-root>`:

```
node .claude/skills/find-skill/scripts/find-skill.cjs [--kernel|--community|--install <name>|--refresh] [query] --cwd <project-root>
```

## Error Handling

| Error | Response |
|-------|----------|
| SSH/clone failure | "Kernel unavailable — SSH key configured for Bitbucket? Falling through to skills.sh." |
| npx not found | "Install Node.js to use skills.sh community search." |
| Skill not found in kernel OR skills.sh | "Not found. Try a broader query: /find-skill <keywords>" |

## Output

Kernel results are displayed as a scored table — **QUALITY** (skill documentation completeness, 0–10) and **RELEVANCE** (match to this project's tech stack + domain, 0–10). Higher combined score appears first.

After listing results, always offer: "Run `/find-skill --install <name>` to install."

Installed skills land in `.claude/skills/<name>/` and are **active immediately** — no re-init needed.
