#!/bin/bash
set -e

# Usage: scripts/build-release.sh [VERSION] [--dry-run]
# If VERSION not provided, reads from ./VERSION file
# Example: scripts/build-release.sh 2.0.0
# Example: scripts/build-release.sh (reads from VERSION file)

# Read version from CLI arg or VERSION file
if [ -n "${1:-}" ] && [[ ! "$1" =~ ^--.* ]]; then
  VERSION="$1"
else
  if [ -f VERSION ]; then
    VERSION=$(cat VERSION)
  else
    echo "Error: Version not provided and VERSION file not found"
    echo "Usage: $0 [VERSION] [--dry-run]"
    exit 1
  fi
fi

# Validate version format
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Invalid version format: $VERSION (expected X.Y.Z)"
  exit 1
fi

BUILD_DIR="epost_agent_kit-${VERSION}"
ARTIFACT="${BUILD_DIR}.tar.gz"

# Check for --dry-run flag (either position 1 or 2 depending on VERSION source)
DRY_RUN=false
for arg in "$@"; do
  if [ "$arg" = "--dry-run" ]; then
    DRY_RUN=true
    break
  fi
done

if [ "$DRY_RUN" = true ]; then
  echo "Dry run: Would create $ARTIFACT"
  exit 0
fi

echo "Building release artifact: $ARTIFACT"

# Clean up old builds
rm -rf "$BUILD_DIR" "$ARTIFACT"
mkdir -p "$BUILD_DIR"

# Copy source files
echo "Packaging source..."
mkdir -p "$BUILD_DIR/packages"
cp -r packages/. "$BUILD_DIR/packages/"

# Optional directories
for DIR in profiles templates; do
  if [ -d "$DIR" ]; then
    cp -r "$DIR" "$BUILD_DIR/"
    echo "Copied $DIR"
  fi
done

cp README.md "$BUILD_DIR/"
cp CHANGELOG.md "$BUILD_DIR/"
cp VERSION "$BUILD_DIR/"
cp .epost-metadata.json "$BUILD_DIR/"

# Create tarball
echo "Compressing..."
tar czf "$ARTIFACT" "$BUILD_DIR"

# Clean up staging dir
rm -rf "$BUILD_DIR"

# Verify
SIZE=$(du -sh "$ARTIFACT" | cut -f1)
FILE_COUNT=$(tar tzf "$ARTIFACT" | wc -l | tr -d ' ')

echo ""
echo "Release artifact created!"
echo "   File: $ARTIFACT"
echo "   Size: $SIZE"
echo "   Files: $FILE_COUNT"
echo ""
echo "Verify contents:"
echo "  tar tzf $ARTIFACT | head -20"
