# CLI Distribution Patterns Research

Created by Phuong Doan | 2026-02-05

---

## 1. Commander.js Patterns

### Program Setup
```javascript
const { Command } = require('commander');
const program = new Command();
program.name('epost-skills').description('Manage Claude Code skills').version('0.1.0');
```

### Subcommand Pattern
```javascript
program
  .command('install')
  .description('Install skills into .claude/skills/')
  .argument('[skills...]', 'skill names to install (default: all)')
  .option('-g, --global', 'install to ~/.claude/skills/')
  .option('-f, --force', 'overwrite existing skills')
  .option('--dry-run', 'show what would be installed')
  .action((skills, options) => { /* handler */ });
```

### Key Features
- Auto-generated `--help` from descriptions
- Default `help` subcommand when subcommands exist
- Boolean flags (`--force`) and value options (`-s, --separator <char>`)
- Variadic arguments (`<strings...>`)
- `.argument()` for positional args, `.option()` for flags
- `.action(callback)` receives (args, options, command)
- `program.parse()` must be called to trigger parsing

### Recommended Subcommands for This Project
- `install [skills...]` - copy skills to project/global
- `list` - show available skills
- `init` - scaffold .claude/skills/ directory
- `update` - update installed skills to latest

---

## 2. npx Distribution

### package.json bin Configuration
```json
{
  "name": "@anthropic/epost-skills",
  "version": "0.1.0",
  "bin": {
    "epost-skills": "./bin/cli.js"
  },
  "files": ["bin/", "skills/", "lib/"],
  "engines": { "node": ">=18" }
}
```

### bin Entry Point (`bin/cli.js`)
```javascript
#!/usr/bin/env node
require('../lib/cli.js');
```
- Shebang line required for unix execution
- `files` array controls what gets published to npm
- `engines` field enforces Node version

### npx Execution Flow
1. `npx @anthropic/epost-skills install` checks local `node_modules/.bin/` first
2. Falls back to npm registry, downloads temp package, executes
3. No global install required - ideal for one-off or infrequent use

### Publishing Requirements
- `npm login` + `npm publish --access public` (for scoped packages)
- Semantic versioning: MAJOR.MINOR.PATCH
- `prepublishOnly` script for build step
- `"type": "module"` if using ESM

---

## 3. File Discovery / Installation Patterns

### Convention-Based Discovery
```javascript
// Discover skills from package's own skills/ directory
const skillsDir = path.join(__dirname, '..', 'skills');
const skills = fs.readdirSync(skillsDir)
  .filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory())
  .filter(f => fs.existsSync(path.join(skillsDir, f, 'SKILL.md')));
```

### Target Resolution
```javascript
// Project-level (default)
const projectTarget = path.join(process.cwd(), '.claude', 'skills');
// Global
const globalTarget = path.join(os.homedir(), '.claude', 'skills');
```

### Copy Strategy
- `fs.cpSync(src, dest, { recursive: true })` (Node 16.7+)
- Check existence before overwrite; require `--force` flag
- Preserve directory structure: `skills/my-skill/` -> `.claude/skills/my-skill/`
- Skip hidden files and `node_modules`

### Lockfile / Versioning
- Not needed for simple file copy approach
- Version tracked via package.json version of the npm package
- Optional: write `.epost-skills-version` marker file after install

---

## 4. Cross-Platform File Operations

### Node.js fs APIs
```javascript
import { cpSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Recursive copy (Node 16.7+)
cpSync(src, dest, { recursive: true });

// Safe mkdir
mkdirSync(dest, { recursive: true });
```

### Frontmatter Preservation During Conversion
```javascript
// Parse YAML frontmatter
const content = readFileSync(file, 'utf-8');
const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (fmMatch) {
  const frontmatter = fmMatch[1]; // YAML block
  const body = fmMatch[2];        // Markdown body
  // Transform body, preserve frontmatter
  writeFileSync(dest, `---\n${frontmatter}\n---\n${transformedBody}`);
}
```

### Cross-Platform Considerations
- Use `path.join()` / `path.resolve()` (never hardcode `/` or `\`)
- `os.homedir()` for `~` expansion
- `process.cwd()` for working directory
- `fs.cpSync` handles platform differences internally
- Use `node:fs` and `node:path` prefixes (Node 16+)

---

## 5. SKILL.md Specification

### Required Structure
```yaml
---
name: skill-name
description: What it does and when to use it.
---

# Skill Name

Markdown instructions for Claude follow here.
```

### Frontmatter Fields
| Field | Required | Constraints |
|---|---|---|
| `name` | Yes | lowercase, hyphens, numbers only; max 64 chars; must match directory name |
| `description` | Yes | max 1024 chars; include "what" + "when to use" |
| `allowed-tools` | No | comma-separated tool list (e.g., `Read, Grep, Glob`) |

### Naming Rules
- Pattern: `/^[a-z0-9-]+$/`, max 64 chars
- Directory name must match `name` field exactly
- Good: `pdf-processor`, `git-commit-helper`
- Bad: `PDF_Processor`, `My Skill!`

### Directory Structure
```
.claude/skills/
  skill-name/
    SKILL.md          # Required
    reference.md      # Optional - detailed docs
    examples.md       # Optional - usage examples
    scripts/          # Optional - helper scripts
    templates/        # Optional - file templates
```

### Locations
- **Project**: `.claude/skills/` (committed to git, shared with team)
- **Personal**: `~/.claude/skills/` (user-specific, not shared)

### Description Best Practices
- Formula: `[What it does] + [When to use it] + [Key triggers]`
- Include file extensions, operation verbs, user phrases
- Add "Use when..." clause for discovery matching

### Validation Checklist
- SKILL.md exists in skill directory
- YAML frontmatter starts on line 1 with `---`
- `name` matches directory name, follows naming pattern
- `description` is non-empty, under 1024 chars
- Valid YAML (no tabs in frontmatter, correct indentation)

---

## Key Decisions / Recommendations

1. **Use Commander.js** - mature (193 code snippets in Context7), auto-help, subcommand support
2. **Flat file copy** approach - no lockfile needed, `fs.cpSync` recursive handles everything
3. **Node >= 18** minimum - `fs.cpSync` stable, ESM support, LTS
4. **Scoped npm package** (`@klara-copilot/epost-skills`) for npx distribution
5. **Simple frontmatter regex** sufficient for SKILL.md parsing - no heavy YAML lib needed for validation
6. **Default to project-level install** (`.claude/skills/`), `--global` flag for `~/.claude/skills/`

## Unresolved Questions

- Should skills support version pinning or is latest-only acceptable?
- Naming: `@klara-copilot/epost-skills` vs `epost-agent-kit` for npm package?
- Should `install` command merge or replace existing skill directories?
