#!/bin/bash
# Validate all version strings match before tagging
# Usage: scripts/validate-release-version.sh <VERSION>
# Example: scripts/validate-release-version.sh 2.0.0

TARGET_VERSION="${1:?Version not provided. Usage: $0 <VERSION>}"
ERRORS=0

echo "Validating version: $TARGET_VERSION"

# Check .epost-metadata.json
META_VERSION=$(grep -o '"kitVersion": *"[^"]*"' .epost-metadata.json | cut -d'"' -f4)
if [ "$META_VERSION" = "$TARGET_VERSION" ]; then
  echo "OK .epost-metadata.json: $TARGET_VERSION"
else
  echo "FAIL .epost-metadata.json: $META_VERSION (expected $TARGET_VERSION)"
  ERRORS=$((ERRORS + 1))
fi

# Check CHANGELOG.md
if grep -q "^## \[$TARGET_VERSION\]" CHANGELOG.md; then
  echo "OK CHANGELOG.md: [$TARGET_VERSION] found"
else
  echo "FAIL CHANGELOG.md: [$TARGET_VERSION] not found"
  ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -eq 0 ]; then
  echo ""
  echo "All version checks passed."
else
  echo ""
  echo "FAILED: $ERRORS check(s) failed."
fi

exit $ERRORS
