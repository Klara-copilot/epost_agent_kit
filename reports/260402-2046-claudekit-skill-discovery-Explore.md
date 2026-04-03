# ClaudeKit Skill Discovery & Community Skills Research

**Date**: 2026-04-02  
**Scope**: Comprehensive analysis of how claudekit implements skill discovery and community skill browsing  

---

## Executive Summary

ClaudeKit uses a **two-layer skill discovery system**:

1. **Local Index Layer** (`skills_data.yaml`) - Auto-generated catalog of bundled skills
2. **External CLI Layer** (`npx skills` via Skills CLI) - Package manager for external/community skills from GitHub/skills.sh registry

The `find-skills` skill is a **documentation/guidance skill** (not a CLI wrapper) that instructs users on how to use the external Skills CLI for discovery and installation.

---

## 1. How `find-skills` Works

### Location
- `/Users/than/Projects/claudekit/.claude/skills/find-skills/SKILL.md`
- `/Users/than/Projects/claudekit/.agents/skills/find-skills/SKILL.md` (agent version)

### What It Is
**`find-skills` is a SKILL, not a command or script.**

- **Type**: Documentation/guidance skill
- **Has Scripts**: No (no executable code)
- **Has References**: No
- **Frontmatter**:
  ```yaml
  name: ck:find-skills
  description: Helps users discover and install agent skills when they ask questions...
  argument-hint: "[capability or task description]"
  ```

### What It Does
The skill provides:
1. **User guidance** on when to use skill discovery
2. **Instructions** on how to use the external Skills CLI
3. **Search examples** and common categories
4. **Installation instructions** with command examples

---

## 2. Local Index: `skills_data.yaml`

### Location
- **Primary**: `/Users/than/Projects/claudekit/.claude/scripts/skills_data.yaml` (649 lines)
- **Copies**: 
  - `/Users/than/Projects/claudekit/scripts/skills_data.yaml` (370 lines - subset)
  - `/Users/than/Projects/claudekit/.claude/scripts/skills_data.yaml` (full list)

### What It Contains
**YAML array of skill metadata objects** with:
- `name` - Skill identifier (hyphen-case)
- `path` - Relative path to SKILL.md
- `description` - What the skill does and when to use it
- `category` - One of 10 categories: ai-ml, frontend, backend, dev-tools, database, infrastructure, multimedia, frameworks, utilities, other
- `has_scripts` - Boolean: skill has executable scripts in `scripts/` subdirectory
- `has_references` - Boolean: skill has reference docs in `references/` subdirectory
- `argument_hint` - (Optional) Command argument pattern hint

### Example Entry
```yaml
- name: ai-multimodal
  path: ai-multimodal/SKILL.md
  description: Process and generate multimedia content using Google Gemini API...
  category: ai-ml
  has_scripts: true
  has_references: true
  argument_hint: "[file-path] [prompt]"
```

### How It's Generated
**Script**: `/Users/than/Projects/claudekit/.claude/scripts/scan_skills.py`

**Process**:
1. Scans `.claude/skills/` directory recursively
2. Finds all `SKILL.md` files
3. Extracts YAML frontmatter from each skill
4. Detects `scripts/` and `references/` subdirectories
5. Categorizes skills via heuristic logic (hardcoded map + pattern matching)
6. Outputs to `.claude/scripts/skills_data.yaml` in YAML format

**Key Code Snippet** (lines 80-127 of scan_skills.py):
```python
def scan_skills(base_path: Path) -> List[Dict]:
    """Scan all skill files and extract metadata."""
    skills = []
    
    for skill_file in sorted(base_path.rglob('SKILL.md')):
        skill_dir = skill_file.parent
        skill_name = skill_dir.name
        
        # ... handle nested skills ...
        
        try:
            content = skill_file.read_text()
            frontmatter = extract_frontmatter(content)
            
            description = frontmatter.get('description', '')
            if not description:
                description = extract_first_paragraph(content)
            
            category = categorize_skill(skill_name, description, content)
            
            skill_entry = {
                'name': skill_name,
                'path': str(skill_file.relative_to(Path('.claude/skills'))),
                'description': description,
                'category': category,
                'has_scripts': (skill_dir / 'scripts').exists(),
                'has_references': (skill_dir / 'references').exists()
            }
            
            argument_hint = frontmatter.get('argument-hint', '')
            if argument_hint:
                skill_entry['argument_hint'] = str(argument_hint)
            
            skills.append(skill_entry)
        except Exception as e:
            print(f"Error processing {skill_file}: {e}")
    
    return skills
```

---

## 3. External Registry & Community Skills

### Skills CLI: `npx skills`

The Skills CLI is an **external package manager** (not part of claudekit codebase) that:
- Searches a public registry at **https://skills.sh/**
- Installs skills from GitHub repositories
- Commands:
  ```bash
  npx skills find [query]        # Search for skills interactively or by keyword
  npx skills add <package>       # Install a skill from GitHub or other sources
  npx skills check              # Check for skill updates
  npx skills update             # Update all installed skills
  ```

### Community Skill Sources
The `find-skills` documentation references:
1. **Vercel Labs** - `vercel-labs/agent-skills` (popular first-party skills)
2. **ComposioHQ** - `ComposioHQ/awesome-claude-skills` (community curated list)
3. **skills.sh Registry** - Central discovery hub

### Installation Format
External skills are installed via GitHub references:
```bash
npx skills add vercel-labs/agent-skills@vercel-react-best-practices
npx skills add <owner/repo@skill-name>
```

---

## 4. Skill Structure & SKILL.md Format

### Required Files
Each skill folder **must contain**:
- `SKILL.md` - Skill definition file (required)

### Optional Structure
```
my-skill/
  ├── SKILL.md                    # Required: Skill definition
  ├── scripts/                    # Optional: Executable scripts
  │   ├── *.py, *.sh, *.ts, etc  # Implementation files
  │   └── requirements.txt        # Python dependencies
  ├── references/                 # Optional: Reference documentation
  │   └── *.md                    # Supplementary docs
  └── assets/                     # Optional: Data files, configs, etc.
```

### SKILL.md Format

**YAML Frontmatter** (required fields):
```yaml
name: skill-name                  # Required: hyphen-case, must match directory
description: What the skill does  # Required: When and why to use it
```

**Optional Fields**:
```yaml
license: MIT                      # License identifier
argument-hint: "[param-pattern]"  # Command usage hint
allowed-tools:                    # Pre-approved tools for Claude Code
  - Bash
  - Read
  - Write
metadata:                         # Custom key-value pairs
  author: creator-name
  version: "1.0.0"
```

**Markdown Body**:
- No structural requirements
- Can contain usage guides, examples, best practices
- Extracted as "description" if YAML frontmatter doesn't include it

---

## 5. Skill Validation & Scoring

### Metadata Detection
The scanner validates:
- ✓ Frontmatter YAML is valid
- ✓ `name` field exists and matches directory name
- ✓ `description` field exists (or extracted from first paragraph)
- ✓ `scripts/` directory exists (boolean flag)
- ✓ `references/` directory exists (boolean flag)
- ✗ No version-based tracking or semantic versioning

### Categorization Logic
**Fixed Mapping** (hardcoded in lines 17-43 of scan_skills.py):
```python
EXACT_CATEGORY_MAP = {
    "find-skills": "dev-tools",
    "git": "dev-tools",
    "kanban": "dev-tools",
    "code-review": "utilities",
    "plan": "utilities",
    # ... 35+ skills with exact mappings ...
}
```

**Heuristic Fallback** (pattern matching on skill name):
- **ai-ml**: Contains 'ai-', 'gemini', 'multimodal', 'adk'
- **frontend**: Contains 'frontend', 'ui', 'design', 'aesthetic', 'threejs'
- **backend**: Contains 'backend', 'auth', 'payment'
- **infrastructure**: Contains 'devops', 'docker', 'cloudflare'
- **database**: Contains 'database', 'mongodb', 'postgresql'
- **dev-tools**: Contains 'mcp', 'skill-creator', 'repomix', 'docs-seeker'
- **multimedia**: Contains 'media', 'chrome-devtools', 'document-skills'
- **frameworks**: Contains 'web-frameworks', 'mobile', 'shopify'
- **utilities**: Contains 'debug', 'problem', 'code-review', 'planning'

### No Scoring/Ranking
- No popularity metrics
- No usage statistics
- No quality scores
- Skills are listed alphabetically within categories

---

## 6. Community Skill Concept

### Yes, Community Skills Exist
ClaudeKit **supports installing external skills** from GitHub:

**Method**:
1. User searches via `npx skills find react auth`
2. CLI returns results from skills.sh registry pointing to GitHub repos
3. User installs with `npx skills add owner/repo@skill-name`
4. Installed to user's home directory (not project-specific)

**Supported Sources**:
- GitHub repositories with SKILL.md at root or in skill folders
- Vercel Labs public skills library
- Community-contributed skills indexed by skills.sh

### No Local Registry of External Skills
- `skills_data.yaml` is **bundled/local only**
- No separate catalog of installable external skills
- External discovery happens via the external Skills CLI tool

---

## 7. What `npx skills find` Does Exactly

**Command**: `npx skills find [query]`

**Execution Flow** (inferred from documentation):
1. Sends query to **skills.sh API/registry**
2. Returns matching skills with:
   - Owner/repo path (e.g., `vercel-labs/agent-skills`)
   - Skill identifier (e.g., `@vercel-react-best-practices`)
   - URL to skills.sh landing page
3. Displays results in CLI with install command:
   ```
   vercel-labs/agent-skills@vercel-react-best-practices
   └ https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
   ```

**Return Format** (from find-skills documentation):
- Interactive mode: Prompts for query or displays top results
- Query mode: Returns skill name, GitHub URL, and install command

**Note**: The actual implementation of the Skills CLI is **external** to claudekit (not in this repo).

---

## 8. Key File Locations Summary

| Purpose | Location | Format | Generated By |
|---------|----------|--------|--------------|
| Bundled skills index | `.claude/scripts/skills_data.yaml` | YAML array | `scan_skills.py` |
| Release skills index | `scripts/skills_data.yaml` | YAML array (subset) | Manual copy or build process |
| Skill discovery guide | `.claude/skills/find-skills/SKILL.md` | Markdown with YAML frontmatter | Manual authoring |
| Scanner logic | `.claude/scripts/scan_skills.py` | Python 3 | Bundled in repo |
| Skill spec | `.claude/skills/agent_skills_spec.md` | Markdown documentation | Manual authoring |

---

## 9. Findings & Answers to Research Questions

### Q1: Is `find-skills` a skill, command, or script?
**Answer**: **A skill** — specifically, a documentation/guidance skill with no executable code. It lives in `.claude/skills/find-skills/SKILL.md` and teaches users how to use the external Skills CLI.

### Q2: Does it use `skills.sh` or `scripts/skills_data.yaml`?
**Answer**: **Both, but different purposes**:
- **`scripts/skills_data.yaml`** (local index) — Lists bundled skills included in claudekit for discovery and autocomplete
- **`skills.sh`** (external registry) — Used by `npx skills find` to discover community/external skills from GitHub

### Q3: What does `skills_data.yaml` contain?
**Answer**: 
- Name, path, and description of each skill
- Category classification (10 categories)
- Flags indicating presence of scripts and reference documentation
- Argument hints for CLI usage
- **No version tracking, no scoring, no usage metrics**

### Q4: How does claudekit validate or score skills?
**Answer**:
- **Validation**: Checks for valid YAML frontmatter, existence of `name`/`description` fields
- **Scoring**: **No scoring implemented** — skills are not ranked by popularity, quality, or usage
- **Categorization**: Fixed hardcoded map for 35+ high-signal skills + heuristic pattern matching for others

### Q5: Is there a community skill concept?
**Answer**: **Yes**, via the external Skills CLI. Users can:
- Search community skills: `npx skills find <query>`
- Install from GitHub: `npx skills add owner/repo@skill-name`
- Sources include Vercel Labs, ComposioHQ, and other GitHub authors

### Q6: What does `npx skills find` do exactly?
**Answer**: Queries the skills.sh registry with a keyword query and returns matching skills with GitHub URLs and install commands. (Implementation is external to claudekit.)

---

## 10. Skill Discovery Workflow

```
User asks "how do I do X?"
    ↓
Claude invokes find-skills skill
    ↓
find-skills SKILL.md documents available options:
  - Search bundled skills in .claude/scripts/skills_data.yaml
  - OR use npx skills find <query> for external skills
    ↓
If searching bundled skills:
  - Skill names, categories, descriptions available
  - Use argument-hint for usage pattern
    ↓
If searching external skills:
  - npx skills find <query> → queries skills.sh
  - Returns GitHub repo references
  - Install with: npx skills add owner/repo@skill-name
```

---

## Key Design Observations

1. **Decoupled Architecture**: Local skill catalog (YAML) separate from external CLI tool (npx skills)
2. **No Single Authority**: Both bundled and community skills coexist; users choose discovery method
3. **Lightweight Validation**: Only checks frontmatter validity; no semantic validation
4. **Category-First Browsing**: Categorization heuristic enables organized discovery
5. **Script Detection**: `has_scripts` flag allows distinguishing reference-only from executable skills
6. **GitHub-Native**: External skills leverage GitHub as distribution infrastructure
7. **Manual Index**: `skills_data.yaml` is regenerated by `scan_skills.py`; not dynamic

---

## References

- **Skill Discovery Script**: `/Users/than/Projects/claudekit/.claude/scripts/scan_skills.py`
- **Local Index**: `/Users/than/Projects/claudekit/.claude/scripts/skills_data.yaml`
- **Skill Format Spec**: `/Users/than/Projects/claudekit/.claude/skills/agent_skills_spec.md`
- **Find-Skills Guide**: `/Users/than/Projects/claudekit/.claude/skills/find-skills/SKILL.md`
- **Skills Documentation**: `/Users/than/Projects/claudekit/guide/SKILLS.md`
- **External Registry**: https://skills.sh/

