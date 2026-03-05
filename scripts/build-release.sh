#!/bin/bash
set -e

# Usage: scripts/build-release.sh [VERSION] [--dry-run]
# Example: scripts/build-release.sh 2.0.0

VERSION="${1:?Version not provided. Usage: $0 <VERSION> [--dry-run]}"

# Validate version format
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Invalid version format: $VERSION (expected X.Y.Z)"
  exit 1
fi

BUILD_DIR="epost_agent_kit-${VERSION}"
ARTIFACT="${BUILD_DIR}.tar.gz"

if [ "$2" = "--dry-run" ]; then
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
