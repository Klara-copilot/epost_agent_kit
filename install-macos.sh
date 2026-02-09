#!/bin/sh
set -e

# ============================================================================
# epost-kit CLI - macOS Installation Script
# ============================================================================
# This script installs epost-kit CLI from local source at project scope.
#
# Requirements:
#   - Node.js >=18.0.0
#   - npm
#   - Must run from epost-agent-kit/ root directory
#
# Usage:
#   ./install-macos.sh
# ============================================================================

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Output helper functions
info()    { printf "${BLUE}[INFO]${NC} %s\n" "$1"; }
success() { printf "${GREEN}[OK]${NC}   %s\n" "$1"; }
error()   { printf "${RED}[ERR]${NC}  %s\n" "$1"; }
warn()    { printf "${YELLOW}[WARN]${NC} %s\n" "$1"; }

# ============================================================================
# 1. Validate working directory
# ============================================================================

if [ ! -d "epost-agent-cli" ]; then
    error "Must run from epost-agent-kit/ root directory"
    error "Expected epost-agent-cli/ subdirectory not found"
    exit 1
fi

info "Working directory validated"

# ============================================================================
# 2. Detect and validate Node.js
# ============================================================================

if ! command -v node >/dev/null 2>&1; then
    error "Node.js not found"
    # Check if Homebrew available
    if command -v brew >/dev/null 2>&1; then
        warn "Install via Homebrew: brew install node@18"
    else
        warn "Install Node.js: https://nodejs.org/ or use nvm/Homebrew"
    fi
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//')
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
    error "Node.js 18+ required (found v$NODE_VERSION)"
    exit 1
fi
success "Node.js v$NODE_VERSION"

# ============================================================================
# 3. Validate npm
# ============================================================================

if ! command -v npm >/dev/null 2>&1; then
    error "npm not found (should come with Node.js)"
    exit 1
fi
success "npm $(npm -v)"

# ============================================================================
# 4. Install dependencies
# ============================================================================

info "Installing dependencies..."
cd epost-agent-cli

if ! npm install; then
    error "npm install failed"
    exit 1
fi
success "Dependencies installed"

# ============================================================================
# 5. Build TypeScript
# ============================================================================

info "Building CLI..."
if ! npm run build; then
    error "npm run build failed"
    exit 1
fi
success "Build complete"

# ============================================================================
# 6. Link binary (with permission error handling)
# ============================================================================

info "Linking epost-kit..."

# Temporarily disable set -e to catch and handle EACCES
set +e
LINK_ERR=$(mktemp "${TMPDIR:-/tmp}/epost-link-err.XXXXXX")
npm link 2>"$LINK_ERR"
LINK_EXIT=$?
set -e

if [ $LINK_EXIT -ne 0 ]; then
    if grep -qi "EACCES\|permission" "$LINK_ERR" 2>/dev/null; then
        error "Permission denied during npm link"
        warn "Fix: mkdir -p ~/.npm-global && npm config set prefix '~/.npm-global'"
        warn "Then add to ~/.zshrc or ~/.bash_profile: export PATH=~/.npm-global/bin:\$PATH"
    else
        error "npm link failed"
        cat "$LINK_ERR" 2>/dev/null
    fi
    rm -f "$LINK_ERR"
    exit 1
fi

rm -f "$LINK_ERR"
success "epost-kit linked"

# ============================================================================
# 7. Verify installation
# ============================================================================

info "Verifying installation..."

# Get expected version from package.json (we're currently in epost-agent-cli/)
EXPECTED_VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
INSTALLED_VERSION=$(npx epost-kit --version 2>/dev/null || echo "")

if [ "$INSTALLED_VERSION" = "$EXPECTED_VERSION" ]; then
    success "epost-kit v$INSTALLED_VERSION installed successfully"
elif [ -n "$INSTALLED_VERSION" ]; then
    warn "Version check: expected $EXPECTED_VERSION, got '$INSTALLED_VERSION'"
    warn "Installation may have succeeded, but verification returned unexpected version"
else
    warn "Could not verify installation (npx epost-kit --version returned empty)"
fi

# ============================================================================
# 8. Print usage instructions
# ============================================================================

printf "\n${GREEN}✓ Installation complete!${NC}\n\n"
printf "  ${BLUE}Usage:${NC}\n"
printf "    npx epost-kit --help     Show available commands\n"
printf "    npx epost-kit --version  Show installed version\n\n"
printf "  ${BLUE}Location:${NC}\n"
printf "    node_modules/.bin/epost-kit\n\n"
