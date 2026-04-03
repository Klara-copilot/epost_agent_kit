# Claude Code Skill Specification

*Anthropic's authoritative skill spec. For ePost-specific conventions layered on top, see the kit-skill-development skill.*

---

## What a Skill Is

A skill is a Markdown file (`SKILL.md`) with YAML frontmatter that provides Claude with domain knowledge, workflow instructions, or behavioral guidance.

**Two paths:**
- **Standalone** — no MCP, uses Claude's built-in tools only
- **MCP-enhanced** — wraps a connected MCP server with domain expertise and best practices

---

## File Structure

```
your-skill-name/
├── SKILL.md          ← Required. Main skill file.
├── scripts/          ← Optional. Executable code.
│   └── validate.sh
├── references/       ← Optional. Deep documentation.
│   └── api-guide.md
└── assets/           ← Optional. Templates, etc.
    └── report-template.md
```

**Rules:**
- Folder: kebab-case only. No spaces, underscores, or capitals.
- File: must be exactly `SKILL.md` (case-sensitive).
- No `README.md` inside skill folder. All docs go in `SKILL.md` or `references/`.

---

## YAML Frontmatter

### Required (recommended in practice)

| Field | Rules |
|-------|-------|
| `name` | kebab-case, no spaces or capitals, matches folder name. Max 64 chars. |
| `description` | WHAT it does + WHEN to use it. Front-load key use case — truncated to 250 chars in listing. |

### Optional — Official Claude Code fields

| Field | Description |
|-------|-------------|
| `argument-hint` | Autocomplete hint: `[issue-number]` or `[filename] [format]` |
| `disable-model-invocation` | `true` = manual invocation only (`/name`). Use for side-effect workflows. |
| `user-invocable` | `false` = hidden from `/` menu, Claude-only. Use for passive reference skills. |
| `allowed-tools` | Tools usable without approval when skill is active. Space-separated or YAML list. |
| `model` | Model override when skill is active. |
| `effort` | `low`, `medium`, `high`, `max` (Opus 4.6 only). |
| `context` | `fork` = dispatch to a sub-agent; `inline` = execute in current context (default). |
| `agent` | Sub-agent to spawn when `context: fork`. |
| `hooks` | Lifecycle hooks scoped to this skill's execution. |
| `paths` | Glob patterns that limit auto-activation to specific files. |
| `shell` | Shell for `` !`cmd` `` blocks: `bash` (default) or `powershell`. |

**NOT a valid field:** `version` — put it under `metadata.version` instead.

**Security:** No XML angle brackets `< >` in frontmatter. No skill names containing "claude" or "anthropic".

---

## The Description Field — Most Important Part

**Formula:** `[When to use it] + [What it does] + [Key trigger phrases]`

```yaml
# Good
description: Use when user uploads .fig files, asks for "design specs", "component
  documentation", or "design-to-code handoff". Analyzes Figma design files and
  generates developer handoff documentation.

# Good
description: Use when user mentions "sprint", "Linear tasks", "project planning",
  or asks to "create tickets". Manages Linear project workflows including sprint
  planning, task creation, and status tracking.

# Bad — too vague
description: Helps with projects.

# Bad — no trigger phrases, summarizes workflow instead
description: Creates sophisticated multi-page documentation systems using a three-
  step pipeline with analysis, generation, and validation stages.
```

**Rules:**
- Front-load the key use case (250-char truncation in listing)
- Include trigger phrases users would actually say
- Mention file types if relevant (`.fig`, `.csv`, `.sql`)
- Description = trigger conditions ONLY — never summarize the body (Description Trap)

---

## Progressive Disclosure (3 Levels)

| Level | What | When Loaded |
|-------|------|-------------|
| L1 — Frontmatter | name, description, metadata | Always in context |
| L2 — SKILL.md body | Instructions, workflow, examples | When Claude judges it relevant |
| L3 — Linked files | `references/`, `assets/`, `scripts/` | Explicitly, on demand |

**Critical implication:** Frontmatter (especially description) is the only content guaranteed to be in context. L2 and L3 are loaded on demand. Critical routing logic must live in the description, not the body.

**Size:** Keep SKILL.md under 500 lines. Move detail into `references/` and link to it.

---

## Writing Effective Instructions

### Be specific and actionable
```markdown
# Good
Run `python scripts/validate.py --input {filename}` to check data format.
If validation fails, common issues:
- Missing required fields (add them to the CSV)
- Invalid date formats (use YYYY-MM-DD)

# Bad
Validate the data before proceeding.
```

### Use progressive disclosure
Keep SKILL.md focused. Move detailed docs to `references/` and link:
```markdown
Before writing queries, consult `references/api-patterns.md` for:
- Rate limiting guidance
- Pagination patterns
```

### Recommended SKILL.md structure
```markdown
---
name: your-skill
description: Use when... [triggers]. [What it does].
---

# Skill Name

## Instructions

### Step 1: [First Major Step]
...

## Examples

### Example 1: [Common scenario]
User says: "..."
Actions: ...

## Troubleshooting
### Error: [Common error]
Cause: ... Solution: ...
```

---

## Use Case Categories

| Category | Pattern | Key techniques |
|----------|---------|----------------|
| Document & Asset Creation | Creates consistent output (docs, code, designs) | Embedded style guides, templates, quality checklists |
| Workflow Automation | Multi-step processes with consistent methodology | Step-by-step with validation gates, iterative loops |
| MCP Enhancement | Wraps MCP server with domain expertise | Coordinate multiple MCP calls, embed domain context, handle errors |

---

## Success Criteria

**Quantitative:**
- Skill triggers on 90%+ of relevant queries (run 10–20 test queries)
- Completes workflow in fewer tool calls vs. no skill
- 0 failed API calls per workflow

**Qualitative:**
- Users don't need to prompt Claude about next steps
- Consistent results across sessions
- New user can accomplish task first try

---

## Iteration Signals

| Signal | Cause | Fix |
|--------|-------|-----|
| Skill never loads automatically | Undertriggering | Add more trigger phrases to description |
| Skill loads for irrelevant queries | Overtriggering | Make description more specific; add negative scope |
| Inconsistent results | Execution issues | Improve instructions, add validation scripts |
| Instructions not followed | Too verbose or buried | Keep concise; put critical info at top |

---

## Troubleshooting

**Skill doesn't trigger:**
- Is description too generic? ("Helps with projects" won't work)
- Does it include trigger phrases users would actually say?
- Debug: ask Claude "When would you use the [skill name] skill?" — Claude quotes the description back

**Instructions not followed:**
1. Too verbose → keep concise, use bullets, move detail to `references/`
2. Instructions buried → put critical instructions at top; use `## Important` headers
3. Ambiguous language → be explicit

**Large context issues:**
- Move detailed docs to `references/`, link from SKILL.md
- Keep SKILL.md under 500 lines
