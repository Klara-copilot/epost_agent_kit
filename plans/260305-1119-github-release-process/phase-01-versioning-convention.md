# Phase 1: Versioning & CHANGELOG Convention

**Effort**: 1h
**Goal**: Define unified version across all files, establish release tagging convention

---

## Current State

| File | Version | Purpose |
|------|---------|---------|
| `.epost-metadata.json` | `kitVersion: 1.0.0` | Kit release version (source of truth) |
| `packages/core/package.yaml` | `version: 2.0.0` | Core package version |
| `packages/a11y/package.yaml` | `version: 1.0.0` | A11y package version |
| `packages/kit/package.yaml` | `version: 1.1.0` | Kit package version |
| `packages/design-system/package.yaml` | `version: 1.0.0` | Design system package version |
| `CHANGELOG.md` | `[Unreleased]` section | Keep a Changelog format |

**Problem**: Versions are fragmented. Release version unclear.

---

## Decision: Use kitVersion as Release Version

**Rationale**:
- `.epost-metadata.json` is root metadata file
- `kitVersion` represents the **overall kit release** (not individual packages)
- Individual `package.yaml` versions track package changes within releases

**Convention**:
- Release tag: `v{kitVersion}` (e.g., `v2.0.0`)
- CHANGELOG: `[{kitVersion}] - YYYY-MM-DD` (e.g., `[2.0.0] - 2026-03-05`)
- Individual package versions move independently within releases

---

## Implementation Steps

### Step 1: Determine Target Release Version
Check current versions:
```bash
cat .epost-metadata.json | grep kitVersion
grep version packages/*/package.yaml
```

**Decision point**:
- If aligning with core package (`2.0.0`), bump kitVersion to `2.0.0`
- If doing patch release, bump to `1.0.1`
- Recommend: `2.0.0` (matches largest package version + new architecture)

### Step 2: Update kitVersion
File: `.epost-metadata.json`
```json
{
  "kitVersion": "2.0.0",
  "packages": [...]
}
```

### Step 3: Update CHANGELOG
File: `CHANGELOG.md`

Find section:
```markdown
## [Unreleased]

### Added
- Major skill consolidation (variants → flags)
- Removed epost-agent-cli subdirectory
- A11y workflow refactor

### Changed
- Agent frontmatter updated

### Removed
- Obsolete platform skills
```

Replace with:
```markdown
## [2.0.0] - 2026-03-05

### Added
- Major skill consolidation (variants → flags)
- Removed epost-agent-cli subdirectory
- A11y workflow refactor

### Changed
- Agent frontmatter updated

### Removed
- Obsolete platform skills

## [Unreleased]

(No entries yet)
```

Add link at bottom:
```markdown
[2.0.0]: https://github.com/Klara-copilot/epost_agent_kit/releases/tag/v2.0.0
```

### Step 4: Create Version Validation Script
Optional but recommended. File: `scripts/validate-release-version.sh`

```bash
#!/bin/bash
# Validate all version strings match

TARGET_VERSION="$1"
ERRORS=0

echo "Validating version: $TARGET_VERSION"

# Check .epost-metadata.json
META_VERSION=$(grep -o '"kitVersion"[^}]*' .epost-metadata.json | cut -d'"' -f4)
if [ "$META_VERSION" != "$TARGET_VERSION" ]; then
  echo "❌ .epost-metadata.json: $META_VERSION (expected $TARGET_VERSION)"
  ERRORS=$((ERRORS + 1))
else
  echo "✓ .epost-metadata.json: $TARGET_VERSION"
fi

# Check CHANGELOG.md
if grep -q "^\## \[$TARGET_VERSION\]" CHANGELOG.md; then
  echo "✓ CHANGELOG.md: [$TARGET_VERSION] found"
else
  echo "❌ CHANGELOG.md: [$TARGET_VERSION] not found"
  ERRORS=$((ERRORS + 1))
fi

exit $ERRORS
```

Run before tagging:
```bash
scripts/validate-release-version.sh 2.0.0
```

---

## Deliverables

- [ ] `.epost-metadata.json` updated with target version
- [ ] `CHANGELOG.md` moved `[Unreleased]` → `[2.0.0] - YYYY-MM-DD`
- [ ] Version link added to CHANGELOG footer
- [ ] `scripts/validate-release-version.sh` created (optional)
- [ ] Manual verification: `grep kitVersion .epost-metadata.json`

---

## Next: Phase 2

Once versioning is finalized, proceed to **Phase 2: Release Artifact & Build Script**
