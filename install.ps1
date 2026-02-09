# ============================================================================
# epost-kit CLI - Windows PowerShell Installation Script
# ============================================================================
# This script installs epost-kit CLI from local source at project scope.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File install.ps1
#
# Requirements:
#   - PowerShell 5.1+
#   - Node.js >=18.0.0
#   - npm
#   - Must run from epost-agent-kit\ root directory
# ============================================================================

# Output helper functions
function Write-Info  { param([string]$Msg) Write-Host "[INFO] $Msg" -ForegroundColor Cyan }
function Write-Ok    { param([string]$Msg) Write-Host "[OK]   $Msg" -ForegroundColor Green }
function Write-Err   { param([string]$Msg) Write-Host "[ERR]  $Msg" -ForegroundColor Red }
function Write-Warn  { param([string]$Msg) Write-Host "[WARN] $Msg" -ForegroundColor Yellow }

# Save original directory for cleanup
$OriginalDir = Get-Location

# ============================================================================
# 1. Validate working directory
# ============================================================================

if (-not (Test-Path "epost-agent-cli")) {
    Write-Err "Must run from epost-agent-kit\ root directory"
    Write-Err "Expected epost-agent-cli\ subdirectory not found"
    exit 1
}

Write-Info "Working directory validated"

# ============================================================================
# 2. Detect and validate Node.js
# ============================================================================

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Err "Node.js not found"
    Write-Warn "Install options:"
    Write-Warn "  - https://nodejs.org/ (official installer)"
    Write-Warn "  - nvm-windows: https://github.com/coreybutler/nvm-windows"
    Write-Warn "  - volta: https://volta.sh/"
    exit 1
}

$nodeVerRaw = (node -v) -replace '^v', ''
try {
    $nodeVer = [version]$nodeVerRaw
} catch {
    Write-Err "Could not parse Node.js version: $nodeVerRaw"
    exit 1
}

if ($nodeVer -lt [version]"18.0.0") {
    Write-Err "Node.js 18+ required (found v$nodeVerRaw)"
    exit 1
}
Write-Ok "Node.js v$nodeVerRaw"

# ============================================================================
# 3. Validate npm
# ============================================================================

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Err "npm not found (should come with Node.js)"
    exit 1
}
$npmVer = npm -v
Write-Ok "npm $npmVer"

# ============================================================================
# 4. Install dependencies
# ============================================================================

Write-Info "Installing dependencies..."
Set-Location "epost-agent-cli"

npm install
if ($LASTEXITCODE -ne 0) {
    Write-Err "npm install failed (exit code $LASTEXITCODE)"
    Set-Location $OriginalDir
    exit 1
}
Write-Ok "Dependencies installed"

# ============================================================================
# 5. Build TypeScript
# ============================================================================

Write-Info "Building CLI..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Err "npm run build failed (exit code $LASTEXITCODE)"
    Set-Location $OriginalDir
    exit 1
}
Write-Ok "Build complete"

# ============================================================================
# 6. Link binary
# ============================================================================

Write-Info "Linking epost-kit..."
npm link
if ($LASTEXITCODE -ne 0) {
    Write-Err "npm link failed (exit code $LASTEXITCODE)"
    Write-Warn "Try running PowerShell as Administrator if permission denied"
    Set-Location $OriginalDir
    exit 1
}
Write-Ok "epost-kit linked"

# ============================================================================
# 7. Verify installation
# ============================================================================

Write-Info "Verifying installation..."

# Get expected version from package.json
$packageJson = Get-Content "epost-agent-cli\package.json" | ConvertFrom-Json
$expectedVersion = $packageJson.version

try {
    $installedVersion = npx epost-kit --version 2>$null
} catch {
    $installedVersion = ""
}

if ($installedVersion -eq $expectedVersion) {
    Write-Ok "epost-kit v$installedVersion installed successfully"
} elseif ($installedVersion) {
    Write-Warn "Version check: expected $expectedVersion, got '$installedVersion'"
    Write-Warn "Installation may have succeeded, but verification returned unexpected version"
} else {
    Write-Warn "Could not verify installation (npx epost-kit --version returned empty)"
}

# ============================================================================
# 8. Print usage instructions and restore directory
# ============================================================================

Set-Location $OriginalDir

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "  Usage:" -ForegroundColor Cyan
Write-Host "    npx epost-kit --help     Show available commands"
Write-Host "    npx epost-kit --version  Show installed version"
Write-Host ""
Write-Host "  Location:" -ForegroundColor Cyan
Write-Host "    node_modules\.bin\epost-kit"
Write-Host ""

exit 0
