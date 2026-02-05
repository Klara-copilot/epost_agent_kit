# Claude Code Hooks System - Analysis Index

## Primary Report

**File:** `scout-260205-2250-hooks-system-analysis.md` (835 lines, 22KB)

Comprehensive analysis of the Claude Code hooks system covering:

### Contents

1. **Executive Summary** - Overview of 6 primary hooks and 3 security layers
2. **Hook Lifecycle & Events** - Session flow and hook trigger points
3. **Primary Hooks Deep Dive**
   - SessionStart (201 LOC) - Config loading and project detection
   - SubagentStart (167 LOC) - Subagent context injection
   - DevRulesReminder (52 LOC) - Dev rules per message
   - ScoutBlock (117 LOC + subsystem) - Directory access blocking
   - PrivacyBlock (145 LOC) - Sensitive file protection
   - Notifications - Multi-provider notification system
4. **Security Layers** - Scout blocking and privacy enforcement
5. **Core Library Utilities** - Reusable modules (ck-config-utils, project-detector, etc.)
6. **Notification System** - Telegram, Discord, Slack providers
7. **Configuration Hierarchy** - .ck.json, .ckignore, .env
8. **Integration with Claude Code** - Hook settings and environment variables
9. **Subdirectory Workflow Support** - Monorepo and workspace support (Issue #327)
10. **File Organization** - Complete directory tree (12,203 LOC across 54 files)
11. **Design Patterns** - Fail-open, modular reusability, env cascade
12. **Notable Implementation Details** - Session state vs. branch plans, naming patterns
13. **Security Considerations** - Privacy controls, access control, credential safety
14. **Performance Characteristics** - Hook overhead and context usage
15. **Testing & Validation** - How to test hooks locally
16. **Known Limitations** - Current constraints and future improvements
17. **Unresolved Questions** - Open items for investigation

---

## Quick Reference

### Hook Lifecycle

```
SessionStart → UserPromptSubmit → ToolCall (Scout/Privacy) 
→ SubagentStart → Stop/SubagentStop → Notifications
```

### Key Metrics

- **Total LOC:** 12,203 lines of code
- **Total Files:** 54 files
- **Context Overhead:** ~700 tokens per session
- **Hook Overhead:** 5-500ms depending on hook
- **Security Layers:** 3 (scout, privacy, build allowlist)
- **Notification Providers:** 3 (Telegram, Discord, Slack)

### Critical Files

| File | LOC | Purpose |
|------|-----|---------|
| `session-init.cjs` | 201 | Session initialization |
| `subagent-init.cjs` | 167 | Subagent context |
| `scout-block.cjs` | 117 | Directory blocking |
| `privacy-block.cjs` | 145 | Privacy enforcement |
| `project-detector.cjs` | 430 | Project detection |
| `context-builder.cjs` | 467 | Context building |
| `privacy-checker.cjs` | 297 | Privacy logic |
| `scout-checker.cjs` | 172 | Scout blocking facade |
| `notify.cjs` | 156 | Notification router |
| `vendor/ignore.cjs` | 850 | Gitignore parser |

### Configuration Files

- `.claude/.ck.json` - Project config (plan naming, paths, validation)
- `.claude/.ckignore` - Blocked patterns (node_modules, .git, etc.)
- `.claude/hooks/notifications/.env` - Notification credentials

### Security Patterns

1. **Scout Block** - Gitignore-spec pattern matching with build command allowlist
2. **Privacy Block** - Regex-based sensitive file detection with user approval
3. **Broad Pattern Detection** - Heuristic-based prevention of context-filling glob patterns

### Testing

```bash
# Scout blocking test
echo '{"tool_input":{"command":"ls node_modules"}}' | node .claude/hooks/scout-block.cjs

# Privacy blocking test
echo '{"tool_input":{"file_path":".env"},"tool_name":"Read"}' | node .claude/hooks/privacy-block.cjs

# Run full test suite
npm test -- .claude/hooks/
```

---

## Architecture Highlights

### Modular Design

- **Separated Concerns:** Hooks are thin wrappers around reusable `lib/` modules
- **Cross-Platform Support:** Libraries can be used by Claude hooks, OpenCode plugins, and future integrations
- **Fail-Open:** All hooks exit 0 on errors, preventing denial of service

### Security-First

- **Privacy Controls:** Blocks sensitive files (.env, credentials, keys) by default
- **Access Control:** Scout blocking prevents context overflow from heavy directories
- **User Approval:** Privacy block requires explicit `APPROVED:` prefix for sensitive files
- **Credential Safety:** No hardcoding; all credentials via environment variables

### Developer Experience

- **Session Context Injection:** Provides plan info, dev rules, and project status at each message
- **Automatic Project Detection:** Detects type (Node/Python/Go/Rust/Java), PM, framework
- **Monorepo Support:** Works with workspaces and subdirectories via CWD-based paths
- **Notification Alerts:** Optional Telegram/Discord/Slack notifications on session completion

---

## Key Insights

1. **Sophisticated Lifecycle Management** - 6 strategic hooks at critical session points
2. **Defense in Depth** - 3 security layers (scout, privacy, allowlist) for comprehensive protection
3. **Zero-Configuration Ready** - Sensible defaults work out of the box
4. **High Modularity** - Core logic in reusable libraries for cross-platform adoption
5. **Performance Optimized** - ~700 tokens overhead + ~10-500ms hook execution
6. **Transparent to Users** - Fail-open design ensures hooks never block productivity

---

## Related Documents

- Main hooks documentation: `.claude/hooks/docs/README.md`
- Notification setup guides: `.claude/hooks/notifications/docs/`
- Test documentation: `.claude/hooks/lib/__tests__/README.md`

---

**Index Generated:** 2026-02-05 22:54 UTC
**Report Status:** Complete
**Next Steps:** Review report for integration points, security considerations, and performance impact
