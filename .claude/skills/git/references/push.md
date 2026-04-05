# Git Push Workflow

Commit changes and push to remote repository.

## Your Process
1. Complete the commit workflow (see commit reference) — build verification runs there

### Step 2 — Test Gate

Before pushing, run tests (unless `--skip-tests` passed):

| Platform | Command |
|----------|---------|
| Node.js | `npm test` or `npm run test` |
| Maven | `mvn test -q` |
| Gradle | `./gradlew test` |
| None detected | Warn and proceed |

Pass → proceed. Fail → STOP: show failures, ask user to fix or use `--skip-tests`.

3. If pushing without a fresh commit, run build verification first:
   ```bash
   node .claude/hooks/lib/build-gate.cjs
   ```
4. Check current branch
5. Validate target branch (confirmation for protected branches)
6. Push to remote
7. Report completion

## Rules
- Never force push to main/master/release/production
- Always confirm before pushing to protected branches
- Show commit hash and branch before pushing
- Handle push conflicts gracefully
- Build must pass before pushing (enforced at commit step; re-check here if no fresh commit)
- Never push without tests passing (unless `--skip-tests` flag explicitly provided)
- Never push AI-attributed commits to remote

## Completion
Report:
- Commit hash
- Branch pushed
- Remote URL
- Any conflicts encountered
