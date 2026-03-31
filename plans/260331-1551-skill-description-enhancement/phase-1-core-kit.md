---
phase: 1
title: "Core + Kit skill descriptions"
effort: 1h
depends: []
---

# Phase 1: Core + Kit Skill Descriptions

## Context Links
- [Plan](./plan.md)
- `packages/core/skills/*/SKILL.md` — 27 skills
- `packages/kit/skills/kit/SKILL.md` — 1 skill

## Overview
- Priority: P1
- Status: Pending
- Effort: 1h
- Description: Prepend capability summary to all core and kit skill descriptions

## Formula

**Before**: `(ePost) Use when [trigger] — [detail]`
**After**: `(ePost) [Capability summary]. Use when [trigger] — [detail]`

## Files to Modify

### packages/core/skills/ (27 skills)

| Skill | Capability Summary to Prepend |
|-------|-------------------------------|
| `audit/SKILL.md` | Dispatches targeted quality audits (UI, a11y, code) to the right specialist. |
| `clean-code/SKILL.md` | Enforces Clean Code principles for naming, functions, formatting, and error handling. |
| `code-review/SKILL.md` | Reviews code for quality, style, and correctness before commit. |
| `cook/SKILL.md` | Orchestrates platform-aware feature implementation across web, iOS, Android, and backend. |
| `core/SKILL.md` | Defines operational boundaries, safety rules, and documentation standards for all agents. |
| `debug/SKILL.md` | Investigates root causes using platform-specific debugging tools and structured diagnosis. |
| `docs/SKILL.md` | Generates and maintains project documentation with structured KB workflows. |
| `error-recovery/SKILL.md` | Applies resilience patterns — retries, circuit breakers, graceful degradation — to failing operations. |
| `fix/SKILL.md` | Identifies root causes and applies targeted fixes for bugs, errors, and broken behavior. |
| `get-started/SKILL.md` | Discovers project state and delivers a structured onboarding experience for new contributors. |
| `git/SKILL.md` | Runs git workflows — commit, push, PR creation, and full ship pipeline. |
| `journal/SKILL.md` | Writes structured implementation journal entries for significant decisions and completions. |
| `knowledge/SKILL.md` | Retrieves prior decisions, internal patterns, and project context from the knowledge base. |
| `loop/SKILL.md` | Autonomously iterates on a metric — coverage, bundle size, lint errors — until a target is met. |
| `mermaidjs/SKILL.md` | Generates Mermaid diagrams — flowcharts, sequence diagrams, state machines, and architecture visualizations. |
| `plan/SKILL.md` | Produces phased implementation plans scaled to task complexity with dependency tracking. |
| `repomix/SKILL.md` | Bundles repository contents into a single file for LLM consumption or external sharing. |
| `security/SKILL.md` | Runs security analysis — STRIDE threats, OWASP Top 10, vulnerability scanning — on code or features. |
| `skill-creator/SKILL.md` | Creates, modifies, and validates Claude Code skills with eval-driven quality assurance. |
| `skill-discovery/SKILL.md` | Discovers and loads relevant skills on-demand based on platform, task, and domain signals. |
| `subagent-driven-development/SKILL.md` | Orchestrates parallel task execution with per-task subagent dispatch and two-stage review. |
| `tdd/SKILL.md` | Guides test-first development using the red-green-refactor cycle. |
| `test/SKILL.md` | Detects platform and runs the appropriate test suite with coverage reporting. |
| `thinking/SKILL.md` | Activates extended thinking for systematic hypothesis testing and deep analysis. |

### packages/kit/skills/ (1 skill)

| Skill | Capability Summary to Prepend |
|-------|-------------------------------|
| `kit/SKILL.md` | Scaffolds and manages kit content — agents, skills, hooks — with best-practice templates. |

## Implementation Steps

1. **For each skill in the table above**:
   - Read current `description:` from `packages/{pkg}/skills/{name}/SKILL.md`
   - Prepend capability summary: `(ePost) {capability}. Use when...` (keep existing trigger text)
   - Edit the `description:` field in SKILL.md frontmatter
   - Verify total length < 1024 chars

2. **Update skill-index.json**:
   - Run `node .claude/scripts/generate-skill-index.cjs` to regenerate from source
   - Verify descriptions in generated index match SKILL.md

3. **Mirror to .claude/skills/**:
   - Copy updated SKILL.md files to `.claude/skills/` equivalents (only for skills that have mirrors there)

## Todo List

- [ ] Update 27 core skill descriptions
- [ ] Update 1 kit skill description
- [ ] Regenerate skill-index.json
- [ ] Verify all descriptions < 1024 chars
- [ ] Mirror changes to .claude/skills/

## Success Criteria

- All 28 skills have capability + trigger format
- skill-index.json regenerated and consistent
- No description exceeds 1024 chars

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Description exceeds 1024 chars | Low | Trim capability summary to essentials |
| Trigger eval regression | Med | Run evals after changes if available |

## Security Considerations
- None — metadata-only changes

## Next Steps
- Phase 2: platform, domain, a11y, design-system skills
