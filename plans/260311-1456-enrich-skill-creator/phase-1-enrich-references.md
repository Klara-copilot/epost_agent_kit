---
phase: 1
title: "Enrich kit-skill-development references"
effort: 1.5h
depends: []
---

# Phase 1: Enrich kit-skill-development references

## Tasks

### 1.1 Create description validation checklist
**Create:** `packages/kit/skills/kit-skill-development/references/description-validation-checklist.md`

Content:
- **Form**: Third-person required ("This skill should be used when..." or "Use when...")
- **Length**: Max 1024 characters
- **Dual purpose**: Must describe BOTH what the skill does AND when to use it
- **Trigger keywords**: Must include specific phrases users would say (quoted)
- **Anti-patterns table**: vague descriptions, inconsistent terminology, time-sensitive info, workflow summaries (the Description Trap)
- **Good/bad examples**: 3-4 pairs showing correct vs incorrect descriptions
- **Checklist format**: Copyable markdown checklist for quick validation

Source: Anthropic best practices + our CSO principles.

### 1.2 Add string substitution reference
**Update:** `packages/kit/skills/kit-skill-development/references/skill-structure.md`

Add new section "## String Substitutions" after "## Bundled Resource Types":
- `$ARGUMENTS` — user input after skill invocation
- `$0` — skill invocation command name
- `${CLAUDE_SESSION_ID}` — unique session identifier
- `${CLAUDE_SKILL_DIR}` — absolute path to skill directory
- `!command` — shell preprocessing (output replaces placeholder before skill loads)
- Usage examples for each

### 1.3 Clarify SKILL.md body line limit
**Update:** `packages/kit/skills/kit-skill-development/SKILL.md`

Change "Target SKILL.md body: 1,500–2,000 words." to:
"Target SKILL.md body: 150–200 lines (~1,500–2,000 words). Hard max: 500 lines. Move everything else to `references/`."

Also update `references/skill-structure.md` Level 2 section to match.

### 1.4 Update SKILL.md aspect file table
**Update:** `packages/kit/skills/kit-skill-development/SKILL.md`

Add entry to Reference Files section:
- `references/description-validation-checklist.md` — Checklist for validating skill description quality (form, length, keywords, anti-patterns)

## Files Changed

| File | Action |
|------|--------|
| `packages/kit/skills/kit-skill-development/references/description-validation-checklist.md` | CREATE |
| `packages/kit/skills/kit-skill-development/references/skill-structure.md` | UPDATE (add string substitutions) |
| `packages/kit/skills/kit-skill-development/SKILL.md` | UPDATE (line limit, aspect table) |

## Validation

- [ ] Checklist file exists and has 3+ good/bad example pairs
- [ ] String substitution section documents all 5 substitution types with examples
- [ ] Line limit stated as "150-200 lines" with "500 max" in both SKILL.md and skill-structure.md
- [ ] Aspect file table references new checklist file
