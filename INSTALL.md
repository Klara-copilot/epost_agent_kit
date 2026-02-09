# Installation Guide

> **📢 Private Repository Notice**
>
> This repository is currently private. The one-line curl installation method requires a public repository and will be available in future releases. For now, please use npm installation.

## Quick Install

The fastest way to install epost-kit:

**Via npm (Recommended):**
```bash
npm install -g epost-kit
```

**Via npx (No Installation Required):**
```bash
npx epost-kit install
```

## Installation Methods

### Method 1: npm Global Install (Recommended)

**Pros:**
- Standard npm workflow
- Familiar to npm users
- Works with private repositories
- Easy to update and manage

**Command:**
```bash
npm install -g epost-kit
```

### Method 2: npx (No Install Required)

**Pros:**
- No global installation needed
- Always uses latest version
- Works with private repositories
- Clean, no system pollution

**Command:**
```bash
npx epost-kit install
```

### Method 3: Curl Script (Coming Soon - Public Repo Only)

> **Note:** This method requires the repository to be public. It will be available in future releases.

**Pros:**
- One command installation
- Automatic version detection
- Error handling and helpful messages
- Works on macOS, Linux, and Windows (Git Bash/WSL)

**Command (when available):**
```bash
# This will work when repository becomes public
curl -fsSL https://raw.githubusercontent.com/Klara-copilot/epost_agent_kit/main/install.sh | bash
```

**What the script will do:**
1. Check Node.js version (requires 18+)
2. Verify npm is installed
3. Install epost-kit globally via npm
4. Verify the installation

## Requirements

- **Node.js**: Version 18.0.0 or higher
- **npm**: Comes with Node.js

### Installing Node.js

If you don't have Node.js installed:

**macOS:**
```bash
# Via Homebrew
brew install node@20

# Or download from https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install nodejs npm
```

**Windows:**
- Download from https://nodejs.org/
- Or use Chocolatey: `choco install nodejs`

## Troubleshooting

### Permission Errors

If you get permission errors during installation:

**Option 1: Configure npm user directory (Recommended)**
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Now install
npm install -g epost-kit
```

**Option 2: Use sudo (Not Recommended)**
```bash
sudo npm install -g epost-kit
```

### Command Not Found

If `epost-kit` command is not found after installation:

1. **Check if npm global bin is in PATH:**
```bash
npm bin -g
# Should output something like /usr/local/bin or ~/.npm-global/bin
```

2. **Add npm global bin to PATH:**
```bash
# Get the bin directory
NPM_BIN=$(npm bin -g)

# Add to shell profile
echo "export PATH=\"$NPM_BIN:\$PATH\"" >> ~/.bashrc  # or ~/.zshrc
source ~/.bashrc  # or source ~/.zshrc
```

3. **Try using npx instead:**
```bash
npx epost-kit --version
```

### Version Mismatch

If the installed version doesn't match expectations:

```bash
# Check installed version
epost-kit --version

# Reinstall latest version
npm uninstall -g epost-kit
npm install -g epost-kit
```

## Verification

After installation, verify it works:

```bash
# Check version
epost-kit --version

# Show help
epost-kit --help

# Try a command
epost-kit install --help
```

## Uninstallation

To remove epost-kit:

```bash
npm uninstall -g epost-kit
```

## Local Development

For developers working on epost-kit itself:

**macOS:**
```bash
cd epost-agent-kit
./install-macos.sh
```

**Windows PowerShell:**
```powershell
cd epost-agent-kit
powershell -ExecutionPolicy Bypass -File install.ps1
```

**Windows CMD:**
```cmd
cd epost-agent-kit
install.cmd
```

This installs from local source with `npm link` for development.

## Security

The installation script is hosted on GitHub and served over HTTPS.

> **Note**: Currently, the repository is private. The curl commands below will work when the repository becomes public. For now, npm installation is the recommended secure method.

**When repository is public, you can:**

1. **Inspect before running:**
```bash
# Available when repository is public
curl -fsSL https://raw.githubusercontent.com/Klara-copilot/epost_agent_kit/main/install.sh
```

2. **Download and verify:**
```bash
# Available when repository is public
curl -fsSL https://raw.githubusercontent.com/Klara-copilot/epost_agent_kit/main/install.sh -o install.sh
# Review install.sh
bash install.sh
```

## Support

For issues or questions:
- GitHub Issues: https://github.com/Klara-copilot/epost-agent-kit/issues
- Documentation: https://github.com/Klara-copilot/epost-agent-kit
