@echo off
setlocal enabledelayedexpansion

REM ============================================================================
REM epost-kit CLI - Windows CMD Installation Script
REM ============================================================================
REM This script installs epost-kit CLI from local source at project scope.
REM
REM Usage:
REM   install.cmd
REM
REM Requirements:
REM   - Node.js >=18.0.0
REM   - npm
REM   - Must run from epost-agent-kit\ root directory
REM ============================================================================

set "ORIGINAL_DIR=%cd%"

REM ============================================================================
REM 1. Validate working directory
REM ============================================================================

if not exist "epost-agent-cli" (
    echo [ERR]  Must run from epost-agent-kit\ root directory
    echo [ERR]  Expected epost-agent-cli\ subdirectory not found
    exit /b 1
)

echo [INFO] Working directory validated

REM ============================================================================
REM 2. Detect and validate Node.js
REM ============================================================================

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERR]  Node.js not found
    echo [WARN] Install from: https://nodejs.org/
    echo [WARN] Or use nvm-windows: https://github.com/coreybutler/nvm-windows
    exit /b 1
)

REM Extract major version from "vXX.YY.ZZ"
for /f "tokens=1 delims=." %%a in ('node -v') do set "NODE_VER_RAW=%%a"
set "NODE_MAJOR=%NODE_VER_RAW:v=%"

if %NODE_MAJOR% lss 18 (
    echo [ERR]  Node.js 18+ required
    for /f %%v in ('node -v') do echo [ERR]  Found: %%v
    exit /b 1
)
for /f %%v in ('node -v') do echo [OK]   Node.js %%v

REM ============================================================================
REM 3. Validate npm
REM ============================================================================

where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERR]  npm not found (should come with Node.js)
    exit /b 1
)
for /f %%v in ('npm -v') do echo [OK]   npm %%v

REM ============================================================================
REM 4. Install dependencies
REM ============================================================================

echo [INFO] Installing dependencies...
cd epost-agent-cli

call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERR]  npm install failed
    cd "%ORIGINAL_DIR%"
    exit /b 1
)
echo [OK]   Dependencies installed

REM ============================================================================
REM 5. Build TypeScript
REM ============================================================================

echo [INFO] Building CLI...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERR]  npm run build failed
    cd "%ORIGINAL_DIR%"
    exit /b 1
)
echo [OK]   Build complete

REM ============================================================================
REM 6. Link binary
REM ============================================================================

echo [INFO] Linking epost-kit...
call npm link
if %ERRORLEVEL% neq 0 (
    echo [ERR]  npm link failed
    echo [WARN] Try running CMD as Administrator if permission denied
    cd "%ORIGINAL_DIR%"
    exit /b 1
)
echo [OK]   epost-kit linked

REM ============================================================================
REM 7. Verify installation
REM ============================================================================

echo [INFO] Verifying installation...

REM Get expected version from package.json
for /f "tokens=2 delims=:, " %%v in ('findstr /C:"\"version\"" epost-agent-cli\package.json') do (
    set "EXPECTED_VER=%%v"
    set "EXPECTED_VER=!EXPECTED_VER:"=!"
)

for /f %%v in ('npx epost-kit --version 2^>nul') do set "INSTALLED_VER=%%v"

if "!INSTALLED_VER!"=="!EXPECTED_VER!" (
    echo [OK]   epost-kit v!INSTALLED_VER! installed successfully
) else if defined INSTALLED_VER (
    echo [WARN] Version check: expected !EXPECTED_VER!, got '!INSTALLED_VER!'
    echo [WARN] Installation may have succeeded, but verification returned unexpected version
) else (
    echo [WARN] Could not verify installation (npx epost-kit --version returned empty)
)

REM ============================================================================
REM 8. Print usage instructions and restore directory
REM ============================================================================

cd "%ORIGINAL_DIR%"

echo.
echo Installation complete!
echo.
echo   Usage:
echo     npx epost-kit --help     Show available commands
echo     npx epost-kit --version  Show installed version
echo.
echo   Location:
echo     node_modules\.bin\epost-kit
echo.

exit /b 0
