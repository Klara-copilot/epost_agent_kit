---
title: Scout Command
description: (ePost) ⭑.ᐟ Search codebase for files related to a topic
agent: epost-scout
argument-hint: 🔍 [search query or keywords]
---

# Scout Command

Fast codebase search and file discovery.

## Usage

```
/scout [search query]
/scout [keywords related to feature]
/scout [component or module name]
```

## Your Process

1. Parse search query
2. Search for relevant files using:
   - Glob patterns for file names
   - Grep for content matching
   - Context-aware file prioritization

3. For each match:
   - Show file path
   - Show relevance score
   - Provide context snippet
   - Link related files

4. Prioritize by:
   - Exact name matches
   - Import/export statements
   - Architecture relevance
   - Recent modifications

## Output

- List of relevant files with paths
- Relevance scores
- Context snippets (5-10 lines)
- File type and size
- Related files network map

## Common Use Cases

- Finding where a function is used
- Locating all tests for a component
- Discovering related modules
- Mapping feature surface area
