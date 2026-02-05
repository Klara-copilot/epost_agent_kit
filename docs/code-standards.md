# Code Standards & Guidelines

## Overview

This document defines the coding conventions, file organization principles, and quality guidelines for the epost_agent_kit project. These standards apply across agents, skills, commands, CLI implementation, and all project code.

**Guiding Principles**: YAGNI (You Aren't Gonna Need It), KISS (Keep It Simple, Stupid), DRY (Don't Repeat Yourself)

---

## File Naming Conventions

### Agent Files

**Format**: kebab-case with platform prefix

```
.claude/agents/
├── orchestrator.md          # Global agent
├── architect.md             # Global agent
├── web/
│   ├── implementer.md       # web/implementer
│   ├── tester.md            # web/tester
│   └── designer.md          # web/designer
├── ios/
│   ├── implementer.md       # ios/implementer
│   ├── tester.md            # ios/tester
│   └── simulator.md         # ios/simulator
└── android/
    ├── implementer.md       # android/implementer
    └── tester.md            # android/tester
```

**Rules**:
- Global agents in root `.claude/agents/`
- Platform agents in `.claude/agents/{platform}/`
- Names match agent frontmatter `name:` field
- Lowercase, no special characters (except hyphens)

### Skill Files

**Format**: kebab-case grouped by category

```
.claude/skills/
├── planning/
│   └── SKILL.md             # planning skill
├── research/
│   └── SKILL.md             # research skill
├── web/
│   ├── nextjs/
│   │   └── SKILL.md         # web/nextjs
│   ├── frontend-development/
│   │   └── SKILL.md
│   └── shadcn-ui/
│       └── SKILL.md
├── ios/
│   └── ios-development/
│       └── SKILL.md
└── shared/
    ├── databases/
    │   └── SKILL.md
    └── docker/
        └── SKILL.md
```

**Rules**:
- Each skill in its own directory
- Main skill file always named `SKILL.md`
- Directory name matches skill identifier
- Group by platform under subdirectories
- Shared skills under `shared/` directory

### Command Files

**Format**: kebab-case by category

```
.claude/commands/
├── core/
│   ├── cook.md              # /cook command
│   ├── test.md              # /test command
│   ├── debug.md             # /debug command
│   ├── plan.md              # /plan command
│   └── ask.md               # /ask command
├── design/
│   └── fast.md              # /design:fast command
├── docs/
│   ├── init.md
│   └── update.md
├── fix/
│   ├── ci.md
│   ├── fast.md
│   └── hard.md
└── git/
    ├── commit.md
    ├── pr.md
    └── push.md
```

**Rules**:
- Category as directory (core, design, docs, fix, git, etc.)
- Filename matches command name
- Command invoked as `/{category}:{name}` or `/name` (if core)

### CLI Source Files

**Format**: kebab-case for modular structure

```
src/
├── index.ts                 # CLI entry point
├── commands/
│   ├── install.ts           # npx epost-kit install
│   ├── list.ts              # npx epost-kit list
│   ├── create.ts            # npx epost-kit create
│   └── validate.ts          # npx epost-kit validate
├── core/
│   ├── discovery.ts         # Component discovery
│   ├── installer.ts         # Installation logic
│   ├── converter.ts         # Format conversion
│   ├── resolver.ts          # Dependency resolution
│   ├── targets.ts           # Target path definitions
│   └── lock.ts              # Installation tracking
└── templates/
    ├── agent-template.md
    ├── skill-template.md
    └── command-template.md
```

**Rules**:
- One module per file (single responsibility)
- Related modules grouped in directories
- Max 200 lines per file
- Clear, descriptive names

---

## Code Organization Principles

### Global vs Platform Organization

**Global Components** (same for all platforms):
```
.claude/
├── agents/
│   ├── orchestrator.md      # ← Global
│   ├── architect.md         # ← Global
│   ├── implementer.md       # ← Global (delegates)
│   └── reviewer.md          # ← Global (delegates)
├── skills/
│   ├── planning/SKILL.md    # ← Global
│   ├── research/SKILL.md    # ← Global
│   └── shared/...           # ← Shared
└── rules/
    └── *.md                 # ← All global
```

**Platform-Specific Components** (web/, ios/, android/):
```
.claude/agents/web/
├── implementer.md           # ← Web only
├── tester.md                # ← Web only
└── designer.md              # ← Web only

.claude/skills/web/
├── nextjs/SKILL.md          # ← Web only
├── frontend-development/    # ← Web only
└── shadcn-ui/SKILL.md       # ← Web only
```

**Organization Benefits**:
- Clear ownership and specialization
- Easy to add new platforms (copy template structure)
- Shared components reusable across platforms
- No cross-platform dependencies

### Size Limits

Enforce these limits to maintain code clarity and IDE performance:

| Component | Max Lines | Rationale |
|-----------|-----------|-----------|
| Agent prompts | 200 | IDE startup performance, clarity |
| Skill files | 300 | Self-contained, focused |
| CLI modules | 200 | Maintainability, testing |
| Commands | 150 | Split larger into skills |
| Documentation | 800 | Split into related topics |
| CLAUDE.md | 400 | Split rules as needed |

**When exceeding limits**:
1. Identify logical split points
2. Move content to related file
3. Cross-link between files
4. Update index/navigation

**Example Split**:
```
# Before: authentication-guide.md (450 lines, exceeds 400)

# After:
├── authentication-guide/
│   ├── index.md           (100 lines - overview + links)
│   ├── setup.md           (200 lines - configuration)
│   ├── api-reference.md   (150 lines - API details)
│   └── troubleshooting.md (100 lines - FAQ + issues)

# index.md links to all parts
```

### Module Composition Pattern

**For larger features, use composition over inheritance**:

```typescript
// Instead of: class Agent extends BaseAgent { ... }
// Use: function createAgent(config) { ... }

// Example: Composable skill creator
function createSkill(options: SkillOptions): Skill {
  return {
    name: options.name,
    description: options.description,
    execute: options.handler,
    validate: createValidator(options.schema),
    format: createFormatter(options.template),
  };
}

const webSkill = createSkill({
  name: 'nextjs',
  description: 'Next.js patterns',
  handler: implementNextJS,
  schema: nextjsSchema,
  template: nextjsTemplate,
});
```

---

## Agent Prompt Standards

### Frontmatter Requirements

All agents must include YAML frontmatter with required fields:

```yaml
---
name: agent-identifier
description: One-line description of what this agent does
tools: Read, Glob, Grep, Bash, Edit, Write
model: inherit
---
Agent prompt content...
```

**Field Definitions**:

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `name` | Yes | string | Unique agent identifier (kebab-case) |
| `description` | Yes | string | 1-2 sentences; used for auto-delegation |
| `tools` | No | comma-separated | Allowlist of tools (defaults to all) |
| `model` | No | string | `sonnet`, `opus`, `haiku`, `inherit` |
| `color` | No | string | UI color for Claude Code |

**Valid Examples**:
```yaml
# Global orchestrator
---
name: orchestrator
description: Top-level task router and project manager
tools: Read, Glob, Grep, Bash
model: inherit
---

# Platform agent
---
name: web/implementer
description: Implements features in Next.js and React
tools: Read, Glob, Grep, Bash, Edit, Write
model: sonnet
color: blue
---
```

### Prompt Structure

Every agent prompt should follow this structure:

```markdown
---
[frontmatter]
---

## Role
Clear one-sentence statement of what this agent does.

## Key Responsibilities
- Responsibility 1
- Responsibility 2
- Responsibility 3

## When You Delegate
If this is a delegating agent:
- Detect platform from [file types, project markers]
- Delegate to [platform/agent] when [condition]
- Example: "User asks to implement feature" -> "Delegate to web/implementer"

## Tools & Constraints
- Can use: [tools listed in frontmatter]
- Cannot: [restrictions]
- Always: [required behavior]

## Output Format
What should the user expect?
- Code: [format/language]
- Documentation: [style/structure]
- Errors: [how to report issues]

## Examples
[1-2 concrete examples of typical requests]
```

**Length Target**: 150-200 lines maximum

### Quality Checklist

Before finalizing an agent:
- [ ] Frontmatter complete and valid
- [ ] Name matches identifier (kebab-case)
- [ ] Description fits in 1-2 sentences
- [ ] Role section is clear and concise
- [ ] Delegation pattern documented (if applicable)
- [ ] Tools match capabilities
- [ ] Output format explicitly stated
- [ ] Examples provided for common tasks
- [ ] Prompt under 200 lines

---

## Skill File Standards

### Skill Frontmatter

```yaml
---
name: skillname
description: What this skill does
platform: global | web | ios | android | shared
category: planning | research | development | testing
---
```

**Field Definitions**:

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `name` | Yes | string | Skill identifier (matches directory) |
| `description` | Yes | string | One-line description |
| `platform` | Yes | string | `global`, `web`, `ios`, `android`, or `shared` |
| `category` | Yes | string | `planning`, `research`, `development`, `testing`, etc. |

### Skill Structure

```markdown
---
[frontmatter]
---

## Overview
What does this skill provide? (2-3 sentences)

## When to Use
What scenarios is this skill useful for? (bullet list)

## Key Concepts
- Concept 1: Brief explanation
- Concept 2: Brief explanation

## Usage Examples
### Example 1: Common scenario
[Step-by-step or code example]

### Example 2: Advanced scenario
[Step-by-step or code example]

## Best Practices
- Practice 1
- Practice 2
- Practice 3

## Common Issues & Solutions
| Issue | Solution |
|-------|----------|
| Issue 1 | How to fix it |
```

**Length Target**: 200-300 lines

---

## Command File Standards

### Command Frontmatter (Optional)

```yaml
---
description: What this command does
agent: agent-name
category: core | design | docs | fix | git
---
```

### Command Structure

```markdown
---
description: Brief command description
agent: implementer
category: core
---

## Purpose
What does this command do? When should you use it?

## Required Context
What information does the user need to provide?
- [requirement 1]
- [requirement 2]

## Execution Steps
1. Analyze request
2. Determine approach
3. Execute
4. Validate

## Output
What will the user get? Format? Structure?

## Examples
- `/cook` - Basic cooking
- `/web:cook` - Web-specific
```

**Length Target**: 100-150 lines

---

## CLI Implementation Standards

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "outDir": "./dist"
  }
}
```

### Module Pattern

```typescript
// ✓ Good: Single responsibility
export function discoverComponents(path: string): Component[] {
  // Implementation
}

export function validateComponent(component: Component): boolean {
  // Implementation
}

// ✗ Avoid: God module with too many responsibilities
export function doEverything(input: any): any {
  // Hundreds of lines
}
```

### Error Handling

```typescript
// ✓ Good: Specific error handling
try {
  const components = await discoverComponents(rootPath);
  if (components.length === 0) {
    throw new DiscoveryError('No components found');
  }
  return components;
} catch (error) {
  if (error instanceof DiscoveryError) {
    console.error(`Discovery failed: ${error.message}`);
  } else {
    console.error('Unexpected error:', error);
  }
  throw error;
}

// ✗ Avoid: Silent failures or too broad catch
try {
  // risky code
} catch (e) {
  // swallow error
}
```

### Testing Standards

```typescript
// ✓ Good: Clear test cases
describe('discoverComponents', () => {
  it('should find components in valid directory', async () => {
    const components = await discoverComponents('./test-fixtures');
    expect(components).toHaveLength(3);
    expect(components[0].name).toBe('test-agent');
  });

  it('should throw error for non-existent directory', async () => {
    await expect(discoverComponents('./non-existent')).rejects.toThrow(
      'Directory not found'
    );
  });
});

// Target: 80% coverage minimum
```

---

## Markdown Documentation Standards

### Headers

Use consistent header hierarchy:

```markdown
# Main Title (H1 - one per file)

## Section (H2)

### Subsection (H3)

#### Detail (H4)
```

**Never**: Skip levels (H1 to H3) or use multiple H1s

### Code Blocks

Specify language for syntax highlighting:

```markdown
# TypeScript
\`\`\`typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
\`\`\`

# Bash
\`\`\`bash
npx epost-kit install --target cursor
\`\`\`

# YAML
\`\`\`yaml
---
name: orchestrator
description: Task router
---
\`\`\`
```

### Tables

Use aligned tables for organized data:

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
```

### Links

Use relative links within docs:

```markdown
# ✓ Good: Relative links
[See architecture](./system-architecture.md)
[Read overview](../README.md)

# ✗ Avoid: Absolute URLs within same repo
[See architecture](https://github.com/Klara-copilot/epost_agent_kit/blob/master/docs/system-architecture.md)
```

---

## Documentation Requirements

### Every Component Needs

1. **README or overview** - What is it? When to use?
2. **Installation instructions** - How to add/enable?
3. **Usage examples** - How to use it?
4. **API reference** - What are the options/parameters?
5. **Troubleshooting** - Common issues and solutions

### Documentation Checklist

Before marking documentation complete:
- [ ] All functions/classes documented
- [ ] All parameters explained
- [ ] Return types specified
- [ ] Examples provided
- [ ] Edge cases mentioned
- [ ] Links verified and working
- [ ] No broken references
- [ ] Consistent terminology used

---

## Code Review Guidelines

### What to Check

1. **Correctness**: Does it work as intended?
2. **Clarity**: Is it easy to understand?
3. **Consistency**: Follows project standards?
4. **Completeness**: All cases handled?
5. **Performance**: Reasonable efficiency?
6. **Security**: No vulnerabilities?
7. **Testing**: Adequate test coverage?
8. **Documentation**: Well documented?

### Review Comments Template

```markdown
## What's Great
- Clear separation of concerns
- Good error handling
- Comprehensive tests

## Suggestions for Improvement
- Consider extracting function X (too long)
- Add example for edge case Y
- Document why we chose Z approach

## Must Fix Before Merge
- Missing parameter documentation
- Test coverage below 80%
- TypeScript errors

Approved with suggestions
```

---

## Pre-Commit Checklist

Before committing code:

- [ ] No syntax errors (TypeScript compiles)
- [ ] No linting errors (ESLint passes)
- [ ] Tests pass (npm test)
- [ ] Documentation updated
- [ ] No console.log statements (except CLI output)
- [ ] No commented code (unless explaining why)
- [ ] Commit message is clear and descriptive
- [ ] No secrets committed (.env, API keys, etc.)

---

## Performance Guidelines

### Agent Performance

- **Startup**: Agents load quickly (< 500ms)
- **Execution**: Tasks complete in reasonable time
- **Context**: Use Read tool efficiently (don't read huge files unnecessarily)

### CLI Performance

- **Installation**: `npx epost-kit install` completes in < 30 seconds
- **Discovery**: Scanning components takes < 5 seconds
- **Validation**: Verification takes < 10 seconds

### Scalability

- **Agents**: Support 100+ agents without performance degradation
- **Skills**: Support 50+ skills per platform
- **Commands**: Support 200+ commands

---

## Security Guidelines

### Credential Handling

- Never store secrets in agent prompts
- Use environment variables for sensitive data
- Document required environment variables
- CLI should warn about .env file handling

### Tool Restrictions

- Global agents: Read, Glob, Grep, Bash (restricted)
- Platform agents: Inherit + Edit, Write (as needed)
- git-manager: Git operations only
- No agent runs arbitrary shell commands without validation

### Validation

- All user inputs validated before use
- Component specifications validated against schema
- Installation verified before applying

---

## Accessibility Requirements

### Agent Responses

- Clear, simple language
- Structured output (lists, tables)
- No wall-of-text responses
- Descriptive error messages

### Documentation

- Headings for structure
- Alt text for diagrams/images (where applicable)
- High contrast text
- Links with descriptive text (not "click here")

---

## Related Standards

See also:
- **[.claude/rules/primary-workflow.md]** - Development workflow
- **[.claude/rules/development-rules.md]** - General development
- **[.claude/rules/orchestration-protocol.md]** - Agent delegation
- **[docs/system-architecture.md](system-architecture.md)** - Architecture patterns

---

**Last Updated**: 2026-02-05
**Owner**: Phuong Doan
**Status**: Active
