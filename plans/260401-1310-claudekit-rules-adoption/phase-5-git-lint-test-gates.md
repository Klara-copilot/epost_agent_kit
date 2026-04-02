---
phase: 5
title: "git — Lint gate pre-commit + test gate pre-push + commit hygiene"
effort: 20m
depends: []
---

# Phase 5: Git Gates

## Files to Modify

- `packages/core/skills/git/references/commit.md`
- `packages/core/skills/git/references/push.md`

## Changes

### commit.md

**1. Add Step 6b — Lint gate** (after current step 6 build verification, before committing):

```markdown
**6b. Lint gate** (unless `--skip-build` passed):
Detect and run linter:
- Node.js: `npm run lint 2>/dev/null || npx eslint . 2>/dev/null`
- Java: `mvn checkstyle:check 2>/dev/null`
- Other: skip with warning

Exit 0 → proceed. Exit 1 → show violations, ask user to fix or override.
```

**2. Add to Rules section** (after "Never commit sensitive files"):
```
- Never commit files containing secrets — check for: `sk-`, `Bearer `, `password =`, `API_KEY=`
- No AI attribution in commit messages ("Generated with Claude Code", "Co-authored by Claude")
- Run lint before committing (step 6b above)
```

---

### push.md

**1. Add test gate** before push (new step 2, renumber subsequent):

```markdown
### Step 2 — Test Gate

Before pushing, run tests (unless `--skip-tests` passed):

| Platform | Command |
|----------|---------|
| Node.js | `npm test` or `npm run test` |
| Maven | `mvn test -q` |
| Gradle | `./gradlew test` |
| None detected | Warn and proceed |

Pass → proceed. Fail → STOP: show failures, ask user to fix or use `--skip-tests`.
```

**2. Add to Rules section**:
```
- Never push without tests passing (unless `--skip-tests` flag explicitly provided)
- Never push AI-attributed commits to remote
```

## Todo

- [ ] Read commit.md fully before editing
- [ ] Add Step 6b lint gate after step 6
- [ ] Add 3 rules to Rules section in commit.md
- [ ] Read push.md fully before editing
- [ ] Add test gate as Step 2, renumber subsequent steps
- [ ] Add 2 rules to Rules section in push.md

## Success Criteria

- commit.md has Step 6b with lint detection
- commit.md Rules has AI attribution prohibition
- push.md has test gate step (Step 2)
- push.md Rules has `--skip-tests` override noted

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Lint gate blocks Java builds (no eslint) | Medium | Platform detection with silent skip |
| Test gate adds significant time to push | Medium | `--skip-tests` flag always available |
| Step renumbering in push.md breaks cross-references | Low | Grep for any step number references before renaming |

## Security Considerations

- The lint/test gates help prevent accidentally pushing insecure code patterns
- AI attribution check prevents leaking workflow metadata to public repos
