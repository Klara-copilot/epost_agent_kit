---
title: Ask Command
description: ⭑.ᐟ Ask questions about the codebase
agent: epost-researcher
argument-hint: [question about codebase]
---

# Ask Command

Get answers about your codebase.

## Usage

```
/ask [question]
/ask how does [feature] work?
/ask where is [component] used?
```

## Your Process

1. Parse the question
2. Activate docs-seeker skill for documentation lookup
3. Search for relevant files:
   - Use Grep tool for keyword search
   - Use Glob tool for file patterns
   - Read documentation first
4. Analyze code and architecture
5. Cross-reference with latest docs
6. Formulate comprehensive answer

## Answer Format

- Direct answer
- Relevant files with paths
- Code examples if helpful
- Line numbers for reference

## Common Questions

- How does X work?
- Where is Y used?
- What's the architecture of Z?
- Why is this implemented this way?
