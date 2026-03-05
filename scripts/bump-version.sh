#!/bin/bash

# bump-version.sh — Atomic version bump across all packages
# Usage: ./scripts/bump-version.sh 2.1.0

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VERSION="${1:-}"

if [[ -z "$VERSION" ]]; then
  echo -e "${RED}Error: Version argument required${NC}"
  echo "Usage: ./scripts/bump-version.sh 2.1.0"
  exit 1
fi

# Validate semver format (MAJOR.MINOR.PATCH)
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo -e "${RED}Error: Invalid semver format: $VERSION${NC}"
  echo "Expected format: MAJOR.MINOR.PATCH (e.g., 2.1.0)"
  exit 1
fi

echo -e "${YELLOW}Bumping version to $VERSION...${NC}"

# Step 1: Update VERSION file
echo "$VERSION" > VERSION
echo -e "${GREEN}✓ Updated VERSION file${NC}"

# Step 2: Update all packages/*/package.yaml version fields
for pkg_yaml in packages/*/package.yaml; do
  if [[ -f "$pkg_yaml" ]]; then
    sed -i.bak "s/^version: \"[^\"]*\"$/version: \"$VERSION\"/" "$pkg_yaml"
    rm -f "$pkg_yaml.bak"
    echo -e "${GREEN}✓ Updated $pkg_yaml${NC}"
  fi
done

# Step 3: Update .epost-metadata.json kitVersion field
if [[ -f ".epost-metadata.json" ]]; then
  # Use sed for cross-platform compatibility (macOS/Linux)
  sed -i.bak "s/\"kitVersion\": \"[^\"]*\"/\"kitVersion\": \"$VERSION\"/" .epost-metadata.json
  rm -f .epost-metadata.json.bak
  echo -e "${GREEN}✓ Updated .epost-metadata.json${NC}"
fi

# Step 4: Add CHANGELOG skeleton entry if not present
if [[ -f "CHANGELOG.md" ]]; then
  if ! grep -q "## \[$VERSION\]" CHANGELOG.md; then
    TODAY=$(date +"%Y-%m-%d")

    # Create temp file with new entry
    {
      echo "## [$VERSION] - $TODAY"
      echo ""
      echo "### Added"
      echo "- "
      echo ""
      echo "### Changed"
      echo "- "
      echo ""
      echo "### Fixed"
      echo "- "
      echo ""
      echo "## [Unreleased]"
      echo ""
      # Skip first 2 lines (## [Unreleased] and blank line)
      tail -n +3 CHANGELOG.md
    } > CHANGELOG.md.tmp

    mv CHANGELOG.md.tmp CHANGELOG.md
    echo -e "${GREEN}✓ Added CHANGELOG entry for [$VERSION]${NC}"
  else
    echo -e "${YELLOW}⚠ CHANGELOG already has entry for [$VERSION]${NC}"
  fi
fi

# Step 5: Print summary
echo ""
echo -e "${GREEN}Version bump complete!${NC}"
echo ""
echo "Summary:"
echo "  VERSION: $VERSION"
echo "  Modified: VERSION, packages/*/package.yaml, .epost-metadata.json, CHANGELOG.md"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Update CHANGELOG.md with actual release notes"
echo "  3. Commit: git add . && git commit -m 'chore: bump version to $VERSION'"
echo "  4. Tag: git tag -a v$VERSION -m 'Release version $VERSION'"
echo "  5. Push: git push origin master && git push origin v$VERSION"
