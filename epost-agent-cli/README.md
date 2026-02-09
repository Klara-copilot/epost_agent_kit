# epost-kit

[![npm version](https://img.shields.io/npm/v/epost-kit.svg)](https://www.npmjs.com/package/epost-kit)
[![CI](https://github.com/Klara-copilot/epost_agent_kit/actions/workflows/ci.yml/badge.svg)](https://github.com/Klara-copilot/epost_agent_kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Distribution CLI for **epost-agent-kit** — a multi-IDE agent framework supporting Claude Code, GitHub Copilot, and Cursor.

## Features

- **Multi-IDE Support**: Distributes agent kits across Claude Code (.claude/), GitHub Copilot (.github/), and Cursor (.cursor/)
- **Smart Installation**: Detects existing setups, offers merge strategies for conflicts
- **Versioned Updates**: Pin to specific kit versions, check for updates, rollback support
- **Health Checks**: Verify installation integrity with `doctor` command
- **File Ownership Tracking**: Smart updates respect user modifications
- **CI/CD Ready**: `--yes` flag for automated workflows

## Quick Start

### Install Globally

```bash
npm install -g epost-kit
epost-kit new my-project
```

### Use with npx (Recommended)

```bash
npx epost-kit new my-project
```

## Commands

### `new` - Create New Project

Create a new project with agent kit pre-installed.

```bash
# Interactive mode
npx epost-kit new

# Specify kit template
npx epost-kit new my-project --kit engineer

# Custom directory
npx epost-kit new --dir ./my-app
```

**Options**:
- `--kit <name>`: Kit template to use (default: `engineer`)
- `--dir <path>`: Target directory for new project
- `--yes`: Skip interactive prompts

---

### `init` - Initialize Existing Project

Add agent kit to an existing project.

```bash
# Interactive mode
npx epost-kit init

# Force fresh install (overwrite conflicts)
npx epost-kit init --fresh

# Preview changes without applying
npx epost-kit init --dry-run

# CI mode
npx epost-kit init --yes --kit engineer
```

**Options**:
- `--kit <name>`: Kit template to use (default: `engineer`)
- `--fresh`: Overwrite existing files (ignore ownership)
- `--dry-run`: Preview changes without writing files

**Merge Strategies**:
When conflicts are detected, choose:
1. **Keep**: Preserve your local file
2. **Overwrite**: Use incoming kit version
3. **Merge**: Smart merge (preserves custom content)

---

### `doctor` - Verify Installation

Check installation health and environment setup.

```bash
# Basic health check
npx epost-kit doctor

# Auto-fix detected issues
npx epost-kit doctor --fix

# Generate detailed diagnostic report
npx epost-kit doctor --report
```

**Options**:
- `--fix`: Automatically fix issues (e.g., restore checksums)
- `--report`: Generate detailed report file

**Checks**:
- ✓ Kit installation integrity (checksums match)
- ✓ Required IDE directories exist
- ✓ Configuration file validity
- ✓ File ownership metadata
- ✓ Node.js version compatibility

---

### `versions` - List Available Versions

List all available kit versions from GitHub releases.

```bash
# Show latest 10 versions
npx epost-kit versions

# Show all versions
npx epost-kit versions --limit 50

# Include pre-release versions
npx epost-kit versions --pre
```

**Options**:
- `--limit <number>`: Max versions to display (default: 10)
- `--pre`: Include pre-release versions

**Output**:
```
Available epost-agent-kit versions:
  v1.2.0 (latest)
  v1.1.0
  v1.0.0
```

---

### `update` - Update Installed Kit

Update to latest kit version with smart merge.

```bash
# Check for updates only
npx epost-kit update --check

# Update to latest version
npx epost-kit update

# CI mode (auto-accept)
npx epost-kit update --yes
```

**Options**:
- `--check`: Only check for updates, don't install
- `--yes`: Skip confirmation prompts

**Update Process**:
1. Fetch latest release from GitHub
2. Compare with local checksums
3. Smart merge (respect user modifications)
4. Backup old files before overwrite

---

### `uninstall` - Remove Kit

Remove agent kit from project.

```bash
# Interactive uninstall
npx epost-kit uninstall

# Keep user-modified files
npx epost-kit uninstall --keep-custom

# Force removal without confirmation
npx epost-kit uninstall --force --yes
```

**Options**:
- `--keep-custom`: Keep files modified by user (tracked via ownership)
- `--force`: Force removal without confirmation

**What Gets Removed**:
- Kit-installed files (tracked in ownership metadata)
- Configuration files (.epost-config.json)
- Checksum manifests
- User-modified files: **kept by default** (use `--force` to override)

---

## Configuration

Create `.epost-config.json` in your project root:

```json
{
  "kit": "engineer",
  "version": "1.2.0",
  "ides": ["claude", "copilot"],
  "customPaths": {
    "claude": ".ai/claude"
  }
}
```

**Options**:
- `kit`: Kit template name
- `version`: Pinned version (omit for latest)
- `ides`: Target IDEs (`["claude", "copilot", "cursor"]`)
- `customPaths`: Override default IDE paths

---

## Kit Templates

Currently available:
- `engineer`: Full-featured agent kit (9 global agents + 10 specialized agents + 17 skills)

More kits coming soon (mobile, web, data-science).

---

## Migration from ClaudeKit

If you're using [claudekit-engineer](https://github.com/Klara-copilot/claudekit-engineer):

```bash
# Backup current setup
cp -r .claude .claude.backup

# Initialize epost-kit
npx epost-kit init --kit engineer

# Review changes with dry-run first
npx epost-kit init --dry-run
```

**Key Differences**:
- Multi-IDE support (not just Claude Code)
- File ownership tracking for smart updates
- Versioned releases via GitHub

---

## Development

### Local Development Installation

For local development and testing:

**macOS:**
```bash
# From epost-agent-kit/ root directory
./install-macos.sh
```

**Windows PowerShell:**
```powershell
# From epost-agent-kit\ root directory
powershell -ExecutionPolicy Bypass -File install.ps1
```

**Windows CMD:**
```cmd
REM From epost-agent-kit\ root directory
install.cmd
```

Requirements:
- Node.js >=18.0.0
- npm

After installation, verify with:
```bash
npx epost-kit --version  # Should output: 0.1.0
```

### Build from Source (Manual)

```bash
git clone https://github.com/Klara-copilot/epost_agent_kit.git
cd epost_agent_kit/epost-agent-cli
npm install
npm run build
npm link
```

### Run Tests

```bash
npm test
npm run test:watch
```

---

## Troubleshooting

### Command not found

If `npx epost-kit` fails:
```bash
# Clear npm cache
npm cache clean --force

# Or install globally
npm install -g epost-kit
```

### Checksum mismatch errors

Run doctor to verify:
```bash
npx epost-kit doctor --fix
```

### Update fails

1. Check internet connection
2. Verify GitHub API access (rate limits)
3. Try with `--verbose` flag for detailed logs

---

## Contributing

Contributions welcome! Please see [CONTRIBUTING.md](https://github.com/Klara-copilot/epost_agent_kit/blob/master/CONTRIBUTING.md).

---

## License

MIT © Phuong Doan

---

## Links

- **GitHub**: https://github.com/Klara-copilot/epost_agent_kit
- **npm**: https://www.npmjs.com/package/epost-kit
- **Issues**: https://github.com/Klara-copilot/epost_agent_kit/issues
- **Documentation**: https://github.com/Klara-copilot/epost_agent_kit/tree/master/docs
