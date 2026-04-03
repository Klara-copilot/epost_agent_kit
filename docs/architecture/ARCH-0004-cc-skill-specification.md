# ARCH-0004: Claude Code Skill Specification

**Status**: Current (authoritative)
**Source**: "The Complete Guide to Building Skills for Claude" (Anthropic, Jan 2026) + Claude Code documentation
**Audience**: Agent, human

This document is the ground truth for CC skill structure, frontmatter, and behavior. It describes what Anthropic defines, before any ePost additions. See CONV-0003 for ePost-specific standards layered on top.

---

## What a Skill Is

A skill is a Markdown file (`SKILL.md`) with YAML frontmatter that provides Claude with domain knowledge, workflow instructions, or behavioral guidance. Skills are the "recipes" to MCP's "kitchen" — MCP gives Claude tool access; skills teach it *how* to use those tools.

**Two paths**:
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
- Folder: kebab-case only. No spaces (`Notion Project Setup`), underscores (`notion_project_setup`), or capitals (`NotionProjectSetup`).
- File: must be exactly `SKILL.md` (case-sensitive). `SKILL.MD`, `skill.md`, `Skill.md` are rejected.
- No `README.md` inside skill folder. All docs go in `SKILL.md` or `references/`. *(Exception: repo-level README for GitHub distribution is fine.)*

---

## YAML Frontmatter

### Required Fields

| Field | Rules |
|-------|-------|
| `name` | kebab-case, no spaces or capitals, should match folder name |
| `description` | WHAT it does + WHEN to use it. Under 1024 characters. No XML tags `< >`. Do not include "claude" or "anthropic" in the skill name (reserved). |

### Optional Fields

| Field | Description |
|-------|-------------|
| `license` | Include if making skill open source. Common: MIT, Apache-2.0 |
| `compatibility` | 1–500 chars. Environment requirements, required packages, network needs |
| `metadata` | Custom key-value pairs. Suggested: `author`, `version`, `mcp-server`, `category`, `tags` |
| `allowed-tools` | Restrict which Claude Code tools the skill can use |
| `user-invocable` | `true` = registered as a slash command. `false` = loaded contextually only |
| `disable-model-invocation` | `true` = skill content injected as static reference only; Claude does not use it to generate responses |
| `context` | `fork` = dispatch to a sub-agent; `inline` = execute in current context (default) |
| `agent` | Name of sub-agent to spawn when `context: fork` |
| `hooks` | Lifecycle hooks scoped to this skill's execution |
| `paths` | File path restrictions |
| `shell` | Shell execution settings |

**NOT a valid field:** `version` — put it under `metadata.version` instead.

### Security Restrictions

Forbidden in frontmatter:
- XML angle brackets `< >` — security risk (frontmatter appears in system prompt)
- Code execution in YAML
- Skill names containing "claude" or "anthropic" (reserved)

---

## The Description Field — Most Important Part

The description is how Claude decides whether to load the skill. Get this right.

**Formula:** `[What it does] + [When to use it] + [Key capabilities]`

```yaml
# Good — specific, actionable, includes trigger phrases
description: Analyzes Figma design files and generates developer handoff documentation.
  Use when user uploads .fig files, asks for "design specs", "component documentation",
  or "design-to-code handoff".

# Good — includes trigger phrases
description: Manages Linear project workflows including sprint planning, task creation,
  and status tracking. Use when user mentions "sprint", "Linear tasks", "project
  planning", or asks to "create tickets".

# Bad — too vague
description: Helps with projects.

# Bad — missing triggers
description: Creates sophisticated multi-page documentation systems.

# Bad — too technical, no user triggers
description: Implements the Project entity model with hierarchical relationships.
```

**Rules:**
- Include trigger phrases users would actually say
- Mention file types if relevant (`.fig`, `.csv`, `.sql`)
- Keep it under 1024 characters
- No XML tags

---

## Progressive Disclosure (3 Levels)

Claude loads skill content progressively to conserve context:

| Level | What | When Loaded |
|-------|------|-------------|
| L1 — Frontmatter | name, description, metadata | Always. Every conversation. |
| L2 — SKILL.md body | Instructions, workflow, examples | When Claude judges it relevant to the task |
| L3 — Linked files | `references/`, `assets/` | Explicitly, when Claude needs deeper detail |

**Implication:** Frontmatter (especially description) is the only content guaranteed to be in context. L2 and L3 are loaded on demand. Design with this in mind — critical routing logic must live in the description.

**Size recommendation:** Keep SKILL.md under 5,000 words. If it grows beyond that, move detail into `references/` and link to it.

---

## Writing Effective Instructions

### Be Specific and Actionable

```markdown
# Good
Run `python scripts/validate.py --input {filename}` to check data format.
If validation fails, common issues include:
- Missing required fields (add them to the CSV)
- Invalid date formats (use YYYY-MM-DD)

# Bad
Validate the data before proceeding.
```

### Include Error Handling

```markdown
## Common Issues

### MCP Connection Failed
If you see "Connection refused":
1. Verify MCP server is running: Check Settings > Extensions
2. Confirm API key is valid
3. Try reconnecting: Settings > Extensions > [Your Service] > Reconnect
```

### Use Progressive Disclosure

Keep SKILL.md focused on core instructions. Move detailed docs to `references/` and link:

```markdown
Before writing queries, consult `references/api-patterns.md` for:
- Rate limiting guidance
- Pagination patterns
- Error codes and handling
```

### Recommended SKILL.md Structure

```markdown
---
name: your-skill
description: [...]
---

# Your Skill Name

## Instructions

### Step 1: [First Major Step]
Clear explanation of what happens.

### Step 2: [Second Step]
...

## Examples

### Example 1: [Common scenario]
User says: "..."
Actions:
1. ...
2. ...
Result: ...

## Troubleshooting

### Error: [Common error message]
**Cause:** [Why it happens]
**Solution:** [How to fix]
```

---

## Use Case Categories

### Category 1: Document & Asset Creation
Creating consistent, high-quality output — documents, presentations, code, designs.
**Key techniques:** Embedded style guides, template structures, quality checklists, no external tools required.

### Category 2: Workflow Automation
Multi-step processes benefiting from consistent methodology, often across multiple MCP servers.
**Key techniques:** Step-by-step workflow with validation gates, templates, iterative refinement loops.

### Category 3: MCP Enhancement
Workflow guidance to enhance the tool access an MCP server provides.
**Key techniques:** Coordinate multiple MCP calls in sequence, embed domain expertise, provide context users would otherwise need to specify, handle common MCP errors.

---

## Success Criteria

### Quantitative
- Skill triggers on 90%+ of relevant queries (run 10–20 test queries)
- Completes workflow in fewer tool calls vs. no skill (count with/without)
- 0 failed API calls per workflow (monitor retry rates)

### Qualitative
- Users don't need to prompt Claude about next steps
- Workflows complete without user correction (test same request 3–5 times)
- Consistent results across sessions (new user can accomplish task first try)

---

## Testing

### 1. Triggering Tests

```
Should trigger:
- "Help me set up a new ProjectHub workspace"
- "I need to create a project in ProjectHub"
- "Initialize a ProjectHub project for Q4 planning"

Should NOT trigger:
- "What's the weather in San Francisco?"
- "Help me write Python code"
- "Create a spreadsheet" (unless this skill handles sheets)
```

### 2. Functional Tests

```
Test: Create project with 5 tasks
Given: Project name "Q4 Planning", 5 task descriptions
When: Skill executes workflow
Then:
  - Project created in ProjectHub
  - 5 tasks created with correct properties
  - All tasks linked to project
  - No API errors
```

### 3. Performance Comparison

Compare token usage with vs. without the skill. A well-designed skill should reduce:
- Back-and-forth clarifying messages
- Failed API calls requiring retry
- Total tokens consumed

---

## Iteration Signals

| Signal | Cause | Solution |
|--------|-------|----------|
| Skill never loads automatically | Undertriggering | Add more detail and trigger phrases to description |
| Skill loads for irrelevant queries | Overtriggering | Add negative triggers; be more specific; clarify scope |
| Inconsistent results | Execution issues | Improve instructions, add error handling, add validation scripts |
| Instructions not followed | Too verbose or buried | Keep instructions concise; use `## Important` headers; put critical info at top |

---

## Troubleshooting

### Skill Won't Upload
- `"Could not find SKILL.md"` → File not named exactly `SKILL.md`
- `"Invalid frontmatter"` → YAML formatting issue (missing `---` delimiters, unclosed quotes)
- `"Invalid skill name"` → Name has spaces or capitals; must be `kebab-case`

### Skill Doesn't Trigger
**Quick checklist:**
- Is description too generic? ("Helps with projects" won't work)
- Does it include trigger phrases users would actually say?
- Does it mention relevant file types if applicable?

**Debugging approach:** Ask Claude: "When would you use the [skill name] skill?" Claude will quote the description back — adjust based on what's missing.

### Instructions Not Followed
1. **Too verbose** → Keep concise, use bullets/numbered lists, move detail to `references/`
2. **Instructions buried** → Put critical instructions at top; use `## Important` or `## Critical` headers
3. **Ambiguous language** → Be explicit: `"CRITICAL: Before calling create_project, verify: - Project name is non-empty"`

### Large Context Issues
- **Symptom:** Skill seems slow or responses degraded
- **Causes:** SKILL.md too large; too many skills enabled simultaneously; all content loaded instead of progressive disclosure
- **Solutions:** Move detailed docs to `references/`, link from SKILL.md; evaluate if 20–50 skills simultaneously is too many; keep SKILL.md under 5,000 words

---

## Distribution

### Individual Users
1. Download skill folder
2. Zip if needed
3. Upload via Claude.ai Settings > Capabilities > Skills, or place in Claude Code skills directory

### Organizations
Admins can deploy skills workspace-wide (available December 18, 2025). Automatic updates. Centralized management.

### Via API
`/v1/skills` endpoint for listing/managing skills. Add to Messages API via `container.skills` parameter. Works with Claude Agent SDK for custom agents.

---

*Source: "The Complete Guide to Building Skills for Claude" — Anthropic (Jan 2026)*
*Related: ARCH-0005 (Sub-Agent Spec), CONV-0003 (ePost Skill Standards)*
