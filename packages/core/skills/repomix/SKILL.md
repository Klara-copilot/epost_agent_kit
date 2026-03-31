---
name: repomix
description: (ePost) Use when user says "pack this repo", "share codebase snapshot", or "include remote repo as context" — bundles repository contents into a single file for LLM consumption or external AI sharing
tier: core
user-invocable: true
metadata:
  keywords:
    - repomix
    - repo-pack
    - codebase-snapshot
    - llm-context
    - remote-repo
  agent-affinity:
    - epost-researcher
    - epost-fullstack-developer
  platforms:
    - all
  connections:
    enhances: [research]
---

# Repomix

Pack repository content into a single AI-optimized file. Use when you need to feed an entire codebase (or remote repo) to an LLM as context.

## When to Use

| Trigger | Action |
|---------|--------|
| Need to analyze a remote repo | `npx repomix --remote <url>` |
| Need to share local codebase as context | `npx repomix` in project root |
| Too many files to read individually | Pack, then read the output file |
| Researching how an external project works | Pack remote → read output |

## Quick Commands

```bash
# Pack current repo (outputs repomix-output.xml by default)
npx repomix

# Pack a remote GitHub repo
npx repomix --remote https://github.com/owner/repo

# Pack specific directory only
npx repomix --include "src/**"

# Pack with custom output path
npx repomix --output context.xml

# Plain text output instead of XML
npx repomix --style plain
```

## Output Formats

| Format | Flag | Best for |
|--------|------|----------|
| XML (default) | `--style xml` | Structured parsing, Claude |
| Plain text | `--style plain` | Lightweight, copy-paste |
| Markdown | `--style markdown` | Human-readable review |

## Filtering

```bash
# Exclude test files and build artifacts
npx repomix --ignore "**/*.test.*,dist/**,node_modules/**"

# Include only source files
npx repomix --include "src/**/*.ts,src/**/*.tsx"

# Use existing .gitignore patterns
npx repomix --respect-gitignore  # enabled by default
```

## Config File (repomix.config.json)

When a project is packed repeatedly, create a config to avoid re-specifying flags:

```json
{
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "removeComments": false,
    "showLineNumbers": true
  },
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": ["*.test.ts", "dist/**"]
  }
}
```

## Workflow: Research a Remote Repo

1. Pack the remote repo: `npx repomix --remote <url> --output /tmp/repo-context.xml`
2. Read the output file with the Read tool
3. Analyze patterns, extract relevant code sections
4. Apply findings to current task

## Size Limits

Large repos produce large output files. If the packed file is too large to read in one pass:
- Scope the pack: `--include "src/specific-module/**"`
- Use `--remove-comments` to reduce size
- Switch to `--style plain` (smaller than XML)
- Read the output in chunks with `offset` + `limit` parameters

## References

- `npx repomix --help` — full flag reference
- Config docs: `repomix.config.json` schema
