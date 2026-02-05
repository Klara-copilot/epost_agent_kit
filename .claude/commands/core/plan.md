---
title: Plan Command
description: ⭑.ᐟ Create detailed implementation plans
agent: epost-architect
argument-hint: [feature description]
---

# Plan Command

Create detailed implementation plans before coding.

## Usage

```
/plan [feature description]
```

## Your Process

1. Parse the feature request
2. Spawn 3 researcher agents in parallel:
   - Best practices research (latest patterns and standards)
   - Existing codebase analysis (architecture, dependencies)
   - Dependencies check (compatibility, versions)
3. Aggregate findings and identify key insights
4. Create detailed plan with YAML frontmatter
5. Define file ownership (phase-XX-name.md format)
6. Identify success criteria
7. Save to plans/ directory with proper structure

## Plan Template

See architect.md agent for template

## Completion

Report:

- Plan created: plans/[filename].md
- Summary of research
- Implementation steps count
- Files to create/modify
- Estimated complexity
- Next: /cook plans/[filename].md
