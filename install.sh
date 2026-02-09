#!/bin/sh
# ============================================================================
# epost-kit CLI - Universal Installation Script
# ============================================================================
# This script installs epost-kit CLI globally via npm.
#
# NOTE: This script is currently available for local testing only.
#       Curl installation will work when the repository becomes public.
#
# Usage:
#   Local execution:
#     ./install.sh
#
#   Future (when repository is public):
#     curl -fsSL https://raw.githubusercontent.com/Klara-copilot/epost_agent_kit/main/install.sh | bash
#
# Requirements:
#   - Node.js >=18.0.0
#   - npm
# ============================================================================

set -e

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Output helper functions
info()    { printf "${BLUE}ℹ${NC} %s\n" "$1"; }
success() { printf "${GREEN}✓${NC} %s\n" "$1"; }
error()   { printf "${RED}✗${NC} %s\n" "$1" >&2; }
warn()    { printf "${YELLOW}⚠${NC} %s\n" "$1"; }
header()  { printf "\n${CYAN}%s${NC}\n" "$1"; }

# ============================================================================
# 1. Display welcome banner
# ============================================================================

header "╔═══════════════════════════════════════════════════════╗"
header "║         epost-kit CLI Installation Script           ║"
header "╚═══════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# 2. Detect platform (informational only)
# ============================================================================

PLATFORM=$(uname -s)
case "$PLATFORM" in
    Darwin*)  PLATFORM_NAME="macOS" ;;
    Linux*)   PLATFORM_NAME="Linux" ;;
    MINGW*|MSYS*|CYGWIN*) PLATFORM_NAME="Windows (Git Bash/WSL)" ;;
    *)        PLATFORM_NAME="$PLATFORM" ;;
esac

info "Platform: $PLATFORM_NAME"

# ============================================================================
# 3. Check Node.js
# ============================================================================

if ! command -v node >/dev/null 2>&1; then
    error "Node.js not found"
    echo ""
    echo "Please install Node.js 18+ from https://nodejs.org/"
    echo ""
    case "$PLATFORM" in
        Darwin*)
            echo "Or install via Homebrew:"
            echo "  brew install node@20"
            ;;
        Linux*)
            echo "Or install via package manager:"
            echo "  Ubuntu/Debian: sudo apt install nodejs npm"
            echo "  Fedora/RHEL:   sudo dnf install nodejs npm"
            ;;
    esac
    exit 1
fi

NODE_VERSION=$(node -v)
NODE_MAJOR=$(echo "$NODE_VERSION" | sed 's/v//' | cut -d. -f1)

if [ "$NODE_MAJOR" -lt 18 ]; then
    error "Node.js 18+ required (found $NODE_VERSION)"
    echo ""
    echo "Please upgrade Node.js: https://nodejs.org/"
    exit 1
fi

success "Node.js $NODE_VERSION"

# ============================================================================
# 4. Check npm
# ============================================================================

if ! command -v npm >/dev/null 2>&1; then
    error "npm not found (should come with Node.js)"
    exit 1
fi

NPM_VERSION=$(npm -v)
success "npm v$NPM_VERSION"

# ============================================================================
# 5. Install CLI globally
# ============================================================================

echo ""
info "Installing epost-kit globally..."
echo ""

# Check if npm prefix is configured
NPM_PREFIX=$(npm config get prefix 2>/dev/null || echo "")
if [ -z "$NPM_PREFIX" ] || [ "$NPM_PREFIX" = "undefined" ]; then
    warn "npm prefix not configured, using default"
fi

# Attempt global install
set +e
INSTALL_OUTPUT=$(mktemp "${TMPDIR:-/tmp}/epost-install.XXXXXX")
npm install -g epost-kit 2>&1 | tee "$INSTALL_OUTPUT"
INSTALL_EXIT=$?
set -e

if [ $INSTALL_EXIT -ne 0 ]; then
    # Check for permission errors
    if grep -qi "EACCES\|permission denied" "$INSTALL_OUTPUT" 2>/dev/null; then
        error "Permission denied during npm install"
        echo ""
        echo "Fix permission issues with one of these methods:"
        echo ""
        echo "Option 1: Configure npm to use user directory (recommended)"
        echo "  mkdir -p ~/.npm-global"
        echo "  npm config set prefix '~/.npm-global'"
        echo "  echo 'export PATH=~/.npm-global/bin:\$PATH' >> ~/.bashrc  # or ~/.zshrc"
        echo "  source ~/.bashrc  # or source ~/.zshrc"
        echo "  npm install -g epost-kit"
        echo ""
        echo "Option 2: Use sudo (not recommended)"
        echo "  sudo npm install -g epost-kit"
        echo ""
    else
        error "Installation failed"
        cat "$INSTALL_OUTPUT"
    fi
    rm -f "$INSTALL_OUTPUT"
    exit 1
fi

rm -f "$INSTALL_OUTPUT"
echo ""
success "Installation complete"

# ============================================================================
# 6. Verify installation
# ============================================================================

echo ""
info "Verifying installation..."

if command -v epost-kit >/dev/null 2>&1; then
    INSTALLED_VERSION=$(epost-kit --version 2>/dev/null || echo "unknown")
    success "epost-kit v$INSTALLED_VERSION"

    # Display success banner
    echo ""
    header "╔═══════════════════════════════════════════════════════╗"
    header "║            Installation Successful! 🎉               ║"
    header "╚═══════════════════════════════════════════════════════╝"
    echo ""

    # Display usage instructions
    printf "${CYAN}Quick Start:${NC}\n"
    printf "  ${GREEN}epost-kit --help${NC}      Show available commands\n"
    printf "  ${GREEN}epost-kit --version${NC}   Show installed version\n"
    printf "  ${GREEN}epost-kit install${NC}     Install kit to current project\n"
    echo ""

    printf "${CYAN}Documentation:${NC}\n"
    printf "  https://github.com/Klara-copilot/epost-agent-kit\n"
    echo ""

else
    warn "Installation succeeded but 'epost-kit' command not found in PATH"
    echo ""
    echo "This might be because:"
    echo "  1. npm global bin directory is not in your PATH"
    echo "  2. You need to restart your terminal"
    echo ""
    echo "Try running:"
    echo "  npx epost-kit --version"
    echo ""
    echo "To fix PATH, add npm global bin to your shell profile:"
    NPM_BIN=$(npm bin -g 2>/dev/null || echo "~/.npm-global/bin")
    echo "  echo 'export PATH=\"$NPM_BIN:\$PATH\"' >> ~/.bashrc  # or ~/.zshrc"
    echo "  source ~/.bashrc  # or source ~/.zshrc"
    echo ""
fi
