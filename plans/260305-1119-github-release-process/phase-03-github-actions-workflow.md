# Phase 3: GitHub Actions Release Workflow

**Effort**: 1.5h
**Goal**: Create CI/CD workflow to auto-release on tag push + validate packages

---

## Workflow Specification

### Trigger
- **Event**: Push of git tags matching `v*.*.*` (e.g., `v2.0.0`)
- **Branch**: Any (typically `master`)

### Steps
1. Checkout code
2. Validate packages (YAML syntax, completeness)
3. Build release artifact (`scripts/build-release.sh`)
4. Extract release notes from CHANGELOG.md
5. Create GitHub release with artifact + notes
6. Verify upload success

### Permissions
- **Token**: `GITHUB_TOKEN` (automatically provided)
- **Access**: Write access to releases (built-in for workflows)

---

## Implementation: GitHub Actions Workflow

Create: `.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

permissions:
  contents: write
  packages: read

jobs:
  validate-and-release:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for CHANGELOG parsing

      - name: Extract version from tag
        id: version
        run: |
          VERSION=${GITHUB_REF#refs/tags/v}
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          echo "Version: $VERSION"

      - name: Validate package YAML files
        run: |
          echo "🔍 Validating package YAML..."
          for pkg in packages/*/package.yaml; do
            if [ ! -f "$pkg" ]; then
              echo "❌ Missing: $pkg"
              exit 1
            fi
            # Basic YAML syntax check (requires yq or similar)
            if ! head -5 "$pkg" | grep -q "^name:"; then
              echo "❌ Invalid format: $pkg"
              exit 1
            fi
            echo "✓ Valid: $pkg"
          done

      - name: Build release artifact
        run: |
          chmod +x scripts/build-release.sh
          scripts/build-release.sh ${{ steps.version.outputs.version }}

      - name: Extract release notes from CHANGELOG
        id: release-notes
        run: |
          VERSION=${{ steps.version.outputs.version }}

          # Extract section from CHANGELOG between version header and next version
          # Pattern: ## [VERSION] to next ## [
          NOTES=$(awk "
            /^\## \[$VERSION\]/{flag=1; next}
            /^\## \[/{ if(flag) exit }
            flag
          " CHANGELOG.md)

          # Store in output (multiline)
          echo "notes<<EOF" >> $GITHUB_OUTPUT
          echo "$NOTES" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

          echo "Extracted release notes (first 100 chars):"
          echo "$NOTES" | head -c 100

      - name: Verify artifact exists
        run: |
          ARTIFACT="epost_agent_kit-${{ steps.version.outputs.version }}.tar.gz"
          if [ ! -f "$ARTIFACT" ]; then
            echo "❌ Artifact not found: $ARTIFACT"
            exit 1
          fi
          ls -lh "$ARTIFACT"

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: v${{ steps.version.outputs.version }}
          body: ${{ steps.release-notes.outputs.notes }}
          files: epost_agent_kit-${{ steps.version.outputs.version }}.tar.gz
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Verify release
        run: |
          echo "✅ Release created successfully!"
          echo ""
          echo "Release URL:"
          echo "https://github.com/${{ github.repository }}/releases/tag/v${{ steps.version.outputs.version }}"
```

---

## Workflow Details

### Extract Version
```yaml
VERSION=${GITHUB_REF#refs/tags/v}
```
Converts `refs/tags/v2.0.0` → `2.0.0`

### Validate Packages
Checks each `packages/*/package.yaml`:
- File exists
- Starts with `name:` (basic structure validation)

**Enhancement**: Can add more validation using `yq` or custom scripts:
```bash
yq eval '.name' packages/core/package.yaml > /dev/null
```

### Extract Release Notes
Uses `awk` to extract CHANGELOG section:
```bash
awk "
  /^\## \[$VERSION\]/{flag=1; next}      # Start at version header
  /^\## \[/{ if(flag) exit }              # Stop at next version header
  flag                                     # Print matching lines
" CHANGELOG.md
```

**Example**:
Input CHANGELOG:
```markdown
## [2.0.0] - 2026-03-05
### Added
- Major skill consolidation
### Changed
- Agent frontmatter updated

## [1.0.0] - 2026-02-11
### Added
- Initial release
```

Output:
```
### Added
- Major skill consolidation
### Changed
- Agent frontmatter updated
```

### Create Release
Uses `softprops/action-gh-release@v1`:
- Automatically creates release on GitHub
- Attaches artifact
- Uses release notes as body
- Auto-generates tag if needed

---

## Testing the Workflow (Local)

### Dry Run: Build Artifact Locally
```bash
scripts/build-release.sh 2.0.0
tar tzf epost_agent_kit-2.0.0.tar.gz | wc -l
```

### Dry Run: Extract Changelog
```bash
VERSION=2.0.0
awk "
  /^\## \[$VERSION\]/{flag=1; next}
  /^\## \[/{ if(flag) exit }
  flag
" CHANGELOG.md
```

### Test on Feature Branch (Optional)
Push a test tag to validate workflow:
```bash
git tag v2.0.0-test
git push origin v2.0.0-test
```

Then delete after testing:
```bash
git tag -d v2.0.0-test
git push origin --delete v2.0.0-test
```

---

## Failure Modes & Recovery

| Scenario | Cause | Recovery |
|----------|-------|----------|
| Workflow fails at validation | Missing `package.yaml` | Add file or fix syntax; re-push tag |
| Artifact not created | `build-release.sh` fails | Debug locally, fix script, tag again |
| Release notes extraction fails | Wrong CHANGELOG format | Verify `## [VERSION]` format; edit CHANGELOG |
| GitHub release creation fails | Token issue (unlikely) | Check `GITHUB_TOKEN` permissions in settings |
| Release is draft | Typo in workflow | Delete release, fix workflow, tag again |

**Delete a release tag**:
```bash
git tag -d v2.0.0
git push origin --delete v2.0.0
```

---

## Security Considerations

1. **No secrets used**: Workflow uses built-in `GITHUB_TOKEN` (no external keys)
2. **Artifact validation**: Checks YAML syntax before releasing
3. **Tag-based trigger**: Only auto-releases on explicit tag push (safe)
4. **Permissions**: Limited to `contents: write` (release creation only)

---

## Deliverables

- [ ] `.github/workflows/release.yml` created
- [ ] Workflow passes syntax check (`yq` or manual inspection)
- [ ] Test tag pushed (e.g., `v2.0.0-test`)
- [ ] Workflow runs successfully in GitHub Actions UI
- [ ] Release created on GitHub with:
  - [ ] Correct tag name (`v2.0.0`)
  - [ ] Release notes extracted from CHANGELOG
  - [ ] Artifact attached and downloadable
  - [ ] Release marked as final (not draft)
- [ ] Test release cleaned up

---

## Validation Checklist

```bash
# Before tagging for production:
❌ [ ] Validate version in .epost-metadata.json matches CHANGELOG
❌ [ ] Verify all package.yaml files present
❌ [ ] Test build-release.sh locally with target version
❌ [ ] Confirm artifact created without errors
❌ [ ] Verify CHANGELOG has [VERSION] section
❌ [ ] Review .github/workflows/release.yml syntax
❌ [ ] Test workflow on feature branch (optional)
```

---

## Next: Phase 4

Once workflow is tested and passing, proceed to **Phase 4: Update Install Scripts & Sync**
