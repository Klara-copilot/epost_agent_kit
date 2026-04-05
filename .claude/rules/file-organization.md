# File Organization — Single Source of Truth

All agents and skills reference this when deciding WHERE to create files and HOW to name them.

## Path Decision Tree

```
1. Source code?
   → src/ or project root (follow language conventions)

2. Test file?
   → co-locate with source OR tests/ (mirror source structure)

3. Plan or agent output?
   → Implementation plan:   plans/{YYMMDD-HHMM}-{slug}/plan.md
   → Plan phase:            plans/{date-slug}/phase-{NN}-{name}.md
   → Agent report:          reports/{YYMMDD-HHMM}-{slug}-{agent}.md
   → Research (standalone): reports/{YYMMDD-HHMM}-{slug}-epost-researcher.md

4. Documentation (human + AI)?
   → Architecture/decisions: docs/decisions/ADR-NNNN-{slug}.md
   → Architecture overview:  docs/architecture/ARCH-NNNN-{slug}.md
   → Feature deep-dive:      docs/features/FEAT-NNNN-{slug}.md
   → Coding conventions:     docs/conventions/CONV-NNNN-{slug}.md
   → Operational guide:      docs/guides/GUIDE-NNNN-{slug}.md
   → Debug finding:          docs/findings/FINDING-NNNN-{slug}.md
   → Registry:               docs/index.json

5. Config file?
   → Project root or .config/ (follow ecosystem convention)

6. Hook / script?
   → packages/core/hooks/{kebab-name}.cjs
   → packages/core/scripts/{kebab-name}.cjs
```

## Naming Conventions

### Timestamped (time-sensitive content)
Pattern: `{YYMMDD-HHMM}-{slug}`

Use for: plans, reports, journals, research
```
plans/260329-1414-auth-redesign/
reports/260329-1414-auth-research-epost-researcher.md
```

### Evergreen (stable content)
Pattern: `{slug}` or `{PREFIX-NNNN-slug}`

Use for: docs, config files, source code
```
docs/decisions/ADR-0001-nextjs-app-router.md
docs/architecture/ARCH-0001-overview.md
```

### Slug rules
- Lowercase kebab-case only — no underscores, spaces, special chars
- Self-documenting — readable without opening the file; long names are fine because they help LLM tools (Grep, Glob) understand purpose without reading file content
- Long is fine: `user-authentication-token-refresh-strategy` > `auth-token`

## Code File Size

Keep individual code files under 200 lines for optimal context management:
- Split large files into smaller, focused modules
- Extract utility functions into separate modules
- Create dedicated service classes for business logic
- Use composition over inheritance for complex structures

This limit does NOT apply to: markdown files, plain text, config files, generated output.

## Naming by File Type

| Type | Pattern | Example |
|------|---------|---------|
| Plan dir | `plans/{YYMMDD-HHMM}-{slug}/` | `plans/260329-1414-auth-redesign/` |
| Plan file | `plan.md` (inside plan dir) | `plans/260329-1414-auth-redesign/plan.md` |
| Phase file | `phase-{NN}-{slug}.md` | `phase-01-backend-api.md` |
| Report | `{YYMMDD-HHMM}-{slug}-{agent}.md` | `260329-1414-auth-research-epost-researcher.md` |
| ADR | `ADR-{NNNN}-{slug}.md` | `ADR-0001-nextjs-app-router.md` |
| Architecture | `ARCH-{NNNN}-{slug}.md` | `ARCH-0001-system-overview.md` |
| Feature | `FEAT-{NNNN}-{slug}.md` | `FEAT-0001-auth-flow.md` |
| Convention | `CONV-{NNNN}-{slug}.md` | `CONV-0001-named-exports.md` |
| Guide | `GUIDE-{NNNN}-{slug}.md` | `GUIDE-0001-local-dev-setup.md` |
| Finding | `FINDING-{NNNN}-{slug}.md` | `FINDING-0001-keycloak-token-expiry.md` |
| Hook | `{kebab-name}.cjs` | `usage-context-awareness.cjs` |
| Script | `{kebab-name}.cjs` | `generate-skill-index.cjs` |

## Markdown Structure by Type

| Type | Required sections |
|------|------------------|
| Plan | frontmatter → summary → phases table → constraints → success criteria |
| Phase | frontmatter → context links → overview → requirements → files → todo list → success criteria |
| Report | frontmatter → status → findings → recommendations → unresolved questions |
| ADR | status → context → decision → alternatives considered → consequences |
| ARCH | free-form — system structure, data flow, component relationships |
| FEAT | what it is → why → how it works → summary |
| CONV | status → convention (rule) → examples (correct/incorrect) → exceptions |
| GUIDE | prerequisites → step-by-step → troubleshooting |
| FINDING | status → finding → evidence → impact → workaround → related |

## Pre-Output Checklist

Before creating any file:
1. Which category? → get base path from decision tree
2. Timestamped or evergreen? → add timestamp if time-sensitive
3. Already exists? → check before creating (avoid overwrite)
4. Correct prefix? → KB docs require ADR/ARCH/FEAT/CONV/GUIDE/FINDING prefix
5. Update index? → after KB doc changes, update `docs/index.json`
