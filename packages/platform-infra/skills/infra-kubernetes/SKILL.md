---
name: infra-kubernetes
description: (ePost) Manages Kubernetes infrastructure config — Kustomize overlays, SOPS-encrypted secrets, GCP deployment. Use when working with luz_kubernetes, K8s YAML files, Kustomize overlays, SOPS secrets, or GCP compute deployment
user-invocable: false

metadata:
  agent-affinity:
    - epost-fullstack-developer
    - epost-debugger
  keywords:
    - kubernetes
    - kustomize
    - sops
    - gcp
    - gke
    - cloud-run
    - infra
    - secrets
    - overlay
  platforms:
    - all
  triggers:
    - kubernetes
    - kustomize
    - sops
    - luz_kubernetes
    - gke
    - cloud run
    - k8s
    - overlay
    - secret
---

# Kubernetes Infrastructure — luz_kubernetes

## GCP Compute: Always Follow This Order

1. **Cloud Run** — extreme scaling, scale-to-zero, event/request-driven workloads *(prefer this)*
2. **GKE** — long-running services, custom orchestration, existing cluster integration
3. **Compute Engine** — LAST resort only (specific OS requirements, legacy constraints)

Never jump straight to GKE or Compute Engine if Cloud Run can handle the workload.

## luz_kubernetes Repo Structure

```
luz_kubernetes/
├── kubernetes/                          # BASE: raw K8s configs (no env-specific values)
│   ├── {service-name}/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   └── kustomization.yaml
└── kubernetes-overlays/                 # OVERLAYS: per-environment patches
    ├── env-dev/
    │   ├── {service-name}/
    │   │   └── {service}-env-secret.sops.yaml
    │   └── kustomization.yaml
    ├── env-dev-staging/
    ├── env-test/
    └── env-prod/
```

## Base vs Overlay

| Layer | Path | Contains |
|-------|------|---------|
| Base | `kubernetes/{service}/` | All resources without env-specific values |
| Overlay | `kubernetes-overlays/env-{name}/{service}/` | Env-specific patches + secrets |

Rule: Base configs must work without secrets. Overlays patch in env-specific values.

## Secrets — SOPS Rules

- Secrets file suffix: `.sops.yaml` — encrypted with SOPS, safe to commit
- **NEVER** commit unencrypted secrets (`.yaml` without `.sops` suffix) — delete after encrypting
- PGP keys per environment are in `.sops.yaml` at the repo root

## Mandatory Validation

After **any** change to `luz_kubernetes`, run validation before committing:

```sh
docker run -v .:/luz_kubernetes -w /luz_kubernetes \
  europe-west6-docker.pkg.dev/klara-repo/artifact-registry-container-images/luz-deploy:0.0.2 \
  bash -c "sed -i -e 's/\r$//' ./deploy_to_stdout.sh && ./deploy_to_stdout.sh dev > dev.yaml"
```

If this fails → fix before committing. Do not skip.

## Aspects

| Aspect | File | Purpose |
|--------|------|---------|
| SOPS workflow | `references/sops-workflow.md` | Secret create/update/decrypt commands |
