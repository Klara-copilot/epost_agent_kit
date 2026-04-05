# Cloudflare Pages/Workers Deploy

## Prerequisites
- `npm i -g wrangler`
- `wrangler login`

## Pages (static/SSR)
```bash
wrangler pages deploy ./dist --project-name <name>
```

## Workers
```bash
wrangler deploy
```

## Auth Check
```bash
wrangler whoami
```
