---
description: Documentation formatting, structure, and behavior standards
globs: ["**/*.md", "**/README.md", "**/AGENTS.md", "**/*.mdc"]
alwaysApply: true
---

# Documentation Behavior

## Purpose

Standards for creating, formatting, and maintaining documentation files to ensure consistency, scannability, and token efficiency.

## Table of Contents

- [Formatting Rules](#formatting-rules) → Lines 10-18
- [Required Structure](#required-structure) → Lines 20-28
- [Content Guidelines](#content-guidelines) → Lines 30-38
- [Size Limits](#size-limits) → Lines 40-45

## Related Documents

- [Core User Rules](./core-user-rules.mdc) - Foundational constraints
- [Decision Boundaries](./decision-boundaries.mdc) - Authority limits

## Formatting Rules

**Style:**
- **Tables** Not Paragraphs
- **Bullets** Not Sentences
- **Keywords** Not Full explanations
- **Numbers** Not Words ("16px" not "sixteen pixels")

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
   - Line number references (`→ Lines X-Y`)
   - Update line numbers when content changes

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

- **Component docs**: Under 3KB each
- **Rule files**: Under 500 lines each
- **Memory file**: Under 2KB (consolidate when exceeded)

**When limits exceeded:**
- Split into multiple files
- Consolidate redundant information
- Remove outdated content
- Prioritize actionable information