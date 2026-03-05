# Plan: GitHub Release Process for epost_agent_kit

**Status**: Active
**Start**: 2026-03-05 11:19 AM
**Complexity**: Moderate (versioning, CI/CD, install script sync)
**Estimated Effort**: 6h

---

## Problem Statement

`epost_agent_kit` lacks a release process to GitHub. Current state:
- Last release: `v0.0.1` (Feb 11, 2026) — manual, no automation
- No CI/CD workflows for releases
- Install scripts stale (reference removed `epost-agent-cli/` subdirectory)
- Release artifacts not packaged for distribution
- Standalone CLI repo (`epost-agent-kit-cli`) has separate install scripts to maintain

**Goals:**
1. Define unified versioning across all files
2. Build release artifacts (`.tar.gz`) containing source packages
3. Create GitHub Actions workflow to auto-release on tag push
4. Support package downloads via `epost-kit init`
5. Sync install scripts from main repo to CLI repo (`../epost-agent-kit-cli/install/`)
6. Validate packages before release

---

## Solution Overview

### 5 Implementation Phases

| Phase | Task | Effort | Dependencies |
|-------|------|--------|--------------|
| 1 | Define versioning convention (unified semver) | 1h | None |
| 2 | Build release artifact packaging script | 1.5h | Phase 1 |
| 3 | Create GitHub Actions release workflow | 1.5h | Phase 1, 2 |
| 4 | Update install scripts + sync to CLI repo | 1h | Phase 1 |
| 5 | Document release runbook + tag/push | 1h | Phase 1-4 |

**Total**: ~6h

---

## Decisions Made (From User Input)

1. **Unified Versioning**: Use single version across `.epost-metadata.json`, `CHANGELOG.md`, all `package.yaml` files
   - Determines release tag: `v{kitVersion}` (e.g., `v2.0.0`)
2. **Install Scripts**: Update main repo scripts, sync to `../epost-agent-kit-cli/install/`
   - Single source of truth in this repo
   - CLI repo install scripts updated via copy/overwrite
3. **Release Artifacts**: Include `packages/`, `profiles/profiles.yaml`, `templates/`, `README.md`, `CHANGELOG.md`
   - Exclude: `.claude/` (generated), `tools/`, `docs/`, `plans/`, `scripts/`, `.git/`
4. **Package Download**: Support via `epost-kit init` — release archive is source for distribution
5. **Validation**: CI workflow validates `packages/*/package.yaml` before creating release

---

## Phase Details

### Phase 1: Versioning & CHANGELOG Convention (1h)
- [Outline](./phase-01-versioning-convention.md)
- Determine target release version (align `kitVersion` with package versions)
- Update `CHANGELOG.md` format (Keep a Changelog)
- Document version bump workflow

### Phase 2: Release Artifact & Build Script (1.5h)
- [Outline](./phase-02-release-artifact-build.md)
- Create `scripts/build-release.sh`
- Define `.tar.gz` structure
- Test artifact creation locally

### Phase 3: GitHub Actions Release Workflow (1.5h)
- [Outline](./phase-03-github-actions-workflow.md)
- Create `.github/workflows/release.yml`
- Implement tag trigger: `v*.*.*`
- Auto-parse CHANGELOG for release notes
- Validate packages before release

### Phase 4: Update Install Scripts & Sync (1h)
- [Outline](./phase-04-install-scripts-sync.md)
- Fix `install.sh`, `install.ps1`, `install.cmd` (remove stale `epost-agent-cli/` refs)
- Add sync step: copy to `../epost-agent-kit-cli/install/`
- Update README Quick Start

### Phase 5: Release Runbook & Documentation (1h)
- [Outline](./phase-05-release-runbook.md)
- Document `docs/release-process.md` (step-by-step for humans)
- Tag & push workflow
- Verification checklist

---

## Success Criteria

- [ ] Unified version in all `package.yaml`, `.epost-metadata.json`, `CHANGELOG.md`
- [ ] `.github/workflows/release.yml` created and tested
- [ ] `scripts/build-release.sh` produces `.tar.gz` with correct contents
- [ ] Install scripts updated, synced to CLI repo
- [ ] Release process documented in `docs/release-process.md`
- [ ] First release `v2.0.0` created and published to GitHub
- [ ] Release archive downloadable and extractable
- [ ] CI validates packages before releasing

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| CHANGELOG parsing fails in CI | Test awk/sed pattern locally first; use `gh` CLI fallback |
| Sync to CLI repo breaks on file permissions | Manual verification after first sync; consider git-subtree alternative |
| Release artifact too large or wrong contents | Pre-flight check: `tar tzf` to verify before upload |
| Version mismatch across files | Script to validate all version strings match before tagging |

---

## Unresolved Questions

None at this time — user provided answers to all clarification points.

---

## Next Steps

1. Architect Phase 1 (versioning strategy)
2. Implement Phase 2-3 in parallel (build script + CI workflow)
3. Test Phase 4 sync with CLI repo
4. Create first release

**Activate Plan**: `node .claude/scripts/set-active-plan.cjs plans/260305-1119-github-release-process`
