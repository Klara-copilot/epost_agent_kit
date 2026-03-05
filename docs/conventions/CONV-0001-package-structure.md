# Package Structure & Source of Truth

**Status**: Current as of v2.0.0 (2026-03-05)

## CRITICAL RULE

**`packages/` is SOURCE OF TRUTH. `.claude/` is GENERATED OUTPUT.**

- **Edit files in**: `packages/{package}/agents/*.md`, `packages/{package}/skills/*/`, `packages/{package}/hooks/`, `packages/{package}/scripts/`
- **Never edit**: `.claude/` directly
- **Why**: `.claude/` is **wiped and regenerated** on every `epost-kit init` call
- **Cost**: Changes to `.claude/` are **permanently lost** on next init/reinstall

This is the #1 most expensive mistake in this project.

## Canonical Package Structure

```
packages/
├── core/                        # Layer 0: Universal agents & skills
│   ├── agents/
│   │   ├── epost-architect.md
│   │   ├── epost-brainstormer.md
│   │   ├── epost-debugger.md
│   │   ├── epost-documenter.md
│   │   ├── epost-git-manager.md
│   │   ├── epost-implementer.md
│   │   ├── epost-orchestrator.md
│   │   ├── epost-researcher.md
│   │   ├── epost-reviewer.md
│   │   └── epost-tester.md
│   ├── skills/
│   │   ├── skill-index.json
│   │   ├── core/
│   │   │   ├── SKILL.md
│   │   │   └── references/
│   │   ├── problem-solving/
│   │   │   ├── SKILL.md
│   │   │   └── references/
│   │   ├── cook/
│   │   │   ├── SKILL.md (+ --fast, --parallel flags)
│   │   │   └── references/
│   │   │       ├── cook-fast-patterns.md
│   │   │       └── cook-parallel-patterns.md
│   │   └── ... (35+ total)
│   ├── scripts/
│   │   ├── get-active-plan.cjs
│   │   └── set-active-plan.cjs
│   ├── CLAUDE.snippet.md         # Merged into repo root CLAUDE.md
│   └── package.yaml
│
├── a11y/
│   ├── agents/
│   │   └── epost-a11y-specialist.md
│   ├── skills/
│   │   ├── skill-index.json
│   │   ├── a11y/
│   │   │   ├── SKILL.md
│   │   │   └── references/
│   │   │       ├── wcag-principles.md
│   │   │       └── audit-findings-schema.md
│   │   ├── ios-a11y/
│   │   │   ├── SKILL.md
│   │   │   └── references/
│   │   │       ├── voiceover-patterns.md
│   │   │       └── ios-semantic-html.md
│   │   ├── android-a11y/
│   │   │   └── SKILL.md
│   │   │   └── references/
│   │   │       ├── talkback-patterns.md
│   │   │       └── android-content-descriptions.md
│   │   ├── web-a11y/
│   │   │   └── SKILL.md
│   │   │   └── references/
│   │   │       ├── aria-patterns.md
│   │   │       └── semantic-html.md
│   │   └── audit/
│   │       └── SKILL.md (parent skill for --a11y, --close flags)
│   └── package.yaml
│
├── kit/
│   ├── agents/
│   │   └── epost-kit-designer.md
│   ├── skills/
│   │   ├── skill-index.json
│   │   ├── kit/
│   │   │   └── SKILL.md
│   │   ├── kit-agents/
│   │   │   └── SKILL.md
│   │   ├── kit-skill-development/
│   │   │   ├── SKILL.md
│   │   │   └── references/
│   │   │       ├── cso-principles.md
│   │   │       ├── skill-authoring-guide.md
│   │   │       └── skill-structure.md
│   │   └── ... (9 total)
│   └── package.yaml
│
├── design-system/
│   ├── agents/
│   │   └── epost-muji.md
│   ├── skills/
│   │   ├── skill-index.json
│   │   ├── web-figma/
│   │   │   └── SKILL.md
│   │   ├── web-ui-lib/
│   │   │   ├── SKILL.md
│   │   │   └── references/
│   │   │       ├── components.md
│   │   │       └── design-tokens.md
│   │   └── ... (10 total)
│   └── package.yaml
│
├── platform-android/            # Not in v2.0.0 (stub)
│   └── package.yaml
├── platform-backend/            # Not in v2.0.0 (stub)
│   └── package.yaml
├── platform-ios/                # Not in v2.0.0 (stub)
│   └── package.yaml
├── platform-web/                # Not in v2.0.0 (stub)
│   └── package.yaml
└── domains/                     # Not in v2.0.0 (stub)
    └── package.yaml
```

## File Organization Rules

### Agent Files
- **Location**: `packages/{package}/agents/{name}.md`
- **Naming**: kebab-case (epost-implementer.md)
- **Format**: Markdown with YAML frontmatter
- **Required fields**: name, color, model, skills (for core agents)
- **No `version:` field** (version at package level)

### Skill Files
- **Location**: `packages/{package}/skills/{skill-name}/SKILL.md`
- **References**: `packages/{package}/skills/{skill-name}/references/*.md`
- **Assets**: `packages/{package}/skills/{skill-name}/assets/`
- **Naming**: kebab-case directory names
- **No `version:` field** (version at package level)

### Scripts
- **Location**: `packages/{package}/scripts/`
- **Naming**: kebab-case with `.cjs` extension
- **Format**: Node.js CommonJS

### Package Metadata
- **Location**: `packages/{package}/package.yaml`
- **Required fields**: name, version, description, layer, platforms, dependencies, provides
- **Parsed by**: epost-kit CLI for initialization

## Initialization Flow

### epost-kit init Sequence

```
$ epost-kit init

1. Validate packages/ structure
   ├── Each package/ has package.yaml
   ├── package.yaml has required fields
   └── Versions consistent

2. Regenerate .claude/
   ├── .claude/agents/ (from packages/*/agents/*.md)
   ├── .claude/skills/ (from packages/*/skills/*/)
   │   └── skill-index.json (regenerated)
   ├── .claude/hooks/ (from hooks/ source)
   ├── .claude/scripts/ (from packages/*/scripts/)
   ├── .claude/settings.json (merged configs)
   └── CLAUDE.md (merged from CLAUDE.snippet.md files)

3. Checksum files
   └── .epost-metadata.json updated

4. Validate result
   ├── All links valid
   ├── Checksums match
   └── Report status
```

## Key Files

### .epost-metadata.json (Version Control)
Tracks installed packages, file checksums, versions.

```json
{
  "cliVersion": "0.1.0",
  "target": "claude",
  "kitVersion": "2.0.0",
  "installedPackages": ["core", "a11y", "kit", "design-system"],
  "installedAt": "2026-03-04T20:07:17.526Z",
  "files": {
    ".claude/agents/epost-architect.md": {
      "path": ".claude/agents/epost-architect.md",
      "checksum": "cc003454...",
      "version": "2.0.0",
      "modified": false,
      "package": "core"
    }
  }
}
```

### skill-index.json (Per Package)
Metadata registry for skills in that package.

```json
{
  "generated": "2026-03-04T19:54:35.452Z",
  "version": "1.0.0",
  "count": 67,
  "skills": [
    {
      "name": "cook",
      "description": "Build/implement features",
      "keywords": ["implement", "build"],
      "platforms": ["all"],
      "agent-affinity": ["epost-implementer"],
      "connections": {
        "extends": [],
        "requires": [],
        "conflicts": [],
        "enhances": []
      },
      "path": "cook/SKILL.md"
    }
  ]
}
```

### package.yaml
Package metadata and manifest.

```yaml
name: core
version: "2.0.0"
description: "Universal agents, cross-cutting skills"
layer: 0
platforms: [all]
dependencies: []

provides:
  agents:
    - epost-orchestrator
    - epost-architect
  skills:
    - core
    - cook
    - fix
```

## Generation vs Editing

| File | Location | Editable | When |
|------|----------|----------|------|
| Agent definitions | packages/core/agents/*.md | ✓ YES | Directly |
| Skill definitions | packages/*/skills/*/SKILL.md | ✓ YES | Directly |
| Agent references | .claude/agents/*.md | ✗ NO | Copied from packages/ |
| Skill references | .claude/skills/*/ | ✗ NO | Copied from packages/ |
| skill-index.json | .claude/skills/ + packages/*/skills/ | ✗ NO (auto-generated) | On init |
| .epost-metadata.json | .epost-metadata.json | ✗ NO (auto-generated) | On init, release |
| .claude/settings.json | .claude/ | ✗ NO | Merged from package configs |
| docs/index.json | docs/ | ✓ YES | Directly |
| CLAUDE.md | ./ (root) | ✗ NO | Merged from CLAUDE.snippet.md files |

## Merge Points

### CLAUDE.md
Generated from `packages/*/CLAUDE.snippet.md` files merged during init.

```markdown
# CLAUDE.md (Root)

[epost-kit injected content]

## Project: epost_agent_kit

[packages/core/CLAUDE.snippet.md content]
[packages/a11y/CLAUDE.snippet.md content]
[packages/kit/CLAUDE.snippet.md content]
[packages/design-system/CLAUDE.snippet.md content]
```

### .claude/settings.json
Merged from package configs + hooks.

## Common Mistakes & Solutions

### Mistake 1: Editing .claude/ Directly
❌ **Bad**: Edit `.claude/agents/epost-implementer.md`
✓ **Good**: Edit `packages/core/agents/epost-implementer.md`

**Recovery**:
```bash
epost-kit init  # Regenerates .claude/
# Your .claude/ changes are lost
# Make the change in packages/ instead
```

### Mistake 2: Adding Skill Without Updating skill-index.json
❌ **Bad**: Create `packages/core/skills/my-skill/SKILL.md` manually
✓ **Good**: Create in packages/, run `epost-kit init`

**Recovery**:
```bash
epost-kit init  # Regenerates skill-index.json
```

### Mistake 3: Inconsistent Versions
❌ **Bad**: Agent has `version: 2.0.0`, package.yaml has `version: 1.5.0`
✓ **Good**: Remove `version:` field from agents/skills; use package.yaml only

**Recovery**:
```bash
# Remove version: field from all agent/skill files
# Keep version: in package.yaml only
epost-kit init
```

## Related Documents

- [System Architecture](./architecture.md) — Package topology
- [Agent Framework](./agent-framework.md) — Agent/skill frontmatter
- [Skill Ecosystem](./skills.md) — Skill catalog
- [Release Process](./release-process.md) — How versions flow through releases
- `packages/*/package.yaml` — Package manifests
- `.epost-metadata.json` — Installation metadata

---

**Maintainer**: @than
**Last Updated**: 2026-03-05
**Version**: 2.0.0

**Warning**: Changes made to `.claude/` are not persistent. Always edit source files in `packages/`.
