# Agent Framework & Skill Development

**Status**: Current as of v2.0.0 (2026-03-05)

## Agent Structure

### Agent File Format
Located at `packages/{package}/agents/{name}.md`

```markdown
# Agent Name

## System Prompt
[Claude's instructions for this agent]

## Skills
[Comma-separated list of skill names]

## Frontmatter (below ## Skills line)
```

### Required Frontmatter Fields

| Field | Type | Required | Example | Purpose |
|-------|------|----------|---------|---------|
| `name` | string | Yes | epost-implementer | Agent identifier |
| `color` | hex | Yes | #FF6B6B | CLI display color |
| `model` | string | Yes | claude-opus-4-6 | LLM model |
| `skills` | array | Core agents | [core, problem-solving, ...] | Skills to load |
| `permissionMode` | string | Optional | plan | Restrict permissions (plan=read-only) |
| `disallowedTools` | array | Optional | [Write, Edit] | Block tools |
| `memory` | string | Optional | epost-implementer | Memory directory |

### Frontmatter Placement

**Required**: Insert `skills:`, `memory:`, `permissionMode:`, `disallowedTools:` AFTER `model:` line:

```markdown
model: claude-opus-4-6
color: #FF6B6B
skills: [core, problem-solving, error-recovery]
permissionMode: plan
disallowedTools: [Write, Edit]
memory: epost-researcher
```

### Agent Types

#### Core Agents (10)
- **Load via `skills:` list**
- Always get core skills
- epost-orchestrator, architect, implementer, reviewer, debugger, tester, researcher, documenter, git-manager, brainstormer

#### Specialist Agents (3)
- **Optional loading** (not in `skills:` list)
- Domain/task specific
- epost-a11y-specialist, epost-kit-designer, epost-muji (design)

## Skill Bindings

### How Skills Load

```
Agent file read
    ↓
Parse frontmatter: skills: [skill1, skill2, ...]
    ↓
skill-index.json: resolve names → paths
    ↓
Load skill SKILL.md files
    ↓
Model can reference patterns, conventions, constraints
    ↓
Model-invocable skills: description + trigger words
```

### Load Order

1. **Direct dependencies** (skill extends/requires)
2. **Agent's `skills:` list** (in frontmatter order)
3. **Model-invoked** (skill description matches task)
4. **Auto-discovered** (skill-discovery protocol adds contextual skills)

### Skill Activation Rules

| Source | When | Authority |
|--------|------|-----------|
| Agent `skills:` list | Agent loads | Guaranteed |
| Skill description | Model reads description | Model chooses |
| skill-discovery | Task context detected | Suggested |
| skill-index.json | Query at load time | Metadata only |

## Skill File Structure

### Directory Layout
```
packages/{package}/skills/{skill-name}/
├── SKILL.md                 # Main skill file (required)
├── references/              # Optional: sub-topics
│   ├── pattern-1.md
│   ├── pattern-2.md
│   └── guide.md
└── assets/                  # Optional: templates, scripts
    ├── template.ts
    └── example.code
```

### SKILL.md Format

**Required sections**:
1. `# Skill Name` — Title
2. `## Purpose` — When to use (trigger conditions)
3. `## When Active` — Task signals that activate
4. `## Quick Reference` — Tables + examples
5. `## Related Documents` — Links

**CSO Discipline** (Mar 2026):
- Description = triggering conditions ONLY
- Never summarize workflow in description (causes model to skip skill body)
- Use Iron Law blocks + Anti-Rationalization tables for discipline skills

### Skill Frontmatter (if skill-invocable)

```yaml
name: skill-name
description: "Use when [condition]. [Specific triggers]."
user-invocable: true         # Include in discovery
context: fork                 # Memory isolation model
disable-model-invocation: false
extends: [parent-skill]       # Inherit from
requires: [dep-skill]         # Must load after
agent: agent-name             # Specific agent affinity
keywords: [tag1, tag2]        # Search tags
```

### NO `version:` Field
- Skill versioning is at **package level**
- All skills in package share version from package.yaml

## Frontmatter Audit (v2.0.0)

### Core Agents (10)
- ✓ All have `skills:` list
- ✓ epost-researcher + epost-reviewer: `permissionMode: plan`, `disallowedTools: [Write, Edit]`
- ✓ No `version:` field (not valid for agents/skills)

### Specialist Agents (3)
- epost-a11y-specialist, epost-kit-designer, epost-muji
- Loaded on-demand (not in core `skills:` lists)
- May have targeted skill lists

### Skill Frontmatter
- ✓ `user-invocable: false` for background skills
- ✓ `disable-model-invocation: true` for reference-only (kit-agent-development, etc.)
- ✓ No skill has `version:` field

## Common Patterns

### Discipline Skills
Behavioral guardrails (e.g., verification-before-completion, receiving-code-review):
- Iron Law block (unconditional constraint)
- Anti-Rationalization table (when people cut corners, cost analysis)
- Red Flags list (warning signs to watch)
- Reference: `packages/core/skills/subagent-driven-development/references/cso-principles.md`

### Command Skills → Flag Pattern
- **Old**: `commands/cook/deep.md` (separate command files)
- **New**: `cook` skill with `--deep`, `--fast`, `--parallel` flags
- Variant content moves to `references/` subdirectory
- Table in SKILL.md documents flag options

### Platform-Specific Skills
Naming pattern: `{platform}-{domain}` (e.g., ios-a11y, android-development, web-frontend)
- Extend base skill (e.g., ios-a11y extends a11y)
- Load via skill-discovery when platform detected
- Agent affinity set for specialist agents

## Skill Discovery Protocol

### When to Activate
Run at START of every task (skip only if trivial).

### Step 1: Detect Signals
- **Platform signals**: File extensions (.swift, .kt, .tsx), keywords
- **Task type signals**: Action verbs (cook, fix, plan, debug, test)
- **Domain signals**: Module paths, A11y tags

### Step 2: Query skill-index.json
Filter candidates:
- Skip if already loaded (in `skills:` list)
- Match by platform, keywords, agent-affinity
- Resolve dependencies (extends/requires parents first)

### Step 3: Select (Token Budget)
- Max 3 directly matched skills
- Max 15 KB total
- Rank by: platform match → agent affinity → task type → domain

### Step 4: Apply Knowledge
Integrate patterns, constraints, conventions into agent work.

**Example**: iOS task → discover ios-development, ios-ui-lib → extract patterns for SwiftUI

## Memory System

### Directory Structure
`.claude/agent-memory/{agent-name}/`

```
.claude/agent-memory/
├── epost-implementer/
│   ├── MEMORY.md             # Primary memory (≤200 lines, loaded in prompt)
│   ├── debugging.md          # Topic file: debugging patterns
│   └── patterns.md           # Topic file: code patterns
├── epost-researcher/
│   └── MEMORY.md
└── epost-git-manager/
    └── MEMORY.md
```

### MEMORY.md Rules
- ≤200 lines (truncated in prompt if longer)
- Concise, semantic (not chronological)
- Topic files linked from MEMORY.md
- Saved learnings: stable patterns, architectural decisions, key paths, solutions, user preferences

### NOT in Memory
- Session-specific context
- Incomplete information (verify before saving)
- Duplicates of CLAUDE.md instructions
- Speculative conclusions

### Update Protocol
- When user requests remember/forget → update memory directly
- When user corrects memory → fix source entry immediately
- Memories shared via git (team visibility)

## Package.yaml

### Format
```yaml
name: package-name
version: "2.0.0"
description: "Human description"
layer: 0                        # Dependency layer (0=core)
platforms: [all|ios|android|web]

dependencies:
  - package-name                # Other packages this requires

provides:
  agents:
    - agent-name
    - agent-name2
  skills:
    - skill-name
    - skill-name2
```

### Version Propagation
- Kit version: `kitVersion` in `.epost-metadata.json`
- Package versions: `version:` in each `package.yaml`
- Release tag: `v{kitVersion}` (e.g., v2.0.0)
- Artifact: `epost_agent_kit-{kitVersion}.tar.gz`

## Validation

### Pre-Release Checks
1. All agents have frontmatter (name, color, model, skills if core)
2. No `version:` field in agent/skill files
3. All skills referenced in `skills:` lists exist in skill-index.json
4. skill-index.json count matches actual skill files
5. `package.yaml` provides/agents/skills lists match actual files

### Automated Validation
GitHub Actions release workflow validates:
- package.yaml file structure
- Version consistency (.epost-metadata.json + CHANGELOG.md)
- Build success

## Related Documents

- [System Architecture](./architecture.md) — Agent delegation, package topology
- [Skill Ecosystem](./skills.md) — Complete skill catalog
- [Package Structure](./package-structure.md) — File organization
- `packages/*/package.yaml` — Package metadata
- `packages/*/skills/skill-index.json` — Skill registry
- `.claude/agents/` — Agent definitions (generated from packages/)

---

**Maintainer**: @than
**Last Updated**: 2026-03-05
**Version**: 2.0.0
