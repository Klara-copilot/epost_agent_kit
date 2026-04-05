# Docker Deploy (Self-hosted)

## Build + Push
```bash
docker build -t <image>:<tag> .
docker push <registry>/<image>:<tag>
```

## Docker Compose
```bash
docker compose up -d --build    # rebuild + start
docker compose pull && docker compose up -d  # pull latest + restart
```

## Auth Check
```bash
docker info            # check daemon running
docker login           # log in to registry
```

## Common Targets
- **Coolify**: push image, Coolify redeploys automatically
- **Dokploy**: `docker compose up` on remote via SSH
- **Custom VPS**: SSH + docker compose pull + up
