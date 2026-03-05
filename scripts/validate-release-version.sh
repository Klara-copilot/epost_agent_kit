#!/bin/bash
# Validate all version strings match before tagging
# Usage: scripts/validate-release-version.sh <VERSION>
# Example: scripts/validate-release-version.sh 2.0.0

TARGET_VERSION="${1:?Version not provided. Usage: $0 <VERSION>}"
ERRORS=0

echo "Validating version: $TARGET_VERSION"
echo ""

# Check VERSION file
if [ -f VERSION ]; then
  FILE_VERSION=$(cat VERSION)
  if [ "$FILE_VERSION" = "$TARGET_VERSION" ]; then
    echo "✓ VERSION file: $TARGET_VERSION"
  else
    echo "✗ VERSION file: $FILE_VERSION (expected $TARGET_VERSION)"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "✗ VERSION file not found"
  ERRORS=$((ERRORS + 1))
fi

# Check all packages/*/package.yaml
PKG_ERRORS=0
for pkg_yaml in packages/*/package.yaml; do
  if [ -f "$pkg_yaml" ]; then
    PKG_VERSION=$(grep -o 'version: "[^"]*"' "$pkg_yaml" | cut -d'"' -f2)
    if [ "$PKG_VERSION" = "$TARGET_VERSION" ]; then
      echo "✓ $pkg_yaml: $TARGET_VERSION"
    else
      echo "✗ $pkg_yaml: $PKG_VERSION (expected $TARGET_VERSION)"
      PKG_ERRORS=$((PKG_ERRORS + 1))
    fi
  fi
done
ERRORS=$((ERRORS + PKG_ERRORS))

# Check .epost-metadata.json
META_VERSION=$(grep -o '"kitVersion": *"[^"]*"' .epost-metadata.json | cut -d'"' -f4)
if [ "$META_VERSION" = "$TARGET_VERSION" ]; then
  echo "✓ .epost-metadata.json: $TARGET_VERSION"
else
  echo "✗ .epost-metadata.json: $META_VERSION (expected $TARGET_VERSION)"
  ERRORS=$((ERRORS + 1))
fi

# Check CHANGELOG.md
if grep -q "^## \[$TARGET_VERSION\]" CHANGELOG.md; then
  echo "✓ CHANGELOG.md: [$TARGET_VERSION] found"
else
  echo "✗ CHANGELOG.md: [$TARGET_VERSION] not found"
  ERRORS=$((ERRORS + 1))
fi

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "All version checks passed."
  exit 0
else
  echo "FAILED: $ERRORS check(s) failed."
  exit 1
fi
