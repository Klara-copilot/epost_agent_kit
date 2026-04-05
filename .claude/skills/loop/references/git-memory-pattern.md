# Git Memory Pattern

Loop uses git as persistent memory. This enables resumability, history, and safe rollback.

## Core Principle

**Every attempted change is committed — even if later reverted.**

This means:
- Interrupted loops can resume from the last commit
- Every attempt is auditable in git log
- `git revert` preserves the attempt history; `git reset` erases it

## Commit Before Verify (Non-Negotiable)

```
❌ Wrong order:
  1. Make change
  2. Verify
  3. If good → commit

✅ Correct order:
  1. Make change
  2. Commit
  3. Verify
  4. If bad → revert
```

Why: If the process is interrupted after verification but before commit, the improvement is lost. Committing first means the loop can always resume.

## Commit Message Convention

```
loop[{current}/{total}]: {atomic description}
```

Examples:
- `loop[1/10]: remove unused parseDate from utils.ts`
- `loop[3/10]: add branch coverage for empty array path in filterItems`
- `loop[7/10]: tree-shake lodash import in dateHelpers.ts`

The `[current/total]` prefix makes loop commits easy to identify and group.

## Revert vs Reset

| Command | Preserves history | Resumable | Safe for shared branches |
|---------|------------------|-----------|--------------------------|
| `git revert HEAD --no-edit` | Yes | Yes | Yes |
| `git reset --hard HEAD~1` | No | No | No |

**Always use `git revert`.**

Exception: if the loop is running on a throwaway branch and you need to clean up before merging, squash the loop commits after completing.

## Resumability Protocol

If the loop is interrupted (crash, timeout, user cancel):

1. Check `loop-results.tsv` for last logged iteration
2. Check `git log` for last `loop[n/N]:` commit
3. Resume from iteration `n+1`
4. Verify the current state matches the last KEEP entry before continuing

## Squashing Loop Commits (Post-Completion)

After a successful loop, the commit history contains many small commits. Before merging:

```bash
# Squash all loop commits into one
git rebase -i HEAD~{N}  # mark all loop commits as 'squash' or 'fixup'
# OR
git merge --squash {loop-branch}
```

Final commit message:
```
optimize[{metric}]: {description} ({baseline} → {final})
```

Example: `optimize[coverage]: improve branch coverage in auth module (67% → 84%)`
