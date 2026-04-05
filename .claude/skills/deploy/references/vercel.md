# Vercel Deploy

## Prerequisites
- `npm i -g vercel` or `npx vercel`
- `vercel login` (OAuth browser flow)

## Commands
```bash
vercel --prod          # deploy to production
vercel                 # deploy to preview URL
vercel --dry-run       # validate config, no deploy
```

## Auth Check
```bash
vercel whoami          # check if logged in
```

## Common Issues
- `vercel.json` build errors → check `builds` config
- Environment variables → set via `vercel env add` or dashboard
- Domain not configured → `vercel domains add <domain>`
