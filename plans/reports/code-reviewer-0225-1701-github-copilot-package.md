# Code Review: GitHub Copilot Package

## Scope
- Files: 7 files in `/packages/github-copilot/`
- LOC: ~450 lines
- Focus: New package for GitHub Copilot format support
- Scout findings: N/A (new package, no dependents)

## Overall Assessment
Well-structured package with clear conversion templates. Templates follow established patterns and provide comprehensive guidance for Claude Code to Copilot migration. Minor issues in YAML, naming conventions, and documentation completeness.

---

## Critical Issues

**None found** — Package is well-designed and ready with minor fixes.

---

## High Priority

### 1. Missing Dependency on platform-ios Package

**File:** `package.yaml` (line 7-8)

**Problem:** The converted agent `epost-a11y-specialist` references `ios/accessibility` skills which are in `platform-ios` package. The dependency declaration only includes `core`.

**Impact:** Users installing only `github-copilot` without `platform-ios` will have incomplete functionality.

**Fix:**
```yaml
dependencies:
  - core
  - platform-ios  # For ios/accessibility skills used by epost-a11y-specialist
```

**Alternative:** Remove platform-specific dependencies from the sample converted agent.

---

### 2. Missing `claude-md-template.md` in `provides.templates`

**File:** `package.yaml` (line 10-15)

**Problem:** Template `claude-md-to-copilot-instructions` is listed in `provides.templates` but the file is in `instructions/claude-md-template.md`. The naming does not match the template ID.

**Impact:** Package consumers may not find the CLAUDE.md conversion template.

**Fix:** Document the file-to-template mapping explicitly or rename for consistency.

---

## Medium Priority

### 3. Incomplete Converted Agent Content

**File:** `agents/epost-a11y-specialist.instructions.md`

**Problem:** The converted agent is missing content from the original:
- Original has "Delegation" column in Platform Detection table
- Original references specific skill files: `a11y-mode-guidance.md`, `a11y-mode-audit.md`, `a11y-mode-fix.md`
- Original has "Related Documents" section with skill file paths

**Impact:** Copilot users lose context about mode behaviors and related skills.

**Fix:** Add content adaptations noting mode behaviors are embedded.

---

### 4. Missing `.gitkeep` Reference in `files` Mapping

**File:** `package.yaml` (line 17-21)

**Problem:** The `agents/` directory contains a `.gitkeep` file which will be copied to `.github/instructions/.gitkeep`.

**Impact:** Minor — `.gitkeep` file will appear in install output.

---

### 5. File Path in `files` Mapping May Be Incorrect

**File:** `package.yaml` (line 17-21)

**Problem:** Current mapping:
```yaml
files:
  agents/: .github/instructions/
  instructions/: templates/instructions/
  prompts/: templates/prompts/
  skills/: templates/skills/
```

**Issue:** GitHub Copilot expects instructions in `.github/instructions/` and prompts in `.github/prompts/`. The templates mapping to `templates/` may not be the intended output.

**Recommendation:** Clarify whether `instructions/`, `prompts/`, `skills/` are templates for conversion or directly installed files.

---

### 6. Template Missing Example Output File Names

**File:** `instructions/agent-template.md` (line 99-132)

**Problem:** Example shows filename as `{name}.instructions.md` but does not show actual output filename.

**Fix:** Add explicit output filename in example.

---

## Low Priority

### 7. Inconsistent Description Format

**Problem:** package.yaml uses em-dash, agent frontmatter uses period. Not critical but inconsistent.

---

### 8. Missing Validation Checklist in Agent Template

**File:** `instructions/agent-template.md`

**Problem:** The `claude-md-template.md` has a validation checklist but `agent-template.md` does not.

**Recommendation:** Add validation checklist for consistency.

---

### 9. COPILOT.snippet.md Could Include More Detail

**File:** `COPILOT.snippet.md`

**Problem:** The snippet lists only one agent. For a package with 4 templates, could reference available templates.

---

## Positive Observations

1. **YAML Syntax Valid** — package.yaml parses correctly
2. **Clear Template Structure** — Each template has source format, field mapping, conversion rules, and examples
3. **Comprehensive applyTo Patterns** — Agent template includes good pattern selection guide for different platforms
4. **Good Mode/Tool Selection** — Command template explains when to use `ask`, `edit`, `agent` modes
5. **Important Note in CLAUDE.md Template** — Correctly notes that `copilot-instructions.md` is the ONLY file without frontmatter
6. **Well-Converted Agent Example** — The epost-a11y-specialist conversion demonstrates the template correctly

---

## Recommended Actions

1. **HIGH:** Add `platform-ios` to dependencies or remove platform-specific references from sample agent
2. **HIGH:** Document or fix the template name mapping (`claude-md-to-copilot-instructions` vs `claude-md-template.md`)
3. **MEDIUM:** Complete the converted agent with original content adaptations
4. **MEDIUM:** Clarify file mapping intent for templates vs installable files
5. **LOW:** Add validation checklists to agent/command/skill templates
6. **LOW:** Enhance COPILOT.snippet.md with template references

---

## Metrics

| Metric | Value |
|--------|-------|
| YAML Validation | Pass |
| Markdown Lint | Not run |
| Files Reviewed | 7 |
| Templates Quality | Good |
| Documentation | Adequate |

---

## Unresolved Questions

1. Should `instructions/`, `prompts/`, `skills/` directories contain templates or directly installable files?
2. Is `platform-ios` intended as a required dependency for the sample agent?
3. Should the converted agent include content from referenced skill files or just link to them?
4. What is the expected installation behavior — are templates copied to user project or used during conversion only?
