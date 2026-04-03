# ARCH-0004: Skill Authoring — Ground Truth

**Category**: architecture
**Status**: current
**Audience**: agent, human
**Tags**: skills, authoring, frontmatter, progressive-disclosure, ground-truth

---

## Source

Anthropic's official guide: "The Complete Guide to Building Skills for Claude" (January 2026)

---

## 1. What a Skill Is

A skill is a folder containing:
- `SKILL.md` (required) — instructions in Markdown with YAML frontmatter
- `scripts/` (optional) — executable code (Python, Bash, etc.)
- `references/` (optional) — documentation loaded on demand
- `assets/` (optional) — templates, fonts, icons

Core properties: Composable (works alongside other skills), Portable (identical across Claude.ai, Claude Code, API).

---

## 2. Official Frontmatter Fields

These are the ONLY fields defined by the Agent Skills Spec. Any field outside this list is a kit extension.

### Required
- `name` — kebab-case, no spaces or capitals, must match folder name
- `description` — what it does AND when to use it; up to 1024 chars; no XML tags; include specific trigger phrases

### Optional (official)
- `license` — license identifier (MIT, Apache-2.0, etc.)
- `allowed-tools` — space-separated pre-approved tools: `"Bash(python:*) WebFetch Read"`
- `compatibility` — 1–500 chars; environment requirements, target product, system dependencies
- `metadata` — arbitrary key-value bag; suggested keys: `author`, `version`, `mcp-server`

### Security restrictions
- No XML angle brackets (`< >`) anywhere in frontmatter
- Names cannot start with `claude` or `anthropic` (reserved)

---

## 3. Our Kit Extensions (Non-Standard Fields)

These fields are used by our kit but are NOT in the open Agent Skills Spec. They work in Claude Code via undocumented or kit-specific mechanisms:

| Field | Purpose | Standard? |
|---|---|---|
| `user-invocable: false` | Hide from `/` slash menu; Claude-only invocation | Kit extension |
| `context: fork` | Run skill via agent spawn, not inline | Kit extension |
| `agent: epost-*` | Which agent to spawn when `context: fork` | Kit extension |
| `argument-hint` | Autocomplete hint in slash menu | Claude Code–specific (used by claudekit) |
| `metadata.keywords` | CLI tooling search index | Kit extension (no runtime effect) |
| `metadata.triggers` | CLI tooling / documentation | Kit extension (no runtime effect) |
| `metadata.platforms` | CLI tooling / documentation | Kit extension (no runtime effect) |

**Important:** `metadata.keywords`, `metadata.triggers`, and `metadata.platforms` have NO effect on Claude's loading decisions. They are consumed only by `epost-kit` CLI tooling.

---

## 4. Progressive Disclosure (3 Levels)

Skills use three levels of context loading to minimize token usage:

```
Level 1: YAML frontmatter
  → Always loaded in Claude's system prompt
  → Purpose: just enough to know WHEN to use the skill
  → Keep lean: description ≤1024 chars

Level 2: SKILL.md body
  → Loaded when Claude decides skill is relevant
  → Full instructions, workflow steps, patterns
  → Keep under 5,000 words

Level 3: references/ files
  → Loaded on demand as Claude navigates them
  → Deep reference material, examples, schemas
  → No size constraint — loaded only when explicitly needed
```

---

## 5. Description Field — The Critical Loading Signal

The description is the **only** field Claude reads to decide whether to load a skill. Get this right.

### Formula

`[When to use it (trigger phrases)] + [What it does] + [Key capabilities]`

### Good examples
```yaml
# Specific, actionable, includes what users say
description: Use when user uploads .fig files, asks for "design specs", "component
  documentation", or "design-to-code handoff". Analyzes Figma design files and
  generates developer handoff documentation.

# Includes trigger phrases
description: Use when user mentions "sprint", "Linear tasks", "project planning",
  or asks to "create tickets". Manages Linear project workflows including sprint
  planning, task creation, and status tracking.
```

### Bad examples
```yaml
# Too vague
description: Helps with projects.

# Missing triggers
description: Creates sophisticated multi-page documentation systems.

# Technical, no user triggers
description: Implements the Project entity model with hierarchical relationships.
```

### Debugging a skill that won't trigger
Ask Claude: "When would you use the [skill-name] skill?" — Claude quotes the description back. Adjust based on what's missing.

---

## 6. Testing Framework

### 1. Triggering tests (target: 90% accuracy)
- Should trigger on obvious tasks
- Should trigger on paraphrased requests
- Should NOT trigger on unrelated topics

Format: `{"query": "...", "should_trigger": true/false}` — this is our `evals/eval-set.json` format.

### 2. Functional tests
Given/When/Then: verify correct output, tool calls succeed, error handling works.

### 3. Performance comparison
Compare token count and tool calls with vs. without the skill enabled.

---

## 7. Troubleshooting Patterns

| Symptom | Cause | Fix |
|---|---|---|
| Skill never loads | Description too vague or missing triggers | Rewrite description; add user-facing trigger phrases |
| Skill loads too often | Description too broad | Add negative triggers; narrow scope with "Do NOT use for..." |
| Instructions not followed | Too verbose; critical steps buried | Front-load critical instructions; use `## CRITICAL:` headers; move depth to references/ |
| SKILL.md too large | All content inline | Move detailed docs to `references/`; keep SKILL.md under 5,000 words |
| Inconsistent results | Ambiguous language | Use concrete, deterministic instructions; bundle validation scripts |

---

## 8. Skill Categories

| Category | Use for | Key techniques |
|---|---|---|
| Document/Asset Creation | Consistent output: documents, designs, code | Style guides, templates, quality checklists |
| Workflow Automation | Multi-step processes, MCP coordination | Step ordering, validation gates, rollback instructions |
| Domain-Specific Intelligence | Embedded expertise beyond tool access | Logic, compliance checks, audit trails |

---

## 9. File Size Limits

| File | Limit | Reason |
|---|---|---|
| SKILL.md body | ≤5,000 words | Loaded into context on activation — token cost |
| description | ≤1024 chars | Frontmatter is always loaded; truncated in listing display |
| Max skills enabled | 20–50 simultaneously | Context window degradation beyond this |

---

## Related
- `ARCH-0003` — Three-layer knowledge model and skill gap analysis
- `ARCH-0002` — Claude native mechanics and routing design
- `ARCH-0001` — Current system architecture
- `packages/kit/skills/skill-creator/references/cc-skill-spec.md` — Authoritative CC skill spec
- `packages/kit/skills/skill-creator/references/epost-skill-authoring-standards.md` — ePost conventions layered on top
- `packages/kit/skills/kit-skill-development/references/cso-principles.md` — CSO description formula and examples
