---
id: PLAN-0048
title: "Unified Package Versioning Strategy"
type: design
status: active
created: 2026-03-05
authors: [epost-architect]
tags: [versioning, packages, release, automation, cli]
effort: S
risk: low
---

# Unified Package Versioning Strategy

## Problem

9 packages have independent versions (core=2.0.0, kit=1.1.0, design-system=1.0.0, etc.). This causes:
- Confusion when cutting releases — which packages changed?
- `.epost-metadata.json` tracks per-file versions from package.yaml, creating version soup
- `build-release.sh` takes a version arg but never syncs it to package.yaml files
- CLI `init.ts` hardcodes `kitVersion: "1.0.0"` instead of reading from source
- `validate-release-version.sh` only checks `.epost-metadata.json` + CHANGELOG, not package.yaml files

## Decision: Lockstep Versioning

All packages share the same version. Rationale:
- Packages are tightly coupled (all depend on core, ship together in single tarball)
- No independent npm publishing — packages are consumed only via `epost-kit init`
- Simplifies release process, mental model, and version validation

**Single source of truth**: Root-level `VERSION` file (plain text, e.g. `2.0.0`).

Why `VERSION` file over `.epost-metadata.json`:
- Shell scripts can `cat VERSION` — no jq/grep needed
- CI, build, validate scripts all share one read path
- `.epost-metadata.json` is target-project output, not source-of-truth for kit development

## Architecture

```
VERSION (source of truth: "2.0.0")
  │
  ├── scripts/bump-version.sh ──► updates VERSION + all package.yaml + .epost-metadata.json + CHANGELOG skeleton
  ├── scripts/validate-release-version.sh ──► validates VERSION == all package.yaml == .epost-metadata.json == CHANGELOG
  ├── scripts/build-release.sh ──► reads VERSION (no arg needed)
  ├── .github/workflows/release.yml ──► validates before creating GitHub release
  └── epost-kit init ──► reads package.yaml version per file, or falls back to VERSION
```

## Phase 1: Immediate Fix — Sync All to v2.0.0

**Files to modify** (in `packages/`, not `.claude/`):

| File | Current | Target |
|------|---------|--------|
| `packages/kit/package.yaml:2` | `1.1.0` | `2.0.0` |
| `packages/design-system/package.yaml:2` | `1.0.0` | `2.0.0` |
| `packages/domains/package.yaml:2` | `1.0.0` | `2.0.0` |

Other packages (core, a11y, platform-*) already at 2.0.0.

**New file**: `VERSION` at repo root, contents: `2.0.0`

## Phase 2: Create bump-version.sh

`scripts/bump-version.sh <VERSION>`

Steps:
1. Validate semver format
2. Write `VERSION` file
3. Update all `packages/*/package.yaml` version fields (sed)
4. Update `.epost-metadata.json` kitVersion field (sed or jq)
5. Add CHANGELOG skeleton entry `## [VERSION] - YYYY-MM-DD`
6. Print summary of changes

## Phase 3: Update validate-release-version.sh

Add checks:
- `VERSION` file matches target
- Every `packages/*/package.yaml` version matches target
- `.epost-metadata.json` kitVersion matches target
- CHANGELOG has entry (existing)

## Phase 4: Update build-release.sh

- Read version from `VERSION` file instead of requiring CLI arg
- Keep arg as optional override for dry-run/testing
- Remove version arg from `.github/workflows/release.yml` (extract from tag, validate against `VERSION`)

## Phase 5: Fix CLI init Hardcoded Version

In `epost-agent-kit-cli/src/commands/init.ts`:
- Line 548: `kitVersion: "1.0.0"` → read from resolved packages' version or from `.epost-metadata.json`
- Line 565: `generateMetadata("0.1.0", target, "1.0.0", ...)` → use actual kit version from source

Approach: CLI reads `package.yaml` versions during resolution, uses highest version as kitVersion.

## Impact Assessment

| Area | Impact |
|------|--------|
| `profiles.yaml` | None — profiles reference package names, not versions |
| `skill-index.json` | None — no version field in skill index |
| `.epost-metadata.json` (per-file) | Per-file `version` field still tracks source package version — unified, so all same |
| Existing installations | No breaking change — version field only used for display/tracking |
| CHANGELOG | Need `## [2.0.0]` entry before tagging |

## Release Workflow (Post-Implementation)

```
1. Developer runs: scripts/bump-version.sh 2.1.0
2. Commit: "chore: bump version to 2.1.0"
3. Update CHANGELOG with actual changes
4. Tag: git tag v2.1.0
5. Push: git push origin v2.1.0
6. CI: validates, builds, creates GitHub release
```

## Test Cases

1. `bump-version.sh 2.1.0` → all 9 package.yaml + VERSION + metadata updated
2. `validate-release-version.sh 2.1.0` → passes after bump, fails before
3. `build-release.sh` → reads VERSION, creates correct artifact name
4. `epost-kit init` → `.epost-metadata.json` shows correct kitVersion

## Unresolved Questions

1. Should CLI version (currently 0.1.0 in epost-agent-kit-cli/package.json) also track kit version, or stay independent? Recommendation: keep independent — CLI is a separate repo with its own release cycle.
