---
name: scout
description: "(ePost) Explore codebase — find files, trace patterns, search across platforms"
user-invokable: true
context: fork
agent: Explore  # Claude Code built-in subagent type
metadata:
  argument-hint: "[search query]"
---

# Scout — Codebase Exploration

Search the codebase for files, patterns, and architecture insights. Auto-detects platform from query context.

## Query

<query>$ARGUMENTS</query>

## Instructions

1. **Parse query** — identify what the user is looking for (files, patterns, architecture, dependencies)
2. **Detect platform** — from query keywords, file extensions, or explicit prefix (`web:`, `ios:`, `android:`)
3. **Search** — use Glob, Grep, Read in parallel for fast results
4. **Synthesize** — deduplicate, group by platform/category, rank by relevance
5. **Report** — concise file list with brief context per file

## Examples

- `/scout auth flow` — find authentication-related files across all platforms
- `/scout web: API routes` — find web API route handlers
- `/scout ios: navigation` — find iOS navigation/routing code
- `/scout where is the user model` — locate user model definitions
