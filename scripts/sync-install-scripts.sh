#!/bin/bash
set -e

# Sync install scripts from this repo to the standalone CLI repo
# Usage: scripts/sync-install-scripts.sh [CLI_REPO_PATH]
# Default CLI_REPO_PATH: ../epost-agent-kit-cli

CLI_REPO="${1:-../epost-agent-kit-cli}"

if [ ! -d "$CLI_REPO" ]; then
  echo "CLI repo not found at: $CLI_REPO"
  echo "Usage: $0 [path-to-cli-repo]"
  echo "Make sure epost-agent-kit-cli is cloned next to this repo"
  exit 1
fi

echo "Syncing install scripts to: $CLI_REPO"

# Create install directory in CLI repo if needed
mkdir -p "$CLI_REPO/install"

# Sync main install scripts to install/ directory
SYNCED=0
for script in install.sh install.ps1 install.cmd; do
  if [ -f "$script" ]; then
    cp "$script" "$CLI_REPO/install/$script"
    echo "✓ Synced: $script"
    SYNCED=$((SYNCED + 1))
  else
    echo "⚠ Skipped (not found): $script"
  fi
done

echo ""
echo "✅ Sync complete: $SYNCED file(s) copied"
echo ""
echo "Review changes in CLI repo:"
echo "  cd $CLI_REPO && git status"
echo ""
echo "Commit if satisfied:"
echo "  cd $CLI_REPO && git add install/ && git commit -m 'sync: update install scripts from epost_agent_kit'"
