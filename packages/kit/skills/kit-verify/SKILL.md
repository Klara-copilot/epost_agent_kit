---
name: kit-verify
description: (ePost) Use when running a pre-release audit, verifying kit integrity before init, or checking for broken references and stale skill connections.
user-invocable: false
disable-model-invocation: false
metadata:
  keywords: [verify, audit, integrity, pre-release, references, connections]
  triggers: [kit verify, pre-release audit, verify kit, check integrity]
  platforms: [all]
  agent-affinity: [epost-fullstack-developer]
  connections:
    enhances: [kit-add-agent, kit-add-skill, kit-add-hook]
---

# Kit Verification Workflow

Pre-release/pre-init audit pipeline. Ensures kit integrity before `epost-kit init` or release.

## When to Use

- Before running `epost-kit init` on a project
- Before creating a release/tag
- After batch-editing skills, agents, or connections
- When CI gate needs to validate kit health

## CLI Command

```bash
epost-kit verify            # full audit, errors block
epost-kit verify --strict   # warnings also block (CI mode)
```

## What It Checks

1. **Reference validation** — all agent/skill/command refs point to valid targets
2. **Connection integrity** — extends/requires/enhances targets exist, no cycles, bidirectional conflicts
3. **Frontmatter completeness** — skills have description, keywords, platforms
4. **Package.yaml sync** — skills on disk match provides.skills declarations
5. **Skill-index staleness** — index count matches actual SKILL.md count
6. **Orphan detection** — skills not referenced by any agent or connection
7. **Dependency graph** — auto-generates `docs/skill-dependency-graph.md` (mermaid)

## Exit Codes

- `0` — pass (may have warnings/info)
- `1` — fail (errors found, or `--strict` with warnings)

## Layer Check (Automatic)

The `skill-validation-gate` hook runs a layer check on every `SKILL.md` write:
- **Hard violation** (e.g. hardcoded absolute user path like `/Users/than/…`, `C:\Users\…`, `/home/user/…`) — flagged immediately as an error
- **Content assessment** — the agent is reminded to evaluate whether the skill is org-wide (Layer 0) or repo-specific (Layer 2); content classification requires LLM judgment and is not automated

To **batch-check existing skills** for layer issues, prompt the agent:
> "Review all skills in `packages/{pkg}/skills/` — identify any with repo-specific content that should be moved to `docs/`."

## Integration

- Wire as pre-commit hook: `epost-kit verify --strict`
- Wire in CI: `npx epost-kit verify --strict --dir .`
- `epost-kit init` can optionally run verify before generating `.claude/`
