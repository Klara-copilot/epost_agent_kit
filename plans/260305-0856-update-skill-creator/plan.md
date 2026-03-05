---
id: 260305-0856-update-skill-creator
title: Update kit-skill-development with Anthropic skill-creator
status: draft
created: 2026-03-05
agent: epost-architect
complexity: moderate
estimated_effort: 3h
platforms: [all]
affects:
  - packages/kit/skills/kit-skill-development/
  - packages/kit/package.yaml
---

# Update kit-skill-development with Anthropic skill-creator

## Context

Anthropic published an official `skill-creator` skill at `github.com/anthropics/skills/tree/main/skills/skill-creator`. It provides a comprehensive eval-driven workflow for creating, testing, benchmarking, and optimizing skills. Our current `kit-skill-development` skill covers skill authoring basics but lacks:

1. **Eval/iterate loop** with subagent-based test execution
2. **Benchmark system** with quantitative metrics (pass_rate, tokens, timing)
3. **Blind comparison** and post-hoc analysis agents
4. **Description optimization** via automated eval loop (`run_loop.py`)
5. **Interactive eval viewer** (HTML-based review UI with feedback collection)
6. **Python scripts** for aggregation, grading, eval running, packaging

## Strategy

Merge Anthropic's skill-creator content INTO our existing `kit-skill-development` skill rather than adding a separate skill. Reasons:
- Our skill already covers the "create" phase well
- Anthropic's skill adds the "test/eval/improve" phase
- Combined = one skill for the full lifecycle
- Avoids duplication of skill anatomy, writing style, progressive disclosure content

**Keep our existing content**: CSO principles, persuasion principles, epost-kit extensions (frontmatter fields, connections, skill-index.json), writing style rules. These are unique to our ecosystem.

**Adopt from Anthropic**: eval workflow, benchmark system, scripts, agents, eval-viewer, description optimizer. Adapt paths and conventions to our `packages/kit/` structure.

## Phase 1: Restructure and Expand SKILL.md

**Files to modify:**
- `packages/kit/skills/kit-skill-development/SKILL.md`

**Changes:**
1. Update description to include eval/benchmark/optimize trigger phrases
2. Add "Eval & Iteration" section summarizing the test-iterate loop
3. Add "Benchmark System" section summarizing with_skill vs without_skill comparison
4. Add "Description Optimization" section for trigger accuracy improvement
5. Add "Advanced: Blind Comparison" section (brief, delegates to agents/)
6. Keep existing sections: Progressive Disclosure, Frontmatter, Connections, Writing Style, CSO, Directory Structures, Sub-Skill Routing
7. Add aspect file table entries for new references and agents

## Phase 2: Add Scripts

**Files to create (all under `packages/kit/skills/kit-skill-development/scripts/`):**
- `__init__.py` (empty)
- `aggregate_benchmark.py` — aggregate run results into benchmark stats
- `generate_report.py` — generate benchmark markdown report
- `improve_description.py` — single iteration of description improvement
- `package_skill.py` — package skill into .skill file
- `quick_validate.py` — validate skill structure
- `run_eval.py` — run single eval with claude -p
- `run_loop.py` — full description optimization loop
- `utils.py` — shared utilities

**Adaptation needed:**
- Update default paths to match epost-kit structure (`packages/*/skills/`)
- Scripts reference each other via `scripts.` module path; keep compatible
- No external dependencies (stdlib only)

## Phase 3: Add Eval Viewer

**Files to create (under `packages/kit/skills/kit-skill-development/eval-viewer/`):**
- `generate_review.py` — HTTP server + static HTML generator
- `viewer.html` — self-contained review UI template

**No adaptation needed** -- these are standalone and work as-is.

## Phase 4: Add Agent Definitions

**Files to create (under `packages/kit/skills/kit-skill-development/agents/`):**
- `grader.md` — evaluate assertions against execution transcript + outputs
- `comparator.md` — blind A/B comparison between two outputs
- `analyzer.md` — post-hoc analysis of comparison results + benchmark notes

**Adaptation needed:**
- Add note that these are subagent prompt templates, not epost-kit agents
- Reference from SKILL.md body

## Phase 5: Add References

**Files to create/update:**
- `packages/kit/skills/kit-skill-development/references/schemas.md` — JSON schemas for evals.json, grading.json, benchmark.json, comparison.json, etc.
- `packages/kit/skills/kit-skill-development/references/skill-eval.md` — UPDATE existing file to integrate Anthropic's richer eval workflow

**Files to create:**
- `packages/kit/skills/kit-skill-development/assets/eval_review.html` — HTML template for description optimization review UI

## Phase 6: Update Package and Indexes

**Files to modify:**
- `packages/kit/package.yaml` — no changes needed (skill name unchanged)
- Run `epost-kit init` to regenerate `.claude/` from packages

## Dependency Notes

- Scripts require Python 3.10+ (f-strings, pathlib, `|` union types)
- `run_loop.py` and `run_eval.py` require `claude` CLI tool
- No npm/pip dependencies needed
- Subagent functionality requires Claude Code (not Claude.ai)

## What NOT to Change

- `references/cso-principles.md` — our unique CSO methodology, keep as-is
- `references/persuasion-principles.md` — our persuasion framework, keep as-is
- `references/skill-authoring-guide.md` — enhance but don't replace (has epost-kit-specific examples)
- `references/skill-structure.md` — keep as-is (has epost-kit validation checklist)
- Skill name stays `kit-skill-development` (not renamed to `skill-creator`)

## Risks

1. **SKILL.md bloat** — adding eval/benchmark sections may push body past 2,000 words. Mitigation: keep summaries lean, delegate detail to references/ and agents/
2. **Script compatibility** — Python scripts use `|` union type syntax (3.10+). Most dev machines have 3.10+ but verify
3. **Subagent availability** — eval workflow requires subagents. Include Claude.ai fallback instructions (inline testing without subagents)

## Unresolved Questions

1. Should we rename from `kit-skill-development` to `skill-creator` for alignment with Anthropic's naming? (Recommendation: no, keep our name -- it's already wired into package.yaml and agent skills lists)
2. Should the eval-viewer scripts live under `eval-viewer/` or `scripts/`? (Recommendation: keep as `eval-viewer/` matching Anthropic structure since it's a self-contained viewer component)
3. Do we want the `.skill` packaging feature? Our kit distributes skills via packages, not `.skill` files. (Recommendation: include but deprioritize -- useful for standalone skill sharing)
