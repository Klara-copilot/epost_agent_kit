# Fly.io Deploy

## Prerequisites
- `brew install flyctl` or `curl -L https://fly.io/install.sh | sh`
- `fly auth login`

## Commands
```bash
fly deploy             # deploy from fly.toml
fly status             # check app status
fly logs               # tail logs
```

## First-Time Setup
```bash
fly launch             # creates fly.toml interactively
```
