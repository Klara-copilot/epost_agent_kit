---
name: get-started
description: "(ePost) Onboard to a project — read docs, summarize project state, route to next action"
user-invocable: true
context: fork
agent: epost-researcher
metadata:
  argument-hint: "[project path or question]"
  keywords:
    - onboard
    - get-started
    - begin
    - new-project
    - what-is-this
  agent-affinity:
    - epost-researcher
  platforms:
    - all
  connections:
    enhances: [docs-init, docs-update]
---

# Get Started

Read-only triage — detect project state, summarize what exists, route to the right tool. Never creates or modifies files.

## Arguments

- CONTEXT: $ARGUMENTS (optional — project path, specific question, or empty)

## Step 1 — Detect State

Gather signals (read-only, no file creation):

```
docs_files = Glob("docs/**/*.md")
readme = Glob("README*")
markers = Glob for: package.json, pom.xml, Package.swift, build.gradle.kts, Cargo.toml
```

Branch:
- `docs_files` not empty → Step 2a (has docs)
- `docs_files` empty → Step 2b (no docs)

## Step 2a — Has Docs

Read and summarize existing documentation:

1. **Read each doc file** (first 50 lines) — write 1-2 line summary
2. **Read project markers** (README, package.json, configs) — extract tech stack, scripts
3. **Present** → Step 3

## Step 2b — No Docs

Read project markers only (do NOT create files):

1. **Read** README, package.json/pom.xml/etc, tsconfig, Dockerfile — extract project name, tech stack, scripts, entry points
2. **Scan** directory structure (top 2 levels via `ls`)
3. **Present** → Step 3

## Step 3 — Present Insights

```markdown
## Project: {name}

**Tech Stack**: {framework} / {language} / {build tool}
**Key Commands**: `{dev}` | `{build}` | `{test}`

### Directory Structure
{top 2 levels}

### Entry Points
- {main files}

### Documentation Status
{one of:}
- "No docs/ directory found"
- List of doc files with 1-line summaries
```

## Step 4 — Route to Next Action

| Condition | Suggestion |
|-----------|-----------|
| No docs at all | "Run `/docs-init` to generate project documentation" |
| Docs exist, user wants status | "Run `/docs-update --scan` to check freshness and suggest updates" |
| All looks good | "Ready to code. Use `/cook` to start, `/plan` to plan first" |
| User has specific question | Answer from what was read, suggest `/scout` for deeper exploration |

Ask user (max 1 question) which action they want.

## Rules

- **Pure read-only** — never create, modify, or delete files
- **Fast** — lightweight scan only, < 15s
- **Delegate** — `/docs-init` creates docs, `/docs-update` maintains them
- This skill is a **triage point**, not a docs generator
