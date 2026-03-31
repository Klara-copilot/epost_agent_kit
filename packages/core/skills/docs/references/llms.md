# LLMs Mode (`--llms`)

Generates `/llms.txt` and `/llms-full.txt` following the [llmstxt.org](https://llmstxt.org) specification. Uses the existing `docs/index.json` KB structure as the source of truth.

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--output <path>` | repo root | Directory to write llms.txt |
| `--full` | on | Also generate llms-full.txt |
| `--no-full` | off | Skip llms-full.txt |

## Spec Summary (llmstxt.org)

- `/llms.txt` — concise index: H1 title, blockquote summary, H2 sections, markdown links
- `/llms-full.txt` — full content: same structure but each link replaced with full file content inline
- Both files use markdown. No HTML.
- Sections group related docs. Links include 1-line descriptions.

## Step 1 — Discover Sources

1. Glob `**/docs/index.json` to find all KB registries
2. Read each registry. Collect entries where `type` is in: `ARCHITECTURE`, `GUIDE`, `ADR`, `FEATURE`, `PATTERN`, `CONVENTION`, `API`
3. Skip entries with `type: FINDING` (too granular) and stale entries (`updatedAt` older than 180 days)
4. Also include: `CLAUDE.md`, `README.md` (if exists at root)

## Step 2 — Build Structure

Group collected entries by `category` or `type`. Suggested sections:

| Section | Sources |
|---------|---------|
| Overview | CLAUDE.md, README.md |
| Architecture | ARCHITECTURE entries |
| Guides | GUIDE entries |
| Decisions | ADR entries |
| Conventions | CONVENTION, PATTERN entries |
| Features | FEATURE entries |
| APIs | API entries |

## Step 3 — Generate llms.txt

```markdown
# {Project Name}

> {One-paragraph project summary from CLAUDE.md or README first paragraph}

## Overview

- [CLAUDE.md](./CLAUDE.md): Project setup, agent system, platform stack
- [README.md](./README.md): Quick start and repository overview

## Architecture

- [{title}]({path}): {description}

## Guides

- [{title}]({path}): {description}

...
```

**Rules:**
- H1 = project name only
- Blockquote = 1–3 sentence summary
- Each link: `[Title](relative-path): one-line description`
- Max 80 chars per description
- Relative paths from repo root

## Step 4 — Generate llms-full.txt (if not `--no-full`)

Same structure as llms.txt but replace each link line with:
```
## {Title}

{full file content}

---
```

Append all files inline. Large files (>5000 words) → truncate with note: `[truncated — see {path} for full content]`

## Step 5 — Write Output

Write `llms.txt` (and `llms-full.txt`) to `--output` directory (default: repo root).

Print summary:
```
Generated llms.txt ({n} entries, {size})
Generated llms-full.txt ({n} entries, {size})
```

## Iron Law

- Only include docs that exist on disk right now — verify with Glob before including
- Do not invent descriptions — use the `description` field from `docs/index.json` entry or the file's first non-heading paragraph
- Relative paths only — no absolute paths, no `https://` links to local files
