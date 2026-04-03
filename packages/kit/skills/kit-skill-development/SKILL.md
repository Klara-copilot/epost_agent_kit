---
name: kit-skill-development
description: "(ePost) Use when creating or auditing a skill, writing skill descriptions, or checking valid frontmatter fields. Reference: SKILL.md structure, CSO principles, progressive disclosure, description validation."
user-invocable: false
metadata:
  keywords: [skill, frontmatter, cso, progressive-disclosure, description, validation, skill-development]
  triggers: [skill frontmatter, create skill, skill structure, CSO, description validation]
  platforms: [all]
  agent-affinity: [epost-fullstack-developer, epost-code-reviewer]
  connections:
    enhances: [kit]
---

# Skill Development for Claude Code Plugins

Skills are modular packages that extend Claude's capabilities with specialized knowledge, workflows, and tools. Each skill has a required `SKILL.md` and optional bundled resources in `scripts/`, `references/`, and `assets/`.

## Progressive Disclosure (3 levels)

| Level | What | When loaded |
|-------|------|-------------|
| Frontmatter `name` + `description` | ~100 tokens | Always in context |
| `SKILL.md` body | < 5k tokens | When skill triggers |
| `references/`, `scripts/`, `assets/` | Unlimited | On demand by Claude |

**Target SKILL.md body: 150–200 lines (~1,500–2,000 words). Hard max: 500 lines. Move everything else to `references/`.**

## Skill Creation Process (Summary)

1. **Understand use cases** — gather concrete examples from user
2. **Plan resources** — identify what scripts/references/assets are needed
3. **Create structure** — `mkdir -p skills/skill-name/{references,scripts,assets}`
4. **Write SKILL.md** — lean body (imperative form) + third-person description with trigger phrases
5. **Add resources** — populate `references/`, `examples/`, `scripts/` as needed
6. **Validate & iterate** — check structure, triggers, writing style, progressive disclosure


## SKILL.md Frontmatter

All fields are optional. `description` is strongly recommended.

### Official Claude Code fields

| Field | Description |
|-------|-------------|
| `name` | Slash-command name. Defaults to directory name if omitted. Lowercase + hyphens only, max 64 chars. |
| `description` | Trigger conditions. Claude uses this to decide when to load the skill. **Front-load the key use case** — descriptions are truncated to 250 chars in the skill listing. |
| `argument-hint` | Autocomplete hint shown in `/` menu. Example: `[issue-number]` or `[filename] [format]`. |
| `disable-model-invocation` | `true` = only user can invoke (manual `/name` only). Use for side-effect workflows (deploy, commit, send). |
| `user-invocable` | `false` = hidden from `/` menu, Claude-only. Use for passive reference skills. |
| `allowed-tools` | Tools Claude can use without approval when skill is active. Space-separated string or YAML list. |
| `model` | Model override when this skill is active. |
| `effort` | Thinking effort override. Options: `low`, `medium`, `high`, `max` (Opus 4.6 only). |
| `context` | `fork` = run in isolated subagent context (not inline). |
| `agent` | Subagent type when `context: fork`. Options: `Explore`, `Plan`, `general-purpose`, or any custom agent. |
| `paths` | Glob patterns that limit auto-activation to specific files. CSV or YAML list. |
| `shell` | Shell for `` !`cmd` `` blocks. `bash` (default) or `powershell`. |
| `hooks` | Skill-scoped lifecycle hooks (same format as settings.json hooks). |

### Invocation modes

| Frontmatter | User can invoke | Claude can invoke | Description in context |
|-------------|----------------|-------------------|----------------------|
| (default) | ✓ | ✓ | Always |
| `disable-model-invocation: true` | ✓ | ✗ | Never (Claude never sees it) |
| `user-invocable: false` | ✗ | ✓ | Always |

### String substitutions

Use in skill body to inject dynamic values at runtime:

| Variable | Value |
|----------|-------|
| `$ARGUMENTS` | All text after the skill name when invoked |
| `$ARGUMENTS[N]` | Specific argument by 0-based index |
| `$N` | Shorthand — `$0` = first arg, `$1` = second |
| `${CLAUDE_SESSION_ID}` | Current session ID |
| `${CLAUDE_SKILL_DIR}` | Absolute path to the skill directory |

If `$ARGUMENTS` is absent and the user passes arguments, they are appended as `ARGUMENTS: <value>`.

### epost-kit extensions (under `metadata:`)

**Valid epost-kit extensions (root-level):**
`user-invocable`, `disable-model-invocation`, `context`, `agent`

**ePost metadata extensions (nested under `metadata:`):**
```yaml
metadata:
  keywords: [term1, term2]      # search terms for /find-skill
  platforms: [web, ios, all]    # target platforms
  triggers: [/slash-cmd, phrase] # explicit trigger phrases
  agent-affinity: [agent-name]  # agents that should load this skill
```

**Invalid:** `version:` — not a Claude Code frontmatter field.

## Skill Connections

Declare relationships between skills using `metadata.connections`. Extracted into `skill-index.json` during init.

```yaml
metadata:
  connections:
    extends: [parent-skill]        # inherits from; parent loaded before this
    requires: [dependency-skill]   # must be co-loaded for this skill to work
    conflicts: [incompatible-skill] # cannot coexist in same agent
    enhances: [enhanced-skill]     # optional complement; not required
```

**Rules:**
- Only declare direct relationships (not transitive)
- `extends` implies the parent is loaded first — use for specializations (e.g., `ios-a11y` extends `a11y`)
- `requires` means this skill is broken without the dependency — use sparingly
- `conflicts` is bidirectional — if A conflicts B, B should conflict A
- `enhances` is advisory — hints at useful pairings without hard dependency

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

## Extended Thinking (`ultrathink`)

Anthropic supports the `ultrathink` keyword to trigger extended thinking in Claude models.

- **When to use**: complex multi-step orchestration, deep architecture decisions, root cause analysis with many unknowns
- **When NOT to use**: simple workflows, lookup tasks, CRUD operations, anything with a clear single answer
- **How**: include the word `ultrathink` naturally in the skill body where deep reasoning is needed

## CSO: Cognitive Skill Optimization

Skills only work if models follow the body, not just the description. CSO prevents the "Description Trap" — where a description that summarizes workflow causes the model to skip the skill body entirely.

**Key rules:**
- Description = triggering conditions ONLY (when/who/situation), never workflow steps
- Discipline skills MUST include: Iron Law block, Anti-Rationalization table, Red Flags list
- Close every loophole explicitly — models find workarounds to vague instructions

See CONV-0003 (`docs/conventions/CONV-0003-epost-skill-standards.md`) for CSO principles.

## Description Validation Checklist

Before publishing a skill, verify the `description:` field passes all 7 checks:

- [ ] **Trigger phrasing** — Starts with "Use when..." or equivalent trigger phrasing (third-person)
- [ ] **Concrete triggers** — Contains at least 2 quoted trigger examples (e.g., `"plan"`, `"debug this"`)
- [ ] **No workflow summary** — Does NOT describe steps, tools used, or what happens next (Description Trap)
- [ ] **Character limit** — Front-load key use case: descriptions are **truncated to 250 chars** in the skill listing (full text still used for triggering decisions)
- [ ] **Quoted user phrases** — At least 2 explicit user-facing phrases in quotes
- [ ] **Third-person voice** — Uses "Use when user says..." not "I will..." or "This runs..."
- [ ] **Outcome signal** — Mentions what it dispatches or what domain it covers, not the how

See `references/description-validation-checklist.md` for full examples and fail patterns.

## agentskills.io Compliance Rules

- `SKILL.md` MUST be in skill root (only `.md` in root)
- Reference docs → `references/`, data files → `assets/`, scripts → `scripts/`
- `name:` MUST be lowercase with hyphens only — **no `/`, spaces, or underscores** per spec

## Reference Files

- **`references/description-validation-checklist.md`** — Checklist for validating skill description quality
