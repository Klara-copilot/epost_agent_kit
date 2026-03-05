# Phase 5: Release Runbook & Documentation

**Effort**: 1h
**Goal**: Document release process for humans + create verification checklist

---

## Deliverable: Release Process Documentation

Create: `docs/release-process.md`

This document is the **single source of truth** for how to release `epost_agent_kit`.

---

## File Content

```markdown
# Release Process for epost_agent_kit

This document describes how to release a new version of `epost_agent_kit` to GitHub.

## Overview

The release process is **mostly automated** via GitHub Actions. Your job is to:

1. Decide on version number
2. Update version files
3. Push a git tag
4. GitHub Actions creates the release automatically

## Prerequisites

- [ ] All changes committed to `master`
- [ ] CI/CD passing (if applicable)
- [ ] Standalone CLI repo (`epost-agent-kit-cli`) also released
- [ ] You have push access to `master` branch and can create releases

## Release Checklist

### 1. Determine Version Number

Use **semantic versioning** (e.g., `2.0.0`, `2.0.1`, `2.1.0`).

- **Major**: Breaking changes (e.g., `2.0.0` → `3.0.0`)
- **Minor**: New features, backward compatible (e.g., `2.0.0` → `2.1.0`)
- **Patch**: Bug fixes only (e.g., `2.0.0` → `2.0.1`)

**Decision**: What version are you releasing?
Example: `2.0.0` (major consolidation release)

### 2. Update `.epost-metadata.json`

File: `.epost-metadata.json`

Change `kitVersion`:

```json
{
  "kitVersion": "2.0.0",
  ...
}
```

Verify:
```bash
grep kitVersion .epost-metadata.json
```

### 3. Update `CHANGELOG.md`

File: `CHANGELOG.md`

Move the `[Unreleased]` section to the version you're releasing:

**Before**:
```markdown
## [Unreleased]

### Added
- Feature A
- Feature B

### Changed
- Change X

### Removed
- Old Thing

## [1.0.0] - 2026-02-11
```

**After**:
```markdown
## [2.0.0] - 2026-03-05

### Added
- Feature A
- Feature B

### Changed
- Change X

### Removed
- Old Thing

## [Unreleased]

(No entries yet)

## [1.0.0] - 2026-02-11
```

Also add a link at the **bottom** of the file:

```markdown
[2.0.0]: https://github.com/Klara-copilot/epost_agent_kit/releases/tag/v2.0.0
[1.0.0]: https://github.com/Klara-copilot/epost_agent_kit/releases/tag/v1.0.0
```

Verify:
```bash
head -20 CHANGELOG.md | grep "## \[2.0.0\]"
```

### 4. Validate Version Numbers

Ensure all versions match:

```bash
# Check .epost-metadata.json
grep kitVersion .epost-metadata.json

# Check CHANGELOG.md for version header
grep "^\## \[2.0.0\]" CHANGELOG.md

# Optional: Validate all files
if [ -f scripts/validate-release-version.sh ]; then
  scripts/validate-release-version.sh 2.0.0
fi
```

### 5. Commit Changes

Create a commit for version bump:

```bash
git add .epost-metadata.json CHANGELOG.md
git commit -m "chore(release): v2.0.0"
```

Verify:
```bash
git log --oneline -1
```

### 6. Create Git Tag

Create an **annotated tag**:

```bash
git tag -a v2.0.0 -m "Release version 2.0.0"
```

Or a **lightweight tag**:

```bash
git tag v2.0.0
```

Verify:
```bash
git tag -l v2.0.0
git show v2.0.0 | head -20
```

### 7. Push Changes & Tag

Push commit and tag to GitHub:

```bash
git push origin master
git push origin v2.0.0
```

Verify:
```bash
git log --oneline origin/master -3
git tag -l origin | grep v2.0.0
```

### 8. Wait for GitHub Actions

The release workflow will automatically:
1. Validate packages
2. Build artifact
3. Create release with notes
4. Upload artifact

Check progress:
- Go to [GitHub Actions](https://github.com/Klara-copilot/epost_agent_kit/actions)
- Find the latest `Release` workflow run
- Wait for ✅ completion (~2-3 minutes)

### 9. Verify Release on GitHub

Once workflow completes:

1. Go to [Releases page](https://github.com/Klara-copilot/epost_agent_kit/releases)
2. Click on `v2.0.0` release
3. Verify:
   - [ ] Tag is `v2.0.0`
   - [ ] Release notes populated from CHANGELOG
   - [ ] Artifact `epost_agent_kit-2.0.0.tar.gz` attached
   - [ ] Download count working
   - [ ] Not marked as "Draft" or "Pre-release"

### 10. Download & Verify Artifact (Optional)

Test the release:

```bash
# Download artifact
cd /tmp
wget https://github.com/Klara-copilot/epost_agent_kit/releases/download/v2.0.0/epost_agent_kit-2.0.0.tar.gz

# Extract
tar xzf epost_agent_kit-2.0.0.tar.gz

# Verify contents
ls -la epost_agent_kit-2.0.0/packages/
cat epost_agent_kit-2.0.0/.epost-metadata.json | grep kitVersion
```

### 11. Announce Release (Optional)

Once verified, you can:
- [ ] Post release link in Slack/Discord
- [ ] Update documentation sites
- [ ] Notify users of major changes

## Troubleshooting

### Release workflow failed

Check GitHub Actions:
1. Go to [Actions tab](https://github.com/Klara-copilot/epost_agent_kit/actions)
2. Click failed run
3. Expand step that failed
4. Read error message
5. Common causes:
   - CHANGELOG format incorrect (missing `## [VERSION]`)
   - `package.yaml` file missing
   - Tag already exists

**Fix**: Delete the tag, fix the issue, and re-tag:
```bash
git tag -d v2.0.0
git push origin --delete v2.0.0
# Fix issue
git tag -a v2.0.0 -m "Release version 2.0.0"
git push origin v2.0.0
```

### Release created but artifact missing

If release exists but `.tar.gz` not attached:
1. Check workflow logs (step 4: "Build release artifact")
2. Common causes:
   - `build-release.sh` failed silently
   - Missing `packages/` directory
   - Wrong script path

**Manual fix**:
1. Delete the release
2. Fix the issue locally:
   ```bash
   scripts/build-release.sh 2.0.0
   ```
3. Upload artifact manually via GitHub web UI

### Wrong release notes extracted

If CHANGELOG notes are missing/incomplete:
1. Check CHANGELOG.md format:
   ```bash
   grep -A 5 "^\## \[2.0.0\]" CHANGELOG.md
   ```
2. Ensure blank line before next `## [`:
   ```markdown
   ## [2.0.0] - 2026-03-05

   ### Added
   - Item

   ## [Unreleased]
   ```
3. Re-run workflow or upload release notes manually

## Rollback

If something goes wrong post-release:

### Delete a release (keep tag)
```bash
# Go to GitHub Release page → Click "Delete" button
# Or use gh CLI:
gh release delete v2.0.0
```

### Delete a tag entirely
```bash
git tag -d v2.0.0
git push origin --delete v2.0.0
```

### Revert commit
```bash
git revert HEAD
git push origin master
```

## Automation Notes

The following is done **automatically** via `.github/workflows/release.yml`:

- ✅ Extract version from tag
- ✅ Validate `package.yaml` files
- ✅ Run `scripts/build-release.sh`
- ✅ Extract release notes from CHANGELOG
- ✅ Create GitHub release
- ✅ Attach artifact
- ✅ Mark as final (not draft)

You only need to:
1. Update version files
2. Push tag
3. Watch for completion

## Quick Reference

**Release `v2.0.0`**:
```bash
# 1. Update files
echo '{"kitVersion": "2.0.0", ...}' > .epost-metadata.json
# Edit CHANGELOG.md manually

# 2. Commit
git add .epost-metadata.json CHANGELOG.md
git commit -m "chore(release): v2.0.0"

# 3. Tag
git tag -a v2.0.0 -m "Release version 2.0.0"

# 4. Push
git push origin master
git push origin v2.0.0

# 5. Verify in ~2 minutes
open https://github.com/Klara-copilot/epost_agent_kit/releases/v2.0.0
```

---

**Last Updated**: 2026-03-05
**Maintainer**: @than
```

---

## Deliverables

- [ ] `docs/release-process.md` created with full runbook
- [ ] Runbook reviewed for accuracy
- [ ] All links updated (GitHub owner, repo name, etc.)
- [ ] Quick reference tested:
  - [ ] Follow checklist step-by-step
  - [ ] All commands verified
  - [ ] Troubleshooting section applicable

---

## Summary of All 5 Phases

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Versioning convention | 1h | Plan complete |
| 2 | Build release script | 1.5h | Plan complete |
| 3 | GitHub Actions workflow | 1.5h | Plan complete |
| 4 | Install scripts + sync | 1h | Plan complete |
| 5 | Release runbook | 1h | ✅ COMPLETE |

**Total**: ~6h planning + implementation

---

## Execution Order

1. ✅ Phase 1: Bump `.epost-metadata.json` + CHANGELOG
2. ✅ Phase 2: Create `scripts/build-release.sh` + test locally
3. ✅ Phase 3: Create `.github/workflows/release.yml` + test on tag
4. ✅ Phase 4: Update install scripts + sync to CLI repo
5. ✅ Phase 5: Document `docs/release-process.md`

Then: **Cut first release** `v2.0.0`

---

## First Release Validation

Before releasing `v2.0.0`, verify:

```bash
# 1. All phases complete
ls -la .github/workflows/release.yml
ls -la scripts/build-release.sh
ls -la docs/release-process.md

# 2. Version matches everywhere
grep kitVersion .epost-metadata.json
grep "^\## \[2.0.0\]" CHANGELOG.md

# 3. Build artifact works
scripts/build-release.sh 2.0.0
tar tzf epost_agent_kit-2.0.0.tar.gz | wc -l

# 4. Sync script works
scripts/sync-install-scripts.sh

# 5. Ready to tag!
git log --oneline -1
```

Once all phases are complete, follow `docs/release-process.md` to cut the release.
