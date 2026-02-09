# Deployment Guide

## Environment Variables

### Required Variables

**None** — epost-kit is a CLI tool that doesn't require environment variables for basic operation.

### Optional Variables

#### GitHub Authentication
```bash
# GitHub Personal Access Token (for higher API rate limits)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Purpose**: Increase GitHub API rate limit from 60/hour (unauthenticated) to 5000/hour (authenticated)

**How to Get**:
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `public_repo` (read public repositories)
4. Copy token and set in environment

**Usage**:
```bash
# Set for current session
export GITHUB_TOKEN=ghp_xxxx

# Or add to shell profile (~/.bashrc, ~/.zshrc)
echo 'export GITHUB_TOKEN=ghp_xxxx' >> ~/.zshrc
```

#### NPM Configuration
```bash
# NPM registry (default: https://registry.npmjs.org/)
NPM_CONFIG_REGISTRY=https://registry.npmjs.org/

# NPM authentication token (for publishing)
NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Purpose**: Configure npm registry and authentication for publishing

**How to Get NPM Token**:
```bash
# Login to npm
npm login

# Get token from ~/.npmrc
cat ~/.npmrc | grep _authToken
```

## Build Process

### Development Build

```bash
# Clone repository
git clone https://github.com/Klara-copilot/epost_agent_kit.git
cd epost_agent_kit/epost-agent-cli

# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Output: dist/ directory with compiled .js and .d.ts files
```

### Watch Mode (Development)

```bash
# Auto-rebuild on file changes
npm run dev

# Runs: tsc --watch
```

### Production Build

```bash
# Run all checks before build
npm run prepublishOnly

# Executes in order:
# 1. npm run typecheck   (TypeScript type checking)
# 2. npm run lint        (ESLint)
# 3. npm run test        (Vitest)
# 4. npm run build       (Compile TypeScript)
```

### Local Testing

```bash
# After build, test locally with npm link
npm run build
npm link

# Now you can run globally
epost-kit --version
epost-kit init --dry-run

# Unlink when done
npm unlink -g epost-kit
```

## Deployment Platforms

### npm Registry (Primary Distribution)

**Package**: `epost-kit`  
**Registry**: https://www.npmjs.com/package/epost-kit  
**Visibility**: Public

#### Prerequisites

1. **npm Account**: Create at https://www.npmjs.com/signup
2. **npm Login**: Authenticate locally
   ```bash
   npm login
   # Enter: username, password, email, OTP (if 2FA enabled)
   ```

3. **Verify Login**:
   ```bash
   npm whoami
   # Should print your npm username
   ```

#### Publishing Steps

```bash
# 1. Ensure you're on master/main branch
git checkout master
git pull origin master

# 2. Update version in package.json
npm version patch  # 0.1.0 → 0.1.1
npm version minor  # 0.1.1 → 0.2.0
npm version major  # 0.2.0 → 1.0.0

# 3. Run pre-publish checks (automatic via prepublishOnly script)
npm publish

# 4. Push version tag to GitHub
git push origin master --tags
```

#### Post-Publish Verification

```bash
# Check package on npm
npm view epost-kit

# Test installation
npm install -g epost-kit
epost-kit --version
```

#### npm Package Configuration

From `package.json`:
```json
{
  "name": "epost-kit",
  "version": "0.1.0",
  "bin": {
    "epost-kit": "./dist/cli.js"
  },
  "files": [
    "dist/",
    "README.md",
    "LICENSE"
  ],
  "exports": {
    ".": "./dist/index.js",
    "./cli": "./dist/cli.js"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

**What Gets Published**:
- `dist/` (compiled JavaScript, .d.ts, .map files)
- `README.md`
- `LICENSE`
- `package.json`

**What Gets Excluded** (via .gitignore):
- `node_modules/`
- `src/` (TypeScript source — not needed for npm package)
- `tests/`
- `.env` files

### GitHub Releases (Versioning Source)

**Repository**: https://github.com/Klara-copilot/epost_agent_kit  
**Purpose**: Version tagging, release notes, asset downloads

#### Creating a GitHub Release

**Manual (via GitHub UI)**:
1. Go to https://github.com/Klara-copilot/epost_agent_kit/releases/new
2. Tag: `v0.1.1`
3. Title: `v0.1.1 - Release Title`
4. Description: Release notes (changelog)
5. Publish release

**Automated (via gh CLI)**:
```bash
# Install GitHub CLI: https://cli.github.com/
brew install gh

# Authenticate
gh auth login

# Create release
gh release create v0.1.1 \
  --title "v0.1.1 - Bug fixes and improvements" \
  --notes "$(cat CHANGELOG.md)" \
  --latest

# Or auto-generate notes from commits
gh release create v0.1.1 --generate-notes
```

#### Release Assets (Optional)

If distributing standalone binaries (future):
```bash
# Attach tarball to release
gh release upload v0.1.1 epost-kit-v0.1.1.tar.gz
```

### npx (On-Demand Execution)

**No deployment needed** — npx fetches from npm registry automatically

**Usage**:
```bash
# Always gets latest version
npx epost-kit init

# Specific version
npx epost-kit@0.1.0 init
```

## CI/CD Pipeline (Recommended)

### GitHub Actions Workflow

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true
```

**Setup**:
1. Add `NPM_TOKEN` to GitHub Secrets:
   - Go to https://github.com/Klara-copilot/epost_agent_kit/settings/secrets/actions
   - Add secret: `NPM_TOKEN` = your npm token
   
2. Push tag to trigger:
   ```bash
   git tag v0.1.1
   git push origin v0.1.1
   ```

### CI Tests Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ master, main ]
  pull_request:
    branches: [ master, main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm test
```

## Version Management

### Semantic Versioning

Follow **SemVer**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (API incompatible)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

**Examples**:
```bash
npm version patch  # 0.1.0 → 0.1.1 (bug fix)
npm version minor  # 0.1.1 → 0.2.0 (new feature)
npm version major  # 0.2.0 → 1.0.0 (breaking change)
```

### Pre-Release Versions

```bash
npm version prerelease          # 0.1.0 → 0.1.1-0
npm version prerelease --preid=beta  # 0.1.0 → 0.1.1-beta.0
```

### Changelog

Maintain `CHANGELOG.md` with version history:

```markdown
# Changelog

## [0.1.1] - 2025-02-10
### Fixed
- Fixed checksum verification bug in doctor command
- Improved error messages for file conflicts

## [0.1.0] - 2025-02-08
### Added
- Initial release
- Package-based installation system
- Profile auto-detection
```

## Rollback Strategy

### Unpublish (Within 72 Hours)

```bash
# Only works within 72 hours of publish
npm unpublish epost-kit@0.1.1

# Warning: leaves a "hole" in version history
```

### Deprecate (Recommended)

```bash
# Mark version as deprecated (doesn't remove)
npm deprecate epost-kit@0.1.1 "Use 0.1.2 instead - fixes critical bug"

# Users will see warning when installing
```

### Publish Fix Version

```bash
# Preferred approach: publish new patch version
npm version patch
npm publish
```

## Monitoring & Analytics

### npm Download Stats

```bash
# View download counts
npm view epost-kit

# Detailed stats
curl https://api.npmjs.org/downloads/point/last-month/epost-kit
```

### GitHub Insights

- **Releases**: https://github.com/Klara-copilot/epost_agent_kit/releases
- **Traffic**: https://github.com/Klara-copilot/epost_agent_kit/graphs/traffic
- **Issues**: https://github.com/Klara-copilot/epost_agent_kit/issues

## Troubleshooting Deployment

### Common Issues

#### 1. `npm publish` fails with "You do not have permission"

**Cause**: Not logged in or wrong account

**Fix**:
```bash
npm logout
npm login
npm whoami  # Verify correct account
npm publish
```

#### 2. `npm publish` fails with "Version already exists"

**Cause**: Version already published

**Fix**:
```bash
npm version patch  # Bump version
npm publish
```

#### 3. `prepublishOnly` script fails

**Cause**: Tests or linting errors

**Fix**:
```bash
npm run typecheck  # Check TypeScript errors
npm run lint       # Check ESLint errors
npm test           # Check test failures
```

#### 4. GitHub Actions fails to publish

**Cause**: Missing or invalid NPM_TOKEN

**Fix**:
1. Generate new npm token: https://www.npmjs.com/settings/{username}/tokens
2. Update GitHub secret: https://github.com/{org}/{repo}/settings/secrets/actions
3. Re-run workflow

## Security Best Practices

### 1. Enable npm 2FA

```bash
# Enable 2FA for authentication
npm profile enable-2fa auth-only

# Or enable for auth + publish
npm profile enable-2fa auth-and-writes
```

### 2. Use .npmignore

Create `.npmignore` to exclude sensitive files:
```
tests/
*.test.ts
.env
.env.*
*.key
*.pem
coverage/
```

### 3. Audit Dependencies

```bash
# Check for vulnerabilities
npm audit

# Auto-fix
npm audit fix
```

### 4. Package Provenance

Enable provenance (npm 9+):
```bash
npm publish --provenance
```

This creates a signed attestation linking the package to its source code.
