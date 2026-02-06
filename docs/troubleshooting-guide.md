# Troubleshooting Guide - epost_agent_kit

**Last Updated**: 2026-02-05
**Created by**: Phuong Doan

---

## Overview

This guide covers common issues and solutions for epost_agent_kit deployment and usage. Issues are categorized by symptom and include root causes, troubleshooting steps, and permanent solutions.

---

## Agent & Command Issues

### Agents Not Discovered

**Symptom**: `/ask` returns "no agents found" or agents list is empty

**Root Causes**:
- `.claude/agents/` directory doesn't exist
- Agent files lack YAML frontmatter
- Claude Code not reloaded after installation
- Hook system not running

**Troubleshooting Steps**:

1. **Verify directory structure**:
   ```bash
   ls -la .claude/agents/
   # Should show 15 .md files
   ```

2. **Check YAML frontmatter**:
   ```bash
   head -5 .claude/agents/epost-orchestrator.md
   # Should show: ---\nname: ...\n...
   ```

3. **Restart Claude Code**:
   - Close Claude Code completely
   - Reopen project folder
   - Wait 5-10 seconds for discovery

4. **Run validation**:
   ```bash
   npm run validate:agents
   # Should show all 15 agents valid
   ```

5. **Check hooks are running**:
   ```bash
   ls -la .claude/hooks/
   # Should show hook files
   npm test .claude/hooks/
   ```

**Permanent Solution**:
- Ensure `.claude/agents/` exists with all 15 agent files
- All files must have valid YAML frontmatter
- Run setup script: `npm run setup`

---

### Commands Not Working

**Symptom**: Command triggers but agent doesn't respond, or "command not found"

**Root Causes**:
- Command file not created
- Hook routing misconfigured
- Agent not responding
- Permission issues

**Troubleshooting Steps**:

1. **Verify command exists**:
   ```bash
   /scout commands
   # Should list all 30 commands
   ```

2. **Test direct agent invocation**:
   ```
   Try invoking agent directly: @orchestrator
   If this works, routing issue
   If this fails, agent issue
   ```

3. **Check hooks**:
   ```bash
   npm test -- scout-block.test.cjs
   npm test -- privacy-block.test.cjs
   ```

4. **Reload configuration**:
   - Restart Claude Code
   - Clear cache: `Cmd+Shift+P` → "Clear Cache" (or platform equivalent)

**Permanent Solution**:
- Verify all command files in `.claude/commands/`
- Re-run `npm run setup`
- Contact support if agent still unresponsive

---

### Command Routing to Wrong Agent

**Symptom**: `/web:cook` routes to global implementer instead of web/implementer

**Root Causes**:
- Platform detection not working
- Explicit prefix ignored
- Hook system misconfigured

**Troubleshooting Steps**:

1. **Check hook routing**:
   ```bash
   echo '{"command":"/web:cook something"}' | \
     node .claude/hooks/lib/scout-checker.cjs
   ```

2. **Verify project type detection**:
   ```bash
   cat .claude/.ck.json | grep '"type"'
   # Should show: "type": "auto"
   ```

3. **Test file extension detection**:
   - Create test file: `test.tsx` (web indicator)
   - Try command: `/cook feature`
   - Should route to web/implementer

4. **Manual platform specification**:
   ```bash
   # Force platform
   /web:cook feature
   /ios:cook feature
   /android:cook feature
   ```

**Permanent Solution**:
- Ensure project has correct entry point files
- Use explicit platform prefix if auto-detection fails
- Update `.ck.json` with explicit `"type": "web"` if needed

---

## Hook Issues

### Scout Blocking Prevents Necessary Access

**Symptom**: "Error: Access to node_modules blocked by scout"

**Root Causes**:
- Pattern too broad
- Legitimate file blocked
- Scout block rule misconfigured

**Troubleshooting Steps**:

1. **Check .ckignore patterns**:
   ```bash
   cat .ckignore
   # Review which patterns are listed
   ```

2. **Understand scout block logic**:
   - `node_modules` blocks any path containing node_modules
   - `dist` blocks any path containing dist
   - Broad patterns (e.g., `**/*.ts`) blocked

3. **Test specific path**:
   ```bash
   echo '{"tool_input":{"file_path":"src/components/Button.tsx"}}' | \
     node .claude/hooks/scout-block.cjs
   # Exit 0 = allowed, Exit 2 = blocked
   ```

4. **Work around if necessary**:
   - Use `/web:cook` instead of direct path
   - Use `/scout` to find files instead
   - Request approval from documentation

**Permanent Solution**:

1. **Modify .ckignore** to be more specific:
   ```
   node_modules/  # Only block node_modules dir
   dist/          # Only block dist dir
   # Avoid: **/* or **/*.ext at root
   ```

2. **Use smart paths**:
   - Avoid `/search` and `**` patterns
   - Use specific file paths instead
   - Use agents to navigate code

---

### Privacy Block Prevents .env Access

**Symptom**: "Error: Cannot access .env - privacy violation" when trying to read .env

**Root Causes**:
- User approval needed for sensitive files
- Pattern too aggressive
- Legitimate need but wrong format

**Troubleshooting Steps**:

1. **Request approval**:
   - File appears to be: `.env`
   - System asks: "Do you want to read .env? (Yes/No)"
   - Click "Yes" to approve

2. **Use approval prefix**:
   ```
   If direct read fails, try:
   /ask about APPROVED:.env
   Or read specific config separately
   ```

3. **Check safe file list**:
   ```bash
   # These files bypass privacy block:
   .env.example
   .env.sample
   .env.template
   # Copy production .env to .env.example for sharing
   ```

4. **Work around**:
   - Ask agent to describe .env structure without reading
   - Manually describe variables needed
   - Use environment-specific files

**Permanent Solution**:

1. **Create .env.example** with non-sensitive values:
   ```bash
   # Safe to read
   DATABASE_URL=postgresql://localhost/mydb
   API_KEY=your_key_here
   ```

2. **Reference example instead**:
   ```
   /ask What variables are in .env.example?
   ```

3. **Set up approval if needed**:
   - System allows `APPROVED:` prefix after first denial
   - Use when necessary for legitimate debugging

---

### Notifications Not Sending

**Symptom**: Session completes but no Slack/Discord/Telegram message

**Root Causes**:
- Environment variables not configured
- Webhook URL invalid
- Throttling active (5-min quiet after error)
- Network issue

**Troubleshooting Steps**:

1. **Check env configuration**:
   ```bash
   # Check if vars exist
   echo $SLACK_WEBHOOK_URL
   echo $DISCORD_WEBHOOK_URL
   echo $TELEGRAM_BOT_TOKEN

   # Should show values, not empty
   ```

2. **Verify credentials**:
   - Slack: Webhook URL format `https://hooks.slack.com/...`
   - Discord: Webhook URL format `https://discord.com/api/webhooks/...`
   - Telegram: Token and Chat ID provided

3. **Check throttling**:
   ```bash
   cat /tmp/ck-noti-throttle.json
   # Shows last error time
   # Wait 5 minutes if recent error
   ```

4. **Test notification directly**:
   ```bash
   echo '{"hook_event_name":"Stop"}' | \
     node .claude/hooks/notifications/notify.cjs
   # Check if message sent
   ```

5. **Enable debug logging**:
   ```bash
   DEBUG=epost:* node .claude/hooks/notifications/notify.cjs
   ```

**Permanent Solution**:

1. **Set up environment variables** properly:
   ```bash
   # In ~/.claude/.env (for all projects)
   export SLACK_WEBHOOK_URL=...
   export DISCORD_WEBHOOK_URL=...
   export TELEGRAM_BOT_TOKEN=...
   export TELEGRAM_CHAT_ID=...
   ```

2. **Verify webhook credentials**:
   - Log into Slack workspace
   - Settings → Integrations → Webhooks
   - Copy correct URL

3. **Test end-to-end**:
   ```bash
   # Complete session should trigger notification
   /plan test feature
   /scout test
   # Watch for notification
   ```

---

## Development & Testing Issues

### Tests Failing

**Symptom**: `npm test` shows failing tests or low coverage

**Root Causes**:
- Missing dependencies
- Module import errors
- Test configuration wrong
- Code regression

**Troubleshooting Steps**:

1. **Clear cache and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm test
   ```

2. **Check test framework**:
   ```bash
   # Verify test runner installed
   npm list vitest jest
   # Should show installed versions
   ```

3. **Run specific test**:
   ```bash
   npm test -- scout-block.test.cjs
   # More focused output
   ```

4. **Check type errors**:
   ```bash
   npm run typecheck
   # Shows TypeScript errors
   ```

5. **Read test output carefully**:
   - Look for actual vs expected values
   - Check line numbers for failures
   - Follow stack trace

**Permanent Solution**:
- Fix code issues identified in test output
- Follow code standards for type safety
- Maintain minimum 80% coverage

---

### TypeScript Compilation Errors

**Symptom**: `npm run typecheck` shows type errors

**Root Causes**:
- Missing type definitions
- Type mismatch
- Import path wrong
- Configuration issue

**Troubleshooting Steps**:

1. **Read error message**:
   ```
   src/file.ts(10,5): error TS2345:
   Argument of type 'string' is not assignable to parameter of type 'number'
   ```

2. **Fix at that location**:
   - Go to src/file.ts line 10
   - Check what's being passed
   - Ensure type matches

3. **Check import paths**:
   ```bash
   # Verify file exists
   ls -la src/utils/helpers.ts
   # If missing, create or fix import
   ```

4. **Use `as` for type casting** (last resort):
   ```typescript
   const value = someFunction() as string;
   ```

**Permanent Solution**:
- Follow TypeScript strict mode
- Add type annotations for complex code
- Use types from libraries (not `any`)

---

### Build Failing

**Symptom**: `npm run build` or `npm run dev` fails

**Root Causes**:
- Missing files
- Import errors
- Configuration wrong
- Dependencies missing

**Troubleshooting Steps**:

1. **Clean and rebuild**:
   ```bash
   npm run clean
   npm install
   npm run build
   ```

2. **Check build output**:
   ```bash
   npm run build 2>&1 | tail -50
   # Shows last 50 lines of error
   ```

3. **Identify first error**:
   - Build errors usually cascade
   - Fix first error, then rebuild
   - Repeat until passing

4. **Verify all dependencies**:
   ```bash
   npm list
   npm audit
   ```

---

## Performance Issues

### Commands Slow or Timing Out

**Symptom**: `/plan`, `/cook`, or `/test` takes >30 seconds or times out

**Root Causes**:
- Large file analysis
- Network latency
- Agent context window full
- System overload

**Troubleshooting Steps**:

1. **Check context size**:
   - Large projects need more context
   - Token limit: ~200K per agent
   - Run `repomix` to analyze

2. **Optimize search**:
   ```bash
   # Instead of broad search
   /scout search_term

   # Be more specific
   /scout find UserService usage in components
   ```

3. **Use smaller batches**:
   - /plan one feature at a time
   - /cook single file changes
   - /test specific test suite

4. **Check system resources**:
   ```bash
   # Monitor CPU and memory
   top
   # Kill background processes if needed
   ```

**Permanent Solution**:
- Break large features into phases
- Use modular file organization
- Archive old plans regularly

---

## Git & Commit Issues

### Commit Rejected for Secrets

**Symptom**: `/git:commit` fails with "Secret detected"

**Root Causes**:
- API key in file
- Password in code
- Credentials in config
- Private key accidentally added

**Troubleshooting Steps**:

1. **Find the secret**:
   - Check `/git:status` output
   - Look for API keys, tokens, passwords
   - Review recent changes

2. **Remove secret**:
   ```bash
   # Edit file to remove secret
   vim src/config.ts
   # Replace with environment variable instead
   ```

3. **Use environment variable**:
   ```javascript
   const apiKey = process.env.API_KEY;
   // Instead of: const apiKey = "sk_live_...";
   ```

4. **Add to .gitignore**:
   ```bash
   .env
   .env.local
   secrets.json
   *.pem
   ```

5. **Re-commit**:
   ```bash
   /git:commit
   # Should succeed now
   ```

**Permanent Solution**:
- Always use environment variables for secrets
- Add secret patterns to .gitignore
- Run security scan: `npm audit`

---

### Force Push to Main

**Symptom**: Trying `/git:push --force` to main branch

**Root Causes**:
- Misunderstanding git workflow
- Trying to fix mistake
- Rebasing main accidentally

**Troubleshooting Steps**:

1. **Never force push main**:
   - Main branch is protected
   - Rewrite history would destroy commits
   - Use revert or new commit instead

2. **Fix locally first**:
   ```bash
   # Create new branch with fix
   git checkout -b fix/issue
   # Make changes
   git commit -am "Fix issue"
   # Push new branch, make PR
   ```

3. **If mistake already made**:
   - Contact repository admin
   - Request restore from backup
   - Create new PR with proper changes

**Permanent Solution**:
- Use PR workflow for all changes
- Keep main stable and tested
- Use `git revert` instead of force push

---

## Environment & Configuration Issues

### .env Not Loading

**Symptom**: Environment variables undefined, app crashes

**Root Causes**:
- .env file not found
- Wrong directory
- Privacy block preventing read
- Framework not loading .env

**Troubleshooting Steps**:

1. **Verify .env exists**:
   ```bash
   ls -la .env
   # Should exist in project root
   ```

2. **Check privacy block**:
   ```bash
   # System may have blocked it
   # Try approval or read .env.example instead
   ```

3. **Load manually in code**:
   ```javascript
   // For Node.js
   require('dotenv').config();

   // For Next.js (automatic)
   // Just use process.env.VAR_NAME
   ```

4. **Verify format**:
   ```bash
   cat .env
   # Should be: KEY=value, one per line
   # Not: KEY: value (YAML)
   ```

**Permanent Solution**:
- Create .env in project root
- Use .env.example as template
- Add to .gitignore
- Load early in application startup

---

## Platform-Specific Issues

### iOS Build Failing

**Symptom**: `xcodebuild` fails or XcodeBuildMCP not available

**Root Causes**:
- Xcode not installed
- Wrong version
- Code signing issue
- Pod dependencies missing

**Troubleshooting Steps**:

1. **Check Xcode**:
   ```bash
   xcode-select --print-path
   # Should show Xcode path

   xcodebuild -version
   # Should show recent version
   ```

2. **Install Xcode if needed**:
   ```bash
   # Via App Store (recommended)
   # Or: xcode-select --install
   ```

3. **Check code signing**:
   ```bash
   # In Xcode: Signing & Capabilities
   # Ensure valid team selected
   ```

4. **Install pod dependencies**:
   ```bash
   cd ios
   pod install
   ```

5. **Test build**:
   ```bash
   /ios:cook build verification
   /ios:test --unit
   ```

---

### Android Build Failing

**Symptom**: `./gradlew build` fails

**Root Causes**:
- Android SDK missing
- Gradle cache corrupted
- Kotlin version mismatch
- Dependency not found

**Troubleshooting Steps**:

1. **Check Android SDK**:
   ```bash
   $ANDROID_HOME/tools/bin/sdkmanager --list
   # Should show installed packages
   ```

2. **Clean gradle cache**:
   ```bash
   ./gradlew clean
   ./gradlew build
   ```

3. **Update dependencies**:
   ```bash
   ./gradlew dependencies
   # Check for conflicts
   ```

---

## Getting Help

### When Troubleshooting Fails

**Resources**:
1. **Check logs**:
   ```bash
   # Agent execution logs
   cat plans/reports/*.md

   # System logs
   npm test -- --verbose
   ```

2. **Search documentation**:
   - Read [System Architecture](./system-architecture.md)
   - Check [Code Standards](./code-standards.md)
   - Review [Glossary](./glossary.md)

3. **Report issue**:
   - GitHub Issues: Include logs and steps to reproduce
   - Discussions: Ask community
   - Include environment info: `node -v`, `npm -v`, OS

4. **Provide context**:
   - What command were you running?
   - What was the exact error message?
   - What did you try to fix it?
   - What OS and versions?

---

**Created by**: Phuong Doan
**Last Updated**: 2026-02-05
**Version**: 0.1.0
