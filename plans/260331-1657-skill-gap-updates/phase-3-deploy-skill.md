---
phase: 3
title: "Deploy skill"
effort: 1.5h
depends: []
---

# Phase 3: Deploy Skill

## Context Links

- [Plan](./plan.md)
- `packages/core/package.yaml` — skill registration

## Overview

- Priority: P2
- Status: Pending
- Effort: 1.5h
- Description: New `/deploy` skill that auto-detects deployment platform and runs deploy

## Requirements

### Functional

- Auto-detect platform from config files in project root:
  - `vercel.json` or `.vercel/` → Vercel
  - `netlify.toml` or `netlify/` → Netlify
  - `wrangler.toml` → Cloudflare Pages
  - `railway.toml` or `railway.json` → Railway
  - `fly.toml` → Fly.io
  - `docker-compose.yml` + `Dockerfile` → Docker/self-hosted
- Run deploy command for detected platform
- Support `--preview` flag (deploy to preview/staging, not production)
- Support `--platform <name>` flag to override auto-detection
- If multiple configs found, ask user which to deploy

### Non-Functional

- SKILL.md under 80 lines (lean hub)
- Platform-specific steps in `references/platforms/{name}.md`
- Do NOT include: infrastructure provisioning, DNS config, SSL setup, CI/CD pipeline creation

## Files to Create

- `packages/core/skills/deploy/SKILL.md` — main skill file
- `packages/core/skills/deploy/references/platforms/vercel.md`
- `packages/core/skills/deploy/references/platforms/netlify.md`
- `packages/core/skills/deploy/references/platforms/cloudflare.md`
- `packages/core/skills/deploy/references/platforms/railway.md`
- `packages/core/skills/deploy/references/platforms/flyio.md`
- `packages/core/skills/deploy/references/platforms/docker.md`

## Files to Modify

- `packages/core/package.yaml` — add `deploy` to `provides.skills` list

## Implementation Steps

1. **Create SKILL.md**
   - Frontmatter: name, description, user-invocable: true, category: workflow
   - argument-hint: `[--preview | --platform <name>]`
   - Agent-affinity: epost-fullstack-developer, epost-git-manager
   - Step 0: Flag override (`--platform <name>` → load that platform reference)
   - Step 1: Auto-detect — glob for config files, map to platform
   - Step 2: If multiple → ask user. If none → error with supported list
   - Step 3: Load `references/platforms/{detected}.md` and execute
   - Aspect files table listing all 6 platform references

2. **Create platform references** (each ~40-60 lines)
   - Each follows pattern:
     - Prerequisites check (CLI installed? logged in?)
     - Pre-deploy validation (build passes? env vars set?)
     - Deploy command (production vs preview)
     - Post-deploy verification (URL check, health endpoint)
     - Common errors table

3. **Platform specifics**
   - **Vercel**: `vercel --prod` / `vercel` (preview). Check `vercel whoami`
   - **Netlify**: `netlify deploy --prod` / `netlify deploy`. Check `netlify status`
   - **Cloudflare**: `wrangler pages deploy` / `wrangler pages deploy --branch preview`
   - **Railway**: `railway up` / `railway up --environment staging`
   - **Fly.io**: `fly deploy` / `fly deploy --app {app}-staging`
   - **Docker**: `docker compose up -d --build`. Health check via curl

4. **Register in package.yaml**
   - Add `deploy` to `provides.skills` list (alphabetical position)

## Todo List

- [ ] Create deploy/SKILL.md with auto-detection + flag routing
- [ ] Create references/platforms/vercel.md
- [ ] Create references/platforms/netlify.md
- [ ] Create references/platforms/cloudflare.md
- [ ] Create references/platforms/railway.md
- [ ] Create references/platforms/flyio.md
- [ ] Create references/platforms/docker.md
- [ ] Add deploy to packages/core/package.yaml

## Success Criteria

- `/deploy` auto-detects platform from config files
- `/deploy --preview` deploys to staging/preview
- `/deploy --platform vercel` overrides detection
- Each platform reference includes prereq check + deploy + verify
- Skill registered in package.yaml

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Platform CLI not installed | Med | Each reference checks prerequisites first, suggests install |
| Multiple config files detected | Low | Explicit disambiguation prompt |
| Scope creep into infra provisioning | Med | Explicit "Do NOT include" section in SKILL.md |

## Security Considerations

- Deploy commands may require auth tokens — never log or expose them
- Production deploy should confirm with user before executing
- Note: `--preview` is the safe default for first-time deploys
