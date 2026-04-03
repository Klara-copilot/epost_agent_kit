# SOPS Secret Management Workflow

All SOPS commands run inside the `luz-deploy` Docker container. Never run SOPS locally outside the container — key material and config are container-scoped.

## Decrypt a Secret (read/inspect)

```sh
docker run -v .:/luz_kubernetes -w /luz_kubernetes \
  europe-west6-docker.pkg.dev/klara-repo/artifact-registry-container-images/luz-deploy:0.0.2 \
  bash -c "sops -d --pgp <pgp-key> <path-to-sops-file> > decrypted.yaml"
```

Example:

```sh
docker run -v .:/luz_kubernetes -w /luz_kubernetes \
  europe-west6-docker.pkg.dev/klara-repo/artifact-registry-container-images/luz-deploy:0.0.2 \
  bash -c "sops -d --pgp 021D1D1A849524065D85E8BAE907AC608F9AED8E \
    kubernetes-overlays/env-dev/luz-eletter/luz-eletter-env-secret.sops.yaml > decrypted.yaml"
```

PGP keys per environment: found in `.sops.yaml` at the root of `luz_kubernetes`.

## Encrypt a New or Modified Secret

```sh
# Step 1: Create a .properties file (key=value format)
# KEY=VALUE
# ANOTHER_KEY=ANOTHER_VALUE

# Step 2: Run the encrypt script for the service (in sops/scripts/)
#   e.g., luz-eletter-create-env-secret.sh

# Step 3: Encrypt the raw secret YAML directly
docker run -v .:/luz_kubernetes -w /luz_kubernetes \
  europe-west6-docker.pkg.dev/klara-repo/artifact-registry-container-images/luz-deploy:0.0.2 \
  bash -c "sops --config sops/.sops.yaml --input-type yaml --output-type yaml \
    -e kubernetes-overlays/env-dev/luz-eletter-env-secret.yaml > \
    kubernetes-overlays/env-dev/luz-eletter/luz-eletter-env-secret.sops.yaml"
```

## Validate Deployment After Changes

Run after **every** change — not just secret changes:

```sh
docker run -v .:/luz_kubernetes -w /luz_kubernetes \
  europe-west6-docker.pkg.dev/klara-repo/artifact-registry-container-images/luz-deploy:0.0.2 \
  bash -c "sed -i -e 's/\r$//' ./deploy_to_stdout.sh && ./deploy_to_stdout.sh dev > dev.yaml"
```

Replace `dev` with the target environment name to validate other overlays.

## Mandatory Rules

- **MANDATORY**: Run validation after every change. If it fails, fix before committing.
- **MANDATORY**: Delete the unencrypted file after encrypting. Never push raw secrets.
- Encrypted files end in `.sops.yaml` — this is the only format committed to the repo.

## Developer Access by Environment

| Environment | Developer access |
|-------------|-----------------|
| `dev-vn` | Yes |
| `dev` | Yes |
| `dev-staging` | Yes |
| `performance` | Yes |
| `swissdec` | Yes |
| `production` | Elevated access required |
