# Phase 2: Release Artifact & Build Script

**Effort**: 1.5h
**Goal**: Create build script + test artifact structure for distribution

---

## Release Artifact Specification

### What to Include
- `packages/` — All source agents, skills, hooks, scripts (source of truth)
- `profiles/profiles.yaml` — Profile definitions
- `templates/` — Bootstrap templates
- `README.md` — Project readme
- `CHANGELOG.md` — Release notes
- `.epost-metadata.json` — Kit metadata

### What to Exclude
- `.claude/` — Generated output (regenerated on `epost-kit init`)
- `tools/` — Development tools
- `docs/` — Documentation (not needed for distribution)
- `plans/` — Planning docs
- `scripts/` — Build/dev scripts
- `.git/`, `.gitignore`, etc. — Git metadata
- Node modules, lock files, caches

### Output Format
**File**: `epost_agent_kit-{version}.tar.gz`
**Example**: `epost_agent_kit-2.0.0.tar.gz`

**Internal structure**:
```
epost_agent_kit-2.0.0/
├── packages/
│   ├── core/
│   ├── a11y/
│   ├── kit/
│   └── design-system/
├── profiles/
│   └── profiles.yaml
├── templates/
│   └── [template files]
├── README.md
├── CHANGELOG.md
└── .epost-metadata.json
```

---

## Implementation: Build Release Script

Create: `scripts/build-release.sh`

```bash
#!/bin/bash
set -e

# Usage: scripts/build-release.sh [VERSION]
# Example: scripts/build-release.sh 2.0.0

VERSION="${1:?Version not provided. Usage: $0 <VERSION>}"

# Validate version format
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "❌ Invalid version format: $VERSION (expected X.Y.Z)"
  exit 1
fi

BUILD_DIR="epost_agent_kit-${VERSION}"
ARTIFACT="${BUILD_DIR}.tar.gz"

echo "Building release artifact: $ARTIFACT"

# Clean up old builds
rm -rf "$BUILD_DIR" "$ARTIFACT"
mkdir -p "$BUILD_DIR"

# Copy source files
echo "📦 Packaging source..."
cp -r packages/ "$BUILD_DIR/"
cp -r profiles/ "$BUILD_DIR/"
cp -r templates/ "$BUILD_DIR/"
cp README.md "$BUILD_DIR/"
cp CHANGELOG.md "$BUILD_DIR/"
cp .epost-metadata.json "$BUILD_DIR/"

# Create tarball
echo "🗜️  Compressing..."
tar czf "$ARTIFACT" "$BUILD_DIR"

# Verify
SIZE=$(du -sh "$ARTIFACT" | cut -f1)
FILE_COUNT=$(tar tzf "$ARTIFACT" | wc -l)

echo ""
echo "✅ Release artifact created!"
echo "   File: $ARTIFACT"
echo "   Size: $SIZE"
echo "   Files: $FILE_COUNT"
echo ""
echo "Verify contents:"
echo "  tar tzf $ARTIFACT | head -20"
```

---

## Implementation Details

### Make Script Executable
```bash
chmod +x scripts/build-release.sh
```

### Test Locally

1. **Run build**:
   ```bash
   scripts/build-release.sh 2.0.0
   ```

2. **Verify structure**:
   ```bash
   tar tzf epost_agent_kit-2.0.0.tar.gz | head -20
   ```

   Expected output:
   ```
   epost_agent_kit-2.0.0/
   epost_agent_kit-2.0.0/packages/
   epost_agent_kit-2.0.0/packages/core/
   epost_agent_kit-2.0.0/packages/core/package.yaml
   epost_agent_kit-2.0.0/packages/a11y/
   ...
   ```

3. **Extract and inspect**:
   ```bash
   mkdir -p /tmp/test-release
   tar xzf epost_agent_kit-2.0.0.tar.gz -C /tmp/test-release
   ls -la /tmp/test-release/epost_agent_kit-2.0.0/
   ```

4. **Verify key files exist**:
   ```bash
   test -f /tmp/test-release/epost_agent_kit-2.0.0/packages/core/package.yaml && echo "✓ packages found"
   test -f /tmp/test-release/epost_agent_kit-2.0.0/CHANGELOG.md && echo "✓ CHANGELOG found"
   test -f /tmp/test-release/epost_agent_kit-2.0.0/.epost-metadata.json && echo "✓ metadata found"
   ```

### Size & Content Check

The artifact should be:
- **Size**: 2-4 MB (compressed)
- **File count**: 300-500 files
- **No `.git/` or `node_modules/` present**

Check for unwanted files:
```bash
tar tzf epost_agent_kit-2.0.0.tar.gz | grep -E "(\\.git|node_modules|tools|scripts|plans)" || echo "✓ No unwanted directories"
```

---

## Edge Cases & Robustness

### Handling Missing Directories
If `profiles/` or `templates/` don't exist, script should gracefully skip:

```bash
# Modified version with optional dirs
for DIR in profiles templates; do
  if [ -d "$DIR" ]; then
    cp -r "$DIR" "$BUILD_DIR/"
    echo "✓ Copied $DIR"
  fi
done
```

### Version String Validation
Enforce semver format before building:

```bash
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "❌ Invalid version: $VERSION (expected X.Y.Z)"
  exit 1
fi
```

### Dry Run Option
Add `--dry-run` flag to preview without creating tarball:

```bash
if [ "$2" = "--dry-run" ]; then
  echo "🔍 Dry run: Would create $ARTIFACT"
  exit 0
fi
```

---

## Deliverables

- [ ] `scripts/build-release.sh` created
- [ ] Script tested locally with `v2.0.0`
- [ ] Artifact created: `epost_agent_kit-2.0.0.tar.gz`
- [ ] Artifact verified:
  - [ ] Structure correct
  - [ ] Key files present
  - [ ] No unwanted files (git, node_modules, scripts, plans)
  - [ ] File count expected (300-500)
- [ ] Size reasonable (<5 MB)
- [ ] Test extraction successful

---

## Next: Phase 3

Once artifact builds successfully, proceed to **Phase 3: GitHub Actions Release Workflow**
