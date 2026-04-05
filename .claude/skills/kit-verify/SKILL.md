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

Pre-release/pre-init audit pipeline. `epost-kit verify` and the agent layer check are independent — run both.

## When to Use

- Before running `epost-kit init` on a project
- Before creating a release/tag
- After batch-editing skills, agents, or connections

## Step 1 — Run the CLI (automated)

```bash
epost-kit verify            # errors block, warnings advisory
epost-kit verify --strict   # warnings also block (CI mode)
```

The CLI checks automatically:
- **Installed integrity** — checksums of `.claude/` files vs `.epost-metadata.json`
- **Reference validation** — all agent/skill/command refs point to valid targets
- **Connection integrity** — extends/requires/enhances targets exist, no cycles
- **Frontmatter completeness** — skills have description, keywords, platforms
- **Dependency graph** — writes `docs/skill-dependency-graph.md` (mermaid)
- **Health summary** — skill count, connection counts, completeness ratios

Exit codes: `0` = pass, `1` = errors (or warnings under `--strict`), `2` = warnings only.

Fix all errors before proceeding. Warnings are advisory unless in strict mode.

## Step 2 — Layer compliance (you assess)

The CLI cannot assess content — this is your job.

For each skill in `packages/`:
1. Read the SKILL.md body
2. Ask: is this content **org-wide** (applies to any ePost repo/team) or **repo-specific** (tied to one project, product, or codebase)?
3. Repo-specific signals to look for: specific file paths, product or repo names, "in this repo" conventions, business logic scoped to one team

If repo-specific content found:
- Flag it to the user
- Suggest the appropriate `docs/` type: `CONV` (deviation), `ADR` (decision), `FEAT` (feature), `FINDING` (gotcha)
- Do NOT move it automatically — present the finding and wait for confirmation

## Integration

- Wire as pre-commit hook: `epost-kit verify --strict`
- Wire in CI: `npx epost-kit verify --strict --dir .`
