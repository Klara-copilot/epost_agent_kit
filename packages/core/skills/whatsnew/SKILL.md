---
name: whatsnew
description: (ePost) Shows what changed in the kit recently — new skills, agent updates, rule changes. Use when user asks "what's new", "what changed", "what was added", "recent updates", or after pulling the latest kit
user-invocable: true
context: inline
metadata:
  argument-hint: "[--week | --all]"
  keywords: [whatsnew, changelog, updates, new-skills, recent-changes]
  platforms: [all]
  triggers: ["what's new", "what changed", "recent updates", "what was added", "new in the kit"]
---

# What's New in the Kit

Show recent changes to epost_agent_kit grouped by type.

## Step 0 — Determine Range

| Argument | Range |
|----------|-------|
| *(none)* | Last 30 days |
| `--week` | Last 7 days |
| `--all` | All time, grouped by month |

## Step 1 — Read Git Log

Run:
```bash
git log packages/ --since="<range>" --oneline --no-merges
```

For `--all`: omit `--since`, group output by month using commit dates.

## Step 2 — Classify Commits

Group by conventional commit prefix:

| Prefix | Group |
|--------|-------|
| `feat:` | ✨ New |
| `fix:` | 🔧 Fixed |
| `refactor:` | ♻️ Changed |
| `docs:` | 📖 Docs |
| `chore:` | 🔩 Maintenance |

Extract skill/agent/package names from commit messages where possible.

## Step 3 — Cross-Reference Skill Index

Read `.claude/skills/skill-index.json` — compare against git log to confirm which skills are genuinely new vs updated. Surface skill descriptions for new skills so user knows what they do.

## Step 4 — Format Output

```
## What's New — Last 30 Days

### ✨ New Skills
- `backend-quarkus` — Quarkus microservice blueprint (Java 21, Cloud Run, AlloyDB)
- `backend-auth` — Internal JWT dual-token architecture (@AccessibleWithoutTenant, @PermissionAllowed)
- `multi-tenancy` — ePost tenant model: COMPANY / PERSON / INDIVIDUAL types
- `infra-kubernetes` — Kustomize + SOPS + GKE workflow for luz_kubernetes
- `web-forms` — React Hook Form + Zod patterns with accessible error states

### ♻️ Updated
- `epost-tester` — now triggers on edge cases, scenario analysis, before-writing-tests
- `web-frontend` — added typescript-standards reference (strict mode, Result pattern)
- `web-nextjs` — added env var rules (NEXT_PUBLIC_ discipline)

### 📖 Docs
- ARCH-0003: Three-Layer Knowledge Model
- ARCH-0002: Claude Native Mechanics & Routing Design

---
Run `/didyouknow` to surface non-obvious kit capabilities.
```

## Rules

- Always include skill description for new skills — never just the name
- If no changes in range: say so clearly, suggest `--all`
- Keep each entry to one line — link to skill name so user can ask about it
