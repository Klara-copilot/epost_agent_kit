---
name: documentation-standards
description: Formatting and structure requirements for all documentation.
---

# Documentation Standards

## Purpose

Standards for creating, formatting, and maintaining documentation files to ensure consistency, scannability, and token efficiency.

## Table of Contents

- [Formatting Rules](#formatting-rules)
- [Required Structure](#required-structure)
- [Content Guidelines](#content-guidelines)
- [Size Limits](#size-limits)

## Formatting Rules

> These rules apply to documentation files. Agent response formatting is defined in `.claude/output-styles/`.

**Style:**
- **Tables** not paragraphs
- **Bullets** not sentences
- **Keywords** not full explanations
- **Numbers** not words ("16px" not "sixteen pixels")

**Target:**
- Keep component docs under 3KB each
- Short, keyword-rich, scannable content
- Token-efficient writing

## Required Structure

**All documentation files must include:**

1. **Purpose** (top of file)
   - Brief description of file contents

2. **Table of Contents**
   - Anchored links (`#section-name`)

3. **Related Documents**
   - Relative paths to related files
   - Brief description of relationship

4. **Content Sections**
   - Use `##` for main sections
   - Use `###` for subsections
   - Maintain heading hierarchy

## Content Guidelines

**Documentation content:**
- Exact specs: dimensions, tokens, effects
- Cross-reference links (relative paths)
- Concrete examples or referenced files
- Avoid vague guidance

**Code examples:**
- Use code references for existing code (`startLine:endLine:filepath`)
- Use markdown code blocks for new/proposed code
- Include minimal necessary context

**Rule generation:**
- Keep rules under 500 lines
- Split large rules into composable modules
- Provide concrete examples
- Write like clear internal docs

## Size Limits

| Content Type | Limit |
|--------------|-------|
| Component docs | Under 3KB |
| Rule files | Under 500 lines |
| Memory files | Under 2KB (consolidate when exceeded) |

**When limits exceeded:**
- Split into multiple files
- Consolidate redundant information
- Remove outdated content
- Prioritize actionable information

## Related Documents

- `core/SKILL.md` — Core rules index
