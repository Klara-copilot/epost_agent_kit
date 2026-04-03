---
name: kit-verify
description: "(ePost) Use when checking kit health, verifying kit integrity, or confirming everything is in sync before committing. Triggers: 'verify kit', 'check kit', 'kit health', 'is kit ok', 'kit-verify', 'validate package manifest', 'check agent refs'."
keywords: [kit, verify, health, check, validate, skill-index, package, agent, sync, audit]
user-invocable: true
context: inline
platforms: [all]
tier: discoverable
---

# Kit Verify

Runs all structural health checks against the kit. Single entrypoint for validating that agents, skills, and package manifests are in sync.

## Usage

```
/kit-verify
/kit-verify --json
```

## What It Checks

| Check | What it validates |
|-------|-----------------|
| `frontmatter` | All `SKILL.md` in `packages/` have `name` + `description` |
| `naming` | All skill dirs in `packages/` are kebab-case |
| `pkg-declared` | Every skill in `package.yaml` `provides.skills` has a real directory |
| `pkg-installed` | Every `.claude/skills/` dir traces back to a `packages/` source |
| `agent-refs` | Every skill in agent `skills:` frontmatter exists in skill-index |
| `skill-quality` | All skills pass CSO description checks + `quick_validate.py` schema |
| `eval-coverage` | Every user-invocable skill has `evals/eval-set.json` |
| `index-sync` | `skill-index.json` count matches `.claude/skills/` dirs |

## Execution

```bash
node .claude/scripts/verify.cjs
```

Output: `✓` pass · `⚠` warning · `✗` error

Exit codes: `0` all pass or warnings only · `1` one or more errors

## After Running

| Result | Action |
|--------|--------|
| `index-sync` warning | Run `node .claude/scripts/generate-skill-index.cjs` |
| `pkg-declared` error | Fix `package.yaml` or add the missing skill directory |
| `pkg-installed` warning | Run `epost-kit init` to re-sync `.claude/` from `packages/` |
| `agent-refs` error | Fix agent frontmatter `skills:` list or add the skill to skill-index |
| `skill-quality` warning/error | Fix CSO description (add "Use when..." + trigger phrases) or fix YAML |
| `eval-coverage` warning | Add `evals/eval-set.json` with ≥1 true + ≥1 false trigger query |
| `frontmatter` error | Add missing `name`/`description` to the `SKILL.md` |

## Source

Script: `packages/core/scripts/verify.cjs`
Engine only — no LLM calls, runs headlessly in CI.
