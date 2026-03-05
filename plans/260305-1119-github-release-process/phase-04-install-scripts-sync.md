# Phase 4: Update Install Scripts & Sync to CLI Repo

**Effort**: 1h
**Goal**: Fix stale install scripts + sync to standalone CLI repo

---

## Problem

Install scripts in this repo reference `epost-agent-cli/` subdirectory which was removed in the consolidation.

Current stale scripts:
- `install-macos.sh` — References `epost-agent-cli/` (❌ invalid)
- `install.ps1` — May have stale paths
- `install.cmd` — May have stale paths

These are also used by `epost-agent-kit-cli/install/` directory (standalone repo).

---

## Solution: Two-Step Sync

### Step 1: Update Scripts in This Repo

**Files to update**:
1. `install-macos.sh`
2. `install.ps1`
3. `install.cmd`
4. `install/README.md` (if exists)

**Strategy**: Remove references to `epost-agent-cli/`, update to work with standalone CLI.

#### Option A: Use GitHub Releases (Recommended)

Instead of local paths, download from GitHub releases:

**File**: `install-macos.sh`

```bash
#!/bin/bash

set -e

# epost_agent_kit installer for macOS
# Downloads and installs the latest release from GitHub

VERSION_URL="https://api.github.com/repos/Klara-copilot/epost_agent_kit/releases/latest"
RELEASE_URL=$(curl -s "$VERSION_URL" | grep -o '"browser_download_url": "[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$RELEASE_URL" ]; then
  echo "❌ Failed to get download URL"
  exit 1
fi

ARTIFACT=$(basename "$RELEASE_URL")
EXTRACT_DIR="/tmp/epost_agent_kit_install"
INSTALL_DIR="${INSTALL_DIR:-$HOME/.epost}"

echo "📥 Downloading $ARTIFACT..."
mkdir -p "$EXTRACT_DIR"
cd "$EXTRACT_DIR"
curl -L -o "$ARTIFACT" "$RELEASE_URL"

echo "📦 Extracting..."
tar xzf "$ARTIFACT"

# Find extracted directory (may vary by version)
EXTRACTED_DIR=$(ls -d epost_agent_kit-* 2>/dev/null | head -1)

if [ -z "$EXTRACTED_DIR" ]; then
  echo "❌ Failed to extract archive"
  exit 1
fi

echo "✓ Extracted: $EXTRACTED_DIR"
echo "📂 Installing to $INSTALL_DIR..."

mkdir -p "$INSTALL_DIR"
cp -r "$EXTRACTED_DIR/packages" "$INSTALL_DIR/"
cp "$EXTRACTED_DIR/.epost-metadata.json" "$INSTALL_DIR/"
if [ -d "$EXTRACTED_DIR/profiles" ]; then
  cp -r "$EXTRACTED_DIR/profiles" "$INSTALL_DIR/"
fi
if [ -d "$EXTRACTED_DIR/templates" ]; then
  cp -r "$EXTRACTED_DIR/templates" "$INSTALL_DIR/"
fi

echo "✅ Installation complete!"
echo ""
echo "Next: Install the CLI globally:"
echo "  npm install -g epost-agent-kit-cli"
echo ""
echo "Or use via npx:"
echo "  npx epost-agent-kit-cli init"

# Cleanup
cd /
rm -rf "$EXTRACT_DIR"
```

**File**: `install.ps1` (PowerShell)

```powershell
# epost_agent_kit installer for Windows
# Downloads and installs the latest release from GitHub

$ErrorActionPreference = "Stop"

$VersionUrl = "https://api.github.com/repos/Klara-copilot/epost_agent_kit/releases/latest"
$Response = Invoke-WebRequest -Uri $VersionUrl -UseBasicParsing
$ReleaseUrl = ($Response.Content | ConvertFrom-Json).assets[0].browser_download_url

if (-not $ReleaseUrl) {
    Write-Host "❌ Failed to get download URL"
    exit 1
}

$Artifact = Split-Path -Leaf $ReleaseUrl
$ExtractDir = Join-Path $env:TEMP "epost_agent_kit_install"
$InstallDir = $env:INSTALL_DIR ?? (Join-Path $env:USERPROFILE ".epost")

Write-Host "📥 Downloading $Artifact..."
New-Item -ItemType Directory -Force -Path $ExtractDir | Out-Null
$DownloadPath = Join-Path $ExtractDir $Artifact
Invoke-WebRequest -Uri $ReleaseUrl -OutFile $DownloadPath

Write-Host "📦 Extracting..."
Expand-Archive -Path $DownloadPath -DestinationPath $ExtractDir -Force

$ExtractedDir = Get-ChildItem -Directory -Path $ExtractDir -Filter "epost_agent_kit-*" | Select-Object -First 1

if (-not $ExtractedDir) {
    Write-Host "❌ Failed to extract archive"
    exit 1
}

Write-Host "✓ Extracted: $($ExtractedDir.Name)"
Write-Host "📂 Installing to $InstallDir..."

New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
Copy-Item -Path "$($ExtractedDir.FullName)\packages" -Destination $InstallDir -Recurse -Force
Copy-Item -Path "$($ExtractedDir.FullName)\.epost-metadata.json" -Destination $InstallDir -Force
if (Test-Path "$($ExtractedDir.FullName)\profiles") {
    Copy-Item -Path "$($ExtractedDir.FullName)\profiles" -Destination $InstallDir -Recurse -Force
}
if (Test-Path "$($ExtractedDir.FullName)\templates") {
    Copy-Item -Path "$($ExtractedDir.FullName)\templates" -Destination $InstallDir -Recurse -Force
}

Write-Host "✅ Installation complete!"
Write-Host ""
Write-Host "Next: Install the CLI globally:"
Write-Host "  npm install -g epost-agent-kit-cli"

# Cleanup
Remove-Item -Path $ExtractDir -Recurse -Force -ErrorAction SilentlyContinue
```

**File**: `install.cmd` (Batch)

```batch
@echo off
REM epost_agent_kit installer for Windows (Batch)

setlocal enabledelayedexpansion

echo 📥 Downloading latest release...

REM Using PowerShell to download (more reliable than curl)
powershell -Command ^
  "$ProgressPreference = 'SilentlyContinue'; " ^
  "$url = 'https://api.github.com/repos/Klara-copilot/epost_agent_kit/releases/latest'; " ^
  "$release = Invoke-WebRequest -Uri $url -UseBasicParsing | ConvertFrom-Json; " ^
  "$download = $release.assets[0].browser_download_url; " ^
  "echo $download"

echo.
echo ✅ Use install.ps1 for better Windows support:
echo   powershell -ExecutionPolicy Bypass -File install.ps1
echo.
echo Or install via npm:
echo   npm install -g epost-agent-kit-cli
```

---

### Step 2: Sync to CLI Repo

Create sync script: `scripts/sync-install-scripts.sh`

```bash
#!/bin/bash
set -e

CLI_REPO="../epost-agent-kit-cli"

if [ ! -d "$CLI_REPO" ]; then
  echo "❌ CLI repo not found at: $CLI_REPO"
  echo "Make sure epost-agent-kit-cli is cloned next to this repo"
  exit 1
fi

echo "🔄 Syncing install scripts..."

# Create CLI install directory if needed
mkdir -p "$CLI_REPO/install"

# Sync scripts
for script in install-macos.sh install.ps1 install.cmd install/README.md; do
  if [ -f "$script" ]; then
    echo "✓ Syncing: $script"
    cp "$script" "$CLI_REPO/$script"
  fi
done

# Verify
echo ""
echo "✅ Sync complete!"
echo ""
echo "Changes in CLI repo:"
cd "$CLI_REPO"
git status

echo ""
echo "Next steps:"
echo "  1. Review changes in CLI repo"
echo "  2. Commit and push in CLI repo separately"
```

Run sync:
```bash
chmod +x scripts/sync-install-scripts.sh
scripts/sync-install-scripts.sh
```

---

## Update README.md

File: `README.md` (Quick Start section)

**Before**:
```markdown
## Quick Start

Run `install-macos.sh` (macOS) or `install.ps1` (Windows).
```

**After**:
```markdown
## Quick Start

### Option 1: Download Latest Release (Recommended)
```bash
# macOS/Linux
bash <(curl -s https://raw.githubusercontent.com/Klara-copilot/epost_agent_kit/master/install-macos.sh)

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File install.ps1
```

### Option 2: Install via npm
```bash
npm install -g epost-agent-kit-cli
epost-kit init
```

### Option 3: Use npx (no install needed)
```bash
npx epost-agent-kit-cli init
```
```

---

## Testing

### Test macOS Script
```bash
bash install-macos.sh
# Verify files downloaded and extracted
ls -la ~/.epost/packages/ | head
```

### Test Windows Script
```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
# Verify files in %USERPROFILE%\.epost\packages\
```

### Test Sync Script
```bash
scripts/sync-install-scripts.sh

# Verify files copied to CLI repo
ls -la ../epost-agent-kit-cli/install/
```

---

## Deliverables

- [ ] `install-macos.sh` updated (no `epost-agent-cli/` references)
- [ ] `install.ps1` updated
- [ ] `install.cmd` updated
- [ ] `install/README.md` exists with documentation
- [ ] `scripts/sync-install-scripts.sh` created
- [ ] Scripts tested locally:
  - [ ] macOS script downloads and extracts
  - [ ] Windows script syntax valid
  - [ ] Sync script copies files to CLI repo
- [ ] `README.md` Quick Start updated
- [ ] CLI repo received synced files

---

## Next: Phase 5

Once scripts are updated and synced, proceed to **Phase 5: Release Runbook & Documentation**
