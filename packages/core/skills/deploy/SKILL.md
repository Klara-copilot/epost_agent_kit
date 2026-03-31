---
name: deploy
description: "Deploys projects to hosting platforms with auto-detection. Use when user says 'deploy', 'publish', 'go live', 'push to production', or mentions Vercel, Netlify, Cloudflare, Railway, Fly.io, or Docker."
user-invocable: true
category: devops

metadata:
  agent-affinity: [epost-fullstack-developer]
  keywords: [deploy, publish, vercel, netlify, cloudflare, railway, flyio, docker, production, hosting]
  triggers: ["deploy", "publish", "go live", "push to production", "ship to prod", "host this"]
---

# Deploy

Auto-detect deployment target from project config files, confirm with user, then execute.

## Flags

| Flag | Behavior |
|------|----------|
| *(none)* | Auto-detect platform → confirm → deploy |
| `--dry-run` | Show what would be deployed, skip execution |
| `--platform <name>` | Skip detection, target specific platform |

## Workflow

### 1. Detect Platform

Check for config files in order (stop at first match):

| File | Platform |
|------|---------|
| `vercel.json`, `.vercel/` | Vercel |
| `netlify.toml`, `_redirects` | Netlify |
| `wrangler.toml`, `wrangler.json` | Cloudflare Pages/Workers |
| `fly.toml` | Fly.io |
| `railway.json`, `railway.toml` | Railway |
| `docker-compose.yml` + no above | Docker (self-hosted) |
| `Dockerfile` only | Docker |
| none | Ask user — present options based on project type |

### 2. Project Type → Platform Recommendation (when no config found)

| Detected | Recommended |
|---------|-------------|
| Next.js (`next.config.*`) | Vercel |
| Static/SPA (no server) | Netlify or Cloudflare Pages |
| Node API / Docker | Railway or Fly.io |
| Unknown | Ask user |

### 3. Confirm Before Deploying

Always present a confirmation:
```
Detected: Vercel (vercel.json found)
Target: production
Command: vercel --prod

Proceed? [Y/n]
```
Use `AskUserQuestion` for confirmation. Never deploy without explicit confirmation.

### 4. Execute

Load platform reference: `references/{platform}.md`
Run the deploy command from the reference.
Report the deployment URL on success.

### 5. Scope

**Handles**: project deployment, CLI auth check, deploy command execution
**Does NOT handle**: infrastructure provisioning, DNS setup, SSL certificates, CI/CD pipeline creation, database migrations

## Reference Files

Load only the platform file needed:
- `references/vercel.md`
- `references/netlify.md`
- `references/cloudflare.md`
- `references/railway.md`
- `references/flyio.md`
- `references/docker.md`
