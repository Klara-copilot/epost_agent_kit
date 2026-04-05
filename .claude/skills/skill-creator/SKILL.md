---
name: skill-creator
description: "(ePost) Use when improving a skill's description, running skill evals, optimizing skill quality, or benchmarking skill performance. Triggers: 'edit this skill', 'optimize skill description', 'run skill evals', 'benchmark skill', 'improve this skill'."
metadata:
  keywords:
    - skill-creator
    - eval
    - benchmark
    - skill-validation
    - quality
    - skill-authoring
  triggers:
    - /skill-creator
    - create a skill
    - add a skill
    - make a skill
    - new skill
    - scaffold a skill
    - build a skill
    - validate skill
    - write evals
    - benchmark skill performance
  agent-affinity:
    - epost-fullstack-developer
---

# Skill Creator

Creates new skills and iteratively improves them via eval-driven quality loops.

## 4-Phase Workflow

| Phase | What happens |
|-------|-------------|
| **1. Capture Intent** | Understand what the skill does, when it triggers, expected output |
| **2. Write SKILL.md** | Draft skill with CSO-valid description; validate before test cases |
| **3. Test & Eval** | Run with-skill + baseline in parallel; grade; launch viewer for human review |
| **4. Improve** | Generalize from feedback; lean prompt; explain why; bundle repeated work |

After the skill is in good shape: run **Description Optimization** (step 5) to maximize triggering accuracy.

## Key Principles

**CSO — Description must be trigger conditions ONLY:**
- No workflow steps or tool names in description
- Key use case front-loaded (truncates at 250 chars)
- ≥2 quoted user trigger phrases
- Does NOT summarize body (Description Trap → model skips body)

**Description formula:** `[trigger phrases] + [what it does] + [key capabilities]`
Be "pushy" — Claude tends to undertrigger skills.

**Progressive disclosure:**
- `SKILL.md` — always in context, keep lean (<500 lines ideal, <150 for this kit)
- `references/` — loaded on demand
- `scripts/` — executed without loading into context

**Discipline skills** (verification, review, audit) need: Iron Law block + Anti-Rationalization table + Red Flags list.

## Where the user likely is

- "I want to make a skill for X" → start at Phase 1
- "I have a draft" → start at Phase 3 (test & eval)
- "Improve this skill" → start at Phase 4 (improve) or description optimization
- "Run evals" → Phase 3 Step 1 (spawn runs)

Be flexible. If user says "just vibe with me" — skip the formal loop.

## Communicating with users

Adapt to user's technical level. Default:
- "evaluation" and "benchmark" — OK
- "JSON" and "assertion" — explain unless user shows familiarity

## References

| File | When to read |
|------|-------------|
| `references/skill-creator-workflow.md` | Full step-by-step for all 4 phases: test case format, running evals, grading, viewer, improvement loop, description optimization, Kit npm aliases, Claude.ai/Cowork adaptations |
| `references/epost-skill-authoring-standards.md` | ePost frontmatter spec, CSO principles, description checklist, Layer check, connections |
| `references/cc-skill-spec.md` | Anthropic's authoritative skill spec |
| `references/cc-native-mechanics.md` | How CC loads context, agent spawn cost-benefit |
| `references/schemas.md` | JSON schemas: evals.json, grading.json, benchmark.json |
| `references/description-validation-checklist.md` | Description validation examples and fail patterns |
| `packages/kit/skills/kit-skill-development/references/cso-principles.md` | Full CSO principles reference |
| `agents/grader.md` | Grading subagent instructions |
| `agents/comparator.md` | Blind A/B comparison subagent |
| `agents/analyzer.md` | Benchmark analysis subagent |
