---
title: New Module Command
description: (ePost) Scaffold a new B2B module with knowledge files
agent: epost-web-developer
argument-hint: "[module-slug] [description]"
---

# New Module Command

Scaffold knowledge files and directory structure for a new B2B module.

## Usage

```
/web:new-module smart-letter "Letter composition and rendering"
/web:new-module my-feature "Feature description"
```

## Your Process

1. **Create knowledge file** from template at `domain/b2b/references/module-template.md`
2. **Scout luz_next** for existing files in the module directory
3. **Populate knowledge** with discovered components, hooks, services, stores
4. **Update module index** in `domain/b2b/SKILL.md`
5. Report what was created

## What Gets Created

- `.claude/skills/domain/b2b/references/{module-slug}.md` — Module knowledge file
- Module index entry in `domain/b2b/SKILL.md`

## Requirements

- Module slug (lowercase, hyphenated)
- Brief description (1 sentence)
- Access to luz_next codebase (optional, for auto-population)
