# Skill Structure Reference

## Full Anatomy of a Skill

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation loaded into context as needed
    └── assets/           - Files used in output (templates, icons, fonts, etc.)
```

## Bundled Resource Types

### Scripts (`scripts/`)

Executable code for tasks that require deterministic reliability or are repeatedly rewritten.

- **When to include**: When the same code is being rewritten repeatedly, or deterministic reliability is needed
- **Example**: `scripts/rotate_pdf.py` for PDF rotation tasks
- **Benefits**: Token efficient, deterministic, may be executed without loading into context
- **Note**: Scripts may still need to be read by Claude for patching or environment-specific adjustments

### References (`references/`)

Documentation and reference material loaded as needed into context to inform Claude's process.

- **When to include**: For documentation Claude should reference while working
- **Examples**: `references/finance.md` for financial schemas, `references/policies.md` for company policies
- **Use cases**: Database schemas, API documentation, domain knowledge, detailed workflow guides
- **Benefits**: Keeps SKILL.md lean; loaded only when Claude determines it's needed
- **Best practice**: If files are large (>10k words), include grep search patterns in SKILL.md
- **Avoid duplication**: Information should live in SKILL.md or references files, not both

### Assets (`assets/`)

Files used in output Claude produces, not loaded into context.

- **When to include**: When the skill needs files used in the final output
- **Examples**: `assets/logo.png`, `assets/slides.pptx`, `assets/frontend-template/`
- **Use cases**: Templates, images, icons, boilerplate code, sample documents
- **Benefits**: Separates output resources from documentation

## Progressive Disclosure Deep Dive

### Level 1: Metadata (Always in Context, ~100 tokens)

The `name` and `description` frontmatter fields. Always loaded. Determines when the skill triggers.
**Quality here determines whether the skill ever gets used.**

### Level 2: SKILL.md Body (On Trigger, <5k tokens)

Core concepts, workflows, quick references, and pointers to Level 3 resources.
Loaded when Claude determines the skill is relevant to the current task.

**Target: 1,500–2,000 words. Hard max: 5,000 words.**

### Level 3: Bundled Resources (On Demand, Unlimited)

Scripts, references, and assets. Loaded only when Claude explicitly decides they're needed.
Scripts can even be executed without being read.

## Plugin-Specific Considerations

### Skill Location in Plugins

```
my-plugin/
├── package.yaml           (or plugin.json)
├── commands/
├── agents/
└── skills/
    └── my-skill/
        ├── SKILL.md
        ├── references/
        └── scripts/
```

### Auto-Discovery

Claude Code automatically discovers skills by:
1. Scanning the `skills/` directory
2. Finding subdirectories containing `SKILL.md`
3. Loading skill metadata (name + description) at all times
4. Loading SKILL.md body when skill triggers
5. Loading references/scripts when Claude determines they're needed

### No Packaging Needed

Plugin skills are distributed as part of the plugin. Users get skills when they install the plugin.

## Validation Checklist

**Structure:**
- [ ] `SKILL.md` file exists with valid YAML frontmatter
- [ ] Frontmatter has `name` and `description` fields
- [ ] Markdown body is present and substantial
- [ ] Referenced files actually exist
- [ ] No `.md` files in skill root other than `SKILL.md`
- [ ] Data files in `assets/`, executables in `scripts/`, docs in `references/`

**Description Quality:**
- [ ] Uses third person ("This skill should be used when...")
- [ ] Includes specific trigger phrases users would say
- [ ] Lists concrete scenarios ("create X", "configure Y")
- [ ] Not vague or generic

**Content Quality:**
- [ ] SKILL.md body uses imperative/infinitive form
- [ ] Body is lean (1,500–2,000 words ideal, <5k max)
- [ ] Detailed content moved to `references/`
- [ ] Examples are complete and working
- [ ] Scripts are executable and documented

**Progressive Disclosure:**
- [ ] Core concepts in SKILL.md
- [ ] Detailed docs in `references/`
- [ ] Working code in `examples/` or `scripts/`
- [ ] SKILL.md references these resources explicitly

**Testing:**
- [ ] Skill triggers on expected user queries
- [ ] Content is helpful for intended tasks
- [ ] No duplicated information across files
- [ ] References load when needed

## Writing Style Requirements

### Imperative/Infinitive Form (Body)

Write using verb-first instructions, not second person.

**Correct (imperative):**
```
To create a hook, define the event type.
Configure the MCP server with authentication.
Validate settings before use.
```

**Incorrect (second person):**
```
You should create a hook by defining the event type.
You need to configure the MCP server.
You must validate settings before use.
```

### Third-Person in Description (Frontmatter)

**Correct:**
```yaml
description: This skill should be used when the user asks to "create X", "configure Y"...
```

**Incorrect:**
```yaml
description: Use this skill when you want to create X...
description: Load this skill when user asks...
```

### Objective, Instructional Language

Focus on what to do, not who should do it:

**Correct:** `Parse the frontmatter using sed.`
**Incorrect:** `You can parse the frontmatter...`
