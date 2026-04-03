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
8. **Layer check** — flags skill content that appears repo-specific (Layer 2) rather than org-wide (Layer 0)

### Layer Check (step 8)

Skills in `epost_agent_kit` must be universally applicable across all repos and teams. During verify, scan each skill body for Layer 2/3 signals:

| Signal | Example |
|---|---|
| Specific repo or project name | "the ePost web app", "our iOS app" |
| Hardcoded file paths from one repo | `src/modules/inbox/`, `/Users/than/...` |
| Deviation from org standard | "in this repo we use X instead of Y" |
| Repo-specific config or credentials | environment names, service URLs, secrets |
| Product decisions scoped to one team | business rules, domain logic not universally shared |

**Warning output (non-blocking by default, blocking under `--strict`):**

```
⚠️  LAYER WARNING: packages/kit/skills/{skill-name}/SKILL.md
    Content appears repo-specific (Layer 2), not org-wide (Layer 0).
    Signals detected: {list of signals}
    Consider moving to: docs/{category}/{PREFIX-NNNN-slug}.md
    Pass --allow-layer2 to suppress this warning.
```

Layer warnings are **non-blocking** in normal mode — they surface as advisories. Under `--strict` they become errors.

## Exit Codes

- `0` — pass (may have warnings/info)
- `1` — fail (errors found, or `--strict` with warnings)

## Integration

- Wire as pre-commit hook: `epost-kit verify --strict`
- Wire in CI: `npx epost-kit verify --strict --dir .`
- `epost-kit init` can optionally run verify before generating `.claude/`
