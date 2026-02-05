# Deployment Guide - epost_agent_kit

**Last Updated**: 2026-02-05
**Created by**: Phuong Doan
**Status**: Production Ready

---

## Overview

This guide covers installing and configuring epost_agent_kit across Claude Code, Cursor, and GitHub Copilot. The framework supports three deployment targets with automatic format conversion and consistent behavior.

---

## Prerequisites

### System Requirements
- **Node.js**: 18+ LTS
- **npm/yarn/pnpm/bun**: Latest stable
- **Git**: 2.30+
- **GitHub Account**: For Copilot setup
- **IDE**: Claude Code, Cursor, or VS Code with Copilot

### Development Tools (Optional)
- **TypeScript**: 5+
- **Docker**: 20+ (for containerization)
- **PostgreSQL**: 15+ (recommended for web projects)

### IDE-Specific Requirements

**Claude Code**:
- No additional setup required
- Works with latest Claude Code plugin

**Cursor**:
- Cursor IDE 0.35+
- AGENTS.md support enabled
- Rules directory support (.cursor/rules/)

**GitHub Copilot**:
- VS Code with GitHub Copilot extension
- GitHub account with Copilot access
- .github/ directory for agent configuration

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/Klara-copilot/epost_agent_kit.git
cd epost_agent_kit
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
pnpm install
bun install
```

### 3. Verify Installation

```bash
npm run lint
npm run typecheck
npm test
```

### 4. Configure Environment

Create `.env.local` in project root:

```bash
# Optional: Notification configuration
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id
DISCORD_WEBHOOK_URL=your_webhook_url
SLACK_WEBHOOK_URL=your_webhook_url

# Optional: MCP Configuration
XCODEBUILD_MCP_ENABLED=true
CONTEXT7_MCP_ENABLED=true
```

---

## Deployment by Platform

### Claude Code Deployment

**Automatic Setup**:
1. Open project folder in Claude Code
2. Agents and skills are auto-discovered
3. Start using commands immediately

**Manual Configuration** (if needed):

Create `.claude/.ck.json`:

```json
{
  "plan": {
    "namingFormat": "{date}-{issue}-{slug}",
    "dateFormat": "YYMMDD-HHmm",
    "issuePrefix": "GH-",
    "reportsDir": "reports"
  },
  "paths": {
    "docs": "docs",
    "plans": "plans"
  },
  "project": {
    "type": "auto",
    "packageManager": "auto"
  },
  "codingLevel": 5
}
```

**Verification**:
```
/scout agents
# Should list all 15 agents
/ask How many agents are in this project?
```

### Cursor Deployment

**Step 1**: Copy files to Cursor configuration

```bash
# Cursor stores config in ~/.cursor
cp -r .claude/agents ~/.cursor/agents
cp -r .claude/skills ~/.cursor/commands/skills
cp -r .claude/rules ~/.cursor/rules
```

**Step 2**: Create AGENTS.md in project root

```markdown
# Agents

[Auto-generated from .claude/agents/]

## Global Agents
- orchestrator - Task routing
- architect - Planning
- implementer - Feature development
- reviewer - Code review
- [... list all 15 agents ...]
```

**Step 3**: Verify in Cursor

```
Type @ in editor
Should see all agents in autocomplete
```

### GitHub Copilot Deployment

**Step 1**: Configure repository settings

```bash
# Create .github/ structure
mkdir -p .github/agents
mkdir -p .github/instructions
mkdir -p .github/prompts
```

**Step 2**: Generate Copilot agents

Create `.github/agents/orchestrator.yml`:

```yaml
name: Orchestrator
description: AI agent for task orchestration
type: global
model: gpt-4
instructions: |
  You are an orchestration agent...
```

**Step 3**: Set up GitHub Actions

Create `.github/workflows/sync-agents.yml`:

```yaml
name: Sync Agents to Copilot
on:
  push:
    paths:
      - '.claude/agents/**'
      - '.claude/skills/**'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Sync agents
        run: npm run sync:copilot
```

**Step 4**: Verify in VS Code

```
Type @ in GitHub Copilot chat
Should see all 15 agents
```

---

## Configuration

### Global Configuration (`.claude/.ck.json`)

**Plan Settings**:
```json
{
  "plan": {
    "namingFormat": "{date}-{issue}-{slug}",
    "dateFormat": "YYMMDD-HHmm",
    "issuePrefix": "GH-",
    "reportsDir": "reports",
    "resolution": {
      "order": ["session", "branch"],
      "branchPattern": "(?:feat|fix)/(.+)"
    }
  }
}
```

**Paths**:
```json
{
  "paths": {
    "docs": "docs",
    "plans": "plans"
  }
}
```

**Project Detection**:
```json
{
  "project": {
    "type": "auto",
    "packageManager": "auto",
    "framework": "auto"
  }
}
```

### Hooks Configuration

**Scout Block** (.ckignore):
```
# Dependencies
node_modules
__pycache__
.venv
vendor

# Build artifacts
dist
build
.next
.nuxt

# Version control
.git

# Allow override
# !dist/critical-file.js
```

**Privacy Enforcement** - Automatic

**Notifications** (.claude/.env or ~/.claude/.env):
```bash
# Telegram
TELEGRAM_BOT_TOKEN=123456789:ABCdef...
TELEGRAM_CHAT_ID=987654321

# Discord
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## Platform-Specific Setup

### Web Development Setup

```bash
# Install web dependencies
npm install next react typescript

# Create Next.js config
npx create-next-app@latest --typescript

# Copy web agent configuration
cp .claude/agents/epost-web-developer.md .next/
```

**Verify**:
```
/web:cook Create a simple button component
```

### iOS Development Setup

**Prerequisites**:
- macOS 14.5+
- Xcode 16.x
- iOS 18+ SDK

**Install MCP** (optional):
```bash
claude mcp add XcodeBuildMCP npx xcodebuildmcp@latest
```

**Verify**:
```
/ios:cook Implement a login screen
/ios:simulator --list
```

### Android Development Setup

**Prerequisites**:
- Android SDK 34+
- Kotlin 1.9+
- Gradle 8.0+

**Verify**:
```
/android:cook Implement a login screen
```

---

## Verification & Testing

### Smoke Tests

```bash
# Test agent discovery
/scout agents

# Test orchestration
/ask How many commands are available?

# Test specific platform
/web:cook --help
```

### Comprehensive Testing

```bash
# Run full test suite
npm test

# Run specific agent tests
npm test -- epost-orchestrator

# Check linting
npm run lint

# Type checking
npm run typecheck
```

### Integration Testing

```bash
# Test hook system
echo '{"tool_input":{"command":"ls node_modules"}}' \
  | node .claude/hooks/scout-block.cjs

# Test privacy enforcement
echo '{"tool_input":{"file_path":".env"},"tool_name":"Read"}' \
  | node .claude/hooks/privacy-block.cjs
```

---

## Troubleshooting

### Agents Not Discovered

**Symptom**: `/ask` returns "no agents found"

**Solutions**:
1. Verify `.claude/agents/` directory exists
2. Check agent files have YAML frontmatter
3. Restart Claude Code/Cursor
4. Run `npm run validate:agents`

### Scout Blocking Prevents Access

**Symptom**: Error accessing node_modules or dist/

**Solutions**:
1. Check `.ckignore` patterns
2. Use `/web:cook` instead of direct path
3. For critical access, prefix with `APPROVED:`

### Hooks Not Running

**Symptom**: Privacy block not working, notifications not sending

**Solutions**:
1. Verify hook files in `.claude/hooks/`
2. Check environment variables for notifications
3. Enable debug logging: `DEBUG=epost:* npm test`

### Import/Module Errors

**Symptom**: "Cannot find module..." errors

**Solutions**:
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Verify structure
npm run validate:structure
```

---

## Monitoring & Maintenance

### Health Checks

**Weekly**:
- Run test suite: `npm test`
- Check linting: `npm run lint`
- Verify hook functionality

**Monthly**:
- Review logs and notifications
- Check for security updates: `npm audit`
- Update dependencies: `npm update`

### Logs & Debugging

**Hook Logs**:
```bash
# Enable debug logging
DEBUG=epost:* node .claude/hooks/scout-block.cjs

# Check notification throttling
cat /tmp/ck-noti-throttle.json
```

**Agent Logs**:
```bash
# Check plan execution
cat plans/reports/*.md

# View agent status
/ask What tasks are in progress?
```

### Update Procedure

```bash
# Pull latest changes
git pull origin main

# Install updates
npm install

# Run tests
npm test

# Verify agents still work
/scout agents
```

---

## Uninstallation

### Remove from Claude Code

1. Open project folder
2. Remove `.claude/` directory
3. Restart Claude Code

### Remove from Cursor

```bash
rm -rf ~/.cursor/agents/epost-*
rm -rf ~/.cursor/commands/epost-*
rm -rf ~/.cursor/rules/*epost*
```

### Remove from GitHub Copilot

```bash
rm -rf .github/agents/
rm -rf .github/instructions/
rm -rf .github/prompts/
git commit -m "Remove Copilot agent configuration"
git push
```

---

## Support & Resources

- **Documentation**: See `./docs/` directory
- **Issues**: GitHub Issues (github.com/Klara-copilot/epost_agent_kit/issues)
- **Discussions**: GitHub Discussions
- **CLI Reference**: See `./docs/cli-reference.md`
- **Troubleshooting**: See `./docs/troubleshooting-guide.md`

---

**Created by**: Phuong Doan
**Last Updated**: 2026-02-05
**Version**: 0.1.0
