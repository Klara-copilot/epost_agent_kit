# Skill Authoring Guide

## Step-by-Step Creation Process

### Step 1: Understand the Skill with Concrete Examples

Skip only when usage patterns are already clearly understood.

Gather concrete examples of how the skill will be used. Ask questions like:

- "What functionality should the [skill-name] skill support?"
- "Can you give some examples of how this skill would be used?"
- "What would a user say that should trigger this skill?"

Avoid asking too many questions at once. Start with the most important and follow up as needed.

**Conclude when:** There is a clear sense of the functionality the skill should support.

### Step 2: Plan the Reusable Skill Contents

Analyze each concrete example by:
1. Considering how to execute the example from scratch
2. Identifying what scripts, references, and assets would help when executing repeatedly

**Examples:**

| Skill | Example query | Resource needed |
|-------|--------------|-----------------|
| `pdf-editor` | "Rotate this PDF" | `scripts/rotate_pdf.py` — prevents rewriting code each time |
| `frontend-webapp-builder` | "Build me a todo app" | `assets/hello-world/` — boilerplate HTML/React template |
| `big-query` | "How many users logged in today?" | `references/schema.md` — table schemas and relationships |
| `hooks` | "Create a PreToolUse hook" | `scripts/validate-hook-schema.sh`, `references/patterns.md` |

**Outcome:** A list of scripts, references, and assets to include.

### Step 3: Create Skill Structure

```bash
mkdir -p plugin-name/skills/skill-name/references
touch plugin-name/skills/skill-name/SKILL.md
```

Follow agentskills.io compliance (see `skill-structure.md`):
- Only `SKILL.md` in skill root
- Reference docs → `references/`, data files → `assets/`, scripts → `scripts/`

### Step 4: Write the Skill

#### Start with Reusable Resources

Implement `scripts/`, `references/`, and `assets/` files first. Some resources require user input (e.g., brand assets, API documentation, company policies).

Delete any example files and directories not needed. Create only the directories you actually use.

#### Write SKILL.md

**Description (frontmatter):**
```yaml
---
name: skill-name
description: This skill should be used when the user asks to "specific phrase 1",
  "specific phrase 2", "specific phrase 3". Include exact phrases users would say.
---
```

**Body:** Lean, imperative form, 1,500–2,000 words. Answer:
1. What is the purpose of the skill?
2. When should it be used? (Captured in frontmatter description)
3. How should Claude use the bundled resources?

Reference all resources in SKILL.md so Claude knows they exist:
```markdown
## Reference Files
- **`references/patterns.md`** - Detailed patterns
- **`references/advanced.md`** - Advanced use cases
```

### Step 5: Validate and Test

1. **Structure**: Skill directory in correct location, SKILL.md present
2. **Triggers**: Description has specific user queries in quotes
3. **Writing style**: Body uses imperative form, not second person
4. **Progressive disclosure**: SKILL.md is lean, detailed content in `references/`
5. **References exist**: All referenced files are present
6. **Scripts work**: Scripts are executable and function correctly

### Step 6: Iterate

After using the skill on real tasks:
1. Notice where Claude struggled or was inefficient
2. Identify gaps in SKILL.md or bundled resources
3. Implement changes and test again

**Common improvements:**
- Strengthen trigger phrases in description
- Move long sections to `references/`
- Add missing examples or scripts
- Clarify ambiguous instructions
- Add edge case handling

---

## Common Mistakes

### Mistake 1: Weak Trigger Description

❌ **Bad:**
```yaml
description: Provides guidance for working with hooks.
```
*Why bad:* Vague, no specific trigger phrases, not third person.

✅ **Good:**
```yaml
description: This skill should be used when the user asks to "create a hook",
  "add a PreToolUse hook", "validate tool use", or mentions hook events.
```
*Why good:* Third person, specific phrases, concrete scenarios.

### Mistake 2: Too Much in SKILL.md

❌ **Bad:**
```
skill-name/
└── SKILL.md  (8,000 words — everything in one file)
```
*Why bad:* Bloats context on every trigger, detailed content always loaded.

✅ **Good:**
```
skill-name/
├── SKILL.md  (1,800 words — core essentials)
└── references/
    ├── patterns.md   (2,500 words)
    └── advanced.md   (3,700 words)
```
*Why good:* Progressive disclosure — detailed content only loaded when needed.

### Mistake 3: Second Person Writing

❌ **Bad:**
```markdown
You should start by reading the configuration file.
You need to validate the input.
```

✅ **Good:**
```markdown
Start by reading the configuration file.
Validate the input before processing.
```

### Mistake 4: Missing Resource References

❌ **Bad:** SKILL.md body with no mention of `references/` or `scripts/`.

✅ **Good:**
```markdown
## Additional Resources
- **`references/patterns.md`** - Detailed patterns
- **`scripts/validate.sh`** - Validation utility
```
*Why:* Claude needs to know references exist to load them.

---

## Examples from Plugin-Dev

Study these skills as best-practice templates:

**`hook-development` skill:**
- Strong triggers: "create a hook", "add a PreToolUse hook", etc.
- Lean SKILL.md (~1,651 words)
- 3 `references/` files for detailed content
- 3 `examples/` of working hooks
- 3 `scripts/` utilities

**`agent-development` skill:**
- Strong triggers: "create an agent", "agent frontmatter", etc.
- Focused SKILL.md (~1,438 words)
- References include the AI generation prompt from Claude Code
- Complete agent examples

**`plugin-settings` skill:**
- Specific triggers: "plugin settings", ".local.md files", "YAML frontmatter"
- References show real implementations
- Working parsing scripts

Each demonstrates: strong trigger description, lean SKILL.md, progressive disclosure via `references/`.

---

## Quick Reference: What Goes Where

| Content | Location |
|---------|----------|
| Core concepts, overview | `SKILL.md` |
| Step-by-step procedures | `SKILL.md` (summary) + `references/` (detail) |
| Quick reference tables | `SKILL.md` |
| Pointers to resources | `SKILL.md` |
| Detailed patterns | `references/patterns.md` |
| Advanced techniques | `references/advanced.md` |
| Migration guides | `references/migration.md` |
| API documentation | `references/api-reference.md` |
| Working code examples | `examples/` or `scripts/` |
| Validation utilities | `scripts/` |
| Templates, icons, boilerplate | `assets/` |
