# Release Process for epost_agent_kit

How to release a new version of `epost_agent_kit` to GitHub.

## Overview

The release process is **mostly automated** via GitHub Actions. You need to:

1. Decide on version number
2. Update version files
3. Push a git tag
4. GitHub Actions creates the release automatically

## Prerequisites

- All changes committed to `master`
- You have push access to `master` and can create tags
- Standalone CLI repo (`epost-agent-kit-cli`) also released if needed

## Release Checklist

### 1. Determine Version Number

Use semantic versioning (`MAJOR.MINOR.PATCH`):

| Type | When | Example |
|------|------|---------|
| Major | Breaking changes | `2.0.0` → `3.0.0` |
| Minor | New features, backward compatible | `2.0.0` → `2.1.0` |
| Patch | Bug fixes only | `2.0.0` → `2.0.1` |

### 2. Update `.epost-metadata.json`

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

Move the `[Unreleased]` entries to the new version:

**Before:**
```markdown
## [Unreleased]

### Added
- Feature A

## [1.0.0] - 2026-02-11
```

**After:**
```markdown
## [2.0.0] - 2026-03-05

### Added
- Feature A

## [Unreleased]

(No entries yet)

## [1.0.0] - 2026-02-11
```

Add a link at the **bottom**:
```markdown
[2.0.0]: https://github.com/Klara-copilot/epost_agent_kit/releases/tag/v2.0.0
```

Verify:
```bash
grep "## \[2.0.0\]" CHANGELOG.md
```

### 4. Validate Versions

```bash
scripts/validate-release-version.sh 2.0.0
```

Expected output:
```
Validating version: 2.0.0
OK .epost-metadata.json: 2.0.0
OK CHANGELOG.md: [2.0.0] found

All version checks passed.
```

### 5. Test Build Locally (Optional)

```bash
scripts/build-release.sh 2.0.0
tar tzf epost_agent_kit-2.0.0.tar.gz | head -20
rm epost_agent_kit-2.0.0.tar.gz
```

### 6. Commit Changes

```bash
git add .epost-metadata.json CHANGELOG.md
git commit -m "chore(release): v2.0.0"
```

### 7. Sync Install Scripts to CLI Repo (If Updated)

If install scripts were modified:

```bash
scripts/sync-install-scripts.sh
cd ../epost-agent-kit-cli
git add install-macos.sh install.ps1 install.cmd
git commit -m "sync: update install scripts from epost_agent_kit v2.0.0"
git push origin master
cd ../epost_agent_kit
```

### 8. Create Git Tag

```bash
git tag -a v2.0.0 -m "Release version 2.0.0"
```

Verify:
```bash
git tag -l v2.0.0
```

### 9. Push Changes and Tag

```bash
git push origin master
git push origin v2.0.0
```

### 10. Wait for GitHub Actions

The release workflow automatically:
1. Validates `packages/*/package.yaml` files
2. Validates version in metadata + CHANGELOG
3. Runs `scripts/build-release.sh`
4. Extracts release notes from CHANGELOG
5. Creates GitHub release with artifact

Check progress at:
[https://github.com/Klara-copilot/epost_agent_kit/actions](https://github.com/Klara-copilot/epost_agent_kit/actions)

Wait ~2-3 minutes for completion.

### 11. Verify Release on GitHub

1. Go to [Releases page](https://github.com/Klara-copilot/epost_agent_kit/releases)
2. Click `v2.0.0`
3. Verify:
   - Tag is `v2.0.0`
   - Release notes populated from CHANGELOG
   - Artifact `epost_agent_kit-2.0.0.tar.gz` attached
   - Not marked as Draft or Pre-release

## Quick Reference

```bash
# 1. Update files
# Edit .epost-metadata.json: kitVersion -> "2.0.0"
# Edit CHANGELOG.md: move [Unreleased] -> [2.0.0]

# 2. Validate
scripts/validate-release-version.sh 2.0.0

# 3. Commit
git add .epost-metadata.json CHANGELOG.md
git commit -m "chore(release): v2.0.0"

# 4. Tag and push
git tag -a v2.0.0 -m "Release version 2.0.0"
git push origin master
git push origin v2.0.0

# 5. Check GitHub Actions
# https://github.com/Klara-copilot/epost_agent_kit/actions
```

## Troubleshooting

### Workflow failed

1. Go to [GitHub Actions](https://github.com/Klara-copilot/epost_agent_kit/actions)
2. Click failed run, expand failed step
3. Common causes:
   - CHANGELOG format incorrect (missing `## [VERSION]` header)
   - `package.yaml` file missing or malformed
   - Tag already exists on a different commit

Fix and re-tag:
```bash
git tag -d v2.0.0
git push origin --delete v2.0.0
# Fix issue
git tag -a v2.0.0 -m "Release version 2.0.0"
git push origin v2.0.0
```

### Release created but artifact missing

1. Check workflow logs (build artifact step)
2. Run locally: `scripts/build-release.sh 2.0.0`
3. Upload artifact manually via GitHub web UI if needed

### Wrong release notes

1. Check CHANGELOG format: `grep -A 10 "## \[2.0.0\]" CHANGELOG.md`
2. Ensure blank line before next `## [` header
3. Delete and re-create release if needed

## Rollback

```bash
# Delete a release (keep tag)
gh release delete v2.0.0

# Delete tag entirely
git tag -d v2.0.0
git push origin --delete v2.0.0

# Revert commit
git revert HEAD
git push origin master
```

## Automation Notes

GitHub Actions (`.github/workflows/release.yml`) handles:

| Step | Automated |
|------|-----------|
| Extract version from tag | Yes |
| Validate `package.yaml` files | Yes |
| Validate version in metadata + CHANGELOG | Yes |
| Run `scripts/build-release.sh` | Yes |
| Extract release notes from CHANGELOG | Yes |
| Create GitHub release | Yes |
| Attach artifact | Yes |
| Mark as final (not draft) | Yes |

You only need to update version files and push a tag.

---

**Last Updated**: 2026-03-05
**Maintainer**: @than
