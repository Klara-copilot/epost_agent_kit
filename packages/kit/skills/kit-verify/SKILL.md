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

Steps 1–6 are automated by `epost-kit verify`. Step 7 requires LLM judgment.

1. **Installed integrity** — checksums of `.claude/` files against `.epost-metadata.json`; flags modified or missing files
2. **Reference validation** — all agent/skill/command refs point to valid targets
3. **Connection integrity** — extends/requires/enhances targets exist, no cycles
4. **Frontmatter completeness** — skills have description, keywords, platforms
5. **Dependency graph** — auto-generates `docs/skill-dependency-graph.md` (mermaid)
6. **Health summary** — skill count, connection counts, completeness ratios
7. **Layer compliance** *(LLM-assessed)* — read each skill body and assess: is content org-wide (Layer 0) or repo-specific (Layer 2)? Flag skills with specific paths, product names, or repo-scoped conventions. Repo-specific content belongs in `docs/` (CONV, ADR, FEAT, or FINDING).

## Exit Codes

- `0` — pass (may have warnings/info)
- `1` — fail (errors found, or `--strict` with warnings)

## Integration

- Wire as pre-commit hook: `epost-kit verify --strict`
- Wire in CI: `npx epost-kit verify --strict --dir .`
- `epost-kit init` can optionally run verify before generating `.claude/`
