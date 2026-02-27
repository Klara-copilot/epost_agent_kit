# Phase 02: Convert epost-a11y-specialist

**Priority**: High
**Status**: Pending
**Estimated Effort**: 45 min

## Overview

Convert `packages/core/agents/epost-a11y-specialist.md` from Claude Code format to GitHub Copilot instruction format.

## Source Analysis

### Original Agent (Claude Code)

```markdown
---
name: epost-a11y-specialist
model: sonnet
color: "#E63946"
description: (ePost) Unified multi-platform accessibility orchestrator...
skills: [core, ios/accessibility]
memory: project
permissionMode: default
---

# Multi-Platform Accessibility Agent
[content...]
```

### Claude-Specific Fields to Remove

| Field | Reason |
|-------|--------|
| `model: sonnet` | GitHub Copilot doesn't support model selection |
| `color: "#E63946"` | UI-specific, not applicable |
| `memory: project` | Claude-specific memory scope |
| `permissionMode: default` | Claude-specific permission model |
| `skills: [core, ios/accessibility]` | Convert to inline reference |

### Content to Preserve

- Platform detection table
- When to Invoke section
- Knowledge Base references
- Operating Modes table
- Shared Constraints
- Related Documents (adapt paths)

## Target Format (GitHub Copilot)

File: `packages/github-copilot/agents/epost-a11y-specialist.instructions.md`

```markdown
---
applyTo: "**/*.{swift,kt,tsx,jsx,html}"
description: "Unified multi-platform accessibility orchestrator for iOS, Android, and Web. WCAG 2.1 AA compliance."
---

# Multi-Platform Accessibility Agent

**Purpose:** Unified accessibility orchestrator for iOS, Android, and Web — guidance, auditing, and fixing across all platforms.

## Platform Detection

Detect platform from file types, command context, or user description:

| Signal | Platform | Delegation |
|--------|----------|------------|
| `.swift`, `.xib`, SwiftUI | **iOS** | Use iOS accessibility patterns + XcodeBuildMCP |
| `.kt`, Compose | **Android** | Use Compose a11y patterns |
| `.tsx`, `.jsx`, HTML, ARIA | **Web** | Use ARIA, keyboard nav, screen readers |
| No clear signal | **Ask user** | Prompt for platform context |

## Operating Modes

| Mode | Activated By | Output | Writes Files? |
|------|-------------|--------|---------------|
| **Guidance** | Direct questions | Human-readable code examples | No |
| **Audit** | "audit accessibility" | Strict JSON only | **No — read-only** |
| **Fix** | "fix accessibility" | JSON status + code edits | Yes |

**When auditing, operate in read-only mode: do NOT modify files. Output valid JSON only.**

## Shared Constraints

- Follow WCAG 2.1 AA standards strictly
- Provide actionable suggestions in every mode
- For platform-specific issues: delegate to platform patterns

## Related Instructions

- `ios-accessibility.instructions.md` — iOS-specific accessibility rules (if installed)
- `web-accessibility.instructions.md` — Web ARIA patterns (if installed)
```

### Key Conversion Changes

| Original Field | Copilot Equivalent |
|----------------|-------------------|
| `name: epost-a11y-specialist` | Filename: `epost-a11y-specialist.instructions.md` |
| `description: ...` | `description: "..."` in frontmatter |
| `skills: [core, ios/accessibility]` | `applyTo: "**/*.{swift,kt,tsx,jsx,html}"` + Related Instructions section |
| `model: sonnet` | **Remove** — not applicable |
| `color: "#E63946"` | **Remove** — not applicable |
| `memory: project` | **Remove** — not applicable |
| `permissionMode: default` | **Remove** — not applicable |

## Implementation Steps

### Step 1: Create Instruction File

Create `packages/github-copilot/agents/epost-a11y-specialist.instructions.md`:

1. Remove YAML frontmatter
2. Add description blockquote header
3. Add skills reference blockquote
4. Convert all content sections
5. Add GitHub Copilot usage section
6. Adapt skill paths to instruction paths

### Step 2: Adapt Related Documents Section

Original:
```markdown
- `.claude/skills/ios/accessibility/SKILL.md`
```

Adapted:
```markdown
- `.github/instructions/ios-accessibility.instructions.md` (if installed)
```

### Step 3: Add Copilot-Specific Activation Guide

Since Copilot doesn't have slash commands, add usage context:
- When this instruction applies
- How to invoke accessibility review
- Platform-specific guidance

## Conversion Rules Applied

| Rule | Application |
|------|-------------|
| Keep frontmatter | Transform, don't remove |
| `name` → filename | `epost-a11y-specialist.instructions.md` |
| `description` → frontmatter | Keep as `description: "..."` |
| Add `applyTo` | `"**/*.{swift,kt,tsx,jsx,html}"` for multi-platform |
| Skills → Related Instructions | Reference other instruction files |
| Remove Claude-specific | `model`, `color`, `memory`, `permissionMode` |
| Commands → context | Replace `/ios:a11y:*` with natural language triggers |

## Success Criteria

- [ ] `epost-a11y-specialist.instructions.md` created
- [ ] No YAML frontmatter
- [ ] Description as blockquote header
- [ ] Skills referenced inline
- [ ] Copilot usage section added
- [ ] All original content preserved

## Files to Create

| File | Action |
|------|--------|
| `packages/github-copilot/agents/epost-a11y-specialist.instructions.md` | Create |

## Next Phase

→ [Phase 03: Create Conversion Templates](phase-03-templates.md)
