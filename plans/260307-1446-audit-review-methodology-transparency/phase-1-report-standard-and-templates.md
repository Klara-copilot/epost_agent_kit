---
phase: 1
title: "Add Methodology section to report standard and templates"
effort: 1.5h
depends: []
---

# Phase 1: Report Standard & Templates

## Overview

Add a mandatory Methodology section to the common report standard, then propagate it to all 4 per-agent report templates. Consolidate existing "Files Reviewed" and "Sources Analyzed" sections into the new Methodology section.

## Tasks

### 1.1 Update `report-standard.md`

**File**: `packages/core/skills/core/references/report-standard.md`

Add Methodology as a required section in the report anatomy, positioned after Executive Summary and before the agent-specific body:

```markdown
## Methodology

### Files Scanned
- `{path/to/file}` -- {why scanned, line count}

### Knowledge Applied
- Skill: `{skill-name}` -- {what it provided}
- Reference: `{skill/references/file.md}` -- {standard/checklist used}
- Knowledge tier: {L1 docs / L2 RAG / L4 codebase grep / L5 external}

### Standards Source
- {Standard name} ({version/source}) -- e.g., "WCAG 2.1 AA (W3C)", "OWASP Top 10 2021", "klara-theme audit-standards.md v2.0"

### Coverage Gaps
- {What was unavailable or skipped} -- e.g., "RAG server unreachable, used grep fallback", "No Android checklist available yet"
- Or: "None -- full coverage achieved"
```

Add to Rules section:
- Methodology section is REQUIRED for audit and review reports
- Methodology section is RECOMMENDED for plan and research reports
- Each sub-section can be "N/A" if genuinely not applicable

### 1.2 Update code-review report template

**File**: `packages/core/skills/code-review/references/report-template.md`

- Remove standalone "Files Reviewed" section
- Add Methodology section (after Executive Summary) containing:
  - Files Scanned (replaces old Files Reviewed)
  - Knowledge Applied (skills loaded, escalation triggers)
  - Standards Source (OWASP, severity classification source)
  - Coverage Gaps

### 1.3 Update plan report template

**File**: `packages/core/skills/plan/references/report-template.md`

- Remove standalone "Sources Analyzed" section
- Add Methodology section containing:
  - Files Scanned (replaces old Sources Analyzed)
  - Knowledge Applied (skills used during planning)
  - Standards Source (planning framework, estimation model)
  - Coverage Gaps

### 1.4 Update research report template

**File**: `packages/core/skills/research/references/report-template.md`

- Rename "Sources Analyzed" to Methodology
- Add Knowledge Applied and Standards Source sub-sections
- Keep Local Files and External sub-sections under Files Scanned

### 1.5 Update test report template

**File**: `packages/core/skills/test/references/report-template.md`

- Remove standalone "Files Tested" section
- Add Methodology section containing:
  - Files Scanned (replaces old Files Tested -- test files + implementation files)
  - Knowledge Applied (test framework skills, coverage tools)
  - Standards Source (testing conventions, coverage thresholds)
  - Coverage Gaps (untested paths, skipped suites)

### 1.6 Update `code-review/SKILL.md` output format section

**File**: `packages/core/skills/code-review/SKILL.md`

Add to Output Format key requirements:
- Methodology section required (Files Scanned, Knowledge Applied, Standards Source, Coverage Gaps)

### 1.7 Update `review/references/code.md` workflow

**File**: `packages/core/skills/review/references/code.md`

Add instruction in Step 4 (Aggregate Results) or Final Report to populate Methodology section with:
- Which files each reviewer scanned
- Which edge case categories were verified
- Standards used for severity classification

## Validation

- [ ] `report-standard.md` shows Methodology in anatomy template
- [ ] All 4 report templates have Methodology section
- [ ] No duplicate sections (Files Reviewed, Sources Analyzed removed as standalone)
- [ ] Methodology sub-sections are consistent across templates
