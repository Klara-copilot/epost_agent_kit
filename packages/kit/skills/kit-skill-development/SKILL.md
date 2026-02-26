---
name: kit-skill-development
description: This skill should be used when the user wants to "create a skill", "add a skill to plugin", "write a new skill", "improve skill description", "organize skill content", or needs guidance on skill structure, progressive disclosure, or skill development best practices for Claude Code plugins.
disable-model-invocation: true
"
---

# Skill Development for Claude Code Plugins

Skills are modular packages that extend Claude's capabilities with specialized knowledge, workflows, and tools. Each skill has a required `SKILL.md` and optional bundled resources in `scripts/`, `references/`, and `assets/`.

## Progressive Disclosure (3 levels)

| Level | What | When loaded |
|-------|------|-------------|
| Frontmatter `name` + `description` | ~100 tokens | Always in context |
| `SKILL.md` body | < 5k tokens | When skill triggers |
| `references/`, `scripts/`, `assets/` | Unlimited | On demand by Claude |

**Target SKILL.md body: 1,500–2,000 words. Move details to `references/`.**

## Skill Creation Process (Summary)

1. **Understand use cases** — gather concrete examples from user
2. **Plan resources** — identify what scripts/references/assets are needed
3. **Create structure** — `mkdir -p skills/skill-name/{references,scripts,assets}`
4. **Write SKILL.md** — lean body (imperative form) + third-person description with trigger phrases
5. **Add resources** — populate `references/`, `examples/`, `scripts/` as needed
6. **Validate & iterate** — check structure, triggers, writing style, progressive disclosure

See `references/skill-authoring-guide.md` for detailed steps, examples, and common mistakes.

## SKILL.md Frontmatter

**Required fields:**
```yaml
name: skill-name         # lowercase, hyphens only, matches directory
description: This skill should be used when the user asks to "phrase 1", "phrase 2"...
```

**Valid epost-kit extensions:**
`user-invocable`, `disable-model-invocation`, `context`, `agent`, `keywords`, `platforms`, `triggers`, `agent-affinity`

**Invalid:** `version:` — not a Claude Code frontmatter field.

## Writing Style

- **Description (frontmatter):** Third person — "This skill should be used when the user asks to..."
- **Body:** Imperative/infinitive form — "Configure X", "Validate Y" (not "You should...")

## Skill Directory Structures

**Minimal:**
```
skill-name/
└── SKILL.md
```

**Standard (recommended):**
```
skill-name/
├── SKILL.md
└── references/
    └── detailed-guide.md
```

**Complete:**
```
skill-name/
├── SKILL.md
├── references/
│   ├── patterns.md
│   └── advanced.md
├── assets/
│   └── template.json
└── scripts/
    └── validate.sh
```

## agentskills.io Compliance Rules

- `SKILL.md` MUST be in skill root (only `.md` in root)
- Reference docs → `references/`, data files → `assets/`, scripts → `scripts/`
- `name:` MUST be lowercase with hyphens only — **no `/`, spaces, or underscores** per spec
  (Note: epost-kit uses `/` as a namespace extension, e.g. `ios-a11y` — intentional divergence)

## Reference Files

- **`references/skill-authoring-guide.md`** — Step-by-step creation, writing style details, common mistakes, examples from plugin-dev
- **`references/skill-structure.md`** — Full anatomy, bundled resource types, progressive disclosure deep-dive, validation checklist
